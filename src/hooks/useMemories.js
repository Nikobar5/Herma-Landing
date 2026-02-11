import { useState, useCallback } from 'react';
import {
  getMemories,
  getMemoryStats,
  createMemory,
  updateMemory,
  deleteMemory,
  clearAllMemories,
} from '../services/hermaApi';

export default function useMemories() {
  const [memories, setMemories] = useState([]);
  const [stats, setStats] = useState({ total_memories: 0, by_category: {} });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMemories = useCallback(async (category) => {
    setLoading(true);
    setError(null);
    try {
      const [mems, st] = await Promise.all([
        getMemories(category),
        getMemoryStats(),
      ]);
      setMemories(mems);
      setStats(st);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addMemory = useCallback(async (content, category = 'general') => {
    const mem = await createMemory({ content, category });
    setMemories((prev) => [mem, ...prev]);
    setStats((prev) => ({
      total_memories: prev.total_memories + 1,
      by_category: {
        ...prev.by_category,
        [category]: (prev.by_category[category] || 0) + 1,
      },
    }));
    return mem;
  }, []);

  const editMemory = useCallback(async (id, content, category) => {
    const updated = await updateMemory(id, { content, category });
    setMemories((prev) => prev.map((m) => (m.id === id ? updated : m)));
    return updated;
  }, []);

  const removeMemory = useCallback(async (id) => {
    await deleteMemory(id);
    setMemories((prev) => {
      const removed = prev.find((m) => m.id === id);
      if (removed) {
        setStats((s) => ({
          total_memories: s.total_memories - 1,
          by_category: {
            ...s.by_category,
            [removed.category]: Math.max(0, (s.by_category[removed.category] || 1) - 1),
          },
        }));
      }
      return prev.filter((m) => m.id !== id);
    });
  }, []);

  const clearAll = useCallback(async () => {
    await clearAllMemories();
    setMemories([]);
    setStats({ total_memories: 0, by_category: {} });
  }, []);

  return {
    memories,
    stats,
    loading,
    error,
    fetchMemories,
    addMemory,
    editMemory,
    removeMemory,
    clearAll,
  };
}

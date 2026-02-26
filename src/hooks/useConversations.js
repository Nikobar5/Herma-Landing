import { useState, useCallback, useEffect, useRef } from 'react';
import {
  createConversation as apiCreateConversation,
  getConversations as apiGetConversations,
  getConversation as apiGetConversation,
  updateConversationTitle as apiUpdateConversationTitle,
  deleteConversation as apiDeleteConversation,
} from '../services/hermaApi';

function titleFromContent(content) {
  const text = typeof content === 'string'
    ? content
    : Array.isArray(content)
      ? (content.find(b => b.type === 'text')?.text || 'New chat')
      : 'New chat';
  const trimmed = text.trim().slice(0, 60);
  return trimmed.length < text.trim().length ? trimmed + '…' : trimmed;
}

const CACHE_KEY = 'herma_conversations_cache';

function readCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return [];
    return JSON.parse(raw).map((c) => ({ ...c, messages: [], _loaded: false }));
  } catch {
    return [];
  }
}

function writeCache(convs) {
  try {
    // Store only lightweight list data (no messages)
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(
      convs.map(({ id, title, created_at, updated_at }) => ({ id, title, created_at, updated_at }))
    ));
  } catch {}
}

export function useConversations() {
  const [conversations, setConversations] = useState(readCache);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  // Fetch conversation list from server on mount
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    apiGetConversations(50, 0)
      .then((convs) => {
        // Server returns {id, title, created_at, updated_at} — add empty messages array for local state
        const mapped = convs.map((c) => ({
          ...c,
          messages: [],
          _loaded: false,
        }));
        setConversations(mapped);
        writeCache(mapped);
      })
      .catch(() => {
        // Fail silently — cached conversations still shown
      })
      .finally(() => setLoading(false));
  }, []);

  // Keep cache in sync whenever conversation list changes
  useEffect(() => {
    if (conversations.length > 0) writeCache(conversations);
  }, [conversations]);

  const activeConversation = conversations.find((c) => c.id === activeId) || null;

  const createConversation = useCallback(async () => {
    // If the active conversation is already empty, reuse it
    const current = conversations.find((c) => c.id === activeId);
    if (current && current.messages.length === 0) {
      return current;
    }

    try {
      const serverConv = await apiCreateConversation('New chat');
      const conv = {
        id: serverConv.id,
        title: serverConv.title,
        messages: [],
        created_at: serverConv.created_at,
        updated_at: serverConv.updated_at,
        _loaded: true,
      };
      setConversations((prev) => [conv, ...prev]);
      setActiveId(conv.id);
      return conv;
    } catch {
      // Fallback: create local-only conversation (shouldn't happen in normal flow)
      const conv = {
        id: 'local-' + Date.now().toString(36),
        title: 'New chat',
        messages: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        _loaded: true,
      };
      setConversations((prev) => [conv, ...prev]);
      setActiveId(conv.id);
      return conv;
    }
  }, [conversations, activeId]);

  const loadConversation = useCallback(async (id) => {
    setActiveId(id);

    // Check if already loaded
    const existing = conversations.find((c) => c.id === id);
    if (existing && existing._loaded) return;

    try {
      const full = await apiGetConversation(id);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, messages: full.messages || [], _loaded: true }
            : c
        )
      );
    } catch {
      // Mark as loaded even on error to avoid repeated fetches
      setConversations((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, _loaded: true } : c
        )
      );
    }
  }, [conversations]);

  const deleteConversation = useCallback(
    async (id) => {
      // Optimistically remove from local state
      setConversations((prev) => prev.filter((c) => c.id !== id));
      setActiveId((prevId) => {
        if (prevId !== id) return prevId;
        const remaining = conversations.filter((c) => c.id !== id);
        return remaining.length > 0 ? remaining[0].id : null;
      });

      // Delete on server (fire-and-forget)
      try {
        await apiDeleteConversation(id);
      } catch {
        // Already removed locally — no rollback needed
      }
    },
    [conversations]
  );

  const renameConversation = useCallback(
    async (id, title) => {
      // Optimistically update local state
      setConversations((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, title, updated_at: new Date().toISOString() } : c
        )
      );

      // Update on server (fire-and-forget)
      try {
        await apiUpdateConversationTitle(id, title);
      } catch {
        // Keep local state — title still shown
      }
    },
    []
  );

  const addMessage = useCallback(
    (conversationId, message) => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== conversationId) return c;
          const messages = [...c.messages, message];
          // Auto-title on first user message
          const title =
            c.messages.length === 0 && message.role === 'user'
              ? titleFromContent(message.displayText || message.content)
              : c.title;
          const updated = { ...c, messages, title, updated_at: new Date().toISOString() };

          // If we auto-titled, push to server
          if (title !== c.title) {
            apiUpdateConversationTitle(conversationId, title).catch(() => {});
          }

          return updated;
        })
      );
    },
    []
  );

  const updateLastMessage = useCallback(
    (conversationId, updater) => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== conversationId || c.messages.length === 0) return c;
          const messages = [...c.messages];
          const last = { ...messages[messages.length - 1] };
          if (typeof updater === 'function') {
            Object.assign(last, updater(last));
          } else {
            Object.assign(last, updater);
          }
          messages[messages.length - 1] = last;
          return { ...c, messages, updated_at: new Date().toISOString() };
        })
      );
    },
    []
  );

  const removeLastMessage = useCallback(
    (conversationId) => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== conversationId || c.messages.length === 0) return c;
          return {
            ...c,
            messages: c.messages.slice(0, -1),
            updated_at: new Date().toISOString(),
          };
        })
      );
    },
    []
  );

  return {
    conversations,
    activeConversation,
    activeId,
    setActiveId: loadConversation,
    createConversation,
    deleteConversation,
    renameConversation,
    addMessage,
    updateLastMessage,
    removeLastMessage,
    loading,
  };
}

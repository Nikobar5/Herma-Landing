import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useMemories from '../hooks/useMemories';

const CATEGORIES = [
  { key: null, label: 'All' },
  { key: 'preference', label: 'Preferences' },
  { key: 'personal', label: 'Personal' },
  { key: 'work', label: 'Work' },
  { key: 'instruction', label: 'Instructions' },
  { key: 'general', label: 'General' },
];

const CATEGORY_COLORS = {
  preference: { bg: 'rgba(99,102,241,0.15)', text: '#818cf8' },
  personal: { bg: 'rgba(236,72,153,0.15)', text: '#f472b6' },
  work: { bg: 'rgba(34,197,94,0.15)', text: '#4ade80' },
  instruction: { bg: 'rgba(251,146,60,0.15)', text: '#fb923c' },
  general: { bg: 'rgba(148,163,184,0.15)', text: '#94a3b8' },
};

export default function MemoryPage() {
  const navigate = useNavigate();
  const {
    memories, stats, loading, error,
    fetchMemories, addMemory, editMemory, removeMemory, clearAll,
  } = useMemories();

  const [activeCategory, setActiveCategory] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('general');
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState('');

  useEffect(() => {
    fetchMemories(activeCategory);
  }, [fetchMemories, activeCategory]);

  const handleAdd = async () => {
    if (!newContent.trim()) return;
    try {
      await addMemory(newContent.trim(), newCategory);
      setNewContent('');
      setNewCategory('general');
      setShowAdd(false);
    } catch {}
  };

  const handleEdit = async (id) => {
    if (!editContent.trim()) return;
    try {
      await editMemory(id, editContent.trim(), editCategory || undefined);
      setEditingId(null);
    } catch {}
  };

  const handleClearAll = async () => {
    if (!window.confirm('Delete all memories? This cannot be undone.')) return;
    await clearAll();
  };

  const startEdit = (mem) => {
    setEditingId(mem.id);
    setEditContent(mem.content);
    setEditCategory(mem.category);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-ui)',
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '16px 24px',
        borderBottom: '1px solid var(--border-primary)',
        background: 'var(--bg-secondary)',
      }}>
        <button
          onClick={() => navigate('/chat')}
          style={{
            background: 'none', border: 'none', color: 'var(--text-secondary)',
            cursor: 'pointer', padding: 4, display: 'flex',
          }}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 600, margin: 0, flex: 1 }}>
          Memory
        </h1>
        <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
          {stats.total_memories} {stats.total_memories === 1 ? 'memory' : 'memories'}
        </span>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px' }}>
        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowAdd(true)}
            style={{
              padding: '8px 16px', borderRadius: 8,
              background: 'var(--accent-primary)', color: 'var(--text-inverse)',
              border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
              fontFamily: 'var(--font-ui)',
            }}
          >
            + Add Memory
          </button>
          {stats.total_memories > 0 && (
            <button
              onClick={handleClearAll}
              style={{
                padding: '8px 16px', borderRadius: 8,
                background: 'transparent', color: 'var(--error, #ef4444)',
                border: '1px solid var(--error, #ef4444)', cursor: 'pointer',
                fontSize: 13, fontWeight: 500, fontFamily: 'var(--font-ui)',
              }}
            >
              Clear All
            </button>
          )}
        </div>

        {/* Add form */}
        {showAdd && (
          <div style={{
            padding: 16, borderRadius: 12, marginBottom: 20,
            background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)',
          }}>
            <textarea
              autoFocus
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Enter a memory, e.g. 'I prefer Python over JavaScript'"
              rows={2}
              style={{
                width: '100%', background: 'var(--bg-input, var(--bg-primary))',
                color: 'var(--text-primary)', border: '1px solid var(--border-primary)',
                borderRadius: 8, padding: '10px 12px', fontSize: 14, resize: 'vertical',
                fontFamily: 'var(--font-ui)', outline: 'none', boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                style={{
                  padding: '6px 10px', borderRadius: 6,
                  background: 'var(--bg-input, var(--bg-primary))', color: 'var(--text-primary)',
                  border: '1px solid var(--border-primary)', fontSize: 13,
                  fontFamily: 'var(--font-ui)', outline: 'none',
                }}
              >
                <option value="general">General</option>
                <option value="preference">Preference</option>
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="instruction">Instruction</option>
              </select>
              <div style={{ flex: 1 }} />
              <button
                onClick={() => { setShowAdd(false); setNewContent(''); }}
                style={{
                  padding: '6px 14px', borderRadius: 6, background: 'transparent',
                  color: 'var(--text-secondary)', border: '1px solid var(--border-primary)',
                  cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-ui)',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={!newContent.trim()}
                style={{
                  padding: '6px 14px', borderRadius: 6,
                  background: newContent.trim() ? 'var(--accent-primary)' : 'var(--bg-hover)',
                  color: newContent.trim() ? 'var(--text-inverse)' : 'var(--text-tertiary)',
                  border: 'none', cursor: newContent.trim() ? 'pointer' : 'default',
                  fontSize: 13, fontFamily: 'var(--font-ui)',
                }}
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* Category tabs */}
        <div style={{
          display: 'flex', gap: 4, marginBottom: 20, overflowX: 'auto',
          paddingBottom: 4,
        }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key || 'all'}
              onClick={() => setActiveCategory(cat.key)}
              style={{
                padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500,
                border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                fontFamily: 'var(--font-ui)',
                background: activeCategory === cat.key ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                color: activeCategory === cat.key ? 'var(--text-inverse)' : 'var(--text-secondary)',
              }}
            >
              {cat.label}
              {cat.key && stats.by_category?.[cat.key] ? ` (${stats.by_category[cat.key]})` : ''}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding: '10px 14px', borderRadius: 8, marginBottom: 16,
            background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontSize: 13,
          }}>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-tertiary)' }}>
            Loading memories...
          </div>
        )}

        {/* Memory list */}
        {!loading && memories.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '60px 20px',
            color: 'var(--text-tertiary)', fontSize: 14,
          }}>
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor"
              style={{ margin: '0 auto 16px', opacity: 0.4 }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p style={{ margin: 0, fontWeight: 500 }}>No memories yet</p>
            <p style={{ margin: '8px 0 0', fontSize: 13 }}>
              Start chatting and Herma will learn about you.
            </p>
          </div>
        )}

        {!loading && memories.map((mem) => {
          const colors = CATEGORY_COLORS[mem.category] || CATEGORY_COLORS.general;

          if (editingId === mem.id) {
            return (
              <div key={mem.id} style={{
                padding: 14, borderRadius: 10, marginBottom: 8,
                background: 'var(--bg-secondary)', border: '1px solid var(--accent-primary)',
              }}>
                <textarea
                  autoFocus
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={2}
                  style={{
                    width: '100%', background: 'var(--bg-input, var(--bg-primary))',
                    color: 'var(--text-primary)', border: '1px solid var(--border-primary)',
                    borderRadius: 8, padding: '8px 10px', fontSize: 14, resize: 'vertical',
                    fontFamily: 'var(--font-ui)', outline: 'none', boxSizing: 'border-box',
                  }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    style={{
                      padding: '4px 8px', borderRadius: 6,
                      background: 'var(--bg-input, var(--bg-primary))', color: 'var(--text-primary)',
                      border: '1px solid var(--border-primary)', fontSize: 12,
                      fontFamily: 'var(--font-ui)', outline: 'none',
                    }}
                  >
                    <option value="general">General</option>
                    <option value="preference">Preference</option>
                    <option value="personal">Personal</option>
                    <option value="work">Work</option>
                    <option value="instruction">Instruction</option>
                  </select>
                  <div style={{ flex: 1 }} />
                  <button
                    onClick={() => setEditingId(null)}
                    style={{
                      padding: '4px 12px', borderRadius: 6, background: 'transparent',
                      color: 'var(--text-secondary)', border: '1px solid var(--border-primary)',
                      cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-ui)',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleEdit(mem.id)}
                    style={{
                      padding: '4px 12px', borderRadius: 6,
                      background: 'var(--accent-primary)', color: 'var(--text-inverse)',
                      border: 'none', cursor: 'pointer', fontSize: 12,
                      fontFamily: 'var(--font-ui)',
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={mem.id}
              className="group"
              style={{
                padding: '12px 14px', borderRadius: 10, marginBottom: 8,
                background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)',
                display: 'flex', alignItems: 'flex-start', gap: 10,
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-hover, var(--border-primary))'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-primary)'}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>{mem.content}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                  <span style={{
                    display: 'inline-block', padding: '2px 8px', borderRadius: 10,
                    fontSize: 11, fontWeight: 500,
                    background: colors.bg, color: colors.text,
                  }}>
                    {mem.category}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                    {new Date(mem.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 2, opacity: 0, transition: 'opacity 0.15s' }}
                className="memory-actions">
                <button
                  onClick={() => startEdit(mem)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-tertiary)', padding: 4,
                  }}
                  title="Edit"
                >
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  onClick={() => removeMemory(mem.id)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-tertiary)', padding: 4,
                  }}
                  title="Delete"
                >
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .group:hover .memory-actions { opacity: 1 !important; }
      `}</style>
    </div>
  );
}

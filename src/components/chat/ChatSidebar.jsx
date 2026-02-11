import React, { useState } from 'react';
import BalanceBadge from './BalanceBadge';

const ChatSidebar = ({
  conversations,
  activeId,
  onSelect,
  onNew,
  onRename,
  onDelete,
  balance,
  chatFreeCredit,
  subscription,
  isOpen,
  onClose,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const startRename = (conv) => {
    setEditingId(conv.id);
    setEditValue(conv.title);
  };

  const commitRename = () => {
    if (editingId && editValue.trim()) {
      onRename(editingId, editValue.trim());
    }
    setEditingId(null);
    setEditValue('');
  };

  const sidebar = (
    <div className="flex flex-col h-full bg-[var(--bg-secondary)] border-r border-[var(--border-primary)] relative overflow-hidden">
      {/* New Chat Button Area */}
      <div className="p-4">
        <button
          onClick={() => {
            onNew();
            onClose?.();
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-[var(--accent-primary)] text-[var(--text-inverse)] text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors shadow-sm"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Chat</span>
        </button>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-0.5 scrollbar-thin scrollbar-thumb-[var(--bg-hover)] scrollbar-track-transparent">
        <div className="px-4 py-2 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mt-2 mb-1" style={{ fontFamily: 'var(--font-ui)' }}>
          Recent
        </div>

        {conversations.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-[var(--text-tertiary)] italic" style={{ fontFamily: 'var(--font-ui)' }}>
            No conversations yet
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className={`group flex items-center rounded-md cursor-pointer transition-colors ${conv.id === activeId
                ? 'bg-[var(--accent-muted)] text-[var(--accent-primary)]'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                }`}
            >
              {editingId === conv.id ? (
                <div className="flex items-center w-full px-2 py-1.5">
                  <input
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={commitRename}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commitRename();
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    className="flex-1 bg-[var(--bg-input)] text-[var(--text-primary)] text-sm px-2 py-1.5 rounded border border-[var(--accent-primary)] outline-none"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  />
                </div>
              ) : (
                <>
                  <button
                    onClick={() => {
                      onSelect(conv.id);
                      onClose?.();
                    }}
                    className="flex-1 text-left px-4 py-2.5 text-sm truncate flex items-center gap-3 font-medium"
                    style={{ fontFamily: 'var(--font-ui)' }}
                    title={conv.title}
                  >
                    <svg className="w-4 h-4 flex-shrink-0 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <span className="truncate">{conv.title}</span>
                  </button>
                  <div className="hidden group-hover:flex items-center gap-1 pr-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startRename(conv);
                      }}
                      className="p-1 rounded text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                      aria-label="Rename"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Delete this conversation?')) {
                          onDelete(conv.id);
                        }
                      }}
                      className="p-1 rounded text-[var(--text-tertiary)] hover:text-[var(--error)] hover:bg-[var(--error)]/10 transition-colors"
                      aria-label="Delete"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Balance */}
      <div className="border-t border-[var(--border-primary)] p-4">
        <BalanceBadge balance={balance} chatFreeCredit={chatFreeCredit} subscription={subscription} />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex w-64 flex-shrink-0 h-full z-20">
        {sidebar}
      </div>

      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-[85vw] max-w-[300px] h-full shadow-2xl animate-slide-in-right" style={{ animationName: 'slide-in-from-left' }}>
            {sidebar}
          </div>
          <div className="flex-1 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in-from-left {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
};

export default ChatSidebar;

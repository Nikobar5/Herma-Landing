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
    <div className="flex flex-col h-full bg-[var(--bg-secondary)] text-[var(--text-primary)] border-r border-[var(--border-primary)]">
      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={() => {
            onNew();
            onClose?.();
          }}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[var(--bg-hover)] hover:bg-[var(--bg-active)] transition-colors text-sm font-medium text-[var(--text-primary)]"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New chat
        </button>
      </div>

      {/* Section label */}
      <div className="px-4 py-1.5">
        <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-tertiary)]" style={{ fontFamily: 'var(--font-ui)' }}>
          Recent
        </span>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`group flex items-center rounded-lg cursor-pointer transition-all ${
              conv.id === activeId ? 'bg-[var(--bg-active)]' : 'hover:bg-[var(--bg-hover)]'
            }`}
          >
            {editingId === conv.id ? (
              <input
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={commitRename}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitRename();
                  if (e.key === 'Escape') setEditingId(null);
                }}
                className="flex-1 bg-[var(--bg-tertiary)] text-[var(--text-primary)] text-sm px-3 py-2 rounded-lg outline-none border border-[var(--border-secondary)]"
                style={{ fontFamily: 'var(--font-body)' }}
              />
            ) : (
              <>
                <button
                  onClick={() => {
                    onSelect(conv.id);
                    onClose?.();
                  }}
                  className="flex-1 text-left px-3 py-2.5 text-sm truncate text-[var(--text-secondary)]"
                  style={{ fontFamily: 'var(--font-body)' }}
                  title={conv.title}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 flex-shrink-0 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <span className="truncate">{conv.title}</span>
                  </div>
                </button>
                <div className="hidden group-hover:flex items-center gap-0.5 pr-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startRename(conv);
                    }}
                    className="p-1.5 rounded-md hover:bg-[var(--bg-active)] transition-colors text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                    aria-label="Rename"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(conv.id);
                    }}
                    className="p-1.5 rounded-md hover:bg-[var(--error)]/20 transition-colors text-[var(--text-tertiary)] hover:text-[var(--error)]"
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
        ))}
      </div>

      {/* Balance */}
      <BalanceBadge balance={balance} chatFreeCredit={chatFreeCredit} subscription={subscription} />
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex w-72 flex-shrink-0 h-full">
        {sidebar}
      </div>

      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-72 h-full shadow-xl">
            {sidebar}
          </div>
          <div className="flex-1 bg-black/40" onClick={onClose} />
        </div>
      )}
    </>
  );
};

export default ChatSidebar;

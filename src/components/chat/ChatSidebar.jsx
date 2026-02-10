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
    <div className="flex flex-col h-full bg-[var(--primary-bg)] text-white">
      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={() => {
            onNew();
            onClose?.();
          }}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-white/20 hover:bg-white/10 transition-colors text-sm"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New chat
        </button>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`group flex items-center rounded-lg cursor-pointer transition-colors ${
              conv.id === activeId ? 'bg-white/15' : 'hover:bg-white/10'
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
                className="flex-1 bg-white/10 text-white text-sm px-3 py-2 rounded-lg outline-none"
                style={{ fontFamily: 'var(--font-body)' }}
              />
            ) : (
              <>
                <button
                  onClick={() => {
                    onSelect(conv.id);
                    onClose?.();
                  }}
                  className="flex-1 text-left px-3 py-2 text-sm truncate"
                  style={{ fontFamily: 'var(--font-body)' }}
                  title={conv.title}
                >
                  {conv.title}
                </button>
                <div className="hidden group-hover:flex items-center gap-0.5 pr-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startRename(conv);
                    }}
                    className="p-1 rounded hover:bg-white/20 transition-colors"
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
                    className="p-1 rounded hover:bg-red-500/50 transition-colors"
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
          <div className="flex-1 bg-black/30" onClick={onClose} />
        </div>
      )}
    </>
  );
};

export default ChatSidebar;

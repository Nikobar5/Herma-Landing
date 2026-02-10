import React, { useState, useRef, useEffect } from 'react';

const ChatInput = ({ onSend, onStop, isStreaming, hasMessages }) => {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 200) + 'px';
    }
  }, [value]);

  const handleSubmit = () => {
    if (!value.trim() || isStreaming) return;
    onSend(value);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex-shrink-0 bg-[var(--bg-primary)] pt-2 pb-3">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-end gap-2 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-secondary)] shadow-md px-4 py-2.5 focus-within:border-[var(--accent-primary)]/40 focus-within:shadow-lg transition-all">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={hasMessages ? "Ask a follow-up..." : "Ask anything..."}
            rows={1}
            className="flex-1 resize-none bg-transparent outline-none text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)]"
            style={{ fontFamily: 'var(--font-body)', maxHeight: '200px' }}
          />
          {isStreaming ? (
            <button
              onClick={onStop}
              className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--error)] text-white flex items-center justify-center hover:opacity-90 transition-colors"
              aria-label="Stop generating"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!value.trim()}
              className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--accent-primary)] text-[var(--text-inverse)] flex items-center justify-center hover:bg-[var(--accent-hover)] transition-all disabled:opacity-20 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
              </svg>
            </button>
          )}
        </div>
        <p className="text-[10px] text-[var(--text-tertiary)] text-center mt-2" style={{ fontFamily: 'var(--font-ui)' }}>
          Herma can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
};

export default ChatInput;

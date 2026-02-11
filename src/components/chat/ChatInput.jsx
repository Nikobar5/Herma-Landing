import React, { useState, useRef, useEffect } from 'react';

const ChatInput = ({ onSend, onStop, isStreaming }) => {
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
    <div className="border-t border-[var(--border-primary)] bg-[var(--bg-secondary)]/60 backdrop-blur-md pt-4 pb-6 absolute bottom-0 left-0 right-0 z-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative flex items-end gap-2 bg-[var(--bg-tertiary)]/80 backdrop-blur-sm rounded-2xl border border-[var(--border-secondary)] shadow-lg px-4 py-3 focus-within:border-[var(--accent-primary)] focus-within:ring-2 focus-within:ring-[var(--accent-primary)]/10 transition-all">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a message..."
            rows={1}
            className="flex-1 resize-none bg-transparent outline-none text-base text-[var(--text-primary)] placeholder-[var(--text-tertiary)] py-1"
            style={{ fontFamily: 'var(--font-ui)', maxHeight: '200px' }}
          />
          {isStreaming ? (
            <button
              onClick={onStop}
              className="flex-shrink-0 w-10 h-10 rounded-xl bg-[var(--error)] text-white flex items-center justify-center hover:bg-opacity-90 transition-colors shadow-md hover:shadow-lg transform active:scale-95"
              aria-label="Stop generating"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="1" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!value.trim()}
              className="flex-shrink-0 w-10 h-10 rounded-xl bg-[var(--accent-primary)] text-white flex items-center justify-center hover:bg-[var(--accent-hover)] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform active:scale-95"
              aria-label="Send message"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
        <p className="text-[11px] text-[var(--text-tertiary)] text-center mt-3 font-medium opacity-70" style={{ fontFamily: 'var(--font-ui)' }}>
          Herma can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
};

export default ChatInput;

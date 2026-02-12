import React, { useState, useRef, useEffect } from 'react';

const ChatInput = ({ onSend, onStop, isStreaming, webSearch, setWebSearch }) => {
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
    onSend(value, { webSearch });
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
          <button
            onClick={() => setWebSearch(!webSearch)}
            className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              webSearch
                ? 'bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] ring-1 ring-[var(--accent-primary)]/30'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
            }`}
            aria-label="Toggle web search"
            title={webSearch ? 'Web search on' : 'Web search off'}
            type="button"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A8.966 8.966 0 013 12c0-1.777.514-3.434 1.4-4.83" />
            </svg>
          </button>
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

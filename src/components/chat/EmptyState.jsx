import React, { useState, useRef, useEffect } from 'react';

const capabilities = [
  {
    label: 'Privacy routing',
    text: 'How does Herma route sensitive data to private models?',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    label: 'Cost savings',
    text: 'How much can I save by routing non-sensitive requests to public models?',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'Compare models',
    text: 'What are the differences between GPT-4, Claude, and Gemini?',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    label: 'Write code',
    text: 'Write a Python script that calls the Herma API with streaming',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
  },
];

const EmptyState = ({ onSend, isStreaming, onStop }) => {
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
    <div className="flex-1 flex flex-col items-center justify-center px-4 bg-[var(--bg-primary)] overflow-auto">
      <div className="w-full max-w-2xl flex flex-col items-center">
        {/* Big Greeting */}
        <h1
          className="text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-8 text-center"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          What can I help you with?
        </h1>

        {/* Large Input Area */}
        <div className="w-full rounded-2xl border border-[var(--border-secondary)] bg-[var(--bg-tertiary)]/80 backdrop-blur-sm shadow-lg focus-within:border-[var(--accent-primary)] focus-within:ring-2 focus-within:ring-[var(--accent-primary)]/10 transition-all">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="How can I help you today?"
            rows={3}
            className="w-full resize-none bg-transparent outline-none text-base text-[var(--text-primary)] placeholder-[var(--text-tertiary)] p-4 pb-2"
            style={{ fontFamily: 'var(--font-ui)', maxHeight: '200px' }}
            autoFocus
          />
          <div className="flex items-center justify-end px-3 pb-3">
            {isStreaming ? (
              <button
                onClick={onStop}
                className="w-9 h-9 rounded-xl bg-[var(--error)] text-white flex items-center justify-center hover:bg-opacity-90 transition-colors shadow-md"
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
                className="w-9 h-9 rounded-xl bg-[var(--accent-primary)] text-white flex items-center justify-center hover:bg-[var(--accent-hover)] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-md"
                aria-label="Send message"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Capability chips */}
        <div className="flex flex-wrap gap-2 mt-5 justify-center">
          {capabilities.map((cap) => (
            <button
              key={cap.label}
              onClick={() => onSend(cap.text)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[var(--border-secondary)] bg-[var(--bg-secondary)] text-sm text-[var(--text-secondary)] hover:border-[var(--border-accent)] hover:text-[var(--text-primary)] hover:shadow-sm transition-all"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              <span className="text-[var(--accent-primary)]">{cap.icon}</span>
              {cap.label}
            </button>
          ))}
        </div>

        {/* Disclaimer */}
        <p
          className="text-[11px] text-[var(--text-tertiary)] text-center mt-8 opacity-70"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          Herma can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
};

export default EmptyState;

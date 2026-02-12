import React from 'react';

const ScrollToBottom = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-9 h-9 rounded-full bg-[var(--bg-secondary)] shadow-lg border border-[var(--border-secondary)] flex items-center justify-center hover:bg-[var(--bg-hover)] hover:shadow-xl transition-all"
      aria-label="Scroll to bottom"
    >
      <svg className="w-4 h-4 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </button>
  );
};

export default ScrollToBottom;

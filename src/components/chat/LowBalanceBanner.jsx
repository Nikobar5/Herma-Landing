import React, { useState } from 'react';

const LOW_BALANCE_THRESHOLD = 0.25;

const LowBalanceBanner = ({ balance }) => {
  const [dismissed, setDismissed] = useState(false);

  // Don't show if balance isn't loaded yet, is above threshold, or was dismissed
  if (balance == null || balance >= LOW_BALANCE_THRESHOLD || dismissed) {
    return null;
  }

  return (
    <div
      className="flex items-center justify-between px-4 py-2 text-sm flex-shrink-0"
      style={{
        background: 'rgba(251, 191, 36, 0.08)',
        borderBottom: '1px solid rgba(251, 191, 36, 0.15)',
        fontFamily: 'var(--font-ui)',
        animation: 'lowBalanceFadeIn 0.3s ease-out',
      }}
    >
      <div className="flex items-center gap-2 min-w-0">
        {/* Warning icon */}
        <svg
          className="w-4 h-4 flex-shrink-0"
          style={{ color: '#FBBF24' }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span style={{ color: 'var(--text-secondary)' }}>
          Running low on credits
          <span className="hidden sm:inline"> — add more to keep chatting</span>
        </span>
        <a
          href="/upgrade"
          className="ml-1 font-medium hover:underline"
          style={{ color: '#FBBF24' }}
        >
          Add Credits
        </a>
      </div>

      {/* Dismiss button */}
      <button
        onClick={() => setDismissed(true)}
        className="p-1 rounded hover:bg-[var(--bg-hover)] transition-colors flex-shrink-0 ml-2"
        aria-label="Dismiss low balance warning"
        style={{ color: 'var(--text-tertiary)' }}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <style>{`
        @keyframes lowBalanceFadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default LowBalanceBanner;

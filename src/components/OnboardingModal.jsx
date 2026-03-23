import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import FocusTrap from 'focus-trap-react';

const ONBOARDING_KEY = 'herma_onboarding_done';

const OnboardingModal = ({ isOpen, onClose, userName }) => {
  const navigate = useNavigate();

  const handleDismiss = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    onClose();
  }, [onClose]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === 'Escape') handleDismiss();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, handleDismiss]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) handleDismiss();
  };

  const handleStartChatting = () => {
    handleDismiss();
  };

  const handleGetApiKey = () => {
    handleDismiss();
    navigate('/dashboard/api-keys');
  };

  const firstName = userName?.split(' ')[0] || 'there';

  return (
    <FocusTrap focusTrapOptions={{ allowOutsideClick: true }}>
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={handleBackdropClick}
    >
      <div role="dialog" aria-modal="true" aria-labelledby="onboarding-title" className="bg-[var(--bg-secondary)] rounded-2xl shadow-xl border border-[var(--border-primary)] max-w-md w-full mx-4 p-8 relative animate-fade-in">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[var(--bg-hover)] transition-colors text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/herma-logo.png" alt="Herma" className="w-12 h-12 rounded-xl" />
        </div>

        {/* Welcome heading */}
        <h2
          id="onboarding-title"
          className="text-2xl font-bold text-[var(--text-primary)] text-center mb-2 tracking-tight"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Welcome, {firstName}!
        </h2>

        {/* Free credits callout */}
        <div className="mt-4 p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-center">
          <p
            className="text-sm font-medium text-emerald-400"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            You have <span className="text-lg font-bold">$1.00</span> in free credits to get started.
          </p>
        </div>

        {/* Explanation */}
        <p
          className="mt-4 text-sm text-[var(--text-secondary)] text-center leading-relaxed"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Herma routes your AI requests to the best model for each task
          &mdash; same quality, ~65% cheaper.
        </p>

        {/* Action buttons */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={handleStartChatting}
            className="w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90"
            style={{
              background: 'var(--accent-primary)',
              color: 'var(--text-inverse, #fff)',
              fontFamily: 'var(--font-ui)',
            }}
          >
            Start Chatting
          </button>
          <button
            onClick={handleGetApiKey}
            className="w-full py-3 px-4 rounded-xl font-semibold text-sm border transition-all duration-200 hover:opacity-90"
            style={{
              background: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              borderColor: 'var(--border-primary)',
              fontFamily: 'var(--font-ui)',
            }}
          >
            Get API Key
          </button>
        </div>

        {/* Docs link */}
        <p
          className="mt-5 text-center text-xs text-[var(--text-tertiary)]"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          Need help?{' '}
          <a
            href="/#/docs"
            className="text-[var(--accent-primary)] hover:underline"
          >
            Check our docs
          </a>
        </p>
      </div>
    </div>
    </FocusTrap>
  );
};

export default OnboardingModal;
export { ONBOARDING_KEY };

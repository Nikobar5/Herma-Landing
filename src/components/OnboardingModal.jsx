import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import FocusTrap from 'focus-trap-react';

const ONBOARDING_KEY = 'herma_onboarding_done';

const STEPS = [
  {
    title: "You're in!",
    description: "Herma routes every AI request to the cheapest model that matches frontier quality — automatically. No code changes needed.",
    cta: 'Next',
    secondary: null,
  },
  {
    title: 'Get your API key',
    description: 'Your API key is what you use to send requests through Herma. It takes 30 seconds to create one.',
    cta: 'Go to API Keys',
    secondary: 'Skip for now',
  },
  {
    title: 'Read the docs',
    description: 'Integration is just two lines of code — swap your base URL and API key. Compatible with the OpenAI SDK.',
    cta: 'View docs',
    secondary: "I'm done",
  },
];

const OnboardingModal = ({ isOpen, onClose, userName }) => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  // Reset to step 0 when modal opens
  useEffect(() => {
    if (isOpen) setStep(0);
  }, [isOpen]);

  const handleDismiss = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    onClose();
  };

  const handleCta = () => {
    if (step === 0) {
      setStep(1);
    } else if (step === 1) {
      handleDismiss();
      navigate('/dashboard/api-keys');
    } else {
      handleDismiss();
      navigate('/docs');
    }
  };

  const handleSecondary = () => {
    if (step === 1) {
      setStep(2);
    } else {
      handleDismiss();
    }
  };

  if (!isOpen) return null;

  const firstName = userName?.split(' ')[0] || 'there';
  const currentStep = STEPS[step];

  return createPortal(
    <FocusTrap focusTrapOptions={{ allowOutsideClick: false }}>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="onboarding-title"
          className="bg-[var(--bg-secondary)] rounded-2xl shadow-xl border border-[var(--border-primary)] max-w-md w-full mx-4 p-8 relative animate-fade-in"
        >
          {/* Logo */}
          <div className="flex justify-center mb-5">
            <img src="/herma-logo.png" alt="Herma" className="w-12 h-12 rounded-xl" />
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step
                    ? 'w-6 bg-[var(--accent-primary)]'
                    : i < step
                    ? 'w-4 bg-[var(--accent-primary)]/50'
                    : 'w-4 bg-[var(--border-primary)]'
                }`}
              />
            ))}
          </div>

          {/* Step 0: show welcome + free credit callout */}
          {step === 0 && (
            <div className="mt-2 mb-4 p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-center">
              <p className="text-sm font-medium text-[#5BAF8A]" style={{ fontFamily: 'var(--font-ui)' }}>
                Welcome, {firstName}! You have <span className="text-lg font-bold">$1.00</span> in free credits.
              </p>
            </div>
          )}

          {/* Title */}
          <h2
            id="onboarding-title"
            className="text-xl font-bold text-[var(--text-primary)] text-center mb-2 tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {currentStep.title}
          </h2>

          {/* Description */}
          <p
            className="text-sm text-[var(--text-secondary)] text-center leading-relaxed mb-6"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {currentStep.description}
          </p>

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleCta}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90"
              style={{
                background: 'var(--accent-primary)',
                color: 'var(--text-inverse, #fff)',
                fontFamily: 'var(--font-ui)',
              }}
            >
              {currentStep.cta}
            </button>
            {currentStep.secondary && (
              <button
                onClick={handleSecondary}
                className="w-full py-2.5 px-4 rounded-xl text-sm border transition-all duration-200 hover:opacity-80"
                style={{
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-secondary)',
                  borderColor: 'var(--border-primary)',
                  fontFamily: 'var(--font-ui)',
                }}
              >
                {currentStep.secondary}
              </button>
            )}
          </div>
        </div>
      </div>
    </FocusTrap>,
    document.body
  );
};

export default OnboardingModal;
export { ONBOARDING_KEY };

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { copyToClipboard } from '../utils/clipboard';
import FocusTrap from 'focus-trap-react';

const LANGUAGES = [
  { id: 'python', label: 'Python' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'curl', label: 'cURL' },
];

const getSnippet = (lang, apiKey) => {
  switch (lang) {
    case 'python':
      return `from openai import OpenAI

client = OpenAI(
    base_url="https://api.hermaai.com/v1",
    api_key="${apiKey}"
)

response = client.chat.completions.create(
    model="herma-auto",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)`;
    case 'javascript':
      return `import OpenAI from 'openai';

const client = new OpenAI({
    baseURL: 'https://api.hermaai.com/v1',
    apiKey: '${apiKey}'
});

const response = await client.chat.completions.create({
    model: 'herma-auto',
    messages: [{ role: 'user', content: 'Hello!' }]
});
console.log(response.choices[0].message.content);`;
    case 'curl':
      return `curl https://api.hermaai.com/v1/chat/completions \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"model":"herma-auto","messages":[{"role":"user","content":"Hello!"}]}'`;
    default:
      return '';
  }
};

const CopyIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const CopyButton = ({ text, label = 'Copy' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md
        bg-[var(--bg-active)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]
        hover:bg-[var(--bg-hover)] border border-[var(--border-primary)]
        transition-all duration-150"
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
      {copied ? 'Copied!' : label}
    </button>
  );
};

const StepIndicator = ({ currentStep }) => {
  const steps = [
    { num: 1, label: 'Copy Key' },
    { num: 2, label: 'Integrate' },
    { num: 3, label: 'Done' },
  ];

  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, i) => (
        <React.Fragment key={step.num}>
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-200 ${
                step.num === currentStep
                  ? 'bg-[var(--accent-primary)] text-white'
                  : step.num < currentStep
                  ? 'bg-[#5BAF8A]/20 text-[#5BAF8A] border border-[#5BAF8A]/30'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] border border-[var(--border-primary)]'
              }`}
            >
              {step.num < currentStep ? (
                <CheckIcon />
              ) : (
                step.num
              )}
            </div>
            <span
              className={`text-sm font-medium hidden sm:inline ${
                step.num === currentStep
                  ? 'text-[var(--text-primary)]'
                  : 'text-[var(--text-tertiary)]'
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-12 h-px ${
                step.num < currentStep
                  ? 'bg-[#5BAF8A]/40'
                  : 'bg-[var(--border-primary)]'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const IntegrationWizard = ({ apiKey, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedLang, setSelectedLang] = useState('python');

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleClose]);

  if (!apiKey) return null;

  return createPortal(
    <FocusTrap focusTrapOptions={{ allowOutsideClick: true }}>
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="wizard-title"
        className="relative w-full max-w-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)]
          rounded-2xl shadow-2xl overflow-hidden animate-fade-in"
        style={{ maxHeight: '90vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-primary)]">
          <h2
            id="wizard-title"
            className="text-lg font-semibold text-[var(--text-primary)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Get Started with Herma
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)]
              hover:bg-[var(--bg-hover)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <StepIndicator currentStep={step} />

          {/* Step 1: Copy Your Key */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3
                  className="text-xl font-semibold text-[var(--text-primary)] mb-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Copy Your API Key
                </h3>
                <p className="text-sm text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>
                  Your new API key has been created. Copy it now and store it somewhere safe.
                </p>
              </div>

              <div className="bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl p-4">
                <div className="flex items-center justify-between gap-3">
                  <code
                    className="flex-1 text-sm text-[var(--text-primary)] break-all"
                    style={{ fontFamily: 'var(--font-code)' }}
                  >
                    {apiKey}
                  </code>
                  <CopyButton text={apiKey} />
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <svg className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.072 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-sm text-amber-900" style={{ fontFamily: 'var(--font-body)' }}>
                  Save this key — you won't be able to see it again.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Choose Your Language */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3
                  className="text-xl font-semibold text-[var(--text-primary)] mb-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Choose Your Language
                </h3>
                <p className="text-sm text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>
                  Herma is OpenAI-compatible. Use any OpenAI SDK — just change the base URL.
                </p>
              </div>

              {/* Language Tabs */}
              <div className="flex gap-1 p-1 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-primary)]">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setSelectedLang(lang.id)}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-150 ${
                      selectedLang === lang.id
                        ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                    }`}
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>

              {/* Code Block */}
              <div className="relative bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border-primary)] bg-[var(--bg-tertiary)]/50">
                  <span className="text-xs text-[var(--text-tertiary)]" style={{ fontFamily: 'var(--font-code)' }}>
                    {selectedLang === 'python' ? 'main.py' : selectedLang === 'javascript' ? 'index.js' : 'terminal'}
                  </span>
                  <CopyButton text={getSnippet(selectedLang, apiKey)} />
                </div>
                <pre className="p-4 overflow-x-auto">
                  <code
                    className="text-sm text-[var(--text-secondary)] leading-relaxed"
                    style={{ fontFamily: 'var(--font-code)' }}
                  >
                    {getSnippet(selectedLang, apiKey)}
                  </code>
                </pre>
              </div>

              <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.072 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-sm text-red-300" style={{ fontFamily: 'var(--font-body)' }}>
                  <strong>Never deploy code with your API key visible.</strong> Always load it from an environment variable — never hardcode it in source files.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Done */}
          {step === 3 && (
            <div className="text-center space-y-6 py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#5BAF8A]/15 border border-[#5BAF8A]/30">
                <svg className="w-8 h-8 text-[#5BAF8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div>
                <h3
                  className="text-xl font-semibold text-[var(--text-primary)] mb-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  You're all set!
                </h3>
                <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto" style={{ fontFamily: 'var(--font-body)' }}>
                  Your requests are now automatically routed to the best model for each query — optimizing for quality and cost.
                </p>
              </div>

              <a
                href="/docs"
                className="inline-flex items-center gap-2 text-[var(--accent-primary)] hover:text-[var(--accent-hover)] text-sm font-medium transition-colors"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Read the full documentation
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--border-primary)] bg-[var(--bg-tertiary)]/30">
          <div>
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Back
              </button>
            )}
          </div>
          <div>
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-5 py-2 text-sm font-semibold rounded-lg bg-[var(--accent-primary)] text-white
                  hover:bg-[var(--accent-hover)] transition-colors"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                {step === 1 ? 'Next: Integration' : 'Next: Finish'}
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-5 py-2 text-sm font-semibold rounded-lg bg-[var(--text-primary)] text-[var(--bg-primary)]
                  hover:opacity-90 transition-colors"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
    </FocusTrap>,
    document.body
  );
};

export default IntegrationWizard;

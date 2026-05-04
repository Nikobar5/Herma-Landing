import React, { useState } from 'react';

const INSTALL_COMMAND = 'npm install -g @herma-ai/cli';

export default function CliInstall() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* noop */ }
  };

  return (
    <section className="py-16 sm:py-20 bg-[var(--bg-primary)]">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">

        {/* Eyebrow */}
        <p
          className="text-xs sm:text-sm tracking-[0.2em] uppercase mb-4"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-tertiary)' }}
        >
          Herma CLI
        </p>

        {/* Heading */}
        <h2
          className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4 tracking-tight"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Get started in 30 seconds
        </h2>

        {/* Subtext */}
        <p
          className="text-base sm:text-lg text-[var(--text-secondary)] mb-10 max-w-xl mx-auto leading-relaxed"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Configure all your coding agents to use intelligent routing in one command.
        </p>

        {/* Terminal block */}
        <div
          className="relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden border border-[var(--border-secondary)] shadow-lg"
          style={{ background: 'var(--hero-bg-elev, #16131e)' }}
        >
          {/* Top bar */}
          <div
            className="flex items-center gap-1.5 px-4 py-3"
            style={{ borderBottom: '1px solid var(--border-primary)' }}
          >
            <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
            <span
              className="ml-3 text-xs"
              style={{ fontFamily: 'var(--font-code)', color: 'var(--text-tertiary)' }}
            >
              terminal
            </span>
          </div>

          {/* Command line */}
          <div className="flex items-center gap-3 px-5 py-5">
            <div className="overflow-x-auto min-w-0 flex-1">
              <code
                className="text-sm sm:text-base whitespace-nowrap"
                style={{ fontFamily: 'var(--font-code)' }}
              >
                <span style={{ color: 'var(--accent-primary)' }}>$ </span>
                <span style={{ color: 'var(--text-primary)' }}>{INSTALL_COMMAND}</span>
              </code>
            </div>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              aria-label="Copy install command"
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
              style={{
                fontFamily: 'var(--font-ui)',
                background: copied ? 'rgba(91, 175, 138, 0.15)' : 'var(--accent-muted)',
                color: copied ? '#5BAF8A' : 'var(--text-secondary)',
                border: `1px solid ${copied ? 'rgba(91, 175, 138, 0.3)' : 'var(--border-secondary)'}`,
              }}
              onMouseEnter={(e) => {
                if (!copied) {
                  e.currentTarget.style.color = 'var(--accent-primary)';
                  e.currentTarget.style.borderColor = 'var(--border-accent)';
                }
              }}
              onMouseLeave={(e) => {
                if (!copied) {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.borderColor = 'var(--border-secondary)';
                }
              }}
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Learn more */}
        <a
          href="/docs"
          className="inline-block mt-6 text-sm font-medium transition-opacity duration-150 hover:opacity-80"
          style={{ fontFamily: 'var(--font-ui)', color: 'var(--accent-primary)' }}
        >
          View documentation &rarr;
        </a>

      </div>
    </section>
  );
}

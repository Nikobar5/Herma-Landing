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
    <section
      className="relative w-full flex flex-col items-center px-6 py-20 sm:py-24"
      style={{ background: 'var(--hero-bg, #0e0c14)' }}
    >
      {/* Heading */}
      <h2
        className="text-2xl sm:text-3xl font-medium mb-8 tracking-tight"
        style={{
          fontFamily: "var(--font-serif, 'Playfair Display', serif)",
          color: 'var(--hero-fg, #ece6d8)',
        }}
      >
        Get Started
      </h2>

      {/* Terminal block */}
      <div
        className="relative w-full max-w-[600px] rounded-xl overflow-hidden"
        style={{
          background: '#0a0a0f',
          border: '1px solid var(--hero-border, #2a2438)',
        }}
      >
        {/* Terminal top bar */}
        <div
          className="flex items-center gap-1.5 px-4 py-2.5"
          style={{ borderBottom: '1px solid var(--hero-border, #2a2438)' }}
        >
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ffbd2e' }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }} />
          <span
            className="ml-3 text-xs"
            style={{
              fontFamily: "var(--font-code, 'Inconsolata', monospace)",
              color: 'var(--hero-fg-muted, #a59cb1)',
            }}
          >
            terminal
          </span>
        </div>

        {/* Command line */}
        <div className="flex items-center justify-between px-5 py-4">
          <code
            className="text-sm sm:text-base"
            style={{ fontFamily: "var(--font-code, 'Inconsolata', monospace)" }}
          >
            <span style={{ color: 'var(--hero-glow, #e8956a)' }}>$ </span>
            <span style={{ color: 'var(--hero-fg, #ece6d8)' }}>{INSTALL_COMMAND}</span>
          </code>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            aria-label="Copy install command"
            className="ml-4 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150"
            style={{
              fontFamily: "var(--font-ui, 'DM Sans', sans-serif)",
              background: copied ? 'rgba(91, 175, 138, 0.15)' : 'rgba(255,255,255,0.05)',
              color: copied ? '#5BAF8A' : 'var(--hero-fg-muted, #a59cb1)',
              border: `1px solid ${copied ? 'rgba(91, 175, 138, 0.3)' : 'var(--hero-border, #2a2438)'}`,
            }}
            onMouseEnter={(e) => {
              if (!copied) {
                e.currentTarget.style.color = 'var(--hero-glow, #e8956a)';
                e.currentTarget.style.borderColor = 'var(--hero-glow, #e8956a)';
              }
            }}
            onMouseLeave={(e) => {
              if (!copied) {
                e.currentTarget.style.color = 'var(--hero-fg-muted, #a59cb1)';
                e.currentTarget.style.borderColor = 'var(--hero-border, #2a2438)';
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

      {/* Description */}
      <p
        className="mt-6 text-sm sm:text-base text-center max-w-md"
        style={{
          fontFamily: "var(--font-ui, 'DM Sans', sans-serif)",
          color: 'var(--hero-fg-muted, #a59cb1)',
          lineHeight: 1.6,
        }}
      >
        Configure all your coding agents to use intelligent routing in 30 seconds.
      </p>

      {/* CTA link */}
      <a
        href="/docs"
        className="mt-4 text-sm font-medium transition-opacity duration-150 hover:opacity-80"
        style={{
          fontFamily: "var(--font-ui, 'DM Sans', sans-serif)",
          color: 'var(--hero-glow, #e8956a)',
        }}
      >
        Learn more &rarr;
      </a>
    </section>
  );
}

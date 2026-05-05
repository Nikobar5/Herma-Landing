import React, { useState } from 'react';

const INSTALL_COMMAND = 'npm install -g @herma-ai/cli';

const AGENT_PROMPT = `Configure this agent to use Herma for all AI model calls. Herma is an OpenAI-compatible model router.

API details:
- Base URL: https://herma.up.railway.app/v1
- Model: herma-auto
- API Key: get one at hermaai.com/dashboard (starts with herma_sk_)

Read the full setup docs at hermaai.com/docs for agent-specific instructions (env vars, config files, etc). Figure out the correct configuration method for this specific agent and apply it.`;

const tabs = [
  {
    id: 'cli',
    label: 'Herma CLI',
    mobileLabel: 'CLI',
    badge: 'Recommended',
    description: 'An AI agent changing out its own model is like a human performing surgery on themselves — not a great idea. Let the Herma installer agent handle it.',
  },
  {
    id: 'prompt',
    label: 'Paste into Agent',
    mobileLabel: 'Paste',
    badge: null,
    description: 'Have your agent handle the setup and switch out models of its subagents.',
  },
  {
    id: 'manual',
    label: 'Manual Setup',
    mobileLabel: 'Manual',
    badge: null,
    description: 'For those who still like to do things by hand.',
  },
];

export default function CliInstall() {
  const [activeTab, setActiveTab] = useState('cli');
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* noop */ }
  };

  const CopyButton = ({ text }) => (
    <button
      onClick={() => handleCopy(text)}
      aria-label="Copy"
      className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
      style={{
        fontFamily: 'var(--font-ui)',
        background: copied ? 'rgba(91, 175, 138, 0.15)' : 'var(--accent-muted)',
        color: copied ? '#5BAF8A' : 'var(--text-secondary)',
        border: `1px solid ${copied ? 'rgba(91, 175, 138, 0.3)' : 'var(--border-secondary)'}`,
      }}
      onMouseEnter={(e) => { if (!copied) { e.currentTarget.style.color = 'var(--accent-primary)'; e.currentTarget.style.borderColor = 'var(--border-accent)'; } }}
      onMouseLeave={(e) => { if (!copied) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-secondary)'; } }}
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
  );

  return (
    <section id="get-started" className="py-16 sm:py-20 bg-[var(--bg-primary)]">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">

        {/* Eyebrow */}
        <p
          className="text-xs sm:text-sm tracking-[0.2em] uppercase mb-4"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-tertiary)' }}
        >
          Get Started
        </p>

        {/* Heading */}
        <h2
          className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4 tracking-tight"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Set up in 30 seconds
        </h2>

        <p
          className="text-base sm:text-lg text-[var(--text-secondary)] mb-10 max-w-xl mx-auto leading-relaxed"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Three ways to start routing. Pick what works for you.
        </p>

        {/* Tabs */}
        <div className="flex justify-center gap-1 mb-8 overflow-x-auto px-2 -mx-2" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setCopied(false); }}
              className="relative px-3 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0"
              style={{
                fontFamily: 'var(--font-ui)',
                background: activeTab === tab.id ? 'var(--accent-muted)' : 'transparent',
                color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                border: activeTab === tab.id ? '1px solid var(--border-accent, rgba(232,149,106,0.2))' : '1px solid transparent',
              }}
            >
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.mobileLabel}</span>
              {tab.badge && (
                <span
                  className="ml-1.5 sm:ml-2 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] uppercase tracking-wider"
                  style={{
                    background: 'var(--accent-primary)',
                    color: 'var(--bg-primary)',
                    fontWeight: 700,
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab description */}
        <p
          className="text-sm text-[var(--text-secondary)] mb-6 max-w-lg mx-auto leading-relaxed"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {tabs.find(t => t.id === activeTab)?.description}
        </p>

        {/* Content */}
        {activeTab === 'cli' && (<>
          <div
            className="relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden border border-[var(--border-secondary)] shadow-lg"
            style={{ background: 'var(--hero-bg-elev, #16131e)' }}
          >
            <div
              className="flex items-center gap-1.5 px-4 py-3"
              style={{ borderBottom: '1px solid var(--border-primary)' }}
            >
              <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
              <span className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
              <span className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
              <span className="ml-3 text-xs" style={{ fontFamily: 'var(--font-code)', color: 'var(--text-tertiary)' }}>
                terminal
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-5">
              <div className="overflow-x-auto min-w-0 flex-1">
                <code className="text-xs sm:text-base whitespace-nowrap" style={{ fontFamily: 'var(--font-code)' }}>
                  <span style={{ color: 'var(--accent-primary)' }}>$ </span>
                  <span style={{ color: 'var(--text-primary)' }}>{INSTALL_COMMAND}</span>
                </code>
              </div>
              <CopyButton text={INSTALL_COMMAND} />
            </div>
          </div>

          <p
            className="w-full max-w-2xl mx-auto text-sm text-left mt-4 mb-3"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--text-tertiary)' }}
          >
            Then run:
          </p>

          <div
            className="relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden border border-[var(--border-secondary)] shadow-lg"
            style={{ background: 'var(--hero-bg-elev, #16131e)' }}
          >
            <div className="flex items-center gap-3 px-5 py-4">
              <div className="overflow-x-auto min-w-0 flex-1 text-center">
                <code className="text-sm sm:text-base whitespace-nowrap" style={{ fontFamily: 'var(--font-code)' }}>
                  <span style={{ color: 'var(--accent-primary)' }}>$ </span>
                  <span style={{ color: 'var(--text-primary)' }}>herma</span>
                </code>
              </div>
              <CopyButton text="herma" />
            </div>
          </div>
        </>)}

        {activeTab === 'prompt' && (
          <div
            className="relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden border border-[var(--border-secondary)] shadow-lg text-left"
            style={{ background: 'var(--hero-bg-elev, #16131e)' }}
          >
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: '1px solid var(--border-primary)' }}
            >
              <span className="text-xs" style={{ fontFamily: 'var(--font-code)', color: 'var(--text-tertiary)' }}>
                paste this into your coding agent
              </span>
              <CopyButton text={AGENT_PROMPT} />
            </div>
            <div className="px-5 py-4 max-h-48 overflow-y-auto">
              <pre
                className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed"
                style={{ fontFamily: 'var(--font-code)', color: 'var(--text-secondary)' }}
              >
                {AGENT_PROMPT}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'manual' && (
          <div
            className="relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden border border-[var(--border-secondary)] shadow-lg"
            style={{ background: 'var(--hero-bg-elev, #16131e)' }}
          >
            <div className="px-6 py-8 text-center">
              <p
                className="text-sm sm:text-base mb-5 leading-relaxed"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}
              >
                Step-by-step guides for Claude Code, Codex, Cursor, OpenClaw, and any OpenAI-compatible agent.
              </p>
              <a
                href="/docs"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  fontFamily: 'var(--font-ui)',
                  background: 'var(--accent-muted)',
                  color: 'var(--accent-primary)',
                  border: '1px solid var(--border-accent, rgba(232,149,106,0.2))',
                }}
              >
                View documentation
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

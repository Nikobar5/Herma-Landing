import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHermaAuth } from '../context/HermaAuthContext';
import { useAskHerma } from '../context/AskHermaContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const HERMA_SETUP_PROMPT = `# Herma AI

Herma is an OpenAI-compatible intelligent model router that automatically routes each request to the optimal model, saving 60–90% on LLM costs while maintaining frontier quality.

## Configuration

All LLM API calls in this project use Herma. Use the following client configuration:

| Setting   | Value                              |
|-----------|------------------------------------|
| Base URL  | \`https://api.hermaai.com/v1\`       |
| Model     | \`herma-auto\`                       |
| API Key   | \`$HERMA_API_KEY\` (starts with \`herma_sk\`) |

Get your API key: https://hermaai.com/dashboard/api-keys

## Python

\`\`\`python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["HERMA_API_KEY"],
    base_url="https://api.hermaai.com/v1"
)

response = client.chat.completions.create(
    model="herma-auto",
    messages=[{"role": "user", "content": "..."}]
)
print(response.choices[0].message.content)
\`\`\`

## JavaScript / Node.js

\`\`\`javascript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.HERMA_API_KEY,
  baseURL: "https://api.hermaai.com/v1"
});

const response = await client.chat.completions.create({
  model: "herma-auto",
  messages: [{ role: "user", content: "..." }]
});
console.log(response.choices[0].message.content);
\`\`\`

## Setting Up Claude Code to Route Through Herma

If the user wants Claude Code itself (this tool) to route through Herma, add these to \`~/.zshrc\` or \`~/.bashrc\`:

\`\`\`bash
export ANTHROPIC_BASE_URL="https://api.hermaai.com"
export ANTHROPIC_AUTH_TOKEN="herma_sk_YOUR_KEY"
export ANTHROPIC_MODEL="herma-auto"
\`\`\`

Then open a new terminal and run \`claude\`.

Or use the one-liner installer:
\`\`\`bash
curl -fsSL https://api.hermaai.com/install/claude-code | bash -s -- herma_sk_YOUR_KEY
\`\`\`

> **Why \`ANTHROPIC_AUTH_TOKEN\` and not \`ANTHROPIC_API_KEY\`?** Claude Code treats these differently: \`ANTHROPIC_API_KEY\` triggers Anthropic's OAuth browser login flow. \`ANTHROPIC_AUTH_TOKEN\` sends the value directly as a Bearer token and bypasses OAuth entirely, so Herma's key works without conflict.

> **Already logged into Claude?** No need to log out. \`ANTHROPIC_AUTH_TOKEN\` takes priority over your existing session automatically. To revert to your Claude subscription later, remove the three export lines and open a new terminal.

## Rules

- Always use \`herma-auto\` as the model. Herma selects the optimal underlying model per request.
- Never call \`api.openai.com\` endpoints directly — always use \`https://api.hermaai.com/v1\`.
- Never hardcode API keys. Always read from the \`HERMA_API_KEY\` environment variable.
- Streaming (\`stream: true\`) and tool/function calling are fully supported.
- The API is fully OpenAI-compatible — all standard SDK parameters work unchanged.

## Reference

- Full setup guide (all tools): https://hermaai.com/setup.md
- API Documentation: https://hermaai.com/docs
- Pricing: $2/M input tokens, $8/M output tokens
- Test the router free (no auth required): \`POST https://api.hermaai.com/v1/classify\`
`;

export const PLACEHOLDER_QUESTIONS = [
  'Ask anything about Herma...',
  'How do I use Herma?',
  'Does Herma save me money?',
  'What models does Herma route to?',
  'How do I get an API key?',
  'Is Herma OpenAI compatible?',
  'Can I use streaming with Herma?',
];

// 4-pointed sparkle icon matching Google Gemini aesthetic
function Sparkle({ size = 16, color = 'var(--accent-primary)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
      <path d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5L12 2Z" />
    </svg>
  );
}

function WaitingDots() {
  return (
    <span className="inline-flex items-center gap-[3px]">
      {[0, 1, 2].map((i) => (
        <span key={i} style={{
          width: 4, height: 4, borderRadius: '50%',
          background: 'var(--accent-primary)', display: 'inline-block',
          opacity: 0.4,
          animation: `heroDot 1.2s ease-in-out ${i * 0.18}s infinite`,
        }} />
      ))}
    </span>
  );
}

export default function Hero() {
  const navigate = useNavigate();
  const { isAuthenticated } = useHermaAuth();
  const { messages, inputValue, setInputValue, isStreaming, error, submit, stop, clear } = useAskHerma();

  const [copied, setCopied] = useState(false);
  const [phIndex, setPhIndex] = useState(0);
  const [phVisible, setPhVisible] = useState(true);
  const [inputFocused, setInputFocused] = useState(false);

  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const hasMessages = messages.length > 0;

  // Rotate placeholder when idle
  useEffect(() => {
    if (inputFocused || inputValue) return;
    const t = setInterval(() => {
      setPhVisible(false);
      setTimeout(() => {
        setPhIndex(i => (i + 1) % PLACEHOLDER_QUESTIONS.length);
        setPhVisible(true);
      }, 280);
    }, 3000);
    return () => clearInterval(t);
  }, [inputFocused, inputValue]);

  // Auto-scroll response
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleCopySetup = async () => {
    try {
      await navigator.clipboard.writeText(HERMA_SETUP_PROMPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* noop */ }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit(inputValue);
    }
  };

  const canSend = inputValue.trim() && !isStreaming;

  return (
    <>
      <style>{`
        @keyframes heroDot {
          0%, 60%, 100% { opacity: 0.2; transform: scale(0.85); }
          30% { opacity: 1; transform: scale(1); }
        }
        @keyframes heroCardIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroCursor {
          0%, 100% { opacity: 1; } 50% { opacity: 0; }
        }
        .hero-pill:focus-within {
          border-color: rgba(67,56,202,0.4) !important;
          box-shadow: 0 0 0 3px rgba(67,56,202,0.08), 0 2px 20px rgba(0,0,0,0.07) !important;
        }
        .hero-action-btn:hover { background: var(--bg-hover) !important; }
        .hero-send-active:hover { background: var(--accent-hover) !important; }
        .hero-markdown p { margin: 0 0 8px 0; }
        .hero-markdown p:last-child { margin-bottom: 0; }
        .hero-markdown ul, .hero-markdown ol { margin: 4px 0 8px; padding-left: 18px; }
        .hero-markdown li { margin: 2px 0; }
        .hero-markdown code { background: rgba(67,56,202,0.08); border-radius: 4px; padding: 1px 5px; font-family: var(--font-code); font-size: 0.88em; }
        .hero-markdown pre { background: rgba(0,0,0,0.05); border-radius: 8px; padding: 10px 12px; overflow-x: auto; margin: 6px 0; }
        .hero-markdown pre code { background: none; padding: 0; }
        .hero-markdown strong { font-weight: 600; }
      `}</style>

      <div id="hero-section" className="relative w-full bg-[var(--bg-primary)] overflow-hidden">
        <section className="relative w-full min-h-[70vh] sm:min-h-[80vh] flex items-center justify-center pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20">

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-8%] right-[-4%] w-80 h-80 rounded-full bg-[var(--accent-primary)]/5 blur-3xl" />
            <div className="absolute bottom-[10%] left-[-6%] w-96 h-96 rounded-full bg-[var(--accent-primary)]/4 blur-3xl" />
          </div>

          <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col items-center text-center">

              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-5 leading-[1.1] tracking-tight animate-hero"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                <span className="text-[var(--text-primary)]">The AI Gateway</span>
                <br />
                <span className="gradient-text-hero">for cost-effective agents</span>
              </h1>

              <p
                className="text-base sm:text-lg md:text-xl text-[var(--text-secondary)] mb-8 font-normal max-w-2xl mx-auto leading-relaxed px-2 sm:px-0 animate-hero-delayed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Switch your AI calls to Herma and we'll automatically route every request
                to the most cost-effective model — without losing quality.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-3 animate-hero-delayed-more">
                <button
                  onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login?signup=true')}
                  className="px-8 py-3.5 bg-[var(--accent-primary)] text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:bg-[var(--accent-hover)] transform transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/30 focus:ring-offset-2 text-base"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  <span className="flex items-center gap-2">
                    {isAuthenticated ? 'Go to Dashboard' : 'Get Started with Herma'}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>

                <button
                  onClick={handleCopySetup}
                  className="px-8 py-3.5 border-2 border-[var(--accent-primary)]/40 text-[var(--accent-primary)] font-semibold rounded-xl hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/5 transform transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:ring-offset-2 text-base"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  <span className="flex items-center gap-2">
                    {copied ? (
                      <>
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Have your AI setup Herma
                      </>
                    )}
                  </span>
                </button>
              </div>

              <p className="text-xs text-[var(--text-tertiary)] mb-8 animate-hero-delayed-more" style={{ fontFamily: 'var(--font-ui)' }}>
                Free credits to start &middot; No credit card required
              </p>

              {/* ── Inline chat ── */}
              <div className="w-full max-w-2xl animate-hero-delayed-more">

                {/* Response card — Gemini style */}
                {hasMessages && (
                  <div
                    style={{
                      background: '#fff',
                      border: '1px solid rgba(0,0,0,0.08)',
                      borderRadius: 16,
                      boxShadow: '0 4px 24px rgba(0,0,0,0.09)',
                      marginBottom: 8,
                      overflow: 'hidden',
                      animation: 'heroCardIn 240ms ease',
                    }}
                  >
                    {/* Card header */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '10px 14px',
                      borderBottom: '1px solid rgba(0,0,0,0.06)',
                    }}>
                      <Sparkle size={14} />
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                        Herma
                      </span>
                      {isStreaming && (
                        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--text-tertiary)' }}>
                          thinking…
                        </span>
                      )}
                      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
                        {/* Close button */}
                        <button
                          className="hero-action-btn"
                          onClick={clear}
                          aria-label="Close"
                          style={{
                            width: 28, height: 28, borderRadius: 8, border: 'none',
                            background: 'transparent', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--text-tertiary)', transition: 'all 150ms',
                          }}
                        >
                          <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Messages */}
                    <div
                      ref={scrollRef}
                      style={{ maxHeight: 260, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}
                    >
                      {messages.map((msg) => {
                        const isUser = msg.role === 'user';
                        return (
                          <div key={msg.id} style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
                            {isUser ? (
                              <div style={{
                                maxWidth: '80%',
                                background: 'var(--accent-primary)',
                                color: '#fff',
                                borderRadius: '16px 16px 4px 16px',
                                padding: '7px 12px',
                                fontFamily: 'var(--font-ui)', fontSize: 13,
                                lineHeight: 1.5, wordBreak: 'break-word',
                              }}>
                                {msg.content}
                              </div>
                            ) : (
                              <div style={{ maxWidth: '90%', fontFamily: 'var(--font-ui)', fontSize: 14, lineHeight: 1.7, color: 'var(--text-primary)' }}>
                                {msg.content === '' && msg.streaming ? (
                                  <WaitingDots />
                                ) : (
                                  <>
                                    <div className="hero-markdown" style={{ wordBreak: 'break-word' }}>
                                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                                    </div>
                                    {msg.streaming && msg.content && (
                                      <span style={{
                                        display: 'inline-block', width: 2, height: '1em',
                                        background: 'var(--accent-primary)', marginLeft: 2,
                                        verticalAlign: 'text-bottom',
                                        animation: 'heroCursor 1s step-end infinite',
                                      }} />
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {error && (
                        <div role="alert" style={{
                          padding: '7px 11px', borderRadius: 8,
                          background: error === 'rate_limit' ? 'var(--bg-hover)' : '#FEF2F2',
                          border: error === 'rate_limit' ? '1px solid var(--border-primary)' : '1px solid #FECACA',
                          fontFamily: 'var(--font-ui)', fontSize: 13,
                          color: error === 'rate_limit' ? 'var(--text-secondary)' : '#DC2626',
                        }}>
                          {error === 'rate_limit' ? (
                            <>Demo limit reached.{' '}
                              <button onClick={() => navigate('/login?signup=true')} style={{ color: 'var(--accent-primary)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-ui)', padding: 0, textDecoration: 'underline' }}>
                                Sign up free
                              </button>
                              {' '}for unlimited access.</>
                          ) : error}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Pill input bar */}
                <div
                  className="hero-pill"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 8px 8px 16px',
                    background: '#fff',
                    border: '1.5px solid rgba(67,56,202,0.15)',
                    borderRadius: 9999,
                    boxShadow: '0 2px 20px rgba(0,0,0,0.07)',
                    transition: 'border-color 200ms ease, box-shadow 200ms ease',
                  }}
                >
                  <Sparkle size={15} />

                  {/* Input with rotating placeholder */}
                  <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
                    <input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onFocus={() => setInputFocused(true)}
                      onBlur={() => setInputFocused(false)}
                      placeholder=""
                      disabled={isStreaming}
                      aria-label="Ask Herma a question"
                      style={{
                        width: '100%', border: 'none', outline: 'none',
                        background: 'transparent',
                        fontFamily: 'var(--font-ui)', fontSize: 14,
                        color: 'var(--text-primary)',
                      }}
                    />
                    {!inputValue && !inputFocused && (
                      <span style={{
                        position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                        color: 'var(--text-tertiary)',
                        fontFamily: 'var(--font-ui)', fontSize: 14,
                        opacity: phVisible ? 1 : 0,
                        transition: 'opacity 280ms ease',
                        pointerEvents: 'none',
                        whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '100%',
                        userSelect: 'none',
                      }}>
                        {PLACEHOLDER_QUESTIONS[phIndex]}
                      </span>
                    )}
                  </div>

                  {/* Circular send / stop button */}
                  {isStreaming ? (
                    <button
                      onClick={stop}
                      aria-label="Stop generating"
                      style={{
                        width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                        border: '1.5px solid var(--border-secondary)',
                        background: 'transparent', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--text-secondary)', transition: 'all 150ms',
                      }}
                    >
                      <svg width="10" height="10" fill="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="3" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      className={canSend ? 'hero-send-active' : ''}
                      onClick={() => submit(inputValue)}
                      disabled={!canSend}
                      aria-label="Send"
                      style={{
                        width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                        border: 'none',
                        background: canSend ? 'var(--accent-primary)' : '#E5E7EB',
                        color: canSend ? '#fff' : '#9CA3AF',
                        cursor: canSend ? 'pointer' : 'default',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 150ms ease',
                      }}
                    >
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19V5M5 12l7-7 7 7" />
                      </svg>
                    </button>
                  )}
                </div>

              </div>
              {/* ───────────────────────────── */}

            </div>
          </div>
        </section>
      </div>
    </>
  );
}

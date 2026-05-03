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

## Rules

- Always use \`herma-auto\` as the model.
- Never call \`api.openai.com\` endpoints directly — always use \`https://api.hermaai.com/v1\`.
- Never hardcode API keys. Always read from the \`HERMA_API_KEY\` environment variable.
- Streaming (\`stream: true\`) and tool/function calling are fully supported.
- The API is fully OpenAI-compatible — all standard SDK parameters work unchanged.
`;

export const PLACEHOLDER_QUESTIONS = [
  'Ask anything about Herma...',
  'How do I use Herma?',
  'Does Herma save me money?',
  'What models does Herma route to?',
  'How do I get an API key?',
  'Is Herma OpenAI compatible?',
];

function WaitingDots() {
  return (
    <span className="inline-flex items-center gap-[3px]">
      {[0, 1, 2].map((i) => (
        <span key={i} className="hero-dot" style={{ animationDelay: `${i * 0.18}s` }} />
      ))}
    </span>
  );
}

function StarField() {
  const stars = useRef(
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 55,
      size: Math.random() * 1.8 + 0.4,
      opacity: Math.random() * 0.6 + 0.15,
      delay: Math.random() * 4,
    }))
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {stars.map((s) => (
        <div
          key={s.id}
          className="hero-star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
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
        .hero-dark {
          position: relative;
          min-height: 100vh;
          background: var(--hero-bg);
          overflow: hidden;
        }

        /* Purple desert background image */
        .hero-desert-bg {
          position: absolute;
          inset: 0;
          background-image: url('/hero-desert.webp');
          background-size: cover;
          background-position: center 40%;
          opacity: 0.35;
          pointer-events: none;
        }

        /* Gradient overlay: solid dark on left for text, fades to transparent on right for desert */
        .hero-desert-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(to right, var(--hero-bg) 0%, var(--hero-bg) 15%, rgba(14,12,20,0.85) 35%, rgba(14,12,20,0.4) 65%, rgba(14,12,20,0.2) 100%),
            linear-gradient(to bottom, rgba(14,12,20,0.6) 0%, rgba(14,12,20,0.1) 40%, rgba(14,12,20,0.5) 100%);
        }

        /* Atmospheric layers */
        .hero-atmosphere {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        /* Desert ground */
        .hero-atmosphere::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 45%;
          background:
            radial-gradient(ellipse 120% 60% at 70% 100%, #2a1f3d 0%, transparent 70%),
            radial-gradient(ellipse 80% 50% at 30% 100%, #1e1830 0%, transparent 65%),
            radial-gradient(ellipse 140% 40% at 50% 100%, #251d38 0%, transparent 55%);
        }

        /* Horizon glow */
        .hero-atmosphere::after {
          content: '';
          position: absolute;
          bottom: 28%;
          left: 0;
          right: 0;
          height: 30%;
          background:
            radial-gradient(ellipse 70% 45% at 65% 80%, rgba(232,149,106,0.12) 0%, transparent 70%),
            radial-gradient(ellipse 90% 30% at 50% 90%, rgba(232,149,106,0.06) 0%, transparent 60%);
        }

        /* Cloud layer */
        .hero-clouds {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(ellipse 50% 40% at 15% 25%, rgba(30,20,50,0.9) 0%, transparent 70%),
            radial-gradient(ellipse 60% 35% at 10% 40%, rgba(25,18,42,0.7) 0%, transparent 65%),
            radial-gradient(ellipse 40% 25% at 75% 20%, rgba(40,30,60,0.4) 0%, transparent 60%),
            radial-gradient(ellipse 35% 20% at 85% 35%, rgba(35,25,55,0.3) 0%, transparent 55%);
        }

        /* Dune ridges */
        .hero-dunes {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 35%;
          pointer-events: none;
        }

        .hero-dunes::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: -5%;
          width: 70%;
          height: 100%;
          background: radial-gradient(ellipse 100% 80% at 50% 100%, #1c1628 0%, transparent 65%);
          border-radius: 50% 50% 0 0;
        }

        .hero-dunes::after {
          content: '';
          position: absolute;
          bottom: 0;
          right: -10%;
          width: 80%;
          height: 120%;
          background: radial-gradient(ellipse 100% 70% at 50% 100%, #211a30 0%, transparent 60%);
          border-radius: 50% 50% 0 0;
        }

        /* Gold ridge highlight */
        .hero-ridge {
          position: absolute;
          bottom: 32%;
          right: 10%;
          width: 45%;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(232,149,106,0.2) 30%, rgba(232,149,106,0.08) 70%, transparent 100%);
          transform: rotate(-3deg);
        }

        .hero-ridge-2 {
          position: absolute;
          bottom: 38%;
          right: 25%;
          width: 30%;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(232,149,106,0.12) 40%, rgba(232,149,106,0.04) 80%, transparent 100%);
          transform: rotate(-5deg);
        }

        /* Moon */
        .hero-moon {
          position: absolute;
          top: 8%;
          right: 38%;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--hero-moon);
          box-shadow: 0 0 20px 6px rgba(216,201,232,0.15), 0 0 60px 20px rgba(216,201,232,0.05);
        }

        /* Star twinkle */
        .hero-star {
          position: absolute;
          border-radius: 50%;
          background: var(--hero-fg);
          animation: heroTwinkle 3s ease-in-out infinite;
        }

        @keyframes heroTwinkle {
          0%, 100% { opacity: var(--tw-opacity, 0.3); }
          50% { opacity: 0.05; }
        }

        /* Dot loading */
        .hero-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--hero-glow);
          display: inline-block;
          opacity: 0.4;
          animation: heroDotPulse 1.2s ease-in-out infinite;
        }

        @keyframes heroDotPulse {
          0%, 60%, 100% { opacity: 0.2; transform: scale(0.85); }
          30% { opacity: 1; transform: scale(1); }
        }

        /* Card entrance */
        @keyframes heroCardIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Cursor blink */
        @keyframes heroCursor {
          0%, 100% { opacity: 1; } 50% { opacity: 0; }
        }

        /* Chat glass card */
        .hero-chat-card {
          background: rgba(22,19,30,0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--hero-border);
          border-radius: 16px;
          box-shadow: 0 4px 30px rgba(0,0,0,0.3);
          animation: heroCardIn 240ms ease;
          overflow: hidden;
        }

        /* Chat pill input */
        .hero-chat-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 8px 8px 16px;
          background: rgba(22,19,30,0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1.5px solid var(--hero-border);
          border-radius: 9999px;
          transition: border-color 200ms ease, box-shadow 200ms ease;
        }

        .hero-chat-pill:focus-within {
          border-color: var(--hero-glow) !important;
          box-shadow: 0 0 0 3px rgba(232,149,106,0.1), 0 2px 20px rgba(0,0,0,0.2) !important;
        }

        /* Markdown in dark mode */
        .hero-md-dark p { margin: 0 0 8px 0; }
        .hero-md-dark p:last-child { margin-bottom: 0; }
        .hero-md-dark ul, .hero-md-dark ol { margin: 4px 0 8px; padding-left: 18px; }
        .hero-md-dark li { margin: 2px 0; }
        .hero-md-dark code {
          background: rgba(232,149,106,0.1);
          border-radius: 4px;
          padding: 1px 5px;
          font-family: var(--font-code);
          font-size: 0.88em;
          color: var(--hero-glow);
        }
        .hero-md-dark pre {
          background: rgba(0,0,0,0.3);
          border-radius: 8px;
          padding: 10px 12px;
          overflow-x: auto;
          margin: 6px 0;
          border: 1px solid var(--hero-border);
        }
        .hero-md-dark pre code { background: none; padding: 0; color: var(--hero-fg); }
        .hero-md-dark strong { font-weight: 600; color: var(--hero-fg); }
        .hero-md-dark a { color: var(--hero-glow); text-decoration: underline; }

        /* Hero content fade-in */
        .hero-fade-1 { animation: heroFadeUp 600ms ease both; }
        .hero-fade-2 { animation: heroFadeUp 600ms ease 100ms both; }
        .hero-fade-3 { animation: heroFadeUp 600ms ease 200ms both; }
        .hero-fade-4 { animation: heroFadeUp 600ms ease 300ms both; }
        .hero-fade-5 { animation: heroFadeUp 600ms ease 400ms both; }

        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Action btn hover */
        .hero-action-btn:hover { background: rgba(255,255,255,0.06) !important; }
      `}</style>

      <div id="hero-section" className="hero-dark">
        {/* Desert background */}
        <div className="hero-desert-bg" />
        <div className="hero-desert-overlay" />

        {/* Atmospheric layers */}
        <div className="hero-atmosphere" />
        <div className="hero-clouds" />
        <StarField />
        <div className="hero-dunes" />
        <div className="hero-ridge" />
        <div className="hero-ridge-2" />
        <div className="hero-moon" />

        {/* Content */}
        <section className="relative z-10 w-full min-h-screen flex items-center pt-20 pb-16">
          <div className="container mx-auto max-w-4xl px-6 sm:px-8 lg:px-12">
            <div className="flex flex-col items-start">

              {/* Label */}
              <p
                className="hero-fade-1 text-xs sm:text-sm tracking-[0.2em] uppercase mb-6"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--hero-fg-dim)' }}
              >
                Herma &middot; Intelligent Model Router
              </p>

              {/* Headline */}
              <h1 className="hero-fade-2 mb-6 leading-[1.02] tracking-[-0.01em]" style={{ fontFamily: 'var(--font-serif)' }}>
                <span
                  className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] font-medium italic"
                  style={{ color: 'var(--hero-glow)' }}
                >
                  Same quality.
                </span>
                <span
                  className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] font-medium"
                  style={{ color: 'var(--hero-fg)' }}
                >
                  65% less cost.
                </span>
              </h1>

              {/* Subtext */}
              <p
                className="hero-fade-3 text-base sm:text-lg md:text-xl max-w-xl mb-8 leading-relaxed"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--hero-fg-muted)' }}
              >
                Route every AI call to the cheapest model that matches frontier quality.
                Drop-in OpenAI compatible. No code changes.
              </p>

              {/* CTA buttons */}
              <div className="hero-fade-4 flex flex-col sm:flex-row items-start gap-3 mb-10">
                <button
                  onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login?signup=true')}
                  className="px-7 py-3 rounded-full font-medium text-sm transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    background: 'var(--hero-glow)',
                    color: 'var(--hero-bg)',
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'var(--hero-glow-hover)'}
                  onMouseLeave={(e) => e.target.style.background = 'var(--hero-glow)'}
                >
                  <span className="flex items-center gap-2">
                    {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>

                <button
                  onClick={handleCopySetup}
                  className="px-7 py-3 rounded-full font-medium text-sm transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    background: 'transparent',
                    color: 'var(--hero-fg)',
                    border: '1px solid var(--hero-border-strong)',
                  }}
                >
                  <span className="flex items-center gap-2">
                    {copied ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#5BAF8A' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Prompt for Agents
                      </>
                    )}
                  </span>
                </button>
              </div>

              {/* Ask Herma chat */}
              <div className="hero-fade-5 w-full max-w-xl">

                {/* Response card */}
                {hasMessages && (
                  <div className="hero-chat-card mb-2">
                    <div
                      className="flex items-center gap-2 px-4 py-2.5"
                      style={{ borderBottom: '1px solid var(--hero-border)' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--hero-glow)" style={{ flexShrink: 0 }}>
                        <path d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5L12 2Z" />
                      </svg>
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: 12, fontWeight: 600, color: 'var(--hero-fg)' }}>
                        Herma
                      </span>
                      {isStreaming && (
                        <span style={{ fontSize: 11, color: 'var(--hero-fg-dim)' }}>thinking...</span>
                      )}
                      <button
                        className="hero-action-btn ml-auto"
                        onClick={clear}
                        aria-label="Close"
                        style={{
                          width: 28, height: 28, borderRadius: 8, border: 'none',
                          background: 'transparent', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--hero-fg-dim)', transition: 'all 150ms',
                        }}
                      >
                        <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div
                      ref={scrollRef}
                      style={{ maxHeight: 240, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}
                    >
                      {messages.map((msg) => {
                        const isUser = msg.role === 'user';
                        return (
                          <div key={msg.id} style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
                            {isUser ? (
                              <div style={{
                                maxWidth: '80%',
                                background: 'var(--hero-glow)',
                                color: 'var(--hero-bg)',
                                borderRadius: '16px 16px 4px 16px',
                                padding: '7px 12px',
                                fontFamily: 'var(--font-ui)', fontSize: 13,
                                lineHeight: 1.5, wordBreak: 'break-word', fontWeight: 500,
                              }}>
                                {msg.content}
                              </div>
                            ) : (
                              <div style={{ maxWidth: '90%', fontFamily: 'var(--font-ui)', fontSize: 14, lineHeight: 1.7, color: 'var(--hero-fg)' }}>
                                {msg.content === '' && msg.streaming ? (
                                  <WaitingDots />
                                ) : (
                                  <>
                                    <div className="hero-md-dark" style={{ wordBreak: 'break-word' }}>
                                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                                    </div>
                                    {msg.streaming && msg.content && (
                                      <span style={{
                                        display: 'inline-block', width: 2, height: '1em',
                                        background: 'var(--hero-glow)', marginLeft: 2,
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
                          background: 'rgba(220,38,38,0.1)',
                          border: '1px solid rgba(220,38,38,0.2)',
                          fontFamily: 'var(--font-ui)', fontSize: 13,
                          color: '#f87171',
                        }}>
                          {error === 'rate_limit' ? (
                            <>Demo limit reached.{' '}
                              <button onClick={() => navigate('/login?signup=true')} style={{ color: 'var(--hero-glow)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-ui)', padding: 0, textDecoration: 'underline' }}>
                                Sign up free
                              </button>
                              {' '}for unlimited access.</>
                          ) : error}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Input pill */}
                <div className="hero-chat-pill">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="var(--hero-glow)" style={{ flexShrink: 0 }}>
                    <path d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5L12 2Z" />
                  </svg>

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
                        color: 'var(--hero-fg)',
                      }}
                    />
                    {!inputValue && !inputFocused && (
                      <span style={{
                        position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                        color: 'var(--hero-fg-dim)',
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

                  {isStreaming ? (
                    <button
                      onClick={stop}
                      aria-label="Stop generating"
                      style={{
                        width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                        border: '1.5px solid var(--hero-border-strong)',
                        background: 'transparent', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--hero-fg-muted)', transition: 'all 150ms',
                      }}
                    >
                      <svg width="10" height="10" fill="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="3" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      onClick={() => submit(inputValue)}
                      disabled={!canSend}
                      aria-label="Send"
                      style={{
                        width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                        border: 'none',
                        background: canSend ? 'var(--hero-glow)' : 'var(--hero-border)',
                        color: canSend ? 'var(--hero-bg)' : 'var(--hero-fg-dim)',
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

            </div>
          </div>
        </section>

        {/* Bottom bar */}
        <div
          className="absolute bottom-0 left-0 right-0 z-10 px-6 sm:px-8 lg:px-12 py-5 flex justify-between items-center"
          style={{ color: 'var(--hero-fg-dim)', fontFamily: 'var(--font-heading)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}
        >
          <span>OpenAI compatible</span>
          <span>&copy; 2026 Herma AI</span>
        </div>
      </div>
    </>
  );
}

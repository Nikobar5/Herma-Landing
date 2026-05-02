import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAskHerma } from '../context/AskHermaContext';
import { PLACEHOLDER_QUESTIONS } from './Hero';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function Sparkle({ size = 14, color = 'var(--accent-primary)' }) {
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
          animation: `widgetDot 1.2s ease-in-out ${i * 0.18}s infinite`,
        }} />
      ))}
    </span>
  );
}

export default function AskHermaWidget() {
  const navigate = useNavigate();
  const { messages, inputValue, setInputValue, isStreaming, error, submit, stop, clear } = useAskHerma();

  const [heroVisible, setHeroVisible] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [phIndex, setPhIndex] = useState(0);
  const [phVisible, setPhVisible] = useState(true);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const hasMessages = messages.length > 0;
  const showPanel = panelOpen || hasMessages;
  const canSend = inputValue.trim() && !isStreaming;

  // IntersectionObserver — hide widget when hero is visible
  useEffect(() => {
    const heroEl = document.getElementById('hero-section');
    if (!heroEl) return;
    const obs = new IntersectionObserver(([e]) => setHeroVisible(e.isIntersecting), { threshold: 0.05 });
    obs.observe(heroEl);
    return () => obs.disconnect();
  }, []);

  // Open panel when messages arrive
  useEffect(() => {
    if (hasMessages) setPanelOpen(true);
  }, [hasMessages]);

  // Escape closes panel
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') { setPanelOpen(false); inputRef.current?.blur(); } };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, []);

  // Auto-scroll messages
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // Rotate placeholder when idle
  useEffect(() => {
    if (inputFocused || inputValue || heroVisible) return;
    const t = setInterval(() => {
      setPhVisible(false);
      setTimeout(() => {
        setPhIndex(i => (i + 1) % PLACEHOLDER_QUESTIONS.length);
        setPhVisible(true);
      }, 280);
    }, 3000);
    return () => clearInterval(t);
  }, [inputFocused, inputValue, heroVisible]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit(inputValue);
    }
  };

  return (
    <>
      <style>{`
        @keyframes widgetDot {
          0%, 60%, 100% { opacity: 0.2; transform: scale(0.85); }
          30% { opacity: 1; transform: scale(1); }
        }
        @keyframes widgetCardIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes widgetCursor {
          0%, 100% { opacity: 1; } 50% { opacity: 0; }
        }
        .widget-action:hover { background: var(--bg-hover) !important; }
        .widget-send-active:hover { background: var(--accent-hover) !important; }
        .widget-markdown p { margin: 0 0 8px 0; }
        .widget-markdown p:last-child { margin-bottom: 0; }
        .widget-markdown ul, .widget-markdown ol { margin: 4px 0 8px; padding-left: 18px; }
        .widget-markdown li { margin: 2px 0; }
        .widget-markdown code { background: rgba(67,56,202,0.08); border-radius: 4px; padding: 1px 5px; font-family: var(--font-code); font-size: 0.88em; }
        .widget-markdown pre { background: rgba(0,0,0,0.05); border-radius: 8px; padding: 10px 12px; overflow-x: auto; margin: 6px 0; }
        .widget-markdown pre code { background: none; padding: 0; }
        .widget-markdown strong { font-weight: 600; }
        .widget-pill:focus-within {
          border-color: rgba(67,56,202,0.4) !important;
          box-shadow: 0 0 0 3px rgba(67,56,202,0.08), 0 4px 24px rgba(0,0,0,0.10) !important;
        }
      `}</style>

      {/* Fixed centered wrapper */}
      <div
        style={{
          position: 'fixed',
          bottom: 0, left: 0, right: 0,
          zIndex: 45,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          pointerEvents: heroVisible ? 'none' : 'auto',
          opacity: heroVisible ? 0 : 1,
          transform: heroVisible ? 'translateY(16px)' : 'translateY(0)',
          transition: 'opacity 280ms ease, transform 280ms ease',
        }}
      >
        <div style={{ width: '100%', maxWidth: 680, margin: '0 16px 20px', display: 'flex', flexDirection: 'column' }}>

          {/* ── Response card (Gemini style) ── */}
          {showPanel && (
            <div
              style={{
                background: '#fff',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: 16,
                boxShadow: '0 4px 32px rgba(0,0,0,0.10)',
                marginBottom: 8,
                overflow: 'hidden',
                animation: 'widgetCardIn 240ms ease',
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
                  {/* Collapse */}
                  <button
                    className="widget-action"
                    onClick={() => { setPanelOpen(false); inputRef.current?.blur(); }}
                    aria-label="Collapse"
                    style={{
                      width: 28, height: 28, borderRadius: 8, border: 'none',
                      background: 'transparent', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--text-tertiary)', transition: 'all 150ms',
                    }}
                  >
                    <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {/* Clear */}
                  {hasMessages && (
                    <button
                      className="widget-action"
                      onClick={clear}
                      aria-label="Clear chat"
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
                  )}
                </div>
              </div>

              {/* Messages */}
              <div
                ref={scrollRef}
                aria-live="polite"
                style={{ maxHeight: 280, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}
              >
                {!hasMessages && (
                  <p style={{ margin: 0, fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-tertiary)' }}>
                    Ask anything about Herma below…
                  </p>
                )}

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
                        <div style={{ maxWidth: '90%', fontFamily: 'var(--font-ui)', fontSize: 13, lineHeight: 1.7, color: 'var(--text-primary)' }}>
                          {msg.content === '' && msg.streaming ? (
                            <WaitingDots />
                          ) : (
                            <>
                              <div className="widget-markdown" style={{ wordBreak: 'break-word' }}>
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                              </div>
                              {msg.streaming && msg.content && (
                                <span style={{
                                  display: 'inline-block', width: 2, height: '1em',
                                  background: 'var(--accent-primary)', marginLeft: 2,
                                  verticalAlign: 'text-bottom',
                                  animation: 'widgetCursor 1s step-end infinite',
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
                    fontFamily: 'var(--font-ui)', fontSize: 12,
                    color: error === 'rate_limit' ? 'var(--text-secondary)' : '#DC2626',
                  }}>
                    {error === 'rate_limit' ? (
                      <>Demo limit reached.{' '}
                        <button onClick={() => navigate('/login?signup=true')} style={{ color: 'var(--accent-primary)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-ui)', padding: 0, textDecoration: 'underline' }}>
                          Sign up free
                        </button>
                        {' '}for unlimited access.</>
                    ) : error}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Pill input bar ── */}
          <div
            className="widget-pill"
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 8px 8px 16px',
              background: '#fff',
              border: '1.5px solid rgba(67,56,202,0.15)',
              borderRadius: 9999,
              boxShadow: '0 4px 24px rgba(0,0,0,0.09)',
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
                onFocus={() => { setInputFocused(true); setPanelOpen(true); }}
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

            {/* Circular send / stop */}
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
                className={canSend ? 'widget-send-active' : ''}
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
      </div>
    </>
  );
}

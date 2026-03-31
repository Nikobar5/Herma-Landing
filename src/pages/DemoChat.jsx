import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHermaAuth } from '../context/HermaAuthContext';
import { streamDemoChat } from '../services/hermaApi';
import { setPageMeta, resetPageMeta } from '../utils/seo';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from '../components/chat/CodeBlock';

const MAX_DEMO_MESSAGES = 5;

const SUGGESTED_PROMPTS = [
  {
    label: 'Explain quantum computing',
    text: 'Explain quantum computing in simple terms. What makes it different from classical computing?',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
  },
  {
    label: 'Write Python code',
    text: 'Write a Python function that sorts a list using merge sort. Include comments explaining each step.',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
  },
  {
    label: 'Compare React vs Vue',
    text: 'Compare React and Vue.js. What are the key differences and when should you use each one?',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    label: 'Draft an email',
    text: 'Draft a professional email requesting a meeting to discuss a project timeline.',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
];

const remarkPlugins = [remarkGfm];

const markdownComponents = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    if (!inline && match) {
      return (
        <div className="not-prose my-4 rounded-xl overflow-hidden shadow-lg border border-[var(--border-secondary)]">
          <CodeBlock language={match[1]}>
            {String(children).replace(/\n$/, '')}
          </CodeBlock>
        </div>
      );
    }
    if (!inline) {
      return (
        <div className="not-prose my-4 rounded-xl overflow-hidden shadow-lg border border-[var(--border-secondary)]">
          <CodeBlock language="">
            {String(children).replace(/\n$/, '')}
          </CodeBlock>
        </div>
      );
    }
    return (
      <code
        className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] text-[var(--accent-primary)] rounded-md font-medium text-sm border border-[var(--border-secondary)]"
        style={{ fontFamily: 'var(--font-code)' }}
        {...props}
      >
        {children}
      </code>
    );
  },
  p({ children }) {
    return <p className="mb-4 last:mb-0 leading-7 text-[var(--text-primary)]">{children}</p>;
  },
  ul({ children }) {
    return <ul className="list-disc pl-5 mb-4 space-y-2 marker:text-[var(--accent-primary)]">{children}</ul>;
  },
  ol({ children }) {
    return <ol className="list-decimal pl-5 mb-4 space-y-2 marker:font-bold marker:text-[var(--text-secondary)]">{children}</ol>;
  },
  li({ children }) {
    return <li className="pl-1">{children}</li>;
  },
  a({ href, children }) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--accent-primary)] font-medium underline decoration-2 decoration-[var(--accent-primary)]/30 hover:decoration-[var(--accent-primary)] transition-colors"
      >
        {children}
      </a>
    );
  },
  blockquote({ children }) {
    return (
      <blockquote className="border-l-4 border-[var(--accent-primary)] pl-4 py-1 my-4 bg-[var(--bg-tertiary)]/50 rounded-r-lg italic text-[var(--text-secondary)]">
        {children}
      </blockquote>
    );
  },
  h1({ children }) { return <h1 className="text-2xl font-bold mt-8 mb-4 text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>{children}</h1>; },
  h2({ children }) { return <h2 className="text-xl font-bold mt-6 mb-3 text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>{children}</h2>; },
  h3({ children }) { return <h3 className="text-lg font-bold mt-5 mb-2 text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>{children}</h3>; },
};

const WaitingIndicator = () => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-3 py-2" style={{ fontFamily: 'var(--font-ui)' }}>
      <span className="shimmer-text text-sm font-medium">
        Thinking{elapsed > 0 ? `... ${elapsed}s` : ''}
      </span>
      <span className="flex items-center gap-1">
        <span className="thinking-dot" />
        <span className="thinking-dot" />
        <span className="thinking-dot" />
      </span>
    </div>
  );
};

const DemoMessage = React.memo(({ message, isLast, isStreaming }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  const renderedMarkdown = useMemo(() => (
    <ReactMarkdown remarkPlugins={remarkPlugins} components={markdownComponents}>
      {message.content}
    </ReactMarkdown>
  ), [message.content]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { }
  };

  if (isUser) {
    return (
      <div className="flex w-full px-4 md:px-6 py-4 justify-end">
        <div className="max-w-[80%]">
          <div
            className="inline-block px-4 py-3 rounded-2xl bg-[var(--bg-tertiary)] text-[var(--text-primary)] text-base leading-relaxed"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full px-4 md:px-6 py-4">
      <div className="w-full max-w-4xl mx-auto">
        {isAssistant && isStreaming && isLast && !message.content && (
          <WaitingIndicator />
        )}

        <div
          className={`prose prose-base max-w-none ${message.error ? 'text-[var(--error)]' : 'text-[var(--text-primary)]'}`}
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          {renderedMarkdown}

          {isStreaming && isLast && message.content && (
            <span className="streaming-cursor" />
          )}
        </div>

        {isAssistant && message.content && !isStreaming && (
          <div className="flex items-center gap-4 mt-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] transition-colors"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </>
              )}
            </button>
            {message.routing && (
              <span
                className="inline-flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]"
                style={{ fontFamily: 'var(--font-code)' }}
              >
                <svg className="w-3 h-3 text-[var(--accent-primary)]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                {message.routing.model_used}
                {message.routing.prompt_tokens > 0 && (
                  <span className="text-[var(--text-tertiary)]">
                    {' '}({message.routing.prompt_tokens + message.routing.completion_tokens} tokens)
                  </span>
                )}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

const DemoChat = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useHermaAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);
  const textareaRef = useRef(null);
  const abortRef = useRef(null);

  const limitReached = userMessageCount >= MAX_DEMO_MESSAGES;

  useEffect(() => {
    setPageMeta('Try the Demo', "Try Herma's intelligent model router for free. Same quality, fraction of the price.");
    return () => resetPageMeta();
  }, []);

  // Abort any in-flight request on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 200) + 'px';
    }
  }, [input]);

  const sendMessage = useCallback(async (content) => {
    if (!content.trim() || isStreaming || limitReached) return;

    setError(null);
    const newUserMsg = { role: 'user', content: content.trim(), id: Date.now() };
    const assistantMsg = { role: 'assistant', content: '', id: Date.now() + 1 };

    setMessages((prev) => [...prev, newUserMsg, assistantMsg]);
    setUserMessageCount((c) => c + 1);
    setInput('');
    setIsStreaming(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const controller = new AbortController();
    abortRef.current = controller;

    // Build the messages array for the API (all messages so far + the new user message)
    const apiMessages = [...messages, newUserMsg].map(({ role, content: c }) => ({ role, content: c }));

    try {
      await streamDemoChat(apiMessages, {
        signal: controller.signal,
        onChunk: (chunk) => {
          if (chunk.type === 'content') {
            setMessages((prev) => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              updated[updated.length - 1] = { ...last, content: last.content + chunk.content };
              return updated;
            });
          } else if (chunk.type === 'routing') {
            setMessages((prev) => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              updated[updated.length - 1] = { ...last, routing: chunk.routing };
              return updated;
            });
          }
        },
        onDone: () => {
          setIsStreaming(false);
          abortRef.current = null;
        },
        onError: (err) => {
          setIsStreaming(false);
          abortRef.current = null;
          setError(err.message);
          // Remove the empty assistant message on error
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === 'assistant' && !last.content) {
              return prev.slice(0, -1);
            }
            return prev;
          });
        },
      });
    } catch (err) {
      if (err.name === 'AbortError') return;
      setIsStreaming(false);
      abortRef.current = null;
      setError(err.message);
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant' && !last.content) {
          return prev.slice(0, -1);
        }
        return prev;
      });
    }
  }, [isStreaming, limitReached, messages]);

  const stopGeneration = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
      setIsStreaming(false);
    }
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handlePromptClick = (promptText) => {
    sendMessage(promptText);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-screen bg-[var(--bg-primary)] overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)] z-20 flex-shrink-0">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <img src="/herma-logo.png" alt="Herma" className="w-6 h-6 rounded-md" />
          <span className="herma-wordmark text-base text-[var(--text-primary)]">
            HERMA
          </span>
        </button>

        <div className="flex-1" />

        <span
          className="text-xs text-[var(--text-tertiary)] hidden sm:inline"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          {userMessageCount}/{MAX_DEMO_MESSAGES} messages
        </span>

        {!isAuthenticated && (
          <button
            onClick={() => navigate('/login?signup=true')}
            className="px-4 py-1.5 bg-[var(--accent-primary)] text-[var(--text-inverse)] text-sm font-semibold rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Sign up free
          </button>
        )}
        {isAuthenticated && (
          <button
            onClick={() => navigate('/chat')}
            className="px-4 py-1.5 bg-[var(--accent-primary)] text-[var(--text-inverse)] text-sm font-semibold rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Go to chat
          </button>
        )}
      </div>

      {/* Demo banner — only shown to non-authenticated users */}
      {!isAuthenticated && (
      <div className="flex items-center justify-center gap-3 px-4 py-2 bg-[var(--accent-primary)]/10 border-b border-[var(--accent-primary)]/20 flex-shrink-0">
        <span
          className="text-sm text-[var(--accent-primary)] font-medium"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          Free demo — sign up to unlock all models, memory, and web search.
        </span>
        <button
          onClick={() => navigate('/login?signup=true')}
          className="px-3 py-1 bg-[var(--accent-primary)] text-[var(--text-inverse)] text-xs font-semibold rounded-md hover:bg-[var(--accent-hover)] transition-colors"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          Sign up
        </button>
      </div>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-hidden relative flex flex-col">
        {isEmpty ? (
          /* Empty state with suggested prompts */
          <div className="flex-1 flex flex-col items-center justify-center px-4 overflow-auto">
            <div className="w-full max-w-2xl flex flex-col items-center">
              <h1
                className="text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-3 text-center"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Try Herma
              </h1>
              <p
                className="text-base text-[var(--text-secondary)] mb-8 text-center max-w-lg"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Ask anything. Herma routes your prompt to the best model for the job.
              </p>

              {/* Input area */}
              <div className="w-full rounded-2xl border border-[var(--border-secondary)] bg-[var(--bg-tertiary)]/80 backdrop-blur-sm shadow-lg focus-within:border-[var(--accent-primary)] focus-within:ring-2 focus-within:ring-[var(--accent-primary)]/10 transition-all">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything..."
                  rows={3}
                  className="w-full resize-none bg-transparent outline-none text-base text-[var(--text-primary)] placeholder-[var(--text-tertiary)] p-4 pb-2"
                  style={{ fontFamily: 'var(--font-ui)', maxHeight: '200px' }}
                  autoFocus
                />
                <div className="flex items-center justify-end px-3 pb-3">
                  <button
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim()}
                    className="w-9 h-9 rounded-xl bg-[var(--accent-primary)] text-white flex items-center justify-center hover:bg-[var(--accent-hover)] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-md"
                    aria-label="Send message"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Suggested prompts */}
              <div className="flex flex-wrap gap-2 mt-5 justify-center">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.label}
                    onClick={() => handlePromptClick(prompt.text)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[var(--border-secondary)] bg-[var(--bg-secondary)] text-sm text-[var(--text-secondary)] hover:border-[var(--border-accent)] hover:text-[var(--text-primary)] hover:shadow-sm transition-all"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    <span className="text-[var(--accent-primary)]">{prompt.icon}</span>
                    {prompt.label}
                  </button>
                ))}
              </div>

              <p
                className="text-[11px] text-[var(--text-tertiary)] text-center mt-8 opacity-70"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Herma can make mistakes. Consider checking important information.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Messages area */}
            <div
              className="flex-1 overflow-y-auto w-full scrollbar-thin scrollbar-thumb-[var(--bg-hover)] hover:scrollbar-thumb-[var(--bg-active)] pb-32"
              ref={containerRef}
            >
              <div className="max-w-4xl mx-auto w-full">
                {messages.map((msg, i) => (
                  <DemoMessage
                    key={msg.id || `msg-${i}`}
                    message={msg}
                    isLast={i === messages.length - 1}
                    isStreaming={isStreaming && i === messages.length - 1 && msg.role === 'assistant'}
                  />
                ))}
                <div className="h-4 w-full" />
              </div>
            </div>

            {/* Error display */}
            {error && (
              <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-30 px-4 py-2 bg-[var(--error)]/10 border border-[var(--error)]/30 rounded-lg">
                <p className="text-sm text-[var(--error)]" style={{ fontFamily: 'var(--font-ui)' }}>{error}</p>
              </div>
            )}

            {/* Gradient fade */}
            <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none h-24 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/80 to-transparent" />

            {/* Input or limit-reached prompt */}
            <div className="absolute bottom-0 w-full z-20 pointer-events-auto">
              <div className="border-t border-[var(--border-primary)] bg-[var(--bg-secondary)]/60 backdrop-blur-md pt-4 pb-6">
                <div className="max-w-4xl mx-auto px-4">
                  {limitReached ? (
                    /* Sign up prompt when limit reached */
                    <div className="flex flex-col items-center gap-3 py-4">
                      <p
                        className="text-base text-[var(--text-secondary)] text-center"
                        style={{ fontFamily: 'var(--font-ui)' }}
                      >
                        You've used all {MAX_DEMO_MESSAGES} demo messages.
                      </p>
                      <button
                        onClick={() => navigate(isAuthenticated ? '/chat' : '/login?signup=true')}
                        className="px-6 py-3 bg-[var(--accent-primary)] text-[var(--text-inverse)] font-semibold rounded-lg hover:bg-[var(--accent-hover)] transition-colors shadow-lg"
                        style={{ fontFamily: 'var(--font-ui)' }}
                      >
                        {isAuthenticated ? 'Go to chat' : 'Sign up free — $1.00 credit included'}
                      </button>
                      <p
                        className="text-xs text-[var(--text-tertiary)]"
                        style={{ fontFamily: 'var(--font-ui)' }}
                      >
                        No credit card required
                      </p>
                    </div>
                  ) : (
                    /* Normal input */
                    <div className="relative flex flex-col bg-[var(--bg-tertiary)]/80 backdrop-blur-sm rounded-2xl border border-[var(--border-secondary)] shadow-lg px-4 py-3 focus-within:border-[var(--accent-primary)] focus-within:ring-2 focus-within:ring-[var(--accent-primary)]/10 transition-all">
                      <div className="flex items-end gap-2">
                        <textarea
                          ref={textareaRef}
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Send a message..."
                          rows={1}
                          className="flex-1 resize-none bg-transparent outline-none text-base text-[var(--text-primary)] placeholder-[var(--text-tertiary)] py-1"
                          style={{ fontFamily: 'var(--font-ui)', maxHeight: '200px' }}
                        />
                        {isStreaming ? (
                          <button
                            onClick={stopGeneration}
                            className="flex-shrink-0 w-10 h-10 rounded-xl bg-[var(--error)] text-white flex items-center justify-center hover:bg-opacity-90 transition-colors shadow-md"
                            aria-label="Stop generating"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <rect x="6" y="6" width="12" height="12" rx="1" />
                            </svg>
                          </button>
                        ) : (
                          <button
                            onClick={() => sendMessage(input)}
                            disabled={!input.trim()}
                            className="flex-shrink-0 w-10 h-10 rounded-xl bg-[var(--accent-primary)] text-white flex items-center justify-center hover:bg-[var(--accent-hover)] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform active:scale-95"
                            aria-label="Send message"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                  {!limitReached && (
                    <p className="text-[11px] text-[var(--text-tertiary)] text-center mt-3 font-medium opacity-70" style={{ fontFamily: 'var(--font-ui)' }}>
                      {MAX_DEMO_MESSAGES - userMessageCount} message{MAX_DEMO_MESSAGES - userMessageCount !== 1 ? 's' : ''} remaining in demo
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DemoChat;

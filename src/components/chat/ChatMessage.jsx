import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';

const WaitingIndicator = () => (
  <div className="flex items-center gap-3 py-2" style={{ fontFamily: 'var(--font-ui)' }}>
    <span className="shimmer-text text-sm font-medium">Thinking</span>
    <span className="flex items-center gap-1">
      <span className="thinking-dot" />
      <span className="thinking-dot" />
      <span className="thinking-dot" />
    </span>
  </div>
);

const ThinkingSection = ({ reasoning, isStreaming }) => {
  const [expanded, setExpanded] = useState(true);
  const [autoCollapsed, setAutoCollapsed] = useState(false);

  // Auto-collapse when streaming ends (content has started)
  useEffect(() => {
    if (!isStreaming && !autoCollapsed) {
      setExpanded(false);
      setAutoCollapsed(true);
    }
  }, [isStreaming, autoCollapsed]);

  const wordCount = reasoning ? reasoning.split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="mb-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        <svg
          className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="flex items-center gap-1.5">
          {isStreaming && (
            <span className="flex items-center gap-0.5">
              <span className="thinking-dot" style={{ width: 4, height: 4 }} />
              <span className="thinking-dot" style={{ width: 4, height: 4 }} />
              <span className="thinking-dot" style={{ width: 4, height: 4 }} />
            </span>
          )}
          {isStreaming ? <span className="shimmer-text">Thinking</span> : 'Thinking'}
          {!expanded && !isStreaming && (
            <span className="text-xs text-[var(--text-tertiary)] opacity-60 ml-1">
              ({wordCount} words)
            </span>
          )}
        </span>
      </button>

      {expanded && (
        <div className="mt-2 ml-5 pl-3 border-l-2 border-[var(--border-secondary)] text-sm text-[var(--text-tertiary)] leading-relaxed whitespace-pre-wrap" style={{ fontFamily: 'var(--font-ui)' }}>
          {reasoning}
          {isStreaming && (
            <span className="streaming-cursor" style={{ height: '0.8em', opacity: 0.7 }} />
          )}
        </div>
      )}
    </div>
  );
};

const ChatMessage = ({ message, isLast, isStreaming, onRegenerate }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

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
        {/* Waiting indicator — shows before any tokens arrive */}
        {isAssistant && isStreaming && isLast && !message.reasoning && !message.content && (
          <WaitingIndicator />
        )}

        {/* Collapsible thinking/reasoning section */}
        {isAssistant && message.reasoning && (
          <ThinkingSection
            reasoning={message.reasoning}
            isStreaming={isStreaming && isLast && !message.content}
          />
        )}

        <div className="prose prose-base prose-invert max-w-none text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-ui)' }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
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
              table({ children }) {
                return (
                  <div className="overflow-x-auto my-6 rounded-xl border border-[var(--border-secondary)] shadow-sm">
                    <table className="min-w-full divide-y divide-[var(--border-secondary)]">{children}</table>
                  </div>
                );
              },
              thead({ children }) {
                return <thead className="bg-[var(--bg-tertiary)]">{children}</thead>;
              },
              tbody({ children }) {
                return <tbody className="bg-[var(--bg-secondary)] divide-y divide-[var(--border-secondary)]">{children}</tbody>;
              },
              tr({ children }) {
                return <tr>{children}</tr>;
              },
              th({ children }) {
                return <th className="px-6 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider" style={{ fontFamily: 'var(--font-ui)' }}>{children}</th>;
              },
              td({ children }) {
                return <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-tertiary)]">{children}</td>;
              },
              hr() {
                return <hr className="my-8 border-[var(--border-secondary)]" />;
              },
              h1({ children }) { return <h1 className="text-2xl font-bold mt-8 mb-4 text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>{children}</h1> },
              h2({ children }) { return <h2 className="text-xl font-bold mt-6 mb-3 text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>{children}</h2> },
              h3({ children }) { return <h3 className="text-lg font-bold mt-5 mb-2 text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>{children}</h3> },
            }}
          >
            {message.content}
          </ReactMarkdown>

          {isStreaming && isLast && message.content && (
            <span className="streaming-cursor" />
          )}
        </div>

        {/* Message Actions */}
        {isAssistant && message.content && !isStreaming && (
          <div className="flex items-center gap-4 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
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

            {isLast && onRegenerate && (
              <button
                onClick={onRegenerate}
                className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] transition-colors"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Regenerate
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;

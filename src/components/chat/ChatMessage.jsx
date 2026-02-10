import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';

const ChatMessage = ({ message, isLast, isStreaming, onRegenerate }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className={`flex gap-3 py-5 px-4 ${isUser ? 'justify-end' : ''} ${isAssistant ? 'border-b border-[var(--border-primary)]' : ''}`}>
      {isAssistant && (
        <div
          className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center text-sm font-bold bg-[var(--accent-primary)] text-[var(--text-inverse)] shadow-sm"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          H
        </div>
      )}
      <div className={`group max-w-[80%] ${isUser ? 'order-first' : ''}`}>
        <div
          className={`${
            isUser
              ? 'rounded-2xl px-4 py-3 bg-[var(--accent-primary)] text-white rounded-br-md shadow-sm'
              : 'text-[var(--text-primary)]'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap text-sm" style={{ fontFamily: 'var(--font-body)' }}>
              {message.content}
            </p>
          ) : (
            <div className="prose prose-sm prose-invert max-w-none text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-body)' }}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    const content = String(children);
                    // Block code: has language class or multiline content
                    if (match) {
                      return (
                        <CodeBlock language={match[1]}>
                          {content.replace(/\n$/, '')}
                        </CodeBlock>
                      );
                    }
                    if (content.includes('\n')) {
                      return (
                        <CodeBlock language="">
                          {content.replace(/\n$/, '')}
                        </CodeBlock>
                      );
                    }
                    // Inline code
                    return (
                      <code
                        className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded text-sm text-[var(--accent-primary)]"
                        style={{ fontFamily: 'var(--font-code)' }}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  p({ children }) {
                    return <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>;
                  },
                  ul({ children }) {
                    return <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>;
                  },
                  ol({ children }) {
                    return <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>;
                  },
                  h1({ children }) {
                    return <h1 className="text-xl font-bold text-[var(--text-primary)] mt-5 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>{children}</h1>;
                  },
                  h2({ children }) {
                    return <h2 className="text-lg font-bold text-[var(--text-primary)] mt-4 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>{children}</h2>;
                  },
                  h3({ children }) {
                    return <h3 className="text-base font-semibold text-[var(--text-primary)] mt-3 mb-1.5" style={{ fontFamily: 'var(--font-heading)' }}>{children}</h3>;
                  },
                  a({ href, children }) {
                    return (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="text-[var(--accent-primary)] underline">
                        {children}
                      </a>
                    );
                  },
                  table({ children }) {
                    return (
                      <div className="overflow-x-auto my-2">
                        <table className="border-collapse border border-[var(--border-secondary)] text-sm">{children}</table>
                      </div>
                    );
                  },
                  th({ children }) {
                    return <th className="border border-[var(--border-secondary)] px-3 py-1 bg-[var(--bg-tertiary)] font-semibold">{children}</th>;
                  },
                  td({ children }) {
                    return <td className="border border-[var(--border-secondary)] px-3 py-1">{children}</td>;
                  },
                  blockquote({ children }) {
                    return <blockquote className="border-l-3 border-[var(--accent-primary)]/30 pl-4 my-2 text-[var(--text-secondary)] italic">{children}</blockquote>;
                  },
                  li({ children }) {
                    return <li className="leading-relaxed">{children}</li>;
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
              {isStreaming && isLast && (
                <span className="inline-block w-0.5 h-4 bg-[var(--accent-primary)] animate-pulse ml-0.5 align-text-bottom" />
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        {isAssistant && message.content && !isStreaming && (
          <div className="flex items-center gap-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleCopy}
              className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] flex items-center gap-1.5 px-2 py-1 rounded-md transition-all"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {copied ? 'Copied!' : 'Copy'}
            </button>
            {isLast && onRegenerate && (
              <button
                onClick={onRegenerate}
                className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] flex items-center gap-1.5 px-2 py-1 rounded-md transition-all"
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
      {isUser && (
        <div
          className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center text-sm font-bold bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-hover)] text-white shadow-sm"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          U
        </div>
      )}
    </div>
  );
};

export default ChatMessage;

import React from 'react';

const prompts = [
  {
    title: 'Privacy routing',
    text: 'How does Herma route sensitive data to private models?',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: 'Cost savings',
    text: 'How much can I save by routing non-sensitive requests to public models?',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
  },
  {
    title: 'Compare models',
    text: 'What are the differences between GPT-4, Claude, and Gemini?',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    title: 'Write code',
    text: 'Write a Python script that calls the Herma API with streaming',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
  },
];

const EmptyState = ({ onPromptClick }) => {
  return (
    <div className="flex-1 min-h-0 flex flex-col items-center px-4 bg-[var(--bg-primary)] overflow-auto">
      <div className="flex-[3]" />
      <h1
        className="text-4xl text-[var(--accent-primary)] mb-2 herma-wordmark"
      >
        HΞRMΛ
      </h1>
      <p className="text-[var(--text-tertiary)] mb-6 text-sm" style={{ fontFamily: 'var(--font-ui)' }}>
        Ask anything — Herma routes to the best model for you.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
        {prompts.map((prompt) => (
          <button
            key={prompt.title}
            onClick={() => onPromptClick(prompt.text)}
            className="text-left p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] shadow-sm hover:shadow-md hover:border-[var(--border-accent)] transition-all group"
          >
            <div className="flex items-center gap-2 mb-1.5 text-[var(--accent-primary)]">
              {prompt.icon}
              <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-ui)' }}>
                {prompt.title}
              </span>
            </div>
            <p className="text-xs text-[var(--text-tertiary)] leading-relaxed" style={{ fontFamily: 'var(--font-ui)' }}>
              {prompt.text}
            </p>
          </button>
        ))}
      </div>
      <div className="flex-[1]" />
    </div>
  );
};

export default EmptyState;

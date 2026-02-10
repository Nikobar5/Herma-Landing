import React from 'react';

const prompts = [
  {
    title: 'Explain a concept',
    text: 'Explain quantum computing in simple terms',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    title: 'Write code',
    text: 'Write a Python function to find prime numbers',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
  },
  {
    title: 'Analyze data',
    text: 'How do I analyze a CSV dataset with pandas?',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    title: 'Creative writing',
    text: 'Help me write a short story about a time traveler',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
  },
];

const EmptyState = ({ onPromptClick }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4">
      <h1
        className="text-3xl font-bold text-[var(--highlight-color)] mb-2"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        HERMA Chat
      </h1>
      <p className="text-gray-500 mb-8 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
        How can I help you today?
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
        {prompts.map((prompt) => (
          <button
            key={prompt.title}
            onClick={() => onPromptClick(prompt.text)}
            className="text-left p-4 rounded-xl border border-gray-200 hover:border-[var(--highlight-color)]/30 hover:bg-[var(--secondary-bg)]/5 transition-all group"
          >
            <div className="flex items-center gap-2 mb-1.5 text-[var(--highlight-color)]">
              {prompt.icon}
              <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-ui)' }}>
                {prompt.title}
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
              {prompt.text}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;

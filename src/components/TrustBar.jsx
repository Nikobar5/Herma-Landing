import React from 'react';

const INTEGRATIONS = [
  'OpenAI SDK',
  'LangChain',
  'Vercel AI SDK',
  'Python requests',
  'Any OpenAI client',
];

const TrustBar = () => (
  <div className="border-y border-[var(--border-primary)] bg-[var(--bg-secondary)] py-5">
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
        <span
          className="text-xs uppercase tracking-widest text-[var(--text-tertiary)] font-medium mr-2"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          Works with
        </span>
        {INTEGRATIONS.map((name) => (
          <span
            key={name}
            className="px-3 py-1.5 rounded-md bg-[var(--bg-primary)] border border-[var(--border-secondary)] text-xs font-mono text-[var(--text-secondary)] whitespace-nowrap"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default TrustBar;

import React from 'react';

export default function WhatIsHerma() {
  return (
    <section id="what-is-herma" className="py-16 sm:py-20 bg-[var(--bg-primary)]">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">

        <h2
          className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-8 tracking-tight"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          What is Herma?
        </h2>

        <p
          className="text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-secondary)' }}
        >
          Most AI agent costs today come from using models that aren't the most cost-efficient for the task. Herma is a model router that sits between the agent and the model,
          choosing the{' '}
          <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>right model for the task in real-time</span>.
        </p>

      </div>
    </section>
  );
}

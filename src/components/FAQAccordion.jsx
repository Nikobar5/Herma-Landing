import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    id: 1,
    q: 'How does OpenAI SDK compatibility work?',
    a: "Herma is fully compatible with the OpenAI SDK. You only need to change two things: set the baseURL to our API endpoint and replace your API key with your Herma key. Everything else — your prompts, model names, streaming logic — stays exactly the same. We support the chat completions endpoint that virtually every AI library and framework uses.",
  },
  {
    id: 2,
    q: 'How much does Herma cost?',
    a: "Herma charges a flat $2 per million input tokens and $8 per million output tokens — regardless of which model processes your request. There are no minimums, no seat fees, and credits never expire. Pay-as-you-go: you only pay for what you use.",
  },
  {
    id: 3,
    q: 'How much can I realistically save?',
    a: "Most customers save 60–90% compared to going directly to frontier model APIs. The savings depend on your use case: simpler tasks like summarization, classification, and Q&A are routed to cheaper models while maintaining the same quality. Complex reasoning and coding tasks that genuinely need frontier models are routed there automatically.",
  },
  {
    id: 4,
    q: 'How does Herma decide which model to use?',
    a: "Herma analyzes each incoming request — the prompt length, complexity, required capabilities, and your cost settings — and routes it to the most cost-effective model that can handle it at frontier quality. The routing logic is continuously updated as new models are released and benchmarked.",
  },
  {
    id: 5,
    q: 'Is Herma suitable for production workloads?',
    a: "Yes. Herma is designed for production use: we maintain high availability, support streaming responses, and route requests with low added latency. Our benchmark results (available at /blog/how-we-benchmark) show that quality is maintained across 8 industry-standard benchmarks. Thousands of API calls are routed through Herma daily.",
  },
];

const FAQAccordion = () => {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <section className="py-14 bg-[var(--bg-primary)]">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Common questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-xl border transition-all duration-200
                  ${isOpen
                    ? 'border-[var(--border-accent)] bg-[var(--bg-secondary)] shadow-md'
                    : 'border-[var(--border-secondary)] bg-[var(--bg-primary)] hover:border-[var(--border-hover)]'
                  }`}
              >
                <button
                  onClick={() => setExpandedId(isOpen ? null : faq.id)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`font-semibold text-sm sm:text-base transition-colors ${isOpen ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'}`}
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {faq.q}
                  </span>
                  <svg
                    className={`w-5 h-5 flex-shrink-0 text-[var(--text-tertiary)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p
                    className="px-5 pb-5 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center mt-8 text-sm text-[var(--text-tertiary)]" style={{ fontFamily: 'var(--font-ui)' }}>
          More questions?{' '}
          <Link to="/faq" className="text-[var(--accent-primary)] hover:underline underline-offset-2 font-medium">
            See our full FAQ →
          </Link>
        </p>
      </div>
    </section>
  );
};

export default FAQAccordion;

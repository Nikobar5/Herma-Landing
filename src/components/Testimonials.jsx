import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const TESTIMONIALS = [
  {
    quote: "Switched our entire inference pipeline to Herma in an afternoon. Same output quality, 70% lower bill. Should have done this months ago.",
    name: "Alex R.",
    role: "Senior ML Engineer",
    company: "Series B SaaS",
    initials: "AR",
  },
  {
    quote: "The OpenAI SDK compatibility is the killer feature. Changed two lines of code and Herma handled the rest. Cost went from $800/mo to $240.",
    name: "Priya K.",
    role: "Founder",
    company: "Developer Tools Startup",
    initials: "PK",
  },
  {
    quote: "We ran our own evals and Herma matches GPT-4o quality on 90%+ of our production queries. The routing logic is surprisingly smart about when to escalate.",
    name: "Jordan M.",
    role: "Staff Engineer",
    company: "AI-Native Company",
    initials: "JM",
  },
];

const Stars = () => (
  <div className="flex gap-0.5 mb-4">
    {[...Array(5)].map((_, i) => (
      <svg key={i} className="w-4 h-4 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const Testimonials = () => {
  useScrollAnimation();

  return (
    <section className="py-20 bg-[var(--bg-primary)]">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-on-scroll fade-up">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Trusted by engineers cutting their AI bill
          </h2>
          <p className="text-[var(--text-secondary)] text-base sm:text-lg" style={{ fontFamily: 'var(--font-body)' }}>
            Real results from developers who made the switch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className={`animate-on-scroll fade-up delay-${(i + 1) * 100} bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border-secondary)] shadow-md hover:shadow-lg hover:border-[var(--border-accent)] transition-all duration-300 flex flex-col`}
            >
              <Stars />
              <p
                className="text-[var(--text-primary)] italic leading-relaxed flex-grow mb-5 text-sm sm:text-base"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                "{t.quote}"
              </p>
              <hr className="border-[var(--border-primary)] mb-4" />
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[var(--accent-primary)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                     style={{ fontFamily: 'var(--font-heading)' }}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
                    {t.name}
                  </p>
                  <p className="text-xs text-[var(--text-tertiary)]" style={{ fontFamily: 'var(--font-ui)' }}>
                    {t.role} · {t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

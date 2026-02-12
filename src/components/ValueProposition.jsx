import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const ValueProposition = () => {
  const [headerRef, headerVisible] = useScrollAnimation(0.1);
  const [cardsRef, cardsVisible] = useScrollAnimation(0.1);

  return (
    <section className="pt-24 pb-12 sm:pb-16 bg-[var(--bg-primary)]" id="value-proposition">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={`text-center mb-12 sm:mb-16 md:mb-20 animate-on-scroll animate-fade-up ${headerVisible ? 'is-visible' : ''}`}
        >
          <h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-4 tracking-tight px-2 sm:px-0"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Massive Cost Savings With Smart Routing
          </h2>
          <p
            className="text-base sm:text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto px-2 sm:px-0"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Herma's intelligent API delivers enterprise-grade cost optimization by routing every request to the best model for the job.
          </p>
        </div>

        {/* Cost Savings Stats */}
        <div
          ref={cardsRef}
          className={`grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16 md:mb-20 animate-on-scroll animate-fade-left ${cardsVisible ? 'is-visible' : ''}`}
        >
          {/* Cloud Routing Savings */}
          <div className="relative bg-[var(--bg-secondary)] p-5 sm:p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[var(--border-primary)] hover:border-[var(--border-accent)] group">
            <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-[var(--accent-primary)] opacity-5 rounded-bl-full"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[var(--accent-primary)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
                <div
                  className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--accent-primary)] tracking-tight whitespace-nowrap"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  20-40<span className="text-xl sm:text-2xl md:text-3xl">%</span>
                </div>
              </div>
              <h3
                className="text-lg sm:text-xl font-semibold text-[var(--text-primary)] mb-2 sm:mb-3"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Model Routing Savings
              </h3>
              <p
                className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Unified routing across all cloud AI providers optimizes model selection, reducing costs while expanding model access.
              </p>
            </div>
          </div>

          {/* Privacy Routing Savings */}
          <div className="relative bg-[var(--bg-secondary)] p-5 sm:p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[var(--border-primary)] hover:border-purple-500/30 group">
            <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-purple-500 opacity-5 rounded-bl-full"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div
                  className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-400 tracking-tight whitespace-nowrap"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  50<span className="text-xl sm:text-2xl md:text-3xl">%</span>
                </div>
              </div>
              <h3
                className="text-lg sm:text-xl font-semibold text-[var(--text-primary)] mb-2 sm:mb-3"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Privacy Routing Savings
              </h3>
              <p
                className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Smart filtering routes only truly sensitive data to premium private infrastructure, processing safe requests through cost-effective public models.
              </p>
            </div>
          </div>

          {/* Total Savings */}
          <div className="relative bg-[var(--bg-secondary)] p-5 sm:p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-emerald-500/30 hover:border-emerald-400/50 group">
            <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-emerald-500 opacity-5 rounded-bl-full"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div
                  className="text-3xl sm:text-4xl md:text-5xl font-bold text-emerald-400 tracking-tight whitespace-nowrap"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  60-70<span className="text-xl sm:text-2xl md:text-3xl">%</span>
                </div>
              </div>
              <h3
                className="text-lg sm:text-xl font-semibold text-[var(--text-primary)] mb-2 sm:mb-3"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Total Combined Savings
              </h3>
              <p
                className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Stack both optimizations to achieve industry-leading cost efficiency without sacrificing privacy, compliance, or model capabilities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;

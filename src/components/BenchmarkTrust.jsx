import React, { useState, useEffect, useRef } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

// Animated counter that counts up from 0 to target when visible
const AnimatedNumber = ({ target, suffix = '', prefix = '', duration = 1500, decimals = 0 }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * target);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [hasStarted, target, duration]);

  const formatted = decimals > 0 ? count.toFixed(decimals) : Math.round(count);

  return (
    <span ref={ref}>
      {prefix}{formatted}{suffix}
    </span>
  );
};

const BENCHMARKS = [
  { name: 'MMLU', samples: 500, quality: 98.2 },
  { name: 'ARC-Challenge', samples: 300, quality: 100.7 },
  { name: 'GSM8K', samples: 300, quality: 102.1 },
  { name: 'HumanEval+', samples: 164, quality: 102.1 },
  { name: 'MBPP+', samples: 378, quality: 105.8 },
];

const BenchmarkTrust = () => {
  const [headerRef, headerVisible] = useScrollAnimation(0.1);
  const [statsRef, statsVisible] = useScrollAnimation(0.1);
  const [tableRef, tableVisible] = useScrollAnimation(0.05);
  const [ctaRef, ctaVisible] = useScrollAnimation(0.1);

  return (
    <section className="py-24 bg-[var(--bg-primary)]" id="benchmarks">
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
            Proven Quality. Real Benchmarks.
          </h2>
          <p
            className="text-base sm:text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto px-2 sm:px-0"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Tested against frontier models on industry-standard benchmarks. The numbers speak for themselves.
          </p>
        </div>

        {/* Stat Cards */}
        <div
          ref={statsRef}
          className={`grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16 md:mb-20 animate-on-scroll animate-fade-up ${statsVisible ? 'is-visible' : ''}`}
        >
          {/* Quality Retained */}
          <div className="relative group">
            {/* Gradient border glow */}
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] via-purple-500 to-emerald-500 opacity-30 group-hover:opacity-50 blur-[1px] transition-opacity duration-500" />
            <div className="relative bg-[var(--bg-secondary)] rounded-2xl p-6 sm:p-8 text-center border border-transparent">
              <p
                className="text-3xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-[var(--accent-primary)] to-purple-400 bg-clip-text text-transparent mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                <AnimatedNumber target={98} suffix="" duration={1200} />-<AnimatedNumber target={106} suffix="%" duration={1400} />
              </p>
              <p
                className="text-sm sm:text-base text-[var(--text-secondary)]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                of frontier quality retained
              </p>
            </div>
          </div>

          {/* Cost Savings */}
          <div className="relative group delay-100">
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-emerald-500 via-[var(--accent-primary)] to-purple-500 opacity-30 group-hover:opacity-50 blur-[1px] transition-opacity duration-500" />
            <div className="relative bg-[var(--bg-secondary)] rounded-2xl p-6 sm:p-8 text-center border border-transparent">
              <p
                className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-400 to-[var(--accent-primary)] bg-clip-text text-transparent mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                <AnimatedNumber target={89} suffix="%" duration={1300} />
              </p>
              <p
                className="text-sm sm:text-base text-[var(--text-secondary)]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                average cost savings
              </p>
            </div>
          </div>

          {/* Tests Passing */}
          <div className="relative group delay-200">
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-purple-500 via-emerald-500 to-[var(--accent-primary)] opacity-30 group-hover:opacity-50 blur-[1px] transition-opacity duration-500" />
            <div className="relative bg-[var(--bg-secondary)] rounded-2xl p-6 sm:p-8 text-center border border-transparent">
              <p
                className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                <AnimatedNumber target={540} suffix="+" duration={1500} />
              </p>
              <p
                className="text-sm sm:text-base text-[var(--text-secondary)]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                tests passing
              </p>
            </div>
          </div>
        </div>

        {/* Benchmark Table */}
        <div
          ref={tableRef}
          className={`max-w-3xl mx-auto mb-10 sm:mb-12 animate-on-scroll animate-scale ${tableVisible ? 'is-visible' : ''}`}
        >
          <div className="bg-[var(--bg-secondary)] rounded-2xl sm:rounded-3xl shadow-xl border border-[var(--border-secondary)] overflow-hidden">
            {/* Table Header */}
            <div className="px-6 sm:px-8 py-4 sm:py-5 border-b border-[var(--border-secondary)]">
              <h3
                className="text-lg sm:text-xl font-bold text-[var(--text-primary)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Benchmark Results
              </h3>
              <p
                className="text-xs sm:text-sm text-[var(--text-tertiary)] mt-1"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Quality vs. frontier model baseline (100% = equivalent)
              </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border-secondary)]">
                    <th
                      className="text-left px-4 sm:px-6 md:px-8 py-3 text-[10px] sm:text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      Benchmark
                    </th>
                    <th
                      className="text-center px-2 sm:px-4 py-3 text-[10px] sm:text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      Samples
                    </th>
                    <th
                      className="text-right px-4 sm:px-6 md:px-8 py-3 text-[10px] sm:text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      Quality vs Frontier
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {BENCHMARKS.map((bench, i) => (
                    <tr
                      key={bench.name}
                      className={`border-b border-[var(--border-primary)] last:border-b-0 hover:bg-[var(--bg-hover)] transition-colors duration-150 ${
                        tableVisible ? 'animate-fade-in-row' : 'opacity-0'
                      }`}
                      style={{ animationDelay: tableVisible ? `${i * 80}ms` : '0ms' }}
                    >
                      <td className="px-4 sm:px-6 md:px-8 py-3 sm:py-4">
                        <span
                          className="text-xs sm:text-sm md:text-base font-semibold text-[var(--text-primary)]"
                          style={{ fontFamily: 'var(--font-ui)' }}
                        >
                          {bench.name}
                        </span>
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4 text-center">
                        <span
                          className="text-xs sm:text-sm text-[var(--text-secondary)]"
                          style={{ fontFamily: 'var(--font-ui)' }}
                        >
                          {bench.samples.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-right">
                        <span
                          className={`inline-flex items-center gap-1.5 text-sm sm:text-base font-bold ${
                            bench.quality >= 100 ? 'text-emerald-400' : 'text-[var(--accent-primary)]'
                          }`}
                          style={{ fontFamily: 'var(--font-heading)' }}
                        >
                          {bench.quality}%
                          {bench.quality >= 100 && (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div
          ref={ctaRef}
          className={`text-center animate-on-scroll animate-fade-up ${ctaVisible ? 'is-visible' : ''}`}
        >
          <a
            href="/blog/how-we-benchmark"
            className="inline-flex items-center gap-2 text-[var(--accent-primary)] hover:text-[var(--accent-hover)] font-semibold text-base sm:text-lg transition-colors duration-200"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Read the full methodology
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>

      {/* Row fade-in animation */}
      <style>{`
        @keyframes fadeInRow {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-row {
          animation: fadeInRow 0.4s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default BenchmarkTrust;

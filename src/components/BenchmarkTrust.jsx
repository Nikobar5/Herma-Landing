import React, { useState, useEffect, useRef } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const AnimatedNumber = ({ target, suffix = '', duration = 1500, decimals = 0 }) => {
  const [count, setCount] = useState(target);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          setCount(0);
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
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * target);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [hasStarted, target, duration]);

  const formatted = decimals > 0 ? count.toFixed(decimals) : Math.round(count);
  return <span ref={ref}>{formatted}{suffix}</span>;
};

const BenchmarkTrust = () => {
  const [headerRef, headerVisible] = useScrollAnimation(0.1);
  const [statsRef, statsVisible] = useScrollAnimation(0.1);
  const [ctaRef, ctaVisible] = useScrollAnimation(0.1);

  return (
    <section className="py-16 bg-[var(--bg-primary)]" id="benchmarks">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={`text-center mb-10 sm:mb-14 animate-on-scroll animate-fade-up ${headerVisible ? 'is-visible' : ''}`}
        >
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3 tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Built for quality, not just speed
          </h2>
          <p
            className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Herma is tested against frontier models on industry-standard benchmarks — so cheaper never means worse.
          </p>
        </div>

        {/* Stat Cards */}
        <div
          ref={statsRef}
          className={`grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10 animate-on-scroll animate-fade-up ${statsVisible ? 'is-visible' : ''}`}
        >
          <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 sm:p-8 text-center border border-[var(--border-secondary)] hover:border-[var(--border-accent)] transition-colors duration-300">
            <p
              className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[var(--accent-primary)] to-purple-400 bg-clip-text text-transparent mb-2"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <AnimatedNumber target={8} suffix="/8" duration={1200} />
            </p>
            <p className="text-sm text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>
              benchmarks at frontier quality
            </p>
          </div>

          <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 sm:p-8 text-center border border-[var(--border-secondary)] hover:border-[var(--border-accent)] transition-colors duration-300">
            <p
              className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#5BAF8A] to-[var(--accent-primary)] bg-clip-text text-transparent mb-2"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <AnimatedNumber target={89} suffix="%" duration={1300} />
            </p>
            <p className="text-sm text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>
              average cost savings
            </p>
          </div>

          <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 sm:p-8 text-center border border-[var(--border-secondary)] hover:border-[var(--border-accent)] transition-colors duration-300">
            <p
              className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 to-[#5BAF8A] bg-clip-text text-transparent mb-2"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <AnimatedNumber target={868} suffix="+" duration={1500} />
            </p>
            <p className="text-sm text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>
              tests passing
            </p>
          </div>
        </div>

        {/* CTA */}
        <div
          ref={ctaRef}
          className={`text-center animate-on-scroll animate-fade-up ${ctaVisible ? 'is-visible' : ''}`}
        >
          <a
            href="/blog/how-we-benchmark"
            className="inline-flex items-center gap-2 text-[var(--accent-primary)] hover:text-[var(--accent-hover)] font-semibold text-sm sm:text-base transition-colors duration-200"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Read the full methodology
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default BenchmarkTrust;

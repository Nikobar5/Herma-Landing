import React from 'react';
import { useNavigate } from 'react-router-dom';
import SmartRouterComparison from './SmartRouterComparison';

const Hero = () => {
  const navigate = useNavigate();

  const handleTryItOut = () => {
    navigate('/demo');
  };

  return (
    <div className="relative w-full bg-[var(--bg-primary)] overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full min-h-[70vh] sm:min-h-[80vh] md:min-h-[85vh] flex items-center justify-center pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[var(--accent-primary)] opacity-5 rounded-bl-full transform -translate-y-1/4 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-indigo-500 opacity-5 rounded-tr-full transform translate-y-1/4 -translate-x-1/4"></div>
        </div>

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center">
            {/* Main Headline */}
            <div className="w-full max-w-5xl mb-8">
              {/* Differentiator badge */}
              <div className="mb-6 animate-hero">
                <span
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/5 text-[var(--accent-primary)]"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
                  Drop-in replacement for any AI model
                </span>
              </div>

              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-[1.1] tracking-tight animate-hero"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                <span className="text-[var(--text-primary)]">Same AI Quality.</span>
                <br />
                <span className="text-[var(--accent-primary)]">60–90% Cheaper.</span>
              </h1>

              <p
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-[var(--text-secondary)] mb-8 font-normal max-w-3xl mx-auto leading-relaxed px-2 sm:px-0 animate-hero-delayed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Swap your API key to Herma. We route each query to the cheapest model that matches frontier quality, automatically. No code changes, no quality loss.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 animate-hero-delayed-more">
                <button
                  onClick={() => navigate('/login?signup=true')}
                  className="group relative overflow-hidden px-8 py-4 bg-[var(--accent-primary)] text-[var(--text-inverse)] font-semibold rounded-lg shadow-lg hover:shadow-xl hover:bg-[var(--accent-hover)] transform transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/30 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] min-w-[200px]"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    Get started free
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
                <button
                  onClick={handleTryItOut}
                  className="px-8 py-4 border border-[var(--border-secondary)] text-[var(--text-secondary)] font-semibold rounded-lg hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all duration-200 min-w-[200px]"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Try the demo
                </button>
              </div>


            </div>

            {/* Smart Comparison Component */}
            <div id="see-the-difference" className="w-full mt-8 animate-hero-delayed-more">
              <SmartRouterComparison />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;

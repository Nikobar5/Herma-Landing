import React, { useRef } from 'react';

const Hero = () => {
  const videoRef = useRef(null);

  const handleBookDemo = () => {
    window.open('https://calendly.com/hermalocal/30min', '_blank');
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
              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-[1.1] tracking-tight animate-hero"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                <span className="text-[var(--text-primary)]">Unify All AI Models</span>
                <br />
                <span className="text-[var(--accent-primary)]">Across Privacy Levels</span>
              </h1>

              <p
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-[var(--text-secondary)] mb-8 font-normal max-w-3xl mx-auto leading-relaxed px-2 sm:px-0 animate-hero-delayed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Herma intelligently routes AI requests based on data sensitivity to maximize cost savings and model access while maintaining privacy.
              </p>

              {/* CTA Button - Centered */}
              <div className="flex items-center justify-center mb-4 animate-hero-delayed-more">
                <button
                  onClick={handleBookDemo}
                  className="group relative overflow-hidden px-8 py-4 bg-[var(--accent-primary)] text-[var(--text-inverse)] font-semibold rounded-lg shadow-lg hover:shadow-xl hover:bg-[var(--accent-hover)] transform transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/30 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] min-w-[200px]"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    Book a Demo
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
              </div>

            </div>

            {/* Demo Video Section */}
            <div className="w-full max-w-5xl mt-8 animate-hero-delayed-more">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[var(--border-secondary)] p-1 bg-[var(--bg-secondary)]">
                {/* MacOS-style Window Chrome */}
                <div className="absolute top-0 left-0 right-0 h-10 bg-[var(--bg-tertiary)] backdrop-blur-sm flex items-center justify-center px-4 z-20 rounded-t-2xl">
                  <div className="absolute left-4 flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-[var(--text-tertiary)] text-sm font-medium" style={{ fontFamily: 'var(--font-ui)' }}>Herma Platform Demo</span>
                </div>

                {/* Video Container */}
                <div className="bg-[var(--bg-primary)] rounded-b-2xl pt-10 overflow-hidden">
                  <div className="relative" style={{ paddingBottom: "56.25%" }}>
                    <video
                      ref={videoRef}
                      className="absolute top-0 left-0 w-full h-full object-cover"
                      controls
                      playsInline
                      poster="/demo-poster.jpg"
                    >
                      <source src="/demo.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              </div>

              {/* Video Caption */}
              <p
                className="mt-6 text-sm text-[var(--text-tertiary)] italic"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Watch how Herma's data governor filters sensitive information in real-time, routing requests to the optimal AI model based on privacy requirements.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;

import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [ctaRef, ctaVisible] = useScrollAnimation(0.1);

  const handleBookDemo = () => {
    window.open('https://calendly.com/hermalocal/30min', '_blank');
  };

  return (
    <>
      {/* CTA Section */}
      <section className="py-10 sm:py-12 md:py-16 bg-white">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            ref={ctaRef}
            className={`bg-[#faf8f3] rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 md:p-12 border border-[#e8e4dc] animate-on-scroll animate-fade-up ${ctaVisible ? 'is-visible' : ''}`}
          >
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#242424] mb-6 sm:mb-8"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Interested in trying it out?
            </h2>

            <button
              onClick={handleBookDemo}
              className="group relative overflow-hidden px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-[var(--highlight-color)] text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform transition-all duration-200 hover:scale-[1.05] focus:outline-none focus:ring-2 focus:ring-[var(--highlight-color)]/30 focus:ring-offset-2 mb-6 sm:mb-8"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative flex items-center justify-center gap-2 text-sm sm:text-base">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Schedule a Demo
              </span>
            </button>

            <p
              className="text-sm sm:text-base text-gray-600"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Or contact us at{' '}
              <a
                href="mailto:hermalocal@gmail.com"
                className="text-[var(--highlight-color)] hover:text-indigo-700 underline transition-colors"
              >
                hermalocal@gmail.com
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Bar */}
      <footer className="bg-[var(--primary-bg)] border-t border-gray-200 py-6">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600 text-sm" style={{ fontFamily: 'var(--font-ui)' }}>
            <p>&copy; {currentYear} <span className="text-[var(--highlight-color)] font-medium">Herma</span> — Unifying all AI models across privacy levels</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
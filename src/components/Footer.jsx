import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [ctaRef, ctaVisible] = useScrollAnimation(0.1);
  const navigate = useNavigate();

  return (
    <>
      {/* CTA Section */}
      <section className="py-10 sm:py-12 md:py-16 bg-[var(--bg-primary)]">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            ref={ctaRef}
            className={`bg-[var(--bg-secondary)] rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 md:p-12 border border-[var(--border-secondary)] animate-on-scroll animate-fade-up ${ctaVisible ? 'is-visible' : ''}`}
          >
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-6 sm:mb-8"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Ready to try it out?
            </h2>

            <button
              onClick={() => navigate('/chat')}
              className="group relative overflow-hidden px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-[var(--accent-primary)] text-[var(--text-inverse)] font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:bg-[var(--accent-hover)] transform transition-all duration-200 hover:scale-[1.05] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/30 focus:ring-offset-2 focus:ring-offset-[var(--bg-secondary)] mb-6 sm:mb-8"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative flex items-center justify-center gap-2 text-sm sm:text-base">
                Try it out
                <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>

            <p
              className="text-sm sm:text-base text-[var(--text-secondary)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Need enterprise security or custom specifications?{' '}
              <a
                href="mailto:hermalocal@gmail.com"
                className="text-[var(--accent-primary)] hover:text-[var(--accent-hover)] underline transition-colors"
              >
                Contact us
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Bar */}
      <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-primary)] py-6">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[var(--text-tertiary)] text-sm" style={{ fontFamily: 'var(--font-ui)' }}>
            <p>&copy; {currentYear} <span className="text-[var(--accent-primary)] font-medium tracking-widest">HERMA</span> — Intelligent model routing for every workload</p>
            <div className="flex items-center gap-4">
              <Link to="/privacy-policy" className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [ctaRef, ctaVisible] = useScrollAnimation(0.1);
  const navigate = useNavigate();

  const columns = [
    {
      title: 'Product',
      links: [
        { label: 'Docs', to: '/docs' },
        { label: 'Chat', to: '/chat' },
        { label: 'Pricing', to: '/upgrade' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', to: '/about' },
        { label: 'FAQ', to: '/faq' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', to: '/privacy-policy' },
        { label: 'Terms of Service', to: '/terms-of-service' },
      ],
    },
  ];

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
              className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-[var(--accent-primary)] text-[var(--text-inverse)] font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:bg-[var(--accent-hover)] transform transition-all duration-200 hover:scale-[1.05] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/30 focus:ring-offset-2 focus:ring-offset-[var(--bg-secondary)] mb-6 sm:mb-8"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              <span className="flex items-center justify-center gap-2 text-sm sm:text-base">
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
                href="https://calendly.com/nick-pianfetti-hermaai/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-primary)] hover:text-[var(--accent-hover)] underline transition-colors"
              >
                Contact us
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-primary)] py-10 sm:py-12">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top: columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
            {/* Brand column */}
            <div className="col-span-2 sm:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <img src="/herma-logo.png" alt="Herma" className="h-8 w-8 rounded-lg" />
                <span
                  className="text-lg font-bold text-[var(--text-primary)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  HERMA
                </span>
              </Link>
              <p className="text-sm text-[var(--text-tertiary)] mb-4" style={{ fontFamily: 'var(--font-ui)' }}>
                Route every AI call to the best model for the price.
              </p>
              {/* Social */}
              <a
                href="https://www.linkedin.com/company/herma-ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] transition-colors"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            </div>

            {/* Link columns */}
            {columns.map((col) => (
              <div key={col.title}>
                <h4
                  className="text-sm font-semibold text-[var(--text-primary)] mb-3 uppercase tracking-wider"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  {col.title}
                </h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                        style={{ fontFamily: 'var(--font-ui)' }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="pt-6 border-t border-[var(--border-primary)]">
            <p
              className="text-sm text-[var(--text-tertiary)] text-center"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              &copy; {currentYear} Herma AI LLC. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;

import React, { useState } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const ComplianceSection = () => {
  const [copiedButton, setCopiedButton] = useState(null);
  const email = 'hermalocal@gmail.com';
  const [headerRef, headerVisible] = useScrollAnimation(0.1);
  const [featuresRef, featuresVisible] = useScrollAnimation(0.1);
  const [complianceRef, complianceVisible] = useScrollAnimation(0.1);

  const copyToClipboard = (buttonId) => {
    navigator.clipboard.writeText(email).then(() => {
      setCopiedButton(buttonId);
      setTimeout(() => setCopiedButton(null), 2000);
    });
  };

  return (
    <section className="py-24 bg-[var(--bg-primary)]" id="compliance">
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
            Enterprise-Grade Security & Compliance
          </h2>
          <p
            className="text-base sm:text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto px-2 sm:px-0"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Airtight privacy guarantees backed by industry-leading security standards
          </p>
        </div>

        {/* Security Features Grid */}
        <div
          ref={featuresRef}
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-12 md:mb-16 animate-on-scroll animate-fade-right ${featuresVisible ? 'is-visible' : ''}`}
        >
          {/* Zero Data Retention */}
          <div className="bg-[var(--bg-secondary)] p-4 sm:p-6 rounded-xl border border-[var(--border-primary)] hover:border-[var(--border-accent)] hover:shadow-lg transition-all duration-300">
            <div className="mb-3 sm:mb-4">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3
              className="text-base sm:text-lg font-bold text-[var(--text-primary)] mb-2"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Zero Data Retention
            </h3>
            <p
              className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Our private cloud API providers guarantee zero storage of your request data so nothing is logged or retained.
            </p>
          </div>

          {/* SOC Compliance */}
          <div className="bg-[var(--bg-secondary)] p-4 sm:p-6 rounded-xl border border-[var(--border-primary)] hover:border-purple-500/30 hover:shadow-lg transition-all duration-300">
            <div className="mb-3 sm:mb-4">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3
              className="text-base sm:text-lg font-bold text-[var(--text-primary)] mb-2"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              SOC Compliant
            </h3>
            <p
              className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              All private cloud API endpoints meet SOC 2 Type II compliance standards for secure data handling.
            </p>
          </div>

          {/* Encryption at Rest */}
          <div className="bg-[var(--bg-secondary)] p-4 sm:p-6 rounded-xl border border-[var(--border-primary)] hover:border-emerald-500/30 hover:shadow-lg transition-all duration-300">
            <div className="mb-3 sm:mb-4">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3
              className="text-base sm:text-lg font-bold text-[var(--text-primary)] mb-2"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Encryption at Rest
            </h3>
            <p
              className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              All stored data in private cloud APIs is encrypted with AES-256 encryption when at rest in our systems.
            </p>
          </div>

          {/* Encryption in Transit */}
          <div className="bg-[var(--bg-secondary)] p-4 sm:p-6 rounded-xl border border-[var(--border-primary)] hover:border-orange-500/30 hover:shadow-lg transition-all duration-300">
            <div className="mb-3 sm:mb-4">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            </div>
            <h3
              className="text-base sm:text-lg font-bold text-[var(--text-primary)] mb-2"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Encryption in Transit
            </h3>
            <p
              className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              TLS 1.3 encryption protects all data in transit between your systems and our APIs.
            </p>
          </div>
        </div>

        {/* Compliance Standards */}
        <div
          ref={complianceRef}
          className={`bg-[var(--bg-secondary)] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-xl border border-[var(--border-secondary)] mb-10 sm:mb-12 md:mb-16 animate-on-scroll animate-scale ${complianceVisible ? 'is-visible' : ''}`}
        >
          <h3
            className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-[var(--text-primary)] mb-8 sm:mb-10 md:mb-12"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Regulatory Compliance
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
            {/* GDPR */}
            <div className="bg-[var(--bg-tertiary)] rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border-2 border-[var(--border-accent)]">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--accent-muted)] rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4
                    className="text-lg sm:text-xl font-bold text-[var(--text-primary)] mb-2 sm:mb-3"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    GDPR Ready
                  </h4>
                  <p
                    className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed mb-3 sm:mb-4"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    Our architecture supports GDPR compliance with data residency controls, right to deletion, and processing transparency.
                  </p>
                  <button
                    onClick={() => copyToClipboard('gdpr')}
                    className="text-sm sm:text-base text-[var(--accent-primary)] font-semibold hover:underline inline-flex items-center gap-2 transition-all duration-200"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {copiedButton === 'gdpr' ? (
                      <>
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-[var(--success)]">Copied to clipboard!</span>
                      </>
                    ) : (
                      <>
                        Contact for details
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* HIPAA */}
            <div className="bg-[var(--bg-tertiary)] rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border-2 border-purple-500/30">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/15 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4
                    className="text-lg sm:text-xl font-bold text-[var(--text-primary)] mb-2 sm:mb-3"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    HIPAA Compatible
                  </h4>
                  <p
                    className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed mb-3 sm:mb-4"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    Healthcare organizations can use Herma with appropriate Business Associate Agreements and technical safeguards in place.
                  </p>
                  <button
                    onClick={() => copyToClipboard('hipaa')}
                    className="text-sm sm:text-base text-purple-400 font-semibold hover:underline inline-flex items-center gap-2 transition-all duration-200"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {copiedButton === 'hipaa' ? (
                      <>
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-[var(--success)]">Copied to clipboard!</span>
                      </>
                    ) : (
                      <>
                        Contact for details
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComplianceSection;

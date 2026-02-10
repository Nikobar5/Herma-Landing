import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const HowItWorksSection = () => {
  const [headerRef, headerVisible] = useScrollAnimation(0.1);
  const [diagramRef, diagramVisible] = useScrollAnimation(0.05);

  return (
    <section className="pt-12 sm:pt-16 pb-24 bg-[var(--bg-primary)]" id="how-it-works">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={`text-center mb-6 sm:mb-8 md:mb-10 animate-on-scroll animate-fade-up ${headerVisible ? 'is-visible' : ''}`}
        >
          <h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-4 tracking-tight px-2 sm:px-0"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            How Herma Works
          </h2>
          <p
            className="text-base sm:text-lg md:text-xl text-[var(--text-secondary)] max-w-4xl mx-auto px-2 sm:px-0"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Intelligent privacy routing that maintains on-prem security with public cloud efficiency
          </p>
        </div>

        {/* Main Unified Diagram */}
        <div
          ref={diagramRef}
          className={`bg-[var(--bg-secondary)] rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 lg:p-10 shadow-2xl border border-[var(--border-secondary)] mb-4 sm:mb-6 md:mb-8 animate-on-scroll animate-scale ${diagramVisible ? 'is-visible' : ''}`}
        >

          {/* Privacy Constitution Callout */}
          <div className="bg-[var(--accent-muted)] rounded-xl sm:rounded-2xl p-2 sm:p-4 mb-6 sm:mb-8 md:mb-10 border-2 border-[var(--border-accent)]">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-ui)' }}>
                  Privacy Constitution
                </h3>
                <p className="text-sm sm:text-base text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>
                  Define any data type as private: PII, financial records, proprietary code, medical info, or custom patterns. The Data Governor enforces your rules with precision.
                </p>
              </div>
            </div>
          </div>

          {/* Visual Flow Diagram */}
          <div className="relative">

            {/* Step 1: Request Arrives */}
            <div className="flex flex-col items-center mb-8">
              <div className="bg-[var(--bg-tertiary)] rounded-xl p-6 w-full max-w-md border-2 border-[var(--border-secondary)]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-[var(--text-tertiary)] rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-lg text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-ui)' }}>
                    User Prompt
                  </h4>
                </div>
                <p className="text-sm text-[var(--text-secondary)] ml-11" style={{ fontFamily: 'var(--font-body)' }}>
                  Request sent with potentially sensitive data
                </p>
              </div>
              {/* Arrow Down */}
              <div className="my-4">
                <svg className="w-8 h-8 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>

            {/* Step 2: Data Governor - THE KEY COMPONENT */}
            <div className="flex flex-col items-center mb-6 sm:mb-8">
              <div className="bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-hover)] rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 w-full max-w-2xl border-2 sm:border-4 border-indigo-300/20 shadow-2xl relative">
                <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-xl sm:text-2xl text-white mb-1 sm:mb-2" style={{ fontFamily: 'var(--font-ui)' }}>
                      Data Governor
                    </h4>
                    <p className="text-indigo-100 text-xs sm:text-sm mb-2 sm:mb-4" style={{ fontFamily: 'var(--font-body)' }}>
                      Runs in your private environment • Analyzes every request in real-time
                    </p>
                  </div>
                </div>

                {/* Data Governor Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="bg-white/10 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-1 sm:mb-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="text-white font-semibold text-xs sm:text-sm" style={{ fontFamily: 'var(--font-ui)' }}>Detects Sensitive Data</span>
                    </div>
                    <p className="text-indigo-100 text-xs" style={{ fontFamily: 'var(--font-body)' }}>
                      Uses optimized LLMs to identify private information per your constitution
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-1 sm:mb-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="text-white font-semibold text-xs sm:text-sm" style={{ fontFamily: 'var(--font-ui)' }}>Intelligent Routing</span>
                    </div>
                    <p className="text-indigo-100 text-xs" style={{ fontFamily: 'var(--font-body)' }}>
                      Routes to optimal destination based on sensitivity and model requirements
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-1 sm:mb-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="text-white font-semibold text-xs sm:text-sm" style={{ fontFamily: 'var(--font-ui)' }}>Sanitizes Requests</span>
                    </div>
                    <p className="text-indigo-100 text-xs" style={{ fontFamily: 'var(--font-body)' }}>
                      Extracts sensitive data, sends only sanitized content to cloud
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-1 sm:mb-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-white font-semibold text-xs sm:text-sm" style={{ fontFamily: 'var(--font-ui)' }}>Ultra-Low Latency</span>
                    </div>
                    <p className="text-indigo-100 text-xs" style={{ fontFamily: 'var(--font-body)' }}>
                      Processing overhead &lt;500ms — imperceptible to end users
                    </p>
                  </div>
                </div>

                <div className="bg-white/20 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
                  <p className="text-white text-center text-xs sm:text-sm font-medium" style={{ fontFamily: 'var(--font-ui)' }}>
                    ✓ Airtight filtering ensures privacy at on-prem standards
                  </p>
                </div>
              </div>

              {/* Three-way arrow */}
              <div className="my-6 flex items-center justify-center gap-4">
                <svg className="w-6 h-6 text-[var(--text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <span className="text-[var(--text-secondary)] font-semibold text-sm" style={{ fontFamily: 'var(--font-ui)' }}>Routes to optimal destination</span>
                <svg className="w-6 h-6 text-[var(--text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>

            {/* Step 3: Three Routing Destinations */}
            <div className="mb-4 sm:mb-6 text-center px-2 sm:px-0">
              <p className="text-xs sm:text-sm text-[var(--text-tertiary)] italic" style={{ fontFamily: 'var(--font-body)' }}>
                Configure routing based on your security needs — most companies route between Private + Public Cloud, with custom on-prem integration available for high security environments
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* On-Prem */}
              <div className="bg-[var(--bg-tertiary)] rounded-xl p-4 sm:p-6 border-2 border-[var(--border-secondary)] shadow-lg">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[var(--text-tertiary)] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                    </svg>
                  </div>
                  <h5 className="font-bold text-sm sm:text-base text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-ui)' }}>On-Premises</h5>
                </div>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-2 sm:mb-3" style={{ fontFamily: 'var(--font-body)' }}>
                  Ultra-sensitive data stays in your air-gapped infrastructure
                </p>
                <div className="bg-[var(--bg-hover)] rounded px-2 sm:px-3 py-1 text-xs font-semibold text-[var(--text-secondary)] mb-2 inline-block" style={{ fontFamily: 'var(--font-ui)' }}>
                  Maximum Security
                </div>
                <p className="text-xs text-[var(--text-tertiary)] italic" style={{ fontFamily: 'var(--font-body)' }}>
                  Your deployed models
                </p>
              </div>

              {/* Private Cloud */}
              <div className="bg-[var(--bg-tertiary)] rounded-xl p-4 sm:p-6 border-2 border-[var(--border-accent)] shadow-lg">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[var(--accent-primary)] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h5 className="font-bold text-sm sm:text-base text-[var(--accent-primary)]" style={{ fontFamily: 'var(--font-ui)' }}>Private Cloud</h5>
                </div>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-2 sm:mb-3" style={{ fontFamily: 'var(--font-body)' }}>
                  Sanitized business data to enterprise private APIs with zero retention
                </p>
                <div className="bg-[var(--accent-muted)] rounded px-2 sm:px-3 py-1 text-xs font-semibold text-[var(--accent-primary)] mb-2 inline-block" style={{ fontFamily: 'var(--font-ui)' }}>
                  Balanced Performance
                </div>
                <p className="text-xs text-[var(--text-tertiary)] italic" style={{ fontFamily: 'var(--font-body)' }}>
                  ChatGPT, Claude, Gemini, etc. — unified under optimized router
                </p>
              </div>

              {/* Public Cloud */}
              <div className="bg-[var(--bg-tertiary)] rounded-xl p-4 sm:p-6 border-2 border-emerald-500/30 shadow-lg sm:col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                  </div>
                  <h5 className="font-bold text-sm sm:text-base text-emerald-400" style={{ fontFamily: 'var(--font-ui)' }}>Public Cloud</h5>
                </div>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-2 sm:mb-3" style={{ fontFamily: 'var(--font-body)' }}>
                  Fully sanitized requests to all models at lowest cost
                </p>
                <div className="bg-emerald-500/15 rounded px-2 sm:px-3 py-1 text-xs font-semibold text-emerald-400 mb-2 inline-block" style={{ fontFamily: 'var(--font-ui)' }}>
                  Maximum Efficiency
                </div>
                <p className="text-xs text-[var(--text-tertiary)] italic" style={{ fontFamily: 'var(--font-body)' }}>
                  ChatGPT, Claude, Gemini, etc. — unified under optimized router
                </p>
              </div>
            </div>

            {/* Step 4: Processing & Return */}
            <div className="flex flex-col items-center">
              <div className="my-4">
                <svg className="w-8 h-8 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>

              <div className="bg-[var(--bg-tertiary)] rounded-xl p-6 w-full max-w-md border-2 border-emerald-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-lg text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-ui)' }}>
                    Secure Response
                  </h4>
                </div>
                <p className="text-sm text-[var(--text-secondary)] ml-11" style={{ fontFamily: 'var(--font-body)' }}>
                  Data Governor restores any extracted sensitive data locally, returns complete response
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorksSection;

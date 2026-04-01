import React, { useEffect, useRef, useState } from 'react';
import { useHermaAuth } from '../context/HermaAuthContext';
import { useNavigate } from 'react-router-dom';
import { getBalance } from '../services/hermaApi';
import { trackPayment } from '../services/analyticsTracker';

const SuccessPage = () => {
  const { isAuthenticated, loading: authLoading } = useHermaAuth();
  const navigate = useNavigate();
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(10);
  const conversionFired = useRef(false);

  // Fire conversion event once when the authenticated user lands on this page.
  // useRef guards against double-fire in React StrictMode.
  useEffect(() => {
    if (!isAuthenticated || authLoading) return;
    if (conversionFired.current) return;
    conversionFired.current = true;
    trackPayment();
    if (window.posthog) window.posthog.capture('payment_completed');
  }, [isAuthenticated, authLoading]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      // Preserve intent — user will be sent back to /success after login
      navigate('/login?next=/success');
      return;
    }

    let cancelled = false;
    let attempt = 0;
    // Webhook processing can take a few seconds after Stripe redirects.
    // Poll with increasing delays: 2s, 4s, 6s, 8s (up to ~20s total wait).
    const maxAttempts = 4;
    const delays = [2000, 4000, 6000, 8000];

    const fetchBalance = () => {
      getBalance()
        .then((data) => {
          if (cancelled) return;
          const bal = data.balance ?? data.balance_usd ?? 0;
          setBalance(bal);
          setLoading(false);
        })
        .catch(() => {
          if (cancelled) return;
          attempt++;
          if (attempt < maxAttempts) {
            setTimeout(fetchBalance, delays[attempt]);
          } else {
            setLoading(false);
          }
        });
    };

    const timer = setTimeout(fetchBalance, delays[0]);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [isAuthenticated, authLoading, navigate]);

  // Auto-redirect countdown to dashboard (not chat — user may want to verify balance first)
  useEffect(() => {
    if (!isAuthenticated || loading) return;
    if (countdown <= 0) {
      navigate('/dashboard/billing');
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [isAuthenticated, loading, countdown, navigate]);

  // While auth context is hydrating from localStorage, show a neutral spinner
  // rather than the "Please Sign In" screen which users see as an error.
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-primary)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-20 pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#5BAF8A]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[#5BAF8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1
            className="text-4xl font-bold text-[var(--text-primary)] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Payment Successful!
          </h1>
          <p className="text-xl text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>
            Your credits have been added to your account.
          </p>
        </div>

        {/* Balance Card */}
        <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-hover)] px-6 py-4">
            <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>Account Balance</h2>
          </div>
          <div className="p-8 text-center">
            {loading ? (
              <div>
                <div className="animate-spin inline-block w-8 h-8 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full mb-4"></div>
                <p className="text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>Confirming your payment...</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-2" style={{ fontFamily: 'var(--font-body)' }}>This usually takes a few seconds.</p>
              </div>
            ) : (
              <>
                <div className="text-sm text-[var(--text-tertiary)] mb-2" style={{ fontFamily: 'var(--font-ui)' }}>Current Balance</div>
                <div className="text-5xl font-bold text-[var(--accent-primary)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  ${Number(balance).toFixed(2)}
                </div>
                <div className="text-sm text-[var(--text-tertiary)]" style={{ fontFamily: 'var(--font-ui)' }}>in API credits</div>
                <p className="text-xs text-[var(--text-tertiary)] mt-3" style={{ fontFamily: 'var(--font-body)' }}>
                  Credits may take up to 30 seconds to appear. Check your billing page if the balance looks incorrect.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] p-6 mb-8">
          <div className="grid sm:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/chat')}
              className="px-6 py-3 bg-[var(--accent-primary)] text-[var(--text-inverse)] font-semibold rounded-lg hover:bg-[var(--accent-hover)] transition duration-300 flex items-center justify-center gap-2"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Start Chatting
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-[var(--bg-tertiary)] text-[var(--text-primary)] font-semibold rounded-lg hover:bg-[var(--bg-hover)] transition duration-300 flex items-center justify-center gap-2 border border-[var(--border-secondary)]"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Dashboard
            </button>

            <button
              onClick={() => navigate('/dashboard/billing')}
              className="px-6 py-3 border-2 border-[var(--border-secondary)] text-[var(--text-secondary)] font-semibold rounded-lg hover:border-[var(--border-accent)] hover:text-[var(--text-primary)] transition duration-300 flex items-center justify-center gap-2"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Billing
            </button>
          </div>
          {!loading && (
            <p className="text-center text-xs text-[var(--text-tertiary)] mt-4" style={{ fontFamily: 'var(--font-ui)' }}>
              Redirecting to billing in {countdown}s...{' '}
              <button
                onClick={() => setCountdown(999)}
                className="underline hover:text-[var(--text-secondary)] transition-colors"
              >
                Stay here
              </button>
            </p>
          )}
        </div>

        {/* Help */}
        <div className="bg-[var(--accent-muted)] border border-[var(--border-accent)] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Need Help?</h3>
          <p className="text-[var(--text-secondary)] mb-4" style={{ fontFamily: 'var(--font-body)' }}>
            If you have questions about your credits or need assistance, we're here to help.
          </p>
          <a
            href="mailto:support@hermaai.com"
            className="px-4 py-2 bg-[var(--accent-primary)] text-[var(--text-inverse)] rounded-lg hover:bg-[var(--accent-hover)] transition duration-300 inline-block"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;

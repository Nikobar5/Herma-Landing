import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHermaAuth } from '../context/HermaAuthContext';
import { createCheckout, getBalance } from '../services/hermaApi';

const CREDIT_PACKAGES = [
  { id: '10', amount: '$10', credits: '$10.00', description: 'Starter' },
  { id: '25', amount: '$25', credits: '$25.00', description: 'Popular', popular: true },
  { id: '50', amount: '$50', credits: '$50.00', description: 'Professional' },
  { id: '100', amount: '$100', credits: '$100.00', description: 'Enterprise' },
];

const PurchasePage = () => {
  const { isAuthenticated } = useHermaAuth();
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      getBalance()
        .then((data) => setBalance(data.balance ?? data.balance_usd ?? 0))
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const handlePurchase = async (packageId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await createCheckout(packageId);
      window.location.href = data.checkout_url;
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to start checkout. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-32">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold mb-6 text-[var(--text-primary)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Add <span className="text-[var(--accent-primary)]">API Credits</span>
          </h1>
          <p
            className="text-xl text-[var(--text-secondary)] mb-4"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Pay as you go — no subscriptions, no commitments
          </p>
          {isAuthenticated && balance !== null && (
            <div className="inline-flex items-center gap-2 bg-[var(--bg-secondary)] px-6 py-3 rounded-full border border-[var(--border-secondary)]">
              <span className="text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-ui)' }}>Current Balance:</span>
              <span className="text-2xl font-bold text-[var(--accent-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>${Number(balance).toFixed(2)}</span>
            </div>
          )}
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 rounded-lg">
            <p className="text-[var(--error)] text-sm text-center" style={{ fontFamily: 'var(--font-body)' }}>{error}</p>
          </div>
        )}

        {/* Credit Packages */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {CREDIT_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative bg-[var(--bg-secondary)] rounded-2xl border p-8 flex flex-col items-center transition-all duration-300 hover:-translate-y-1 ${
                pkg.popular ? 'border-[var(--accent-primary)] shadow-[var(--shadow-glow)]' : 'border-[var(--border-primary)] hover:border-[var(--border-accent)]'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span
                    className="bg-[var(--accent-primary)] text-[var(--text-inverse)] px-4 py-1 rounded-full text-sm font-semibold"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    Most Popular
                  </span>
                </div>
              )}
              <div className="text-sm font-medium text-[var(--text-tertiary)] mb-2" style={{ fontFamily: 'var(--font-ui)' }}>{pkg.description}</div>
              <div className="text-4xl font-bold text-[var(--text-primary)] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>{pkg.amount}</div>
              <div className="text-sm text-[var(--text-secondary)] mb-6" style={{ fontFamily: 'var(--font-body)' }}>in API credits</div>
              <button
                onClick={() => handlePurchase(pkg.id)}
                disabled={loading}
                className={`w-full px-6 py-3 font-semibold rounded-xl transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                  pkg.popular
                    ? 'bg-[var(--accent-primary)] text-[var(--text-inverse)] hover:bg-[var(--accent-hover)]'
                    : 'bg-transparent border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] hover:bg-[var(--accent-muted)]'
                }`}
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                {loading ? 'Processing...' : 'Buy Credits'}
              </button>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] p-6 mb-12">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-ui)' }}>100% Private</div>
                <div className="text-sm text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>Data never leaves your device</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-ui)' }}>Secure Payment</div>
                <div className="text-sm text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>Protected by Stripe</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-ui)' }}>Pay As You Go</div>
                <div className="text-sm text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>No subscriptions required</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sign-in prompt for unauthenticated users */}
        {!isAuthenticated && (
          <div className="text-center">
            <div className="bg-[var(--bg-secondary)] p-8 rounded-xl border border-[var(--border-primary)] max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Sign in to purchase credits</h2>
              <p className="text-[var(--text-secondary)] mb-6" style={{ fontFamily: 'var(--font-body)' }}>Create an account or sign in to get started</p>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-3 bg-[var(--accent-primary)] text-[var(--text-inverse)] font-semibold rounded-lg hover:bg-[var(--accent-hover)] transition duration-300"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchasePage;

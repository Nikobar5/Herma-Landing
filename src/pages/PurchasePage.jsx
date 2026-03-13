import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHermaAuth } from '../context/HermaAuthContext';
import { createCheckout, getBalance } from '../services/hermaApi';

const QUICK_AMOUNTS = [5, 10, 25, 50, 100];

const PurchasePage = () => {
  const { isAuthenticated } = useHermaAuth();
  const [balance, setBalance] = useState(null);
  const [amount, setAmount] = useState('');
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

  const parsedAmount = parseFloat(amount);
  const isValidAmount = !isNaN(parsedAmount) && parsedAmount >= 5 && parsedAmount <= 1000;

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isValidAmount) return;

    setLoading(true);
    setError(null);

    try {
      const data = await createCheckout(parsedAmount);
      window.location.href = data.checkout_url;
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to start checkout. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-32">
      <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1
            className="text-4xl md:text-5xl font-bold mb-6 text-[var(--text-primary)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Add <span className="text-[var(--accent-primary)]">Credits</span>
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
          <div className="mb-6 p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 rounded-lg">
            <p className="text-[var(--error)] text-sm text-center" style={{ fontFamily: 'var(--font-body)' }}>{error}</p>
          </div>
        )}

        {/* Credit Amount Input */}
        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] p-8 mb-8">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            Buy Credits
          </h2>

          {/* Amount input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2" style={{ fontFamily: 'var(--font-ui)' }}>
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-[var(--text-tertiary)]">$</span>
              <input
                type="number"
                min="5"
                max="1000"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePurchase()}
                placeholder="10"
                className="w-full pl-10 pr-4 py-4 text-2xl font-bold bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                style={{ fontFamily: 'var(--font-heading)' }}
              />
            </div>
            <p className="mt-2 text-xs text-[var(--text-tertiary)]" style={{ fontFamily: 'var(--font-body)' }}>
              Minimum $5 · Maximum $1,000
            </p>
          </div>

          {/* Quick amount buttons */}
          <div className="flex flex-wrap gap-2 mb-8">
            {QUICK_AMOUNTS.map((val) => (
              <button
                key={val}
                onClick={() => setAmount(String(val))}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  amount === String(val)
                    ? 'bg-[var(--accent-primary)] text-[var(--text-inverse)] border-[var(--accent-primary)]'
                    : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]'
                }`}
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                ${val}
              </button>
            ))}
          </div>

          {/* Purchase button */}
          <button
            onClick={handlePurchase}
            disabled={loading || !isValidAmount}
            className="w-full px-6 py-4 font-semibold text-lg rounded-xl transition duration-300 disabled:opacity-40 disabled:cursor-not-allowed bg-[var(--accent-primary)] text-[var(--text-inverse)] hover:bg-[var(--accent-hover)]"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            {loading ? 'Processing...' : isValidAmount ? `Add $${parsedAmount.toFixed(2)} in Credits` : 'Add Credits'}
          </button>
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

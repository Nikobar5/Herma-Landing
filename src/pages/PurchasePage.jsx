import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHermaAuth } from '../context/HermaAuthContext';
import { createCheckout, createSubscriptionCheckout, getBalance } from '../services/hermaApi';

const QUICK_AMOUNTS = [5, 10, 25, 50, 100];

const SUBSCRIPTION_PLANS = [
  { id: 'starter', name: 'Starter', price: 10, credits: 12, bonus: 20 },
  { id: 'pro', name: 'Pro', price: 25, credits: 32, bonus: 28, popular: true },
  { id: 'enterprise', name: 'Enterprise', price: 50, credits: 65, bonus: 30 },
];

const PurchasePage = () => {
  const { isAuthenticated, loading: authLoading } = useHermaAuth();
  const [balance, setBalance] = useState(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [subLoading, setSubLoading] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Redirect unauthenticated users to login immediately, with return path preserved.
  // This prevents users from interacting with the purchase form only to be interrupted
  // mid-flow when they click a button.
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login?next=/upgrade', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

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

  const handleSubscribe = async (planId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSubLoading(planId);
    setError(null);
    try {
      const data = await createSubscriptionCheckout(planId);
      window.location.href = data.checkout_url;
    } catch (err) {
      setError(err.message || 'Failed to start checkout.');
      setSubLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-32">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 relative z-10">
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
            Subscribe for bonus credits, or pay as you go
          </p>
          {isAuthenticated && balance !== null && (
            <div className="inline-flex items-center gap-2 bg-[var(--bg-secondary)] px-6 py-3 rounded-full border border-[var(--border-secondary)]">
              <span className="text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-ui)' }}>Current Balance:</span>
              <span className="text-2xl font-bold text-[var(--accent-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>${Number(balance).toFixed(2)}</span>
            </div>
          )}
        </div>

        {!isAuthenticated && (
          <div className="mb-6 p-4 bg-[var(--accent-muted)] border border-[var(--border-accent)] rounded-lg flex items-center justify-between gap-4">
            <p className="text-sm text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>
              Sign up free to get <span className="font-semibold text-[var(--text-primary)]">$1.00 in credits</span> and unlock purchasing.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="flex-shrink-0 px-4 py-2 bg-[var(--accent-primary)] text-[var(--text-inverse)] text-sm font-semibold rounded-lg hover:bg-[var(--accent-hover)] transition duration-200"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Sign Up Free
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 rounded-lg">
            <p className="text-[var(--error)] text-sm text-center" style={{ fontFamily: 'var(--font-body)' }}>{error}</p>
          </div>
        )}

        {/* Subscription Plans */}
        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
              Monthly Plans
            </h2>
            <span className="text-xs text-emerald-400 font-medium px-3 py-1 bg-emerald-500/10 rounded-full" style={{ fontFamily: 'var(--font-ui)' }}>
              Up to 30% bonus credits
            </span>
          </div>

          <div className="grid gap-3">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <button
                key={plan.id}
                onClick={() => handleSubscribe(plan.id)}
                disabled={subLoading !== null}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  plan.popular
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-muted)]'
                    : 'border-[var(--border-secondary)] hover:border-[var(--border-accent)]'
                } ${subLoading === plan.id ? 'opacity-60' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-ui)' }}>
                        {plan.name}
                      </span>
                      {plan.popular && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent-primary)] text-[var(--text-inverse)] font-medium">
                          Most Popular
                        </span>
                      )}
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-medium">
                        +{plan.bonus}% bonus
                      </span>
                    </div>
                    <span className="text-xs text-[var(--text-tertiary)] mt-0.5 block" style={{ fontFamily: 'var(--font-ui)' }}>
                      Pay ${plan.price}/mo &rarr; get ${plan.credits} in credits every month
                    </span>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <span className="text-lg font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-ui)' }}>
                      ${plan.price}
                    </span>
                    <span className="text-xs text-[var(--text-tertiary)] block">/month</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-[var(--border-primary)]" />
          <span className="text-sm text-[var(--text-tertiary)]" style={{ fontFamily: 'var(--font-ui)' }}>or pay as you go</span>
          <div className="flex-1 h-px bg-[var(--border-primary)]" />
        </div>

        {/* One-time Credit Purchase */}
        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] p-8 mb-8">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            One-Time Credits
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
              Minimum $5 · Maximum $1,000 · Credits never expire
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
                <div className="text-sm text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>Your data stays yours</div>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-ui)' }}>Credits Never Expire</div>
                <div className="text-sm text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>Use them whenever you want</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sign-in prompt for unauthenticated users */}
        {!isAuthenticated && (
          <div className="text-center">
            <div className="bg-[var(--bg-secondary)] p-8 rounded-xl border border-[var(--border-primary)] max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Sign in to purchase credits</h2>
              <p className="text-[var(--text-secondary)] mb-6" style={{ fontFamily: 'var(--font-body)' }}>Create an account or sign in to get started with $1.00 in free credits</p>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-3 bg-[var(--accent-primary)] text-[var(--text-inverse)] font-semibold rounded-lg hover:bg-[var(--accent-hover)] transition duration-300"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Sign Up Free
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchasePage;

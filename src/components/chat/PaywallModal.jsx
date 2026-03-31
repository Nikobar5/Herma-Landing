import React, { useState } from 'react';
import { createSubscriptionCheckout } from '../../services/hermaApi';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$10',
    credits: '$12',
    bonus: '20%',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$25',
    credits: '$32',
    bonus: '28%',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$50',
    credits: '$65',
    bonus: '30%',
  },
];

const PaywallModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(null);

  if (!isOpen) return null;

  const handleSubscribe = async (planId) => {
    setLoading(planId);
    try {
      const data = await createSubscriptionCheckout(planId);
      window.location.href = data.checkout_url;
    } catch (err) {
      alert(err.message || 'Failed to start checkout');
      setLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[var(--bg-secondary)] rounded-2xl shadow-xl border border-[var(--border-secondary)] max-w-lg w-full mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-xl font-bold text-[var(--text-primary)]"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            You've run out of credits
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[var(--bg-hover)] transition-colors text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-sm text-[var(--text-secondary)] mb-6" style={{ fontFamily: 'var(--font-body)' }}>
          Subscribe to get bonus credits every month, or buy a one-time package.
        </p>

        <div className="space-y-3 mb-6">
          {PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => handleSubscribe(plan.id)}
              disabled={loading !== null}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                plan.popular
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-muted)]'
                  : 'border-[var(--border-secondary)] hover:border-[var(--border-accent)]'
              } ${loading === plan.id ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="font-semibold text-[var(--text-primary)]"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      {plan.name}
                    </span>
                    {plan.popular && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent-primary)] text-[var(--text-inverse)] font-medium">
                        Popular
                      </span>
                    )}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#5BAF8A]/15 text-[#5BAF8A] font-medium">
                      +{plan.bonus} bonus
                    </span>
                  </div>
                  <span className="text-xs text-[var(--text-tertiary)] mt-0.5 block" style={{ fontFamily: 'var(--font-ui)' }}>
                    Pay {plan.price}/mo &rarr; get {plan.credits} in credits
                  </span>
                </div>
                <div className="text-right">
                  <span
                    className="text-lg font-bold text-[var(--text-primary)]"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {plan.price}
                  </span>
                  <span className="text-xs text-[var(--text-tertiary)] block">/month</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center space-y-2">
          <a
            href="/upgrade"
            className="text-sm text-[var(--accent-primary)] hover:underline"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Buy one-time credits instead
          </a>
          <div>
            <button
              onClick={onClose}
              className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaywallModal;

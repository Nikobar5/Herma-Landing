import React, { useState } from 'react';
import { createSubscriptionCheckout } from '../../services/hermaApi';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$10/mo',
    billed: '$12 billed',
    credits: '$12 in credits/mo',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$25/mo',
    billed: '$32 billed',
    credits: '$32 in credits/mo',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$50/mo',
    billed: '$65 billed',
    credits: '$65 in credits/mo',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-xl font-bold text-gray-900"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            You've run out of credits
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'var(--font-body)' }}>
          Subscribe for monthly credits, or buy a one-time credit package.
        </p>

        <div className="space-y-3 mb-6">
          {PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => handleSubscribe(plan.id)}
              disabled={loading !== null}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                plan.popular
                  ? 'border-[var(--highlight-color)] bg-[var(--highlight-color)]/5'
                  : 'border-gray-200 hover:border-gray-300'
              } ${loading === plan.id ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="font-semibold text-gray-900"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      {plan.name}
                    </span>
                    {plan.popular && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--highlight-color)] text-white font-medium">
                        Popular
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500" style={{ fontFamily: 'var(--font-body)' }}>
                    {plan.credits}
                  </span>
                </div>
                <div className="text-right">
                  <span
                    className="font-bold text-gray-900"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {plan.billed}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center space-y-2">
          <a
            href="/#/upgrade"
            className="text-sm text-[var(--highlight-color)] hover:underline"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Buy one-time credits instead
          </a>
          <div>
            <button
              onClick={onClose}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              style={{ fontFamily: 'var(--font-body)' }}
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

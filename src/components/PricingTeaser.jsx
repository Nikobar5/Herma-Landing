import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const PLANS = [
  {
    name: 'Starter',
    price: 10,
    credits: 12,
    bonus: 20,
    features: ['Smart model routing', 'Standard response speed', 'Email support'],
    popular: false,
  },
  {
    name: 'Pro',
    price: 25,
    credits: 32,
    bonus: 28,
    features: ['Smart model routing', 'Priority response speed', 'Priority email support', 'Usage analytics dashboard'],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 50,
    credits: 65,
    bonus: 30,
    features: ['Smart model routing', 'Highest priority routing', 'Dedicated support', 'Usage analytics dashboard', 'Volume discounts'],
    popular: false,
  },
];

const CheckIcon = () => (
  <svg className="w-4 h-4 text-[#5BAF8A] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

const PricingTeaser = () => {
  useScrollAnimation();

  return (
    <section className="py-14 bg-[var(--bg-secondary)]">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-on-scroll fade-up">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Simple, transparent pricing
          </h2>
          <p className="text-[var(--text-secondary)] text-base sm:text-lg" style={{ fontFamily: 'var(--font-body)' }}>
            No hidden fees. $2/M input tokens, $8/M output tokens — plus bonus credits with subscriptions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PLANS.map((plan, i) => (
            <div
              key={plan.name}
              className={`animate-on-scroll fade-up delay-${(i + 1) * 100} relative rounded-2xl p-6 flex flex-col transition-all duration-300
                ${plan.popular
                  ? 'bg-[var(--bg-primary)] ring-2 ring-[var(--accent-primary)] shadow-[var(--shadow-glow)]'
                  : 'bg-[var(--bg-primary)] border border-[var(--border-secondary)] hover:border-[var(--border-accent)] shadow-md hover:shadow-lg'
                }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-[var(--accent-primary)] text-white text-xs font-semibold rounded-full"
                        style={{ fontFamily: 'var(--font-heading)' }}>
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-5">
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
                    ${plan.price}
                  </span>
                  <span className="text-sm text-[var(--text-tertiary)]" style={{ fontFamily: 'var(--font-ui)' }}>/mo</span>
                </div>
                <p className="text-sm text-[#5BAF8A] font-medium" style={{ fontFamily: 'var(--font-ui)' }}>
                  ${plan.credits} in credits · +{plan.bonus}% bonus
                </p>
              </div>

              <ul className="space-y-2.5 flex-grow mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckIcon />
                    <span className="text-sm text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/upgrade"
                className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200
                  ${plan.popular
                    ? 'bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-hover)] shadow-md hover:shadow-lg hover:scale-[1.02]'
                    : 'border border-[var(--accent-primary)]/40 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/8 hover:border-[var(--accent-primary)]'
                  }`}
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Get started
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 animate-on-scroll fade-up delay-400">
          <Link
            to="/upgrade"
            className="text-sm text-[var(--accent-primary)] hover:underline underline-offset-2 font-medium"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            See full pricing details and pay-as-you-go options →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PricingTeaser;

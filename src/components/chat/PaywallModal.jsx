import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { trackPaywallShown, trackPaywallCTA } from '../../services/analyticsTracker';

const PaywallModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) trackPaywallShown();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[var(--bg-secondary)] rounded-2xl shadow-xl border border-[var(--border-secondary)] max-w-sm w-full mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-xl font-bold text-[var(--text-primary)]"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            You've run out of credits
          </h2>
          <button
            onClick={() => { trackPaywallCTA('dismissed'); onClose(); }}
            className="p-1 rounded-lg hover:bg-[var(--bg-hover)] transition-colors text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-sm text-[var(--text-secondary)] mb-6" style={{ fontFamily: 'var(--font-body)' }}>
          Top up your balance to keep chatting. Credits never expire.
        </p>

        <Link
          to="/upgrade"
          onClick={() => { trackPaywallCTA('add_credits'); onClose(); }}
          className="block w-full py-3 text-center font-semibold rounded-xl bg-[var(--accent-primary)] text-[var(--text-inverse)] hover:bg-[var(--accent-hover)] transition-colors mb-3"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          Add Credits
        </Link>

        <Link
          to="/dashboard/billing"
          onClick={() => { trackPaywallCTA('setup_ar'); onClose(); }}
          className="block w-full py-2.5 text-center text-sm font-medium rounded-xl border border-[var(--border-primary)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors mb-4"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          Set up Auto-Recharge
        </Link>

        <div className="text-center">
          <button
            onClick={() => { trackPaywallCTA('dismissed'); onClose(); }}
            className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaywallModal;

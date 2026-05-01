import React from 'react';
import { manageSubscription } from '../../services/hermaApi';

const BalanceBadge = ({ balance, subscription }) => {
  const hasBalance = balance !== null && balance !== undefined;

  const handleManage = async () => {
    try {
      const data = await manageSubscription();
      window.location.href = data.url;
    } catch (err) {
      alert(err.message || 'Failed to open subscription portal');
    }
  };

  const totalAvailable = hasBalance ? parseFloat(balance) : 0;

  return (
    <div className="px-4 py-3 space-y-3">
      {subscription && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5BAF8A] inline-block shadow-[0_0_8px_rgba(91,175,138,0.4)]" />
            <span className="text-xs font-medium text-[var(--text-primary)] capitalize" style={{ fontFamily: 'var(--font-ui)' }}>
              {subscription.plan} Plan
            </span>
          </div>
          <button
            onClick={handleManage}
            className="text-xs font-medium text-[var(--accent-primary)] hover:text-[var(--accent-hover)] transition-colors"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Manage
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-ui)' }}>
          Available Credits
        </span>
        <span
          className="text-sm font-bold text-[var(--text-primary)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          ${totalAvailable.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default BalanceBadge;

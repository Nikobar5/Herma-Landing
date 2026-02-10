import React from 'react';
import { manageSubscription } from '../../services/hermaApi';

const BalanceBadge = ({ balance, chatFreeCredit, subscription }) => {
  const hasBalance = balance !== null && balance !== undefined;
  const hasFreeCredit = chatFreeCredit !== null && chatFreeCredit !== undefined && chatFreeCredit > 0;

  const handleManage = async () => {
    try {
      const data = await manageSubscription();
      window.location.href = data.url;
    } catch (err) {
      alert(err.message || 'Failed to open subscription portal');
    }
  };

  const totalAvailable =
    (hasBalance ? parseFloat(balance) : 0) +
    (hasFreeCredit ? parseFloat(chatFreeCredit) : 0);

  return (
    <div className="px-4 py-3 border-t border-gray-200/50 space-y-2">
      {subscription && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
            <span className="text-xs font-medium text-white/90 capitalize" style={{ fontFamily: 'var(--font-ui)' }}>
              {subscription.plan} Plan
            </span>
          </div>
          <button
            onClick={handleManage}
            className="text-xs text-[var(--highlight-color)] hover:underline"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Manage
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500" style={{ fontFamily: 'var(--font-ui)' }}>
          Credits
        </span>
        <span
          className="text-sm font-semibold text-[var(--highlight-color)]"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          ${totalAvailable.toFixed(2)}
        </span>
      </div>

      {hasFreeCredit && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-ui)' }}>
            Free chat credit
          </span>
          <span className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-ui)' }}>
            ${parseFloat(chatFreeCredit).toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
};

export default BalanceBadge;

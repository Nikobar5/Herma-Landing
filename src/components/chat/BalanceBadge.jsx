import React from 'react';
import { Link } from 'react-router-dom';

const BalanceBadge = ({ balance }) => {
  const totalAvailable = balance !== null && balance !== undefined ? parseFloat(balance) : 0;

  return (
    <div className="px-4 py-3 space-y-3">
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
      <Link
        to="/upgrade"
        className="block w-full text-center py-1.5 text-xs font-semibold rounded-lg bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/20 transition-colors"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        Add Credits
      </Link>
    </div>
  );
};

export default BalanceBadge;

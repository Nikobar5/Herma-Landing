import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { getBalance, getLedger, createCheckout } from '../../services/hermaApi';

const CREDIT_PACKAGES = [
  { id: '10', label: '$10', cents: 1000 },
  { id: '25', label: '$25', cents: 2500 },
  { id: '50', label: '$50', cents: 5000 },
  { id: '100', label: '$100', cents: 10000 },
];

const TYPE_LABELS = {
  topup: 'Top-up',
  usage: 'Usage',
  adjustment: 'Adjustment',
  refund: 'Refund',
};

const Billing = () => {
  const [balance, setBalance] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const location = useLocation();

  const fetchData = useCallback(async () => {
    try {
      const [balData, ledgerData] = await Promise.all([
        getBalance(),
        getLedger(),
      ]);
      setBalance(balData);
      setLedger(ledgerData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Check for payment return
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('payment') === 'success') {
      setSuccessMsg('Payment successful! Credits will appear shortly.');
      // Refresh data after a short delay to allow webhook processing
      setTimeout(() => fetchData(), 2000);
    }
  }, [location.search, fetchData]);

  const handlePurchase = async (packageId) => {
    setPurchasing(packageId);
    setError('');
    try {
      const data = await createCheckout(packageId);
      window.location.href = data.checkout_url;
    } catch (err) {
      setError(err.message);
      setPurchasing('');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div
          className="text-sm text-[var(--text-tertiary)]"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          Loading billing...
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1
        className="text-2xl font-bold text-[var(--text-primary)] mb-6"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Billing
      </h1>

      {successMsg && (
        <div
          className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-sm text-emerald-400"
          style={{ borderRadius: 'var(--radius-sm)' }}
        >
          {successMsg}
        </div>
      )}

      {error && (
        <div
          className="mb-6 p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 text-sm text-[var(--error)]"
          style={{ borderRadius: 'var(--radius-sm)' }}
        >
          {error}
        </div>
      )}

      {/* Current Balance */}
      <div
        className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-6 mb-6"
        style={{ borderRadius: 'var(--radius-md)' }}
      >
        <p
          className="text-sm text-[var(--text-tertiary)] mb-1"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          Current Balance
        </p>
        <p
          className="text-4xl font-bold text-[var(--text-primary)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          ${balance ? parseFloat(balance.balance_usd).toFixed(2) : '0.00'}
        </p>
      </div>

      {/* Credit packages */}
      <div
        className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-6 mb-6"
        style={{ borderRadius: 'var(--radius-md)' }}
      >
        <h2
          className="text-sm font-medium text-[var(--text-primary)] mb-4"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          Add Credits
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CREDIT_PACKAGES.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => handlePurchase(pkg.id)}
              disabled={!!purchasing}
              className={`p-4 border text-center transition-all ${
                purchasing === pkg.id
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-muted)]'
                  : 'border-[var(--border-secondary)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-hover)]'
              } disabled:opacity-50`}
              style={{ borderRadius: 'var(--radius-sm)' }}
            >
              <span
                className="block text-xl font-bold text-[var(--text-primary)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {pkg.label}
              </span>
              <span
                className="block text-xs text-[var(--text-tertiary)] mt-1"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                {purchasing === pkg.id ? 'Redirecting...' : 'API credits'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Transaction history */}
      <div
        className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] overflow-hidden"
        style={{ borderRadius: 'var(--radius-md)' }}
      >
        <div className="px-6 py-4 border-b border-[var(--border-primary)]">
          <h2
            className="text-sm font-medium text-[var(--text-primary)]"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Transaction History
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ fontFamily: 'var(--font-ui)' }}>
            <thead>
              <tr className="bg-[var(--bg-tertiary)] border-b border-[var(--border-primary)]">
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Type</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Amount</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Balance After</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody>
              {ledger.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-[var(--text-tertiary)]">
                    No transactions yet
                  </td>
                </tr>
              ) : (
                ledger.map((entry) => {
                  const amount = parseFloat(entry.amount_usd);
                  const isPositive = amount >= 0;
                  return (
                    <tr
                      key={entry.id}
                      className="border-b border-[var(--border-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                    >
                      <td className="px-4 py-3 text-[var(--text-secondary)] whitespace-nowrap">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-[var(--text-primary)]">
                        {TYPE_LABELS[entry.type] || entry.type}
                      </td>
                      <td className={`px-4 py-3 text-right font-medium ${isPositive ? 'text-emerald-400' : 'text-[var(--error)]'}`}>
                        {isPositive ? '+' : ''}${amount.toFixed(4)}
                      </td>
                      <td className="px-4 py-3 text-right text-[var(--text-secondary)]">
                        ${parseFloat(entry.balance_after).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-[var(--text-tertiary)] max-w-xs truncate">
                        {entry.description || '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Billing;

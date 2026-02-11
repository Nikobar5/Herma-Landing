import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { getBalance, getLedger, createCheckout } from '../../services/hermaApi';

const CREDIT_PACKAGES = [
  { id: '10', label: '$10', credits: '10.00', bonus: null },
  { id: '25', label: '$25', credits: '25.00', bonus: '+$2.50 Bonus', popular: true },
  { id: '50', label: '$50', credits: '50.00', bonus: '+$7.50 Bonus' },
  { id: '100', label: '$100', credits: '100.00', bonus: '+$20.00 Bonus' },
];

const TYPE_LABELS = {
  topup: 'Credit Top-up',
  usage: 'API Usage',
  adjustment: 'System Adjustment',
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
      setLedger(ledgerData.items || ledgerData); // Handle both array and object wrapper if API changes
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('payment') === 'success') {
      setSuccessMsg('Payment successful! Credits will appear shortly.');
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
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--accent-primary)] border-t-transparent animate-spin" />
          <span className="text-sm text-[var(--text-tertiary)]">Loading billing...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Billing & Credits
          </h1>
          <p className="text-[var(--text-secondary)] text-lg" style={{ fontFamily: 'var(--font-body)' }}>
            Manage your credits and view transaction history.
          </p>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl px-6 py-4 flex flex-col items-end">
          <span className="text-sm text-[var(--text-tertiary)] uppercase tracking-wide font-semibold">Current Balance</span>
          <span className="text-4xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
            ${balance ? parseFloat(balance.balance_usd).toFixed(2) : '0.00'}
          </span>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm font-medium">
          {successMsg}
        </div>
      )}

      {error && (
        <div className="p-4 bg-[var(--error)]/5 border border-[var(--error)]/20 rounded-lg text-[var(--error)] text-sm">
          {error}
        </div>
      )}

      {/* Credit Packages */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Add Credits</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CREDIT_PACKAGES.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => handlePurchase(pkg.id)}
              disabled={!!purchasing}
              className={`relative group flex flex-col items-center p-6 border rounded-xl transition-all duration-300 ${purchasing === pkg.id
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-muted)]'
                  : 'bg-[var(--bg-secondary)] border-[var(--border-primary)] hover:border-[var(--accent-primary)] hover:-translate-y-1 hover:shadow-lg hover:shadow-[var(--accent-primary)]/5'
                }`}
            >
              {pkg.popular && (
                <span className="absolute -top-3 px-3 py-1 bg-[var(--accent-primary)] text-white text-xs font-bold rounded-full shadow-sm">
                  MOST POPULAR
                </span>
              )}
              <span className="text-2xl font-bold text-[var(--text-primary)] mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                {pkg.label}
              </span>
              <span className="text-sm text-[var(--text-tertiary)] mb-4">
                {pkg.credits} credits
              </span>
              {pkg.bonus && (
                <span className="inline-block px-2 py-1 mb-4 text-xs font-semibold text-emerald-400 bg-emerald-500/10 rounded-md border border-emerald-500/20">
                  {pkg.bonus}
                </span>
              )}
              <div className={`mt-auto w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${purchasing === pkg.id
                  ? 'bg-transparent text-[var(--accent-primary)]'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] group-hover:bg-[var(--accent-primary)] group-hover:text-white'
                }`}>
                {purchasing === pkg.id ? 'Processing...' : 'Purchase'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Transaction History</h2>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-[var(--border-primary)] bg-[var(--bg-tertiary)]/50">
                  <th className="px-6 py-4 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider text-right">Amount</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider text-right">Balance</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-primary)]">
                {ledger.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-[var(--text-tertiary)] italic">No transactions found</td>
                  </tr>
                ) : (
                  ledger.map((entry) => {
                    const amount = parseFloat(entry.amount_usd);
                    const isPositive = amount >= 0;
                    return (
                      <tr key={entry.id} className="hover:bg-[var(--bg-hover)] transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-[var(--text-secondary)]">
                          {new Date(entry.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${entry.type === 'topup' ? 'bg-emerald-500/10 text-emerald-400' :
                              entry.type === 'usage' ? 'bg-blue-500/10 text-blue-400' :
                                'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                            }`}>
                            {TYPE_LABELS[entry.type] || entry.type}
                          </span>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-right font-mono font-medium ${isPositive ? 'text-emerald-400' : 'text-[var(--text-primary)]'}`}>
                          {isPositive ? '+' : ''}${Math.abs(amount).toFixed(4)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-[var(--text-tertiary)]">
                          ${parseFloat(entry.balance_after).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-[var(--text-tertiary)] max-w-xs truncate">
                          {entry.description}
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
    </div>
  );
};

export default Billing;

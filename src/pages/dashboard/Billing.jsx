import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { getBalance, getLedger, createCheckout } from '../../services/hermaApi';

const QUICK_AMOUNTS = [5, 10, 25, 50, 100];

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
  const [purchasing, setPurchasing] = useState(false);
  const [amount, setAmount] = useState('');
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

  const parsedAmount = parseFloat(amount);
  const isValidAmount = !isNaN(parsedAmount) && parsedAmount >= 5 && parsedAmount <= 1000;

  const handlePurchase = async () => {
    if (!isValidAmount) return;
    setPurchasing(true);
    setError('');
    try {
      const data = await createCheckout(parsedAmount);
      window.location.href = data.checkout_url;
    } catch (err) {
      setError(err.message);
      setPurchasing(false);
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

      {/* Add Credits */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-5">Add Credits</h2>

        {/* Amount input */}
        <div className="mb-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-[var(--text-tertiary)]">$</span>
            <input
              type="number"
              min="5"
              max="1000"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePurchase()}
              placeholder="10"
              className="w-full pl-9 pr-4 py-3 text-xl font-bold bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              style={{ fontFamily: 'var(--font-heading)' }}
            />
          </div>
          <p className="mt-1.5 text-xs text-[var(--text-tertiary)]">Minimum $5 · Maximum $1,000</p>
        </div>

        {/* Quick amount buttons */}
        <div className="flex flex-wrap gap-2 mb-5">
          {QUICK_AMOUNTS.map((val) => (
            <button
              key={val}
              onClick={() => setAmount(String(val))}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
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
          disabled={purchasing || !isValidAmount}
          className="w-full px-6 py-3 font-semibold rounded-xl transition duration-300 disabled:opacity-40 disabled:cursor-not-allowed bg-[var(--accent-primary)] text-[var(--text-inverse)] hover:bg-[var(--accent-hover)]"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          {purchasing ? 'Processing...' : isValidAmount ? `Add $${parsedAmount.toFixed(2)} in Credits` : 'Add Credits'}
        </button>
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

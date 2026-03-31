import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {
  getBalance,
  getLedger,
  createCheckout,
  getPayments,
  getAutoRechargeSettings,
  updateAutoRechargeSettings,
} from '../../services/hermaApi';

const QUICK_AMOUNTS = [5, 10, 25, 50, 100];

const TYPE_LABELS = {
  topup: 'Credit Top-up',
  usage: 'API Usage',
  adjustment: 'System Adjustment',
  refund: 'Refund',
};

/* ------------------------------------------------------------------ */
/*  Toggle Switch                                                      */
/* ------------------------------------------------------------------ */
const Toggle = ({ checked, onChange, disabled }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={`
      relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent
      transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)]
      ${checked ? 'bg-[var(--accent-primary)]' : 'bg-[var(--bg-tertiary)]'}
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    `}
  >
    <span
      className={`
        pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0
        transition-transform duration-200 ease-in-out
        ${checked ? 'translate-x-5' : 'translate-x-0'}
      `}
    />
  </button>
);

/* ------------------------------------------------------------------ */
/*  Billing Page                                                       */
/* ------------------------------------------------------------------ */
const Billing = () => {
  const [balance, setBalance] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const location = useLocation();

  // Payment history state
  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [paymentsError, setPaymentsError] = useState('');

  // Auto-recharge state
  const [autoRecharge, setAutoRecharge] = useState({
    enabled: false,
    threshold_usd: '1.00',
    amount_usd: '10.00',
  });
  const [autoRechargeLoading, setAutoRechargeLoading] = useState(true);
  const [autoRechargeSaving, setAutoRechargeSaving] = useState(false);
  const [autoRechargeMsg, setAutoRechargeMsg] = useState('');
  const [autoRechargeError, setAutoRechargeError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [balData, ledgerData] = await Promise.all([
        getBalance(),
        getLedger(),
      ]);
      setBalance(balData);
      setLedger(ledgerData.items || ledgerData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPayments = useCallback(async () => {
    try {
      const data = await getPayments();
      setPayments(data.items || data || []);
    } catch (err) {
      setPaymentsError(err.message);
    } finally {
      setPaymentsLoading(false);
    }
  }, []);

  const fetchAutoRecharge = useCallback(async () => {
    try {
      const data = await getAutoRechargeSettings();
      if (data) {
        setAutoRecharge({
          enabled: data.enabled || false,
          threshold_usd: data.threshold_usd != null ? String(data.threshold_usd) : '1.00',
          amount_usd: data.amount_usd != null ? String(data.amount_usd) : '10.00',
        });
      }
    } catch (err) {
      // 404 means no settings exist yet — that's fine, keep defaults
      if (!err.message?.includes('404') && !err.message?.includes('Not found')) {
        setAutoRechargeError(err.message);
      }
    } finally {
      setAutoRechargeLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchPayments();
    fetchAutoRecharge();
  }, [fetchData, fetchPayments, fetchAutoRecharge]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('payment') === 'success') {
      setSuccessMsg('Payment successful! Credits will appear shortly.');
      setTimeout(() => {
        fetchData();
        fetchPayments();
      }, 2000);
    }
  }, [location.search, fetchData, fetchPayments]);

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

  const handleAutoRechargeSave = async () => {
    const threshold = parseFloat(autoRecharge.threshold_usd);
    const rechargeAmt = parseFloat(autoRecharge.amount_usd);

    if (autoRecharge.enabled) {
      if (isNaN(threshold) || threshold < 0.5) {
        setAutoRechargeError('Threshold must be at least $0.50');
        return;
      }
      if (isNaN(rechargeAmt) || rechargeAmt < 5) {
        setAutoRechargeError('Recharge amount must be at least $5.00');
        return;
      }
    }

    setAutoRechargeSaving(true);
    setAutoRechargeError('');
    setAutoRechargeMsg('');

    try {
      await updateAutoRechargeSettings({
        enabled: autoRecharge.enabled,
        threshold_usd: threshold,
        amount_usd: rechargeAmt,
      });
      setAutoRechargeMsg('Auto-recharge settings saved.');
      setTimeout(() => setAutoRechargeMsg(''), 4000);
    } catch (err) {
      setAutoRechargeError(err.message);
    } finally {
      setAutoRechargeSaving(false);
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
        <div className="p-4 bg-[#5BAF8A]/10 border border-[#5BAF8A]/20 rounded-lg text-[#5BAF8A] text-sm font-medium">
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

      {/* Auto-Recharge */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-5">Auto-Recharge</h2>

        {autoRechargeLoading ? (
          <div className="flex items-center gap-3 py-4">
            <div className="w-5 h-5 rounded-full border-2 border-[var(--accent-primary)] border-t-transparent animate-spin" />
            <span className="text-sm text-[var(--text-tertiary)]">Loading settings...</span>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  Auto-recharge when balance is low
                </p>
                <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                  Automatically add credits so you never run out.
                </p>
              </div>
              <Toggle
                checked={autoRecharge.enabled}
                onChange={(val) => setAutoRecharge((prev) => ({ ...prev, enabled: val }))}
              />
            </div>

            {/* Threshold & Amount inputs (shown when enabled) */}
            {autoRecharge.enabled && (
              <div className="space-y-4 pt-2 border-t border-[var(--border-primary)]">
                {/* Threshold */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                    Recharge when balance drops below
                  </label>
                  <div className="relative max-w-xs">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[var(--text-tertiary)]">$</span>
                    <input
                      type="number"
                      min="0.50"
                      step="0.50"
                      value={autoRecharge.threshold_usd}
                      onChange={(e) =>
                        setAutoRecharge((prev) => ({ ...prev, threshold_usd: e.target.value }))
                      }
                      className="w-full pl-7 pr-4 py-2 text-sm bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                  <p className="mt-1 text-xs text-[var(--text-tertiary)]">Minimum $0.50</p>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                    Recharge amount
                  </label>
                  <div className="relative max-w-xs">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[var(--text-tertiary)]">$</span>
                    <input
                      type="number"
                      min="5"
                      step="5"
                      value={autoRecharge.amount_usd}
                      onChange={(e) =>
                        setAutoRecharge((prev) => ({ ...prev, amount_usd: e.target.value }))
                      }
                      className="w-full pl-7 pr-4 py-2 text-sm bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                  <p className="mt-1 text-xs text-[var(--text-tertiary)]">Minimum $5.00</p>
                </div>
              </div>
            )}

            {/* Feedback messages */}
            {autoRechargeMsg && (
              <div className="p-3 bg-[#5BAF8A]/10 border border-[#5BAF8A]/20 rounded-lg text-[#5BAF8A] text-sm font-medium">
                {autoRechargeMsg}
              </div>
            )}
            {autoRechargeError && (
              <div className="p-3 bg-[var(--error)]/5 border border-[var(--error)]/20 rounded-lg text-[var(--error)] text-sm">
                {autoRechargeError}
              </div>
            )}

            {/* Save button */}
            <button
              onClick={handleAutoRechargeSave}
              disabled={autoRechargeSaving}
              className="px-5 py-2 text-sm font-semibold rounded-lg transition duration-300 disabled:opacity-40 disabled:cursor-not-allowed bg-[var(--accent-primary)] text-[var(--text-inverse)] hover:bg-[var(--accent-hover)]"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              {autoRechargeSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        )}
      </div>

      {/* Payment History */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Payment History</h2>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl overflow-hidden shadow-sm">
          {paymentsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="w-6 h-6 rounded-full border-2 border-[var(--accent-primary)] border-t-transparent animate-spin" />
                <span className="text-sm text-[var(--text-tertiary)]">Loading payments...</span>
              </div>
            </div>
          ) : paymentsError ? (
            <div className="px-6 py-8 text-center">
              <p className="text-sm text-[var(--error)]">{paymentsError}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-[var(--border-primary)] bg-[var(--bg-tertiary)]/50">
                    <th className="px-6 py-4 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider text-right">Amount</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Description</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-primary)]">
                  {(!payments || payments.length === 0) ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-[var(--text-tertiary)] italic">
                        No payments found
                      </td>
                    </tr>
                  ) : (
                    payments.map((payment, idx) => (
                      <tr key={payment.id || idx} className="hover:bg-[var(--bg-hover)] transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-[var(--text-secondary)]">
                          {new Date(payment.created_at || payment.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-mono font-medium text-[#5BAF8A]">
                          ${parseFloat(payment.amount_usd || payment.amount || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-[var(--text-tertiary)] max-w-xs truncate">
                          {payment.description || 'Credit top-up'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {payment.receipt_url ? (
                            <a
                              href={payment.receipt_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[var(--accent-primary)] hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/5 transition-colors"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Receipt
                            </a>
                          ) : (
                            <span className="text-xs text-[var(--text-tertiary)]">--</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
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
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${entry.type === 'topup' ? 'bg-[#5BAF8A]/10 text-[#5BAF8A]' :
                              entry.type === 'usage' ? 'bg-blue-500/10 text-blue-400' :
                                'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                            }`}>
                            {TYPE_LABELS[entry.type] || entry.type}
                          </span>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-right font-mono font-medium ${isPositive ? 'text-[#5BAF8A]' : 'text-[var(--text-primary)]'}`}>
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

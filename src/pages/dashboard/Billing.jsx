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

const QUICK_AMOUNTS = [5, 25, 50, 100, 200];

const TYPE_LABELS = {
  topup: 'Credit Top-up',
  usage: 'API Usage',
  adjustment: 'System Adjustment',
  refund: 'Refund',
};

const ordinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

// 0=Mon … 6=Sun  (matches Python weekday())
const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAYS_SHORT   = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const FREQUENCY_OPTIONS = [
  { value: null,        label: 'Does not repeat' },
  { value: 'daily',    label: 'Daily' },
  { value: 'weekly',   label: 'Weekly' },
  { value: 'biweekly', label: 'Every 2 weeks' },
  { value: 'monthly',  label: 'Monthly' },
];

function scheduleLabel(frequency, day, dayOfWeek) {
  if (!frequency) return 'Enable to top up on a repeating schedule';
  if (frequency === 'daily') return 'Recharges every day, regardless of balance';
  if (frequency === 'weekly') {
    const dow = dayOfWeek != null ? DAYS_OF_WEEK[dayOfWeek] : '–';
    return `Recharges every ${dow}, regardless of balance`;
  }
  if (frequency === 'biweekly') {
    const dow = dayOfWeek != null ? DAYS_OF_WEEK[dayOfWeek] : '–';
    return `Recharges every other ${dow}, regardless of balance`;
  }
  if (frequency === 'monthly') {
    return day != null
      ? `Recharges on the ${ordinal(day)} of every month, regardless of balance`
      : 'Pick a day of month below';
  }
  return '';
}

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

const Billing = () => {
  const [balance, setBalance] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const location = useLocation();

  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [paymentsError, setPaymentsError] = useState('');

  const [autoRecharge, setAutoRecharge] = useState({
    threshold_enabled: false,  // balance-low trigger (was 'enabled')
    threshold_usd: '1.00',
    restore_to_usd: '10.00',
    amount_usd: '10.00',       // used when threshold is off but schedule is on
    frequency: null,           // null = scheduled off; selecting a value = scheduled on
    day: null,
    day_of_week: null,
  });
  const [autoRechargeBase, setAutoRechargeBase] = useState(null);
  const [successDismissible, setSuccessDismissible] = useState(false);
  const [autoRechargeLoading, setAutoRechargeLoading] = useState(true);
  const [autoRechargeSaving, setAutoRechargeSaving] = useState(false);
  const [autoRechargeMsg, setAutoRechargeMsg] = useState('');
  const [autoRechargeError, setAutoRechargeError] = useState('');

  const isArDirty = autoRechargeBase !== null &&
    JSON.stringify(autoRecharge) !== JSON.stringify(autoRechargeBase);

  const fetchData = useCallback(async () => {
    try {
      const [balData, ledgerData] = await Promise.all([getBalance(), getLedger()]);
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
        const threshold = data.threshold_usd != null ? parseFloat(data.threshold_usd) : 1;
        const amount = data.amount_usd != null ? parseFloat(data.amount_usd) : 9;
        // Legacy: if no frequency but day is set, treat as monthly
        const freq = data.frequency ?? (data.day != null ? 'monthly' : null);
        const loaded = {
          threshold_enabled: data.enabled || false,
          threshold_usd: threshold.toFixed(2),
          restore_to_usd: (threshold + amount).toFixed(2),
          amount_usd: amount.toFixed(2),
          frequency: freq,
          day: data.day ?? null,
          day_of_week: data.day_of_week ?? null,
        };
        setAutoRecharge(loaded);
        setAutoRechargeBase(loaded);
      }
    } catch (err) {
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
      const amt = params.get('amount');
      const label = amt
        ? `✓ $${parseFloat(amt).toFixed(2)} in credits applied. Balance refreshing…`
        : '✓ Credits added successfully. Balance refreshing…';
      setSuccessMsg(label);
      setSuccessDismissible(true);
      setTimeout(() => {
        fetchData();
        fetchPayments();
      }, 2000);
    }
  }, [location.search, fetchData, fetchPayments]);

  const parsedAmount = parseFloat(amount);
  const isValidAmount = !isNaN(parsedAmount) && parsedAmount >= 5;

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

  const arThresholdVal = parseFloat(autoRecharge.threshold_usd);
  const arRestoreVal = parseFloat(autoRecharge.restore_to_usd);
  const arComputedAmt = !isNaN(arThresholdVal) && !isNaN(arRestoreVal) && arRestoreVal > arThresholdVal
    ? (arRestoreVal - arThresholdVal).toFixed(2)
    : null;
  // The recharge amount sent to the API: derived from restore-threshold when
  // balance-based is on, otherwise the standalone amount_usd field.
  const effectiveChargeAmt = autoRecharge.threshold_enabled
    ? (arComputedAmt ? parseFloat(arComputedAmt) : 0)
    : parseFloat(autoRecharge.amount_usd);

  const handleAutoRechargeSave = async () => {
    if (autoRecharge.threshold_enabled) {
      const threshold = arThresholdVal;
      const restore = arRestoreVal;
      if (isNaN(threshold) || threshold < 0.5) {
        setAutoRechargeError('Threshold must be at least $0.50');
        return;
      }
      if (isNaN(restore) || restore <= threshold) {
        setAutoRechargeError('"Restore balance to" must be greater than the threshold');
        return;
      }
      if (restore - threshold < 5) {
        setAutoRechargeError('Recharge amount (restore minus threshold) must be at least $5.00');
        return;
      }
    } else if (autoRecharge.frequency) {
      if (isNaN(effectiveChargeAmt) || effectiveChargeAmt < 5) {
        setAutoRechargeError('Recharge amount must be at least $5.00');
        return;
      }
    }

    setAutoRechargeSaving(true);
    setAutoRechargeError('');
    setAutoRechargeMsg('');

    try {
      await updateAutoRechargeSettings({
        enabled: autoRecharge.threshold_enabled,
        threshold_usd: arThresholdVal || 1,
        amount_usd: effectiveChargeAmt || 10,
        frequency: autoRecharge.frequency,
        day: autoRecharge.frequency === 'monthly' ? autoRecharge.day : null,
        day_of_week: ['weekly', 'biweekly'].includes(autoRecharge.frequency) ? autoRecharge.day_of_week : null,
      });
      setAutoRechargeBase({ ...autoRecharge });
      setAutoRechargeMsg('Settings saved.');
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
        <div className="flex items-center justify-between gap-3 p-4 bg-[#5BAF8A]/10 border border-[#5BAF8A]/20 rounded-lg text-[#5BAF8A] text-sm font-medium">
          <span>{successMsg}</span>
          {successDismissible && (
            <button
              onClick={() => { setSuccessMsg(''); setSuccessDismissible(false); }}
              className="flex-shrink-0 p-0.5 rounded hover:bg-[#5BAF8A]/20 transition-colors"
              aria-label="Dismiss"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="p-4 bg-[var(--error)]/5 border border-[var(--error)]/20 rounded-lg text-[var(--error)] text-sm">
          {error}
        </div>
      )}

      {/* Add Credits + Auto-Recharge (combined card) */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl p-6">

        {/* Card header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Add Credits</h2>
          {autoRechargeLoading && (
            <div className="w-4 h-4 rounded-full border-2 border-[var(--accent-primary)] border-t-transparent animate-spin" />
          )}
        </div>

        {/* Amount input */}
        <div className="mb-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-[var(--text-tertiary)]">$</span>
            <input
              type="number"
              min="5"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePurchase()}
              onWheel={(e) => e.target.blur()}
              placeholder="10"
              className="w-full pl-9 pr-4 py-3 text-xl font-bold bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              style={{ fontFamily: 'var(--font-heading)' }}
            />
          </div>
          <p className="mt-1.5 text-xs text-[var(--text-tertiary)]">Minimum $5</p>
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

        {/* Auto-Recharge settings — always visible, two independent sections */}
        {!autoRechargeLoading && (
          <div className="mt-6 pt-6 border-t border-[var(--border-primary)]">

            {/* ── Section 1: Balance-based recharge ── */}
            <div className="border-t border-[var(--border-primary)]">

              <div className="flex items-center justify-between py-3.5 border-b border-[var(--border-primary)]">
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">Recharge when balance is low</p>
                  <p className="text-xs text-[var(--text-tertiary)] mt-0.5">Automatically top up when credits drop below a threshold</p>
                </div>
                <Toggle
                  checked={autoRecharge.threshold_enabled}
                  onChange={(val) => {
                    setAutoRecharge((prev) => ({ ...prev, threshold_enabled: val }));
                    setAutoRechargeError('');
                    setAutoRechargeMsg('');
                  }}
                />
              </div>

              {autoRecharge.threshold_enabled && (<>
                <div className="flex items-center justify-between py-3.5 border-b border-[var(--border-primary)]">
                  <label className="text-sm text-[var(--text-primary)]">When balance drops to:</label>
                  <div className="relative w-32">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-[var(--text-tertiary)]">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={autoRecharge.threshold_usd}
                      onChange={(e) => setAutoRecharge((prev) => ({ ...prev, threshold_usd: e.target.value }))}
                      onWheel={(e) => e.target.blur()}
                      className="w-full pl-7 pr-3 py-1.5 text-sm bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between py-3.5 border-b border-[var(--border-primary)]">
                  <label className="text-sm text-[var(--text-primary)]">Restore balance to:</label>
                  <div className="relative w-32">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-[var(--text-tertiary)]">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={autoRecharge.restore_to_usd}
                      onChange={(e) => setAutoRecharge((prev) => ({ ...prev, restore_to_usd: e.target.value }))}
                      onWheel={(e) => e.target.blur()}
                      className="w-full pl-7 pr-3 py-1.5 text-sm bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>

                {arComputedAmt && (
                  <div className="flex items-center justify-between py-3.5 border-b border-[var(--border-primary)]">
                    <span className="text-sm text-[var(--text-tertiary)]">Recharge amount:</span>
                    <span className="text-sm font-medium text-[var(--text-primary)] mr-3">${arComputedAmt}</span>
                  </div>
                )}
              </>)}

            </div>

            {/* ── Section 2: Scheduled recharge ── */}
            <div className="mt-1 border-t border-[var(--border-primary)]">

              <div className="flex items-center justify-between py-3.5 border-b border-[var(--border-primary)]">
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">Scheduled recharge</p>
                  <p className="text-xs text-[var(--text-tertiary)] mt-0.5">Top up on a recurring schedule, regardless of balance</p>
                </div>
                <div className="relative ml-4">
                  <select
                    value={autoRecharge.frequency ?? ''}
                    onChange={(e) => {
                      const freq = e.target.value || null;
                      const todayDow = new Date().getDay(); // 0=Sun
                      setAutoRecharge((prev) => ({
                        ...prev,
                        frequency: freq,
                        day: freq === 'monthly' ? (prev.day ?? Math.min(new Date().getDate(), 28)) : prev.day,
                        day_of_week: ['weekly', 'biweekly'].includes(freq)
                          ? (prev.day_of_week ?? (todayDow === 0 ? 6 : todayDow - 1))
                          : prev.day_of_week,
                      }));
                    }}
                    className="pl-3 pr-8 py-1.5 text-sm bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] appearance-none cursor-pointer transition-colors"
                  >
                    {FREQUENCY_OPTIONS.map((opt) => (
                      <option key={opt.value ?? ''} value={opt.value ?? ''}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {autoRecharge.frequency && (<>
                {/* Day-of-week picker */}
                {(autoRecharge.frequency === 'weekly' || autoRecharge.frequency === 'biweekly') && (
                  <div className="flex gap-1.5 py-3 border-b border-[var(--border-primary)]">
                    {DAYS_SHORT.map((label, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAutoRecharge((prev) => ({ ...prev, day_of_week: idx }))}
                        className={`w-8 h-8 rounded-full text-xs font-semibold transition-colors ${
                          autoRecharge.day_of_week === idx
                            ? 'bg-[var(--accent-primary)] text-[var(--text-inverse)]'
                            : 'bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Day-of-month picker */}
                {autoRecharge.frequency === 'monthly' && (
                  <div className="flex items-center gap-2 py-3 border-b border-[var(--border-primary)]">
                    <span className="text-xs text-[var(--text-tertiary)]">On the</span>
                    <input
                      type="number"
                      min="1"
                      max="28"
                      value={autoRecharge.day ?? ''}
                      onChange={(e) => {
                        const v = parseInt(e.target.value, 10);
                        setAutoRecharge((prev) => ({ ...prev, day: isNaN(v) ? null : Math.min(28, Math.max(1, v)) }));
                      }}
                      onWheel={(e) => e.target.blur()}
                      className="w-16 px-2 py-1 text-sm text-center bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-xs text-[var(--text-tertiary)]">of every month</span>
                  </div>
                )}

                {/* Standalone recharge amount — only shown when balance-based is off */}
                {!autoRecharge.threshold_enabled && (
                  <div className="flex items-center justify-between py-3.5 border-b border-[var(--border-primary)]">
                    <label className="text-sm text-[var(--text-primary)]">Recharge amount:</label>
                    <div className="relative w-32">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-[var(--text-tertiary)]">$</span>
                      <input
                        type="number"
                        min="5"
                        step="0.01"
                        value={autoRecharge.amount_usd}
                        onChange={(e) => setAutoRecharge((prev) => ({ ...prev, amount_usd: e.target.value }))}
                        onWheel={(e) => e.target.blur()}
                        className="w-full pl-7 pr-3 py-1.5 text-sm bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>
                )}

                <p className="text-xs text-[var(--text-tertiary)] py-2.5">
                  {scheduleLabel(autoRecharge.frequency, autoRecharge.day, autoRecharge.day_of_week)}
                </p>
              </>)}
            </div>

            {autoRechargeMsg && (
              <div className="mt-4 p-3 bg-[#5BAF8A]/10 border border-[#5BAF8A]/20 rounded-lg text-[#5BAF8A] text-sm font-medium">
                {autoRechargeMsg}
              </div>
            )}
            {autoRechargeError && (
              <div className="mt-4 p-3 bg-[var(--error)]/5 border border-[var(--error)]/20 rounded-lg text-[var(--error)] text-sm">
                {autoRechargeError}
              </div>
            )}

            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={handleAutoRechargeSave}
                disabled={!isArDirty || autoRechargeSaving}
                className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  isArDirty && !autoRechargeSaving
                    ? 'bg-[var(--accent-primary)] text-[var(--text-inverse)] hover:bg-[var(--accent-hover)]'
                    : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] cursor-not-allowed'
                }`}
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                {autoRechargeSaving ? 'Saving...' : 'Save Changes'}
              </button>
              {isArDirty && !autoRechargeSaving && (
                <p className="text-xs text-[var(--text-tertiary)]">Unsaved changes</p>
              )}
            </div>
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
                    const amt = parseFloat(entry.amount_usd);
                    const isPositive = amt >= 0;
                    return (
                      <tr key={entry.id} className="hover:bg-[var(--bg-hover)] transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-[var(--text-secondary)]">
                          {new Date(entry.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            entry.type === 'topup' ? 'bg-[#5BAF8A]/10 text-[#5BAF8A]' :
                            entry.type === 'usage' ? 'bg-blue-500/10 text-blue-400' :
                            'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                          }`}>
                            {TYPE_LABELS[entry.type] || entry.type}
                          </span>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-right font-mono font-medium ${isPositive ? 'text-[#5BAF8A]' : 'text-[var(--text-primary)]'}`}>
                          {isPositive ? '+' : ''}${Math.abs(amt).toFixed(4)}
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

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHermaAuth } from '../context/HermaAuthContext';
import {
  createCheckout,
  getAutoRechargeSettings,
  updateAutoRechargeSettings,
} from '../services/hermaApi';
import { setPageMeta, resetPageMeta } from '../utils/seo';
import { trackClick, trackCheckoutPageViewed, trackQuickAmountSelected, trackAutoRechargeToggled, trackAutoRechargeSaved } from '../services/analyticsTracker';

const QUICK_AMOUNTS = [5, 25, 50, 100, 200];

const ordinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

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
      ${checked ? 'bg-[var(--accent-primary)]' : 'bg-[var(--bg-tertiary)] border border-[var(--border-primary)]'}
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    `}
  >
    <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

const AmountInput = ({ value, onChange }) => (
  <div className="relative w-32">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-[var(--text-tertiary)]">$</span>
    <input
      type="number"
      min="0"
      step="0.01"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onWheel={(e) => e.target.blur()}
      className="w-full pl-7 pr-3 py-1.5 text-sm bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    />
  </div>
);

const PurchasePage = () => {
  const { isAuthenticated } = useHermaAuth();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // threshold = when to trigger; restore_to = target balance after recharge
  // charge amount (sent to API as amount_usd) = restore_to - threshold
  const [arSettings, setArSettings] = useState({
    enabled: false,
    threshold_usd: '1.00',
    restore_to_usd: '10.00',
    day: null,
  });
  const [arSettingsBase, setArSettingsBase] = useState(null);
  const [arLoading, setArLoading] = useState(false);
  const [arSaving, setArSaving] = useState(false);
  const [arMsg, setArMsg] = useState('');
  const [arError, setArError] = useState('');

  const isArDirty = arSettingsBase !== null &&
    JSON.stringify(arSettings) !== JSON.stringify(arSettingsBase);

  const thresholdVal = parseFloat(arSettings.threshold_usd);
  const restoreVal = parseFloat(arSettings.restore_to_usd);
  const rechargeAmt = !isNaN(thresholdVal) && !isNaN(restoreVal) && restoreVal > thresholdVal
    ? (restoreVal - thresholdVal).toFixed(2)
    : null;

  useEffect(() => {
    setPageMeta(
      'Add Credits | Herma AI Router',
      'Herma pricing: $2/M input tokens, $8/M output tokens. No minimums, no hidden fees. Pay as you go. Free $1 to start.',
      { url: 'https://hermaai.com/upgrade' }
    );
    trackCheckoutPageViewed();
    return () => resetPageMeta();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    setArLoading(true);
    getAutoRechargeSettings()
      .then((data) => {
        if (data) {
          const threshold = data.threshold_usd != null ? parseFloat(data.threshold_usd) : 1;
          const amount = data.amount_usd != null ? parseFloat(data.amount_usd) : 9;
          const loaded = {
            enabled: data.enabled || false,
            threshold_usd: threshold.toFixed(2),
            restore_to_usd: (threshold + amount).toFixed(2),
            day: data.day ?? null,
          };
          setArSettings(loaded);
          setArSettingsBase(loaded);
        }
      })
      .catch(() => {})
      .finally(() => setArLoading(false));
  }, [isAuthenticated]);

  const triggerCheckout = useCallback(async (amt) => {
    setLoading(true);
    setError(null);
    trackClick('checkout_initiated', { type: 'one_time', amount: amt });
    if (window.posthog) window.posthog.capture('checkout_initiated', { type: 'one_time', amount: amt });
    try {
      const data = await createCheckout(amt);
      window.location.href = data.checkout_url;
    } catch (err) {
      setError(err.message || 'Failed to start checkout. Please try again.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    const raw = sessionStorage.getItem('pendingCheckout');
    if (!raw) return;
    try {
      const { amount: pendingAmt } = JSON.parse(raw);
      sessionStorage.removeItem('pendingCheckout');
      setAmount(String(pendingAmt));
      const timer = setTimeout(() => triggerCheckout(pendingAmt), 400);
      return () => clearTimeout(timer);
    } catch {
      sessionStorage.removeItem('pendingCheckout');
    }
  }, [isAuthenticated, triggerCheckout]);

  const parsedAmount = parseFloat(amount);
  const isValidAmount = !isNaN(parsedAmount) && parsedAmount >= 5;

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      if (isValidAmount) {
        sessionStorage.setItem('pendingCheckout', JSON.stringify({ amount: parsedAmount }));
      }
      navigate('/login?next=/upgrade');
      return;
    }
    if (!isValidAmount) return;
    triggerCheckout(parsedAmount);
  };

  const handleArSave = async () => {
    const threshold = parseFloat(arSettings.threshold_usd);
    const restore = parseFloat(arSettings.restore_to_usd);
    const chargeAmt = restore - threshold;
    const day = arSettings.day;

    if (arSettings.enabled) {
      if (isNaN(threshold) || threshold < 0.5) {
        setArError('Threshold must be at least $0.50');
        return;
      }
      if (isNaN(restore) || restore <= threshold) {
        setArError('"Restore balance to" must be greater than the threshold');
        return;
      }
      if (chargeAmt < 5) {
        setArError('Recharge amount (restore minus threshold) must be at least $5.00');
        return;
      }
    }

    setArSaving(true);
    setArError('');
    setArMsg('');
    try {
      await updateAutoRechargeSettings({
        enabled: arSettings.enabled,
        threshold_usd: threshold,
        amount_usd: chargeAmt,
        day,
      });
      setArSettingsBase({ ...arSettings });
      setArMsg('Settings saved.');
      setTimeout(() => setArMsg(''), 4000);
      trackAutoRechargeSaved({ threshold: threshold, restore_to: restore, charge_amount: chargeAmt });
    } catch (err) {
      setArError(err.message);
    } finally {
      setArSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-32">
      <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12 relative z-10">

        {/* Header */}
        <div className="text-center mb-10">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4 text-[var(--text-primary)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Add <span className="text-[var(--accent-primary)]">Credits</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>
            Pay as you go. Set up auto-recharge to never run out.
          </p>
        </div>

        {/* Login prompt */}
        {!isAuthenticated && (
          <div className="mb-6 p-4 bg-[var(--accent-muted)] border border-[var(--border-accent)] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-sm text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>
              Sign up free to get{' '}
              <span className="font-semibold text-[var(--text-primary)]">$1.00 in credits</span>{' '}
              and unlock purchasing.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto flex-shrink-0 px-4 py-2 bg-[var(--accent-primary)] text-[var(--text-inverse)] text-sm font-semibold rounded-lg hover:bg-[var(--accent-hover)] transition duration-200"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Sign Up Free
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 rounded-lg">
            <p className="text-[var(--error)] text-sm text-center">{error}</p>
          </div>
        )}

        {/* Main card */}
        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] p-8 mb-6">

          {/* Card header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
              Add Credits
            </h2>
            {isAuthenticated && (
              <div className="flex items-center gap-2.5">
                <span className="text-sm text-[var(--text-secondary)]">Auto-Recharge</span>
                {arLoading ? (
                  <div className="w-4 h-4 rounded-full border-2 border-[var(--accent-primary)] border-t-transparent animate-spin" />
                ) : (
                  <Toggle
                    checked={arSettings.enabled}
                    onChange={(val) => {
                      trackAutoRechargeToggled(val);
                      setArSettings((prev) => ({
                        ...prev,
                        enabled: val,
                        // Pre-fill "restore to" from the purchase amount when turning on
                        ...(val && isValidAmount ? { restore_to_usd: parsedAmount.toFixed(2) } : {}),
                      }));
                      setArError('');
                      setArMsg('');
                    }}
                  />
                )}
              </div>
            )}
          </div>

          {/* Amount input */}
          <div className="mb-6">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-[var(--text-tertiary)]">$</span>
              <input
                type="number"
                min="5"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePurchase()}
                onWheel={(e) => e.target.blur()}
                placeholder="10"
                className="w-full pl-10 pr-4 py-4 text-2xl font-bold bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                style={{ fontFamily: 'var(--font-heading)' }}
              />
            </div>
            <p className="mt-2 text-xs text-[var(--text-tertiary)]">Minimum $5 · Credits never expire</p>
          </div>

          {/* Quick amounts */}
          <div className="flex flex-wrap gap-2 mb-8">
            {QUICK_AMOUNTS.map((val) => (
              <button
                key={val}
                onClick={() => { setAmount(String(val)); trackQuickAmountSelected(val); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
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
            disabled={loading}
            className="w-full px-6 py-4 font-semibold text-lg rounded-xl transition duration-300 disabled:opacity-40 disabled:cursor-not-allowed bg-[var(--accent-primary)] text-[var(--text-inverse)] hover:bg-[var(--accent-hover)]"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            {loading
              ? 'Processing…'
              : isValidAmount
              ? `Add $${parsedAmount.toFixed(2)} in Credits`
              : isAuthenticated
              ? 'Add Credits'
              : 'Sign In to Add Credits'}
          </button>

          {/* Auto-recharge expanded */}
          {isAuthenticated && arSettings.enabled && (
            <div className="mt-8 pt-6 border-t border-[var(--border-primary)]">

              <div className="flex items-start justify-between mb-1">
                <p className="text-sm font-semibold text-[var(--text-primary)]">Auto recharge</p>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-5">
                Automatically add credits when your balance runs low.
              </p>

              {/* Form rows — OpenAI style */}
              <div className="border-t border-[var(--border-primary)]">

                <div className="flex items-center justify-between py-3.5 border-b border-[var(--border-primary)]">
                  <label className="text-sm text-[var(--text-primary)]">When balance drops to:</label>
                  <AmountInput
                    value={arSettings.threshold_usd}
                    onChange={(v) => setArSettings((p) => ({ ...p, threshold_usd: v }))}
                  />
                </div>

                <div className="flex items-center justify-between py-3.5 border-b border-[var(--border-primary)]">
                  <label className="text-sm text-[var(--text-primary)]">Restore balance to:</label>
                  <AmountInput
                    value={arSettings.restore_to_usd}
                    onChange={(v) => setArSettings((p) => ({ ...p, restore_to_usd: v }))}
                  />
                </div>

                {rechargeAmt && (
                  <div className="flex items-center justify-between py-3.5 border-b border-[var(--border-primary)]">
                    <span className="text-sm text-[var(--text-tertiary)]">Recharge amount:</span>
                    <span className="text-sm font-medium text-[var(--text-primary)] mr-3">${rechargeAmt}</span>
                  </div>
                )}

                {/* Monthly recharge */}
                <div className="py-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--text-primary)]">Also recharge monthly</span>
                    <Toggle
                      checked={arSettings.day !== null}
                      onChange={(val) => setArSettings((p) => ({
                        ...p,
                        day: val ? Math.min(new Date().getDate(), 28) : null,
                      }))}
                    />
                  </div>
                  <p className="text-xs text-[var(--text-tertiary)] mt-1">
                    {arSettings.day !== null
                      ? `Recharges on the ${ordinal(arSettings.day)} of every month, regardless of balance`
                      : 'Enable to also top up on the same date each month'}
                  </p>
                </div>
              </div>

              {arMsg && (
                <div className="mt-4 p-3 bg-[var(--success)]/10 border border-[var(--success)]/20 rounded-lg text-[var(--success)] text-sm font-medium">
                  {arMsg}
                </div>
              )}
              {arError && (
                <div className="mt-4 p-3 bg-[var(--error)]/5 border border-[var(--error)]/20 rounded-lg text-[var(--error)] text-sm">
                  {arError}
                </div>
              )}

              <div className="mt-5 flex items-center gap-3">
                <button
                  onClick={handleArSave}
                  disabled={!isArDirty || arSaving}
                  className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    isArDirty && !arSaving
                      ? 'bg-[var(--accent-primary)] text-[var(--text-inverse)] hover:bg-[var(--accent-hover)]'
                      : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] cursor-not-allowed'
                  }`}
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  {arSaving ? 'Saving…' : 'Save Changes'}
                </button>
                {isArDirty && !arSaving && (
                  <p className="text-xs text-[var(--text-tertiary)]">Unsaved changes</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Trust Indicators */}
        <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] p-6 mb-12">
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="flex items-center sm:flex-col sm:justify-center gap-4 sm:gap-3 text-left sm:text-center">
              <div className="w-10 h-10 bg-[var(--success)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-ui)' }}>100% Private</div>
                <div className="text-sm text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>Your data stays yours</div>
              </div>
            </div>
            <div className="flex items-center sm:flex-col sm:justify-center gap-4 sm:gap-3 text-left sm:text-center">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-ui)' }}>Secure Payment</div>
                <div className="text-sm text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>Protected by Stripe</div>
              </div>
            </div>
            <div className="flex items-center sm:flex-col sm:justify-center gap-4 sm:gap-3 text-left sm:text-center">
              <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-ui)' }}>Credits Never Expire</div>
                <div className="text-sm text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>Use them whenever you want</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PurchasePage;

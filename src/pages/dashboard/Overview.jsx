import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getBalance, getUsageSummary, getDailySavings, getChatBalance } from '../../services/hermaApi';
import { useHermaAuth } from '../../context/HermaAuthContext';
import OnboardingModal, { ONBOARDING_KEY } from '../../components/OnboardingModal';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const FRONTIER_MODELS = [
  { label: 'Claude Opus 4.6', value: 'anthropic/claude-opus-4.6' },
  { label: 'Claude Sonnet 4.6', value: 'anthropic/claude-sonnet-4.6' },
  { label: 'GPT-4.1', value: 'openai/gpt-4.1' },
  { label: 'o3', value: 'openai/o3' },
];

function SavingsTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;

  const frontierCost = payload.find((p) => p.dataKey === 'frontier_cost')?.value ?? 0;
  const yourCost = payload.find((p) => p.dataKey === 'your_cost')?.value ?? 0;
  const savings = frontierCost - yourCost;
  const savingsPct = frontierCost > 0 ? ((savings / frontierCost) * 100).toFixed(1) : 0;

  return (
    <div
      className="rounded-xl border border-[var(--border-primary)] p-3 shadow-lg"
      style={{
        background: 'var(--bg-secondary)',
        fontFamily: 'var(--font-ui)',
      }}
    >
      <p className="text-xs text-[var(--text-tertiary)] mb-2">{label}</p>
      <div className="space-y-1">
        <p className="text-sm text-[var(--text-secondary)]">
          Frontier Cost:{' '}
          <span className="text-[var(--text-primary)] font-medium">${frontierCost.toFixed(4)}</span>
        </p>
        <p className="text-sm text-[var(--text-secondary)]">
          Your Cost:{' '}
          <span className="text-[#5BAF8A] font-medium">${yourCost.toFixed(4)}</span>
        </p>
        {savings > 0 && (
          <p className="text-sm text-[#5BAF8A] font-medium pt-1 border-t border-[var(--border-primary)]">
            Saved: ${savings.toFixed(4)} ({savingsPct}%)
          </p>
        )}
      </div>
    </div>
  );
}

function SavingsChart() {
  const [frontierModel, setFrontierModel] = useState('anthropic/claude-opus-4.6');
  const [savingsData, setSavingsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSavings = useCallback(async (model) => {
    setLoading(true);
    setError('');
    try {
      const data = await getDailySavings(30, model);
      setSavingsData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSavings(frontierModel);
  }, [frontierModel, fetchSavings]);

  const selectedModelLabel =
    FRONTIER_MODELS.find((m) => m.value === frontierModel)?.label || frontierModel;

  // Compute summary stats
  const totalYourCost =
    savingsData?.daily_savings?.reduce((sum, d) => sum + (d.your_cost || 0), 0) ?? 0;
  const totalFrontierCost =
    savingsData?.daily_savings?.reduce((sum, d) => sum + (d.frontier_cost || 0), 0) ?? 0;
  const totalSaved = totalFrontierCost - totalYourCost;
  const totalSavingsPct =
    totalFrontierCost > 0 ? ((totalSaved / totalFrontierCost) * 100).toFixed(1) : 0;

  const chartData = (savingsData?.daily_savings || []).map((d) => ({
    date: d.date,
    your_cost: d.your_cost,
    frontier_cost: d.frontier_cost,
  }));

  const hasData = chartData.length > 0 && totalFrontierCost > 0;

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2
            className="text-xl font-bold text-[var(--text-primary)] tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Savings Visualization
          </h2>
          <p
            className="text-sm text-[var(--text-secondary)] mt-1"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Your spend vs. {selectedModelLabel} over the last 30 days
          </p>
        </div>

        {/* Model selector */}
        <select
          value={frontierModel}
          onChange={(e) => setFrontierModel(e.target.value)}
          className="rounded-lg px-3 py-2 text-sm border border-[var(--border-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/50 transition-colors"
          style={{
            background: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-ui)',
          }}
        >
          {FRONTIER_MODELS.map((m) => (
            <option key={m.value} value={m.value}>
              Compare vs. {m.label}
            </option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-[var(--accent-primary)] border-t-transparent animate-spin" />
            <span
              className="text-sm text-[var(--text-tertiary)]"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Loading savings data...
            </span>
          </div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="p-4 rounded-lg bg-[var(--error)]/5 border border-[var(--error)]/20">
          <p className="text-sm text-[var(--error)]/80">{error}</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && !hasData && (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <svg
            className="w-12 h-12 text-[var(--text-tertiary)] mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
            />
          </svg>
          <p
            className="text-[var(--text-secondary)] font-medium mb-1"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            No usage data yet
          </p>
          <p
            className="text-sm text-[var(--text-tertiary)]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Start making API calls to see your savings compared to {selectedModelLabel}.
          </p>
        </div>
      )}

      {/* Summary + Chart */}
      {!loading && !error && hasData && (
        <>
          {/* Summary stats */}
          <div className="flex flex-wrap gap-6 mb-6 p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)]">
            <div>
              <p
                className="text-xs text-[var(--text-tertiary)] mb-1"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Total Savings
              </p>
              <p
                className="text-2xl font-bold text-[#5BAF8A] tracking-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                ${totalSaved.toFixed(4)}{' '}
                <span className="text-sm font-medium text-[#5BAF8A]/70">
                  ({totalSavingsPct}%)
                </span>
              </p>
            </div>
            <div>
              <p
                className="text-xs text-[var(--text-tertiary)] mb-1"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Your Spend
              </p>
              <p
                className="text-2xl font-bold text-[var(--text-primary)] tracking-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                ${totalYourCost.toFixed(4)}
              </p>
            </div>
            <div>
              <p
                className="text-xs text-[var(--text-tertiary)] mb-1"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                {selectedModelLabel} Would Cost
              </p>
              <p
                className="text-2xl font-bold text-[var(--text-secondary)] tracking-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                ${totalFrontierCost.toFixed(4)}
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="frontierGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border-primary)"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }}
                  tickLine={false}
                  axisLine={{ stroke: 'var(--border-primary)' }}
                  tickFormatter={(val) => {
                    const d = new Date(val);
                    return `${d.getMonth() + 1}/${d.getDate()}`;
                  }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }}
                  tickLine={false}
                  axisLine={{ stroke: 'var(--border-primary)' }}
                  tickFormatter={(val) => `$${val.toFixed(2)}`}
                  width={60}
                />
                <Tooltip content={<SavingsTooltip />} />
                <Area
                  type="monotone"
                  dataKey="frontier_cost"
                  name="Frontier Cost"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  fill="url(#frontierGradient)"
                  fillOpacity={1}
                />
                <Area
                  type="monotone"
                  dataKey="your_cost"
                  name="Your Cost"
                  stroke="#34d399"
                  strokeWidth={2}
                  fill="url(#savingsGradient)"
                  fillOpacity={1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

const Overview = () => {
  const { user } = useHermaAuth();
  const [balance, setBalance] = useState(null);
  const [chatBalance, setChatBalance] = useState(null);
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(
    () => !!user && !localStorage.getItem(ONBOARDING_KEY)
  );

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const [balData, usageData, chatBalData] = await Promise.all([
          getBalance(),
          getUsageSummary(),
          getChatBalance().catch(() => null),
        ]);
        if (!cancelled) {
          setBalance(balData);
          setChatBalance(chatBalData);
          setUsage(usageData);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--accent-primary)] border-t-transparent animate-spin" />
          <span className="text-sm text-[var(--text-tertiary)]" style={{ fontFamily: 'var(--font-ui)' }}>
            Loading dashboard...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-lg bg-[var(--error)]/5 border border-[var(--error)]/20">
        <h3 className="text-[var(--error)] font-medium mb-2" style={{ fontFamily: 'var(--font-ui)' }}>Error loading dashboard</h3>
        <p className="text-[var(--error)]/80 text-sm">{error}</p>
      </div>
    );
  }

  const cards = [
    {
      label: 'Available Credits',
      value: (() => {
        const bal = balance ? parseFloat(balance.balance_usd) : 0;
        const free = chatBalance?.chat_free_credit_usd ? parseFloat(chatBalance.chat_free_credit_usd) : 0;
        return `$${(bal + free).toFixed(2)}`;
      })(),
      subtext: chatBalance?.chat_free_credit_usd && parseFloat(chatBalance.chat_free_credit_usd) > 0
        ? `Includes $${parseFloat(chatBalance.chat_free_credit_usd).toFixed(2)} free credit`
        : 'Available credits',
      icon: (
        <svg className="w-6 h-6 text-[#5BAF8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Total Requests',
      value: usage ? usage.total_requests.toLocaleString() : '0',
      subtext: 'Lifetime API calls',
      icon: (
        <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      label: 'Total Savings',
      value: usage ? `$${parseFloat(usage.total_savings_usd ?? 0).toFixed(4)}` : '$0.0000',
      subtext: 'vs. paying frontier prices',
      icon: (
        <svg className="w-6 h-6 text-[#5BAF8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      label: 'Total Tokens',
      value: usage ? usage.total_tokens.toLocaleString() : '0',
      subtext: 'Lifetime token usage',
      icon: (
        <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
    },
  ];

  const totalBalance = (() => {
    const bal = balance ? parseFloat(balance.balance_usd) : 0;
    const free = chatBalance?.chat_free_credit_usd ? parseFloat(chatBalance.chat_free_credit_usd) : 0;
    return bal + free;
  })();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Low balance nudge */}
      {totalBalance < 5 && totalBalance >= 0 && !loading && (
        <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-amber-900" style={{ fontFamily: 'var(--font-ui)' }}>
              Running low on credits — ${totalBalance.toFixed(2)} remaining
            </p>
          </div>
          <Link
            to="/upgrade"
            className="flex-shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 text-white hover:bg-amber-400 transition-colors"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Add credits
          </Link>
        </div>
      )}

      {/* Welcome Header */}
      <div>
        <h1
          className="text-3xl font-bold text-[var(--text-primary)] mb-2 tracking-tight"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Welcome back, {user?.name?.split(' ')[0] || 'Developer'}
        </h1>
        <p
          className="text-[var(--text-secondary)] text-lg"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Here's what's happening with your API usage today.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div
            key={card.label}
            className="group relative bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-6 rounded-2xl hover:border-[var(--accent-primary)]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--accent-primary)]/5"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] group-hover:scale-110 transition-transform duration-300">
                {card.icon}
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-[var(--text-tertiary)]" style={{ fontFamily: 'var(--font-ui)' }}>
                {card.label}
              </p>
              <h3 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                {card.value}
              </h3>
              <p className="text-xs text-[var(--text-tertiary)]" style={{ fontFamily: 'var(--font-ui)' }}>
                {card.subtext}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Savings Visualization */}
      < SavingsChart />

      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        userName={user?.name}
      />
    </div>
  );
};

export default Overview;

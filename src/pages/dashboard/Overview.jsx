import React, { useState, useEffect } from 'react';
import { getBalance, getUsageSummary } from '../../services/hermaApi';
import { useHermaAuth } from '../../context/HermaAuthContext';

const Overview = () => {
  const { user } = useHermaAuth();
  const [balance, setBalance] = useState(null);
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const [balData, usageData] = await Promise.all([
          getBalance(),
          getUsageSummary(),
        ]);
        if (!cancelled) {
          setBalance(balData);
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
      label: 'Current Balance',
      value: balance ? `$${parseFloat(balance.balance_usd).toFixed(2)}` : '$0.00',
      subtext: 'Available credits',
      icon: (
        <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      trend: '+12%', // Mock trend
      trendUp: true
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
      trend: '+5.4%',
      trendUp: true
    },
    {
      label: 'Total Spend',
      value: usage ? `$${parseFloat(usage.total_cost_usd).toFixed(4)}` : '$0.0000',
      subtext: 'Lifetime usage cost',
      icon: (
        <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 3.666A5.002 5.002 0 0112 21a5.002 5.002 0 01-5-9.666M9 19H5.002A2 2 0 013 17v-1a2 2 0 012-2h4M15 19h3.998A2 2 0 0021 17v-1a2 2 0 00-2-2h-4M9 10h6" />
        </svg>
      ),
      trend: '+2.1%',
      trendUp: true
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              {card.trend && (
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${card.trendUp
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                  {card.trend}
                </span>
              )}
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
    </div>
  );
};

export default Overview;

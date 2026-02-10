import React, { useState, useEffect } from 'react';
import { getBalance, getUsageSummary } from '../../services/hermaApi';

const Overview = () => {
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
      <div className="flex items-center justify-center py-20">
        <div
          className="text-sm text-[var(--text-tertiary)]"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 text-sm text-[var(--error)]"
        style={{ borderRadius: 'var(--radius-sm)' }}
      >
        {error}
      </div>
    );
  }

  const cards = [
    {
      label: 'Balance',
      value: balance
        ? `$${parseFloat(balance.balance_usd).toFixed(2)}`
        : '$0.00',
    },
    {
      label: 'Total Requests',
      value: usage ? usage.total_requests.toLocaleString() : '0',
    },
    {
      label: 'Total Spend',
      value: usage
        ? `$${parseFloat(usage.total_cost_usd).toFixed(4)}`
        : '$0.0000',
    },
  ];

  return (
    <div>
      <h1
        className="text-2xl font-bold text-[var(--text-primary)] mb-6"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-6"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <p
              className="text-sm text-[var(--text-tertiary)] mb-1"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              {card.label}
            </p>
            <p
              className="text-2xl font-bold text-[var(--text-primary)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overview;

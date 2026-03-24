import React, { useState, useEffect, useCallback } from 'react';
import { getRoutingQuality } from '../../services/hermaApi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const PERIOD_OPTIONS = [
  { label: '7 days', value: 7 },
  { label: '30 days', value: 30 },
  { label: '90 days', value: 90 },
];

const MODEL_COLORS = [
  '#34d399', // emerald
  '#60a5fa', // blue
  '#a78bfa', // purple
  '#fbbf24', // amber
  '#f87171', // red
  '#2dd4bf', // teal
  '#fb923c', // orange
  '#e879f9', // fuchsia
];

function ModelTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) return null;
  const data = payload[0]?.payload;
  if (!data) return null;

  return (
    <div
      className="rounded-xl border border-[var(--border-primary)] p-3 shadow-lg"
      style={{ background: 'var(--bg-secondary)', fontFamily: 'var(--font-ui)' }}
    >
      <p className="text-sm font-medium text-[var(--text-primary)] mb-1">{data.shortName}</p>
      <p className="text-sm text-[var(--text-secondary)]">
        {data.count} request{data.count !== 1 ? 's' : ''}{' '}
        <span className="text-[var(--text-tertiary)]">({data.pct}%)</span>
      </p>
    </div>
  );
}

function QualityScoreBar({ label, value, max = 5 }) {
  const pct = (value / max) * 100;
  const color = value >= 4.0 ? '#34d399' : value >= 3.0 ? '#fbbf24' : '#f87171';

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span
          className="text-sm text-[var(--text-secondary)]"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          {label}
        </span>
        <span
          className="text-sm font-medium"
          style={{ fontFamily: 'var(--font-heading)', color }}
        >
          {value.toFixed(2)}
        </span>
      </div>
      <div className="h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

const Quality = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [days, setDays] = useState(30);

  const fetchData = useCallback(async (period) => {
    setLoading(true);
    setError('');
    try {
      const result = await getRoutingQuality(period);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(days);
  }, [days, fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--accent-primary)] border-t-transparent animate-spin" />
          <span className="text-sm text-[var(--text-tertiary)]" style={{ fontFamily: 'var(--font-ui)' }}>
            Loading quality data...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-lg bg-[var(--error)]/5 border border-[var(--error)]/20">
        <h3 className="text-[var(--error)] font-medium mb-2" style={{ fontFamily: 'var(--font-ui)' }}>
          Error loading quality data
        </h3>
        <p className="text-[var(--error)]/80 text-sm">{error}</p>
      </div>
    );
  }

  const totalRequests = data?.total_requests || 0;
  const quality = data?.quality || {};
  const savings = data?.savings || {};
  const modelDist = (data?.model_distribution || []).map((m, i) => {
    const parts = m.model.split('/');
    return {
      ...m,
      shortName: parts[parts.length - 1],
      pct: totalRequests > 0 ? ((m.count / totalRequests) * 100).toFixed(1) : '0',
      fill: MODEL_COLORS[i % MODEL_COLORS.length],
    };
  });
  const categoryBreakdown = data?.category_breakdown || [];

  // Group categories for display
  const categoryMap = {};
  for (const item of categoryBreakdown) {
    if (!categoryMap[item.category]) {
      categoryMap[item.category] = { total: 0, difficulties: {} };
    }
    categoryMap[item.category].total += item.count;
    categoryMap[item.category].difficulties[item.difficulty] = item.count;
  }

  const hasData = totalRequests > 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-bold text-[var(--text-primary)] mb-2 tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Routing Quality
          </h1>
          <p
            className="text-[var(--text-secondary)] text-lg"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            How your requests are being routed and scored.
          </p>
        </div>

        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="rounded-lg px-3 py-2 text-sm border border-[var(--border-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/50 transition-colors"
          style={{
            background: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-ui)',
          }}
        >
          {PERIOD_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              Last {o.label}
            </option>
          ))}
        </select>
      </div>

      {!hasData ? (
        /* Empty state */
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl p-6">
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
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-[var(--text-secondary)] font-medium mb-1" style={{ fontFamily: 'var(--font-ui)' }}>
              No routing data yet
            </p>
            <p className="text-sm text-[var(--text-tertiary)]" style={{ fontFamily: 'var(--font-body)' }}>
              Start making API calls to see routing quality metrics.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-6 rounded-2xl hover:border-[var(--accent-primary)]/30 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)]">
                  <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <p className="text-sm font-medium text-[var(--text-tertiary)]" style={{ fontFamily: 'var(--font-ui)' }}>Total Requests</p>
              <h3 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                {totalRequests.toLocaleString()}
              </h3>
              <p className="text-xs text-[var(--text-tertiary)]" style={{ fontFamily: 'var(--font-ui)' }}>Last {days} days</p>
            </div>

            <div className="group bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-6 rounded-2xl hover:border-[var(--accent-primary)]/30 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)]">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-sm font-medium text-[var(--text-tertiary)]" style={{ fontFamily: 'var(--font-ui)' }}>Overall Quality</p>
              <h3 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                {quality.avg_overall?.toFixed(2) || 'N/A'}
                <span className="text-lg text-[var(--text-tertiary)] font-normal">/5</span>
              </h3>
              <p className="text-xs text-[var(--text-tertiary)]" style={{ fontFamily: 'var(--font-ui)' }}>
                {quality.scored_count || 0} scored responses
              </p>
            </div>

            <div className="group bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-6 rounded-2xl hover:border-[var(--accent-primary)]/30 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)]">
                  <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                </div>
              </div>
              <p className="text-sm font-medium text-[var(--text-tertiary)]" style={{ fontFamily: 'var(--font-ui)' }}>High Quality Rate</p>
              <h3 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                {quality.high_quality_pct != null ? `${quality.high_quality_pct}%` : 'N/A'}
              </h3>
              <p className="text-xs text-[var(--text-tertiary)]" style={{ fontFamily: 'var(--font-ui)' }}>Responses scored 4.0+</p>
            </div>

            <div className="group bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-6 rounded-2xl hover:border-[var(--accent-primary)]/30 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)]">
                  <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                </div>
              </div>
              <p className="text-sm font-medium text-[var(--text-tertiary)]" style={{ fontFamily: 'var(--font-ui)' }}>Models Used</p>
              <h3 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                {modelDist.length}
              </h3>
              <p className="text-xs text-[var(--text-tertiary)]" style={{ fontFamily: 'var(--font-ui)' }}>Distinct models routed to</p>
            </div>
          </div>

          {/* Savings Banner */}
          {savings.savings_pct > 0 && (
            <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h2
                    className="text-xl font-bold text-[var(--text-primary)] tracking-tight"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    You saved {savings.savings_pct}% vs frontier
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>
                    ${savings.actual_cost_usd?.toFixed(4)} actual vs ${savings.frontier_cost_usd?.toFixed(4)} at frontier prices
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400" style={{ fontFamily: 'var(--font-heading)' }}>
                    ${savings.savings_usd?.toFixed(4)}
                  </div>
                  <div className="text-xs text-[var(--text-tertiary)]" style={{ fontFamily: 'var(--font-ui)' }}>saved</div>
                </div>
              </div>
            </div>
          )}

          {/* Model Distribution Chart */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl p-6">
            <h2
              className="text-xl font-bold text-[var(--text-primary)] tracking-tight mb-1"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Model Distribution
            </h2>
            <p
              className="text-sm text-[var(--text-secondary)] mb-6"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              How your requests are distributed across models.
            </p>

            {modelDist.length > 0 ? (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={modelDist} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border-primary)"
                      opacity={0.5}
                    />
                    <XAxis
                      dataKey="shortName"
                      tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }}
                      tickLine={false}
                      axisLine={{ stroke: 'var(--border-primary)' }}
                      angle={-30}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }}
                      tickLine={false}
                      axisLine={{ stroke: 'var(--border-primary)' }}
                      width={50}
                    />
                    <Tooltip content={<ModelTooltip />} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {modelDist.map((entry, idx) => (
                        <Cell key={entry.shortName} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-[var(--text-tertiary)] text-center py-8" style={{ fontFamily: 'var(--font-ui)' }}>
                No model distribution data available.
              </p>
            )}
          </div>

          {/* Quality Scores + Category Breakdown side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quality Scores */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl p-6">
              <h2
                className="text-xl font-bold text-[var(--text-primary)] tracking-tight mb-1"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Quality Scores
              </h2>
              <p
                className="text-sm text-[var(--text-secondary)] mb-6"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Average scores across {quality.scored_count || 0} evaluated responses.
              </p>

              {quality.scored_count > 0 ? (
                <div className="space-y-5">
                  <QualityScoreBar label="Overall" value={quality.avg_overall || 0} />
                  <QualityScoreBar label="Relevance" value={quality.avg_relevance || 0} />
                  <QualityScoreBar label="Accuracy" value={quality.avg_accuracy || 0} />
                  <QualityScoreBar label="Helpfulness" value={quality.avg_helpfulness || 0} />
                </div>
              ) : (
                <p className="text-sm text-[var(--text-tertiary)] text-center py-8" style={{ fontFamily: 'var(--font-ui)' }}>
                  No quality scores available yet.
                </p>
              )}
            </div>

            {/* Category Breakdown */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl p-6">
              <h2
                className="text-xl font-bold text-[var(--text-primary)] tracking-tight mb-1"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Category Breakdown
              </h2>
              <p
                className="text-sm text-[var(--text-secondary)] mb-6"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Types of queries the router has classified.
              </p>

              {Object.keys(categoryMap).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(categoryMap)
                    .sort((a, b) => b[1].total - a[1].total)
                    .map(([category, info]) => {
                      const pct = totalRequests > 0 ? ((info.total / totalRequests) * 100).toFixed(1) : '0';
                      return (
                        <div key={category} className="flex items-center justify-between py-2 border-b border-[var(--border-primary)] last:border-0">
                          <div>
                            <span
                              className="text-sm font-medium text-[var(--text-primary)] capitalize"
                              style={{ fontFamily: 'var(--font-ui)' }}
                            >
                              {category.replace(/_/g, ' ')}
                            </span>
                            <div className="flex gap-2 mt-0.5">
                              {Object.entries(info.difficulties)
                                .sort((a, b) => b[1] - a[1])
                                .map(([diff, count]) => (
                                  <span
                                    key={diff}
                                    className="text-xs text-[var(--text-tertiary)] px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)]"
                                    style={{ fontFamily: 'var(--font-ui)' }}
                                  >
                                    {diff}: {count}
                                  </span>
                                ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <span
                              className="text-sm font-medium text-[var(--text-primary)]"
                              style={{ fontFamily: 'var(--font-heading)' }}
                            >
                              {info.total}
                            </span>
                            <span className="text-xs text-[var(--text-tertiary)] ml-1">({pct}%)</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <p className="text-sm text-[var(--text-tertiary)] text-center py-8" style={{ fontFamily: 'var(--font-ui)' }}>
                  No category data available yet.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Quality;

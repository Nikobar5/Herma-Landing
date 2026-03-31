import React, { useState, useEffect } from 'react';
import { getAdminFunnel } from '../../services/hermaApi';

const PERIODS = [
  { label: '7d', value: 7 },
  { label: '30d', value: 30 },
  { label: '90d', value: 90 },
];

const STAGE_LABELS = {
  visitors: 'Visitors',
  signups: 'Sign-ups',
  first_chat: 'First Chat',
  payment: 'Payment',
};

export default function FunnelTab() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [prevData, setPrevData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      getAdminFunnel(days),
      getAdminFunnel(days * 2),
    ])
      .then(([curr, extended]) => {
        setData(curr);
        // Derive previous equal period by subtracting current from doubled window
        const prevStages = curr.stages.map((s, i) => {
          const extCount = extended.stages[i]?.count || 0;
          return { ...s, count: Math.max(0, extCount - s.count) };
        });
        const prevVisitors = prevStages[0]?.count || 0;
        const prevPayments = prevStages[prevStages.length - 1]?.count || 0;
        const prevConv = prevVisitors > 0 ? (prevPayments / prevVisitors) * 100 : null;
        setPrevData({ stages: prevStages, overall_conversion_pct: prevConv });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [days]);

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
            Conversion Funnel
          </h2>
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
            Visitor to paying customer pipeline
          </p>
        </div>

        {/* Period selector */}
        <div className="flex gap-1 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-lg p-1">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setDays(p.value)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                days === p.value
                  ? 'bg-[var(--accent-primary)] text-white font-medium'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
              }`}
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="text-[var(--text-tertiary)] text-center py-16 text-sm">
          Loading funnel data...
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
          Failed to load funnel: {error}
        </div>
      )}

      {data && !loading && (
        <>
          {/* Overall conversion KPI */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl p-5">
            <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide mb-1" style={{ fontFamily: 'var(--font-ui)' }}>
              Overall Conversion (visitors → payment)
            </div>
            <div className="text-3xl font-semibold text-[var(--accent-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
              {data.overall_conversion_pct != null
                ? `${Number(data.overall_conversion_pct).toFixed(2)}%`
                : '—'}
            </div>
            <div className="flex items-center gap-3 mt-1">
              <div className="text-xs text-[var(--text-tertiary)]">Last {data.period_days} days</div>
              {prevData?.overall_conversion_pct != null && (() => {
                const delta = Number(data.overall_conversion_pct) - prevData.overall_conversion_pct;
                return (
                  <span className={`text-xs font-semibold ${delta >= 0 ? 'text-[#5BAF8A]' : 'text-red-400'}`}>
                    {delta >= 0 ? '▲' : '▼'} {Math.abs(delta).toFixed(2)}pp vs prior {days}d
                  </span>
                );
              })()}
            </div>
          </div>

          {/* Funnel bars */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-5" style={{ fontFamily: 'var(--font-heading)' }}>
              Funnel Stages
            </h3>

            <div className="space-y-4">
              {data.stages.map((stage, i) => {
                const maxCount = data.stages[0]?.count || 1;
                const barPct = maxCount > 0 ? (stage.count / maxCount) * 100 : 0;
                const isFirst = i === 0;
                const prevCount = prevData?.stages[i]?.count;
                const stageDeltaPct = (prevCount != null && prevCount > 0)
                  ? ((stage.count - prevCount) / prevCount) * 100
                  : null;

                return (
                  <div key={stage.name}>
                    {/* Stage label row */}
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-5 h-5 flex items-center justify-center rounded-full bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] text-xs font-semibold flex-shrink-0"
                          style={{ fontFamily: 'var(--font-ui)' }}
                        >
                          {i + 1}
                        </span>
                        <span className="text-sm text-[var(--text-primary)] font-medium" style={{ fontFamily: 'var(--font-ui)' }}>
                          {STAGE_LABELS[stage.name] || stage.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-sm" style={{ fontFamily: 'var(--font-code)' }}>
                        {stageDeltaPct != null && (
                          <span className={`text-[10px] font-semibold ${stageDeltaPct >= 0 ? 'text-[#5BAF8A]' : 'text-red-400'}`}>
                            {stageDeltaPct >= 0 ? '▲' : '▼'} {Math.abs(stageDeltaPct).toFixed(0)}%
                          </span>
                        )}
                        <span className="text-[var(--text-primary)] font-semibold">
                          {stage.count.toLocaleString()}
                        </span>
                        {!isFirst && (
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              stage.conversion_pct >= 50
                                ? 'bg-[#5BAF8A]/10 text-[#5BAF8A]'
                                : stage.conversion_pct >= 10
                                ? 'bg-yellow-400/10 text-yellow-400'
                                : 'bg-red-400/10 text-red-400'
                            }`}
                          >
                            {Number(stage.conversion_pct).toFixed(1)}% from prev
                          </span>
                        )}
                        {isFirst && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                            100%
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Horizontal bar */}
                    <div className="h-8 bg-[var(--bg-primary)] rounded-lg overflow-hidden">
                      <div
                        className="h-full rounded-lg transition-all duration-500"
                        style={{
                          width: `${Math.max(barPct, barPct > 0 ? 1 : 0)}%`,
                          background: isFirst
                            ? 'var(--accent-primary)'
                            : `color-mix(in srgb, var(--accent-primary) ${Math.max(30, 100 - i * 20)}%, transparent)`,
                          opacity: isFirst ? 1 : 0.75 + (1 - i * 0.1),
                        }}
                      />
                    </div>

                    {/* Connector arrow */}
                    {i < data.stages.length - 1 && (
                      <div className="flex items-center justify-center mt-2">
                        <div className="text-[var(--text-tertiary)] text-xs">&#x2193;</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stage breakdown table */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-[var(--border-primary)]">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
                Stage Breakdown
              </h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-primary)] text-[var(--text-tertiary)]">
                  <th className="text-left py-2 px-4 font-medium" style={{ fontFamily: 'var(--font-ui)' }}>Stage</th>
                  <th className="text-right py-2 px-4 font-medium" style={{ fontFamily: 'var(--font-ui)' }}>Count</th>
                  <th className="text-right py-2 px-4 font-medium" style={{ fontFamily: 'var(--font-ui)' }}>Prev {days}d</th>
                  <th className="text-right py-2 px-4 font-medium" style={{ fontFamily: 'var(--font-ui)' }}>Conv. from Prev</th>
                  <th className="text-right py-2 px-4 font-medium" style={{ fontFamily: 'var(--font-ui)' }}>Drop-off</th>
                </tr>
              </thead>
              <tbody>
                {data.stages.map((stage, i) => {
                  const prevCount = i > 0 ? data.stages[i - 1].count : null;
                  const dropOff = prevCount != null ? prevCount - stage.count : null;
                  const prevPeriodCount = prevData?.stages[i]?.count;
                  const prevDeltaPct = (prevPeriodCount != null && prevPeriodCount > 0)
                    ? ((stage.count - prevPeriodCount) / prevPeriodCount) * 100
                    : null;

                  return (
                    <tr key={stage.name} className="border-b border-[var(--border-primary)] hover:bg-[var(--bg-primary)]/50">
                      <td className="py-2.5 px-4 text-[var(--text-secondary)] font-medium" style={{ fontFamily: 'var(--font-ui)' }}>
                        {STAGE_LABELS[stage.name] || stage.name}
                      </td>
                      <td className="py-2.5 px-4 text-right text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-code)' }}>
                        {stage.count.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 text-right" style={{ fontFamily: 'var(--font-code)' }}>
                        {prevPeriodCount != null ? (
                          <span className="text-[var(--text-tertiary)]">
                            {prevPeriodCount.toLocaleString()}
                            {prevDeltaPct != null && (
                              <span className={`ml-1.5 text-[10px] font-semibold ${prevDeltaPct >= 0 ? 'text-[#5BAF8A]' : 'text-red-400'}`}>
                                {prevDeltaPct >= 0 ? '▲' : '▼'}{Math.abs(prevDeltaPct).toFixed(0)}%
                              </span>
                            )}
                          </span>
                        ) : <span className="text-[var(--text-tertiary)]">—</span>}
                      </td>
                      <td className="py-2.5 px-4 text-right" style={{ fontFamily: 'var(--font-code)' }}>
                        {i === 0 ? (
                          <span className="text-[var(--text-tertiary)]">—</span>
                        ) : (
                          <span className={
                            stage.conversion_pct >= 50 ? 'text-[#5BAF8A]'
                            : stage.conversion_pct >= 10 ? 'text-yellow-400'
                            : 'text-red-400'
                          }>
                            {Number(stage.conversion_pct).toFixed(1)}%
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-right text-[var(--text-tertiary)]" style={{ fontFamily: 'var(--font-code)' }}>
                        {dropOff != null ? `-${dropOff.toLocaleString()}` : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

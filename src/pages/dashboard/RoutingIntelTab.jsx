import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area, Legend,
} from 'recharts';
import { getDerivativeOverview, getDerivativesByCell } from '../../services/hermaApi';

const PERIODS = [
  { label: '7d', value: 7 },
  { label: '14d', value: 14 },
  { label: '30d', value: 30 },
];

const PIE_COLORS = [
  '#818CF8', '#34D399', '#FBBF24', '#F87171', '#60A5FA',
  '#A78BFA', '#FB923C', '#4ADE80', '#F472B6', '#38BDF8',
];

function fmt(n, decimals = 1) {
  if (n == null) return '—';
  return Number(n).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function fmtPct(n) {
  if (n == null) return '—';
  return fmt(n, 1) + '%';
}

function fmtInt(n) {
  if (n == null) return '—';
  return Number(n).toLocaleString();
}

function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-xl p-5 hover:bg-[var(--bg-secondary)]/30 transition-colors">
      <div className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider mb-2" style={{ fontFamily: 'var(--font-ui)' }}>
        {label}
      </div>
      <div className="text-3xl font-light tracking-tight text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
        {value}
      </div>
      {sub && <div className="text-xs text-[var(--text-tertiary)] mt-1.5">{sub}</div>}
    </div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg px-3 py-2 shadow-lg text-xs bg-[var(--bg-secondary)] border border-[var(--border-secondary)]">
      <div className="text-[var(--text-tertiary)] mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-[var(--text-secondary)]">{p.name}:</span>
          <span className="text-[var(--text-primary)] font-medium">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg px-3 py-2 shadow-lg text-xs bg-[var(--bg-secondary)] border border-[var(--border-secondary)]">
      <div className="text-[var(--text-primary)] font-medium">{payload[0].name}</div>
      <div className="text-[var(--text-tertiary)]">{payload[0].value} ({fmtPct(payload[0].payload.pct)})</div>
    </div>
  );
}

function EmptyChart({ height = 220 }) {
  return (
    <div className="flex items-center justify-center text-xs text-[var(--text-tertiary)]" style={{ height }}>
      No data available
    </div>
  );
}

export default function RoutingIntelTab() {
  const [days, setDays] = useState(7);
  const [overview, setOverview] = useState(null);
  const [cells, setCells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      getDerivativeOverview(days).catch(() => null),
      getDerivativesByCell(days).catch(() => []),
    ])
      .then(([ov, cl]) => {
        setOverview(ov);
        setCells(Array.isArray(cl) ? cl : cl?.cells || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [days]);

  // Derived chart data from overview
  const total = overview?.total_derivatives || 0;
  const codePct = total > 0 ? ((overview?.code_count || 0) / total) * 100 : null;
  const toolPct = total > 0 ? ((overview?.tool_use_count || 0) / total) * 100 : null;
  const multiTurnPct = total > 0 ? ((overview?.multi_turn_count || 0) / total) * 100 : null;

  const topicData = Object.entries(overview?.topic_distribution || {}).map(([name, count], i) => ({
    name,
    value: count,
    pct: total > 0 ? (count / total) * 100 : 0,
  }));

  const categoryData = Object.entries(overview?.category_distribution || {}).map(([name, count]) => ({
    name,
    Count: count,
  })).sort((a, b) => b.Count - a.Count);

  const dailyData = (overview?.daily_trend || []).map((d) => ({
    date: d.date?.slice(5) || '',
    Derivatives: d.count || 0,
  }));

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-[var(--error)] text-sm mb-2">Failed to load routing intelligence data</div>
          <div className="text-xs text-[var(--text-tertiary)]">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with period selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
            Routing Intelligence
          </h2>
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
            Derivative features extracted from API requests
          </p>
        </div>
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

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Total Derivatives"
          value={loading ? '—' : fmtInt(total)}
          sub={`last ${days} days`}
        />
        <StatCard
          label="Code Requests"
          value={loading ? '—' : fmtPct(codePct)}
          sub="with code blocks"
        />
        <StatCard
          label="Tool Use"
          value={loading ? '—' : fmtPct(toolPct)}
          sub="with tool calls"
        />
        <StatCard
          label="Multi-turn"
          value={loading ? '—' : fmtPct(multiTurnPct)}
          sub="multi-message threads"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Topic distribution pie chart */}
        <div className="rounded-xl p-5">
          <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide mb-4" style={{ fontFamily: 'var(--font-ui)' }}>
            Topic Domain Distribution
          </div>
          {loading ? (
            <EmptyChart />
          ) : topicData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={topicData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {topicData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 10, color: '#71717A' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart />
          )}
        </div>

        {/* Query category bar chart */}
        <div className="rounded-xl p-5">
          <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide mb-4" style={{ fontFamily: 'var(--font-ui)' }}>
            Query Category Distribution
          </div>
          {loading ? (
            <EmptyChart />
          ) : categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryData} layout="vertical" margin={{ left: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#71717A', fontSize: 10 }} axisLine={{ stroke: 'rgba(255,255,255,0.08)' }} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#71717A', fontSize: 10 }} axisLine={{ stroke: 'rgba(255,255,255,0.08)' }} width={72} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="Count" fill="#818CF8" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart />
          )}
        </div>
      </div>

      {/* Routing cell health table */}
      <div className="rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[var(--border-secondary)]">
          <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide" style={{ fontFamily: 'var(--font-ui)' }}>
            Routing Cell Health
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--text-tertiary)] text-xs border-b border-[var(--border-secondary)]">
                <th className="text-left px-4 py-2 font-medium">Cell</th>
                <th className="text-right px-4 py-2 font-medium">Count</th>
                <th className="text-right px-4 py-2 font-medium">Avg Quality</th>
                <th className="text-right px-4 py-2 font-medium">Code %</th>
                <th className="text-right px-4 py-2 font-medium">Tool Use %</th>
                <th className="text-left px-4 py-2 font-medium">Top Domain</th>
                <th className="text-right px-4 py-2 font-medium">Avg Tokens</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-xs text-[var(--text-tertiary)]">
                    Loading…
                  </td>
                </tr>
              ) : cells.length > 0 ? cells.map((cell, i) => (
                <tr key={i} className="border-b border-[var(--border-secondary)]/50 hover:bg-[var(--bg-tertiary)]/30">
                  <td className="px-4 py-2">
                    <span className="font-mono text-xs text-[var(--text-primary)]">
                      {cell.category}:{cell.difficulty}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right text-[var(--text-secondary)] text-xs">{fmtInt(cell.count)}</td>
                  <td className="px-4 py-2 text-right text-xs">
                    <span className={
                      (cell.avg_quality || 0) >= 0.8 ? 'text-green-400' :
                      (cell.avg_quality || 0) >= 0.6 ? 'text-yellow-400' : 'text-red-400'
                    }>
                      {cell.avg_quality != null ? fmt(cell.avg_quality * 100) + '%' : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right text-[var(--text-secondary)] text-xs">{fmtPct(cell.code_pct)}</td>
                  <td className="px-4 py-2 text-right text-[var(--text-secondary)] text-xs">{fmtPct(cell.tool_use_pct)}</td>
                  <td className="px-4 py-2 text-[var(--text-secondary)] text-xs">{cell.top_domain || '—'}</td>
                  <td className="px-4 py-2 text-right text-[var(--text-secondary)] text-xs">{fmtInt(cell.avg_tokens)}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-xs text-[var(--text-tertiary)]">
                    No routing cell data yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Daily trend area chart */}
      <div className="rounded-xl p-5">
        <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide mb-4" style={{ fontFamily: 'var(--font-ui)' }}>
          Daily Derivative Count
        </div>
        {loading ? (
          <EmptyChart height={180} />
        ) : dailyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="date" tick={{ fill: '#71717A', fontSize: 10 }} axisLine={{ stroke: 'rgba(255,255,255,0.08)' }} />
              <YAxis tick={{ fill: '#71717A', fontSize: 10 }} axisLine={{ stroke: 'rgba(255,255,255,0.08)' }} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="Derivatives" stroke="#34D399" fill="#34D399" fillOpacity={0.12} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChart height={180} />
        )}
      </div>
    </div>
  );
}

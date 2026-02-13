import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHermaAuth } from '../context/HermaAuthContext';
import {
  getAdminOverview,
  getAdminDaily,
  getAdminHourly,
  getAdminModels,
  getAdminRecent,
  getAdminMemory,
  getAdminRouting,
  getAdminQuality,
  getAdminAgents,
  getAdminReports,
  generateReportsNow,
  getSchedulerStatus,
  getAgentHierarchy,
  getAgentTrustScores,
  getPendingPermissions,
  approvePermission,
  denyPermission,
  getDecisionLog,
  getNotifications,
  getNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
  actionNotification,
  getAgentBudgets,
  allocateBudget,
  updateBudget,
  getQaOverview,
  getQaRuns,
  triggerQaRun,
  getQaScenarios,
  generateQaScenarios,
  activateQaScenario,
  retireQaScenario,
  getCsuiteOverview,
} from '../services/hermaApi';

function fmt(n, decimals = 2) {
  if (n == null) return '—';
  return Number(n).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function fmtUsd(n) {
  if (n == null) return '—';
  return '$' + fmt(n);
}

function fmtPct(n) {
  if (n == null) return '—';
  return fmt(n, 1) + '%';
}

function timeAgo(dateStr) {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// Tiny sparkline bar chart
function MiniBar({ data, valueKey, height = 40, className = '' }) {
  if (!data || data.length === 0) return null;
  const values = data.map((d) => Number(d[valueKey]) || 0);
  const max = Math.max(...values, 1);
  const barW = Math.max(2, Math.floor(200 / values.length) - 1);

  return (
    <div className={`flex items-end gap-px ${className}`} style={{ height }}>
      {values.map((v, i) => (
        <div
          key={i}
          className="bg-[var(--accent-primary)] rounded-t opacity-70 hover:opacity-100 transition-opacity"
          style={{ width: barW, height: Math.max(1, (v / max) * height) }}
          title={`${data[i]?.date || data[i]?.hour || ''}: ${v}`}
        />
      ))}
    </div>
  );
}

function StatCard({ label, value, sub, trend, accent }) {
  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl p-5 hover:border-[var(--border-accent)] transition-colors">
      <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide mb-1" style={{ fontFamily: 'var(--font-ui)' }}>
        {label}
      </div>
      <div className={`text-2xl font-semibold ${accent ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'}`} style={{ fontFamily: 'var(--font-heading)' }}>
        {value}
      </div>
      {sub && <div className="text-xs text-[var(--text-tertiary)] mt-1">{sub}</div>}
      {trend != null && (
        <div className={`text-xs mt-1 ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend >= 0 ? '+' : ''}{fmtPct(trend)} vs yesterday
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const { isAdmin, logout } = useHermaAuth();
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [daily, setDaily] = useState([]);
  const [hourly, setHourly] = useState([]);
  const [models, setModels] = useState([]);
  const [recent, setRecent] = useState([]);
  const [memory, setMemory] = useState(null);
  const [routing, setRouting] = useState(null);
  const [quality, setQuality] = useState(null);
  const [agents, setAgents] = useState(null);
  const [hierarchy, setHierarchy] = useState(null);
  const [trustScores, setTrustScores] = useState(null);
  const [pendingPerms, setPendingPerms] = useState(null);
  const [notifCount, setNotifCount] = useState(0);
  const [budgets, setBudgets] = useState(null);
  const [qaOverview, setQaOverview] = useState(null);
  const [csuiteData, setCsuiteData] = useState(null);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [notifDropdownData, setNotifDropdownData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('overview');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [ov, dy, hr, md, rc, mem, rt, ql, ag, hier, trust, perms, nc, bud, qa, cs] = await Promise.all([
        getAdminOverview(),
        getAdminDaily(30),
        getAdminHourly(24),
        getAdminModels(),
        getAdminRecent(30),
        getAdminMemory(),
        getAdminRouting().catch(() => null),
        getAdminQuality().catch(() => null),
        getAdminAgents().catch(() => null),
        getAgentHierarchy().catch(() => null),
        getAgentTrustScores().catch(() => null),
        getPendingPermissions().catch(() => null),
        getNotificationCount().catch(() => ({ unread: 0 })),
        getAgentBudgets().catch(() => null),
        getQaOverview().catch(() => null),
        getCsuiteOverview().catch(() => null),
      ]);
      setOverview(ov);
      setDaily(dy);
      setHourly(hr);
      setModels(md);
      setRecent(rc);
      setMemory(mem);
      setRouting(rt);
      setQuality(ql);
      setAgents(ag);
      setHierarchy(hier);
      setTrustScores(trust);
      setPendingPerms(perms);
      setNotifCount(nc?.unread || 0);
      setBudgets(bud);
      setQaOverview(qa);
      setCsuiteData(cs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }
    loadData();
    const interval = setInterval(loadData, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, [isAdmin, navigate, loadData]);

  if (!isAdmin) return null;

  if (loading && !overview) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-[var(--text-tertiary)]">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[var(--error)] mb-2">Failed to load dashboard</div>
          <div className="text-xs text-[var(--text-tertiary)] mb-4">{error}</div>
          <button onClick={loadData} className="px-4 py-2 bg-[var(--accent-primary)] text-white rounded-lg text-sm">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const pendingCount = pendingPerms?.length || 0;
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'notifications', label: notifCount > 0 ? `Notifications (${notifCount})` : 'Notifications' },
    { id: 'hierarchy', label: 'Hierarchy' },
    { id: 'approvals', label: pendingCount > 0 ? `Approvals (${pendingCount})` : 'Approvals' },
    { id: 'budgets', label: 'Budgets' },
    { id: 'qa', label: 'QA Testing' },
    { id: 'models', label: 'Models' },
    { id: 'requests', label: 'Requests' },
    { id: 'routing', label: 'Routing' },
    { id: 'quality', label: 'Quality' },
    { id: 'agents', label: 'Agents' },
    { id: 'memory', label: 'Memory' },
    { id: 'reports', label: 'Reports' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Top bar */}
      <div className="border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]/60 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
              Herma Command Center
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20">
              CEO
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={async () => {
                  if (!showNotifDropdown && !notifDropdownData) {
                    try {
                      const data = await getNotifications({ is_read: false, limit: 5 });
                      setNotifDropdownData(data?.notifications || []);
                    } catch { setNotifDropdownData([]); }
                  }
                  setShowNotifDropdown((v) => !v);
                }}
                className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors relative"
                title="Notifications"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {notifCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 text-[10px] font-bold bg-red-500 text-white rounded-full flex items-center justify-center">
                    {notifCount > 99 ? '99+' : notifCount}
                  </span>
                )}
              </button>
              {showNotifDropdown && (
                <div className="absolute right-0 top-8 w-80 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl shadow-xl z-30 overflow-hidden">
                  <div className="px-4 py-2 border-b border-[var(--border-secondary)] flex items-center justify-between">
                    <span className="text-xs font-medium text-[var(--text-primary)]">Notifications</span>
                    <button onClick={() => { setShowNotifDropdown(false); setTab('notifications'); }} className="text-[10px] text-[var(--accent-primary)] hover:underline">
                      View all
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-[var(--border-secondary)]/50">
                    {notifDropdownData && notifDropdownData.length > 0 ? notifDropdownData.map((n) => (
                      <div key={n.id} className="px-4 py-3 hover:bg-[var(--bg-tertiary)]/30">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${n.severity === 'critical' ? 'bg-red-400' : n.severity === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'}`} />
                          <span className="text-xs font-medium text-[var(--text-primary)] truncate">{n.title}</span>
                        </div>
                        <p className="text-[10px] text-[var(--text-tertiary)] line-clamp-2">{n.message}</p>
                        <span className="text-[10px] text-[var(--text-tertiary)]">{timeAgo(n.created_at)}</span>
                      </div>
                    )) : (
                      <div className="px-4 py-6 text-center text-xs text-[var(--text-tertiary)]">No unread notifications</div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={loadData}
              className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
              title="Refresh data"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button onClick={() => navigate('/chat')} className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
              Chat
            </button>
            <button onClick={() => navigate('/dashboard')} className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
              Dashboard
            </button>
            <button onClick={logout} className="text-xs text-[var(--text-tertiary)] hover:text-[var(--error)]">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
          <StatCard label="Today Revenue" value={fmtUsd(overview?.today_revenue)} sub={`${overview?.today_requests || 0} requests`} accent />
          <StatCard label="Today Profit" value={fmtUsd(overview?.today_profit)} />
          <StatCard label="Margin" value={fmtPct(overview?.margin_pct)} sub="all-time" />
          <StatCard label="Today Cost" value={fmtUsd(overview?.today_cost)} sub="OpenRouter" />
          <StatCard label="Active Users" value={overview?.active_customers || 0} sub="last 30 days" />
          <StatCard label="Total Requests" value={(overview?.total_requests || 0).toLocaleString()} sub={`${overview?.requests_30d || 0} in 30d`} />
        </div>

        {/* Mini charts row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl p-4">
            <div className="text-xs text-[var(--text-tertiary)] mb-2">Daily Revenue (30d)</div>
            <MiniBar data={daily} valueKey="total_cost" height={48} />
          </div>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl p-4">
            <div className="text-xs text-[var(--text-tertiary)] mb-2">Hourly Requests (24h)</div>
            <MiniBar data={hourly} valueKey="request_count" height={48} />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 border-b border-[var(--border-secondary)]">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-sm transition-colors border-b-2 -mb-px ${
                tab === t.id
                  ? 'border-[var(--accent-primary)] text-[var(--text-primary)]'
                  : 'border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'overview' && <OverviewTab overview={overview} daily={daily} notifCount={notifCount} pendingCount={pendingCount} />}
        {tab === 'notifications' && <NotificationsTab onRefresh={loadData} />}
        {tab === 'hierarchy' && <HierarchyTab hierarchy={hierarchy} />}
        {tab === 'approvals' && <ApprovalsTab pending={pendingPerms} onRefresh={loadData} />}
        {tab === 'budgets' && <BudgetsTab budgets={budgets} onRefresh={loadData} />}
        {tab === 'qa' && <QaTestingTab qaOverview={qaOverview} onRefresh={loadData} />}
        {tab === 'models' && <ModelsTab models={models} />}
        {tab === 'requests' && <RequestsTab recent={recent} />}
        {tab === 'routing' && <RoutingTab routing={routing} />}
        {tab === 'quality' && <QualityTab quality={quality} />}
        {tab === 'agents' && <AgentsTab agents={agents} trustScores={trustScores} />}
        {tab === 'memory' && <MemoryTab memory={memory} />}
        {tab === 'reports' && <ReportsTab />}
      </div>
    </div>
  );
}

function OverviewTab({ overview, daily, notifCount = 0, pendingCount = 0 }) {
  return (
    <div className="space-y-4">
      {/* Action items row */}
      {(notifCount > 0 || pendingCount > 0) && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {notifCount > 0 && (
            <StatCard label="Unread Notifications" value={notifCount} accent />
          )}
          {pendingCount > 0 && (
            <StatCard label="Pending Approvals" value={pendingCount} accent />
          )}
        </div>
      )}

      {/* Financial summary */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl p-5">
        <h3 className="text-sm font-medium text-[var(--text-primary)] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Financial Summary (All Time)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div>
            <div className="text-[var(--text-tertiary)] text-xs">Revenue (Credits Sold)</div>
            <div className="text-[var(--text-primary)] font-medium">{fmtUsd(overview?.total_revenue)}</div>
          </div>
          <div>
            <div className="text-[var(--text-tertiary)] text-xs">Usage Billed</div>
            <div className="text-[var(--text-primary)] font-medium">{fmtUsd(overview?.total_usage_cost)}</div>
          </div>
          <div>
            <div className="text-[var(--text-tertiary)] text-xs">OpenRouter Cost</div>
            <div className="text-[var(--text-primary)] font-medium">{fmtUsd(overview?.total_openrouter_cost)}</div>
          </div>
          <div>
            <div className="text-[var(--text-tertiary)] text-xs">Gross Profit</div>
            <div className="text-green-400 font-medium">{fmtUsd(overview?.total_profit)}</div>
          </div>
          <div>
            <div className="text-[var(--text-tertiary)] text-xs">Gross Margin</div>
            <div className="text-[var(--accent-primary)] font-medium">{fmtPct(overview?.margin_pct)}</div>
          </div>
        </div>
      </div>

      {/* Daily table */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[var(--border-secondary)]">
          <h3 className="text-sm font-medium text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
            Daily Breakdown (Last 30 Days)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--text-tertiary)] text-xs border-b border-[var(--border-secondary)]">
                <th className="text-left px-5 py-2">Date</th>
                <th className="text-right px-3 py-2">Requests</th>
                <th className="text-right px-3 py-2">Users</th>
                <th className="text-right px-3 py-2">Revenue</th>
                <th className="text-right px-3 py-2">Cost</th>
                <th className="text-right px-3 py-2">Profit</th>
                <th className="text-right px-5 py-2">Margin</th>
              </tr>
            </thead>
            <tbody>
              {[...daily].reverse().map((d) => (
                <tr key={d.date} className="border-b border-[var(--border-secondary)]/50 hover:bg-[var(--bg-tertiary)]/30">
                  <td className="px-5 py-2 text-[var(--text-secondary)]">{d.date}</td>
                  <td className="text-right px-3 py-2 text-[var(--text-primary)]">{d.request_count}</td>
                  <td className="text-right px-3 py-2 text-[var(--text-secondary)]">{d.unique_customers}</td>
                  <td className="text-right px-3 py-2 text-[var(--text-primary)]">{fmtUsd(d.total_cost)}</td>
                  <td className="text-right px-3 py-2 text-[var(--text-secondary)]">{fmtUsd(d.openrouter_cost)}</td>
                  <td className="text-right px-3 py-2 text-green-400">{fmtUsd(d.profit)}</td>
                  <td className="text-right px-5 py-2">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${Number(d.margin_pct) >= 30 ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
                      {fmtPct(d.margin_pct)}
                    </span>
                  </td>
                </tr>
              ))}
              {daily.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-[var(--text-tertiary)]">No data yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ModelsTab({ models }) {
  const sorted = [...models].sort((a, b) => b.request_count - a.request_count);
  const totalRequests = sorted.reduce((s, m) => s + m.request_count, 0) || 1;

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-[var(--border-secondary)]">
        <h3 className="text-sm font-medium text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
          Model Performance
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[var(--text-tertiary)] text-xs border-b border-[var(--border-secondary)]">
              <th className="text-left px-5 py-2">Model</th>
              <th className="text-right px-3 py-2">Requests</th>
              <th className="text-right px-3 py-2">Share</th>
              <th className="text-right px-3 py-2">Tokens</th>
              <th className="text-right px-3 py-2">Revenue</th>
              <th className="text-right px-3 py-2">Cost</th>
              <th className="text-right px-3 py-2">Profit</th>
              <th className="text-right px-5 py-2">Margin</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((m) => {
              const margin = Number(m.total_cost) > 0 ? (Number(m.profit) / Number(m.total_cost)) * 100 : 0;
              return (
                <tr key={m.model} className="border-b border-[var(--border-secondary)]/50 hover:bg-[var(--bg-tertiary)]/30">
                  <td className="px-5 py-2">
                    <span className="text-[var(--text-primary)] font-mono text-xs bg-[var(--bg-tertiary)] px-2 py-0.5 rounded">
                      {m.model || 'unknown'}
                    </span>
                  </td>
                  <td className="text-right px-3 py-2 text-[var(--text-primary)]">{m.request_count.toLocaleString()}</td>
                  <td className="text-right px-3 py-2 text-[var(--text-secondary)]">
                    {((m.request_count / totalRequests) * 100).toFixed(1)}%
                  </td>
                  <td className="text-right px-3 py-2 text-[var(--text-secondary)]">{Number(m.total_tokens).toLocaleString()}</td>
                  <td className="text-right px-3 py-2 text-[var(--text-primary)]">{fmtUsd(m.total_cost)}</td>
                  <td className="text-right px-3 py-2 text-[var(--text-secondary)]">{fmtUsd(m.openrouter_cost)}</td>
                  <td className="text-right px-3 py-2 text-green-400">{fmtUsd(m.profit)}</td>
                  <td className="text-right px-5 py-2">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${margin >= 30 ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
                      {margin.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              );
            })}
            {models.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-8 text-center text-[var(--text-tertiary)]">No model data yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RequestsTab({ recent }) {
  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-[var(--border-secondary)]">
        <h3 className="text-sm font-medium text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
          Recent Requests
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[var(--text-tertiary)] text-xs border-b border-[var(--border-secondary)]">
              <th className="text-left px-5 py-2">Time</th>
              <th className="text-left px-3 py-2">User</th>
              <th className="text-left px-3 py-2">Model</th>
              <th className="text-right px-3 py-2">Tokens</th>
              <th className="text-right px-3 py-2">Revenue</th>
              <th className="text-right px-3 py-2">Cost</th>
              <th className="text-right px-3 py-2">Profit</th>
              <th className="text-right px-3 py-2">Latency</th>
              <th className="text-center px-5 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((r, i) => (
              <tr key={i} className="border-b border-[var(--border-secondary)]/50 hover:bg-[var(--bg-tertiary)]/30">
                <td className="px-5 py-2 text-[var(--text-secondary)] text-xs">{timeAgo(r.created_at)}</td>
                <td className="px-3 py-2 text-[var(--text-secondary)] text-xs truncate max-w-[120px]">{r.customer_email}</td>
                <td className="px-3 py-2">
                  <span className="font-mono text-xs text-[var(--text-primary)] bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded truncate max-w-[140px] inline-block">
                    {r.model_used || '—'}
                  </span>
                </td>
                <td className="text-right px-3 py-2 text-[var(--text-secondary)] text-xs">
                  {(r.prompt_tokens + r.completion_tokens).toLocaleString()}
                </td>
                <td className="text-right px-3 py-2 text-[var(--text-primary)] text-xs">{fmtUsd(r.herma_total_cost)}</td>
                <td className="text-right px-3 py-2 text-[var(--text-secondary)] text-xs">{fmtUsd(r.openrouter_cost)}</td>
                <td className="text-right px-3 py-2 text-green-400 text-xs">{fmtUsd(r.profit)}</td>
                <td className="text-right px-3 py-2 text-[var(--text-secondary)] text-xs">
                  {r.latency_ms ? `${(r.latency_ms / 1000).toFixed(1)}s` : '—'}
                </td>
                <td className="text-center px-5 py-2">
                  <span className={`inline-block w-2 h-2 rounded-full ${r.status_code === 200 ? 'bg-green-400' : 'bg-red-400'}`} />
                </td>
              </tr>
            ))}
            {recent.length === 0 && (
              <tr>
                <td colSpan={9} className="px-5 py-8 text-center text-[var(--text-tertiary)]">No requests yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AgentsTab({ agents, trustScores }) {
  if (!agents?.agents) {
    return <div className="text-[var(--text-tertiary)] text-center py-8">Agent data not available.</div>;
  }

  const tierLabels = { 1: 'Tier 1 — Full Autonomy', 2: 'Tier 2 — Autonomous + Reporting', 3: 'Tier 3 — Guardrailed', 4: 'Tier 4 — Human Approval' };
  const tierColors = { 1: 'text-green-400', 2: 'text-blue-400', 3: 'text-yellow-400', 4: 'text-red-400' };
  const circuitColors = { closed: 'bg-green-400', open: 'bg-red-400', half_open: 'bg-yellow-400' };

  const trustMap = {};
  (trustScores || []).forEach((t) => { trustMap[t.agent_name] = t; });

  return (
    <div className="space-y-3">
      {agents.agents.map((agent) => {
        const trust = trustMap[agent.name];
        return (
          <div key={agent.name} className="bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl p-5 hover:border-[var(--border-accent)] transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
                    {agent.role}
                  </h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] font-mono">
                    {agent.name}
                  </span>
                  {agent.domain && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                      {agent.domain}
                    </span>
                  )}
                  {trust?.promotion_eligible && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                      Promotion Eligible
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">{agent.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-block w-2.5 h-2.5 rounded-full ${circuitColors[agent.circuit_state] || 'bg-gray-400'}`}
                  title={`Circuit: ${agent.circuit_state}`} />
                <span className="text-[10px] text-[var(--text-tertiary)]">{agent.circuit_state}</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div>
                <span className="text-[var(--text-tertiary)]">Autonomy: </span>
                <span className={tierColors[agent.autonomy_tier] || 'text-[var(--text-secondary)]'}>
                  {tierLabels[agent.autonomy_tier] || `Tier ${agent.autonomy_tier}`}
                </span>
              </div>
              {trust && (
                <>
                  <div>
                    <span className="text-[var(--text-tertiary)]">Trust: </span>
                    <span className={trust.trust_score >= 75 ? 'text-green-400' : trust.trust_score >= 50 ? 'text-yellow-400' : 'text-red-400'}>
                      {trust.trust_score.toFixed(1)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--text-tertiary)]">Actions: </span>
                    <span className="text-[var(--text-secondary)]">{trust.total_actions} ({trust.successful_actions} ok / {trust.failed_actions} fail)</span>
                  </div>
                  {trust.safety_violations > 0 && (
                    <div>
                      <span className="text-[var(--text-tertiary)]">Violations: </span>
                      <span className="text-red-400">{trust.safety_violations}</span>
                    </div>
                  )}
                </>
              )}
              {agent.recent_errors > 0 && (
                <div>
                  <span className="text-[var(--text-tertiary)]">Errors: </span>
                  <span className="text-red-400">{agent.recent_errors}</span>
                </div>
              )}
            </div>
            {agent.capabilities?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {agent.capabilities.map((cap) => (
                  <span key={cap} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]">
                    {cap}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function QualityTab({ quality }) {
  if (!quality) {
    return <div className="text-[var(--text-tertiary)] text-center py-8">Quality data not available yet. Scores are sampled from ~8% of requests.</div>;
  }

  function ScoreBadge({ value }) {
    if (value == null) return <span className="text-[var(--text-tertiary)]">—</span>;
    const v = Number(value);
    const color = v >= 4 ? 'text-green-400' : v >= 3 ? 'text-yellow-400' : 'text-red-400';
    return <span className={`font-medium ${color}`}>{v.toFixed(1)}</span>;
  }

  return (
    <div className="space-y-4">
      {/* Overview scores */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard label="Total Scores" value={(quality.total_scores || 0).toLocaleString()} sub={`${quality.scores_7d || 0} last 7d`} />
        <StatCard label="Overall" value={quality.avg_overall?.toFixed(2) || 'N/A'} sub="avg 1-5" accent />
        <StatCard label="Relevance" value={quality.avg_relevance?.toFixed(2) || 'N/A'} sub="avg 1-5" />
        <StatCard label="Accuracy" value={quality.avg_accuracy?.toFixed(2) || 'N/A'} sub="avg 1-5" />
        <StatCard label="Helpfulness" value={quality.avg_helpfulness?.toFixed(2) || 'N/A'} sub="avg 1-5" />
      </div>

      {/* By model */}
      {Object.keys(quality.by_model || {}).length > 0 && (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-[var(--border-secondary)]">
            <h3 className="text-sm font-medium text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
              Quality by Model
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[var(--text-tertiary)] text-xs border-b border-[var(--border-secondary)]">
                  <th className="text-left px-5 py-2">Model</th>
                  <th className="text-right px-3 py-2">Scores</th>
                  <th className="text-right px-3 py-2">Overall</th>
                  <th className="text-right px-3 py-2">Relevance</th>
                  <th className="text-right px-3 py-2">Accuracy</th>
                  <th className="text-right px-5 py-2">Helpfulness</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(quality.by_model).sort((a, b) => b[1].count - a[1].count).map(([model, stats]) => (
                  <tr key={model} className="border-b border-[var(--border-secondary)]/50 hover:bg-[var(--bg-tertiary)]/30">
                    <td className="px-5 py-2 font-mono text-xs text-[var(--text-primary)]">{model}</td>
                    <td className="text-right px-3 py-2 text-[var(--text-secondary)]">{stats.count}</td>
                    <td className="text-right px-3 py-2"><ScoreBadge value={stats.avg_overall} /></td>
                    <td className="text-right px-3 py-2"><ScoreBadge value={stats.avg_relevance} /></td>
                    <td className="text-right px-3 py-2"><ScoreBadge value={stats.avg_accuracy} /></td>
                    <td className="text-right px-5 py-2"><ScoreBadge value={stats.avg_helpfulness} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent scores */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[var(--border-secondary)]">
          <h3 className="text-sm font-medium text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
            Recent Scores
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--text-tertiary)] text-xs border-b border-[var(--border-secondary)]">
                <th className="text-left px-5 py-2">Time</th>
                <th className="text-left px-3 py-2">Model</th>
                <th className="text-left px-3 py-2">Category</th>
                <th className="text-right px-3 py-2">Overall</th>
                <th className="text-right px-3 py-2">Relevance</th>
                <th className="text-right px-3 py-2">Accuracy</th>
                <th className="text-right px-5 py-2">Helpfulness</th>
              </tr>
            </thead>
            <tbody>
              {(quality.recent_scores || []).map((s, i) => (
                <tr key={i} className="border-b border-[var(--border-secondary)]/50 hover:bg-[var(--bg-tertiary)]/30">
                  <td className="px-5 py-2 text-xs text-[var(--text-secondary)]">{timeAgo(s.created_at)}</td>
                  <td className="px-3 py-2 font-mono text-xs text-[var(--text-primary)]">{s.model || '—'}</td>
                  <td className="px-3 py-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                      {s.category || '—'}
                    </span>
                  </td>
                  <td className="text-right px-3 py-2"><ScoreBadge value={s.overall} /></td>
                  <td className="text-right px-3 py-2"><ScoreBadge value={s.relevance} /></td>
                  <td className="text-right px-3 py-2"><ScoreBadge value={s.accuracy} /></td>
                  <td className="text-right px-5 py-2"><ScoreBadge value={s.helpfulness} /></td>
                </tr>
              ))}
              {(quality.recent_scores || []).length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-[var(--text-tertiary)]">No scores yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function RoutingTab({ routing }) {
  if (!routing) {
    return <div className="text-[var(--text-tertiary)] text-center py-8">Routing data not available yet. Send some chat messages first.</div>;
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Decisions" value={(routing.total_decisions || 0).toLocaleString()} />
        <StatCard label="Last 7 Days" value={(routing.decisions_7d || 0).toLocaleString()} />
        <StatCard
          label="Accuracy"
          value={routing.recommendation_accuracy != null ? fmtPct(routing.recommendation_accuracy * 100) : 'N/A'}
          sub="vs OpenRouter auto"
        />
        <StatCard label="Mode" value="Shadow" sub="Tier 4 — logging only" />
      </div>

      {/* Category breakdown */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl p-5">
        <h3 className="text-sm font-medium text-[var(--text-primary)] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Query Categories
        </h3>
        <div className="flex flex-wrap gap-3">
          {Object.entries(routing.by_category || {}).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
            <div key={cat} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-secondary)]">
              <span className="text-xs text-[var(--text-tertiary)]">{cat}</span>
              <span className="text-sm font-medium text-[var(--text-primary)]">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Model recommendations */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl p-5">
        <h3 className="text-sm font-medium text-[var(--text-primary)] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Recommended Models
        </h3>
        <div className="space-y-2">
          {Object.entries(routing.by_recommended_model || {}).sort((a, b) => b[1] - a[1]).map(([model, count]) => {
            const total = routing.total_decisions || 1;
            const pct = ((count / total) * 100).toFixed(1);
            return (
              <div key={model} className="flex items-center gap-3">
                <span className="font-mono text-xs text-[var(--text-primary)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded w-64 truncate">
                  {model}
                </span>
                <div className="flex-1 h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--accent-primary)] rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-[var(--text-tertiary)] w-16 text-right">{count} ({pct}%)</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent decisions */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[var(--border-secondary)]">
          <h3 className="text-sm font-medium text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
            Recent Routing Decisions
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--text-tertiary)] text-xs border-b border-[var(--border-secondary)]">
                <th className="text-left px-5 py-2">Time</th>
                <th className="text-left px-3 py-2">Category</th>
                <th className="text-left px-3 py-2">Recommended</th>
                <th className="text-left px-3 py-2">Actual</th>
                <th className="text-right px-3 py-2">Confidence</th>
                <th className="text-center px-5 py-2">Match</th>
              </tr>
            </thead>
            <tbody>
              {(routing.recent_decisions || []).map((d, i) => {
                const matched = d.actual && d.recommended === d.actual;
                return (
                  <tr key={i} className="border-b border-[var(--border-secondary)]/50 hover:bg-[var(--bg-tertiary)]/30">
                    <td className="px-5 py-2 text-[var(--text-secondary)] text-xs">{timeAgo(d.created_at)}</td>
                    <td className="px-3 py-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                        {d.category}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-[var(--text-primary)]">{d.recommended}</td>
                    <td className="px-3 py-2 font-mono text-xs text-[var(--text-secondary)]">{d.actual || '—'}</td>
                    <td className="text-right px-3 py-2 text-xs text-[var(--text-secondary)]">
                      {d.confidence != null ? `${(d.confidence * 100).toFixed(0)}%` : '—'}
                    </td>
                    <td className="text-center px-5 py-2">
                      {d.actual ? (
                        <span className={`inline-block w-2 h-2 rounded-full ${matched ? 'bg-green-400' : 'bg-yellow-400'}`} />
                      ) : (
                        <span className="text-xs text-[var(--text-tertiary)]">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MemoryTab({ memory }) {
  if (!memory) return null;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Memories" value={memory.total_memories.toLocaleString()} />
        <StatCard label="Users with Memories" value={memory.customers_with_memories} />
        <StatCard
          label="Avg per User"
          value={memory.customers_with_memories > 0 ? Math.round(memory.total_memories / memory.customers_with_memories) : 0}
        />
        <StatCard label="Categories" value={Object.keys(memory.by_category).length} />
      </div>

      {/* Category breakdown */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl p-5">
        <h3 className="text-sm font-medium text-[var(--text-primary)] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          By Category
        </h3>
        <div className="flex flex-wrap gap-3">
          {Object.entries(memory.by_category).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
            <div key={cat} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-secondary)]">
              <span className="text-xs text-[var(--text-tertiary)]">{cat}</span>
              <span className="text-sm font-medium text-[var(--text-primary)]">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent memories */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[var(--border-secondary)]">
          <h3 className="text-sm font-medium text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
            Recent Memories
          </h3>
        </div>
        <div className="divide-y divide-[var(--border-secondary)]/50">
          {memory.recent_memories.map((m, i) => (
            <div key={i} className="px-5 py-3 hover:bg-[var(--bg-tertiary)]/30">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                  {m.category}
                </span>
                <span className="text-xs text-[var(--text-tertiary)]">{m.customer_email}</span>
                <span className="text-xs text-[var(--text-tertiary)]">{timeAgo(m.created_at)}</span>
              </div>
              <div className="text-sm text-[var(--text-primary)]">{m.content}</div>
            </div>
          ))}
          {memory.recent_memories.length === 0 && (
            <div className="px-5 py-8 text-center text-[var(--text-tertiary)]">No memories yet</div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReportsTab() {
  const [reports, setReports] = useState(null);
  const [scheduler, setScheduler] = useState(null);
  const [agentFilter, setAgentFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [generating, setGenerating] = useState(false);
  const [expanded, setExpanded] = useState({});

  const loadReports = useCallback(async () => {
    try {
      const [rpt, sched] = await Promise.all([
        getAdminReports({ agent: agentFilter || undefined, severity: severityFilter || undefined }),
        getSchedulerStatus().catch(() => null),
      ]);
      setReports(rpt);
      setScheduler(sched);
    } catch {
      // handled by parent
    }
  }, [agentFilter, severityFilter]);

  useEffect(() => { loadReports(); }, [loadReports]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await generateReportsNow();
      await loadReports();
    } finally {
      setGenerating(false);
    }
  };

  const toggleExpand = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const severityStyles = {
    critical: 'bg-red-500/10 text-red-400 border-red-500/20',
    warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };

  const agentIcons = {
    cso: 'S',
    cqo: 'Q',
    cto: 'T',
    cfo: 'F',
    qa_tester: 'QA',
    finance: '$',
    quality: 'Q',
    routing: 'R',
    optimizer: 'O',
    memory: 'M',
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={agentFilter}
          onChange={(e) => setAgentFilter(e.target.value)}
          className="text-sm bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-lg px-3 py-1.5 text-[var(--text-primary)]"
        >
          <option value="">All agents</option>
          <option value="cso">CSO</option>
          <option value="cqo">CQO</option>
          <option value="cto">CTO</option>
          <option value="cfo">CFO</option>
          <option value="qa_tester">QA Tester</option>
          <option value="finance">Finance</option>
          <option value="quality">Quality</option>
          <option value="routing">Routing</option>
          <option value="optimizer">Optimizer</option>
          <option value="memory">Memory</option>
        </select>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="text-sm bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-lg px-3 py-1.5 text-[var(--text-primary)]"
        >
          <option value="">All severities</option>
          <option value="critical">Critical</option>
          <option value="warning">Warning</option>
          <option value="info">Info</option>
        </select>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="ml-auto px-4 py-1.5 text-sm bg-[var(--accent-primary)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {generating ? 'Generating...' : 'Generate Now'}
        </button>
      </div>

      {/* Scheduler status */}
      {scheduler && (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-block w-2 h-2 rounded-full ${scheduler.running ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className="text-sm text-[var(--text-primary)]">
              Scheduler {scheduler.running ? 'running' : 'stopped'}
            </span>
          </div>
          {scheduler.jobs?.length > 0 && (
            <div className="space-y-1">
              {scheduler.jobs.map((job) => (
                <div key={job.id} className="flex items-center gap-3 text-xs text-[var(--text-tertiary)]">
                  <span className="font-mono bg-[var(--bg-tertiary)] px-2 py-0.5 rounded">{job.id}</span>
                  <span>{job.name}</span>
                  {job.next_run && (
                    <span className="ml-auto">Next: {new Date(job.next_run).toLocaleString()}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reports list */}
      {reports && reports.reports?.length > 0 ? (
        <div className="space-y-3">
          {reports.reports.map((r) => (
            <div
              key={r.id}
              className="bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl overflow-hidden hover:border-[var(--border-accent)] transition-colors"
            >
              <div className="px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-sm font-bold text-[var(--accent-primary)] shrink-0">
                    {agentIcons[r.agent_name] || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${severityStyles[r.severity] || severityStyles.info}`}>
                        {r.severity.toUpperCase()}
                      </span>
                      <h4 className="text-sm font-medium text-[var(--text-primary)]">{r.title}</h4>
                      {r.actionable && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                          Actionable
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[var(--text-tertiary)] mb-2">
                      {r.agent_name} | {new Date(r.period_start).toLocaleDateString()} — {new Date(r.period_end).toLocaleDateString()} | {timeAgo(r.created_at)}
                    </div>
                    <div className="text-sm text-[var(--text-secondary)] whitespace-pre-line">{r.summary}</div>
                  </div>
                </div>
              </div>
              {r.details && (
                <div className="border-t border-[var(--border-secondary)]">
                  <button
                    onClick={() => toggleExpand(r.id)}
                    className="w-full px-5 py-2 text-xs text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors text-left"
                  >
                    {expanded[r.id] ? 'Hide raw data' : 'Show raw data'}
                  </button>
                  {expanded[r.id] && (
                    <pre className="px-5 pb-4 text-xs text-[var(--text-tertiary)] overflow-x-auto">
                      {JSON.stringify(r.details, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          ))}
          <div className="text-xs text-[var(--text-tertiary)] text-center py-2">
            Showing {reports.reports.length} of {reports.total} reports
          </div>
        </div>
      ) : reports ? (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl p-8 text-center">
          <div className="text-[var(--text-tertiary)] mb-2">No reports yet</div>
          <div className="text-xs text-[var(--text-tertiary)] max-w-md mx-auto">
            Agent reports are generated automatically — daily at 06:00 UTC (finance, quality, routing) and weekly on Mondays at 07:00 UTC (optimizer, memory). Click "Generate Now" to trigger all analyzers manually.
          </div>
        </div>
      ) : (
        <div className="text-[var(--text-tertiary)] text-center py-8">Loading reports...</div>
      )}
    </div>
  );
}

function HierarchyTab({ hierarchy }) {
  if (!hierarchy || hierarchy.length === 0) {
    return <div className="text-[var(--text-tertiary)] text-center py-8">Hierarchy data not available yet.</div>;
  }

  const tierLabels = { 1: 'Tier 1', 2: 'Tier 2', 3: 'Tier 3', 4: 'Tier 4' };
  const tierColors = { 1: 'text-green-400', 2: 'text-blue-400', 3: 'text-yellow-400', 4: 'text-red-400' };

  function TrustBadge({ score }) {
    if (score == null) return null;
    const color = score >= 75 ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                  score >= 50 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                  'bg-red-500/10 text-red-400 border-red-500/20';
    return (
      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${color}`}>
        Trust: {score.toFixed(1)}
      </span>
    );
  }

  function AgentNode({ node, depth = 0 }) {
    return (
      <div style={{ marginLeft: depth * 24 }}>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl p-4 mb-2 hover:border-[var(--border-accent)] transition-colors">
          <div className="flex items-center gap-2 flex-wrap">
            {node.is_executive && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Executive
              </span>
            )}
            {node.is_director && !node.is_executive && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Director
              </span>
            )}
            <h4 className="text-sm font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
              {node.role}
            </h4>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] font-mono">
              {node.agent_name}
            </span>
            <span className={`text-[10px] font-medium ${tierColors[node.autonomy_tier] || 'text-[var(--text-tertiary)]'}`}>
              {tierLabels[node.autonomy_tier]}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
              {node.domain}
            </span>
            {node.trust && <TrustBadge score={node.trust.trust_score} />}
            {node.trust?.promotion_eligible && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                Promotion Eligible
              </span>
            )}
          </div>
          {node.description && (
            <p className="text-xs text-[var(--text-tertiary)] mt-1">{node.description}</p>
          )}
          {node.trust && (
            <div className="flex gap-4 mt-2 text-xs text-[var(--text-tertiary)]">
              <span>Actions: {node.trust.total_actions}</span>
              <span>Success: {node.trust.successful_actions}</span>
              <span>Failed: {node.trust.failed_actions}</span>
              {node.trust.safety_violations > 0 && <span className="text-red-400">Violations: {node.trust.safety_violations}</span>}
            </div>
          )}
          {node.capabilities?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {node.capabilities.map((cap) => (
                <span key={cap} className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]">
                  {cap}
                </span>
              ))}
            </div>
          )}
        </div>
        {node.children?.map((child) => (
          <AgentNode key={child.agent_name} node={child} depth={depth + 1} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="mb-4">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
              CEO (Niko)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20">
              Root
            </span>
          </div>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">Human root — executives report here. Approves promotions, budget allocation, spawns, and cross-domain requests.</p>
        </div>
      </div>
      {hierarchy.map((node) => (
        <AgentNode key={node.agent_name} node={node} depth={1} />
      ))}
    </div>
  );
}

function ApprovalsTab({ pending, onRefresh }) {
  const [decisions, setDecisions] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [notes, setNotes] = useState({});

  useEffect(() => {
    getDecisionLog({ limit: 20 }).then(setDecisions).catch(() => null);
  }, []);

  const handleAction = async (id, action) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    try {
      const fn = action === 'approve' ? approvePermission : denyPermission;
      await fn(id, notes[id] || '');
      onRefresh();
      getDecisionLog({ limit: 20 }).then(setDecisions).catch(() => null);
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const typeLabels = {
    capability: 'Capability',
    tier_promotion: 'Promotion',
    spawn_agent: 'Spawn Agent',
  };
  const statusColors = {
    pending: 'bg-yellow-500/10 text-yellow-400',
    approved: 'bg-green-500/10 text-green-400',
    denied: 'bg-red-500/10 text-red-400',
    escalated: 'bg-purple-500/10 text-purple-400',
  };

  return (
    <div className="space-y-6">
      {/* Pending requests */}
      <div>
        <h3 className="text-sm font-medium text-[var(--text-primary)] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Pending CEO Approvals
        </h3>
        {pending && pending.length > 0 ? (
          <div className="space-y-3">
            {pending.map((req) => (
              <div key={req.id} className="bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusColors[req.status] || 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]'}`}>
                        {typeLabels[req.request_type] || req.request_type}
                      </span>
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        {req.requesting_agent}
                      </span>
                      <span className="text-xs text-[var(--text-tertiary)]">
                        requests: {req.requested_capability}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)]">{req.justification}</p>
                    {req.reviewer_chain?.length > 0 && (
                      <div className="text-[10px] text-[var(--text-tertiary)] mt-1">
                        Review chain: {req.reviewer_chain.join(' → ')}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-[var(--text-tertiary)]">{timeAgo(req.created_at)}</span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <input
                    type="text"
                    placeholder="Notes (optional)"
                    value={notes[req.id] || ''}
                    onChange={(e) => setNotes((prev) => ({ ...prev, [req.id]: e.target.value }))}
                    className="flex-1 text-xs bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] rounded-lg px-3 py-1.5 text-[var(--text-primary)] placeholder-[var(--text-tertiary)]"
                  />
                  <button
                    onClick={() => handleAction(req.id, 'approve')}
                    disabled={actionLoading[req.id]}
                    className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-500 disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(req.id, 'deny')}
                    disabled={actionLoading[req.id]}
                    className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg hover:bg-red-500 disabled:opacity-50"
                  >
                    Deny
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl p-8 text-center">
            <div className="text-[var(--text-tertiary)]">No pending approvals</div>
            <div className="text-xs text-[var(--text-tertiary)] mt-1">Promotion requests and cross-domain capability requests will appear here.</div>
          </div>
        )}
      </div>

      {/* Decision log */}
      <div>
        <h3 className="text-sm font-medium text-[var(--text-primary)] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Decision Log
        </h3>
        {decisions?.entries?.length > 0 ? (
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[var(--text-tertiary)] text-xs border-b border-[var(--border-secondary)]">
                  <th className="text-left px-5 py-2">Time</th>
                  <th className="text-left px-3 py-2">Type</th>
                  <th className="text-left px-3 py-2">Actor</th>
                  <th className="text-left px-3 py-2">Subject</th>
                  <th className="text-left px-5 py-2">Details</th>
                </tr>
              </thead>
              <tbody>
                {decisions.entries.map((d) => (
                  <tr key={d.id} className="border-b border-[var(--border-secondary)]/50 hover:bg-[var(--bg-tertiary)]/30">
                    <td className="px-5 py-2 text-xs text-[var(--text-secondary)]">{timeAgo(d.created_at)}</td>
                    <td className="px-3 py-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]">
                        {d.decision_type}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs text-[var(--text-primary)] font-mono">{d.actor}</td>
                    <td className="px-3 py-2 text-xs text-[var(--text-primary)] font-mono">{d.subject}</td>
                    <td className="px-5 py-2 text-xs text-[var(--text-tertiary)] max-w-xs truncate">
                      {d.details ? JSON.stringify(d.details).slice(0, 80) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-[var(--text-tertiary)] text-center py-4 text-sm">No decisions logged yet.</div>
        )}
      </div>
    </div>
  );
}

function NotificationsTab({ onRefresh }) {
  const [notifications, setNotifications] = useState(null);
  const [sevFilter, setSevFilter] = useState('');
  const [readFilter, setReadFilter] = useState('unread');
  const [actionLoading, setActionLoading] = useState({});

  const loadNotifs = useCallback(async () => {
    try {
      const isRead = readFilter === 'all' ? undefined : readFilter === 'read' ? true : false;
      const data = await getNotifications({ is_read: isRead, severity: sevFilter || undefined, limit: 50 });
      setNotifications(data);
    } catch { setNotifications(null); }
  }, [sevFilter, readFilter]);

  useEffect(() => { loadNotifs(); }, [loadNotifs]);

  const handleMarkRead = async (id) => {
    setActionLoading((p) => ({ ...p, [id]: true }));
    try { await markNotificationRead(id); await loadNotifs(); onRefresh(); } finally { setActionLoading((p) => ({ ...p, [id]: false })); }
  };

  const handleMarkAllRead = async () => {
    try { await markAllNotificationsRead(); await loadNotifs(); onRefresh(); } catch {}
  };

  const handleAction = async (id) => {
    setActionLoading((p) => ({ ...p, [id]: true }));
    try { await actionNotification(id); await loadNotifs(); onRefresh(); } finally { setActionLoading((p) => ({ ...p, [id]: false })); }
  };

  const sevStyles = {
    critical: 'bg-red-500/10 text-red-400 border-red-500/20',
    warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <select value={sevFilter} onChange={(e) => setSevFilter(e.target.value)}
          className="text-sm bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-lg px-3 py-1.5 text-[var(--text-primary)]">
          <option value="">All severities</option>
          <option value="critical">Critical</option>
          <option value="warning">Warning</option>
          <option value="info">Info</option>
        </select>
        <select value={readFilter} onChange={(e) => setReadFilter(e.target.value)}
          className="text-sm bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-lg px-3 py-1.5 text-[var(--text-primary)]">
          <option value="unread">Unread</option>
          <option value="read">Read</option>
          <option value="all">All</option>
        </select>
        <button onClick={handleMarkAllRead}
          className="ml-auto px-4 py-1.5 text-sm bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] text-[var(--text-secondary)] rounded-lg hover:text-[var(--text-primary)] transition-colors">
          Mark all read
        </button>
      </div>

      {notifications?.notifications?.length > 0 ? (
        <div className="space-y-3">
          {notifications.notifications.map((n) => (
            <div key={n.id} className={`bg-[var(--bg-secondary)] border rounded-xl p-5 transition-colors ${n.is_read ? 'border-[var(--border-secondary)] opacity-70' : 'border-[var(--border-accent)]'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${sevStyles[n.severity] || sevStyles.info}`}>
                      {n.severity.toUpperCase()}
                    </span>
                    <span className="text-sm font-medium text-[var(--text-primary)]">{n.title}</span>
                    {n.source_agent && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] font-mono">
                        {n.source_agent}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mb-1">{n.message}</p>
                  {n.proposed_action && (
                    <p className="text-xs text-[var(--accent-primary)] italic">Suggested: {n.proposed_action}</p>
                  )}
                </div>
                <span className="text-[10px] text-[var(--text-tertiary)] whitespace-nowrap">{timeAgo(n.created_at)}</span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                {!n.is_read && (
                  <button onClick={() => handleMarkRead(n.id)} disabled={actionLoading[n.id]}
                    className="px-3 py-1 text-xs bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] text-[var(--text-secondary)] rounded-lg hover:text-[var(--text-primary)] disabled:opacity-50">
                    Mark read
                  </button>
                )}
                {n.action_type && !n.is_actioned && (
                  <button onClick={() => handleAction(n.id)} disabled={actionLoading[n.id]}
                    className="px-3 py-1 text-xs bg-[var(--accent-primary)] text-white rounded-lg hover:opacity-90 disabled:opacity-50">
                    {n.action_type.replace(/_/g, ' ')}
                  </button>
                )}
                {n.is_actioned && (
                  <span className="text-[10px] text-green-400">Actioned</span>
                )}
              </div>
            </div>
          ))}
          {notifications.total > notifications.notifications.length && (
            <div className="text-xs text-[var(--text-tertiary)] text-center py-2">
              Showing {notifications.notifications.length} of {notifications.total}
            </div>
          )}
        </div>
      ) : notifications ? (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl p-8 text-center">
          <div className="text-[var(--text-tertiary)]">No notifications</div>
          <div className="text-xs text-[var(--text-tertiary)] mt-1">Events from agents, QA tests, budgets, and permissions will appear here.</div>
        </div>
      ) : (
        <div className="text-[var(--text-tertiary)] text-center py-8">Loading notifications...</div>
      )}
    </div>
  );
}

function BudgetsTab({ budgets, onRefresh }) {
  const [showForm, setShowForm] = useState(false);
  const [formAgent, setFormAgent] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formPeriod, setFormPeriod] = useState('monthly');
  const [saving, setSaving] = useState(false);
  const [editAgent, setEditAgent] = useState(null);
  const [editAmount, setEditAmount] = useState('');

  const handleAllocate = async () => {
    if (!formAgent || !formAmount) return;
    setSaving(true);
    try {
      await allocateBudget(formAgent, parseFloat(formAmount), formPeriod);
      setShowForm(false);
      setFormAgent('');
      setFormAmount('');
      onRefresh();
    } finally { setSaving(false); }
  };

  const handleUpdate = async (agentName, updates) => {
    try {
      await updateBudget(agentName, updates);
      setEditAgent(null);
      onRefresh();
    } catch {}
  };

  const budgetList = budgets || [];
  const totalAllocated = budgetList.reduce((s, b) => s + Number(b.allocated_usd || 0), 0);
  const totalSpent = budgetList.reduce((s, b) => s + Number(b.spent_usd || 0), 0);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard label="Total Allocated" value={fmtUsd(totalAllocated)} accent />
        <StatCard label="Total Spent" value={fmtUsd(totalSpent)} />
        <StatCard label="Remaining" value={fmtUsd(totalAllocated - totalSpent)} />
      </div>

      {/* Allocate button */}
      <div className="flex items-center gap-3">
        <button onClick={() => setShowForm((v) => !v)}
          className="px-4 py-1.5 text-sm bg-[var(--accent-primary)] text-white rounded-lg hover:opacity-90">
          {showForm ? 'Cancel' : 'Allocate Budget'}
        </button>
      </div>

      {/* Allocate form */}
      {showForm && (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl p-5">
          <h4 className="text-sm font-medium text-[var(--text-primary)] mb-3">Allocate Budget</h4>
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="text-xs text-[var(--text-tertiary)] block mb-1">Agent</label>
              <input type="text" value={formAgent} onChange={(e) => setFormAgent(e.target.value)}
                placeholder="e.g. qa_tester" className="text-sm bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] rounded-lg px-3 py-1.5 text-[var(--text-primary)] w-40" />
            </div>
            <div>
              <label className="text-xs text-[var(--text-tertiary)] block mb-1">Amount (USD)</label>
              <input type="number" value={formAmount} onChange={(e) => setFormAmount(e.target.value)}
                placeholder="250" className="text-sm bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] rounded-lg px-3 py-1.5 text-[var(--text-primary)] w-32" />
            </div>
            <div>
              <label className="text-xs text-[var(--text-tertiary)] block mb-1">Period</label>
              <select value={formPeriod} onChange={(e) => setFormPeriod(e.target.value)}
                className="text-sm bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] rounded-lg px-3 py-1.5 text-[var(--text-primary)]">
                <option value="monthly">Monthly</option>
                <option value="one_time">One-time</option>
              </select>
            </div>
            <button onClick={handleAllocate} disabled={saving || !formAgent || !formAmount}
              className="px-4 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-500 disabled:opacity-50">
              {saving ? 'Saving...' : 'Allocate'}
            </button>
          </div>
        </div>
      )}

      {/* Budget cards */}
      {budgetList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {budgetList.map((b) => {
            const allocated = Number(b.allocated_usd || 0);
            const spent = Number(b.spent_usd || 0);
            const remaining = allocated - spent;
            const pct = allocated > 0 ? Math.min(100, (spent / allocated) * 100) : 0;
            const barColor = pct >= 90 ? 'bg-red-400' : pct >= 70 ? 'bg-yellow-400' : 'bg-green-400';
            return (
              <div key={b.agent_name} className="bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl p-5 hover:border-[var(--border-accent)] transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
                      {b.agent_name}
                    </h4>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]">
                      {b.period_type}
                    </span>
                    {b.is_paused && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                        PAUSED
                      </span>
                    )}
                  </div>
                  <button onClick={() => { setEditAgent(editAgent === b.agent_name ? null : b.agent_name); setEditAmount(String(allocated)); }}
                    className="text-[10px] text-[var(--accent-primary)] hover:underline">
                    {editAgent === b.agent_name ? 'Cancel' : 'Edit'}
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                  <div>
                    <div className="text-[var(--text-tertiary)]">Allocated</div>
                    <div className="text-[var(--text-primary)] font-medium">{fmtUsd(allocated)}</div>
                  </div>
                  <div>
                    <div className="text-[var(--text-tertiary)]">Spent</div>
                    <div className="text-[var(--text-primary)] font-medium">{fmtUsd(spent)}</div>
                  </div>
                  <div>
                    <div className="text-[var(--text-tertiary)]">Remaining</div>
                    <div className={`font-medium ${remaining > 0 ? 'text-green-400' : 'text-red-400'}`}>{fmtUsd(remaining)}</div>
                  </div>
                </div>
                <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
                </div>
                <div className="text-[10px] text-[var(--text-tertiary)] mt-1">{pct.toFixed(1)}% used</div>

                {editAgent === b.agent_name && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--border-secondary)]">
                    <input type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)}
                      className="text-sm bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] rounded-lg px-3 py-1.5 text-[var(--text-primary)] w-32" />
                    <button onClick={() => handleUpdate(b.agent_name, { amount_usd: parseFloat(editAmount) })}
                      className="px-3 py-1 text-xs bg-green-600 text-white rounded-lg hover:bg-green-500">Save</button>
                    {b.is_paused && (
                      <button onClick={() => handleUpdate(b.agent_name, { is_paused: false })}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-500">Resume</button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl p-8 text-center">
          <div className="text-[var(--text-tertiary)]">No budgets allocated</div>
          <div className="text-xs text-[var(--text-tertiary)] mt-1">Allocate budgets to agents to control their autonomous spending.</div>
        </div>
      )}
    </div>
  );
}

function QaTestingTab({ qaOverview, onRefresh }) {
  const [runs, setRuns] = useState(null);
  const [triggering, setTriggering] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [scenarios, setScenarios] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [scenarioExpanded, setScenarioExpanded] = useState({});

  useEffect(() => {
    getQaRuns({ limit: 30 }).then(setRuns).catch(() => null);
    getQaScenarios().then(setScenarios).catch(() => null);
  }, []);

  const handleTrigger = async () => {
    setTriggering(true);
    try {
      await triggerQaRun();
      setTimeout(async () => {
        onRefresh();
        const data = await getQaRuns({ limit: 30 }).catch(() => null);
        setRuns(data);
        setTriggering(false);
      }, 2000);
    } catch { setTriggering(false); }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await generateQaScenarios();
      setTimeout(async () => {
        onRefresh();
        const data = await getQaScenarios().catch(() => null);
        setScenarios(data);
        setGenerating(false);
      }, 3000);
    } catch { setGenerating(false); }
  };

  const handleActivate = async (id) => {
    try {
      await activateQaScenario(id);
      const data = await getQaScenarios().catch(() => null);
      setScenarios(data);
      onRefresh();
    } catch { /* ignore */ }
  };

  const handleRetire = async (id) => {
    try {
      await retireQaScenario(id, 'Manually retired from dashboard');
      const data = await getQaScenarios().catch(() => null);
      setScenarios(data);
      onRefresh();
    } catch { /* ignore */ }
  };

  const statusStyles = {
    passed: 'bg-green-500/10 text-green-400',
    failed: 'bg-red-500/10 text-red-400',
    error: 'bg-yellow-500/10 text-yellow-400',
  };

  const scenarioStatusStyles = {
    draft: 'bg-yellow-500/10 text-yellow-400',
    active: 'bg-green-500/10 text-green-400',
    retired: 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]',
  };

  const categoryStyles = {
    edge_case: 'bg-purple-500/10 text-purple-400',
    regression: 'bg-red-500/10 text-red-400',
    stress: 'bg-orange-500/10 text-orange-400',
    safety: 'bg-blue-500/10 text-blue-400',
    capability: 'bg-cyan-500/10 text-cyan-400',
  };

  const activeScenarios = scenarios?.filter(s => s.status === 'active') || [];
  const draftScenarios = scenarios?.filter(s => s.status === 'draft') || [];
  const retiredScenarios = scenarios?.filter(s => s.status === 'retired') || [];

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Pass Rate" value={qaOverview?.pass_rate != null ? fmtPct(qaOverview.pass_rate) : 'N/A'} accent />
        <StatCard label="Total Runs" value={qaOverview?.total_runs || 0} sub={`${qaOverview?.passed || 0} passed / ${qaOverview?.failed || 0} failed`} />
        <StatCard label="Avg Latency" value={qaOverview?.avg_latency_ms ? `${qaOverview.avg_latency_ms}ms` : 'N/A'} />
        <StatCard label="Total Cost" value={fmtUsd(qaOverview?.total_cost)} sub={qaOverview?.last_run ? `Last: ${timeAgo(qaOverview.last_run)}` : 'Never run'} />
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button onClick={handleTrigger} disabled={triggering}
          className="px-4 py-1.5 text-sm bg-[var(--accent-primary)] text-white rounded-lg hover:opacity-90 disabled:opacity-50">
          {triggering ? 'Running...' : 'Run Tests Now'}
        </button>
        <button onClick={handleGenerate} disabled={generating}
          className="px-4 py-1.5 text-sm bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-secondary)] rounded-lg hover:opacity-90 disabled:opacity-50">
          {generating ? 'Generating...' : 'Generate New Scenarios'}
        </button>
      </div>

      {/* Generated Scenarios */}
      {scenarios && scenarios.length > 0 && (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-[var(--border-secondary)] flex items-center justify-between">
            <h3 className="text-sm font-medium text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
              Generated Scenarios
            </h3>
            <div className="flex gap-2 text-[10px]">
              <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">{activeScenarios.length} active</span>
              <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400">{draftScenarios.length} draft</span>
              <span className="px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]">{retiredScenarios.length} retired</span>
            </div>
          </div>
          <div className="divide-y divide-[var(--border-secondary)]/50">
            {scenarios.map((s) => (
              <div key={s.id} className="px-5 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[var(--text-primary)]">{s.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${categoryStyles[s.category] || 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]'}`}>
                      {s.category}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${scenarioStatusStyles[s.status]}`}>
                      {s.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[var(--text-tertiary)]">
                      {s.pass_count}P / {s.fail_count}F
                      {s.last_run_at && ` · ${timeAgo(s.last_run_at)}`}
                    </span>
                    {s.status === 'draft' && (
                      <button onClick={() => handleActivate(s.id)}
                        className="text-[10px] px-2 py-0.5 bg-green-500/10 text-green-400 rounded hover:bg-green-500/20">
                        Activate
                      </button>
                    )}
                    {s.status === 'active' && (
                      <button onClick={() => handleRetire(s.id)}
                        className="text-[10px] px-2 py-0.5 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20">
                        Retire
                      </button>
                    )}
                    <button onClick={() => setScenarioExpanded((p) => ({ ...p, [s.id]: !p[s.id] }))}
                      className="text-[10px] text-[var(--accent-primary)] hover:underline">
                      {scenarioExpanded[s.id] ? 'Hide' : 'Details'}
                    </button>
                  </div>
                </div>
                <div className="text-xs text-[var(--text-secondary)] mt-1">{s.rationale}</div>
                {scenarioExpanded[s.id] && (
                  <div className="mt-2 p-3 bg-[var(--bg-tertiary)]/30 rounded-lg">
                    {s.retired_reason && (
                      <div className="text-xs text-[var(--text-tertiary)] mb-2">Retired: {s.retired_reason}</div>
                    )}
                    <pre className="text-xs text-[var(--text-tertiary)] overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(s.scenario_config, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent runs table */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[var(--border-secondary)]">
          <h3 className="text-sm font-medium text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
            Recent Test Runs
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--text-tertiary)] text-xs border-b border-[var(--border-secondary)]">
                <th className="text-left px-5 py-2">Scenario</th>
                <th className="text-center px-3 py-2">Status</th>
                <th className="text-right px-3 py-2">Latency</th>
                <th className="text-right px-3 py-2">Score</th>
                <th className="text-right px-3 py-2">Cost</th>
                <th className="text-left px-3 py-2">Time</th>
                <th className="text-center px-5 py-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {runs?.runs?.length > 0 ? runs.runs.map((r) => (
                <React.Fragment key={r.id}>
                  <tr className="border-b border-[var(--border-secondary)]/50 hover:bg-[var(--bg-tertiary)]/30">
                    <td className="px-5 py-2 font-mono text-xs text-[var(--text-primary)]">{r.scenario_name}</td>
                    <td className="text-center px-3 py-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusStyles[r.status] || 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]'}`}>
                        {r.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="text-right px-3 py-2 text-xs text-[var(--text-secondary)]">
                      {r.response_latency_ms ? `${(r.response_latency_ms / 1000).toFixed(1)}s` : '—'}
                    </td>
                    <td className="text-right px-3 py-2 text-xs">
                      {r.quality_score != null ? (
                        <span className={r.quality_score >= 4 ? 'text-green-400' : r.quality_score >= 2.5 ? 'text-yellow-400' : 'text-red-400'}>
                          {r.quality_score.toFixed(1)}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="text-right px-3 py-2 text-xs text-[var(--text-secondary)]">{fmtUsd(r.cost_usd)}</td>
                    <td className="px-3 py-2 text-xs text-[var(--text-tertiary)]">{timeAgo(r.created_at)}</td>
                    <td className="text-center px-5 py-2">
                      <button onClick={() => setExpanded((p) => ({ ...p, [r.id]: !p[r.id] }))}
                        className="text-[10px] text-[var(--accent-primary)] hover:underline">
                        {expanded[r.id] ? 'Hide' : 'Show'}
                      </button>
                    </td>
                  </tr>
                  {expanded[r.id] && (
                    <tr>
                      <td colSpan={7} className="px-5 py-3 bg-[var(--bg-tertiary)]/20">
                        {r.error_message && (
                          <div className="text-xs text-red-400 mb-2">Error: {r.error_message}</div>
                        )}
                        {r.details && (
                          <pre className="text-xs text-[var(--text-tertiary)] overflow-x-auto whitespace-pre-wrap">
                            {JSON.stringify(r.details, null, 2)}
                          </pre>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )) : (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-[var(--text-tertiary)]">
                    No test runs yet. Click "Run Tests Now" to start.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {runs?.total > (runs?.runs?.length || 0) && (
          <div className="text-xs text-[var(--text-tertiary)] text-center py-2 border-t border-[var(--border-secondary)]">
            Showing {runs.runs.length} of {runs.total} runs
          </div>
        )}
      </div>
    </div>
  );
}

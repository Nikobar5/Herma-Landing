import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHermaAuth } from '../context/HermaAuthContext';
import { ToastProvider, useToast } from '../context/ToastContext';
import AdminSidebar from '../components/AdminSidebar';
import FunnelTab from './dashboard/FunnelTab';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart, Legend,
  PieChart, Pie, Cell,
} from 'recharts';
import {
  getAdminOverview,
  getAdminDaily,
  getAdminHourly,
  getAdminModels,
  getAdminRecent,
  getAdminLatency,
  getSiteAnalytics,
  getRetentionOverview,
  getObservabilitySummary,
  getObservabilitySessionLogs,
  getObservabilityAlerts,
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

function fmtInt(n) {
  if (n == null) return '—';
  return Number(n).toLocaleString();
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

// Tiny sparkline (still used by SiteAnalyticsTab)
function MiniBar({ data, valueKey, height = 40, className = '' }) {
  if (!data || data.length === 0) return null;
  const values = data.map((d) => Number(d[valueKey]) || 0);
  const max = Math.max(...values, 1);
  const barW = Math.max(2, Math.floor(200 / values.length) - 1);
  return (
    <div className={`flex items-end gap-px ${className}`} style={{ height }}>
      {values.map((v, i) => (
        <div key={i} className="bg-[var(--accent-primary)] rounded-t opacity-70 hover:opacity-100 transition-opacity"
          style={{ width: barW, height: Math.max(1, (v / max) * height) }}
          title={`${data[i]?.date || data[i]?.hour || ''}: ${v}`} />
      ))}
    </div>
  );
}

// Skeleton loaders for loading states
function SkeletonCard() {
  return (
    <div className="rounded-xl p-5">
      <div className="skeleton skeleton-text-sm mb-2" />
      <div className="skeleton skeleton-heading mb-1" />
      <div className="skeleton skeleton-text-sm" style={{ width: '50%' }} />
    </div>
  );
}

function SkeletonTable({ rows = 5, cols = 5 }) {
  return (
    <div className="rounded-xl p-5 space-y-3">
      <div className="skeleton skeleton-heading mb-4" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="skeleton skeleton-text flex-1" style={{ width: `${60 + Math.random() * 40}%` }} />
          ))}
        </div>
      ))}
    </div>
  );
}

function SkeletonChart() {
  return (
    <div className="rounded-xl p-5">
      <div className="skeleton skeleton-text-sm mb-3" style={{ width: '30%' }} />
      <div className="skeleton" style={{ height: 200, width: '100%' }} />
    </div>
  );
}



// Custom Recharts tooltip
function ChartTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg px-3 py-2 shadow-lg text-xs">
      <div className="text-[var(--text-tertiary)] mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-[var(--text-secondary)]">{p.name}:</span>
          <span className="text-[var(--text-primary)] font-medium">{formatter ? formatter(p.value, p.name) : p.value}</span>
        </div>
      ))}
    </div>
  );
}

function StatCard({ label, value, sub, trend, accent, icon }) {
  return (
    <div className="rounded-xl p-5 hover:bg-[var(--bg-secondary)]/30 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider" style={{ fontFamily: 'var(--font-ui)' }}>
          {label}
        </div>
        {icon && <span className="text-[var(--text-tertiary)] opacity-50">{icon}</span>}
      </div>
      <div className={`text-3xl font-light tracking-tight ${accent ? 'text-[var(--text-primary)] font-medium' : 'text-[var(--text-primary)]'}`} style={{ fontFamily: 'var(--font-heading)' }}>
        {value}
      </div>
      {sub && <div className="text-xs text-[var(--text-tertiary)] mt-1.5">{sub}</div>}
      {trend != null && (
        <div className={`text-xs mt-1.5 flex items-center gap-1 ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            {trend >= 0 ? <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25" />}
          </svg>
          {trend >= 0 ? '+' : ''}{fmtPct(trend)} vs prev 7d
        </div>
      )}
    </div>
  );
}

// Reusable sortable/searchable/paginated table wrapper
function DataTable({ data, columns, searchKeys = [], defaultSort, emptyMessage = 'No data available', pageSize: defaultPageSize = 15 }) {
  const [inputValue, setInputValue] = useState('');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(defaultSort?.key || null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(inputValue);
      setPage(0);
    }, 250);
    return () => clearTimeout(timer);
  }, [inputValue]);
  const [sortDir, setSortDir] = useState(defaultSort?.dir || 'desc');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  let filtered = data || [];
  if (search && searchKeys.length > 0) {
    const q = search.toLowerCase();
    filtered = filtered.filter((row) => searchKeys.some((k) => String(row[k] || '').toLowerCase().includes(q)));
  }
  if (sortKey) {
    filtered = [...filtered].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      const cmp = typeof av === 'number' ? av - bv : String(av || '').localeCompare(String(bv || ''));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="rounded-xl overflow-hidden">
      {/* Controls */}
      <div className="px-4 py-3 border-b border-[var(--border-secondary)] flex flex-wrap items-center gap-3">
        {searchKeys.length > 0 && (
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search..." className="w-full text-xs bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] rounded-lg pl-9 pr-3 py-1.5 text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-primary)]/50" />
          </div>
        )}
        <div className="ml-auto flex items-center gap-2 text-[10px] text-[var(--text-tertiary)]">
          <span>{filtered.length} {filtered.length === 1 ? 'row' : 'rows'}</span>
          <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(0); }}
            className="bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] rounded px-1.5 py-0.5 text-[var(--text-secondary)] text-[10px]">
            <option value={10}>10</option><option value={15}>15</option><option value={25}>25</option><option value={50}>50</option>
          </select>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[var(--text-tertiary)] text-xs border-b border-[var(--border-secondary)]">
              {columns.map((col) => (
                <th key={col.key} className={`${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} px-4 py-2 font-medium ${col.sortable !== false ? 'cursor-pointer hover:text-[var(--text-secondary)] select-none' : ''} ${sortKey === col.key ? 'text-[var(--text-primary)]' : ''}`}
                  onClick={() => col.sortable !== false && handleSort(col.key)}>
                  <div className={`flex items-center gap-1.5 ${col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : 'justify-start'}`}>
                    {col.label}
                    {col.sortable !== false && sortKey === col.key && (
                      <svg className="w-3 h-3 text-[var(--accent-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        {sortDir === 'asc'
                          ? <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                          : <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />}
                      </svg>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length > 0 ? paged.map((row, i) => (
              <tr key={row._key || i} className="border-b border-[var(--border-secondary)]/50 hover:bg-[var(--bg-tertiary)]/30">
                {columns.map((col) => (
                  <td key={col.key} className={`${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} px-4 py-2`}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            )) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-[var(--text-tertiary)] text-sm">
                  {search ? (
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div>No results found for "<span className="text-[var(--text-primary)] font-medium">{search}</span>"</div>
                      <button onClick={() => setInputValue('')} className="px-3 py-1.5 rounded-md bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] border border-[var(--border-secondary)] text-xs text-[var(--text-primary)] transition-colors">
                        Clear Search
                      </button>
                    </div>
                  ) : emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-2 border-t border-[var(--border-secondary)] flex items-center justify-between text-xs text-[var(--text-tertiary)]">
          <span>Page {page + 1} of {totalPages}</span>
          <div className="flex gap-1">
            <button title="First Page" onClick={() => setPage(0)} disabled={page === 0} className="px-2 py-1 rounded bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] disabled:opacity-30">«</button>
            <button title="Previous Page" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="px-2 py-1 rounded bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] disabled:opacity-30">‹</button>
            <button title="Next Page" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="px-2 py-1 rounded bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] disabled:opacity-30">›</button>
            <button title="Last Page" onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1} className="px-2 py-1 rounded bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] disabled:opacity-30">»</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ToastProvider>
      <AdminDashboardInner />
    </ToastProvider>
  );
}

function AdminDashboardInner() {
  const { isAdmin, logout } = useHermaAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const overviewRef = React.useRef(null);
  // Business data
  const [overview, setOverview] = useState(null);
  const [daily, setDaily] = useState([]);
  const [hourly, setHourly] = useState([]);
  const [models, setModels] = useState([]);
  const [recent, setRecent] = useState([]);
  const [latencyData, setLatencyData] = useState(null);
  const [siteAnalytics, setSiteAnalytics] = useState(null);
  const [retention, setRetention] = useState(null);
  // Agent observability
  const [agentHealth, setAgentHealth] = useState(null);
  const [agentLogs, setAgentLogs] = useState([]);
  const [agentAlerts, setAgentAlerts] = useState([]);
  const [acknowledgedErrors, setAcknowledgedErrors] = useState(() => {
    try {
      const stored = localStorage.getItem('herma_acked_errors');
      return new Set(stored ? JSON.parse(stored) : []);
    } catch { return new Set(); }
  });
  const unacknowledgeError = useCallback((fp) => {
    setAcknowledgedErrors((prev) => {
      const next = new Set(prev);
      next.delete(fp);
      try { localStorage.setItem('herma_acked_errors', JSON.stringify([...next])); } catch { }
      return next;
    });
  }, []);

  const acknowledgeError = useCallback((fp) => {
    setAcknowledgedErrors((prev) => {
      const next = new Set(prev);
      next.add(fp);
      try { localStorage.setItem('herma_acked_errors', JSON.stringify([...next])); } catch { }
      return next;
    });

    toast.info(
      <div className="flex items-center justify-between w-full">
        <span>Error dismissed</span>
        <button
          onClick={() => unacknowledgeError(fp)}
          className="ml-3 px-2 py-0.5 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] rounded text-xs transition-colors border border-[var(--border-primary)]"
        >
          Undo
        </button>
      </div>
    );
  }, [toast, unacknowledgeError]);
  const clearAcknowledged = useCallback(() => {
    setAcknowledgedErrors(new Set());
    try { localStorage.removeItem('herma_acked_errors'); } catch { }
  }, []);
  // UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [ov, dy, hr, md, rc, lat, sa, ret, obsSummary, logs, alerts] = await Promise.all([
        getAdminOverview(),
        getAdminDaily(60),
        getAdminHourly(24),
        getAdminModels(),
        getAdminRecent(30),
        getAdminLatency(7).catch(() => null),
        getSiteAnalytics(30).catch(() => null),
        getRetentionOverview().catch(() => null),
        getObservabilitySummary().catch(() => null),
        getObservabilitySessionLogs(200).catch(() => []),
        getObservabilityAlerts(50).catch(() => []),
      ]);
      setOverview(ov);
      overviewRef.current = ov;
      setDaily(dy);
      setHourly(hr);
      setModels(md);
      setRecent(rc);
      setLatencyData(lat);
      setSiteAnalytics(sa);
      setRetention(ret);
      if (obsSummary) setAgentHealth(obsSummary.health);
      setAgentLogs(logs || []);
      setAgentAlerts(alerts || []);
    } catch (err) {
      if (overviewRef.current) {
        toast.error('Sync failed. Retrying in background...');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }
    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, [isAdmin, navigate, loadData]);

  if (!isAdmin) return null;

  const agentStatus = agentHealth?.status || 'unknown';

  // Full-page loading skeleton
  if (loading && !overview) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex">
        <div className="w-60 bg-[var(--bg-secondary)] border-r border-[var(--border-primary)] p-4 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton skeleton-text" />)}
        </div>
        <div className="flex-1 p-6 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <SkeletonChart /><SkeletonChart />
          </div>
          <SkeletonTable />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <svg className="w-12 h-12 text-[var(--error)] mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
          <div className="text-[var(--error)] mb-2 text-sm font-medium">Failed to load dashboard</div>
          <div className="text-xs text-[var(--text-tertiary)] mb-4 max-w-sm">{error}</div>
          <button onClick={loadData} className="px-4 py-2 bg-[var(--accent-primary)] text-white rounded-lg text-sm hover:opacity-90">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Tab label helper for page title
  const TAB_LABELS = {
    overview: 'Dashboard Overview', models: 'Model Performance', requests: 'Recent Requests',
    latency: 'Latency Analysis', retention: 'Customer Retention',
    'site-analytics': 'Site Analytics', funnel: 'Conversion Funnel',
    'agent-status': 'Agent Overview', 'agent-activity': 'Agent Activity Log', 'agent-alerts': 'Agent Alerts',
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      {/* Sidebar */}
      <AdminSidebar
        activeTab={tab}
        onTabChange={setTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
        agentHealth={agentStatus}
      />

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <div className="bg-[var(--bg-primary)]/80 backdrop-blur-md sticky top-0 z-20">
          <div className="px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-base font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
                {TAB_LABELS[tab] || tab}
              </h1>
              {loading && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] animate-pulse">
                  Refreshing…
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button onClick={loadData} className={`text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors p-1.5 rounded-md hover:bg-[var(--bg-tertiary)] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading} title="Refresh data">
                <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </button>
              <button onClick={() => navigate('/chat')} className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] px-2 py-1 rounded-md hover:bg-[var(--bg-tertiary)]">Chat</button>
              <button onClick={() => navigate('/dashboard')} className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] px-2 py-1 rounded-md hover:bg-[var(--bg-tertiary)]">Dashboard</button>
              <button onClick={() => setShowLogoutConfirm(true)} className="text-xs text-[var(--text-tertiary)] hover:text-[var(--error)] px-2 py-1 rounded-md hover:bg-[var(--bg-tertiary)]">Logout</button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Business tabs */}
          {tab === 'overview' && <OverviewTab overview={overview} daily={daily} hourly={hourly} />}
          {tab === 'latency' && <LatencyTab latency={latencyData} />}
          {tab === 'models' && <ModelsTab models={models} />}
          {tab === 'requests' && <RequestsTab recent={recent} />}
          {tab === 'retention' && <RetentionTab data={retention} />}
          {tab === 'site-analytics' && <SiteAnalyticsTab data={siteAnalytics} />}
          {tab === 'funnel' && <FunnelTab />}
          {/* Agent tabs */}
          {tab === 'agent-status' && (
            <AgentStatusTab
              health={agentHealth}
              logs={agentLogs}
              acknowledgedErrors={acknowledgedErrors}
              acknowledgeError={acknowledgeError}
              clearAcknowledged={clearAcknowledged}
            />
          )}
          {tab === 'agent-activity' && (
            <AgentActivityTab
              logs={agentLogs}
              onRefresh={loadData}
              acknowledgedErrors={acknowledgedErrors}
              acknowledgeError={acknowledgeError}
            />
          )}
          {tab === 'agent-alerts' && <AgentAlertsTab alerts={agentAlerts} onRefresh={loadData} />}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Confirm Logout</h3>
            <p className="text-sm text-[var(--text-tertiary)] mb-6">Are you sure you want to log out of the admin dashboard?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors border border-[var(--border-secondary)]"
              >
                Cancel
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OverviewTab({ overview, daily, hourly }) {
  const [chartPeriod, setChartPeriod] = useState(30);

  // Trend: last 7d vs prior 7d (daily is oldest-first)
  const last7 = (daily || []).slice(-7);
  const prev7 = (daily || []).slice(-14, -7);
  const sumF = (arr, f) => arr.reduce((s, d) => s + (Number(d[f]) || 0), 0);
  const trendPct = (curr, prev) => prev > 0 ? ((curr - prev) / prev) * 100 : null;
  const revTrend = trendPct(sumF(last7, 'total_cost'), sumF(prev7, 'total_cost'));
  const profTrend = trendPct(sumF(last7, 'profit'), sumF(prev7, 'profit'));
  const reqTrend = trendPct(sumF(last7, 'request_count'), sumF(prev7, 'request_count'));
  const userTrend = trendPct(sumF(last7, 'unique_customers'), sumF(prev7, 'unique_customers'));

  // Chart data sliced to selected period, reversed for display (newest on right)
  const chartData = [...(daily || [])].slice(-chartPeriod).reverse().map((d) => ({
    date: d.date?.slice(5) || '',
    Revenue: Number(d.total_cost) || 0,
    Cost: Number(d.openrouter_cost) || 0,
    Profit: Number(d.profit) || 0,
  }));

  const hourlyData = (hourly || []).map((h) => ({
    hour: h.hour?.slice(11, 16) || '',
    Requests: h.request_count || 0,
  }));

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Today Revenue" value={fmtUsd(overview?.today_revenue)} sub={`${fmtInt(overview?.today_requests)} req today`} trend={revTrend} accent />
        <StatCard label="Today Profit" value={fmtUsd(overview?.today_profit)} trend={profTrend} />
        <StatCard label="Gross Margin" value={fmtPct(overview?.margin_pct)} sub="all-time" />
        <StatCard label="Today Cost" value={fmtUsd(overview?.today_cost)} sub="OpenRouter spend" />
        <StatCard label="Active Users" value={fmtInt(overview?.active_customers)} sub="last 30 days" trend={userTrend} />
        <StatCard label="Total Requests" value={fmtInt(overview?.total_requests)} sub={`${fmtInt(overview?.requests_30d)} in 30d`} trend={reqTrend} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Daily Revenue & Profit Bar Chart with period selector */}
        <div className="rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide" style={{ fontFamily: 'var(--font-ui)' }}>
              Daily Revenue vs Cost
            </div>
            <div className="flex gap-1 bg-[var(--bg-primary)] border border-[var(--border-secondary)] rounded-lg p-0.5">
              {[7, 14, 30].map((n) => (
                <button key={n} onClick={() => setChartPeriod(n)}
                  className={`px-2.5 py-1 text-[10px] rounded-md transition-colors ${chartPeriod === n ? 'bg-[var(--accent-primary)] text-white font-medium' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'}`}>
                  {n}d
                </button>
              ))}
            </div>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} barGap={1}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="date" tick={{ fill: '#71717A', fontSize: 10 }} axisLine={{ stroke: 'rgba(255,255,255,0.08)' }} />
                <YAxis tick={{ fill: '#71717A', fontSize: 10 }} axisLine={{ stroke: 'rgba(255,255,255,0.08)' }} tickFormatter={(v) => `$${v}`} />
                <Tooltip content={<ChartTooltip formatter={(v) => `$${Number(v).toFixed(2)}`} />} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#71717A' }} />
                <Bar dataKey="Revenue" fill="#818CF8" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Cost" fill="#F87171" radius={[2, 2, 0, 0]} opacity={0.7} />
                <Bar dataKey="Profit" fill="#34D399" radius={[2, 2, 0, 0]} opacity={0.7} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="h-[220px] flex items-center justify-center text-xs text-[var(--text-tertiary)]">No daily data yet</div>}
        </div>

        {/* Hourly Requests Area Chart */}
        <div className="rounded-xl p-5">
          <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide mb-4" style={{ fontFamily: 'var(--font-ui)' }}>
            Hourly Request Volume (24h)
          </div>
          {hourlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="hour" tick={{ fill: '#71717A', fontSize: 10 }} axisLine={{ stroke: 'rgba(255,255,255,0.08)' }} />
                <YAxis tick={{ fill: '#71717A', fontSize: 10 }} axisLine={{ stroke: 'rgba(255,255,255,0.08)' }} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="Requests" stroke="#818CF8" fill="#818CF8" fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : <div className="h-[220px] flex items-center justify-center text-xs text-[var(--text-tertiary)]">No hourly data yet</div>}
        </div>
      </div>

      {/* Financial summary */}
      <div className="rounded-xl p-5">
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

      {/* Daily table with DataTable */}
      <DataTable
        data={[...(daily || [])].reverse().map((d) => ({ ...d, _key: d.date }))}
        searchKeys={['date']}
        defaultSort={{ key: 'date', dir: 'desc' }}
        emptyMessage="No daily data yet"
        columns={[
          { key: 'date', label: 'Date', render: (v) => <span className="text-[var(--text-secondary)]">{v}</span> },
          { key: 'request_count', label: 'Requests', align: 'right', render: (v) => <span className="text-[var(--text-primary)]">{fmtInt(v)}</span> },
          { key: 'unique_customers', label: 'Users', align: 'right', render: (v) => <span className="text-[var(--text-secondary)]">{v}</span> },
          { key: 'total_cost', label: 'Revenue', align: 'right', render: (v) => <span className="text-[var(--text-primary)]">{fmtUsd(v)}</span> },
          { key: 'openrouter_cost', label: 'Cost', align: 'right', render: (v) => <span className="text-[var(--text-secondary)]">{fmtUsd(v)}</span> },
          { key: 'profit', label: 'Profit', align: 'right', render: (v) => <span className="text-green-400">{fmtUsd(v)}</span> },
          {
            key: 'margin_pct', label: 'Margin', align: 'right', render: (v) => {
              const val = Number(v);
              return <span className={`text-xs px-1.5 py-0.5 rounded ${val >= 30 ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>{fmtPct(v)}</span>;
            }
          },
        ]}
      />
    </div>
  );
}


function ModelsTab({ models }) {
  const sorted = [...models].sort((a, b) => b.request_count - a.request_count);
  const totalRequests = sorted.reduce((s, m) => s + m.request_count, 0) || 1;
  const tooltipStyle = { background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)', borderRadius: 8, fontSize: 11 };

  const top5 = sorted.slice(0, 5);
  const otherReqs = sorted.slice(5).reduce((s, m) => s + m.request_count, 0);
  const otherRev = sorted.slice(5).reduce((s, m) => s + Number(m.total_cost || 0), 0);
  const reqPieData = [
    ...top5.map((m, i) => ({
      name: (m.model || 'unknown').split('/').pop().slice(0, 22),
      value: m.request_count,
      color: SOURCE_COLORS[i % SOURCE_COLORS.length],
    })),
    ...(otherReqs > 0 ? [{ name: 'Other', value: otherReqs, color: '#71717A' }] : []),
  ];
  const revPieData = [
    ...top5.map((m, i) => ({
      name: (m.model || 'unknown').split('/').pop().slice(0, 22),
      value: Number(m.total_cost || 0),
      color: SOURCE_COLORS[i % SOURCE_COLORS.length],
    })),
    ...(otherRev > 0 ? [{ name: 'Other', value: otherRev, color: '#71717A' }] : []),
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-4">
      {/* Distribution charts */}
      {sorted.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl p-5">
            <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide mb-3" style={{ fontFamily: 'var(--font-ui)' }}>Request Distribution</div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={reqPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={2} dataKey="value">
                  {reqPieData.map((e) => <Cell key={e.name} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [v.toLocaleString(), 'Requests']} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-xl p-5">
            <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide mb-3" style={{ fontFamily: 'var(--font-ui)' }}>Revenue Distribution</div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={revPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={2} dataKey="value">
                  {revPieData.map((e) => <Cell key={e.name} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`$${Number(v).toFixed(2)}`, 'Revenue']} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="rounded-xl overflow-hidden">
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
    </div>
  );
}

function RequestsTab({ recent }) {
  return (
    <div className="rounded-xl overflow-hidden">
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

function LatencyTab({ latency }) {
  if (!latency) return <div className="text-[var(--text-tertiary)] text-sm py-8 text-center">No latency data available yet.</div>;

  const fmtMs = (v) => v != null ? `${Math.round(v)}ms` : '—';

  // Waterfall: compute max total for scaling
  const traces = latency.recent_traces || [];
  const maxTotal = Math.max(...traces.map((t) => t.latency_ms || 0), 1);

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Avg TTFB" value={fmtMs(latency.avg_ttfb_ms)} accent />
        <StatCard label="Avg Backend" value={fmtMs(latency.avg_backend_overhead_ms)} />
        <StatCard label="Avg OR TTFB" value={fmtMs(latency.avg_openrouter_ttfb_ms)} />
        <StatCard label="Avg Stream" value={fmtMs(latency.avg_streaming_duration_ms)} />
        <StatCard label="Avg Total" value={fmtMs(latency.avg_total_ms)} />
        <StatCard label="Traced Requests" value={latency.total_traced} />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-[var(--text-tertiary)]">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: '#eab308' }} /> Backend Overhead</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: '#3b82f6' }} /> OpenRouter TTFB</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: '#22c55e' }} /> Streaming</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: '#6b7280' }} /> Other</span>
      </div>

      {/* Waterfall chart */}
      {traces.length > 0 && (
        <div className="rounded-xl p-5">
          <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide mb-3" style={{ fontFamily: 'var(--font-ui)' }}>
            Recent Request Waterfall (last 20)
          </div>
          <div className="space-y-1.5">
            {traces.map((t, i) => {
              const total = t.latency_ms || 0;
              const overhead = t.backend_overhead_ms || 0;
              const orTtfb = t.openrouter_ttfb_ms || 0;
              const stream = t.streaming_duration_ms || 0;
              const accounted = overhead + orTtfb + stream;
              const other = Math.max(0, total - accounted);
              const scale = (v) => `${Math.max(0.5, (v / maxTotal) * 100)}%`;

              return (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-20 text-[10px] text-[var(--text-tertiary)] text-right truncate" title={t.model_used || ''}>
                    {(t.model_used || '').split('/').pop()?.slice(0, 12) || '?'}
                  </div>
                  <div className="flex-1 flex items-center h-5 rounded overflow-hidden bg-[var(--bg-tertiary)]/30">
                    {overhead > 0 && <div style={{ width: scale(overhead), background: '#eab308' }} className="h-full" title={`Backend: ${overhead}ms`} />}
                    {orTtfb > 0 && <div style={{ width: scale(orTtfb), background: '#3b82f6' }} className="h-full" title={`OR TTFB: ${orTtfb}ms`} />}
                    {stream > 0 && <div style={{ width: scale(stream), background: '#22c55e' }} className="h-full" title={`Stream: ${stream}ms`} />}
                    {other > 0 && <div style={{ width: scale(other), background: '#6b7280' }} className="h-full" title={`Other: ${other}ms`} />}
                  </div>
                  <div className="w-16 text-[10px] text-[var(--text-tertiary)] text-right">
                    {total}ms
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Per-model table */}
      {latency.by_model && latency.by_model.length > 0 && (
        <div className="rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-[var(--border-secondary)]">
            <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide" style={{ fontFamily: 'var(--font-ui)' }}>Per-Model Latency</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[var(--text-tertiary)] text-left border-b border-[var(--border-secondary)]">
                  <th className="px-5 py-2 font-medium">Model</th>
                  <th className="px-3 py-2 font-medium text-right">Count</th>
                  <th className="px-3 py-2 font-medium text-right">Avg TTFB</th>
                  <th className="px-3 py-2 font-medium text-right">Avg Backend</th>
                  <th className="px-3 py-2 font-medium text-right">Avg OR TTFB</th>
                  <th className="px-3 py-2 font-medium text-right">Avg Stream</th>
                  <th className="px-3 py-2 font-medium text-right">Avg Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-secondary)]/50">
                {latency.by_model.map((m) => (
                  <tr key={m.model} className="text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]/30">
                    <td className="px-5 py-2 text-[var(--text-primary)]">{m.model}</td>
                    <td className="px-3 py-2 text-right">{m.count}</td>
                    <td className="px-3 py-2 text-right">{fmtMs(m.avg_ttfb_ms)}</td>
                    <td className="px-3 py-2 text-right">{fmtMs(m.avg_backend_overhead_ms)}</td>
                    <td className="px-3 py-2 text-right">{fmtMs(m.avg_openrouter_ttfb_ms)}</td>
                    <td className="px-3 py-2 text-right">{fmtMs(m.avg_streaming_duration_ms)}</td>
                    <td className="px-3 py-2 text-right">{fmtMs(m.avg_total_ms)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function RetentionTab({ data }) {
  if (!data) return <div className="text-[var(--text-tertiary)] text-center py-12">No retention data yet.</div>;

  const statusColor = (s) => s === 'active' ? 'text-green-400' : s === 'at_risk' ? 'text-yellow-400' : 'text-red-400';
  const statusBg = (s) => s === 'active' ? 'bg-green-400/10' : s === 'at_risk' ? 'bg-yellow-400/10' : 'bg-red-400/10';

  const total = data.total || 1;
  const activePct = Math.round((data.active || 0) / total * 100);
  const atRiskPct = Math.round((data.at_risk || 0) / total * 100);
  const churnedPct = Math.max(0, 100 - activePct - atRiskPct);

  return (
    <div className="space-y-6">
      {/* Visual health breakdown */}
      <div className="rounded-xl p-5">
        <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide mb-3" style={{ fontFamily: 'var(--font-ui)' }}>
          Customer Health — {data.total} total
        </div>
        <div className="flex rounded-lg overflow-hidden h-8 mb-3 bg-[var(--bg-primary)]">
          {activePct > 0 && (
            <div style={{ width: `${activePct}%` }} className="bg-green-400/70 flex items-center justify-center text-[10px] text-white font-semibold transition-all">
              {activePct >= 8 ? `${activePct}%` : ''}
            </div>
          )}
          {atRiskPct > 0 && (
            <div style={{ width: `${atRiskPct}%` }} className="bg-yellow-400/70 flex items-center justify-center text-[10px] text-white font-semibold transition-all">
              {atRiskPct >= 8 ? `${atRiskPct}%` : ''}
            </div>
          )}
          {churnedPct > 0 && (
            <div style={{ width: `${churnedPct}%` }} className="bg-red-400/70 flex items-center justify-center text-[10px] text-white font-semibold transition-all">
              {churnedPct >= 8 ? `${churnedPct}%` : ''}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-[var(--text-secondary)]">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-green-400/70 shrink-0" />Active — {data.active} ({activePct}%)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-yellow-400/70 shrink-0" />At Risk — {data.at_risk} ({atRiskPct}%)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-red-400/70 shrink-0" />Churned — {data.churned} ({churnedPct}%)</span>
        </div>
      </div>

      {/* Customer table */}
      <div className="rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[var(--border-primary)]">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
            Customer Retention Detail
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-primary)] text-[var(--text-tertiary)]">
                <th className="text-left py-2 px-4 font-medium" style={{ fontFamily: 'var(--font-ui)' }}>Email</th>
                <th className="text-center py-2 px-4 font-medium" style={{ fontFamily: 'var(--font-ui)' }}>Status</th>
                <th className="text-right py-2 px-4 font-medium" style={{ fontFamily: 'var(--font-ui)' }}>7d Reqs</th>
                <th className="text-right py-2 px-4 font-medium" style={{ fontFamily: 'var(--font-ui)' }}>30d Reqs</th>
                <th className="text-right py-2 px-4 font-medium" style={{ fontFamily: 'var(--font-ui)' }}>Total</th>
                <th className="text-right py-2 px-4 font-medium" style={{ fontFamily: 'var(--font-ui)' }}>Trend</th>
                <th className="text-right py-2 px-4 font-medium" style={{ fontFamily: 'var(--font-ui)' }}>Spend</th>
                <th className="text-right py-2 px-4 font-medium" style={{ fontFamily: 'var(--font-ui)' }}>Last Seen</th>
              </tr>
            </thead>
            <tbody>
              {data.customers.map((c) => (
                <tr key={c.customer_id} className="border-b border-[var(--border-primary)] hover:bg-[var(--bg-primary)]/50">
                  <td className="py-2 px-4 text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-code)' }}>
                    {c.email}
                  </td>
                  <td className="py-2 px-4 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${statusColor(c.status)} ${statusBg(c.status)}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-right text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-code)' }}>
                    {c.requests_7d}
                  </td>
                  <td className="py-2 px-4 text-right text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-code)' }}>
                    {c.requests_30d}
                  </td>
                  <td className="py-2 px-4 text-right text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-code)' }}>
                    {c.total_requests}
                  </td>
                  <td className="py-2 px-4 text-right" style={{ fontFamily: 'var(--font-code)' }}>
                    <span className={c.weekly_trend >= 1 ? 'text-green-400' : c.weekly_trend > 0 ? 'text-yellow-400' : 'text-[var(--text-tertiary)]'}>
                      {c.weekly_trend > 0 ? `${c.weekly_trend.toFixed(1)}x` : '—'}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-right text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-code)' }}>
                    {fmtUsd(c.total_spend)}
                  </td>
                  <td className="py-2 px-4 text-right text-[var(--text-tertiary)]" style={{ fontFamily: 'var(--font-ui)' }}>
                    {c.days_since_last_request === 0 ? 'today' : `${c.days_since_last_request}d ago`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SiteAnalyticsTab({ data }) {
  if (!data) return <div className="text-[var(--text-tertiary)] text-center py-12">No site analytics data yet.</div>;

  // Aggregate utm_campaigns by source for bar chart
  const sourceMap = (data.utm_campaigns || []).reduce((acc, c) => {
    const src = c.utm_source || '(direct)';
    acc[src] = (acc[src] || 0) + (c.visits || 0);
    return acc;
  }, {});
  const sourceBarData = Object.entries(sourceMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, value]) => ({ name, value }));
  const maxSourceVisits = sourceBarData[0]?.value || 1;
  const tooltipStyle = { background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)', borderRadius: 8, fontSize: 11 };

  return (
    <div className="space-y-6">
      {/* ── TRAFFIC SOURCES (top priority for outreach tracking) ── */}
      <div className="rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm font-medium text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>Traffic Sources</div>
            <div className="text-xs text-[var(--text-tertiary)] mt-0.5">Visits by UTM source (last 30d)</div>
          </div>
        </div>
        {sourceBarData.length > 0 ? (
          <ResponsiveContainer width="100%" height={Math.max(120, sourceBarData.length * 38)}>
            <BarChart data={sourceBarData} layout="vertical" margin={{ left: 0, right: 24, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#71717A', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#A1A1AA', fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [v.toLocaleString(), 'Visits']} />
              <Bar dataKey="value" name="Visits" fill="var(--accent-primary)" radius={[0, 4, 4, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="py-8 text-center">
            <div className="text-sm text-[var(--text-tertiary)] mb-2">No UTM data yet</div>
            <div className="text-xs text-[var(--text-tertiary)] max-w-md mx-auto leading-relaxed">
              Add UTM parameters to your outreach links so you can see which posts and emails are driving traffic. Example:
              <code className="block mt-2 bg-[var(--bg-primary)] border border-[var(--border-secondary)] px-3 py-1.5 rounded text-[var(--accent-primary)] font-mono text-[11px]">
                herma.app/?utm_source=reddit&amp;utm_campaign=post-title
              </code>
            </div>
          </div>
        )}
      </div>

      {/* ── UTM CAMPAIGNS DETAIL ── */}
      {data.utm_campaigns?.length > 0 && (
        <div className="rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-[var(--border-secondary)]">
            <div className="text-sm font-medium text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>Campaign Detail</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[var(--text-tertiary)] text-xs border-b border-[var(--border-secondary)]">
                  <th className="text-left px-5 py-2">Source</th>
                  <th className="text-left px-3 py-2">Medium</th>
                  <th className="text-left px-3 py-2">Campaign</th>
                  <th className="text-right px-5 py-2">Visits</th>
                </tr>
              </thead>
              <tbody>
                {data.utm_campaigns.map((u, i) => {
                  const barPct = maxSourceVisits > 0 ? Math.round((u.visits / maxSourceVisits) * 100) : 0;
                  return (
                    <tr key={i} className="border-b border-[var(--border-secondary)]/50 hover:bg-[var(--bg-tertiary)]/20">
                      <td className="px-5 py-2.5">
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-medium">{u.utm_source || '—'}</span>
                      </td>
                      <td className="px-3 py-2.5 text-[var(--text-tertiary)] text-xs">{u.utm_medium || '—'}</td>
                      <td className="px-3 py-2.5 text-[var(--text-secondary)] text-xs max-w-[200px] truncate">{u.utm_campaign || '—'}</td>
                      <td className="px-5 py-2.5">
                        <div className="flex items-center gap-2 justify-end">
                          <div className="w-16 h-1.5 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                            <div className="h-full bg-[var(--accent-primary)] rounded-full opacity-60" style={{ width: `${barPct}%` }} />
                          </div>
                          <span className="text-[var(--text-primary)] text-xs w-8 text-right">{u.visits}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── KPI ROW ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Visitors (30d)" value={(data.unique_visitors_30d || 0).toLocaleString()} sub={`7d: ${data.unique_visitors_7d || 0} · Today: ${data.unique_visitors_today || 0}`} accent />
        <StatCard label="Sessions (30d)" value={(data.sessions_30d || 0).toLocaleString()} />
        <StatCard label="Page Views (30d)" value={(data.page_views_30d || 0).toLocaleString()} sub={`7d: ${data.page_views_7d || 0} · Today: ${data.page_views_today || 0}`} />
        <StatCard label="Bounce Rate" value={data.bounce_rate != null ? `${data.bounce_rate}%` : '—'} />
      </div>

      {/* ── CONVERSION ROW ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Sign-ups" value={data.signups || 0} />
        <StatCard label="Chats Started" value={data.chats_started || 0} />
        <StatCard label="Downloads" value={data.downloads || 0} />
        <StatCard label="Avg Time on Page" value={data.avg_time_on_page != null ? `${data.avg_time_on_page}s` : '—'} />
      </div>

      {/* ── REFERRERS (catches non-UTM Reddit/email traffic) ── */}
      {data.referrers?.length > 0 && (
        <div className="rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-[var(--border-secondary)]">
            <div className="text-sm font-medium text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>Referrers</div>
            <div className="text-xs text-[var(--text-tertiary)] mt-0.5">Visitors arriving via direct links (no UTM)</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[var(--text-tertiary)] text-xs border-b border-[var(--border-secondary)]">
                  <th className="text-left px-5 py-2">Source</th>
                  <th className="text-right px-3 py-2">Visits</th>
                  <th className="text-right px-5 py-2">Unique Visitors</th>
                </tr>
              </thead>
              <tbody>
                {data.referrers.map((r, i) => (
                  <tr key={i} className="border-b border-[var(--border-secondary)]/50 hover:bg-[var(--bg-tertiary)]/20">
                    <td className="px-5 py-2 text-[var(--text-secondary)] text-xs truncate max-w-xs">{r.source}</td>
                    <td className="px-3 py-2 text-right text-[var(--text-primary)] text-xs">{r.visits}</td>
                    <td className="px-5 py-2 text-right text-[var(--text-secondary)] text-xs">{r.unique_visitors}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TOP PAGES ── */}
      {data.top_pages?.length > 0 && (
        <div className="rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-[var(--border-secondary)]">
            <div className="text-sm font-medium text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>Top Pages</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[var(--text-tertiary)] text-xs border-b border-[var(--border-secondary)]">
                  <th className="text-left px-5 py-2">Path</th>
                  <th className="text-right px-3 py-2">Views</th>
                  <th className="text-right px-5 py-2">Unique Visitors</th>
                </tr>
              </thead>
              <tbody>
                {data.top_pages.map((p, i) => (
                  <tr key={i} className="border-b border-[var(--border-secondary)]/50 hover:bg-[var(--bg-tertiary)]/20">
                    <td className="px-5 py-2 text-[var(--text-secondary)] font-mono text-xs">{p.path}</td>
                    <td className="px-3 py-2 text-right text-[var(--text-primary)] text-xs">{p.views}</td>
                    <td className="px-5 py-2 text-right text-[var(--text-secondary)] text-xs">{p.unique_visitors}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── DAILY SPARKLINES + DEVICE/BROWSER/OS ── */}
      {data.daily?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-xl p-4">
            <div className="text-xs text-[var(--text-tertiary)] mb-2">Daily Page Views</div>
            <MiniBar data={data.daily} valueKey="page_views" height={48} />
          </div>
          <div className="rounded-xl p-4">
            <div className="text-xs text-[var(--text-tertiary)] mb-2">Daily Unique Visitors</div>
            <MiniBar data={data.daily} valueKey="unique_visitors" height={48} />
          </div>
        </div>
      )}

      {/* ── DEVICE / BROWSER / OS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {data.devices?.length > 0 && (
          <div className="rounded-xl p-4">
            <div className="text-sm font-medium text-[var(--text-primary)] mb-3">Devices</div>
            {data.devices.map((d, i) => (
              <div key={i} className="flex justify-between text-sm py-1">
                <span className="text-[var(--text-secondary)]">{d.device_type}</span>
                <span className="text-[var(--text-primary)]">{d.count} ({d.pct}%)</span>
              </div>
            ))}
          </div>
        )}
        {data.browsers?.length > 0 && (
          <div className="rounded-xl p-4">
            <div className="text-sm font-medium text-[var(--text-primary)] mb-3">Browsers</div>
            {data.browsers.map((b, i) => (
              <div key={i} className="flex justify-between text-sm py-1">
                <span className="text-[var(--text-secondary)]">{b.browser}</span>
                <span className="text-[var(--text-primary)]">{b.count} ({b.pct}%)</span>
              </div>
            ))}
          </div>
        )}
        {data.os_breakdown?.length > 0 && (
          <div className="rounded-xl p-4">
            <div className="text-sm font-medium text-[var(--text-primary)] mb-3">Operating Systems</div>
            {data.os_breakdown.map((o, i) => (
              <div key={i} className="flex justify-between text-sm py-1">
                <span className="text-[var(--text-secondary)]">{o.os}</span>
                <span className="text-[var(--text-primary)]">{o.count} ({o.pct}%)</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   AGENT SYSTEM TABS — Uses real-time observability heartbeat data
   ========================================================================== */

const LEVEL_STYLES = {
  error: 'bg-red-500/10 text-red-400 border-red-500/20',
  warn: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  debug: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

function errFp(entry) {
  return `${entry.timestamp}__${entry.source}__${(entry.message || '').slice(0, 60)}`;
}

const SOURCE_COLORS = ['#818CF8', '#34D399', '#FBBF24', '#F87171', '#2DD4BF', '#FB923C', '#E879F9', '#60A5FA'];

const STATUS_STYLES = {
  healthy: { bg: 'bg-green-500/10', border: 'border-green-500/20', dot: 'bg-green-400', text: 'text-green-400', label: 'HEALTHY' },
  unhealthy: { bg: 'bg-red-500/10', border: 'border-red-500/20', dot: 'bg-red-500', text: 'text-red-400', label: 'UNHEALTHY' },
  unknown: { bg: 'bg-gray-500/10', border: 'border-gray-500/20', dot: 'bg-gray-400', text: 'text-gray-400', label: 'UNKNOWN' },
};

function AgentStatusTab({ health, logs = [], acknowledgedErrors, acknowledgeError, clearAcknowledged }) {
  const status = health?.status || 'unknown';
  const cfg = STATUS_STYLES[status] || STATUS_STYLES.unknown;
  const elapsed = health?.seconds_since_heartbeat;

  // Chart data
  const levelCounts = logs.reduce((acc, l) => {
    const lv = (l.level === 'warning' ? 'warn' : l.level) || 'info';
    acc[lv] = (acc[lv] || 0) + 1;
    return acc;
  }, {});
  const levelChartData = [
    { name: 'Error', value: levelCounts.error || 0, color: '#F87171' },
    { name: 'Warning', value: levelCounts.warn || 0, color: '#FBBF24' },
    { name: 'Info', value: levelCounts.info || 0, color: '#60A5FA' },
    { name: 'Debug', value: levelCounts.debug || 0, color: '#71717A' },
  ].filter((d) => d.value > 0);

  const sourceCounts = logs.reduce((acc, l) => {
    const src = l.source || 'unknown';
    acc[src] = (acc[src] || 0) + 1;
    return acc;
  }, {});
  const sourceChartData = Object.entries(sourceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value], i) => ({ name, value, color: SOURCE_COLORS[i % SOURCE_COLORS.length] }));

  const now = Date.now();
  const hourBuckets = Array.from({ length: 24 }, (_, i) => {
    const slotMs = now - (23 - i) * 3600000;
    return { hour: new Date(slotMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }), Logs: 0 };
  });
  logs.forEach((l) => {
    const ageMs = now - new Date(l.timestamp).getTime();
    if (ageMs > 86400000) return;
    const idx = Math.min(23, Math.floor((86400000 - ageMs) / 3600000));
    hourBuckets[idx].Logs += 1;
  });

  // Acknowledged-aware error counts
  const warnCount = logs.filter((l) => l.level === 'warn' || l.level === 'warning').length;
  const totalErrors = logs.filter((l) => l.level === 'error').length;
  const unackedCount = logs.filter((l) => l.level === 'error' && !acknowledgedErrors.has(errFp(l))).length;
  const ackedCount = totalErrors - unackedCount;

  const tooltipStyle = { background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)', borderRadius: 8, fontSize: 11 };

  return (
    <div className="space-y-6">
      {/* Hero health card */}
      <div className={`${cfg.bg} border ${cfg.border} rounded-xl p-6`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-4 h-4 rounded-full ${cfg.dot} ${status === 'healthy' ? 'animate-pulse' : ''}`}
              style={{ boxShadow: status === 'healthy' ? '0 0 12px rgba(52, 211, 153, 0.6)' : status === 'unhealthy' ? '0 0 12px rgba(248, 113, 113, 0.6)' : 'none' }} />
            <div>
              <h2 className={`text-lg font-semibold ${cfg.text}`} style={{ fontFamily: 'var(--font-heading)' }}>
                Agent is {cfg.label}
              </h2>
              <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                {status === 'healthy' ? 'The agent is running and sending heartbeats normally.'
                  : status === 'unhealthy' ? 'The agent may be down or unresponsive. Check logs below.'
                    : 'No heartbeat data has been received yet.'}
              </p>
            </div>
          </div>
          <div className={`text-xs font-mono px-3 py-1.5 rounded-lg border ${cfg.border} ${cfg.bg} ${cfg.text}`}>
            {elapsed != null ? `Last ping: ${Math.round(elapsed)}s ago` : 'No pings received'}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[var(--bg-primary)]/30 rounded-lg p-3">
            <div className="text-[var(--text-tertiary)] text-[10px] uppercase tracking-wider mb-1">Machine ID</div>
            <div className="text-[var(--text-primary)] font-mono text-xs truncate" title={health?.machine_id || '--'}>
              {health?.machine_id || '--'}
            </div>
          </div>
          <div className="bg-[var(--bg-primary)]/30 rounded-lg p-3">
            <div className="text-[var(--text-tertiary)] text-[10px] uppercase tracking-wider mb-1">Last Heartbeat</div>
            <div className="text-[var(--text-primary)] text-xs">
              {health?.last_heartbeat ? timeAgo(health.last_heartbeat) : 'Never'}
            </div>
          </div>
          <div className="bg-[var(--bg-primary)]/30 rounded-lg p-3">
            <div className="text-[var(--text-tertiary)] text-[10px] uppercase tracking-wider mb-1">Time Since Ping</div>
            <div className={`text-xs font-mono ${elapsed != null && elapsed > 300 ? 'text-red-400 font-semibold' : 'text-[var(--text-primary)]'}`}>
              {elapsed != null ? `${Math.round(elapsed)}s` : '--'}
            </div>
          </div>
          <div className="bg-[var(--bg-primary)]/30 rounded-lg p-3">
            <div className="text-[var(--text-tertiary)] text-[10px] uppercase tracking-wider mb-1">Metadata</div>
            <div className="text-[var(--text-secondary)] text-xs font-mono truncate"
              title={health?.meta ? JSON.stringify(health.meta) : '--'}>
              {health?.meta && Object.keys(health.meta).length > 0
                ? Object.entries(health.meta).map(([k, v]) => `${k}: ${v}`).join(', ')
                : '--'}
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard label="Session Logs" value={fmtInt(logs.length)} sub="total entries" />
        <div className="rounded-xl p-5 hover:border-[var(--border-accent)] transition-colors">
          <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide mb-1" style={{ fontFamily: 'var(--font-ui)' }}>Errors</div>
          <div className={`text-2xl font-semibold ${unackedCount > 0 ? 'text-red-400' : 'text-[var(--text-primary)]'}`} style={{ fontFamily: 'var(--font-heading)' }}>
            {fmtInt(unackedCount)}
          </div>
          <div className="text-xs text-[var(--text-tertiary)] mt-1">
            {unackedCount > 0 ? 'needs attention' : ackedCount > 0 ? `${ackedCount} acknowledged` : 'all clear'}
          </div>
          {ackedCount > 0 && (
            <button onClick={clearAcknowledged} className="text-[10px] text-[var(--text-tertiary)] hover:text-red-400 underline mt-1 block transition-colors">
              Clear acknowledged
            </button>
          )}
        </div>
        <StatCard label="Warnings" value={fmtInt(warnCount)} sub="recent warnings" />
        <StatCard label="Debug" value={fmtInt(levelCounts.debug || 0)} sub="diagnostic entries" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl p-5">
          <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide mb-3">Log Level Breakdown</div>
          {levelChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={levelChartData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={2} dataKey="value">
                  {levelChartData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-sm text-[var(--text-tertiary)]">No logs yet</div>
          )}
        </div>
        <div className="rounded-xl p-5">
          <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide mb-3">Activity by Source</div>
          {sourceChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={sourceChartData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={2} dataKey="value">
                  {sourceChartData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-sm text-[var(--text-tertiary)]">No source data</div>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded-xl p-5">
        <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide mb-3">Log Activity — Last 24h</div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={hourBuckets} barGap={1}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="hour" tick={{ fill: '#71717A', fontSize: 9 }} axisLine={false} tickLine={false} interval={3} />
            <YAxis tick={{ fill: '#71717A', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} width={24} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="Logs" fill="var(--accent-primary)" radius={[2, 2, 0, 0]} opacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent activity */}
      <div className="rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[var(--border-secondary)]">
          <h3 className="text-sm font-medium text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
            Recent Agent Activity
          </h3>
        </div>
        <div className="divide-y divide-[var(--border-secondary)]/40">
          {logs.slice(0, 12).length > 0 ? logs.slice(0, 12).map((entry, i) => {
            const lvl = LEVEL_STYLES[entry.level] || LEVEL_STYLES.info;
            const isError = entry.level === 'error';
            const isAcked = isError && acknowledgedErrors.has(errFp(entry));
            return (
              <div key={i} className={`px-5 py-3 hover:bg-[var(--bg-tertiary)]/20 transition-colors ${isAcked ? 'opacity-50' : ''}`}>
                <div className="flex items-start gap-3">
                  <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded border ${lvl} shrink-0 mt-0.5`}>
                    {entry.level}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-[var(--text-primary)] break-words">{entry.message}</div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-[var(--text-tertiary)]">{timeAgo(entry.timestamp)}</span>
                      {entry.source && <span className="text-[10px] text-[var(--text-tertiary)] font-mono">{entry.source}</span>}
                    </div>
                  </div>
                  {isError && (
                    isAcked
                      ? <span className="text-[10px] text-green-500/60 ml-auto shrink-0">✓ acked</span>
                      : <button
                        onClick={() => acknowledgeError(errFp(entry))}
                        className="text-[10px] text-[var(--text-tertiary)] hover:text-green-400 border border-[var(--border-secondary)] rounded px-1.5 py-0.5 ml-auto shrink-0 transition-colors"
                      >Dismiss</button>
                  )}
                </div>
              </div>
            );
          }) : (
            <div className="px-5 py-8 text-center text-sm text-[var(--text-tertiary)]">
              No agent activity recorded yet. Logs will appear when the agent sends heartbeats.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AgentActivityTab({ logs = [], onRefresh, acknowledgedErrors, acknowledgeError }) {
  const [levelFilter, setLevelFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = logs.filter((entry) => {
    if (levelFilter && entry.level !== levelFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (entry.message || '').toLowerCase().includes(q)
        || (entry.source || '').toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Filter controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <svg className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search logs..."
            className="flex-1 text-sm text-[var(--text-primary)] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[var(--accent-primary)]" />
        </div>
        <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}
          className="text-xs text-[var(--text-secondary)] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[var(--accent-primary)]">
          <option value="">All levels</option>
          <option value="error">Errors</option>
          <option value="warn">Warnings</option>
          <option value="info">Info</option>
          <option value="debug">Debug</option>
        </select>
        <button onClick={onRefresh}
          className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors p-1.5 rounded-md hover:bg-[var(--bg-tertiary)]"
          title="Refresh logs">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        <span className="text-[10px] text-[var(--text-tertiary)]">{filtered.length} entries</span>
      </div>

      {/* Log stream */}
      <div className="rounded-xl overflow-hidden">
        <div className="max-h-[calc(100vh-250px)] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-[var(--text-tertiary)]">
              {searchTerm || levelFilter ? 'No logs match the current filter.' : 'No session logs yet.'}
            </div>
          ) : (
            <div className="divide-y divide-[var(--border-secondary)]/40">
              {filtered.map((entry, i) => {
                const lvl = LEVEL_STYLES[entry.level] || LEVEL_STYLES.info;
                const isError = entry.level === 'error';
                const isAcked = isError && acknowledgedErrors.has(errFp(entry));
                return (
                  <div key={i} className={`px-5 py-3 hover:bg-[var(--bg-tertiary)]/20 transition-colors ${isAcked ? 'opacity-50' : ''}`}>
                    <div className="flex items-start gap-3">
                      <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded border ${lvl} shrink-0 mt-0.5`}>
                        {entry.level}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-[var(--text-primary)] break-words">{entry.message}</div>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className="text-[10px] text-[var(--text-tertiary)]">{timeAgo(entry.timestamp)}</span>
                          {entry.source && <span className="text-[10px] text-[var(--text-tertiary)] font-mono">{entry.source}</span>}
                          {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                            <span className="text-[10px] text-[var(--text-tertiary)] font-mono truncate max-w-xs"
                              title={JSON.stringify(entry.metadata)}>
                              {Object.entries(entry.metadata).map(([k, v]) => `${k}=${v}`).join(' ')}
                            </span>
                          )}
                        </div>
                      </div>
                      {isError && (
                        isAcked
                          ? <span className="text-[10px] text-green-500/60 shrink-0">✓ acked</span>
                          : <button
                            onClick={() => acknowledgeError(errFp(entry))}
                            className="text-[10px] text-[var(--text-tertiary)] hover:text-green-400 border border-[var(--border-secondary)] rounded px-1.5 py-0.5 shrink-0 transition-colors"
                          >Dismiss</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AgentAlertsTab({ alerts = [] }) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-[var(--text-tertiary)]">{alerts.length} alerts in history</p>

      {/* Alert history */}
      <div className="rounded-xl overflow-hidden">
        <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
          {alerts.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-[var(--text-tertiary)]">
              No alerts recorded yet. The agent sends alerts automatically when issues are detected.
            </div>
          ) : (
            <div className="divide-y divide-[var(--border-secondary)]/40">
              {alerts.map((alert, i) => (
                <div key={i} className="px-5 py-4 hover:bg-[var(--bg-tertiary)]/20 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-[var(--text-primary)]">{alert.alert_type}</span>
                    <span className="text-[10px] text-[var(--text-tertiary)]">{timeAgo(alert.timestamp)}</span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mb-2">{alert.details}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-[var(--text-tertiary)]">
                      Sent to: {alert.sent?.length || 0} | Failed: {alert.failed?.length || 0}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${alert.health_status?.status === 'healthy' ? 'bg-green-400/10 text-green-400'
                      : alert.health_status?.status === 'unhealthy' ? 'bg-red-400/10 text-red-400'
                        : 'bg-gray-400/10 text-gray-400'
                      }`}>
                      {alert.health_status?.status || 'unknown'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

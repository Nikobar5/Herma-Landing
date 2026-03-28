import React, { useState, useEffect, useCallback } from 'react';
import {
  getObservabilitySummary,
  getObservabilitySessionLogs,
  getObservabilityAlerts,
  postObservabilityAlert,
} from '../../services/hermaApi';

function timeAgo(dateStr) {
  if (!dateStr) return '--';
  const diff = Date.now() - new Date(dateStr).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const LEVEL_STYLES = {
  error: 'bg-red-500/10 text-red-400 border-red-500/20',
  warn: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  debug: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

const STATUS_CONFIG = {
  healthy: { color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-500/20', label: 'HEALTHY', dot: 'bg-green-400' },
  unhealthy: { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-500/20', label: 'UNHEALTHY', dot: 'bg-red-400' },
  unknown: { color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-500/20', label: 'UNKNOWN', dot: 'bg-gray-400' },
};

function HealthCard({ health }) {
  const status = health?.status || 'unknown';
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.unknown;
  const elapsed = health?.seconds_since_heartbeat;

  return (
    <div className={`${cfg.bg} border ${cfg.border} rounded-xl p-5`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
          Machine Health
        </h3>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot} ${status === 'healthy' ? 'animate-pulse' : ''}`} />
          <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <div className="text-[var(--text-tertiary)] text-xs">Machine ID</div>
          <div className="text-[var(--text-primary)] font-mono text-xs mt-0.5">
            {health?.machine_id || '--'}
          </div>
        </div>
        <div>
          <div className="text-[var(--text-tertiary)] text-xs">Last Heartbeat</div>
          <div className="text-[var(--text-primary)] text-xs mt-0.5">
            {health?.last_heartbeat ? timeAgo(health.last_heartbeat) : 'Never'}
          </div>
        </div>
        <div>
          <div className="text-[var(--text-tertiary)] text-xs">Time Since Ping</div>
          <div className={`text-xs mt-0.5 ${elapsed != null && elapsed > 300 ? 'text-red-400' : 'text-[var(--text-primary)]'}`}>
            {elapsed != null ? `${Math.round(elapsed)}s` : '--'}
          </div>
        </div>
        <div>
          <div className="text-[var(--text-tertiary)] text-xs">Meta</div>
          <div className="text-[var(--text-secondary)] text-xs mt-0.5 font-mono truncate" title={JSON.stringify(health?.meta)}>
            {health?.meta && Object.keys(health.meta).length > 0
              ? Object.entries(health.meta).map(([k, v]) => `${k}: ${v}`).join(', ')
              : '--'}
          </div>
        </div>
      </div>
    </div>
  );
}

function LogsPanel({ logs, levelFilter, onFilterChange, onRefresh }) {
  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-[var(--border-secondary)] flex items-center justify-between">
        <h3 className="text-sm font-medium text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
          Session Logs
        </h3>
        <div className="flex items-center gap-2">
          <select
            value={levelFilter}
            onChange={(e) => onFilterChange(e.target.value)}
            className="text-xs bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] text-[var(--text-secondary)] rounded-lg px-2 py-1 focus:outline-none focus:border-[var(--accent-primary)]"
          >
            <option value="">All levels</option>
            <option value="error">Errors</option>
            <option value="warn">Warnings</option>
            <option value="info">Info</option>
            <option value="debug">Debug</option>
          </select>
          <button
            onClick={onRefresh}
            className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
            title="Refresh logs"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
      <div className="max-h-[500px] overflow-y-auto">
        {logs.length === 0 ? (
          <div className="px-5 py-12 text-center text-[var(--text-tertiary)] text-sm">
            No session logs yet. Logs will appear when Claude Code sessions report activity.
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-secondary)]/40">
            {logs.map((entry, i) => {
              const levelStyle = LEVEL_STYLES[entry.level] || LEVEL_STYLES.info;
              return (
                <div key={i} className="px-5 py-3 hover:bg-[var(--bg-tertiary)]/20 transition-colors">
                  <div className="flex items-start gap-3">
                    <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded border ${levelStyle} shrink-0 mt-0.5`}>
                      {entry.level}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-[var(--text-primary)] break-words">{entry.message}</div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-[var(--text-tertiary)]">{timeAgo(entry.timestamp)}</span>
                        <span className="text-[10px] text-[var(--text-tertiary)] font-mono">{entry.source}</span>
                        {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                          <span className="text-[10px] text-[var(--text-tertiary)] font-mono truncate" title={JSON.stringify(entry.metadata)}>
                            {Object.entries(entry.metadata).map(([k, v]) => `${k}=${v}`).join(' ')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function AlertsPanel({ alerts, onSendAlert }) {
  const [showForm, setShowForm] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertDetails, setAlertDetails] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!alertType.trim()) return;
    setSending(true);
    try {
      await onSendAlert({ alert_type: alertType, details: alertDetails });
      setAlertType('');
      setAlertDetails('');
      setShowForm(false);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-[var(--border-secondary)] flex items-center justify-between">
        <h3 className="text-sm font-medium text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
          Alert History
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-xs px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
        >
          {showForm ? 'Cancel' : 'Send Alert'}
        </button>
      </div>

      {showForm && (
        <div className="px-5 py-4 border-b border-[var(--border-secondary)] bg-[var(--bg-tertiary)]/30">
          <div className="space-y-3">
            <div>
              <label className="text-xs text-[var(--text-tertiary)] block mb-1">Alert Type</label>
              <input
                type="text"
                value={alertType}
                onChange={(e) => setAlertType(e.target.value)}
                placeholder="e.g., API Down, Machine Death, Compaction"
                className="w-full text-sm bg-[var(--bg-primary)] border border-[var(--border-secondary)] text-[var(--text-primary)] rounded-lg px-3 py-2 focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--text-tertiary)] block mb-1">Details</label>
              <textarea
                value={alertDetails}
                onChange={(e) => setAlertDetails(e.target.value)}
                placeholder="Describe what happened..."
                rows={3}
                className="w-full text-sm bg-[var(--bg-primary)] border border-[var(--border-secondary)] text-[var(--text-primary)] rounded-lg px-3 py-2 focus:outline-none focus:border-[var(--accent-primary)] resize-none"
              />
            </div>
            <button
              onClick={handleSend}
              disabled={sending || !alertType.trim()}
              className="text-xs px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
            >
              {sending ? 'Sending...' : 'Send Alert Email'}
            </button>
          </div>
        </div>
      )}

      <div className="max-h-[400px] overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="px-5 py-12 text-center text-[var(--text-tertiary)] text-sm">
            No alerts sent yet.
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-secondary)]/40">
            {alerts.map((alert, i) => (
              <div key={i} className="px-5 py-3 hover:bg-[var(--bg-tertiary)]/20 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-[var(--text-primary)]">{alert.alert_type}</span>
                  <span className="text-[10px] text-[var(--text-tertiary)]">{timeAgo(alert.timestamp)}</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mb-1.5">{alert.details}</p>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-[var(--text-tertiary)]">
                    Sent to: {alert.sent?.length || 0} | Failed: {alert.failed?.length || 0}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    alert.health_status?.status === 'healthy'
                      ? 'bg-green-400/10 text-green-400'
                      : alert.health_status?.status === 'unhealthy'
                        ? 'bg-red-400/10 text-red-400'
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
  );
}

export default function ObservabilityTab() {
  const [health, setHealth] = useState(null);
  const [logs, setLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [levelFilter, setLevelFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [summary, logData, alertData] = await Promise.all([
        getObservabilitySummary().catch(() => null),
        getObservabilitySessionLogs(200, levelFilter || null).catch(() => []),
        getObservabilityAlerts(50).catch(() => []),
      ]);

      if (summary) {
        setHealth(summary.health);
        // Use full log fetch, not summary's limited 20
      }
      setLogs(logData || []);
      setAlerts(alertData || []);
    } finally {
      setLoading(false);
    }
  }, [levelFilter]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, [loadData]);

  const handleFilterChange = (val) => {
    setLevelFilter(val);
  };

  const handleSendAlert = async (alertData) => {
    await postObservabilityAlert(alertData);
    await loadData();
  };

  if (loading && !health) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-[var(--text-tertiary)] text-sm">Loading observability data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Health status card */}
      <HealthCard health={health} />

      {/* Quick stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl p-4 text-center">
          <div className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
            {logs.length}
          </div>
          <div className="text-xs text-[var(--text-tertiary)] mt-1">Session Logs</div>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl p-4 text-center">
          <div className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
            {logs.filter((l) => l.level === 'error').length}
          </div>
          <div className="text-xs text-red-400 mt-1">Errors</div>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl p-4 text-center">
          <div className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
            {alerts.length}
          </div>
          <div className="text-xs text-[var(--text-tertiary)] mt-1">Alerts Sent</div>
        </div>
      </div>

      {/* Logs and Alerts side by side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LogsPanel
          logs={logs}
          levelFilter={levelFilter}
          onFilterChange={handleFilterChange}
          onRefresh={loadData}
        />
        <AlertsPanel alerts={alerts} onSendAlert={handleSendAlert} />
      </div>
    </div>
  );
}

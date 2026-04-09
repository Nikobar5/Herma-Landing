import React, { useState, useEffect, useCallback } from 'react';
import { getApiContentLog, getApiContentDetail } from '../../services/hermaApi';

const PAGE_SIZE = 50;

function fmt(n, decimals = 2) {
  if (n == null) return '—';
  return Number(n).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function fmtUsd(n) {
  if (n == null) return '—';
  return '$' + fmt(n);
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

function truncate(str, len = 100) {
  if (!str) return '—';
  return str.length > len ? str.slice(0, len) + '…' : str;
}

function RoleBadge({ role }) {
  const colors = {
    user: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    assistant: 'bg-green-500/10 text-green-400 border-green-500/20',
    system: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    tool: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  };
  const cls = colors[role] || 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] border-[var(--border-secondary)]';
  return (
    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium border uppercase tracking-wider ${cls}`}>
      {role}
    </span>
  );
}

function MessageBlock({ msg }) {
  const content = typeof msg.content === 'string'
    ? msg.content
    : JSON.stringify(msg.content, null, 2);
  return (
    <div className="mb-3">
      <div className="mb-1">
        <RoleBadge role={msg.role} />
      </div>
      <pre className="text-xs text-[var(--text-secondary)] bg-[var(--bg-primary)] rounded-lg p-3 whitespace-pre-wrap break-words font-mono leading-relaxed border border-[var(--border-secondary)]/50">
        {content}
      </pre>
    </div>
  );
}

function ExpandedRow({ requestId, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!requestId) return;
    setLoading(true);
    setError(null);
    getApiContentDetail(requestId)
      .then((d) => { setDetail(d); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [requestId]);

  return (
    <tr>
      <td colSpan={7} className="px-0 py-0">
        <div className="border-t border-b border-[var(--border-secondary)] bg-[var(--bg-secondary)]/40 px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs font-medium text-[var(--text-primary)] uppercase tracking-wider" style={{ fontFamily: 'var(--font-ui)' }}>
              Request Detail
            </div>
            <button onClick={onClose} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {loading && (
            <div className="text-xs text-[var(--text-tertiary)] py-4 text-center">Loading…</div>
          )}
          {error && (
            <div className="text-xs text-[var(--error)] py-4 text-center">Failed to load: {error}</div>
          )}
          {detail && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: messages */}
              <div>
                <div className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider mb-3" style={{ fontFamily: 'var(--font-ui)' }}>
                  Messages ({(detail.messages || []).length})
                </div>
                <div className="max-h-96 overflow-y-auto pr-1">
                  {(detail.messages || []).map((msg, i) => (
                    <MessageBlock key={i} msg={msg} />
                  ))}
                </div>
              </div>

              {/* Right: response + metadata */}
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider mb-2" style={{ fontFamily: 'var(--font-ui)' }}>
                    Response
                  </div>
                  <pre className="text-xs text-[var(--text-secondary)] bg-[var(--bg-primary)] rounded-lg p-3 whitespace-pre-wrap break-words font-mono leading-relaxed border border-[var(--border-secondary)]/50 max-h-48 overflow-y-auto">
                    {detail.response_content || '—'}
                  </pre>
                </div>

                <div>
                  <div className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider mb-2" style={{ fontFamily: 'var(--font-ui)' }}>
                    Metadata
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    {[
                      ['Model', detail.model],
                      ['Input Tokens', fmtInt(detail.prompt_tokens)],
                      ['Output Tokens', fmtInt(detail.completion_tokens)],
                      ['Total Tokens', fmtInt(detail.total_tokens)],
                      ['Cost', fmtUsd(detail.cost)],
                      ['Latency', detail.latency_ms != null ? `${fmtInt(detail.latency_ms)}ms` : '—'],
                      ['Request ID', detail.request_id],
                      ['Created', detail.created_at ? new Date(detail.created_at).toLocaleString() : '—'],
                    ].map(([key, val]) => (
                      <div key={key}>
                        <div className="text-[var(--text-tertiary)]">{key}</div>
                        <div className="text-[var(--text-primary)] font-mono break-all">{val || '—'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function ApiContentTab() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [customerFilter, setCustomerFilter] = useState('');
  const [debouncedFilter, setDebouncedFilter] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  // Debounce customer filter
  useEffect(() => {
    const t = setTimeout(() => setDebouncedFilter(customerFilter), 350);
    return () => clearTimeout(t);
  }, [customerFilter]);

  const load = useCallback((newOffset = 0, filter = debouncedFilter) => {
    setLoading(true);
    setError(null);
    getApiContentLog(PAGE_SIZE, newOffset, filter || null)
      .then((data) => {
        const items = Array.isArray(data) ? data : data?.items || [];
        if (newOffset === 0) {
          setRows(items);
        } else {
          setRows((prev) => [...prev, ...items]);
        }
        setHasMore(items.length === PAGE_SIZE);
        setOffset(newOffset + items.length);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [debouncedFilter]);

  // Reload when filter changes
  useEffect(() => {
    setOffset(0);
    setExpandedId(null);
    load(0, debouncedFilter);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilter]);

  const handleRowClick = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const lastUserMessage = (messages) => {
    if (!Array.isArray(messages)) return null;
    const userMsgs = messages.filter((m) => m.role === 'user');
    const last = userMsgs[userMsgs.length - 1];
    if (!last) return null;
    return typeof last.content === 'string' ? last.content : JSON.stringify(last.content);
  };

  return (
    <div className="space-y-4">
      {/* Header + filter bar */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
            API Requests
          </h2>
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
            Browse and inspect individual API requests. Click a row to expand.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
              placeholder="Filter by customer email…"
              className="w-64 text-xs bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-lg pl-9 pr-3 py-1.5 text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-primary)]/50"
            />
          </div>
          <button
            onClick={() => load(0)}
            disabled={loading}
            className="p-1.5 rounded-md text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors disabled:opacity-40"
            title="Refresh"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl p-4 text-xs text-[var(--error)] bg-red-500/5 border border-red-500/20">
          Failed to load API content log: {error}
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--text-tertiary)] text-xs border-b border-[var(--border-secondary)]">
                <th className="text-left px-4 py-2 font-medium">Time</th>
                <th className="text-left px-4 py-2 font-medium">Customer</th>
                <th className="text-left px-4 py-2 font-medium">Query Preview</th>
                <th className="text-left px-4 py-2 font-medium">Response Preview</th>
                <th className="text-left px-4 py-2 font-medium">Model</th>
                <th className="text-right px-4 py-2 font-medium">Tokens</th>
                <th className="text-right px-4 py-2 font-medium">Cost</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && !loading && !error && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-xs text-[var(--text-tertiary)]">
                    {debouncedFilter ? `No requests found for "${debouncedFilter}"` : 'No API request logs yet'}
                  </td>
                </tr>
              )}
              {rows.map((row) => {
                const queryText = lastUserMessage(row.messages);
                const isExpanded = expandedId === row.id;
                return (
                  <React.Fragment key={row.id}>
                    <tr
                      className={`border-b border-[var(--border-secondary)]/50 cursor-pointer transition-colors ${isExpanded ? 'bg-[var(--bg-secondary)]/50' : 'hover:bg-[var(--bg-tertiary)]/30'}`}
                      onClick={() => handleRowClick(row.id)}
                    >
                      <td className="px-4 py-2 text-xs text-[var(--text-tertiary)] whitespace-nowrap">
                        {timeAgo(row.created_at)}
                      </td>
                      <td className="px-4 py-2 text-xs text-[var(--text-secondary)] max-w-[140px] truncate">
                        {row.customer_email || row.customer_id || '—'}
                      </td>
                      <td className="px-4 py-2 text-xs text-[var(--text-secondary)] max-w-[200px]">
                        <span className="truncate block" title={queryText || ''}>
                          {truncate(queryText, 100)}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-xs text-[var(--text-secondary)] max-w-[200px]">
                        <span className="truncate block" title={row.response_content || ''}>
                          {truncate(row.response_content, 100)}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-xs">
                        <span className="font-mono text-[var(--text-tertiary)] text-[10px]">
                          {row.model ? row.model.split('/').pop() : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-xs text-right text-[var(--text-secondary)]">
                        {fmtInt(row.total_tokens)}
                      </td>
                      <td className="px-4 py-2 text-xs text-right text-[var(--text-secondary)]">
                        {fmtUsd(row.cost)}
                      </td>
                    </tr>
                    {isExpanded && (
                      <ExpandedRow
                        requestId={row.id}
                        onClose={() => setExpandedId(null)}
                      />
                    )}
                  </React.Fragment>
                );
              })}
              {loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-xs text-[var(--text-tertiary)]">
                    Loading…
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Load more */}
        {hasMore && !loading && rows.length > 0 && (
          <div className="px-4 py-3 border-t border-[var(--border-secondary)] flex items-center justify-between text-xs text-[var(--text-tertiary)]">
            <span>{rows.length} loaded</span>
            <button
              onClick={() => load(offset)}
              className="px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] border border-[var(--border-secondary)] text-[var(--text-primary)] transition-colors"
            >
              Load more
            </button>
          </div>
        )}
        {!hasMore && rows.length > 0 && (
          <div className="px-4 py-2 border-t border-[var(--border-secondary)] text-xs text-[var(--text-tertiary)] text-center">
            {rows.length} total
          </div>
        )}
      </div>
    </div>
  );
}

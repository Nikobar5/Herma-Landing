import React, { useState, useEffect, useCallback } from 'react';
import { getUsageLogs } from '../../services/hermaApi';

const PAGE_SIZE = 25;

const Usage = () => {
  const [logs, setLogs] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLogs = useCallback(async (newOffset) => {
    setLoading(true);
    setError('');
    try {
      const data = await getUsageLogs({ limit: PAGE_SIZE, offset: newOffset });
      setLogs(data);
      setOffset(newOffset);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs(0);
  }, [fetchLogs]);

  const handlePrev = () => {
    if (offset > 0) fetchLogs(Math.max(0, offset - PAGE_SIZE));
  };

  const handleNext = () => {
    if (logs.length === PAGE_SIZE) fetchLogs(offset + PAGE_SIZE);
  };

  return (
    <div>
      <h1
        className="text-2xl font-bold text-[var(--text-primary)] mb-6"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Usage Logs
      </h1>

      {error && (
        <div
          className="mb-4 p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 text-sm text-[var(--error)]"
          style={{ borderRadius: 'var(--radius-sm)' }}
        >
          {error}
        </div>
      )}

      <div
        className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] overflow-hidden"
        style={{ borderRadius: 'var(--radius-md)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ fontFamily: 'var(--font-ui)' }}>
            <thead>
              <tr className="bg-[var(--bg-tertiary)] border-b border-[var(--border-primary)]">
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Time</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Model</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Input</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Output</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Cost</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Latency</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[var(--text-tertiary)]">
                    Loading...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[var(--text-tertiary)]">
                    No usage logs yet
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-[var(--border-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    <td className="px-4 py-3 text-[var(--text-secondary)] whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td
                      className="px-4 py-3 text-[var(--text-primary)]"
                      style={{ fontFamily: 'var(--font-code)' }}
                    >
                      {log.model_requested}
                    </td>
                    <td className="px-4 py-3 text-right text-[var(--text-secondary)]">
                      {log.prompt_tokens.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-[var(--text-secondary)]">
                      {log.completion_tokens.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-[var(--text-primary)]">
                      ${parseFloat(log.herma_total_cost).toFixed(6)}
                    </td>
                    <td className="px-4 py-3 text-right text-[var(--text-secondary)]">
                      {log.latency_ms != null ? `${log.latency_ms}ms` : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border-primary)]">
          <button
            onClick={handlePrev}
            disabled={offset === 0 || loading}
            className="px-3 py-1.5 text-sm font-medium text-[var(--text-primary)] border border-[var(--border-secondary)] disabled:opacity-30 hover:bg-[var(--bg-hover)] transition-colors"
            style={{ borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-ui)' }}
          >
            Previous
          </button>
          <span
            className="text-xs text-[var(--text-tertiary)]"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Showing {offset + 1}–{offset + logs.length}
          </span>
          <button
            onClick={handleNext}
            disabled={logs.length < PAGE_SIZE || loading}
            className="px-3 py-1.5 text-sm font-medium text-[var(--text-primary)] border border-[var(--border-secondary)] disabled:opacity-30 hover:bg-[var(--bg-hover)] transition-colors"
            style={{ borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-ui)' }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Usage;

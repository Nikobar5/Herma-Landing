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
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1
          className="text-3xl font-bold text-[var(--text-primary)] mb-2"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Usage Logs
        </h1>
        <p className="text-[var(--text-secondary)] text-lg" style={{ fontFamily: 'var(--font-body)' }}>
          Detailed breakdown of your API requests and costs.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-[var(--error)]/5 border border-[var(--error)]/20 rounded-lg text-sm text-[var(--error)]">
          {error}
        </div>
      )}

      <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-[var(--border-primary)] bg-[var(--bg-tertiary)]/50">
                <th className="px-6 py-4 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-4 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Model</th>
                <th className="px-6 py-4 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider text-right">Tokens (In/Out)</th>
                <th className="px-6 py-4 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider text-right">Cost</th>
                <th className="px-6 py-4 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider text-right">Latency</th>
                <th className="px-6 py-4 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-primary)]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[var(--text-tertiary)]">
                    <div className="flex justify-center items-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-[var(--text-tertiary)] border-t-transparent animate-spin" />
                      Loading logs...
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[var(--text-tertiary)] italic">
                    No logs found for this period.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-[var(--bg-hover)] transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-[var(--text-secondary)] font-medium">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-primary)] font-mono">
                        {log.model_requested}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-[var(--text-secondary)]">
                      <span className="text-[var(--text-tertiary)]">P:</span>{log.prompt_tokens} <span className="text-[var(--text-tertiary)] mx-1">/</span> <span className="text-[var(--text-tertiary)]">C:</span>{log.completion_tokens}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-[var(--text-primary)] font-medium">
                      ${parseFloat(log.herma_total_cost).toFixed(5)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-[var(--text-secondary)]">
                      {log.latency_ms}ms
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex w-2.5 h-2.5 rounded-full ${log.status === 'success' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]' : 'bg-red-400'}`} title={log.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Cleaner Pagination */}
        <div className="flex items-center justify-between px-6 py-4 bg-[var(--bg-tertiary)]/30 border-t border-[var(--border-primary)]">
          <button
            onClick={handlePrev}
            disabled={offset === 0 || loading}
            className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:hover:text-[var(--text-secondary)] transition-colors"
          >
            ← Previous
          </button>
          <span className="text-xs font-mono text-[var(--text-tertiary)]">
            Page {Math.floor(offset / PAGE_SIZE) + 1}
          </span>
          <button
            onClick={handleNext}
            disabled={logs.length < PAGE_SIZE || loading}
            className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:hover:text-[var(--text-secondary)] transition-colors"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Usage;

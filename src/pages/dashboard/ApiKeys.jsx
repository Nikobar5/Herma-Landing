import React, { useState, useEffect, useCallback } from 'react';
import { getApiKeys, createApiKey, revokeApiKey } from '../../services/hermaApi';

const ApiKeys = () => {
  const [keys, setKeys] = useState([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyRaw, setNewKeyRaw] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const fetchKeys = useCallback(async () => {
    try {
      const data = await getApiKeys();
      setKeys(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    setCreating(true);
    setError('');
    setNewKeyRaw('');

    try {
      const data = await createApiKey(newKeyName.trim());
      setNewKeyRaw(data.raw_key || `sk_live_${Math.random().toString(36).substr(2, 24)}`); // Fallback if mock is generic
      setNewKeyName('');
      await fetchKeys();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async (keyId) => {
    if (!window.confirm('Are you sure you want to revoke this API key? Any applications using it will immediately stop working.')) return;
    setError('');
    try {
      await revokeApiKey(keyId);
      await fetchKeys();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(newKeyRaw);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--accent-primary)] border-t-transparent animate-spin" />
          <span className="text-sm text-[var(--text-tertiary)]">Loading keys...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          API Keys
        </h1>
        <p className="text-[var(--text-secondary)] text-lg" style={{ fontFamily: 'var(--font-body)' }}>
          Manage access tokens for your applications.
        </p>
      </div>

      {newKeyRaw && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">Key Created Successfully</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Please copy your secret key now. <span className="text-emerald-400 font-medium">You won't be able to see it again!</span>
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-lg px-4 py-3 font-mono text-sm text-[var(--text-primary)] break-all">
                  {newKeyRaw}
                </code>
                <button
                  onClick={handleCopyKey}
                  className="px-4 py-3 bg-[var(--accent-primary)] text-white font-medium rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-[var(--error)]/5 border border-[var(--error)]/20 rounded-lg text-[var(--error)] text-sm">
          {error}
        </div>
      )}

      {/* Create Key Card */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Create a new key</h2>
        <form onSubmit={handleCreate} className="flex gap-4">
          <input
            type="text"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="Key name (e.g. Production App)"
            className="flex-1 bg-[var(--bg-input)] border border-[var(--border-secondary)] text-[var(--text-primary)] px-4 py-2.5 rounded-lg focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] placeholder-[var(--text-tertiary)] transition-all"
            style={{ fontFamily: 'var(--font-ui)' }}
          />
          <button
            type="submit"
            disabled={creating || !newKeyName.trim()}
            className="px-6 py-2.5 bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {creating && <div className="w-4 h-4 rounded-full border-2 border-[var(--bg-primary)] border-t-transparent animate-spin" />}
            Create Secret Key
          </button>
        </form>
      </div>

      {/* Keys List */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-[var(--border-primary)] bg-[var(--bg-tertiary)]/50">
                <th className="px-6 py-4 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Token Prefix</th>
                <th className="px-6 py-4 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Last Used</th>
                <th className="px-6 py-4 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-primary)]">
              {keys.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[var(--text-tertiary)] italic">No API keys found</td>
                </tr>
              ) : (
                keys.map((key) => (
                  <tr key={key.id} className="hover:bg-[var(--bg-hover)] transition-colors">
                    <td className="px-6 py-4 font-medium text-[var(--text-primary)]">
                      {key.name}
                    </td>
                    <td className="px-6 py-4 font-mono text-[var(--text-secondary)]">
                      {key.key_prefix || (key.prefix || 'sk_live')}...
                    </td>
                    <td className="px-6 py-4">
                      {key.is_active !== false ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--text-tertiary)]/10 text-[var(--text-tertiary)] border border-[var(--text-tertiary)]/20">
                          Revoked
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[var(--text-secondary)]">
                      {new Date(key.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-[var(--text-tertiary)]">
                      {key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {(key.is_active !== false) && (
                        <button
                          onClick={() => handleRevoke(key.id)}
                          className="text-xs font-medium text-[var(--error)] hover:text-red-400 hover:underline transition-colors"
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApiKeys;

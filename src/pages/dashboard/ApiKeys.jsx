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
      setNewKeyRaw(data.raw_key);
      setNewKeyName('');
      await fetchKeys();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async (keyId) => {
    if (!window.confirm('Revoke this API key? This cannot be undone.')) return;
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

  return (
    <div>
      <h1
        className="text-2xl font-bold text-[var(--text-primary)] mb-6"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        API Keys
      </h1>

      {/* Create new key */}
      <div
        className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-6 mb-6"
        style={{ borderRadius: 'var(--radius-md)' }}
      >
        <h2
          className="text-sm font-medium text-[var(--text-primary)] mb-3"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          Create a new API key
        </h2>
        <form onSubmit={handleCreate} className="flex gap-3">
          <input
            type="text"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="Key name (e.g. production)"
            className="flex-1 px-3 py-2 text-sm border border-[var(--border-secondary)] bg-[var(--bg-input)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/30 focus:border-[var(--accent-primary)]"
            style={{ borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-ui)' }}
          />
          <button
            type="submit"
            disabled={creating || !newKeyName.trim()}
            className="px-4 py-2 text-sm font-medium text-[var(--text-inverse)] bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors"
            style={{ borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-ui)' }}
          >
            {creating ? 'Creating...' : 'Create Key'}
          </button>
        </form>
      </div>

      {/* New key display */}
      {newKeyRaw && (
        <div
          className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30"
          style={{ borderRadius: 'var(--radius-sm)' }}
        >
          <p
            className="text-sm font-medium text-emerald-400 mb-2"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Your new API key (copy it now — it won't be shown again):
          </p>
          <div className="flex items-center gap-2">
            <code
              className="flex-1 px-3 py-2 bg-[var(--bg-tertiary)] text-sm text-[var(--text-primary)] border border-emerald-500/30 break-all"
              style={{ borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-code)' }}
            >
              {newKeyRaw}
            </code>
            <button
              onClick={handleCopyKey}
              className="px-3 py-2 text-sm font-medium text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 transition-colors"
              style={{ borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-ui)' }}
            >
              Copy
            </button>
          </div>
        </div>
      )}

      {error && (
        <div
          className="mb-4 p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 text-sm text-[var(--error)]"
          style={{ borderRadius: 'var(--radius-sm)' }}
        >
          {error}
        </div>
      )}

      {/* Keys table */}
      <div
        className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] overflow-hidden"
        style={{ borderRadius: 'var(--radius-md)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ fontFamily: 'var(--font-ui)' }}>
            <thead>
              <tr className="bg-[var(--bg-tertiary)] border-b border-[var(--border-primary)]">
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Prefix</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Last Used</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Created</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[var(--text-tertiary)]">
                    Loading...
                  </td>
                </tr>
              ) : keys.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[var(--text-tertiary)]">
                    No API keys yet — create one above
                  </td>
                </tr>
              ) : (
                keys.map((key) => (
                  <tr
                    key={key.id}
                    className="border-b border-[var(--border-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    <td className="px-4 py-3 text-[var(--text-primary)]">
                      {key.name}
                    </td>
                    <td
                      className="px-4 py-3 text-[var(--text-secondary)]"
                      style={{ fontFamily: 'var(--font-code)' }}
                    >
                      {key.key_prefix}...
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 text-xs font-medium ${
                          key.is_active
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-[var(--error)]/10 text-[var(--error)] border border-[var(--error)]/30'
                        }`}
                        style={{ borderRadius: '9999px' }}
                      >
                        {key.is_active ? 'Active' : 'Revoked'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-tertiary)] text-sm">
                      {key.last_used_at
                        ? new Date(key.last_used_at).toLocaleDateString()
                        : 'Never'}
                    </td>
                    <td className="px-4 py-3 text-[var(--text-tertiary)] text-sm">
                      {new Date(key.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {key.is_active && (
                        <button
                          onClick={() => handleRevoke(key.id)}
                          className="text-sm text-[var(--error)] hover:text-[var(--error)]/80 transition-colors"
                          style={{ fontFamily: 'var(--font-ui)' }}
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

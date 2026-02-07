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
        className="text-2xl font-bold text-[var(--highlight-color)] mb-6"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        API Keys
      </h1>

      {/* Create new key */}
      <div
        className="bg-white/90 backdrop-blur-sm border border-[var(--secondary-bg)]/20 p-6 mb-6"
        style={{ borderRadius: 'var(--radius-md)' }}
      >
        <h2
          className="text-sm font-medium text-[var(--highlight-color)] mb-3"
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
            className="flex-1 px-3 py-2 text-sm border border-[var(--secondary-bg)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--highlight-color)]/30 focus:border-[var(--highlight-color)]"
            style={{ borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-ui)' }}
          />
          <button
            type="submit"
            disabled={creating || !newKeyName.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-[var(--highlight-color)] hover:opacity-90 disabled:opacity-50 transition-opacity"
            style={{ borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-ui)' }}
          >
            {creating ? 'Creating...' : 'Create Key'}
          </button>
        </form>
      </div>

      {/* New key display */}
      {newKeyRaw && (
        <div
          className="mb-6 p-4 bg-green-50 border border-green-200"
          style={{ borderRadius: 'var(--radius-sm)' }}
        >
          <p
            className="text-sm font-medium text-green-800 mb-2"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Your new API key (copy it now — it won't be shown again):
          </p>
          <div className="flex items-center gap-2">
            <code
              className="flex-1 px-3 py-2 bg-white text-sm border border-green-300 break-all"
              style={{ borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-code)' }}
            >
              {newKeyRaw}
            </code>
            <button
              onClick={handleCopyKey}
              className="px-3 py-2 text-sm font-medium text-green-700 border border-green-300 hover:bg-green-100 transition-colors"
              style={{ borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-ui)' }}
            >
              Copy
            </button>
          </div>
        </div>
      )}

      {error && (
        <div
          className="mb-4 p-4 bg-red-50 border border-red-200 text-sm text-red-700"
          style={{ borderRadius: 'var(--radius-sm)' }}
        >
          {error}
        </div>
      )}

      {/* Keys table */}
      <div
        className="bg-white/90 backdrop-blur-sm border border-[var(--secondary-bg)]/20 overflow-hidden"
        style={{ borderRadius: 'var(--radius-md)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ fontFamily: 'var(--font-ui)' }}>
            <thead>
              <tr className="bg-[var(--secondary-bg)]/10 border-b border-[var(--secondary-bg)]/20">
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--highlight-color)]/60 uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--highlight-color)]/60 uppercase tracking-wider">Prefix</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--highlight-color)]/60 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--highlight-color)]/60 uppercase tracking-wider">Last Used</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--highlight-color)]/60 uppercase tracking-wider">Created</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[var(--highlight-color)]/60 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[var(--highlight-color)]/60">
                    Loading...
                  </td>
                </tr>
              ) : keys.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[var(--highlight-color)]/60">
                    No API keys yet — create one above
                  </td>
                </tr>
              ) : (
                keys.map((key) => (
                  <tr
                    key={key.id}
                    className="border-b border-[var(--secondary-bg)]/10 hover:bg-[var(--secondary-bg)]/5 transition-colors"
                  >
                    <td className="px-4 py-3 text-[var(--highlight-color)]">
                      {key.name}
                    </td>
                    <td
                      className="px-4 py-3 text-[var(--highlight-color)]/80"
                      style={{ fontFamily: 'var(--font-code)' }}
                    >
                      {key.key_prefix}...
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 text-xs font-medium ${
                          key.is_active
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                        style={{ borderRadius: '9999px' }}
                      >
                        {key.is_active ? 'Active' : 'Revoked'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--highlight-color)]/60 text-sm">
                      {key.last_used_at
                        ? new Date(key.last_used_at).toLocaleDateString()
                        : 'Never'}
                    </td>
                    <td className="px-4 py-3 text-[var(--highlight-color)]/60 text-sm">
                      {new Date(key.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {key.is_active && (
                        <button
                          onClick={() => handleRevoke(key.id)}
                          className="text-sm text-red-600 hover:text-red-800 transition-colors"
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

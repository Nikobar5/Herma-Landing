const API_URL = process.env.REACT_APP_HERMA_API_URL || 'http://localhost:8000';

function getToken() {
  return localStorage.getItem('herma_token');
}

function clearAuth() {
  localStorage.removeItem('herma_token');
  localStorage.removeItem('herma_user');
}

async function authFetch(path, options = {}) {
  const token = getToken();
  if (!token) {
    clearAuth();
    window.location.hash = '#/login';
    throw new Error('Not authenticated');
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    clearAuth();
    window.location.hash = '#/login';
    throw new Error('Session expired');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(body.detail || `Request failed (${res.status})`);
  }

  if (res.status === 204) return null;

  return res.json();
}

// --- Auth (no token needed) ---

export async function signup({ name, email, password, company }) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, company: company || null }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(body.detail || `Signup failed (${res.status})`);
  }

  const data = await res.json();
  localStorage.setItem('herma_token', data.token);
  localStorage.setItem('herma_user', JSON.stringify({
    customer_id: data.customer_id,
    name: data.name,
    email: data.email,
    is_admin: data.is_admin || false,
  }));
  return data;
}

export async function login({ email, password }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(body.detail || `Login failed (${res.status})`);
  }

  const data = await res.json();
  localStorage.setItem('herma_token', data.token);
  localStorage.setItem('herma_user', JSON.stringify({
    customer_id: data.customer_id,
    name: data.name,
    email: data.email,
    is_admin: data.is_admin || false,
  }));
  return data;
}

// --- Portal endpoints (JWT auth) ---

export function getBalance() {
  return authFetch('/portal/balance');
}

export function getUsageSummary(startDate, endDate) {
  const params = new URLSearchParams();
  if (startDate) params.set('start_date', startDate);
  if (endDate) params.set('end_date', endDate);
  const qs = params.toString();
  return authFetch(`/portal/usage/summary${qs ? `?${qs}` : ''}`);
}

export function getUsageLogs({ limit = 25, offset = 0 } = {}) {
  return authFetch(`/portal/usage?limit=${limit}&offset=${offset}`);
}

export function getApiKeys() {
  return authFetch('/portal/keys');
}

export function createApiKey(name) {
  return authFetch('/portal/keys', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
}

export function revokeApiKey(keyId) {
  return authFetch(`/portal/keys/${keyId}`, {
    method: 'DELETE',
  });
}

export function getLedger({ limit = 50, offset = 0 } = {}) {
  return authFetch(`/portal/ledger?limit=${limit}&offset=${offset}`);
}

export function createCheckout(packageId) {
  return authFetch('/portal/checkout', {
    method: 'POST',
    body: JSON.stringify({ package: packageId }),
  });
}

// --- Subscriptions ---

export function createSubscriptionCheckout(plan) {
  return authFetch('/portal/subscribe', {
    method: 'POST',
    body: JSON.stringify({ plan }),
  });
}

export function getSubscriptionStatus() {
  return authFetch('/portal/subscription');
}

export function manageSubscription() {
  return authFetch('/portal/subscription/manage', {
    method: 'POST',
  });
}

export function getChatBalance() {
  return authFetch('/portal/chat-balance');
}

// --- Admin Analytics (JWT auth, requires is_admin) ---

export function getAdminOverview() {
  return authFetch('/admin/analytics/overview');
}

export function getAdminDaily(days = 30) {
  return authFetch(`/admin/analytics/daily?days=${days}`);
}

export function getAdminHourly(hours = 24) {
  return authFetch(`/admin/analytics/hourly?hours=${hours}`);
}

export function getAdminCustomers(limit = 50) {
  return authFetch(`/admin/analytics/customers?limit=${limit}`);
}

export function getAdminModels() {
  return authFetch('/admin/analytics/models');
}

export function getAdminRecent(limit = 50) {
  return authFetch(`/admin/analytics/recent?limit=${limit}`);
}

export function getAdminMemory() {
  return authFetch('/admin/analytics/memory');
}

export function getAdminRouting() {
  return authFetch('/admin/analytics/routing');
}

export function getAdminQuality() {
  return authFetch('/admin/analytics/quality');
}

export function getAdminAgents() {
  return authFetch('/admin/analytics/agents');
}

export function getAdminReports({ agent, severity, actionable_only, limit = 50, offset = 0 } = {}) {
  const params = new URLSearchParams();
  if (agent) params.set('agent', agent);
  if (severity) params.set('severity', severity);
  if (actionable_only) params.set('actionable_only', 'true');
  params.set('limit', limit);
  params.set('offset', offset);
  return authFetch(`/admin/analytics/reports?${params}`);
}

export function generateReportsNow() {
  return authFetch('/admin/analytics/reports/generate', { method: 'POST' });
}

export function getSchedulerStatus() {
  return authFetch('/admin/analytics/scheduler');
}

// --- Hierarchy / Trust / Permissions (Admin) ---

export function getAgentHierarchy() {
  return authFetch('/admin/analytics/hierarchy');
}

export function getAgentTrustScores() {
  return authFetch('/admin/analytics/trust');
}

export function getPendingPermissions() {
  return authFetch('/admin/analytics/permissions/pending');
}

export function approvePermission(requestId, notes = '') {
  return authFetch(`/admin/analytics/permissions/${requestId}/approve`, {
    method: 'POST',
    body: JSON.stringify({ notes }),
  });
}

export function denyPermission(requestId, notes = '') {
  return authFetch(`/admin/analytics/permissions/${requestId}/deny`, {
    method: 'POST',
    body: JSON.stringify({ notes }),
  });
}

export function getDecisionLog({ type, actor, limit = 50, offset = 0 } = {}) {
  const params = new URLSearchParams();
  if (type) params.set('type', type);
  if (actor) params.set('actor', actor);
  params.set('limit', limit);
  params.set('offset', offset);
  return authFetch(`/admin/analytics/decisions?${params}`);
}

export function getTrustPromotions() {
  return authFetch('/admin/analytics/trust/promotions');
}

// --- Portal Chat (streaming) ---

export async function streamChat(messages, { onChunk, onDone, onError, signal } = {}) {
  const token = getToken();
  if (!token) {
    clearAuth();
    window.location.hash = '#/login';
    throw new Error('Not authenticated');
  }

  const res = await fetch(`${API_URL}/portal/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ messages, stream: true }),
    signal,
  });

  if (res.status === 401) {
    clearAuth();
    window.location.hash = '#/login';
    throw new Error('Session expired');
  }
  if (res.status === 402) {
    throw new Error('Insufficient credits. Please add more credits to continue.');
  }
  if (res.status === 429) {
    throw new Error('Rate limit exceeded. Please wait a moment and try again.');
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(body.detail || `Request failed (${res.status})`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let lastUsage = null;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;
        const data = trimmed.slice(6);
        if (data === '[DONE]') {
          onDone?.(lastUsage);
          return;
        }
        try {
          const parsed = JSON.parse(data);
          if (parsed.usage) {
            lastUsage = parsed.usage;
          }
          // Extract annotations (web search citations) from the chunk
          const annotations = parsed.choices?.[0]?.delta?.annotations;
          if (annotations?.length) {
            onChunk?.({ type: 'annotations', annotations });
          }
          const delta = parsed.choices?.[0]?.delta;
          const reasoning = delta?.reasoning || delta?.reasoning_content;
          if (reasoning) {
            onChunk?.({ type: 'reasoning', content: reasoning });
          } else if (delta?.content) {
            onChunk?.({ type: 'content', content: delta.content });
          }
        } catch {
          // skip malformed JSON lines
        }
      }
    }
    onDone?.(lastUsage);
  } catch (err) {
    if (err.name === 'AbortError') return;
    onError?.(err);
    throw err;
  }
}

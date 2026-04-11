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
    window.location.href = '/login';
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
    window.location.href = '/login';
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
    email_verified: data.email_verified || false,
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
    email_verified: data.email_verified || false,
  }));
  return data;
}

export async function loginWithGoogle(credential) {
  const res = await fetch(`${API_URL}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(body.detail || `Google login failed (${res.status})`);
  }

  const data = await res.json();
  localStorage.setItem('herma_token', data.token);
  localStorage.setItem('herma_user', JSON.stringify({
    customer_id: data.customer_id,
    name: data.name,
    email: data.email,
    is_admin: data.is_admin || false,
    email_verified: data.email_verified || false,
  }));
  return data;
}

// --- Email verification ---

export async function verifyEmail(token) {
  const res = await fetch(`${API_URL}/auth/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(body.detail || `Verification failed (${res.status})`);
  }

  return res.json();
}

export function resendVerification() {
  return authFetch('/auth/resend-verification', { method: 'POST' });
}

// --- Password reset ---

export async function forgotPassword(email) {
  const res = await fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(body.detail || `Request failed (${res.status})`);
  }

  return res.json();
}

export async function resetPassword(token, password) {
  const res = await fetch(`${API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(body.detail || `Reset failed (${res.status})`);
  }

  return res.json();
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

export function getDailySavings(days = 30, frontierModel = 'anthropic/claude-opus-4.6') {
  return authFetch(`/portal/usage/daily-savings?days=${days}&frontier_model=${encodeURIComponent(frontierModel)}`);
}

export function getFrontierModels() {
  return authFetch('/portal/frontier-models');
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

export function createCheckout(amount) {
  return authFetch('/portal/checkout', {
    method: 'POST',
    body: JSON.stringify({ amount }),
  });
}

export function getPayments({ limit = 50, offset = 0 } = {}) {
  return authFetch(`/portal/payments?limit=${limit}&offset=${offset}`);
}

export function getRoutingQuality(days = 30) {
  return authFetch(`/portal/routing-quality?days=${days}`);
}

export function getAutoRechargeSettings() {
  return authFetch('/portal/auto-recharge');
}

export function updateAutoRechargeSettings({ enabled, threshold_usd, amount_usd }) {
  return authFetch('/portal/auto-recharge', {
    method: 'POST',
    body: JSON.stringify({ enabled, threshold_usd, amount_usd }),
  });
}

// --- Subscriptions ---

export function createSubscriptionCheckout(plan) {
  return authFetch('/portal/subscribe', {
    method: 'POST',
    body: JSON.stringify({ plan }),
  });
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

export function getAdminModels() {
  return authFetch('/admin/analytics/models');
}

export function getAdminRecent(limit = 50) {
  return authFetch(`/admin/analytics/recent?limit=${limit}`);
}


// --- Site Analytics (Admin) ---

export function getSiteAnalytics(days = 30) {
  return authFetch(`/admin/analytics/site-analytics?days=${days}`);
}

// --- Retention (Admin) ---

export function getRetentionOverview() {
  return authFetch('/admin/analytics/retention');
}

export function getAdminCustomerDetail(email) {
  return authFetch(`/admin/analytics/customers/lookup?email=${encodeURIComponent(email)}`);
}

// --- Latency (Admin) ---

export function getAdminLatency(days = 7) {
  return authFetch(`/admin/analytics/latency?days=${days}`);
}

// --- Funnel (Admin) ---

export function getAdminFunnel(days = 30) {
  return authFetch(`/admin/analytics/funnel?days=${days}`);
}

// --- Observability (Admin) ---

export function getObservabilitySummary() {
  return authFetch('/admin/analytics/observability/summary');
}

export function getObservabilitySessionLogs(limit = 100, level = null) {
  const params = new URLSearchParams({ limit });
  if (level) params.set('level', level);
  return authFetch(`/admin/analytics/observability/session-logs?${params}`);
}

export function getObservabilityAlerts(limit = 50) {
  return authFetch(`/admin/analytics/observability/alerts?limit=${limit}`);
}

// --- Routing Intelligence (Admin) ---

export function getDerivativeOverview(days = 7) {
  return authFetch(`/admin/analytics/request-derivatives?days=${days}`);
}

export function getDerivativesByCell(days = 7) {
  return authFetch(`/admin/analytics/request-derivatives/by-cell?days=${days}`);
}

export function getApiContentLog(limit = 50, offset = 0, customerId = null) {
  const params = new URLSearchParams({ limit, offset });
  if (customerId) params.set('customer_id', customerId);
  return authFetch(`/admin/analytics/api-content?${params}`);
}

export function getApiContentDetail(requestId) {
  return authFetch(`/admin/analytics/api-content/${requestId}`);
}

// --- Conversations (server-side storage) ---

export function createConversation(title = 'New chat') {
  return authFetch('/portal/conversations', {
    method: 'POST',
    body: JSON.stringify({ title }),
  });
}

export function getConversations(limit = 50, offset = 0) {
  return authFetch(`/portal/conversations?limit=${limit}&offset=${offset}`);
}

export function getConversation(id) {
  return authFetch(`/portal/conversations/${id}`);
}

export function updateConversationTitle(id, title) {
  return authFetch(`/portal/conversations/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ title }),
  });
}

export function deleteConversation(id) {
  return authFetch(`/portal/conversations/${id}`, {
    method: 'DELETE',
  });
}

// --- Portal Chat (streaming) ---

export async function streamDemoChat(messages, { onChunk, onDone, onError, onOpen, signal, model } = {}) {
  const body = { messages, stream: true };
  if (model) body.model = model;

  const res = await fetch(`${API_URL}/demo/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });

  if (res.status === 429) {
    throw new Error('Demo rate limit reached. Sign up for unlimited access!');
  }
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(errBody.detail || `Request failed (${res.status})`);
  }

  onOpen?.();

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
          if (parsed.error) {
            const err = new Error(parsed.error.message || 'An error occurred');
            err.type = parsed.error.type;
            throw err;
          }
          if (parsed.usage) lastUsage = parsed.usage;
          if (parsed.herma_routing) {
            onChunk?.({ type: 'routing', routing: parsed.herma_routing });
            continue;
          }
          const delta = parsed.choices?.[0]?.delta;
          const reasoning = delta?.reasoning || delta?.reasoning_content;
          if (reasoning) {
            onChunk?.({ type: 'reasoning', content: reasoning });
          } else if (delta?.content) {
            onChunk?.({ type: 'content', content: delta.content });
          }
        } catch (parseErr) {
          if (parseErr instanceof SyntaxError) continue;
          throw parseErr;
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

export async function streamChat(messages, { onChunk, onDone, onError, onOpen, signal, model, skipMemory, conversationId } = {}) {
  const token = getToken();
  if (!token) {
    clearAuth();
    window.location.href = '/login';
    throw new Error('Not authenticated');
  }

  const body = { messages, stream: true };
  if (model) body.model = model;

  const params = new URLSearchParams();
  if (skipMemory) params.set('skip_memory', 'true');
  if (conversationId) params.set('conversation_id', conversationId);
  const qs = params.toString();
  const chatUrl = qs
    ? `${API_URL}/portal/chat/completions?${qs}`
    : `${API_URL}/portal/chat/completions`;
  const res = await fetch(chatUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
    signal,
  });

  if (res.status === 401) {
    clearAuth();
    window.location.href = '/login';
    throw new Error('Session expired');
  }
  if (res.status === 402) {
    const err = new Error('Insufficient credits. Please add more credits to continue.');
    err.status = 402;
    throw err;
  }
  if (res.status === 403) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    const err = new Error(body.detail || 'Forbidden');
    err.status = 403;
    throw err;
  }
  if (res.status === 429) {
    throw new Error('Rate limit exceeded. Please wait a moment and try again.');
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(body.detail || `Request failed (${res.status})`);
  }

  // Signal that HTTP response was received (connection established)
  onOpen?.();

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
          // Handle SSE error events from backend
          if (parsed.error) {
            const errMsg = parsed.error.message || 'An error occurred';
            const err = new Error(errMsg);
            err.type = parsed.error.type;
            throw err;
          }
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
        } catch (parseErr) {
          if (parseErr instanceof SyntaxError) continue;
          throw parseErr;
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

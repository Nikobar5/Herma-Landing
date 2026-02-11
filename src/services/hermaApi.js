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

  // --- DEMO MODE INTERCEPTION ---
  if (token === 'DEMO_TOKEN') {
    await new Promise(resolve => setTimeout(resolve, 600)); // Fake latency

    // Normalizing path to handle query params if necessary (simple check for now)
    if (path === '/portal/balance') {
      return { balance_usd: 124.50, currency: 'USD' };
    }
    if (path === '/portal/chat-balance') {
      return { balance_usd: 124.50, chat_free_credit_usd: 5.00, has_subscription: true, plan: 'pro' };
    }
    if (path === '/portal/subscription') {
      return { status: 'active', plan: 'pro', current_period_end: new Date(Date.now() + 86400000 * 15).toISOString() };
    }
    if (path.startsWith('/portal/usage')) {
      // Mock usage summary or logs
      if (path.includes('summary')) {
        return {
          total_requests: 12540,
          total_cost: 48.20,
          average_latency: 245,
          success_rate: 99.8
        };
      }
      return Array(10).fill(0).map((_, i) => ({
        id: `log_${i}`,
        created_at: new Date(Date.now() - i * 3600000).toISOString(),
        model_requested: ['gpt-4', 'claude-3-opus', 'gemini-pro'][i % 3],
        status: 'success',
        latency_ms: 150 + i * 10,
        herma_total_cost: 0.02,
        prompt_tokens: 50,
        completion_tokens: 150,
      }));
    }
    if (path === '/portal/keys') {
      // Return list of keys or created key
      if (options.method === 'POST') {
        const body = JSON.parse(options.body);
        return {
          id: `key_demo_${Date.now()}`,
          name: body.name,
          prefix: 'sk_demo',
          created_at: new Date().toISOString(),
          last_used_at: null
        };
      }
      if (options.method === 'DELETE') {
        return { success: true };
      }
      return [
        { id: 'key_1', name: 'Production App', prefix: 'sk_live', created_at: '2023-11-01T10:00:00Z', last_used_at: '2023-11-05T12:00:00Z' },
        { id: 'key_2', name: 'Development', prefix: 'sk_test', created_at: '2023-11-02T14:30:00Z', last_used_at: '2023-11-05T09:15:00Z' },
      ];
    }
    if (path.startsWith('/portal/ledger')) {
      return [
        { id: 'tx_1', amount_usd: -25.00, balance_after: 124.50, description: 'Auto-refill', type: 'credit', created_at: new Date().toISOString() },
        { id: 'tx_2', amount_usd: -0.45, balance_after: 99.50, description: 'Usage: gpt-4', type: 'debit', created_at: new Date(Date.now() - 86400000).toISOString() }
      ];
    }

    // Default fallback for unmocked GETs in demo
    if (options.method === 'POST' || options.method === 'DELETE') return { success: true };
    return {};
  }
  // --- END DEMO MODE ---

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

// --- Portal Chat (streaming) ---

export async function streamChat(messages, { onChunk, onDone, onError, signal } = {}) {
  const token = getToken();
  if (!token) {
    clearAuth();
    window.location.hash = '#/login';
    throw new Error('Not authenticated');
  }

  // --- DEMO MODE STREAMING ---
  if (token === 'DEMO_TOKEN') {
    const lastMsg = messages[messages.length - 1];
    const demoResponse = `[DEMO MODE] This is a simulated response to: "${lastMsg?.content || ''}".\n\nIn demo mode, Herma doesn't actually call LLMs, but you can see how the UI streams and renders markdown. Try checking the "Dashboard" to see mock analytics!`;

    // Simulate thinking delay
    await new Promise(r => setTimeout(r, 600));

    const chunks = demoResponse.match(/.{1,5}/g) || [];
    for (const chunk of chunks) {
      if (signal?.aborted) return;
      await new Promise(r => setTimeout(r, 30)); // typing speed
      onChunk?.(chunk);
    }
    onDone?.({ total_tokens: 150, prompt_tokens: 50, completion_tokens: 100 });
    return;
  }
  // --- END DEMO MODE ---

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
          const delta = parsed.choices?.[0]?.delta;
          if (delta?.content) {
            onChunk?.(delta.content);
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

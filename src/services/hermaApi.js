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

const API_URL = process.env.REACT_APP_HERMA_API_URL || 'http://localhost:8000';
const TRACK_URL = `${API_URL}/analytics/track`;

// Session ID — unique per tab
function getSessionId() {
  let id = sessionStorage.getItem('herma_session_id');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('herma_session_id', id);
  }
  return id;
}

// Customer ID from auth
function getCustomerId() {
  try {
    const user = localStorage.getItem('herma_user');
    if (user) {
      const parsed = JSON.parse(user);
      return parsed.customer_id || null;
    }
  } catch {}
  return null;
}

// UTM params — captured once per session, persisted to sessionStorage so they
// survive full-page reloads (e.g. Stripe checkout redirect back to /success).
let _utmParams = null;
function getUtmParams() {
  if (_utmParams) return _utmParams;
  // Recover UTMs captured earlier in this browser session (survives page reloads)
  try {
    const stored = sessionStorage.getItem('herma_utm');
    if (stored) {
      _utmParams = JSON.parse(stored);
      return _utmParams;
    }
  } catch {}
  // Parse from the current URL
  try {
    const params = new URLSearchParams(window.location.search);
    const source = params.get('utm_source');
    if (source) {
      _utmParams = {
        utm_source: source,
        utm_medium: params.get('utm_medium') || null,
        utm_campaign: params.get('utm_campaign') || null,
      };
      sessionStorage.setItem('herma_utm', JSON.stringify(_utmParams));
    } else {
      _utmParams = {};
    }
  } catch {
    _utmParams = {};
  }
  return _utmParams;
}

// Referrer — captured on first page load and persisted so it survives Stripe redirect
function getReferrer() {
  if (document.referrer) {
    // We're on a fresh page load with a real referrer — save it
    try { sessionStorage.setItem('herma_referrer', document.referrer); } catch {}
    return document.referrer;
  }
  // No referrer on this load (likely a redirect) — use the saved value if present
  try {
    return sessionStorage.getItem('herma_referrer') || null;
  } catch {}
  return null;
}

function send(payload) {
  const body = JSON.stringify({
    ...payload,
    session_id: getSessionId(),
    customer_id: getCustomerId(),
    screen_width: window.screen?.width || null,
    screen_height: window.screen?.height || null,
    referrer: getReferrer(),
    ...getUtmParams(),
  });

  // navigator.sendBeacon survives page close
  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: 'application/json' });
    const sent = navigator.sendBeacon(TRACK_URL, blob);
    if (sent) return;
  }

  // Fallback to fetch (fire-and-forget)
  fetch(TRACK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {});
}

export function trackPageView() {
  send({
    event_type: 'page_view',
    page_path: window.location.pathname || '/',
    page_title: document.title,
  });
}

export function trackClick(name, data = {}) {
  send({
    event_type: 'click',
    event_name: name,
    page_path: window.location.pathname || '/',
    event_data: data,
  });
}

export function trackDownload(platform) {
  send({
    event_type: 'download',
    event_name: platform,
    page_path: window.location.pathname || '/',
    event_data: { platform },
  });
}

export function trackSignup() {
  send({
    event_type: 'signup',
    page_path: window.location.pathname || '/',
  });
}

export function trackChatStart() {
  send({
    event_type: 'chat_start',
    page_path: '/chat',
  });
}

export function trackScrollDepth(threshold) {
  send({
    event_type: 'scroll_depth',
    event_name: `${threshold}%`,
    page_path: window.location.pathname || '/',
    event_data: { threshold },
  });
}

export function trackTimeOnPage(seconds) {
  send({
    event_type: 'time_on_page',
    page_path: window.location.pathname || '/',
    event_data: { seconds },
  });
}

export function trackFormInteraction(form, action) {
  send({
    event_type: 'form_interaction',
    event_name: `${form}:${action}`,
    page_path: window.location.pathname || '/',
    event_data: { form, action },
  });
}

export function trackError(msg, source, stack) {
  send({
    event_type: 'error',
    event_name: msg?.substring(0, 100),
    page_path: window.location.pathname || '/',
    event_data: { message: msg, source, stack: stack?.substring(0, 500) },
  });
}

export function trackPerformance(ms) {
  send({
    event_type: 'performance',
    page_path: window.location.pathname || '/',
    event_data: { load_time_ms: ms },
  });
}

export function trackPayment(amount) {
  send({
    event_type: 'payment',
    page_path: '/success',
    event_data: { amount },
  });
}

export function initAnalytics() {
  // Global error handler
  window.addEventListener('error', (e) => {
    trackError(e.message, e.filename, e.error?.stack);
  });

  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', (e) => {
    trackError(
      e.reason?.message || String(e.reason),
      'unhandledrejection',
      e.reason?.stack
    );
  });
}

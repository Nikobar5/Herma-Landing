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

export function trackLoginAttempt(method) {
  send({
    event_type: 'login_attempt',
    event_name: method,
    page_path: window.location.pathname || '/',
    event_data: { method },
  });
  if (window.posthog) window.posthog.capture('login_attempted', { method });
}

export function trackLoginFailed(method, errorType) {
  send({
    event_type: 'login_failed',
    event_name: method,
    page_path: window.location.pathname || '/',
    event_data: { method, error_type: errorType },
  });
  if (window.posthog) window.posthog.capture('login_failed', { method, error_type: errorType });
}

export function trackSignupAttempt() {
  send({
    event_type: 'signup_attempt',
    page_path: window.location.pathname || '/',
  });
  if (window.posthog) window.posthog.capture('signup_attempted');
}

export function trackCheckoutPageViewed() {
  send({
    event_type: 'checkout_page_view',
    page_path: '/upgrade',
  });
  if (window.posthog) window.posthog.capture('checkout_page_viewed');
}

export function trackQuickAmountSelected(amount) {
  send({
    event_type: 'click',
    event_name: 'quick_amount_selected',
    page_path: '/upgrade',
    event_data: { amount },
  });
  if (window.posthog) window.posthog.capture('quick_amount_selected', { amount });
}

export function trackAutoRechargeToggled(enabled) {
  send({
    event_type: 'click',
    event_name: 'auto_recharge_toggled',
    page_path: window.location.pathname || '/',
    event_data: { enabled },
  });
  if (window.posthog) window.posthog.capture('auto_recharge_toggled', { enabled });
}

export function trackAutoRechargeSaved(settings) {
  send({
    event_type: 'form_interaction',
    event_name: 'auto_recharge_saved',
    page_path: window.location.pathname || '/',
    event_data: settings,
  });
  if (window.posthog) window.posthog.capture('auto_recharge_saved', settings);
}

export function trackPaywallShown() {
  send({
    event_type: 'paywall_shown',
    page_path: window.location.pathname || '/',
  });
  if (window.posthog) window.posthog.capture('paywall_shown');
}

export function trackPaywallCTA(action) {
  send({
    event_type: 'click',
    event_name: 'paywall_cta',
    page_path: window.location.pathname || '/',
    event_data: { action },
  });
  if (window.posthog) window.posthog.capture('paywall_cta_clicked', { action });
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

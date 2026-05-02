# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React SPA serving as both the marketing site and user dashboard for Herma AI. Backend is the Herma API (FastAPI on Railway) — this repo contains no server-side logic. Payment processing uses Stripe via backend; billing supports both one-time credit purchases and monthly subscription plans.

## Commands

```bash
npm start          # dev server (localhost:3000)
npm run build      # production build + post-build SEO meta generation
npm test           # jest via react-scripts
```

`npm run build` runs `scripts/generate-meta-pages.js` after the webpack build. That script duplicates `index.html` for each major route with route-specific `<title>`, OG tags, Twitter Card tags, and JSON-LD — Nginx serves these exact-path files before falling back to the SPA shell. If you add a new public route that needs SEO, add it there.

## Environment Variables

```bash
REACT_APP_HERMA_API_URL=http://localhost:8000   # required; all hermaApi.js calls build off this
REACT_APP_GOOGLE_CLIENT_ID=...                  # Google OAuth
REACT_APP_POSTHOG_KEY=...                       # PostHog (initialized in public/index.html)
REACT_APP_TURNSTILE_SITE_KEY=...                # Cloudflare Turnstile (signup + forgot-password)
```

## Architecture

### Auth Flow

`HermaAuthContext.js` is the single source of truth. On mount it hydrates from `localStorage` (`herma_token` + `herma_user`). All context methods (`login`, `signup`, `loginWithGoogle`) store the JWT and user object there and call `posthog.identify()`. `ProtectedRoute.jsx` redirects unauthenticated users to `/login` with `state.from` for post-login redirect.

The `is_admin` flag on the user object gates the `/admin` route — no separate admin auth.

### API Client (`src/services/hermaApi.js`)

All backend calls go through here. The internal `authFetch()` helper attaches `Authorization: Bearer <token>` from localStorage and redirects to `/login` on 401.

**Three auth tiers in the same file:**
- Public: `signup`, `login`, `loginWithGoogle`, `forgotPassword`, `resetPassword`, `verifyEmail`
- JWT (portal): balance, usage, API keys, billing, subscriptions, chat, conversations
- Admin-only: analytics, routing intelligence, observability endpoints (gated by `is_admin` check in components, not the API client itself)

Streaming responses (both demo and authenticated chat) use SSE. The parser looks for `data: [DONE]` as a terminator and handles `{usage}` and `{herma_routing}` JSON objects interleaved in the stream alongside content deltas.

### Payment & Subscription Flow

`PurchasePage.jsx` offers both subscription plans (Starter/Pro/Enterprise) and a one-time credit purchase form. Both paths call a backend endpoint that returns `{checkout_url}` and immediately redirect to Stripe. After payment Stripe redirects to `/success`, which polls the balance endpoint (with backoff) to confirm the webhook was processed.

Unauthenticated users can view pricing but are redirected to `/login` at the moment they initiate a checkout — **not** on page load. The `PaywallModal` in the chat interface triggers when the API returns 402.

### Conversations

`useConversations.js` keeps a lightweight list (id, title, timestamps) from the server. Individual message arrays are lazy-loaded on first open and cached in-memory during the session. Titles are auto-generated client-side from the first 60 characters of the user's first message.

### Analytics

Two systems run in parallel:

1. **PostHog** — initialized in `public/index.html` with `person_profiles: 'identified_only'` and `session_recording: {maskAllInputs: true}`. Handles session recording and product analytics.

2. **Custom first-party tracker** (`src/services/analyticsTracker.js`) — sends to the Herma API (`/analytics/track`) via `navigator.sendBeacon()`. Tracks page views, scroll depth (25/50/75/100%), time on page, form interactions, performance timing, and errors. UTM params are parsed once and persisted to `sessionStorage` so they survive the Stripe redirect.

`<RouteTracker>` in `App.jsx` fires both on every route change.

### Design Tokens

All colors, typography, spacing, and motion values are CSS custom properties defined in `src/App.css` — Tailwind utility classes are used for layout, but visual style (color, shadow, font, radius) should come from the CSS vars. Key groups:
- `--bg-primary/secondary/tertiary` — warm tan backgrounds
- `--accent-primary` (#4338CA) / `--accent-secondary` (#6366F1) — indigo accent
- `--font-body` (DM Sans), `--font-heading` (Space Grotesk), `--font-code` (Inconsolata)
- `--duration-fast/normal/slow` — animation timing

### Deployment

Dockerfile: multi-stage Node build → Nginx serve on port 8080. `nginx.conf` serves pre-rendered route HTML files first, falls back to `index.html` for SPA routing. Static assets get 1-year cache headers; `index.html` is `no-cache` to force revalidation on each deploy. Security headers are set at the Nginx level (X-Frame-Options, CSP-adjacent headers, Permissions-Policy).

Railway deploys from GitHub — never use `railway up` directly.

## Key Non-Obvious Wiring

- **Multimodal chat**: `useChat.js` builds OpenAI-compatible content arrays with `image_url` and `file` blocks. Images and PDFs are base64-encoded client-side before being sent.
- **Demo chat** (`/demo`): uses `streamDemoChat()`, rate-limited by IP on the backend, 5-message soft cap enforced in the component.
- **Toast notifications**: `ToastContext.jsx` — use the `useToast()` hook, not direct DOM manipulation.
- **Turnstile**: `@marsidev/react-turnstile` component; token is a required param on `signup()` and `forgotPassword()` in `hermaApi.js`.
- **`/success` and `/cancel`** routes both ultimately redirect home; the success page polls balance before redirecting to confirm the credit grant landed.

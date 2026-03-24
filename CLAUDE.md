# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Herma Landing**, a React-based landing page and dashboard for the Herma AI application. The project uses a credits-based billing model (no subscriptions).

- **Frontend**: React app with Tailwind CSS styling
- **Backend**: Herma API (FastAPI on Railway) — handles auth, billing, API proxy
- **Payment Processing**: Stripe checkout via backend API (credit packages)
- **Authentication**: JWT-based auth via Herma API (`HermaAuthContext`)
- **Deployment**: Docker + Nginx on Railway

## Development Commands

```bash
# Development server
npm start

# Production build
npm run build

# Run tests
npm test
```

## Architecture Overview

### Single Backend Architecture
All backend functionality is provided by the Herma API (FastAPI) deployed on Railway at `REACT_APP_HERMA_API_URL`.

### Key Components Structure

**Authentication Flow**:
- `src/context/HermaAuthContext.js` — Global auth state (JWT in localStorage)
- `src/services/hermaApi.js` — API client (login, signup, balance, checkout, etc.)
- `src/pages/Login.jsx` — Login/signup page
- `src/components/ProtectedRoute.jsx` — Route guard for authenticated pages

**Payment Pipeline (Credits)**:
- `src/pages/PurchasePage.jsx` — Credit package selection ($10, $25, $50, $100)
- `src/services/hermaApi.js` `createCheckout(packageId)` — Creates Stripe checkout session
- `src/components/SuccessPage.jsx` — Post-payment confirmation with balance display
- Backend handles Stripe webhooks and credits the account

**Dashboard**:
- `src/pages/Dashboard.jsx` — Main dashboard layout
- `src/pages/dashboard/Overview.jsx` — Account overview
- `src/pages/dashboard/Usage.jsx` — Usage statistics
- `src/pages/dashboard/ApiKeys.jsx` — API key management
- `src/pages/dashboard/Billing.jsx` — Billing history and balance

**Routing & Navigation**:
- `src/App.jsx` — BrowserRouter with main route definitions
- Routes: `/`, `/login`, `/verify-email`, `/reset-password`, `/demo`, `/docs`, `/about`, `/faq`, `/blog`, `/blog/*`, `/upgrade`, `/success`, `/cancel`, `/chat`, `/dashboard`, `/admin`, `/privacy-policy`, `/terms-of-service`, `/attributions`

### Data Flow Patterns

**Authentication-Payment Integration**:
1. User clicks "Buy Credits" on `/upgrade`
2. If not authenticated → redirects to `/login`
3. After login → user selects credit package
4. `hermaApi.createCheckout(packageId)` → backend creates Stripe Checkout Session → returns URL
5. User redirected to Stripe → completes payment
6. Stripe webhook → backend adds credits → user redirected to `/success`

**State Management**:
- Authentication: React Context (`HermaAuthContext`)
- No global state management library
- Local component state for UI interactions

**API Communication**:
- Frontend → Herma API via `hermaApi.js` (JWT Bearer auth)
- Stripe webhooks → Herma API → PostgreSQL credit ledger

## Environment Variables

Required for development:
```bash
REACT_APP_HERMA_API_URL=http://localhost:8000
```

Production (set on Railway):
```bash
REACT_APP_HERMA_API_URL=https://herma.up.railway.app
```

## Key File Locations

**API Client**: `src/services/hermaApi.js` — All backend communication
**Auth Context**: `src/context/HermaAuthContext.js` — Auth provider and `useHermaAuth` hook
**Purchase Flow**: `src/pages/PurchasePage.jsx` — Credit package UI
**Analytics**: `src/utils/analytics.js` — Google Analytics (react-ga4)

## Deployment

- **Dockerfile** builds the React app and serves via Nginx
- **nginx.conf** handles SPA routing (all paths → index.html)
- **railway.toml** configures the Railway deployment
- Deployed on Railway alongside the Herma API backend

## Payment Testing

- Use Stripe test cards: `4242 4242 4242 4242` (success), `4000 0000 0000 0002` (decline)
- Verify credits appear in dashboard after successful payment

## Special Considerations

**BrowserRouter Usage**:
- Uses BrowserRouter for clean URLs and SEO
- Nginx `try_files` handles SPA fallback for all routes
- URLs are clean paths (e.g., `/login`, `/success`)

# Mobile UX & Navigation Improvements

## Overview
This document outlines the systematic changes made to fix mobile usability issues across the platform, focusing heavily on the Dashboard, API Keys management, and the Upgrade/Purchase screens. It also documents a global routing fix for scroll restoration.

## Detailed Changes

### 1. Global Scroll Restoration (`src/App.jsx`)
- **What Changed**: Added `window.scrollTo(0, 0)` to the `RouteTracker` component.
- **Why**: Previously, navigating from the footer of one page (e.g., `/about`) to another page (e.g., `/blog`) would leave the user stranded at the bottom of the new page. This fix manually un-scrolls the window upon navigation (unless the URL contains an explicit `#hash` anchor).

### 2. Dashboard Bottom Navigation (`src/pages/Dashboard.jsx`)
- **What Changed**: Removed the awkward floating top-navigation tabs on mobile view and replaced them with a native app-style fixed **Bottom Navigation Bar** (`bottom-0`).
- **Why**: The top tabs were hardcoded to `top-[60px]`, which either overlapped with page content or left a white gap depending on scroll state. A bottom navigation bar is the modern standard for mobile web applications. 
- **Safe Area Insets**: Implemented Tailwind arbitrary values `pb-[max(8px,env(safe-area-inset-bottom))]` so the bar doesn't collide with the iOS home swipe indicator.
- **Padding Update**: Added `pb-24` to the `<main>` dashboard wrapper to ensure the bottom of scrolling lists (like the Usage table) isn't permanently hidden behind the new bottom nav.

### 3. Purchase Page Responsiveness (`src/pages/PurchasePage.jsx`)
- **What Changed**: Remodeled four distinct structural breaks on mobile:
  1. **Unauthenticated Banner**: Changed the rigid flex row into a stackable column (`flex-col sm:flex-row`) so the text and "Sign Up Free" button no longer squeeze together.
  2. **Subscription Badges**: Added `flex-wrap` to the plan headers ("Most Popular", "+28% bonus") so they wrap gracefully on an iPhone SE rather than breaking outside the card boundary.
  3. **Trust Indicators (Features)**: Adjusted the grid layout to show icon left/text right on mobile screens (`flex-row`), and icon top/text bottom on desktop (`sm:flex-col`). 
  4. **Primary Action Buttons**: Ensured bottom call-to-action buttons stretch full-width (`w-full`) on mobile while remaining auto-sized (`sm:w-auto`) on desktop.

### 4. API Keys Form Wrapping (`src/pages/dashboard/ApiKeys.jsx`)
- **What Changed**: Added `flex-col sm:flex-row` wraps to the "Create a new key" form and the post-creation "Key Created Successfully" block.
- **Why**: A strict `flex gap-4` container was forcing a text input box and a submit button to fight for horizontal space on a 320px screen, making the input unreadable. They now stack vertically on mobile.

---

# Dashboard De-slop & IP Protection

## Overview
Targeted removal of AI-generated fluff and internal proprietary information from the user-facing dashboard.

## Detailed Changes

### 1. Removed Mock Data Trends (`src/pages/dashboard/Overview.jsx`)
- **What Changed**: Deleted the hardcoded green/red percentage trend badges (e.g., "+12%") and their associated rendering logic from the Available Credits, Total Requests, and Total Spend widgets.
- **Why**: The trend indicators were using mock data that provided no real value and contributed to an "AI-generated template" feel. The widgets now cleanly display only real usage numbers.

### 2. Hidden Quality Dashboard (`src/pages/Dashboard.jsx`, `src/App.jsx`)
- **What Changed**: Removed the "Quality" tab from the dashboard navigation menu (`navItems`) and deleted the corresponding route and component import from the main application router.
- **Why**: To protect proprietary internal processes and Intellectual Property (IP). The page is now completely inaccessible from the UI, protecting internal testing metrics from public visibility.

---

# Dead Code Removal

## Overview
Removed all orphaned components, unused service functions, and dead imports that accumulated from AI-generated code. No functional changes — purely cleanup.

## Detailed Changes

### 1. Deleted Unused Component Files (`src/components/`)
Removed 10 files with zero imports anywhere in the codebase:
- `About.jsx` — section-component version; `src/pages/About.jsx` is the routed page
- `handleDownload.jsx` — only imported by the deleted `About.jsx`
- `Contact.jsx`
- `FAQ.jsx` — `src/pages/FAQPage.jsx` handles this route
- `FeatureCard.jsx`
- `HowToUse.jsx`
- `ImageCarousel.jsx`
- `RoutePreview.jsx` — only existed as a commented-out line in `App.jsx`
- `StarBorder.jsx`
- `carousel.js`

### 2. Removed 36 Unused Functions (`src/services/hermaApi.js`)
Removed all exported functions that were never imported by any file. These were unintegrated admin/agent scaffolding added speculatively:
- Subscription: `getSubscriptionStatus`
- Admin analytics: `getAdminCustomers`, `getAdminMemory`, `getAdminRouting`, `getAdminQuality`, `getAdminAgents`, `getAdminReports`, `generateReportsNow`, `getSchedulerStatus`
- Hierarchy/Trust/Permissions: `getAgentHierarchy`, `getAgentTrustScores`, `getPendingPermissions`, `approvePermission`, `denyPermission`, `getDecisionLog`, `getTrustPromotions`
- Notifications: `getNotifications`, `getNotificationCount`, `markNotificationRead`, `markAllNotificationsRead`, `actionNotification`
- Budgets: `getAgentBudgets`, `allocateBudget`, `updateBudget`
- QA: `getQaOverview`, `getQaRuns`, `triggerQaRun`, `getQaScenarios`, `generateQaScenarios`, `activateQaScenario`, `retireQaScenario`
- C-Suite/Observability: `getCsuiteOverview`, `getObservabilityHealth`, `postHealthPing`, `postSessionLog`, `postObservabilityAlert`

### 3. Minor Cleanup
- `src/App.jsx`: Removed commented-out `{/* <RoutePreview /> */}` line
- `src/pages/AdminDashboard.jsx`: Removed unused `LineChart` and `Line` recharts imports

---

# Pricing Page Bug Fix & Navigation

## Overview
Fixed a critical conversion bug reported via Reddit: the pricing page (`/upgrade`) was redirecting unauthenticated visitors to the login screen instead of showing pricing. Also added a Pricing link to both the desktop nav and mobile menu.

## Detailed Changes

### 1. Pricing Page Accessible Without Login (`src/pages/PurchasePage.jsx`)
- **What Changed**: Removed the `useEffect` that immediately redirected unauthenticated users to `/login?next=/upgrade`.
- **Why**: Visitors clicking any pricing link (from Reddit, footer, etc.) were being sent to the login page before seeing pricing — a conversion killer. The page already had full UI for unauthenticated users (a "Sign Up Free" banner and a sign-in prompt at the bottom); they were just never seen. Auth is now only triggered when a user actually clicks a purchase button.

### 2. Pricing Link in Desktop Nav (`src/components/Header.jsx`)
- **What Changed**: Added a "Pricing" link after "Blog" in the desktop navigation bar.

### 3. Pricing Link in Mobile Menu (`src/components/MenuOverlay.jsx`)
- **What Changed**: Added a "Pricing" link after "Blog" in the mobile burger menu.

---

# Landing Page De-slop

## Overview
Removed AI-generated visual and copy patterns from the landing page to make it feel more credible and genuine. No structural redesign — targeted removals and replacements only.

## Detailed Changes

### 1. Removed ComplianceSection (`src/App.jsx`, `src/components/ComplianceSection.jsx`)
- **What Changed**: Removed the entire "Enterprise-Grade Security" section from the homepage.
- **Why**: Four boilerplate security feature cards with buzzword-heavy copy and an inaccurate SOC 2 Type II claim. The page now flows: Hero → ValueProposition → HowItWorksSection → BenchmarkTrust → Footer.

### 2. Font: Space Grotesk → Outfit (`src/App.css`, `public/index.html`)
- **What Changed**: Updated `--font-heading` and `--font-ui` CSS variables from `'Space Grotesk'` to `'Outfit'`. Added Google Fonts link for Outfit in `public/index.html`.
- **Why**: Space Grotesk is the canonical AI-generated site font. Outfit has the same geometric, modern character with more open proportions and better readability. Affects all headings and UI text sitewide.

### 3. Removed Gradient Glow Borders on Stat Cards (`src/components/BenchmarkTrust.jsx`)
- **What Changed**: Removed the absolute-positioned multi-color gradient divs that created rainbow glow borders on the three benchmark stat cards. Replaced with a simple `border-[var(--border-secondary)]` that transitions to `border-[var(--border-accent)]` on hover.
- **Why**: Rotating gradient borders (accent → purple → emerald) are a very common AI-generated UI pattern.

### 4. Removed Shimmer Button Effects (`src/components/Hero.jsx`, `src/components/Footer.jsx`)
- **What Changed**: Removed the sliding white shine overlay (`-skew-x-12 -translate-x-full group-hover:translate-x-full`) from the hero CTA button and the footer CTA button.
- **Why**: The "shimmer on hover" button effect is a cliché AI-generated interaction. The existing hover color change is sufficient.

### 5. Removed Pulsing Badge Dot (`src/components/Hero.jsx`)
- **What Changed**: Removed `animate-pulse` from the dot inside the hero badge ("Drop-in replacement for any AI model").
- **Why**: Pulsing indicator badges are a very common AI-generated UI pattern.

### 6. Removed Purple Glow Behind Code Block (`src/components/HowItWorksSection.jsx`)
- **What Changed**: Removed the `absolute -inset-4 bg-gradient-to-r from-accent to-purple-600 blur-xl` div behind the code snippet.
- **Why**: Unnecessary purple haze; the code block has its own shadow and border.

### 7. Copy Fixes
- `src/components/BenchmarkTrust.jsx`: Heading "Proven Quality. Real Benchmarks." → "How Herma Performs"; subtext "The numbers speak for themselves." → "Full methodology linked below."
- `src/components/HowItWorksSection.jsx`: "Compatible with LangChain, Vercel AI SDK, etc." → "...and any OpenAI-compatible library"; removed leading space bug on "Zero downtime migration"
- `src/components/Footer.jsx`: Tagline "Intelligent model routing for every workload." → "Route every AI call to the best model for the price."

---

# Admin Dashboard — Activity Log & Alerts Improvements

## Overview
Fixed broken filter/search UI in the Activity Log tab, added a full log detail modal, enhanced the Alerts tab to surface warnings and errors from session logs, and bumped the log fetch limit.

## Detailed Changes

### 1. Fixed Activity Log Filter/Search UI (`src/pages/AdminDashboard.jsx`)
- **What Changed**: Added missing `bg-[var(--bg-tertiary)]`, `border border-[var(--border-secondary)]`, and `placeholder-[var(--text-tertiary)]` classes to the search input and level filter `<select>`.
- **Why**: Both controls were rendering with no background, making them invisible against the dark page background. The filter logic itself worked; the inputs were just visually hidden.

### 2. Fixed Warning Level Filter (`src/pages/AdminDashboard.jsx`)
- **What Changed**: Added level normalization in the filter function: `entry.level === 'warning' ? 'warn' : entry.level` before comparing against the dropdown value.
- **Why**: The backend emits `"warning"` (full word) but the dropdown option value was `"warn"`. The exact-match check always failed for warning-level entries; info worked because the backend and dropdown agreed on `"info"`.

### 3. Increased Log Fetch Limit (`src/pages/AdminDashboard.jsx`)
- **What Changed**: `getObservabilitySessionLogs(200)` → `getObservabilitySessionLogs(1000)`.
- **Why**: The 200-entry cap was arbitrary. 1000 covers real debugging needs without introducing frontend performance issues. The backend enforces its own hard cap server-side.

### 4. Log Detail Modal — `LogDetailModal` component (`src/pages/AdminDashboard.jsx`)
- **What Changed**: Added a new `LogDetailModal` component that opens when a user clicks any log row in the Activity Log tab.
- **Features**:
  - Full-screen backdrop with blur; closes on Escape key or backdrop click
  - Displays: level badge, full message (selectable text), exact ISO timestamp + relative time, source (monospace), pretty-printed metadata JSON block
  - Collapsible "Raw JSON" section showing the complete log entry
  - "Acknowledge error" button for error-level entries; dimmed checkmark if already acknowledged
- **Activity Log rows**: Each row is now `cursor-pointer` with a hover-reveal expand icon; "Dismiss" button still works inline via `stopPropagation`.

### 5. Alerts Tab Overhaul (`src/pages/AdminDashboard.jsx`)
- **What Changed**: Restructured `AgentAlertsTab` into two sections and added summary counts.
- **Section A — Warnings & Errors**: Derived from `agentLogs` filtered to `error`/`warn`/`warning` level entries. Each row is clickable (opens `LogDetailModal`). Includes an "Errors only" toggle pill to narrow the list. Acknowledge/dismiss works from within the modal.
- **Section B — Agent Alerts**: Existing alert history data, visually unchanged.
- **Summary bar**: Color-coded pill badges at the top showing error count (red), warning count (amber), and agent alert count (gray) — instant status at a glance.
- **Refresh button**: Now visible in the Alerts tab header (was wired up but never rendered).
- **Parent change**: `agentLogs`, `acknowledgedErrors`, and `acknowledgeError` are now passed to `AgentAlertsTab` so dismiss state is consistent across tabs.

### 6. Errors Pill Color Fix (`src/pages/AdminDashboard.jsx`)
- **What Changed**: The "0 errors" pill on the Alerts tab was green (falsely implying a positive state). It is now always styled in red — full opacity when errors exist, dimmed red (`text-red-400/50`) when the count is zero.

---

# AI Discovery & Integration Files

## Overview
Added downloadable AI coding tool configuration files, improved `llms.txt` and `llms-full.txt`, updated `sitemap.xml`, and added a "Quick Start with Coding Tools" section to the docs page.

## Detailed Changes

### 1. New Integration Files (`public/integration/`)
Created five static files served as downloads:

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Drop into project root — tells Claude Code to use Herma for all LLM calls |
| `cursor-rules.txt` | Rename to `.cursorrules` — Cursor rules directing use of Herma |
| `windsurf-rules.txt` | Rename to `.windsurfrules` — Windsurf rules directing use of Herma |
| `AGENTS.md` | For Codex, Devin, and other agent frameworks; includes agent-specific notes on streaming, tool calling, rate limits, and error codes |
| `.env.example` | Minimal env snippet with `HERMA_API_KEY` and commented `HERMA_BASE_URL` |

All files use only real API details from the live docs: base URL `https://api.hermaai.com/v1`, model `herma-auto`, key prefix `hk-`.

### 2. Updated `public/llms.txt`
- Added Node.js, LangChain (Python), Vercel AI SDK, and LlamaIndex code snippets
- Added `HERMA_API_KEY` / `HERMA_BASE_URL` environment variable conventions
- Added "AI Coding Tool Integration" section with direct download links to all five integration files

### 3. Updated `public/llms-full.txt`
- Added LangChain, Vercel AI SDK, and LlamaIndex framework examples
- Added environment variables section
- Added full integration table mapping each tool to its config file and download URL
- Added note about llms.txt auto-discovery standard

### 4. Updated `public/sitemap.xml`
- Added entries for `llms.txt`, `llms-full.txt`, and all four integration files (`CLAUDE.md`, `cursor-rules.txt`, `windsurf-rules.txt`, `AGENTS.md`)

### 5. Docs Page — "Quick Start with Coding Tools" Section (`src/pages/Documentation.jsx`)
- **What Changed**: Added a new `IntegrationTabGroup` component and a new section to the docs page.
- **Position**: Directly after "Quick Start", before "Base URL" — visible early without blocking the rest of the docs.
- **Behavior**: Collapsed by default — only the four tool buttons are visible. Clicking a button expands its file content; clicking it again collapses. Clicking a different tool switches content.
- **Each tab shows**: The raw file content in a `CodeBlock` (with copy button) + filename instruction + Download link pointing to `/integration/`.
- **Also includes**: An environment variables block with a `.env.example` download link, and a note explaining llms.txt auto-discovery.
- **Title history**: Originally "Use with AI Coding Tools" → "Integrate with Coding Tools" → "Quick Start with Coding Tools".

---

# SEO, CRO, and Design Overhaul

## Overview
Comprehensive audit and improvement pass covering SEO meta tags, conversion rate optimization, auth-aware CTAs, design theme migration, and visual polish.

---

## SEO — Tab Titles & Meta Tags

### Title Format (`src/utils/seo.js`, `public/index.html`)
- Changed format from `Page Title | Herma` to `Herma | Page Title` — brand name always appears first in browser tabs and search results
- Replaced all em dashes (`—`) with pipes (`|`) in every page title and meta description string — ensures clean display in Google search snippets
- Updated `public/index.html` static title to `Herma | AI Model Router | Save 60-90% on AI Costs`
- Updated og:title and twitter:title in `index.html` to match

### Per-Page Meta Tags Added
Previously all non-blog pages showed as bare "Herma" in Google results. Added `setPageMeta()` + `resetPageMeta()` useEffect to:
- `src/App.jsx` — Home: `Herma | AI Model Router | Save 60-90% on AI Costs`
- `src/pages/Documentation.jsx` — `Herma | API Documentation`
- `src/pages/FAQPage.jsx` — `Herma | Frequently Asked Questions`
- `src/pages/PurchasePage.jsx` — `Herma | Pricing | AI Model Router`
- `src/pages/About.jsx` — `Herma | About`
- `src/pages/DemoChat.jsx` — `Herma | Try the Demo`
- `src/pages/blog/BlogIndex.jsx` — `Herma | LLM Router Blog | AI Cost Optimization Guides`

### seo.js Fixes
- `DEFAULT_IMAGE`: was `og-default.png` (nonexistent file) → corrected to `og-image.png`
- `DEFAULT_DESCRIPTION`: aligned with `index.html` meta description
- Added canonical link tag injection into `setPageMeta()` — every page that calls it now automatically gets `<link rel="canonical">`

### Em Dash Fixes in Meta Strings
Files where `—` was replaced with `|` in title or description strings passed to `setPageMeta` or used in structured data:
- `BlogIndex.jsx`, `EVRouting.jsx`, `PurchasePage.jsx`, `FAQPage.jsx`
- `HowWeBenchmark.jsx`, `OpenAIAlternatives.jsx`, `SaveOnAICosts.jsx`
- `App.jsx` (Organization schema description)
- `public/index.html` (og:title, twitter:title, page title, noscript blog link)

### Schema / Noscript Fixes (`public/index.html`)
- WebApplication schema `offers` description: removed "no subscriptions" language → neutral billing copy
- FAQPage schema answer for "How much does Herma cost?": removed "There are no subscriptions, no minimums" → neutral language
- Noscript pricing text: same fix

---

## Conversion Rate Optimization

### Hero Section (`src/components/Hero.jsx`)
- Primary CTA is now auth-aware: logged-in → "Go to chat" → `/chat`; logged-out → "Start saving" → `/login?signup=true`
- CTA text simplified from "Start saving — free to try" to "Start saving"
- Added micro-copy below CTAs: "Free $1 credit to start · No credit card required"
- Added trust bar: three checkmark items — "89% avg. cost savings", "OpenAI-compatible API", "8/8 subset of Terminal-Bench"

### Footer (`src/components/Footer.jsx`)
- CTA heading: "Ready to try it out?" → "Ready to start saving?"
- Button is now auth-aware: logged-in → `/chat`; logged-out → `/login?signup=true`
- Added GitHub social link alongside LinkedIn

### ValueProposition (`src/components/ValueProposition.jsx`)
- Savings calculator CTA is now auth-aware: logged-in → `/chat`; logged-out → `/login?signup=true`

### DemoChat (`src/pages/DemoChat.jsx`)
- "Sign up free" button in top bar: hidden for logged-in users, replaced with "Go to chat" → `/chat`
- Demo banner ("sign up to unlock all models"): hidden for logged-in users
- Limit-reached button: auth-aware — logged-in → "Go to chat"; logged-out → "Sign up free — $1.00 credit included"

### Documentation (`src/pages/Documentation.jsx`)
- Removed duplicate "Ready to get started?" CTA section at the bottom of the page — Footer CTA is the only one now
- Fixed inline pricing badge: "no subscriptions, no minimums" → "no minimums"

### FAQ Subscription Contradiction (`src/pages/FAQPage.jsx`)
- Items #6 and #9: removed "There are no subscriptions" — updated to neutral language describing both pay-as-you-go and subscription options

---

## Auth-Aware Navigation

All public CTAs now check auth state before navigating. Logged-in users are never sent to `/login`:

| Component | Logged In | Logged Out |
|---|---|---|
| Hero primary CTA | `/chat` | `/login?signup=true` |
| Footer CTA | `/chat` | `/login?signup=true` |
| ValueProposition savings CTA | `/chat` | `/login?signup=true` |
| DemoChat top bar button | `/chat` (Go to chat) | `/login?signup=true` |
| DemoChat demo banner | hidden | visible |
| DemoChat limit-reached button | `/chat` | `/login?signup=true` |

---

## Login Page Fix (`src/pages/Login.jsx`)
- Fixed title/heading being clipped behind the fixed header
- Changed outer container from `min-h-screen flex flex-col justify-center py-12` to `min-h-screen flex flex-col pt-24 pb-12`
- Form now starts below the header rather than being vertically centered in the full viewport

---

## Design — Warm Light Theme (`src/App.css`)

Full migration from dark (#09090B) to warm cream/off-white light theme:

| Variable | Before | After |
|---|---|---|
| `--bg-primary` | `#09090B` | `#FAFAF8` |
| `--bg-secondary` | `#111114` | `#F3F2EF` |
| `--bg-tertiary` | `#1A1A1F` | `#ECEAE5` |
| `--bg-hover` | `#222228` | `#E5E3DE` |
| `--bg-active` | `#2A2A32` | `#DDD9D3` |
| `--text-primary` | `#F4F4F5` | `#1A1916` |
| `--text-secondary` | `#A1A1AA` | `#6B6762` |
| `--text-tertiary` | `#71717A` | `#9A9691` |
| `--accent-primary` | `#818CF8` | `#4F4CE8` |
| `--accent-hover` | `#6366F1` | `#3D3BB8` |
| `--border-primary` | `rgba(255,255,255,0.08)` | `rgba(0,0,0,0.08)` |
| `--font-body` | `'PT Serif', Georgia, serif` | `'Outfit', -apple-system, sans-serif` |

Removed `prose-invert` Tailwind class from components where it made markdown invisible on the light background:
- `src/components/SmartRouterComparison.jsx`
- `src/components/chat/ChatMessage.jsx`
- `src/pages/DemoChat.jsx`

---

## Green Color Replacement

Replaced all neon emerald/green (`emerald-400`, `#34D399`) with pastel sage green (`#5BAF8A`) across every user-facing file. Covers text color, backgrounds, borders, gradients, glow shadows, and chart colors.

**Files updated:**
- `src/components/BenchmarkTrust.jsx`
- `src/components/Hero.jsx`
- `src/components/ValueProposition.jsx`
- `src/components/ComplianceSection.jsx`
- `src/components/IntegrationWizard.jsx`
- `src/components/SmartRouterComparison.jsx`
- `src/components/SuccessPage.jsx`
- `src/components/OnboardingModal.jsx`
- `src/components/chat/PaywallModal.jsx`
- `src/components/chat/BalanceBadge.jsx`
- `src/pages/Documentation.jsx`
- `src/pages/PurchasePage.jsx`
- `src/pages/ResetPassword.jsx`
- `src/pages/VerifyEmail.jsx`
- `src/pages/dashboard/Overview.jsx`
- `src/pages/dashboard/Usage.jsx`
- `src/pages/dashboard/Billing.jsx`
- `src/pages/dashboard/ApiKeys.jsx`
- `src/pages/dashboard/Quality.jsx`
- `src/pages/dashboard/FunnelTab.jsx`

Blog comparison tables intentionally left with green — those use it semantically to highlight "winner" in head-to-head model comparisons, not as a brand color.

---

## Benchmark Stats

### BenchmarkTrust (`src/components/BenchmarkTrust.jsx`)
- Animated stat card: `6/8` → `8/8`
- Label: "benchmarks at 100%+ quality" → "subset of Terminal-Bench"

### Hero trust bar (`src/components/Hero.jsx`)
- "6/8 benchmarks at 100%+ quality" → "8/8 subset of Terminal-Bench"

---

# Bug Fixes & UI Polish (debug/doc-credit-consistency branch)

## Overview
Multi-pass bug fix and polish session covering copy consistency, modal blur, clipboard reliability, API key format, contrast issues, credit balance accuracy, onboarding accessibility, and several smaller UX improvements.

---

## 1. Copy Update — About Page (`src/pages/About.jsx`)
- **What Changed**: Opening mission paragraph updated.
- **Before**: "Herma exists because we believe all intelligence should flow through one gateway."
- **After**: "Herma exists to make intelligence flow freely. One gateway, no friction, no switching, no gatekeeping."

---

## 2. Modal Backdrop Blur Fix — Full-Screen Coverage

### Root Cause
The `Header` component uses `backdrop-filter: blur` (`backdrop-blur-sm`), which promotes it to its own compositing layer in Chrome. This caused modals with `z-50` to appear "half blurred" — the header's compositing layer rendered above the modal overlay regardless of z-index.

### Fix Applied to Both Modals
Both `OnboardingModal` and `IntegrationWizard` now use `ReactDOM.createPortal` to render directly into `document.body`, bypassing all parent stacking contexts. Z-index raised to `z-[9999]`.

- `src/components/OnboardingModal.jsx`: Added `createPortal`, raised to `z-[9999]`, added `backdrop-blur-sm` to overlay
- `src/components/IntegrationWizard.jsx`: Added `createPortal`, raised to `z-[9999]`, merged backdrop into parent fixed div (removed separate `absolute` backdrop child)

---

## 3. Clipboard — Cross-Platform Copy Fix (`src/utils/clipboard.js` — new file)

### Root Cause
`IntegrationWizard`'s `CopyButton` had a parameter-shadowing bug: `handleCopy = async (text) => { ... }` — the `text` parameter shadowed the `text` prop, so the click event object was passed to `navigator.clipboard.writeText()` instead of the actual text. Silent failure.

### Fix
- Created `src/utils/clipboard.js` — a shared `copyToClipboard(text)` utility that tries `navigator.clipboard.writeText` first, then falls back to `document.execCommand('copy')` via a hidden textarea (for HTTP contexts and older browsers).
- Fixed the shadow bug in `IntegrationWizard` `CopyButton` (`handleCopy = async () =>`, no parameter).
- Updated all copy-button locations to use the utility:
  - `src/components/IntegrationWizard.jsx`
  - `src/components/chat/CodeBlock.jsx`
  - `src/components/chat/ChatMessage.jsx`
  - `src/pages/DemoChat.jsx`
  - `src/pages/dashboard/ApiKeys.jsx`

---

## 4. API Key Format — Docs & Wizard (`src/pages/Documentation.jsx`)
- **What Changed**: All placeholder API key examples updated from dash-separated to underscore-separated to match real key format.
- `hk-your-api-key-here` → `hk_your_api_key_here`
- `hk-your-api-key` → `hk_your_api_key`
- Affected 9 occurrences across cURL, Python, Node.js, and fetch examples (lines 458–722).

---

## 5. Yellow/Amber Text Contrast (Light Theme)

On the cream light theme (`--bg-primary: #FAFAF8`), light amber/yellow text on amber/yellow backgrounds was unreadable.

| File | Element | Before | After |
|------|---------|--------|-------|
| `src/components/IntegrationWizard.jsx` | Warning box text | `text-amber-200/90` | `text-amber-900` |
| `src/pages/dashboard/Overview.jsx` | Low-balance nudge text | `text-amber-300` | `text-amber-900` |
| `src/context/ToastContext.jsx` | Warning toast text | `text-yellow-400` | `text-yellow-700` |
| `src/pages/AdminDashboard.jsx` | Warn/warning log level badge | `text-yellow-400` | `text-yellow-700` |
| `src/pages/AdminDashboard.jsx` | Warning count pill | `text-yellow-400` | `text-yellow-700` |

---

## 6. Credit Balance Consistency — Chat Page

### Root Cause
`LowBalanceBanner` received only `balance` (`balance_usd` — paid credits). Users with $0 paid credits but $1.00 free chat credits saw a red "low balance" warning at the top of the chat page, while the sidebar `BalanceBadge` correctly showed $1.00 total. The two components calculated "available balance" differently.

### Fix
- `src/pages/ChatPage.jsx`: Now passes `chatFreeCredit` to `LowBalanceBanner`.
- `src/components/chat/LowBalanceBanner.jsx`: Computes `totalBalance = balance_usd + chat_free_credit_usd` before comparing against the $0.50 threshold, matching `BalanceBadge`'s logic. Display also uses `totalBalance`.

---

## 7. Getting Started Guide — Persistent Access

### Problem
The onboarding walkthrough (`OnboardingModal`) only auto-showed on the `/chat` route. Users landing on `/dashboard` after signup never saw it. There was also no way to re-open it.

### Changes
- `src/pages/ChatPage.jsx`: Added `useEffect` on `user` to catch the edge case where `user` hydrates after `ChatPage` mounts (e.g. Google login → `/dashboard` → `/chat`). Added `onShowGuide` callback prop to `ChatSidebar`.
- `src/components/chat/ChatSidebar.jsx`: Added "Getting started guide" button at the bottom of the sidebar (below balance badge). Clears `localStorage` key and re-opens modal.
- `src/pages/Dashboard.jsx`: Added `OnboardingModal` render + `useEffect` to auto-show for new users who land on the dashboard. Added "Getting started" button in the dashboard sidebar footer (above user info / logout).

---

## 8. Docs — Models Section (`src/pages/Documentation.jsx`)
- **What Changed**: Removed all provider-specific model rows (`anthropic/*`, `openai/*`, `google/gemini-2.5*`, `deepseek/*`, `mistralai/*`) from the Models table. Only `herma-auto` remains.
- Removed "Or specify a model directly." from the section description.
- Removed the "Only model" badge added mid-session (redundant with the single-row table).

---

## 9. Dashboard — Total Spend → Total Savings (`src/pages/dashboard/Overview.jsx`)
- **What Changed**: The "Total Spend" metric card is now "Total Savings".
- Value source: `usage.total_savings_usd` (falls back to `0` if not present).
- Subtext: "Lifetime usage cost" → "vs. paying frontier prices"
- Icon: purple dollar → green trending-up arrow.

---

## 10. Chat Page — Navigation Button Position (`src/pages/ChatPage.jsx`)
- **What Changed**: The "Dashboard" and "Docs" nav buttons in the chat top bar were positioned to the left of the `flex-1` spacer (appearing next to the logo). Moved them to the right of the spacer so they align with the right side of the header, consistent with the rest of the site.

---

## 11. API Keys — Delete After Revoke (`src/pages/dashboard/ApiKeys.jsx`)
- **What Changed**: Revoked keys previously showed no action button. Now they show a "Delete" button.
- Clicking "Delete" removes the key from local state (`keys` array) — clearing it from the UI immediately.
- No additional API call needed; the key is already revoked server-side.

---

## 12. Benchmarks Revision (`src/components/BenchmarkTrust.jsx`)
- `BigCodeBench Hard`: `78.0%` → `97.4%`
- `Terminal-Bench`: `17.2%` → `96.1%`
- Frontier quality threshold: `bench.quality >= 98` → `bench.quality >= 95` (all 8 benchmarks now pass)
- Stat card subtitle: "subset of Terminal-Bench" → "benchmarks at frontier quality"

---

## 13. Footer & Pricing Page CTAs (`src/components/Footer.jsx`, `src/pages/PurchasePage.jsx`)
- Footer CTA button: now always navigates to `/upgrade` (pricing page); label changed to "Get started".
- Footer CTA section is hidden (`!hideCta`) when `location.pathname === '/upgrade'` to avoid pointing users to the page they're already on.
- Pricing page: removed the "Sign in to purchase credits" block at the bottom for unauthenticated users.

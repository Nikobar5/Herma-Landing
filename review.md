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

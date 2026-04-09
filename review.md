# Change Log — 2026-04-09

## Session: Fix contact emails + improve support visibility

### 1. Email address — all contact touchpoints
Replaced non-existent/outdated emails (`support@hermaai.com`, `hermalocal@gmail.com`) with the correct address `niko.barciak@hermaai.com` across all files.

- `src/components/SuccessPage.jsx` — "Contact Support" button mailto
- `src/pages/PrivacyPolicy.jsx` — privacy rights contact email
- `src/pages/TermsOfService.jsx` — terms questions contact email
- `src/pages/Attributions.jsx` — also fixed broken href (was `mailto:herma@email.com`) to match display text

### 2. `src/pages/Documentation.jsx` — clickable support link
- "contact support" in the 500 error row was plain text — made it a clickable `mailto:niko.barciak@hermaai.com` link

### 3. `src/pages/FAQPage.jsx` — "Still have questions?" CTA
- Added a contact section at the bottom of the FAQ page with an "Email Support" button linking to `niko.barciak@hermaai.com`

### 4. `src/components/Footer.jsx` — contact updates
- CTA "Contact us" link changed from Calendly URL → `mailto:niko.barciak@hermaai.com`
- Added Email icon button next to LinkedIn and GitHub in the brand column

---

# Change Log — 2026-04-09

## Session: setup.md integration + home page gap fixes

### 1. `public/setup.md` — model table correction
- Removed `claude-opus-4-6` and `claude-sonnet-4-6` rows from Available Models — only `herma-auto` is supported through the router
- Added a note that Herma's router selects the underlying model automatically

### 2. Integration files — setup.md reference + tool setup sections
Each file now includes tool-specific instructions for routing the AI tool itself through Herma (not just using Herma in code), plus a link to `https://hermaai.com/setup.md`.

- `public/integration/CLAUDE.md` — added Claude Code one-liner installer, manual env var setup (`ANTHROPIC_BASE_URL`, `ANTHROPIC_AUTH_TOKEN`, `ANTHROPIC_MODEL`), and explanation of why `AUTH_TOKEN` is used instead of `API_KEY`
- `public/integration/AGENTS.md` — added Aider, Continue.dev, Cursor, and Windsurf setup blocks
- `public/integration/cursor-rules.txt` — added Cursor Settings UI steps and env var alternative
- `public/integration/windsurf-rules.txt` — added Windsurf Settings UI steps

### 3. `public/llms.txt` + `public/llms-full.txt` — setup.md link added
- `llms.txt`: added `https://hermaai.com/setup.md` at the top of the AI Coding Tool Integration section
- `llms-full.txt`: added bolded "Full setup guide" link with description of covered tools

### 4. `public/sitemap.xml` — setup.md entry
- Added `/setup.md` with `changefreq: monthly`, `priority: 0.7`

### 5. `src/pages/Documentation.jsx` — new "Route Your AI Tool Through Herma" section
- Added between "Quick Start with Coding Tools" and "Base URL"
- `TabGroup` with 4 tabs: Claude Code (one-liner + env vars), Cursor, Windsurf, Aider/Continue.dev
- "View full setup guide →" link to `/setup.md`

### 6. `src/App.jsx` — removed PricingTeaser
- Removed `PricingTeaser` import and `<PricingTeaser />` from the home page
- **Why:** Component used `animate-on-scroll` CSS classes but never attached IntersectionObserver refs, so all content rendered at `opacity: 0` while still occupying full layout height — creating a large blank gap between "Drop-in Replacement" and "How Herma Performs". Content also showed outdated subscription pricing that no longer matches the credits model.

### 7. `src/components/FAQAccordion.jsx` — fixed invisible content + outdated copy
- Removed broken `animate-on-scroll fade-up` classes from heading, FAQ item divs, and footer link
- Removed unused `useScrollAnimation` import and call
- **Why:** Same root cause as PricingTeaser — `useScrollAnimation()` return value was discarded, so no IntersectionObserver was attached and all content stayed at `opacity: 0`, creating another blank gap below "How Herma Performs"
- Updated FAQ answer for "How much does Herma cost?" — removed mention of "Monthly subscriptions ($10, $25, $50/mo)", replaced with pay-as-you-go language

---

# Change Log — 2026-04-04

## Session: Admin Customer Lookup Tab

### 1. New "Customers" Tab in Admin Dashboard

Added a Customer Lookup tab to the admin dashboard so individual customers can be looked up by email to verify credit balance, subscription status, and usage.

**Files changed:**

- `src/components/AdminSidebar.jsx` — added `customers` entry to `BUSINESS_NAV` array with a users icon (inline SVG added to `ICONS` map)
- `src/pages/AdminDashboard.jsx` — added `getAdminCustomerDetail` to imports; added `customers: 'Customer Lookup'` to `TAB_LABELS`; added `{tab === 'customers' && <CustomersTab customers={retention?.customers || []} />}` to tab rendering; added `CustomersTab` component (~170 lines, inserted after `RetentionTab`)
- `src/services/hermaApi.js` — added `getAdminCustomerDetail(email)` function calling `GET /admin/analytics/customers/lookup?email=`

**How it works:**

- **List view**: searchable/sortable/paginated table of all customers sourced from the existing `getRetentionOverview()` call (no extra network request). Columns: Email, Status, 7d Requests, Total Spend, Last Seen, View button.
- **Detail view**: clicking View on any row fetches `GET /admin/analytics/customers/lookup?email=` and shows four stat cards — Credit Balance, Subscription Plan, Requests (7d), Total Spend — plus a full account details section (Customer ID, Last Active, Weekly Trend, Subscription Status, 30d requests, Total requests).
- If the detail API call fails, the tab still works using retention data and shows a note explaining that the `/admin/analytics/customers/lookup` backend endpoint is required for balance/subscription fields.

---

# Change Log — 2026-04-03

## Session: API Key Prefix Fix + Docs Continuity

### 1. API Key Prefix: `hk_` / `hk-` → `herma_sk`

Fixed incorrect API key prefix across all source and public files.

**Files changed:**
- `src/pages/Documentation.jsx` — quick start step 2 description, auth header example, all cURL/Python/Node.js/fetch code examples
- `public/llms.txt` — env var description
- `public/llms-full.txt` — env var block and all inline placeholder keys (`your-herma-key`)
- `public/integration/.env.example` — placeholder value
- `public/integration/AGENTS.md` — config table
- `public/integration/CLAUDE.md` — config table

---

### 2. Security Warning in Integration Wizard

Added a red warning notice at the bottom of Step 2 ("Choose Your Language") in the API key creation flow.

**File changed:** `src/components/IntegrationWizard.jsx`

**Text added:** "Never deploy code with your API key visible. Always load it from an environment variable — never hardcode it in source files."

---

### 3. Claude Code CLAUDE.md Skill Rewrite

Rewrote the Claude Code tab content in the "Quick Start with Coding Tools" section of the docs. The old content was a generic configuration reference. The new content is a setup guide that:

- Includes a "How to Get an API Key" section with numbered steps Claude Code should print for the user
- Steps cover: signing up, creating a key, copying it, adding it to `.env`, and installing the OpenAI SDK
- Retains the full Python and Node.js code examples with `print` / `console.log` output lines
- Keeps the rules and reference sections

**File changed:** `src/pages/Documentation.jsx` (Claude Code tab in `IntegrationTabGroup`)

---

### 4. Examples Section Moved in Docs

Moved the "Examples" section (Basic Request + Streaming code examples) from immediately after "Chat Completions / Request Body" to just above "Rate Limits" at the bottom of the page.

**New doc section order:**
1. Quick Start
2. Quick Start with Coding Tools
3. Base URL
4. Authentication
5. Chat Completions (endpoint + request body)
6. Models
7. Response Format
8. Error Codes
9. Test the Router
10. List Available Models
11. **Examples** ← moved here
12. Rate Limits

**File changed:** `src/pages/Documentation.jsx`

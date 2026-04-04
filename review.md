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

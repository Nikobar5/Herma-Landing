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

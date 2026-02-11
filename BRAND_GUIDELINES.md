# Herma Brand Guidelines

> The definitive reference for Herma's visual identity, design system, and brand application across all digital touchpoints. This document serves as both a human-readable style guide and a source of truth for frontend implementation.

---

## 1. Brand Philosophy

**Mission:** Simplify AI access by intelligently routing requests to the best model — maximizing quality while respecting privacy and minimizing cost.

**Brand Personality:**
- **Classical meets Modern** — The Hermes-inspired identity bridges ancient wisdom with cutting-edge AI
- **Effortless Sophistication** — Premium feel without visual noise
- **Trust through Transparency** — Clean, honest design that mirrors how we handle data
- **Minimal by Design** — Every element earns its place; nothing decorative, everything functional

**Design Principles (ranked):**
1. **Clarity** — Information hierarchy is immediately obvious
2. **Restraint** — Favor negative space over added elements
3. **Warmth** — Dark interfaces that feel inviting, not cold
4. **Consistency** — Identical patterns across every screen and state

---

## 2. Logo

### Primary Logo
The Herma logomark is a white line-art illustration of a classical Greek bust (Hermes), rendered in a continuous-stroke style. It represents intelligence, guidance, and the bridging of worlds — core to Herma's AI routing mission.

**File:** `Herma (1000 x 1000 px).png`
**Format:** 1000x1000px PNG, white strokes on black background

### Logo Variations

| Variation | Usage | Background |
|-----------|-------|------------|
| **Primary (white on dark)** | Default for all dark surfaces | `--bg-primary` or darker |
| **Dark on light** | Print, light-mode contexts (if applicable) | White or light surfaces |
| **Monochrome white** | Favicons, small sizes, watermarks | Any dark surface |

### Logo Usage Rules

**DO:**
- Maintain minimum clear space equal to the height of the "ear" around the logo
- Use on backgrounds with sufficient contrast (minimum 4.5:1 ratio)
- Scale proportionally — never stretch or distort
- Use the logomark alone at small sizes (< 32px), wordmark alongside at larger sizes

**DON'T:**
- Place on busy or patterned backgrounds
- Add drop shadows, glows, or outlines to the logo
- Rotate, skew, or crop the logomark
- Use colors other than white or the approved dark variant
- Place on backgrounds lighter than `--bg-tertiary` without the dark variant

### Wordmark

The Herma wordmark uses the stylized text **HΞRMΛ** (with Greek character substitutions) in the heading font (Space Grotesk). This is used alongside or independently from the logomark.

**Usage:** Headlines, hero sections, navigation bar (paired with logomark), footer copyright
**Font:** Space Grotesk, weight 500, letter-spacing 0.2em
**CSS class:** `.herma-wordmark`
**Casing:** Always all-caps: `HΞRMΛ` in the wordmark, `HERMA` in plain text display contexts
**In prose:** Use title-case "Herma" in running body text (e.g., "Herma routes your request")
**Minimum size:** 14px

---

## 3. Color System

### Dark Mode (Primary Theme)

Herma uses a dark-first color system. All surfaces, components, and states derive from these tokens.

#### Backgrounds
```css
--bg-primary:    #09090B;   /* Page background — near-black with slight warmth */
--bg-secondary:  #111114;   /* Cards, panels, sidebar */
--bg-tertiary:   #1A1A1F;   /* Elevated cards, modals, dropdowns */
--bg-hover:      #222228;   /* Hover states on interactive surfaces */
--bg-active:     #2A2A32;   /* Active/pressed states */
--bg-input:      #111114;   /* Input fields, text areas */
```

#### Text
```css
--text-primary:    #F4F4F5;   /* Primary text — off-white, not pure white */
--text-secondary:  #A1A1AA;   /* Secondary text, descriptions, metadata */
--text-tertiary:   #71717A;   /* Placeholder text, disabled states */
--text-inverse:    #09090B;   /* Text on light/accent backgrounds */
```

#### Accent Colors
```css
--accent-primary:   #818CF8;   /* Primary accent — soft indigo/periwinkle */
--accent-hover:     #6366F1;   /* Accent hover state — deeper indigo */
--accent-muted:     #818CF8/15; /* Accent at 15% opacity — subtle tints */
--accent-secondary: #9CA9D6;   /* Legacy periwinkle — secondary accent */
```

#### Semantic Colors
```css
--success:   #34D399;   /* Success states, positive indicators */
--warning:   #FBBF24;   /* Warning states, caution indicators */
--error:     #F87171;   /* Error states, destructive actions */
--info:      #60A5FA;   /* Informational states */
```

#### Borders & Dividers
```css
--border-primary:   rgba(255, 255, 255, 0.08);  /* Default borders */
--border-secondary: rgba(255, 255, 255, 0.12);  /* Emphasized borders */
--border-hover:     rgba(255, 255, 255, 0.16);  /* Hover border states */
--border-accent:    rgba(129, 140, 248, 0.3);   /* Accent-colored borders */
```

#### Shadows
```css
--shadow-sm:  0 1px 2px rgba(0, 0, 0, 0.3);
--shadow-md:  0 4px 8px rgba(0, 0, 0, 0.3);
--shadow-lg:  0 8px 24px rgba(0, 0, 0, 0.4);
--shadow-glow: 0 0 20px rgba(129, 140, 248, 0.15);  /* Accent glow effect */
```

### Color Palette Summary

| Role | Hex | Usage |
|------|-----|-------|
| Near Black | `#09090B` | Page backgrounds |
| Dark Surface | `#111114` | Cards, sidebar, inputs |
| Elevated Surface | `#1A1A1F` | Modals, dropdowns, hover cards |
| Off White | `#F4F4F5` | Primary text |
| Muted Gray | `#A1A1AA` | Secondary text |
| Dim Gray | `#71717A` | Tertiary text, placeholders |
| Soft Indigo | `#818CF8` | Primary accent, links, CTAs |
| Deep Indigo | `#6366F1` | Hover/active accent |
| Periwinkle | `#9CA9D6` | Secondary accent (legacy) |

### Color Accessibility
- All text meets WCAG AA (4.5:1) minimum contrast against its background
- Interactive elements meet WCAG AA (3:1) minimum contrast
- Never rely on color alone to convey meaning — always pair with icons or text

---

## 4. Typography

### Font Stack

Herma uses a **two-font system**: Space Grotesk as the primary sans-serif for all UI, headings, and user-authored text, with PT Serif as an editorial accent for AI-generated content and long-form descriptions. This follows the Anthropic model (Styrene + Tiempos) of pairing a technical sans with an editorial serif.

| Role | Font Family | Weights | Fallbacks | Usage |
|------|-------------|---------|-----------|-------|
| **Heading** | Space Grotesk | 500, 600, 700 | -apple-system, sans-serif | Section titles, hero headlines, wordmark |
| **UI** | Space Grotesk | 300, 400, 500, 600 | -apple-system, sans-serif | Buttons, nav, labels, inputs, sidebar, user messages |
| **Body** | PT Serif | 400, 700 | Georgia, serif | AI chat responses, landing page descriptions, long-form prose |
| **Code** | Inconsolata | 400, 500 | 'Courier New', monospace | Code blocks, inline code, monetary values |

```css
--font-heading: 'Space Grotesk', -apple-system, sans-serif;
--font-ui:      'Space Grotesk', -apple-system, sans-serif;
--font-body:    'PT Serif', Georgia, serif;
--font-code:    'Inconsolata', 'Courier New', monospace;
```

> **Note:** `--font-heading` and `--font-ui` resolve to the same font (Space Grotesk). They are kept as separate tokens for semantic clarity — headings use bolder weights (500-700) while UI elements use lighter weights (400-500).

### Wordmark Typography

The HΞRMΛ wordmark has its own CSS class:

```css
.herma-wordmark {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 500;
  letter-spacing: 0.2em;
}
```

Apply via `className="herma-wordmark"` on any HΞRMΛ or HERMA display text. Do not add decorative pseudo-elements or accents to the wordmark.

### Type Scale

Based on a golden ratio (1.618) from a 16px base:

| Token | Size | Weight | Font | Usage |
|-------|------|--------|------|-------|
| `--text-hero` | 3.5rem (56px) | 700 | Heading | Hero headlines only |
| `--text-h1` | 2.5rem (40px) | 700 | Heading | Page titles |
| `--text-h2` | 1.75rem (28px) | 600 | Heading | Section headings |
| `--text-h3` | 1.25rem (20px) | 600 | Heading | Subsection headings |
| `--text-body` | 1rem (16px) | 400 | Body | AI responses, descriptions |
| `--text-body-sm` | 0.875rem (14px) | 400 | Body | Secondary long-form content |
| `--text-ui` | 0.875rem (14px) | 500 | UI | Buttons, labels, nav |
| `--text-ui-sm` | 0.75rem (12px) | 500 | UI | Badges, metadata |
| `--text-caption` | 0.625rem (10px) | 400 | UI | Disclaimers, fine print |
| `--text-code` | 0.875rem (14px) | 400 | Code | Code blocks, inline code |

### Line Heights
```css
--leading-tight:   1.25;   /* Headings */
--leading-normal:  1.5;    /* Body text */
--leading-relaxed: 1.625;  /* Long-form reading */
```

### Typography Rules

**Font assignment by context:**

| Context | Font | Rationale |
|---------|------|-----------|
| Headings (all sizes) | `--font-heading` (Space Grotesk) | Clean, geometric, confident |
| Buttons, nav, labels, badges | `--font-ui` (Space Grotesk) | Consistent UI voice |
| User-typed messages (chat input) | `--font-ui` (Space Grotesk) | User's voice = sans-serif |
| AI chat responses (body text) | `--font-body` (PT Serif) | AI's voice = editorial serif |
| AI chat response headings | `--font-heading` (Space Grotesk) | Structure within responses |
| Landing page descriptions | `--font-body` (PT Serif) | Editorial warmth |
| Sidebar conversation titles | `--font-ui` (Space Grotesk) | UI element, not prose |
| Code (inline and block) | `--font-code` (Inconsolata) | Always monospace |
| Monetary values (balance, cost) | `--font-code` (Inconsolata) | Tabular alignment |

**General rules:**
- Never use PT Serif for headings, buttons, labels, or navigation
- Never use more than 2 font families on a single screen
- Maximum line length: 65 characters for body text (use `max-w-prose` or `max-w-3xl`)
- The wordmark HΞRMΛ always uses the `.herma-wordmark` class, never arbitrary font styling

---

## 5. Spacing & Layout

### Spacing Scale
```css
--space-1:  0.25rem;  /* 4px  — tight padding, icon gaps */
--space-2:  0.5rem;   /* 8px  — compact padding */
--space-3:  0.75rem;  /* 12px — standard gap */
--space-4:  1rem;     /* 16px — standard padding */
--space-5:  1.5rem;   /* 24px — section padding */
--space-6:  2rem;     /* 32px — large gaps */
--space-8:  3rem;     /* 48px — section margins */
--space-10: 4rem;     /* 64px — page sections */
--space-12: 6rem;     /* 96px — hero spacing */
```

### Layout Containers
```css
--container-sm:  640px;   /* Narrow content (chat messages, forms) */
--container-md:  768px;   /* Medium content (documentation) */
--container-lg:  1024px;  /* Wide content (dashboards) */
--container-xl:  1200px;  /* Full-width content (landing page) */
```

### Grid System
- Use CSS Grid or Flexbox — never float-based layouts
- Standard grid gap: `--space-3` (12px) for tight grids, `--space-4` (16px) for standard
- Card grids: 1 column mobile, 2 columns tablet (640px+), 3-4 columns desktop (1024px+)

### Responsive Breakpoints
```css
--bp-sm:  640px;   /* Small tablets, large phones */
--bp-md:  768px;   /* Tablets */
--bp-lg:  1024px;  /* Small desktops */
--bp-xl:  1280px;  /* Standard desktops */
--bp-2xl: 1536px;  /* Large displays */
```

---

## 6. Border Radius

```css
--radius-sm:  6px;    /* Badges, inline code, small chips */
--radius-md:  8px;    /* Buttons, inputs, small cards */
--radius-lg:  12px;   /* Cards, panels, modals */
--radius-xl:  16px;   /* Large cards, hero elements */
--radius-2xl: 24px;   /* Feature cards, input bars */
--radius-full: 9999px; /* Circular elements, avatars, pills */
```

### Radius Rules
- **Buttons:** `--radius-md` (8px) for standard, `--radius-full` for icon-only buttons
- **Cards:** `--radius-lg` (12px) for standard, `--radius-xl` (16px) for featured
- **Input fields:** `--radius-2xl` (24px) for the chat input bar, `--radius-md` for form fields
- **Avatars:** `--radius-lg` (12px) for square avatars, `--radius-full` for circular

---

## 7. Component Patterns

### Buttons

| Variant | Background | Text | Border | Usage |
|---------|-----------|------|--------|-------|
| **Primary** | `--accent-primary` | `--text-inverse` | none | Main CTAs |
| **Secondary** | transparent | `--text-primary` | `--border-secondary` | Secondary actions |
| **Ghost** | transparent | `--text-secondary` | none | Tertiary actions, icon buttons |
| **Danger** | `--error` | white | none | Destructive actions |

**Button sizing:**
- Standard: `h-10 px-4 text-sm`
- Small: `h-8 px-3 text-xs`
- Icon-only: `w-8 h-8` or `w-10 h-10`, always `rounded-full`

### Cards
```
Background:  --bg-secondary
Border:      --border-primary (1px solid)
Radius:      --radius-lg
Padding:     --space-4 to --space-5
Hover:       border-color transitions to --border-secondary, optional --shadow-md
```

### Input Fields
```
Background:  --bg-input
Border:      --border-primary (1px solid)
Radius:      --radius-md (forms) or --radius-2xl (chat input)
Text:        --text-primary
Placeholder: --text-tertiary
Focus:       border-color transitions to --accent-primary, add --shadow-glow
```

### Navigation Bar
```
Background:  --bg-primary with backdrop-blur (or --bg-secondary)
Height:      64px (h-16)
Position:    fixed top-0, z-50
Border:      bottom border --border-primary
Logo:        Logomark + HΞRMΛ wordmark, left-aligned
Links:       --text-secondary, hover: --text-primary
CTA:         Primary button variant, right-aligned
```

### Sidebar (Chat)
```
Background:  --bg-secondary
Width:       288px (w-72)
Items:       --text-secondary, hover: --bg-hover, active: --bg-active
Section labels: --text-tertiary, uppercase, text-xs, tracking-wide
```

---

## 8. Iconography

### Style
- **Line icons only** — consistent with the logo's line-art aesthetic
- Stroke width: 1.5px for standard (24px), 2px for small (16px)
- Source: Heroicons (outline set) or custom SVGs matching the style
- Color: inherits from parent text color (`currentColor`)

### Icon Sizing
| Context | Size | Example |
|---------|------|---------|
| Navigation | 20px (w-5 h-5) | Sidebar icons, nav items |
| Inline | 16px (w-4 h-4) | Buttons with text, list markers |
| Feature | 24px (w-6 h-6) | Feature cards, empty states |
| Hero | 32-48px | Landing page features |

---

## 9. Animation & Motion

### Timing
```css
--duration-fast:   150ms;   /* Hover states, toggles */
--duration-normal: 200ms;   /* Most transitions */
--duration-slow:   300ms;   /* Page transitions, modals */
--easing-default:  cubic-bezier(0.4, 0, 0.2, 1);  /* Smooth ease */
--easing-in:       cubic-bezier(0.4, 0, 1, 1);     /* Accelerate */
--easing-out:      cubic-bezier(0, 0, 0.2, 1);     /* Decelerate */
```

### Motion Rules
- **Hover states:** color/background transitions at `--duration-fast`
- **Focus states:** border/shadow transitions at `--duration-normal`
- **Page elements:** fade-in-up at `--duration-slow` with staggered delays
- **Never use bounce or elastic easing** — they conflict with the brand's refined tone
- **Reduce motion:** Always respect `prefers-reduced-motion` — disable non-essential animations

### Streaming Cursor
The chat streaming indicator is a pulsing vertical bar:
```css
/* Streaming cursor */
width: 2px;
height: 1em;
background: var(--accent-primary);
animation: pulse 1s ease-in-out infinite;
```

---

## 10. Imagery & Illustration

### Photography
- Not currently used — prefer illustrations and UI screenshots
- If used: high contrast, muted color grading, avoid stock-photo feel

### Illustrations
- Follow the line-art style of the logomark
- White strokes on dark backgrounds
- Consistent stroke weight with the logo
- Subject matter: classical/mythological themes adapted to technology

### Product Screenshots
- Always show on dark backgrounds matching `--bg-primary`
- Use subtle `--shadow-lg` for depth
- Round corners with `--radius-lg`

---

## 11. Voice & Tone

### Writing Style
- **Concise** — Say it in fewer words. "Ask anything" not "Feel free to ask us any question you might have"
- **Direct** — Use active voice. "Herma routes your request" not "Your request is routed by Herma"
- **Confident but not arrogant** — "The best model for the job" not "The only AI platform you'll ever need"
- **Technical when needed** — Don't dumb down for developers; be precise

### Terminology
| Use | Don't Use |
|-----|-----------|
| Route / Routing | Redirect, Forward |
| Model | AI, Algorithm, Bot |
| Private model | Local model, Self-hosted |
| Public model | Cloud model, External |
| Credits | Tokens, Coins, Points |
| Request | Query, Prompt (in routing context) |

### UI Copy
- **Buttons:** Imperative verbs — "Send", "Copy", "Regenerate", not "Submit your message"
- **Placeholders:** Inviting, brief — "Ask anything...", "Ask a follow-up..."
- **Errors:** Honest, actionable — "Couldn't connect. Check your network and try again."
- **Empty states:** Encouraging — never show a blank screen without guidance

---

## 12. Dos and Don'ts

### DO
- Use the dark theme as the default for all surfaces
- Maintain generous whitespace (negative space) between sections
- Use PT Serif (`--font-body`) only for AI chat responses and long-form editorial content
- Use Space Grotesk (`--font-ui`) for all interactive UI: buttons, inputs, nav, sidebar, labels
- Keep the accent color (soft indigo) for interactive elements only
- Test all text against dark backgrounds for contrast compliance
- Use the HΞRMΛ wordmark in headings, never the plain "Herma" spelling

### DON'T
- Mix light and dark backgrounds on the same page
- Use more than one accent color per screen
- Apply the accent color to large surface areas (backgrounds, full-width bars)
- Use pure white (#FFFFFF) for text — always use off-white (`--text-primary`)
- Use pure black (#000000) for backgrounds — always use near-black (`--bg-primary`)
- Add decorative gradients, patterns, or textures to backgrounds
- Use rounded-full on rectangular cards or non-icon buttons

---

## 13. Implementation Reference

### CSS Custom Properties (copy to index.css)

```css
:root {
  /* Backgrounds */
  --bg-primary:    #09090B;
  --bg-secondary:  #111114;
  --bg-tertiary:   #1A1A1F;
  --bg-hover:      #222228;
  --bg-active:     #2A2A32;
  --bg-input:      #111114;

  /* Text */
  --text-primary:    #F4F4F5;
  --text-secondary:  #A1A1AA;
  --text-tertiary:   #71717A;
  --text-inverse:    #09090B;

  /* Accent */
  --accent-primary:   #818CF8;
  --accent-hover:     #6366F1;
  --accent-muted:     rgba(129, 140, 248, 0.15);
  --accent-secondary: #9CA9D6;

  /* Semantic */
  --success: #34D399;
  --warning: #FBBF24;
  --error:   #F87171;
  --info:    #60A5FA;

  /* Borders */
  --border-primary:   rgba(255, 255, 255, 0.08);
  --border-secondary: rgba(255, 255, 255, 0.12);
  --border-hover:     rgba(255, 255, 255, 0.16);
  --border-accent:    rgba(129, 140, 248, 0.3);

  /* Shadows */
  --shadow-sm:   0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md:   0 4px 8px rgba(0, 0, 0, 0.3);
  --shadow-lg:   0 8px 24px rgba(0, 0, 0, 0.4);
  --shadow-glow: 0 0 20px rgba(129, 140, 248, 0.15);

  /* Typography — Space Grotesk is the primary sans-serif for both heading and UI */
  --font-heading: 'Space Grotesk', -apple-system, sans-serif;
  --font-ui:      'Space Grotesk', -apple-system, sans-serif;
  --font-body:    'PT Serif', Georgia, serif;
  --font-code:    'Inconsolata', 'Courier New', monospace;

  /* Radius */
  --radius-sm:   6px;
  --radius-md:   8px;
  --radius-lg:   12px;
  --radius-xl:   16px;
  --radius-2xl:  24px;
  --radius-full: 9999px;

  /* Spacing */
  --space-1:  0.25rem;
  --space-2:  0.5rem;
  --space-3:  0.75rem;
  --space-4:  1rem;
  --space-5:  1.5rem;
  --space-6:  2rem;
  --space-8:  3rem;
  --space-10: 4rem;
  --space-12: 6rem;

  /* Motion */
  --duration-fast:   150ms;
  --duration-normal: 200ms;
  --duration-slow:   300ms;
  --ease-default:    cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Tailwind Mapping

When using Tailwind utility classes, prefer these patterns:

| Token | Tailwind Equivalent |
|-------|-------------------|
| `--bg-primary` | `bg-[#09090B]` or `bg-zinc-950` |
| `--bg-secondary` | `bg-[#111114]` or `bg-zinc-900` |
| `--text-primary` | `text-[#F4F4F5]` or `text-zinc-100` |
| `--text-secondary` | `text-[#A1A1AA]` or `text-zinc-400` |
| `--accent-primary` | `text-indigo-400` / `bg-indigo-400` |
| `--accent-hover` | `text-indigo-500` / `bg-indigo-500` |

---

## 14. Competitive Positioning (Visual)

How Herma's brand compares to peer AI companies:

| Aspect | Claude (Anthropic) | Perplexity | OpenAI | **Herma** |
|--------|-------------------|------------|--------|-----------|
| Theme | Warm cream (light) | Warm cream (light) | White (light) | **Dark-first** |
| Accent | Terracotta/sienna | Teal | Black/green | **Soft indigo** |
| Primary font | Styrene (sans) | FK Grotesk (sans) | OpenAI Sans (custom) | **Space Grotesk (heading + UI)** |
| Body font | Tiempos (serif) | Newsreader (serif) | Sans-serif | **PT Serif — editorial accent** |
| Logo style | Abstract spark | Abstract grid | Abstract blossom | **Classical figurative (Hermes bust)** |
| Personality | Warm, approachable | Minimal, utilitarian | Bold, corporate | **Sophisticated, classical-modern** |
| Differentiator | Safety emphasis | Search-first | Scale/power | **Routing intelligence, privacy** |

**Key differentiators:**
- Herma is the only major AI interface using a **dark-first theme** with warm undertones
- The **serif body text** creates a distinct reading experience vs. the all-sans-serif competitors
- The **classical figurative logo** stands apart from abstract tech marks
- The **indigo accent** occupies a unique color position between Claude's terracotta and Perplexity's teal

---

*Last updated: 2026-02-10*
*Version: 3.0 — Typography consolidation (Space Grotesk primary, Work Sans removed)*

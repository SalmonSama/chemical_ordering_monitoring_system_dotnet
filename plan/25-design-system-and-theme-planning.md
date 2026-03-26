# 25 — Design System and Theme Planning

This document defines the visual design system, theme architecture, color palette, typography, component styling conventions, and accessibility expectations. The system is designed for **enterprise daily use** — comfortable, readable, and not visually harsh.

---

## Design Philosophy

| Principle | Guideline |
|---|---|
| **Eye-friendly for long use** | Avoid harsh contrast, saturated backgrounds, or aggressive accent colors. Use soft neutrals and restrained accents. |
| **Data readability first** | Tables, numbers, and status indicators must be easy to scan. Prioritize clear typography and generous spacing. |
| **Semantic color only** | Red, yellow, green are **reserved for meaning** (error/expired, warning, success/active). They never appear as layout backgrounds or branding. |
| **Enterprise professional** | Clean, modern, and professional — not playful, not dark-by-default. Inspired by Notion, Linear, Vercel dashboard aesthetics. |
| **Accessible** | WCAG 2.1 AA compliance minimum for all text and interactive elements. |

---

## Theme Architecture

### Dual Theme Support

The system supports both a **light theme** (default) and a **dark theme**:

| Aspect | Light Theme | Dark Theme |
|---|---|---|
| **Default** | ✅ Yes — default on first visit | ❌ Activated via toggle |
| **Background** | Warm off-white / soft gray | Slate / charcoal (not pure black) |
| **Emphasis** | Dark text on light backgrounds | Light text on dark backgrounds |
| **Cards** | White with subtle border | Elevated dark surface |
| **Sidebar** | Slightly tinted neutral | Deepened dark surface |

### Theme Toggle

- Located in the top header bar (sun ☀ / moon 🌙 icon).
- Clicking toggles between light and dark themes.
- Transition: smooth 200ms CSS transition on background and text colors.
- **Persistence:** Saved to `localStorage` under key `theme-preference`. On load, the app checks:
  1. `localStorage` value (if set, use it).
  2. Else, use `prefers-color-scheme` media query.
  3. Else, default to light.

### CSS Implementation Approach

Use CSS custom properties (variables) on `:root` and `[data-theme="dark"]`:

```css
:root {
  --color-bg-primary: #f8f9fb;
  --color-bg-surface: #ffffff;
  --color-text-primary: #1a1d23;
  /* ... */
}

[data-theme="dark"] {
  --color-bg-primary: #0f1117;
  --color-bg-surface: #1a1d27;
  --color-text-primary: #e4e6eb;
  /* ... */
}
```

All components reference these variables, not hard-coded colors.

---

## Color Palette

### Light Theme

| Token | Value | Usage |
|---|---|---|
| `--color-bg-primary` | `#f8f9fb` (warm off-white) | Page background |
| `--color-bg-surface` | `#ffffff` | Cards, modals, dropdowns |
| `--color-bg-sidebar` | `#f1f3f7` | Sidebar background |
| `--color-bg-header` | `#ffffff` | Top header |
| `--color-bg-hover` | `#eef1f5` | Row/item hover state |
| `--color-bg-active` | `#e8ecf2` | Active nav item |
| `--color-bg-stripe` | `#fafbfc` | Subtle table row alternation |
| `--color-border` | `#e2e5ea` | Borders, dividers |
| `--color-border-focus` | `#6b7df5` | Focus ring |
| `--color-text-primary` | `#1a1d23` | Body text |
| `--color-text-secondary` | `#5a6070` | Muted/secondary text |
| `--color-text-tertiary` | `#8b91a0` | Hints, placeholders |

### Dark Theme

| Token | Value | Usage |
|---|---|---|
| `--color-bg-primary` | `#0f1117` (deep slate) | Page background |
| `--color-bg-surface` | `#1a1d27` | Cards, modals |
| `--color-bg-sidebar` | `#141722` | Sidebar |
| `--color-bg-header` | `#1a1d27` | Top header |
| `--color-bg-hover` | `#252a36` | Hover state |
| `--color-bg-active` | `#2a3040` | Active nav item |
| `--color-bg-stripe` | `#161924` | Subtle row alternation |
| `--color-border` | `#2a3040` | Borders |
| `--color-border-focus` | `#818cf8` | Focus ring |
| `--color-text-primary` | `#e4e6eb` | Body text |
| `--color-text-secondary` | `#9ca3b4` | Muted text |
| `--color-text-tertiary` | `#6b7280` | Hints |

### Accent Colors (Shared Across Themes)

| Token | Value | Usage |
|---|---|---|
| `--color-accent` | `#6366f1` (indigo-500) | Primary interactive elements, links, active sidebar |
| `--color-accent-hover` | `#5558e3` | Hover on accent elements |
| `--color-accent-soft` | `#eef2ff` (light) / `#1e1b4b` (dark) | Accent background tint |

### Semantic Colors (Status-Only)

| Token | Light Value | Dark Value | Usage |
|---|---|---|---|
| `--color-success` | `#16a34a` | `#22c55e` | Active, received, normal |
| `--color-success-bg` | `#dcfce7` | `#052e16` | Success badge background |
| `--color-warning` | `#d97706` | `#f59e0b` | Warning, near-expiry, below-min |
| `--color-warning-bg` | `#fef3c7` | `#422006` | Warning badge background |
| `--color-danger` | `#dc2626` | `#ef4444` | Error, expired, quarantine, critical |
| `--color-danger-bg` | `#fee2e2` | `#450a0a` | Danger badge background |
| `--color-info` | `#2563eb` | `#60a5fa` | Informational, pending, in-progress |
| `--color-info-bg` | `#dbeafe` | `#172554` | Info badge background |
| `--color-neutral` | `#6b7280` | `#9ca3af` | Cancelled, inactive, not applicable |
| `--color-neutral-bg` | `#f3f4f6` | `#1f2937` | Neutral badge background |

> **Rule:** Red, yellow, green are **never** used as layout backgrounds, header colors, or branding. They appear only in status badges, alerts, and inline indicators.

---

## Typography

### Font Stack

```css
--font-family-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-family-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
```

Load **Inter** from Google Fonts (weights: 400, 500, 600, 700).

### Type Scale

| Token | Size | Weight | Usage |
|---|---|---|---|
| `--text-xs` | 11px / 0.6875rem | 400 | Badges, tiny labels |
| `--text-sm` | 13px / 0.8125rem | 400 | Table cells, secondary info |
| `--text-base` | 14px / 0.875rem | 400 | Body text, form labels |
| `--text-md` | 15px / 0.9375rem | 500 | Emphasized body |
| `--text-lg` | 18px / 1.125rem | 600 | Section headers |
| `--text-xl` | 22px / 1.375rem | 600 | Page titles |
| `--text-2xl` | 28px / 1.75rem | 700 | Dashboard metric numbers |
| `--text-3xl` | 34px / 2.125rem | 700 | Large dashboard counts |

### Table Typography

- Cell text: `--text-sm` (13px).
- Header text: `--text-sm` weight 600, uppercase letter-spacing 0.03em.
- Numeric columns: right-aligned, monospace font for alignment.

---

## Component Styling

### Cards

```
┌─────────────────────────────┐
│  Card Title            →    │  ← Header with optional action
│                             │
│  Content area               │
│  (metrics, mini-list,       │
│   chart, or summary)        │
│                             │
│  View All →                 │  ← Footer link
└─────────────────────────────┘
```

| Property | Light | Dark |
|---|---|---|
| Background | `--color-bg-surface` | `--color-bg-surface` |
| Border | 1px solid `--color-border` | 1px solid `--color-border` |
| Border radius | 8px | 8px |
| Shadow | `0 1px 3px rgba(0,0,0,0.04)` | `0 1px 3px rgba(0,0,0,0.3)` |
| Padding | 20px | 20px |
| Hover | Slight shadow increase | Slight shadow increase |

### Tables

| Property | Value |
|---|---|
| Header background | `--color-bg-sidebar` |
| Header text | `--color-text-secondary`, uppercase, 600 weight |
| Row height | 44px |
| Row alternation | Every other row: `--color-bg-stripe` |
| Row hover | `--color-bg-hover` |
| Cell padding | 8px 12px |
| Border | Bottom border on each row: `--color-border` |
| Selected row | Accent-tinted background (`--color-accent-soft`) |
| Sticky header | Position sticky, top: 0, z-index above rows |

### Status Badges / Chips

Pill-shaped badges with semantic background and text:

| Status Meaning | Background | Text | Icon |
|---|---|---|---|
| Active / Normal / Received | `--color-success-bg` | `--color-success` | ✅ or filled circle |
| Warning / Near-Expiry / Below-Min | `--color-warning-bg` | `--color-warning` | ⚠️ or filled circle |
| Critical / Expired / Quarantine | `--color-danger-bg` | `--color-danger` | 🔴 or filled circle |
| Pending / In-Progress | `--color-info-bg` | `--color-info` | 🔵 or filled circle |
| Cancelled / Inactive | `--color-neutral-bg` | `--color-neutral` | ⚪ or filled circle |

Badge properties: `border-radius: 9999px; padding: 2px 10px; font-size: --text-xs; font-weight: 600`.

### Buttons

| Variant | Background | Text | Border | Usage |
|---|---|---|---|---|
| **Primary** | `--color-accent` | White | None | Submit, approve, save |
| **Secondary** | Transparent | `--color-accent` | 1px accent | Cancel, back, secondary actions |
| **Danger** | `--color-danger` | White | None | Reject, dispose, delete |
| **Ghost** | Transparent | `--color-text-secondary` | None | Tertiary actions, export |

All buttons: `border-radius: 6px; padding: 8px 16px; font-weight: 500; transition: all 150ms`.

### Form Inputs

| Property | Value |
|---|---|
| Background | `--color-bg-surface` |
| Border | 1px solid `--color-border` |
| Border (focus) | 2px solid `--color-border-focus` |
| Border radius | 6px |
| Height | 38px (single-line) |
| Padding | 8px 12px |
| Font | `--text-base` |
| Label | `--text-sm`, weight 500, margin-bottom 4px |

### Sidebar

| Property | Value |
|---|---|
| Width | 240px (expanded), 64px (collapsed) |
| Background | `--color-bg-sidebar` |
| Active item | Left 3px accent border + `--color-bg-active` background |
| Hover item | `--color-bg-hover` background |
| Section heading | `--text-xs`, uppercase, `--color-text-tertiary`, letter-spacing 0.05em |
| Item text | `--text-sm`, `--color-text-primary` |
| Item icon | 20px, `--color-text-secondary` |

---

## Spacing System

An 4px-based spacing scale:

| Token | Value |
|---|---|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-10` | 40px |
| `--space-12` | 48px |

---

## Accessibility

| Requirement | Spec |
|---|---|
| **Color contrast (text)** | WCAG AA: 4.5:1 for normal text, 3:1 for large text |
| **Color contrast (UI)** | 3:1 for interactive element boundaries |
| **Focus indicators** | Visible 2px focus ring (`--color-border-focus`) on all interactive elements |
| **Keyboard navigation** | Full keyboard navigation: Tab, Shift+Tab, Enter, Escape, Arrow keys in dropdowns/tables |
| **Screen reader support** | Semantic HTML, ARIA labels on icons, role attributes on custom widgets |
| **Reduced motion** | Respect `prefers-reduced-motion` — disable transitions and animations |
| **Color not sole indicator** | Status always has icon + label, not color alone |

---

## Responsive Breakpoints

| Breakpoint | Min Width | Layout Adjustment |
|---|---|---|
| **Mobile** | < 768px | Sidebar hidden (hamburger menu), single-column content |
| **Tablet** | 768px – 1024px | Sidebar collapsed (icons), 2-column card grid |
| **Desktop** | 1024px – 1440px | Sidebar expanded, 3-column card grid |
| **Wide** | > 1440px | Sidebar expanded, 4-column card grid, wider tables |

---

## Status-to-Color Mapping Reference

Consistent mapping across all dashboards (cross-reference with `20-statuses-enums-and-reference-data.md`):

### Order Statuses

| Status | Color Category | Badge Style |
|---|---|---|
| Draft | Neutral | Gray |
| In Cart | Neutral | Gray |
| Pending Approval | Info | Blue |
| Modified | Info | Blue |
| Approved | Success | Green |
| Email Sent | Success | Green |
| Pending Delivery | Info | Blue |
| Partially Received | Warning | Amber |
| Fully Received | Success | Green |
| Cancelled | Neutral | Gray |

### Lot Statuses

| Status | Color Category | Badge Style |
|---|---|---|
| Active | Success | Green |
| Depleted | Neutral | Gray |
| Expired | Danger | Red |
| Quarantined | Danger | Red |
| Disposed | Neutral | Gray |

### Peroxide Classifications

| Classification | Color Category | Badge Style |
|---|---|---|
| Normal | Success | Green |
| Warning | Warning | Amber |
| Quarantine | Danger | Red |

### Stock Conditions

| Condition | Color Category | Badge Style |
|---|---|---|
| Adequate | Success | Green |
| Below Min | Warning | Amber |
| Out of Stock | Danger | Red |

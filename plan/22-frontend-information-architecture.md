# 22 — Frontend Information Architecture

This document defines the high-level page hierarchy, sidebar navigation structure, header behavior, and how summary dashboards connect to detailed pages.

---

## Application Shell

The application follows a standard **enterprise sidebar layout**:

```
┌──────────────────────────────────────────────────────────────┐
│  TOP HEADER BAR                                              │
│  ┌────────────┬─────────────────────────────────────────┐    │
│  │ App Logo   │  Lab Selector │ User Profile │ 🌙 Theme │    │
│  └────────────┴─────────────────────────────────────────┘    │
├──────────┬───────────────────────────────────────────────────┤
│          │                                                   │
│ SIDEBAR  │              CONTENT AREA                         │
│          │                                                   │
│ Dashboard│   ┌─────────────────────────────────────────┐     │
│ Orders   │   │  Page Title / Breadcrumb                │     │
│ Inventory│   │                                         │     │
│ Monitor  │   │  [ Summary Cards / Widgets ]            │     │
│ Reports  │   │                                         │     │
│ Admin    │   │  [ Data Table / Form / Detail View ]    │     │
│          │   │                                         │     │
│          │   └─────────────────────────────────────────┘     │
│          │                                                   │
└──────────┴───────────────────────────────────────────────────┘
```

---

## Top Header Bar

The header is a persistent horizontal bar across all pages. It contains:

| Element | Position | Description |
|---|---|---|
| **App Logo & Name** | Left | Application name / logo. Clicking navigates to Dashboard home. |
| **Location / Lab Selector** | Center-left | Dropdown or chip showing the user's currently active (Location, Lab) context. Users with multiple lab assignments can switch context here. |
| **Notification Bell** | Right | Badge count of unread notifications. Opens a notification drawer on click. |
| **Theme Toggle** | Right | Light/dark mode toggle (sun/moon icon). Persists preference to localStorage. |
| **User Profile** | Far right | Avatar/initials + name. Dropdown menu: My Profile, Change Password, Sign Out. |

### Lab Context Behavior

- On login, the user's default lab (based on their location scope) is set as the active context.
- All data queries, dashboards, and forms are scoped to the active (Location, Lab).
- Switching lab context refreshes the current page's data.
- Admins (who always have `all` scope) can select "All Locations / All Labs" to see org-wide data.
- Users with `specific` scope only see their assigned locations in the selector.
- The selected context is stored in session state (React context) and persists across page navigation within the session.

---

## Sidebar Navigation

The sidebar is a persistent vertical navigation panel. It supports **section grouping** and **role-based visibility**.

### Navigation Structure

```
📊  Dashboard                  ← Landing page with summary widgets
─────────────────────────
📦  ORDERS
    ├─ Catalog & Cart          ← Browse items, manage cart
    ├─ My Orders               ← User's submitted orders
    └─ Approval Queue          ← Focal Point / Admin only
─────────────────────────
📥  INVENTORY
    ├─ Check-In                ← Pending delivery + manual check-in
    ├─ Checkout                ← QR scan checkout flow
    └─ Stock Overview          ← Current inventory by lab
─────────────────────────
🧪  MONITORING
    ├─ Peroxide List           ← All monitored lots + status
    ├─ Extend Shelf Life       ← QR scan → extension form
    └─ Expired Items           ← Near-expiry and expired lots
─────────────────────────
📋  REPORTS & HISTORY
    ├─ Transaction History     ← Full audit log
    └─ Regulatory Reports      ← Report templates + export
─────────────────────────
⚙️  ADMIN                      ← Admin only section
    ├─ Users                   ← User management
    ├─ Locations & Labs        ← Org structure
    ├─ Item Catalog            ← Master item management
    ├─ Vendors                 ← Vendor management
    ├─ Categories              ← Category management
    └─ Regulations             ← Regulatory framework mgmt
```

### Role-Based Visibility

| Section | Admin | Focal Point | User |
|---|---|---|---|
| Dashboard | ✅ | ✅ | ✅ |
| Orders — Catalog & Cart | ✅ | ✅ | ✅ |
| Orders — My Orders | ✅ | ✅ | ✅ |
| Orders — Approval Queue | ✅ | ✅ | ❌ |
| Inventory — Check-In | ✅ | ✅ | ✅ |
| Inventory — Checkout | ✅ | ✅ | ✅ |
| Inventory — Stock Overview | ✅ | ✅ | ✅ |
| Monitoring — Peroxide List | ✅ | ✅ | ✅ |
| Monitoring — Extend Shelf Life | ✅ | ✅ | ❌ |
| Monitoring — Expired Items | ✅ | ✅ | ✅ |
| Reports & History | ✅ | ✅ | ✅ (own) |
| Admin | ✅ | ❌ | ❌ |

### Sidebar Behavior

- **Collapsed mode:** On narrow viewports, the sidebar collapses to icon-only mode with tooltips.
- **Active state:** The current page's nav item is visually highlighted (accent left border + background tint).
- **Section headers:** Non-clickable group labels (e.g., "ORDERS", "INVENTORY") styled in muted text.
- **Badge counts:** Approval Queue shows a count badge of pending approvals. Notification bell shows unread count.

---

## Summary-to-Detail Navigation Pattern

The application uses a consistent **card → full page** drill-down pattern:

### Dashboard → Detail Flow

```
┌───────────────────────────────────────────────────┐
│  DASHBOARD (Landing Page)                         │
│                                                   │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐          │
│  │ Pending  │  │ Low     │  │ Expiring│          │
│  │Approvals │  │ Stock   │  │ Soon    │          │
│  │   5      │  │   12    │  │   8     │          │
│  │ View All→│  │ View All→│  │ View All→│         │
│  └─────────┘  └─────────┘  └─────────┘          │
│                                                   │
│  ┌─────────┐  ┌─────────┐                        │
│  │Peroxide │  │ Recent  │                        │
│  │Overdue  │  │Activity │                        │
│  │   3     │  │  (list) │                        │
│  │ View All→│  │ View All→│                       │
│  └─────────┘  └─────────┘                        │
└───────────────────────────────────────────────────┘
        │                │                │
   Click "View All"      │           Click "View All"
        │                │                │
        ▼                ▼                ▼
 ┌──────────┐    ┌──────────────┐   ┌───────────┐
 │ Approval │    │  Min Stock   │   │ Expired   │
 │  Queue   │    │  Dashboard   │   │ Dashboard │
 │ (table)  │    │  (table)     │   │ (table)   │
 └──────────┘    └──────────────┘   └───────────┘
        │                │                │
   Click a row           │           Click a row
        ▼                ▼                ▼
 ┌──────────┐    ┌──────────────┐   ┌───────────┐
 │ Order    │    │  Item/Lot    │   │ Lot       │
 │ Detail   │    │  Detail      │   │ Detail    │
 └──────────┘    └──────────────┘   └───────────┘
```

### Pattern Summary

| Starting Point | "View All" Target | Row Click Target |
|---|---|---|
| Pending Approvals card | Approval Queue page | Order Detail page |
| Low Stock card | Min Stock Dashboard | Item Detail (in lab context) |
| Expiring Soon card | Expired Dashboard | Lot Detail page |
| Peroxide Overdue card | Peroxide Due Dashboard | Lot Detail / Peroxide Entry page |
| My Orders card | My Orders page | Order Detail page |
| Recent Check-Ins card | Transaction History (filtered) | Transaction Detail / Lot Detail |
| Recent Checkouts card | Transaction History (filtered) | Transaction Detail / Lot Detail |

---

## Breadcrumb Navigation

Every page below the dashboard level shows a breadcrumb trail:

```
Dashboard  ›  Orders  ›  My Orders  ›  PO-2026-0042
Dashboard  ›  Inventory  ›  Check-In  ›  PO-2026-0042
Dashboard  ›  Monitoring  ›  Peroxide List  ›  Lot #A7829
Dashboard  ›  Admin  ›  Item Catalog  ›  Acetone (2.5 L)
```

Breadcrumbs use the sidebar section structure as hierarchy.

---

## Page Layout Patterns

The application uses three primary content layout patterns:

### 1. Dashboard Layout (Cards + Quick Lists)

Used on: Dashboard home.
Summary cards in a responsive grid (2–4 columns) + optional recent activity lists.

### 2. Table Layout (Filter Bar + Data Table)

Used on: Order Status, Approval Queue, Min Stock, Expired, Peroxide Due, Transaction History, Stock Overview, My Orders.
Top filter bar → sortable/scrollable data table → row actions → pagination or virtualised scroll.

### 3. Form / Workflow Layout (Step-by-Step)

Used on: Catalog & Cart, Check-In, Checkout, Peroxide Entry, Extend Shelf Life, Admin CRUD pages.
Step indicators (if multi-step) → form sections → action buttons → confirmation.

> **Route definitions:** See `23-page-and-route-planning.md`.
> **Design tokens and styling:** See `25-design-system-and-theme-planning.md`.
> **Component specifications:** See `26-component-and-state-planning.md`.

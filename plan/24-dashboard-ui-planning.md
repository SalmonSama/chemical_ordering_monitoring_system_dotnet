# 24 — Dashboard UI Planning

This document specifies the UI layout, filters, columns, row behavior, and export capabilities for each operational dashboard.

> **Data source details:** See `21-reporting-and-dashboard-data-needs.md` for the underlying queries, calculations, and database views.
> **Dashboard behavior rules:** See `15-dashboard-behavior.md` for status transitions and role-scoped data.

---

## Shared Dashboard Patterns

All four operational dashboards share these UI patterns:

### Filter Bar
- Always visible above the table.
- Includes location filter, lab filter, category filter, status/condition filter, search box, and date range (where applicable).
- Filters apply immediately on change (no "Apply" button needed).
- Active filters show as dismissible chips below the filter bar.
- "Clear All Filters" link when any filters are active.

### Table Behavior
- Default ~50 visible rows with vertical scroll. No pagination — continuous scroll with lazy loading.
- Column headers are sortable (click to toggle asc/desc). Sort indicator arrow on active column.
- Sticky header row on scroll.
- Alternating row backgrounds for readability (**not** strong zebra stripes — subtle tint only).
- Row hover highlight (light background shift).
- Row click navigates to detail page.

### Status Indicators
- Status badges use semantic colors: green (good), orange/amber (warning), red (critical), slate/gray (neutral/inactive).
- Badges are pill-shaped chips with icon + label (e.g., `🟢 Active`, `⚠️ Warning`, `🔴 Expired`).

### Export
- Export button in the filter bar area: "Export CSV" and "Export PDF" as a dropdown.
- Export respects active filters (exports only what's currently displayed).

---

## 1. Order Status Dashboard

**Route:** `/orders/status`
**Purpose:** Full-table view tracking all orders by status across the user's scope.
**Access:** All roles (scoped by lab assignments).

### Filters

| Filter | Type | Options |
|---|---|---|
| Status | Multi-select chips | All 10 order statuses |
| Location | Dropdown | User's assigned locations |
| Lab | Dropdown (cascaded) | Labs within selected location |
| Category | Dropdown | Item categories |
| Vendor | Dropdown | Vendors from order items |
| Date Range | Date picker (from/to) | Filters on `submitted_at` |
| Search | Text input | PO number, item name, requester name |

### Columns

| Column | Width | Sortable | Description |
|---|---|---|---|
| Status | 120px | ✅ | Status badge (color-coded) |
| PO Number | 130px | ✅ | Unique order reference |
| Category | 100px | ✅ | Primary category (or "Mixed") |
| Items | 200px flex | ❌ | First item name + "and N more" |
| Qty | 60px | ✅ | Total quantity ordered |
| Vendor | 150px | ✅ | Primary vendor (or "Multiple") |
| Lab | 100px | ✅ | Target lab |
| Requester | 130px | ✅ | Requester name |
| Submitted | 100px | ✅ | Date submitted |
| Updated | 100px | ✅ | Last status change date |

### Row Actions
- Click row → Order Detail page (`/orders/my-orders/:id`)
- No inline actions on this dashboard.

### Export: ✅ CSV, PDF
### "View All" from Dashboard Card: ✅ — Linked from "My Orders" widget

---

## 2. Min Stock Dashboard

**Route:** `/monitoring/min-stock`
**Purpose:** Show all items below their per-lab min-stock thresholds so that Focal Points can initiate reorders.
**Access:** Focal Point, Admin.

### Filters

| Filter | Type | Options |
|---|---|---|
| Stock Condition | Multi-select chips | Out of Stock, Below Min, Adequate |
| Location | Dropdown | User's assigned locations |
| Lab | Dropdown (cascaded) | Labs within selected location |
| Category | Dropdown | Item categories |
| Long Lead Time | Toggle | Show only items with `lead_time_days > 14` |
| Search | Text input | Item name, catalog number |

### Columns

| Column | Width | Sortable | Description |
|---|---|---|---|
| Status | 80px | ✅ | Condition indicator (🔴 Out / ⚠️ Below / ✅ OK) |
| Item Name | 250px flex | ✅ | Full item name |
| Catalog # | 120px | ✅ | Part number |
| Category | 100px | ✅ | Item category |
| Lab | 100px | ✅ | Lab name |
| In Stock | 80px | ✅ | Total active quantity |
| Unit | 50px | ❌ | Unit of measure |
| Min Stock | 80px | ✅ | Configured minimum |
| Deficit | 80px | ✅ | min − current (if positive, highlighted red) |
| Lead Time | 80px | ✅ | Days. Highlighted if > 14 |
| Last Ordered | 100px | ✅ | Date of most recent order for this item+lab |

### Row Actions
- Click row → Item detail or lot detail in lab context
- **Action column:** "Order" button on rows with deficit > 0 — pre-populates cart with suggested quantity = deficit

### Export: ✅ CSV, PDF
### "View All" from Dashboard Card: ✅ — Linked from "Low Stock Alerts" widget

---

## 3. Expired Dashboard

**Route:** `/monitoring/expired`
**Purpose:** Show all lots that are expired or approaching expiry so that users can take action (extend, dispose, or reorder).
**Access:** All roles (scoped by lab assignments).

### Filters

| Filter | Type | Options |
|---|---|---|
| Expiry Condition | Multi-select chips | Expired, Expiring ≤30 days, Expiring ≤90 days |
| Location | Dropdown | User's assigned locations |
| Lab | Dropdown (cascaded) | Labs within selected location |
| Category | Dropdown | Item categories |
| Search | Text input | Item name, lot number |

### Columns

| Column | Width | Sortable | Description |
|---|---|---|---|
| Status | 80px | ✅ | Expiry badge (🔴 Expired / ⚠️ ≤30d / 🟡 ≤90d) |
| Item Name | 250px flex | ✅ | Full item name |
| Lot Number | 120px | ✅ | Lot/batch identifier |
| Category | 100px | ✅ | Item category |
| Lab | 100px | ✅ | Lab name |
| Expiry Date | 100px | ✅ | Current expiry date |
| Days Left | 80px | ✅ | Calculated. Negative = days past. Sorted ascending by default. |
| Qty Remaining | 80px | ✅ | Remaining quantity |
| Unit | 50px | ❌ | Unit of measure |
| Times Extended | 60px | ✅ | Extension count |
| Action | 100px | ❌ | "Extend" (FP/Admin) or "Dispose" button |

### Default Sort
- Sorted by **Days Left ascending** (most urgent / already expired at top).

### Row Actions
- Click row → Lot Detail page (`/inventory/lots/:id`)
- "Extend" button → Extend Shelf Life form for this lot
- "Dispose" button (FP/Admin) → Disposal confirmation modal

### Export: ✅ CSV, PDF
### "View All" from Dashboard Card: ✅ — Linked from "Expiring Soon" widget

---

## 4. Peroxide Due Dashboard

**Route:** `/monitoring/peroxide-due`
**Purpose:** Show all peroxide-monitored lots with their monitoring schedule, upcoming/overdue tests, and last results.
**Access:** All roles (scoped by lab assignments).

### Filters

| Filter | Type | Options |
|---|---|---|
| Due Condition | Multi-select chips | Overdue, Due ≤7 days, Warning, Quarantined, Normal |
| Location | Dropdown | User's assigned locations |
| Lab | Dropdown (cascaded) | Labs within selected location |
| Peroxide Class | Dropdown | Class A, B, C |
| Search | Text input | Item name, lot number |

### Columns

| Column | Width | Sortable | Description |
|---|---|---|---|
| Status | 80px | ✅ | Due condition badge (🔴 Overdue / ⚠️ Due Soon / 🟡 Warning / 🟢 Normal) |
| Reminder | 60px | ✅ | Whether automated reminder was sent (📧 icon or —) |
| Item Name | 200px flex | ✅ | Full item name |
| Lot Number | 120px | ✅ | Lot identifier |
| Lab | 100px | ✅ | Lab name |
| Class | 50px | ✅ | Peroxide class (A/B/C) |
| Due In | 80px | ✅ | Days until next test due. Negative = overdue. |
| Monitor Date | 100px | ✅ | Next test due date |
| Last Test | 100px | ✅ | Date of last test |
| Last Result | 80px | ✅ | PPM value or textual result |
| Last Class. | 80px | ✅ | Classification badge (Normal/Warning/Quarantine) |
| Action | 100px | ❌ | "Log Test" button |

### Default Sort
- Sorted by **Due In ascending** (most overdue at top).

### Row Actions
- Click row → Lot Detail page with peroxide history tab
- "Log Test" button → Peroxide Entry form (`/monitoring/peroxide/:lotId/log`)

### Export: ✅ CSV, PDF
### "View All" from Dashboard Card: ✅ — Linked from "Peroxide Overdue" widget

---

## Dashboard Summary Cards (Main Dashboard)

The main dashboard (`/`) shows summary cards that serve as entry points to the four dashboards above. Each card has:

| Element | Description |
|---|---|
| **Icon** | Module-specific icon in the accent color |
| **Title** | E.g., "Low Stock Alerts" |
| **Count** | Large numeric count of items needing attention |
| **Subtitle** | Brief descriptor (e.g., "items below minimum in PO Lab") |
| **Trend indicator** | Optional: ↑ / ↓ / — compared to previous period |
| **"View All →"** | Link to the corresponding full dashboard page |

### Card Grid Layout

Responsive grid: 4 columns on wide screens, 2 columns on medium, 1 column on narrow.

```
┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│  📋             │  │  📦             │  │  ⏰             │  │  🧪             │
│  Pending        │  │  Low Stock     │  │  Expiring      │  │  Peroxide      │
│  Approvals      │  │  Alerts        │  │  Soon          │  │  Overdue       │
│                 │  │                │  │                │  │                │
│      5          │  │     12         │  │      8         │  │      3         │
│                 │  │                │  │                │  │                │
│  View All →     │  │  View All →    │  │  View All →    │  │  View All →    │
└────────────────┘  └────────────────┘  └────────────────┘  └────────────────┘
```

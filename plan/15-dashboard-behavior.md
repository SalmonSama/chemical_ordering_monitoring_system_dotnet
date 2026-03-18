# 15 — Dashboard Behavior

This document defines the behavior, layout, data requirements, and scroll/filter specifications for each operational dashboard view in the system.

---

## Dashboard Architecture

The main dashboard page is a **role-aware landing page** that displays multiple widget-style panels. In addition, several dashboards are available as dedicated pages with full-table views and advanced filtering.

### Dashboard Views

| View | Purpose | Access |
|---|---|---|
| **Main Dashboard** | Role-specific summary widgets | All roles |
| **Order Status Dashboard** | Full order tracking table | All roles (scoped) |
| **Min Stock Dashboard** | Items below minimum thresholds | Focal Point, Admin |
| **Expired Dashboard** | Items at or near expiry | Focal Point, Admin, Lab User |
| **Peroxide Due Dashboard** | Peroxide monitoring schedule | Focal Point, Admin, Lab User |

All dashboards respect the user's **(Location, Lab)** scope.

---

## 1. Main Dashboard (Landing Page)

### Layout
The main dashboard displays a grid of summary cards/widgets, customized by role:

#### Focal Point / Admin Widgets
| Widget | Content |
|---|---|
| **Pending Approvals** | Count of orders in **Pending Approval** status for the user's labs. Click → Approval Queue. |
| **Low Stock Alerts** | Count of items below min-stock threshold. Click → Min Stock Dashboard. |
| **Expiring Soon** | Count of lots expiring within 30 days. Click → Expired Dashboard. |
| **Peroxide Overdue** | Count of peroxide lots with overdue monitoring. Click → Peroxide Due Dashboard. |
| **Recent Check-Ins** | Last 5 check-in events. Click → Transaction History. |
| **Recent Checkouts** | Last 5 checkout events. Click → Transaction History. |

#### Lab User Widgets
| Widget | Content |
|---|---|
| **My Orders** | Count and list of the user's orders by status. Click → Order detail. |
| **Low Stock Alerts** | Count of items below min-stock in the user's lab. Click → Min Stock Dashboard. |
| **Expiring Soon** | Count of lots expiring within 30 days in the user's lab. Click → Expired Dashboard. |
| **Peroxide Due** | Items in the user's lab with upcoming or overdue peroxide tests. Click → Peroxide Due Dashboard. |

#### Viewer / Auditor Widgets
| Widget | Content |
|---|---|
| **Order Summary** | Aggregate order counts by status. |
| **Inventory Summary** | Total lots, expired count, low-stock count. |
| **Recent Transactions** | Last 10 transactions. Click → Transaction History. |

---

## 2. Order Status Dashboard

### Purpose
Provide a comprehensive, scrollable table view of all orders in the system with their current status, filterable across all dimensions.

### Table Specification

**Target:** Approximately 50 rows visible with vertical scroll for larger datasets.

| # | Column | Description | Sortable |
|---|---|---|---|
| 1 | **PO Number** | System-generated order number (e.g., `PO-2026-0001`) | Yes |
| 2 | **Status** | Current status: Draft, In Cart, Pending Approval, Modified, Approved, Email Sent, Pending Delivery, Partially Received, Fully Received, Cancelled | Yes |
| 3 | **Category** | Primary category of ordered items (or "Mixed" if multiple categories) | Yes |
| 4 | **Item(s)** | First item name + count of additional items (e.g., "Acetone (+3 more)") | Yes |
| 5 | **Total Qty** | Sum of all line item quantities | No |
| 6 | **Vendor** | Vendor name (or "Multiple" if multi-vendor order) | Yes |
| 7 | **Lab** | Target lab name | Yes |
| 8 | **Location** | Target location name | Yes |
| 9 | **Requester** | User who submitted the order | Yes |
| 10 | **Entry Date** | Date the order was submitted (status → Pending Approval) | Yes |
| 11 | **Approve Date** | Date the order was approved (null if not yet approved) | Yes |
| 12 | **Last Updated** | Most recent status change timestamp | Yes |

### Filters

| Filter | Type | Options |
|---|---|---|
| **Status** | Multi-select | All 10 statuses |
| **Location** | Dropdown | User's accessible locations |
| **Lab** | Dropdown | Filtered by selected location |
| **Category** | Multi-select | Chemical & Reagent, Verify STD, Gas, Material & Consumable |
| **Vendor** | Searchable dropdown | All vendors |
| **Date Range** | Date picker | Entry Date from/to |
| **Search** | Text | PO number, item name, requester name |

### Default View
- Sorted by **Entry Date** descending (newest first).
- Filtered to exclude **Fully Received** and **Cancelled** (active orders only).
- User can toggle to show all statuses.

### Row Click Behavior
Clicking a row opens the order detail page with full line items (including line-item-level statuses), approval history, modification log, and vendor email status.

### Status Color Coding

| Status | Color |
|---|---|
| Draft | Gray |
| In Cart | Light Blue |
| Pending Approval | Orange |
| Modified | Yellow |
| Approved | Green |
| Email Sent | Teal |
| Pending Delivery | Blue |
| Partially Received | Purple |
| Fully Received | Dark Green |
| Cancelled | Red |

---

## 3. Min Stock Dashboard

### Purpose
Identify items whose aggregated stock level in a lab is at or below the defined minimum threshold, enabling proactive reordering.

### Table Specification

| # | Column | Description | Sortable |
|---|---|---|---|
| 1 | **Status Indicator** | 🔴 Out of Stock / 🟡 Below Min / ✅ Adequate | Yes |
| 2 | **Item Name** | Chemical / material name | Yes |
| 3 | **Catalog Number** | Item catalog reference | Yes |
| 4 | **Category** | Item category | Yes |
| 5 | **Lab** | Lab name | Yes |
| 6 | **Location** | Location name | Yes |
| 7 | **Total Quantity** | Sum of `quantity_remaining` across all active lots for this item in this lab | Yes |
| 8 | **Unit** | Unit of measure | No |
| 9 | **Min Stock** | Configured minimum stock threshold for this item in this lab | Yes |
| 10 | **Deficit** | `Min Stock - Total Quantity` (positive = below threshold) | Yes |
| 11 | **Long Lead Time** | Flag (Yes/No) indicating if the item typically has a long procurement lead time | Yes |
| 12 | **Last Order Date** | Date of the most recent order for this item in this lab | Yes |
| 13 | **Last Check-In Date** | Date of the most recent check-in for this item in this lab | Yes |

### Stock Condition Logic

| Condition | Rule | Indicator |
|---|---|---|
| **Out of Stock** | `Total Quantity = 0` | 🔴 Red |
| **Below Min Stock** | `0 < Total Quantity < Min Stock` | 🟡 Yellow |
| **At or Above Min Stock** | `Total Quantity ≥ Min Stock` | ✅ Green (hidden by default filter) |

### Filters

| Filter | Type | Options |
|---|---|---|
| **Condition** | Multi-select | Out of Stock, Below Min Stock, Adequate |
| **Location** | Dropdown | User's accessible locations |
| **Lab** | Dropdown | Filtered by selected location |
| **Category** | Multi-select | All categories |
| **Long Lead Time** | Toggle | All / Long Lead Time Only |
| **Search** | Text | Item name, catalog number |

### Default View
- Show only **Out of Stock** and **Below Min Stock** items.
- Sorted by **Deficit** descending (largest deficit first).
- Long Lead Time items highlighted or sortable to top.

### Action Column
- **Order** button: Pre-populates the cart with the item and a quantity equal to the deficit. (Only for orderable categories.)

---

## 4. Expired Dashboard

### Purpose
Surface inventory lots that are expired or approaching expiry, enabling timely action (extend shelf life, dispose, or consume before expiry).

### Table Specification

| # | Column | Description | Sortable |
|---|---|---|---|
| 1 | **Status Indicator** | 🔴 Expired / 🟡 Near-Expire / ✅ Active | Yes |
| 2 | **Item Name** | Chemical / material name | Yes |
| 3 | **Lot Number** | Inventory lot number | Yes |
| 4 | **Category** | Item category | Yes |
| 5 | **Lab** | Lab name | Yes |
| 6 | **Location** | Location name | Yes |
| 7 | **Expiry Date** | Lot expiry date | Yes |
| 8 | **Days to Expiry** | Calculated: `Expiry Date - Today`. Negative = expired. | Yes |
| 9 | **Quantity Remaining** | Current lot quantity | Yes |
| 10 | **Unit** | Unit of measure | No |
| 11 | **Times Extended** | Number of shelf-life extensions applied to this lot | Yes |
| 12 | **Last Action Date** | Date of most recent transaction (check-in, checkout, extension) | Yes |

### Expiry Condition Logic

| Condition | Rule | Indicator |
|---|---|---|
| **Expired** | `Days to Expiry < 0` (expiry date has passed) | 🔴 Red |
| **Near-Expire** | `0 ≤ Days to Expiry ≤ 90` (within 90-day window) | 🟡 Yellow |
| **Active** | `Days to Expiry > 90` | ✅ Green (hidden by default filter) |

> **Note:** The near-expire threshold (90 days) should be configurable at the system level. Sub-thresholds (30, 60, 90 days) can be used for color gradient within the yellow zone.

### Filters

| Filter | Type | Options |
|---|---|---|
| **Condition** | Multi-select | Expired, Near-Expire (30/60/90 days), Active |
| **Location** | Dropdown | User's accessible locations |
| **Lab** | Dropdown | Filtered by selected location |
| **Category** | Multi-select | All categories |
| **Search** | Text | Item name, lot number |

### Default View
- Show only **Expired** and **Near-Expire** lots.
- Sorted by **Days to Expiry** ascending (most urgent first — expired, then soonest to expire).

### Action Column
- **Extend**: Link to the Extend Shelf Life workflow for this lot (Chemical & Reagent only). See `14-extend-shelf-life-workflow.md`.
- **Dispose**: Mark the lot for disposal (creates a `DISPOSAL` transaction).
- **View**: Open the lot detail page.

---

## 5. Peroxide Due Dashboard

### Purpose
Show all peroxide-forming chemical lots with their monitoring status, highlighting overdue and upcoming tests.

### Table Specification

| # | Column | Description | Sortable |
|---|---|---|---|
| 1 | **Status Indicator** | 🔴 Overdue / 🟡 Due Soon / ✅ Normal / ⚠️ Warning / 🛑 Quarantined | Yes |
| 2 | **Reminder** | Notification indicator: bell icon if automated reminder has been sent for upcoming due date | — |
| 3 | **Item Name** | Chemical name | Yes |
| 4 | **Lot Number** | Inventory lot number | Yes |
| 5 | **Lab** | Lab name | Yes |
| 6 | **Location** | Location name | Yes |
| 7 | **Monitor Due In** | Calculated: `Next Monitor Due - Today` (days). Negative = overdue. | Yes |
| 8 | **Monitor Date** | Date the next test is due (`Next Monitor Due` value) | Yes |
| 9 | **Last Monitor Date** | Date of the most recent peroxide test | Yes |
| 10 | **Last PPM Result** | The most recent PPM reading (or textual result) | Yes |
| 11 | **Last Classification** | Normal / Warning / Quarantine | Yes |
| 12 | **Open Date** | Date the container was first opened | Yes |

### Due Condition Logic

| Condition | Rule | Indicator |
|---|---|---|
| **Overdue** | `Monitor Due In < 0` (past due date) | 🔴 Red |
| **Due Soon** | `0 ≤ Monitor Due In ≤ 7` (due within 7 days) | 🟡 Yellow |
| **Normal** | `Monitor Due In > 7` and last result < 25 ppm | ✅ Green |
| **Warning** | Last result ≥ 25 and ≤ 100 ppm | ⚠️ Orange |
| **Quarantined** | Last result > 100 ppm or lot is quarantined | 🛑 Red with border |

### Filters

| Filter | Type | Options |
|---|---|---|
| **Status** | Multi-select | Overdue, Due Soon, Normal, Warning, Quarantined |
| **Location** | Dropdown | User's accessible locations |
| **Lab** | Dropdown | Filtered by selected location |
| **Search** | Text | Item name, lot number |

### Default View
- Show all non-quarantined lots, sorted by **Monitor Due In** ascending (most overdue first).
- Quarantined lots displayed in a separate section or at the top with distinct styling.

### Action Column
- **Log Test**: Opens the peroxide monitoring event entry form for this lot. See `13-peroxide-workflow.md`.
- **View History**: Opens the full monitoring event history for this lot.

---

## Scroll and Pagination Behavior

All dashboard tables follow these interaction patterns:

| Aspect | Specification |
|---|---|
| **Initial load** | First 50 rows loaded. |
| **Scroll** | Vertical scroll within the table container. Table headers remain fixed (sticky). |
| **Pagination** | If dataset exceeds 50 rows, use pagination controls (page size: 25/50/100) or infinite scroll. |
| **Responsive** | On smaller screens, less critical columns hidden; horizontal scroll enabled. |
| **Loading state** | Skeleton rows or spinner while data is loading. |
| **Empty state** | Clear message: "No items match the current filters" with a link to adjust filters. |

---

## Refresh Behavior

| Behavior | Specification |
|---|---|
| **On page load** | Always fetch latest data. |
| **Manual refresh** | Refresh button available on each dashboard. |
| **Auto-refresh** | Optional: dashboards can auto-refresh on a configurable interval (e.g., every 5 minutes). Not required for MVP but beneficial for operational dashboards displayed on wall-mounted monitors. |

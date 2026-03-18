# 21 — Reporting and Dashboard Data Needs

This document defines how each dashboard view and report derives its data from the database schema, including the specific tables involved, join patterns, calculated fields, and filtering logic. It complements `15-dashboard-behavior.md` (which defines the UI) by specifying the **data layer** behind each view.

---

## 1. Order Status Dashboard

**UI Reference:** `15-dashboard-behavior.md`, Section 2

### Data Source

| Table | Role |
|---|---|
| `purchase_requests` | Core order data: status, dates, requester, lab |
| `purchase_request_items` | Line items: item, quantity, vendor |
| `items` | Item name, catalog number, category |
| `vendors` | Vendor name |
| `labs` | Lab name |
| `locations` | Location name |
| `users` | Requester name, approver name |

### Query Pattern

```
-- Illustrative only
SELECT
    pr.request_number,
    pr.po_number,
    pr.status,
    pr.submitted_at AS entry_date,
    pr.approved_at AS approve_date,
    pr.updated_at AS last_updated,
    u.display_name AS requester,
    l.name AS lab_name,
    loc.name AS location_name,
    COUNT(pri.id) AS item_count,
    (SELECT i.item_name FROM items i
       JOIN purchase_request_items pri2 ON pri2.item_id = i.id
      WHERE pri2.purchase_request_id = pr.id LIMIT 1
    ) AS first_item_name
FROM purchase_requests pr
JOIN users u ON pr.requester_id = u.id
JOIN labs l ON pr.lab_id = l.id
JOIN locations loc ON l.location_id = loc.id
LEFT JOIN purchase_request_items pri ON pri.purchase_request_id = pr.id
WHERE pr.lab_id IN (/* user's accessible labs */)
GROUP BY pr.id, u.display_name, l.name, loc.name
ORDER BY pr.submitted_at DESC;
```

### Filters and Their SQL Mapping

| UI Filter | SQL Condition |
|---|---|
| Status | `pr.status IN (...)` |
| Location | `loc.id = ?` |
| Lab | `l.id = ?` |
| Category | `EXISTS (SELECT 1 FROM purchase_request_items pri JOIN items i ON pri.item_id = i.id JOIN item_categories ic ON i.category_id = ic.id WHERE pri.purchase_request_id = pr.id AND ic.code IN (...))` |
| Vendor | `EXISTS (SELECT 1 FROM purchase_request_items pri WHERE pri.purchase_request_id = pr.id AND pri.vendor_id = ?)` |
| Date Range | `pr.submitted_at BETWEEN ? AND ?` |
| Search | `pr.request_number ILIKE ? OR pr.po_number ILIKE ? OR u.display_name ILIKE ?` |

### Indexes That Support This

- `purchase_requests (lab_id, status, submitted_at)`
- `purchase_request_items (purchase_request_id)`
- `purchase_requests (po_number)`

---

## 2. Min Stock Dashboard

**UI Reference:** `15-dashboard-behavior.md`, Section 3

### How to Calculate Total Quantity

The total quantity for an item in a lab is the **sum of `quantity_remaining` across all active lots**:

```
-- Illustrative only
total_qty = SUM(inventory_lots.quantity_remaining)
            WHERE item_id = ?
              AND lab_id = ?
              AND status = 'ACTIVE'
```

**Important:** Only `ACTIVE` lots are counted. `DEPLETED`, `EXPIRED`, `QUARANTINED`, and `DISPOSED` lots are excluded from the available stock calculation.

### How to Calculate Min Stock Condition

```
-- Illustrative only
deficit = item_lab_settings.min_stock - total_qty

IF total_qty = 0             → OUT_OF_STOCK (🔴)
ELSE IF total_qty < min_stock → BELOW_MIN    (🟡)
ELSE                          → ADEQUATE     (✅)
```

### Data Source

| Table | Role |
|---|---|
| `items` | Item name, catalog number, category, lead_time_days |
| `item_lab_settings` | min_stock, is_stocked_here |
| `inventory_lots` | quantity_remaining, status (aggregated) |
| `labs` | Lab name |
| `locations` | Location name |
| `item_categories` | Category name |
| `purchase_requests` / `stock_transactions` | Last order date, last check-in date (for context) |

### Query Pattern

```
-- Illustrative only
SELECT
    i.item_name,
    i.part_no AS catalog_number,
    ic.name AS category,
    l.name AS lab_name,
    loc.name AS location_name,
    ils.min_stock,
    COALESCE(stock.total_qty, 0) AS total_quantity,
    ils.min_stock - COALESCE(stock.total_qty, 0) AS deficit,
    i.lead_time_days > 14 AS long_lead_time,
    CASE
        WHEN COALESCE(stock.total_qty, 0) = 0 THEN 'OUT_OF_STOCK'
        WHEN COALESCE(stock.total_qty, 0) < ils.min_stock THEN 'BELOW_MIN'
        ELSE 'ADEQUATE'
    END AS stock_condition
FROM items i
JOIN item_lab_settings ils ON i.id = ils.item_id
JOIN labs l ON ils.lab_id = l.id
JOIN locations loc ON l.location_id = loc.id
JOIN item_categories ic ON i.category_id = ic.id
LEFT JOIN (
    SELECT item_id, lab_id, SUM(quantity_remaining) AS total_qty
    FROM inventory_lots
    WHERE status = 'ACTIVE'
    GROUP BY item_id, lab_id
) stock ON stock.item_id = i.id AND stock.lab_id = l.id
WHERE ils.is_stocked_here = true
  AND l.id IN (/* user's accessible labs */)
ORDER BY deficit DESC;
```

### Indexes That Support This

- `inventory_lots (item_id, lab_id, status)`
- `item_lab_settings (lab_id, item_id)`
- `item_lab_settings (item_id)` — for item-centric queries

---

## 3. Expired Dashboard

**UI Reference:** `15-dashboard-behavior.md`, Section 4

### How to Calculate Days to Expiry

```
-- Illustrative only
days_to_expiry = inventory_lots.expiry_date - CURRENT_DATE

IF days_to_expiry < 0                  → EXPIRED     (🔴)
ELSE IF days_to_expiry <= 90           → NEAR_EXPIRE (🟡)
ELSE                                   → ACTIVE      (✅)
```

**Note:** Only lots with `tracks_expiry = true` (from `items`) and a non-null `expiry_date` are relevant.

### How to Count Times Extended

```
-- Illustrative only
times_extended = (SELECT COUNT(*) FROM shelf_life_extensions WHERE lot_id = ?)
```

### Data Source

| Table | Role |
|---|---|
| `inventory_lots` | expiry_date, quantity_remaining, status, lot_number |
| `items` | item_name, tracks_expiry |
| `item_categories` | Category name |
| `labs` | Lab name |
| `locations` | Location name |
| `shelf_life_extensions` | Extension count per lot |

### Query Pattern

```
-- Illustrative only
SELECT
    il.lot_number,
    i.item_name,
    ic.name AS category,
    l.name AS lab_name,
    loc.name AS location_name,
    il.expiry_date,
    il.expiry_date - CURRENT_DATE AS days_to_expiry,
    il.quantity_remaining,
    il.status,
    COALESCE(ext.extension_count, 0) AS times_extended,
    CASE
        WHEN il.expiry_date < CURRENT_DATE THEN 'EXPIRED'
        WHEN il.expiry_date - CURRENT_DATE <= 90 THEN 'NEAR_EXPIRE'
        ELSE 'ACTIVE'
    END AS expiry_condition
FROM inventory_lots il
JOIN items i ON il.item_id = i.id
JOIN item_categories ic ON i.category_id = ic.id
JOIN labs l ON il.lab_id = l.id
JOIN locations loc ON l.location_id = loc.id
LEFT JOIN (
    SELECT lot_id, COUNT(*) AS extension_count
    FROM shelf_life_extensions
    GROUP BY lot_id
) ext ON ext.lot_id = il.id
WHERE i.tracks_expiry = true
  AND il.expiry_date IS NOT NULL
  AND il.status IN ('ACTIVE', 'EXPIRED')
  AND l.id IN (/* user's accessible labs */)
ORDER BY days_to_expiry ASC;
```

### Indexes That Support This

- `inventory_lots (expiry_date)` — for range scans
- `inventory_lots (lab_id, status)` — for lab-scoped queries
- `shelf_life_extensions (lot_id)` — for extension count

---

## 4. Peroxide Due Dashboard

**UI Reference:** `15-dashboard-behavior.md`, Section 5

### How to Calculate Monitor Due In

```
-- Illustrative only
-- Option A: From the lot's cached next_peroxide_due
monitor_due_in = inventory_lots.next_peroxide_due - CURRENT_DATE

-- Option B: From the latest peroxide_tests record
monitor_due_in = (SELECT next_monitor_due FROM peroxide_tests
                  WHERE lot_id = ? ORDER BY test_date DESC LIMIT 1)
                 - CURRENT_DATE

IF monitor_due_in < 0    → OVERDUE   (🔴)
ELSE IF monitor_due_in <= 7 → DUE_SOON (🟡)
ELSE                     → normal or depends on last classification
```

**Recommended approach:** Cache `next_peroxide_due` and `last_ppm_result` on `inventory_lots` for dashboard performance. Update these cached values when a new `peroxide_tests` record is inserted.

### Data Source

| Table | Role |
|---|---|
| `inventory_lots` | Lot details, cached peroxide fields, open_date |
| `items` | item_name, requires_peroxide_monitoring |
| `labs` | Lab name |
| `locations` | Location name |
| `peroxide_tests` | Latest test result, next_monitor_due, classification |

### Query Pattern

```
-- Illustrative only
SELECT
    il.lot_number,
    i.item_name,
    l.name AS lab_name,
    loc.name AS location_name,
    il.open_date,
    latest_test.test_date AS last_monitor_date,
    latest_test.next_monitor_due,
    latest_test.next_monitor_due - CURRENT_DATE AS monitor_due_in,
    latest_test.ppm_result AS last_ppm_result,
    latest_test.classification AS last_classification,
    CASE
        WHEN il.status = 'QUARANTINED' THEN 'QUARANTINED'
        WHEN latest_test.next_monitor_due < CURRENT_DATE THEN 'OVERDUE'
        WHEN latest_test.next_monitor_due - CURRENT_DATE <= 7 THEN 'DUE_SOON'
        WHEN latest_test.classification = 'WARNING' THEN 'WARNING'
        ELSE 'NORMAL'
    END AS due_condition
FROM inventory_lots il
JOIN items i ON il.item_id = i.id
JOIN labs l ON il.lab_id = l.id
JOIN locations loc ON l.location_id = loc.id
LEFT JOIN LATERAL (
    SELECT test_date, next_monitor_due, ppm_result, classification
    FROM peroxide_tests
    WHERE lot_id = il.id
    ORDER BY test_date DESC
    LIMIT 1
) latest_test ON true
WHERE i.requires_peroxide_monitoring = true
  AND il.status IN ('ACTIVE', 'QUARANTINED')
  AND l.id IN (/* user's accessible labs */)
ORDER BY monitor_due_in ASC NULLS FIRST;
```

### Indexes That Support This

- `inventory_lots (lab_id, status)` with filter on `requires_peroxide_monitoring` via JOIN
- `peroxide_tests (lot_id, test_date DESC)` — for lateral/subquery lookups

---

## 5. Transaction History

**UI Reference:** `16-transaction-history-and-audit.md`

### Data Source

| Table | Role |
|---|---|
| `stock_transactions` | Core transaction records |
| `inventory_lots` | Lot context |
| `items` | Item name |
| `purchase_requests` | PO/request number |
| `users` | User who performed the action |
| `labs` | Lab context |
| `locations` | Location context |

### Query Pattern

```
-- Illustrative only
SELECT
    st.created_at AS timestamp,
    st.transaction_type,
    i.item_name,
    il.lot_number,
    st.quantity,
    u.display_name AS user_name,
    l.name AS lab_name,
    loc.name AS location_name,
    st.purpose,
    st.notes,
    st.metadata
FROM stock_transactions st
LEFT JOIN inventory_lots il ON st.lot_id = il.id
LEFT JOIN items i ON st.item_id = i.id
JOIN users u ON st.user_id = u.id
JOIN labs l ON st.lab_id = l.id
JOIN locations loc ON l.location_id = loc.id
WHERE l.id IN (/* user's accessible labs */)
ORDER BY st.created_at DESC;
```

### Filters and Their SQL Mapping

| UI Filter | SQL Condition |
|---|---|
| Transaction Type | `st.transaction_type IN (...)` |
| Date Range | `st.created_at BETWEEN ? AND ?` |
| Location | `loc.id = ?` |
| Lab | `l.id = ?` |
| User | `st.user_id = ?` |
| Item | `i.item_name ILIKE ?` |
| Lot Number | `il.lot_number ILIKE ?` |
| PO Number | `pr.po_number ILIKE ?` (via JOIN) |

### Indexes That Support This

- `stock_transactions (lab_id, created_at DESC)`
- `stock_transactions (transaction_type, created_at)`
- `stock_transactions (user_id, created_at)`
- `stock_transactions (lot_id, created_at)`
- `stock_transactions (purchase_request_id)`

---

## 6. Regulatory Report

### What Must Be Queryable

Regulatory reports typically need:

| Report Type | Data Needed | Source Tables |
|---|---|---|
| **Inventory Snapshot** | All active lots of regulatory items with quantities, expiry dates, storage locations | `inventory_lots`, `items` (where `is_regulatory = true`), `item_regulations`, `regulations`, `labs`, `locations` |
| **Transaction Report** | All transactions for regulatory items within a date range | `stock_transactions`, `inventory_lots`, `items`, `labs` |
| **Peroxide Test Report** | All peroxide test results for a given period, grouped by item and lot | `peroxide_tests`, `inventory_lots`, `items`, `labs` |
| **Shelf-Life Extension Report** | All extensions within a period with full before/after values | `shelf_life_extensions`, `inventory_lots`, `items`, `labs` |
| **Chemical Inventory Listing** | Complete listing of chemicals on-site at a specific date, by location/lab | `inventory_lots`, `items`, `item_categories`, `labs`, `locations` |

### Regulatory Inventory Snapshot Query Pattern

```
-- Illustrative only
SELECT
    i.item_name,
    i.cas_number,
    i.part_no,
    ic.name AS category,
    il.lot_number,
    il.quantity_remaining,
    il.unit,
    il.expiry_date,
    il.storage_location,
    il.status,
    l.name AS lab_name,
    loc.name AS location_name,
    STRING_AGG(r.name, ', ') AS applicable_regulations
FROM inventory_lots il
JOIN items i ON il.item_id = i.id
JOIN item_categories ic ON i.category_id = ic.id
JOIN labs l ON il.lab_id = l.id
JOIN locations loc ON l.location_id = loc.id
LEFT JOIN item_regulations ir ON ir.item_id = i.id
LEFT JOIN regulations r ON ir.regulation_id = r.id
WHERE i.is_regulatory = true
  AND il.status IN ('ACTIVE', 'EXPIRED', 'QUARANTINED')
GROUP BY i.id, ic.name, il.id, l.name, loc.name
ORDER BY loc.name, l.name, i.item_name;
```

---

## 7. Calculated Field Summary

All calculated fields across dashboards are derived at query time from stored data (or from cached denormalized fields updated via triggers/application logic):

| Calculated Field | Formula | Used In |
|---|---|---|
| **Total Quantity** | `SUM(inventory_lots.quantity_remaining) WHERE status = 'ACTIVE' AND item_id = ? AND lab_id = ?` | Min Stock Dashboard |
| **Deficit** | `item_lab_settings.min_stock - Total Quantity` | Min Stock Dashboard |
| **Stock Condition** | `IF total_qty = 0 → OUT_OF_STOCK; ELIF total_qty < min_stock → BELOW_MIN; ELSE → ADEQUATE` | Min Stock Dashboard |
| **Days to Expiry** | `inventory_lots.expiry_date - CURRENT_DATE` | Expired Dashboard |
| **Expiry Condition** | `IF days_to_expiry < 0 → EXPIRED; ELIF days_to_expiry ≤ 90 → NEAR_EXPIRE; ELSE → ACTIVE` | Expired Dashboard |
| **Monitor Due In** | `peroxide_tests.next_monitor_due - CURRENT_DATE` (or cached on lot) | Peroxide Due Dashboard |
| **Due Condition** | `IF quarantined → QUARANTINED; ELIF monitor_due_in < 0 → OVERDUE; ELIF ≤ 7 → DUE_SOON; ELIF last = WARNING → WARNING; ELSE → NORMAL` | Peroxide Due Dashboard |
| **Times Extended** | `COUNT(*) FROM shelf_life_extensions WHERE lot_id = ?` | Expired Dashboard |
| **Line Items Received** | `SUM(purchase_request_items.quantity_received) / SUM(quantity_requested)` | Order Dashboard |

---

## 8. Performance Considerations

### Materialized Views (Candidate)

For dashboards accessed frequently with heavy aggregation, materialized views may be beneficial:

| Dashboard | Candidate Materialized View | Refresh Strategy |
|---|---|---|
| Min Stock | `mv_lab_stock_summary` — pre-aggregated total_qty per item per lab | Refresh on check-in, checkout, adjustment |
| Expired | `mv_expiring_lots` — lots with `days_to_expiry ≤ 90` | Refresh daily (scheduled) or on check-in/extension |
| Peroxide Due | `mv_peroxide_schedule` — lots with upcoming/overdue tests | Refresh on test logging or daily |

**MVP approach:** Start with direct queries. Introduce materialized views only if performance monitoring reveals bottleneck.

### Denormalized Cache Fields on `inventory_lots`

Certain frequently accessed derived values can be cached directly on the lot for dashboard performance:

| Field | Source | Updated When |
|---|---|---|
| `last_peroxide_test_date` | `MAX(peroxide_tests.test_date) WHERE lot_id = ?` | New peroxide test logged |
| `last_ppm_result` | Latest `peroxide_tests.ppm_result` | New peroxide test logged |
| `next_peroxide_due` | Latest `peroxide_tests.next_monitor_due` | New peroxide test logged |
| `extension_count` | `COUNT(*) FROM shelf_life_extensions WHERE lot_id = ?` | New extension recorded |

These fields are computed and saved; they avoid JOINs in hot-path dashboard queries. The source-of-truth remains the related tables.

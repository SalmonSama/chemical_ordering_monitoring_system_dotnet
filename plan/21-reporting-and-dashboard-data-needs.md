# 21 — Reporting and Dashboard Data Needs

This document describes what data must be queryable for each dashboard and report, how key calculated values are derived, and what database views or functions may be needed to support efficient querying.

---

## 1. Order Status Dashboard

**Reference:** `15-dashboard-behavior.md`, Section 2

### Data Source
- Primary: `purchase_requests` JOIN `purchase_request_items`
- Supporting: `items`, `vendors`, `labs`, `locations`, `users`

### Required Query Output

| Column | Source |
|---|---|
| PO Number | `purchase_requests.po_number` |
| Status | `purchase_requests.status` |
| Category | `items.category_id` → `item_categories.name` (or "Mixed" if multiple categories in one order) |
| Item(s) | First `items.item_name` + count of additional line items |
| Total Qty | `SUM(purchase_request_items.quantity_ordered)` |
| Vendor | `vendors.name` (or "Multiple" if line items span vendors) |
| Lab | `labs.name` |
| Location | `locations.name` |
| Requester | `users.full_name` via `purchase_requests.requested_by` |
| Entry Date | `purchase_requests.submitted_at` |
| Approve Date | `purchase_requests.approved_at` |
| Last Updated | `purchase_requests.updated_at` |

### Filters Needed

| Filter | Query Condition |
|---|---|
| Status | `WHERE status IN (...)` |
| Location | `WHERE location_id = ?` |
| Lab | `WHERE lab_id = ?` |
| Category | `WHERE purchase_request_items.item_id IN (SELECT id FROM items WHERE category_id = ?)` |
| Vendor | `WHERE purchase_request_items.vendor_id = ?` |
| Date Range | `WHERE submitted_at BETWEEN ? AND ?` |
| Search | `WHERE po_number ILIKE ? OR items.item_name ILIKE ? OR users.full_name ILIKE ?` |

### Suggested Database View: `v_order_dashboard`

A denormalized view pre-joining `purchase_requests`, `purchase_request_items`, `items`, `item_categories`, `vendors`, `labs`, `locations`, and `users`. Aggregates line items into summary columns (first item name, item count, total quantity, vendor list).

---

## 2. Min Stock Dashboard

**Reference:** `15-dashboard-behavior.md`, Section 3

### Data Source
- Primary: `items` JOIN `item_lab_settings` JOIN `inventory_lots`
- Supporting: `labs`, `locations`, `item_categories`

### Key Calculation: Total Quantity per Item per Lab

```
Total Quantity = SUM(inventory_lots.quantity_remaining)
                WHERE inventory_lots.item_id = ?
                  AND inventory_lots.lab_id = ?
                  AND inventory_lots.status = 'active'
```

Only **active** lots count toward in-stock quantity. Depleted, expired, quarantined, and disposed lots are excluded.

### Key Calculation: Min Stock Condition

```
IF total_quantity = 0                    → 'out_of_stock'
IF total_quantity < item_lab_settings.min_stock → 'below_min'
IF total_quantity >= item_lab_settings.min_stock → 'adequate'
```

### Key Calculation: Deficit

```
Deficit = item_lab_settings.min_stock - total_quantity
```

A positive deficit means the stock is below threshold.

### Required Query Output

| Column | Source |
|---|---|
| Status Indicator | Calculated from min-stock condition |
| Item Name | `items.item_name` |
| Catalog Number | `items.part_no` |
| Category | `item_categories.name` |
| Lab | `labs.name` |
| Location | `locations.name` |
| Total Quantity | `SUM(inventory_lots.quantity_remaining)` where status = 'active' |
| Unit | `items.unit` |
| Min Stock | `item_lab_settings.min_stock` |
| Deficit | `min_stock - total_quantity` |
| Long Lead Time | `items.lead_time_days > threshold` (e.g., > 14 days) |
| Last Order Date | `MAX(purchase_requests.submitted_at)` for this item + lab |
| Last Check-In Date | `MAX(inventory_lots.checked_in_at)` for this item + lab |

### Filters Needed

| Filter | Query Condition |
|---|---|
| Condition | Calculated field: `out_of_stock`, `below_min`, `adequate` |
| Location | `WHERE labs.location_id = ?` |
| Lab | `WHERE item_lab_settings.lab_id = ?` |
| Category | `WHERE items.category_id = ?` |
| Long Lead Time | `WHERE items.lead_time_days > ?` |
| Search | `WHERE items.item_name ILIKE ? OR items.part_no ILIKE ?` |

### Suggested Database View: `v_min_stock_status`

Joins `items`, `item_lab_settings`, and aggregated `inventory_lots` to produce one row per (item, lab) with `total_quantity`, `min_stock`, `deficit`, and `stock_condition`.

```
-- Conceptual structure (not executable SQL):

v_min_stock_status:
  item_id, item_name, part_no, category, unit,
  lab_id, lab_name, location_id, location_name,
  min_stock,
  total_quantity,        -- SUM of active lot quantities
  deficit,               -- min_stock - total_quantity
  stock_condition,       -- 'out_of_stock' / 'below_min' / 'adequate'
  lead_time_days,
  last_order_date,
  last_checkin_date
```

---

## 3. Expired Dashboard

**Reference:** `15-dashboard-behavior.md`, Section 4

### Data Source
- Primary: `inventory_lots`
- Supporting: `items`, `item_categories`, `labs`, `locations`, `shelf_life_extensions`

### Key Calculation: Days to Expiry

```
Days to Expiry = inventory_lots.expiry_date - CURRENT_DATE
```

- Positive = days remaining.
- Zero = expires today.
- Negative = expired (absolute value = days since expiry).

### Key Calculation: Expiry Condition

```
IF days_to_expiry < 0            → 'expired'
IF days_to_expiry <= 90          → 'near_expire'
IF days_to_expiry > 90           → 'active'
```

> Note: the 90-day threshold should be configurable. Sub-thresholds (30, 60, 90) can be used for color gradients.

### Required Query Output

| Column | Source |
|---|---|
| Status Indicator | Calculated from expiry condition |
| Item Name | `items.item_name` |
| Lot Number | `inventory_lots.lot_number` |
| Category | `item_categories.name` |
| Lab | `labs.name` |
| Location | `locations.name` |
| Expiry Date | `inventory_lots.expiry_date` |
| Days to Expiry | `expiry_date - CURRENT_DATE` |
| Quantity Remaining | `inventory_lots.quantity_remaining` |
| Unit | `inventory_lots.unit` |
| Times Extended | `inventory_lots.extension_count` |
| Last Action Date | Most recent `stock_transactions.created_at` for this lot |

### Filter on Lot Status

Only lots with status `active` or `expired` are relevant. Depleted, quarantined, and disposed lots are excluded.

### Suggested Database View: `v_expiry_status`

```
-- Conceptual structure:

v_expiry_status:
  lot_id, item_id, item_name, lot_number, category,
  lab_id, lab_name, location_id, location_name,
  expiry_date,
  days_to_expiry,        -- expiry_date - CURRENT_DATE
  expiry_condition,      -- 'expired' / 'near_expire' / 'active'
  quantity_remaining, unit,
  extension_count,
  last_action_date
```

---

## 4. Peroxide Due Dashboard

**Reference:** `15-dashboard-behavior.md`, Section 5

### Data Source
- Primary: `inventory_lots` JOIN `peroxide_tests` (latest per lot)
- Supporting: `items`, `labs`, `locations`

### Key Calculation: Monitor Due In

To get the next monitoring due date for a lot, find the **most recent** `peroxide_tests` row for that lot:

```
Next Monitor Due = peroxide_tests.next_monitor_due   (from the most recent test for the lot)

Monitor Due In = next_monitor_due - CURRENT_DATE
```

For lots that have **never been tested**:

```
Next Monitor Due = inventory_lots.open_date + monitoring_interval
    (or inventory_lots.checked_in_at + monitoring_interval, if open_date is null)

Monitor Due In  = Next Monitor Due - CURRENT_DATE
```

Where `monitoring_interval` is determined by the item's `peroxide_class` (A = 90 days, B = 180 days, C = 365 days).

### Key Calculation: Due Condition

```
IF monitor_due_in < 0            → 'overdue'
IF monitor_due_in <= 7           → 'due_soon'
IF lot_status = 'quarantined'    → 'quarantined'
IF last_classification = 'warning' → 'warning'
ELSE                             → 'normal'
```

### Required Query Output

| Column | Source |
|---|---|
| Status Indicator | Calculated from due condition |
| Reminder | Whether an automated reminder has been sent |
| Item Name | `items.item_name` |
| Lot Number | `inventory_lots.lot_number` |
| Lab | `labs.name` |
| Location | `locations.name` |
| Monitor Due In | `next_monitor_due - CURRENT_DATE` (days) |
| Monitor Date | `next_monitor_due` (date) |
| Last Monitor Date | Most recent `peroxide_tests.test_date` |
| Last PPM Result | Most recent `peroxide_tests.ppm_result` or `result_text` |
| Last Classification | Most recent `peroxide_tests.classification` |
| Open Date | `inventory_lots.open_date` |

### Filter on Lot Status and Item Flags

- Only lots where `items.requires_peroxide_monitoring = true`.
- Only lots with status `active` or `quarantined`.
- Exclude `depleted` and `disposed` lots.

### Suggested Database View: `v_peroxide_due`

This view needs a **lateral join** or **window function** to get the most recent peroxide test per lot:

```
-- Conceptual structure:

v_peroxide_due:
  lot_id, item_id, item_name, lot_number,
  lab_id, lab_name, location_id, location_name,
  peroxide_class,                     -- from items
  open_date as container_open_date,   -- from inventory_lots
  checked_in_at,
  last_test_date,                     -- MAX(peroxide_tests.test_date)
  last_ppm_result,                    -- from the most recent test
  last_result_text,
  last_classification,                -- from the most recent test
  next_monitor_due,                   -- from the most recent test (or calculated)
  monitor_due_in,                     -- next_monitor_due - CURRENT_DATE
  due_condition,                      -- 'overdue' / 'due_soon' / 'normal' / 'warning' / 'quarantined'
  lot_status                          -- from inventory_lots
```

---

## 5. Transaction History

**Reference:** `16-transaction-history-and-audit.md`

### Data Source
- Primary: `stock_transactions`
- Supporting: `items`, `inventory_lots`, `purchase_requests`, `labs`, `locations`, `users`

### Required Query Output

| Column | Source |
|---|---|
| Timestamp | `stock_transactions.created_at` |
| Type | `stock_transactions.transaction_type` (mapped to display label) |
| Item | `items.item_name` or `stock_transactions.metadata->>'chemical_name'` |
| Lot Number | `inventory_lots.lot_number` or `stock_transactions.metadata->>'lot_number'` |
| Quantity | `stock_transactions.quantity` |
| User | `stock_transactions.user_name` (denormalized) |
| Lab | `labs.name` |
| Location | `locations.name` |
| Details | Summary from `stock_transactions.metadata` (truncated) |

### Indexed Queries

The following query patterns must be performant:

| Query Pattern | Index Strategy |
|---|---|
| By date range | `created_at` |
| By transaction type | `transaction_type` |
| By lot | `lot_id` |
| By order | `purchase_request_id` |
| By item | `item_id` |
| By lab | `lab_id` |
| By user | `user_id` |

### JSONB Metadata Queries

Some filters require querying into the JSONB `metadata` field:

```
-- Example: find all checkouts with purpose = 'disposal'
WHERE transaction_type = 'checkout'
  AND metadata->>'purpose' = 'disposal'
```

GIN index on `metadata` supports these queries efficiently.

---

## 6. Regulatory Report

### Data Sources

Regulatory reports combine data from multiple tables depending on the report type:

| Report Type | Primary Tables | Purpose |
|---|---|---|
| **Inventory Snapshot** | `items`, `inventory_lots`, `item_lab_settings` | Current stock by item/lab/location |
| **Transaction Report** | `stock_transactions` | All transactions in a date range |
| **Peroxide Test Report** | `peroxide_tests`, `inventory_lots`, `items` | Complete test history for a date range |
| **Shelf-Life Extension Report** | `shelf_life_extensions`, `inventory_lots`, `items` | All extensions in a date range |
| **Expired Chemical Report** | `inventory_lots`, `items` | All lots that expired in a date range |
| **Quarantined Lots Report** | `inventory_lots`, `items` | All lots currently or historically quarantined |

### Common Report Parameters

| Parameter | Type | Description |
|---|---|---|
| Date range | From/To dates | Period for the report |
| Location | UUID or "All" | Filter by location |
| Lab | UUID or "All" | Filter by lab (within location) |
| Category | UUID or "All" | Filter by item category |
| Format | CSV or PDF | Export format |

---

## 7. Calculation Reference

Summary of all key calculated values used across dashboards and reports:

### Total Quantity (per item, per lab)

```
SUM(inventory_lots.quantity_remaining)
WHERE item_id = ? AND lab_id = ? AND status = 'active'
```

**Used by:** Min Stock Dashboard, Inventory views

---

### Min Stock Condition

```
total_quantity = 0                     → 'out_of_stock'
total_quantity < min_stock             → 'below_min'
total_quantity >= min_stock            → 'adequate'
```

Where `min_stock` comes from `item_lab_settings.min_stock`.

**Used by:** Min Stock Dashboard

---

### Deficit

```
item_lab_settings.min_stock - total_quantity
```

Positive = below threshold. Zero or negative = adequate.

**Used by:** Min Stock Dashboard

---

### Days to Expiry

```
inventory_lots.expiry_date - CURRENT_DATE
```

Positive = days remaining. Negative = days past expiry.

**Used by:** Expired Dashboard, Lot detail views

---

### Expiry Condition

```
days_to_expiry < 0      → 'expired'
days_to_expiry <= 90     → 'near_expire'
days_to_expiry > 90      → 'active'
```

**Used by:** Expired Dashboard

---

### Monitor Due In

```
-- If lot has been tested:
latest_peroxide_test.next_monitor_due - CURRENT_DATE

-- If lot has never been tested:
COALESCE(inventory_lots.open_date, inventory_lots.checked_in_at)
  + monitoring_interval_for_peroxide_class
  - CURRENT_DATE
```

Negative = overdue. Within 7 days = due soon.

**Used by:** Peroxide Due Dashboard

---

### Order Received Percentage

```
SUM(purchase_request_items.quantity_received) / SUM(purchase_request_items.quantity_ordered) * 100
```

**Used by:** Order detail views, Order Status Dashboard

---

## 8. Index Strategy Summary

| Table | Key Indexes | Purpose |
|---|---|---|
| `inventory_lots` | `(item_id, lab_id)`, `status`, `expiry_date`, `lab_id` | Min stock aggregation, expiry queries, scope filtering |
| `stock_transactions` | `created_at`, `transaction_type`, `lab_id`, `lot_id`, `item_id`, `user_id`, `purchase_request_id` | All dashboard and history queries |
| `peroxide_tests` | `lot_id`, `test_date`, `classification`, `next_monitor_due` | Peroxide dashboard, latest test lookup |
| `purchase_requests` | `lab_id`, `status`, `submitted_at`, `requested_by` | Order dashboard, approval queue |
| `purchase_request_items` | `purchase_request_id`, `item_id`, `vendor_id` | Line-item lookups, vendor grouping |
| `item_lab_settings` | `(item_id, lab_id)` | Min stock lookup |
| `shelf_life_extensions` | `lot_id` | Extension history per lot |
| `audit_logs` | `table_name`, `record_id`, `changed_at` | Master data audit queries |

---

## 9. Suggested Database Views Summary

| View Name | Purpose | Key Joins |
|---|---|---|
| `v_order_dashboard` | Order status dashboard data | purchase_requests + items + vendors + labs + users |
| `v_min_stock_status` | Min stock condition per (item, lab) | items + item_lab_settings + aggregated inventory_lots |
| `v_expiry_status` | Expiry status per active/expired lot | inventory_lots + items + labs |
| `v_peroxide_due` | Peroxide monitoring schedule | inventory_lots + latest peroxide_tests + items + labs |
| `v_lot_detail` | Full lot information with current state | inventory_lots + items + vendors + labs + extensions count |

These views are **conceptual** — exact definitions will be written as part of the migration scripts during implementation.

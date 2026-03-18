# 19 — Relationship and Normalization Notes

This document explains the key normalization decisions in the database design, why certain entities are separated, and the relational principles that prevent data anomalies.

---

## 1. Why Locations and Labs Are Separate Tables

### The Hierarchy

```
Location (AIE)
    ├── PO Lab
    ├── EOU Lab
    └── Utility Lab

Location (MTP)
    ├── Mixing Lab
    └── QC Lab
```

### Why Not a Single Table?

A single `labs` table with a `location_name` column would:
- **Duplicate location data** — the same location name, address, and attributes repeated for every lab.
- **Create update anomalies** — renaming "AIE" requires updating every row where `location_name = 'AIE'`.
- **Prevent location-level queries** — "list all locations" becomes `SELECT DISTINCT location_name FROM labs`, which is fragile.

### The Normalized Design

| Table | Contains | Scope |
|---|---|---|
| `locations` | Location identity: code, name, address | One row per location |
| `labs` | Lab identity: code, name, parent location_id | One row per lab |

**Relationship:** `labs.location_id` → `locations.id` (many-to-one).

**Benefits:**
- Location attributes stored once.
- Adding a lab to a location is an INSERT into `labs`, not a schema change.
- Location-level filters and dashboards are simple: `WHERE location_id = ?`.
- Referential integrity enforced by the foreign key.

---

## 2. Why the Item Master Is Separate from Inventory Lots

### The Problem It Solves

The item master (`items`) describes **what an item is**: its name, vendor, category, behavior flags, and reference price. This information is:
- Shared across the entire organization.
- Does not change when inventory moves.
- Referenced by every lot, order, and transaction.

Inventory lots (`inventory_lots`) describe **what we physically have**: specific quantities, lot numbers, expiry dates, and status. This information is:
- Scoped to a specific lab.
- Changes frequently (checkouts reduce quantity, status changes on expiry, etc.).
- Created each time items are received.

### What Would Go Wrong Without Separation

If item master data and inventory were combined:

| Problem | Example |
|---|---|
| **Data duplication** | The item name, category, and behavior flags would be repeated on every lot row. |
| **Update anomalies** | Renaming "Methanol, ACS Grade" requires updating every lot row for that item. |
| **No centralized catalog** | Without a separate item table, there's no way to browse available items without scanning all lot records. |
| **Lost items** | If an item is out of stock (zero lots), the item no longer "exists" — there's no row to reference. |

### The Normalized Design

```
items (master data)           inventory_lots (operational data)
─────────────────             ──────────────────────────────────
id: UUID                      id: UUID
item_name: VARCHAR            item_id: UUID  ──FK──→  items.id
category_id: UUID             lab_id: UUID   ──FK──→  labs.id
vendor_id: UUID               lot_number: VARCHAR
is_orderable: BOOLEAN         quantity_remaining: DECIMAL
...                           expiry_date: DATE
                              status: VARCHAR
                              ...
```

**Relationship:** `inventory_lots.item_id` → `items.id` (many-to-one). One item can have zero or many lots across different labs.

---

## 3. Why Min Stock Must Be Normalized

### The Anti-Pattern: Spreadsheet Columns

A denormalized design might store min stock per location as columns on the item:

```
items
  id, item_name, ...,
  AIE_PO_Lab_min, AIE_EOU_Lab_min, MTP_Mixing_min, MTP_QC_min, ...
```

**This is wrong because:**

| Problem | Impact |
|---|---|
| **Schema changes for new labs** | Adding "CT Calibration Lab" requires `ALTER TABLE items ADD COLUMN CT_Cal_Lab_min`. |
| **Sparse data** | Most items exist in only 2–3 of 10+ labs. Most columns are NULL. |
| **No standard query pattern** | "Items below min stock in Lab X" requires the query to know the column name for Lab X. |
| **No enforcement** | Can't use foreign keys to validate that the lab column corresponds to a real lab. |
| **Violates 1NF** | Repeating the same data element (min stock) across N columns is a repeating group. |

### The Normalized Design

```
item_lab_settings
  id, item_id (FK), lab_id (FK), min_stock, is_stocked_here, ...
```

**Query: Items below min stock in PO Lab at AIE:**

```sql
-- Illustrative only — not implementation SQL
SELECT i.item_name,
       ils.min_stock,
       COALESCE(SUM(il.quantity_remaining), 0) AS total_qty
  FROM items i
  JOIN item_lab_settings ils ON i.id = ils.item_id
  JOIN labs l ON ils.lab_id = l.id
  LEFT JOIN inventory_lots il ON i.id = il.item_id
                              AND il.lab_id = l.id
                              AND il.status = 'ACTIVE'
 WHERE l.code = 'PO_LAB'
   AND ils.is_stocked_here = true
 GROUP BY i.id, i.item_name, ils.min_stock
HAVING COALESCE(SUM(il.quantity_remaining), 0) < ils.min_stock;
```

**Benefits:**
- Adding a new lab: INSERT rows into `item_lab_settings`. No schema changes.
- The query pattern is identical for any lab — just change the WHERE clause filter.
- Foreign keys enforce that `lab_id` is a valid lab.
- Easy to report on: "which labs stock Item X?" → `SELECT ... FROM item_lab_settings WHERE item_id = ?`

---

## 4. Why Peroxide Test Results Need Their Own Table

### Why Not Store on the Lot?

Storing only the latest test result on `inventory_lots` would:
- **Destroy history.** You only know the most recent PPM reading. Regulatory auditors need the full test history.
- **Lose trend data.** Tracking whether PPM is rising over time requires comparing multiple readings.
- **Prevent "when was this lot last tested?" queries.** You'd need a separate mechanism.

### The Normalized Design

```
peroxide_tests
  id, lot_id (FK), test_date, tested_by, ppm_result, classification,
  next_monitor_due, notes, ...
```

**Relationship:** `peroxide_tests.lot_id` → `inventory_lots.id` (many-to-one). Each lot has zero or many test events over its lifetime.

**Key queries this enables:**
- "Show all test results for Lot X in chronological order."
- "Which lots are overdue for testing?" → `WHERE next_monitor_due < CURRENT_DATE`
- "Show PPM trend for Lot X" → `SELECT test_date, ppm_result FROM peroxide_tests WHERE lot_id = ? ORDER BY test_date`
- "Average PPM for chemical Y across all lots" → aggregate query joining through `inventory_lots.item_id`

**Lot-level denormalization:** For performance, `inventory_lots` may cache a few derived fields:
- `last_peroxide_test_date` — avoids JOINs for the common "when was this lot last tested?" question.
- `last_ppm_result` — for quick dashboard display.
- `next_peroxide_due` — for overdue calculations.

These cached values are updated whenever a new test is logged. The test history remains in `peroxide_tests`.

---

## 5. Why Shelf-Life Extensions Need a History Table

### The Problem

A single `extended_expiry_date` column on `inventory_lots` tells you what the current expiry date is. It does not tell you:
- What the original expiry date was.
- How many times it was extended.
- Who authorized each extension.
- What test justified each extension.

### Regulatory and Audit Requirements

For compliance:
- Every extension must be traceable: who, when, why, and what test was performed.
- The full chain of extensions must be auditable (original → extension 1 → extension 2 → ...).
- Extensions cannot be silently overwritten.

### The Normalized Design

```
shelf_life_extensions
  id, lot_id (FK), extension_number, previous_expiry_date,
  new_expiry_date, extension_days, reason, test_performed,
  test_result, test_date, authorized_by (FK), authorized_at
```

**Relationship:** `shelf_life_extensions.lot_id` → `inventory_lots.id` (many-to-one).

**`inventory_lots` also tracks:**
- `expiry_date` — current effective expiry (updated after each extension).
- `original_expiry_date` — unchanged, preserving the baseline.

**Query: Full extension history for a lot:**

```sql
-- Illustrative only
SELECT extension_number, previous_expiry_date, new_expiry_date,
       extension_days, test_performed, test_result,
       authorized_by, authorized_at
  FROM shelf_life_extensions
 WHERE lot_id = ?
 ORDER BY extension_number;
```

---

## 6. Why Audit/Transaction History Is Essential

### Two Complementary Audit Tables

| Table | Scope | Use Case |
|---|---|---|
| `stock_transactions` | Inventory and order workflow actions | Checkout, check-in, peroxide test, shelf-life extension, order submit/approve |
| `audit_logs` | Master data and system changes | User creation, item updates, role changes, lab configuration changes |

### Why Both?

- `stock_transactions` are high-volume, append-only records tied to specific lots, orders, and lab contexts. They are the primary audit trail for operational workflows.
- `audit_logs` capture administrative changes that don't directly involve inventory but are still auditable: "Who deactivated User X?", "When was Item Y's category changed?"

### Why Not Just One Table?

- **Different access patterns:** Operational queries filter by `lot_id`, `lab_id`, `transaction_type`. Admin queries filter by `entity_type`, `entity_id`, `action`.
- **Different retention:** Transaction history may be retained indefinitely (regulatory). Admin audit logs may have shorter retention.
- **Different volumes:** Stock transactions will vastly outnumber admin changes.
- **Query performance:** A single massive table for both would require complex indexes to serve both access patterns efficiently.

### Immutability

Both tables enforce append-only semantics:
- Application layer: no UPDATE or DELETE endpoints.
- Database layer (optional enforcement): a `BEFORE UPDATE` trigger can reject modifications.
- If a record needs to be corrected, a new record is inserted (e.g., an `ADJUSTMENT` transaction that reverses a previous error).

---

## 7. Additional Normalization Decisions

### 7a. Vendors as a Separate Table

Vendors are referenced by items (default vendor), purchase request items (line-level vendor), and vendor email logs. Normalizing vendors into their own table:
- Avoids repeating vendor name, email, phone on every item and line item.
- Supports vendor management (rename, deactivate) without updating every reference.
- Enables vendor-level reporting: "total orders by vendor", "delivery performance."

### 7b. Roles as a Separate Table

Even with only 4 roles, a `roles` table (rather than a VARCHAR column):
- Provides a reference for future role additions without code changes.
- Enables role-based queries: "list all users with role X."
- Allows storing role descriptions and display names.
- Constrains `users.role_id` via foreign key.

### 7c. Regulations as a Separate Table with Junction

Regulations are many-to-many with items. A junction table (`item_regulations`) allows:
- Multiple regulations per item.
- One regulation applying to many items.
- Adding new regulations without modifying the items table.
- Querying: "Which items are subject to OSHA PEL?" → simple join.

### 7d. Purchase Request Item Revisions as a Separate Table

When a Focal Point modifies a line item (changes quantity, swaps vendor), the original value must be preserved. Rather than storing revision history in a JSON column on the line item:
- Each change is a separate row in `purchase_request_item_revisions`.
- The revision captures: what field changed, old value, new value, who changed it, and when.
- This supports the audit requirement: "Show me all modifications the Focal Point made to PO-2026-0001."
- It aligns with the `MODIFY_ORDER` transaction type in `16-transaction-history-and-audit.md`.

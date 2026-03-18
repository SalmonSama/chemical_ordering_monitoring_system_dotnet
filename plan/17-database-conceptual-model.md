# 17 — Database Conceptual Model

This document describes the overall relational design philosophy, data layer separation, and key architectural decisions behind the database schema for the Lab Inventory / Chemical Ordering / Peroxide Monitoring System.

---

## Design Principles

1. **Shared master data, lab-level operational data.** The item catalog (chemical/material master list) is organization-wide. Inventory lots, stock levels, transactions, and monitoring records are scoped to individual labs.
2. **Strict normalization.** Location-specific settings (min stock, lead time overrides) are stored in proper relational tables, never as denormalized columns (e.g., no `AIE_min`, `MTP_min` columns on items).
3. **Category-driven behavior via flags, not just names.** Item behavior (orderable, requires check-in, tracks expiry, requires peroxide monitoring) is expressed through explicit boolean flags on the item record, not inferred solely from the category name.
4. **Append-only audit trail.** Transaction history and audit logs are insert-only. No updates or deletes. All state changes are traceable.
5. **Temporal integrity.** All tables include `created_at`, `updated_at`, `created_by`, and `updated_by` columns for auditability.

---

## Data Layer Separation

The database schema is organized into three conceptual layers:

```
┌──────────────────────────────────────────────────────────────────────┐
│                     LAYER 1: MASTER DATA (Shared)                    │
│                                                                      │
│  locations · labs · users · roles · user_labs                        │
│  vendors · item_categories · items · regulations · item_regulations  │
│  item_location_settings · item_lab_settings                         │
│                                                                      │
│  Characteristics:                                                    │
│  ► Shared across the organization                                    │
│  ► Changes infrequently (admin-managed)                              │
│  ► Referenced by all transactional records                           │
│  ► Defines WHAT can be ordered, WHERE it can go, WHO can act         │
└──────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ referenced by (FK)
                                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│                  LAYER 2: TRANSACTIONAL DATA (Lab-Scoped)            │
│                                                                      │
│  purchase_requests · purchase_request_items                         │
│  purchase_request_item_revisions                                    │
│  vendor_email_logs · inventory_lots · stock_transactions            │
│  peroxide_tests · shelf_life_extensions · label_print_logs          │
│                                                                      │
│  Characteristics:                                                    │
│  ► Scoped to a specific lab and location                            │
│  ► High volume — grows continuously                                  │
│  ► Each record links back to master data via foreign keys            │
│  ► Drives the operational workflows documented in 10–14              │
│  ► Immutable in many cases (transactions, tests, extensions)         │
└──────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ queried by
                                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│                  LAYER 3: REPORTING & AUDIT (Cross-Cutting)          │
│                                                                      │
│  audit_logs · (views & functions for dashboards)                    │
│                                                                      │
│  Characteristics:                                                    │
│  ► Derived from Layers 1 and 2                                       │
│  ► Aggregate queries, calculated fields (days to expiry, stock sum) │
│  ► Dashboard-oriented (see 15-dashboard-behavior.md)                │
│  ► Export-ready for regulatory reporting                             │
│  ► Append-only (audit logs)                                         │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Why Shared Item Master and Lab-Level Inventory Are Separate Concerns

### The Problem with Merging Them

If the item catalog included per-lab columns (e.g., `AIE_PO_Lab_qty`, `MTP_Lab_min_stock`), the design would:

- **Break with new labs.** Every new lab requires schema changes (new columns). This is fragile and anti-relational.
- **Create sparse data.** Most items exist in only a few labs; the rest of the columns would be NULL.
- **Prevent clean querying.** "Show me all items below min stock in Lab X" becomes a column-name-dependent query rather than a simple WHERE clause.
- **Violate normalization.** Repeating the same concept (stock level, min stock) across N columns for N labs is a classic normalization failure.

### The Relational Approach

```
┌───────────────┐        ┌──────────────────────┐        ┌──────────────────┐
│     items     │        │  item_lab_settings    │        │  inventory_lots  │
│               │        │                      │        │                  │
│  id           │───1:N──│  item_id  (FK)       │        │  item_id  (FK)   │
│  item_name    │        │  lab_id   (FK)       │        │  lab_id   (FK)   │
│  category_id  │        │  min_stock           │        │  lot_number      │
│  vendor_id    │        │  is_stocked_here     │        │  qty_remaining   │
│  is_orderable │        │  custom_lead_time    │        │  expiry_date     │
│  ...          │        │  ...                 │        │  status          │
└───────────────┘        └──────────────────────┘        └──────────────────┘

  Organization-wide              Per-lab settings             Per-lab, per-lot
  "What exists"                  "What we keep here"          "What we have now"
```

| Layer | Table | Scope | Purpose |
|---|---|---|---|
| Master | `items` | Organization | Defines the item: name, category, vendor, behavior flags |
| Settings | `item_lab_settings` | Per lab | Defines the item's configuration in a specific lab: min stock, stocked flag |
| Inventory | `inventory_lots` | Per lab, per lot | Tracks actual physical stock: lot number, quantity, expiry |

This separation means:
- **Adding a new lab** → insert rows into `item_lab_settings`, not new columns.
- **Querying stock** → `SELECT ... FROM inventory_lots WHERE lab_id = ? AND item_id = ?`
- **Calculating min stock condition** → `JOIN item_lab_settings ON ... WHERE total_qty < min_stock`

---

## Entity Relationship Overview

The following diagram shows the major entities and their key relationships:

```
                    ┌───────────┐
                    │ locations  │
                    └─────┬─────┘
                          │ 1:N
                          ▼
                    ┌───────────┐         ┌──────────────┐
                    │   labs     │◄────────│  user_labs   │
                    └─────┬─────┘         └──────┬───────┘
                          │                      │
                          │                      │
                    ┌─────┴──────────────────────┴────────┐
                    │                                      │
                    ▼                                      ▼
          ┌───────────────────┐                    ┌───────────┐
          │  item_lab_settings│                    │   users   │
          └────────┬──────────┘                    └─────┬─────┘
                   │                                     │
                   │                                     │
         ┌─────────┴─────────┐                           │
         │                   │                           │
         ▼                   ▼                           │
   ┌──────────┐     ┌────────────────┐                   │
   │  items   │     │ inventory_lots │◄──────────────────┘
   └────┬─────┘     └───────┬────────┘        (checked_in_by,
        │                   │                  checked_out_by)
        │                   │
        ▼                   ├────────────────────────────────┐
  ┌──────────────┐          │                                │
  │item_categories│         ▼                                ▼
  └──────────────┘  ┌──────────────────┐         ┌─────────────────────┐
                    │stock_transactions│         │   peroxide_tests    │
                    └──────────────────┘         └─────────────────────┘
                                                          │
                                                          ▼
                                                ┌─────────────────────┐
                                                │shelf_life_extensions│
                                                └─────────────────────┘

  ┌──────────────────────┐       ┌──────────────────────────────┐
  │  purchase_requests   │──1:N──│  purchase_request_items       │
  └──────────────────────┘       └───────────────┬──────────────┘
                                                  │ 1:N
                                                  ▼
                                 ┌──────────────────────────────────┐
                                 │purchase_request_item_revisions   │
                                 └──────────────────────────────────┘
```

---

## Data Domains

| Domain | Tables | Description |
|---|---|---|
| **Organization** | `locations`, `labs` | Physical locations and their sub-units (labs). Strict hierarchy: Location → Lab. |
| **Identity & Access** | `users`, `roles`, `user_labs` | Who can access what. Users are assigned to labs with specific roles. |
| **Catalog** | `items`, `item_categories`, `vendors`, `regulations`, `item_regulations` | What can be ordered, tracked, or monitored. Shared across all labs. |
| **Lab Configuration** | `item_location_settings`, `item_lab_settings` | Per-location or per-lab overrides for items: min stock, stocked flag, custom thresholds. |
| **Procurement** | `purchase_requests`, `purchase_request_items`, `purchase_request_item_revisions`, `vendor_email_logs` | The ordering and approval lifecycle. |
| **Inventory** | `inventory_lots`, `stock_transactions` | Physical stock tracking at the lot level with full transaction history. |
| **Monitoring** | `peroxide_tests`, `shelf_life_extensions` | Safety monitoring and controlled expiry management. |
| **Audit & Operations** | `audit_logs`, `label_print_logs` | System-wide audit trail and operational logging. |

---

## Cross-Cutting Patterns

### Soft Deletes

Most master data entities use **soft deletes** (`is_active` boolean) rather than physical deletes. This preserves referential integrity — a deactivated vendor or item still appears in historical records.

### Audit Columns

Every table includes:

| Column | Type | Description |
|---|---|---|
| `created_at` | `TIMESTAMPTZ` | Row creation timestamp (server-set) |
| `created_by` | `UUID` (FK → users) | User who created the record |
| `updated_at` | `TIMESTAMPTZ` | Last update timestamp |
| `updated_by` | `UUID` (FK → users) | User who last updated the record |

### UUID Primary Keys

All primary keys are UUIDs (v4), generated server-side. This ensures:
- No sequential ID guessing.
- Safe for distributed systems.
- Compatible with QR code payloads and URL identifiers.

### Enum-Like Columns

Statuses and category codes are stored as `VARCHAR` or `TEXT` with `CHECK` constraints, not as integer enums. This improves readability in raw SQL queries and debug logs. See `20-statuses-enums-and-reference-data.md` for the complete list.

---

## Indexing Strategy (Overview)

Performance-critical indexes will be created on:

| Table | Column(s) | Reason |
|---|---|---|
| `inventory_lots` | `lab_id`, `item_id`, `status` | Core inventory queries |
| `inventory_lots` | `expiry_date` | Expired / expiring dashboards |
| `stock_transactions` | `lot_id`, `created_at` | Lot history queries |
| `stock_transactions` | `transaction_type`, `lab_id` | Filtered transaction history |
| `purchase_requests` | `lab_id`, `status` | Order dashboard queries |
| `peroxide_tests` | `lot_id`, `test_date` | Monitoring history |
| `audit_logs` | `entity_type`, `entity_id`, `created_at` | Audit trail lookups |
| `item_lab_settings` | `lab_id`, `item_id` | Stock threshold checks |

Detailed index definitions will be specified during the implementation phase.

---

## Alignment with Workflow Documents

| Workflow Document | Primary Tables |
|---|---|
| `10-order-workflow.md` | `purchase_requests`, `purchase_request_items`, `purchase_request_item_revisions`, `vendor_email_logs` |
| `11-checkin-workflow.md` | `inventory_lots`, `stock_transactions`, `label_print_logs` |
| `12-checkout-workflow.md` | `inventory_lots`, `stock_transactions` |
| `13-peroxide-workflow.md` | `peroxide_tests`, `inventory_lots` |
| `14-extend-shelf-life-workflow.md` | `shelf_life_extensions`, `inventory_lots` |
| `15-dashboard-behavior.md` | All tables via aggregation queries / views |
| `16-transaction-history-and-audit.md` | `stock_transactions`, `audit_logs` |

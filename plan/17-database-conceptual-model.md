# 17 — Database Conceptual Model

This document explains the overall relational design philosophy, the separation between master data, transactional data, and reporting-oriented data, and why shared item master and lab-level inventory are modeled as separate concerns.

---

## Design Philosophy

The database is designed around three guiding principles:

1. **Single source of truth for master data.** Items, vendors, categories, locations, and labs are defined once and shared across the entire organization. There is no duplication of catalog information per location or lab.

2. **Lab-scoped transactional data.** All operational data — inventory lots, stock transactions, orders, peroxide tests, shelf-life extensions — belongs to a specific lab. This guarantees clear ownership, simplifies access control, and matches the real-world organizational model.

3. **Immutable audit trail.** Transaction history and audit logs are append-only. They provide regulatory-grade evidence of who did what, when, and where.

---

## Three-Layer Model

The schema is conceptually organized into three layers:

```
┌───────────────────────────────────────────────────────────┐
│                  LAYER 1: MASTER DATA                     │
│                  (Shared, Stable)                         │
│                                                           │
│  locations ─→ labs                                        │
│  users (─→ roles, location_scope_type)                    │
│  user_locations (for specific-scope users)                 │
│  vendors                                                  │
│  item_categories                                          │
│  items ─→ item_location_settings ─→ item_lab_settings     │
│  regulations ─→ item_regulations                          │
│  po_number_mappings (category + lab + vendor → PO number) │
└───────────────────────────────────────────────────────────┘
                           │
                     FK references
                           │
                           ▼
┌───────────────────────────────────────────────────────────┐
│                LAYER 2: TRANSACTIONAL DATA                │
│                (Lab-Scoped, Growing)                      │
│                                                           │
│  purchase_requests ─→ purchase_request_items              │
│       └──→ purchase_request_item_revisions                │
│  vendor_email_logs                                        │
│  inventory_lots                                           │
│  stock_transactions                                       │
│  peroxide_tests                                           │
│  shelf_life_extensions                                    │
│  label_print_logs                                         │
└───────────────────────────────────────────────────────────┘
                           │
                      Joined for
                      aggregation
                           │
                           ▼
┌───────────────────────────────────────────────────────────┐
│              LAYER 3: REPORTING & AUDIT                   │
│              (Cross-Cutting, Append-Only)                 │
│                                                           │
│  audit_logs           (master data change tracking)       │
│  stock_transactions   (also serves reporting directly)    │
│  Database views       (aggregated dashboard queries)      │
│  Database functions   (calculated columns, summaries)     │
└───────────────────────────────────────────────────────────┘
```

---

## Layer 1: Master Data (Shared)

Master data represents the **organizational reference information** that is defined once and referenced by all transactional records. It changes infrequently and is managed by Admin or Focal Point users.

### What belongs here

| Entity Group | Tables | Why Shared |
|---|---|---|
| **Organization structure** | `locations`, `labs` | Locations and labs are organizational units, not inventory concepts. A lab in AIE and a lab in MTP share the same structural model. |
| **Identity & Access** | `users`, `roles`, `user_locations` | Users are admin-managed (email + bcrypt password). Each user has a role and a location_scope_type (`all` or `specific`). Users with `specific` scope have entries in `user_locations` mapping them to accessible locations. |
| **Catalog** | `items`, `item_categories`, `vendors` | The item master list is a shared product catalog. "Acetone" is defined once, not once per lab. Vendors supply across all locations. |
| **Compliance** | `regulations`, `item_regulations` | Regulatory requirements apply to items regardless of where they are stocked. |
| **Lab-specific configuration** | `item_location_settings`, `item_lab_settings` | While the item definition is shared, lab-specific details (min stock, stocked flag) are normalized into junction tables keyed by (item, lab). |
| **PO number lookup** | `po_number_mappings` | Pre-assigned PO numbers per (category, lab, vendor) combination. Used at order time and in vendor emails. |

### Why the item master is not lab-specific

Consider the item "Tetrahydrofuran (THF)":
- Its name, CAS number, catalog number, vendor, category, size, unit, and behavior flags (e.g., `requires_peroxide_monitoring = true`) are **universal facts** about the product.
- But how much THF Lab A keeps on hand (min stock = 3), whether Lab B stocks it at all, and what Lab C's reorder threshold is — these are **lab-specific operational configurations**.

Mixing these two concerns into one table would:
- Require adding columns like `aie_min_stock`, `mtp_min_stock`, `ct_min_stock`, `atc_min_stock` — which breaks normalization, doesn't scale to new locations, and creates wide sparse tables.
- Make it impossible to add a new location without altering the schema.

The correct design is:
- `items` holds the universal product definition.
- `item_lab_settings` holds the per-lab configuration (keyed by `item_id + lab_id`).

This is detailed further in `19-relationship-and-normalization-notes.md`, Section 3.

---

## Layer 2: Transactional Data (Lab-Scoped)

Transactional data represents **operational activity** — things that happen over time. Every transactional record is scoped to a specific lab (and by extension, a location).

### Why lab-scoped

Lab-level scoping reflects the real-world operating model:
- **Inventory lots** are physically stored in a specific lab. A bottle of Acetone in PO Lab at AIE is not the same as a bottle in EOU Lab at MTP.
- **Purchase requests** are submitted for a specific lab's needs.
- **Peroxide tests** are performed on a specific lot in a specific lab.
- **Access control** is enforced at the lab level — a User in PO Lab should not see or modify EOU Lab's inventory.

Every transactional table carries a `lab_id` foreign key (and often `location_id` for query convenience), ensuring that:
1. Row-level security can be applied based on the user's lab assignments.
2. Dashboard queries can filter by lab/location efficiently.
3. Regulatory reports can be scoped to a specific facility.

### What belongs here

| Entity Group | Tables | Scoping |
|---|---|---|
| **Procurement** | `purchase_requests`, `purchase_request_items`, `purchase_request_item_revisions` | Scoped to requesting lab |
| **Vendor comms** | `vendor_email_logs` | Linked to purchase request (inherits lab scope) |
| **Inventory** | `inventory_lots` | Scoped to the lab where the lot is stored |
| **Stock movement** | `stock_transactions` | Scoped to the lot's lab |
| **Safety monitoring** | `peroxide_tests` | Scoped to the tested lot's lab |
| **Expiry management** | `shelf_life_extensions` | Scoped to the extended lot's lab |
| **Operations** | `label_print_logs` | Linked to lot (inherits lab scope) |

---

## Layer 3: Reporting & Audit (Cross-Cutting)

### `audit_logs` — Master Data Change Tracking

The `audit_logs` table tracks changes to **master data** records: items modified, vendors updated, users activated/deactivated, lab settings changed. This is distinct from the `stock_transactions` table, which tracks **operational activity**.

| Concern | Table | What It Tracks |
|---|---|---|
| Operational actions | `stock_transactions` | Checkouts, check-ins, peroxide tests, shelf-life extensions, order actions — i.e., things users do as part of daily work |
| Master data changes | `audit_logs` | Item updated, vendor added, user role changed, min stock threshold modified — i.e., administrative configuration changes |

Both tables are **append-only** (no UPDATE or DELETE). Together they provide a complete audit trail for regulatory compliance.

### Database Views and Functions

Complex dashboard queries (e.g., "show all items below min stock across all labs in AIE") require joining master data, inventory lots, and lab settings. Rather than embedding these complex joins in every API query, the database provides:

- **Views** for common dashboard aggregations (e.g., `v_min_stock_status`, `v_expiry_status`, `v_peroxide_due`).
- **Functions** for calculated values (e.g., days to expiry, total quantity per item per lab).

These are described in `21-reporting-and-dashboard-data-needs.md`.

---

## Entity Relationship Overview

```
locations ──┐
             │ 1:M
             ▼
           labs ──────────────────────────────────┐
             │               1:M          1:M     │
             │                ▼             ▼     │
             │         item_lab_settings  inventory_lots
             │                                │
             │                                │ 1:M
             │                                ▼
             │                         stock_transactions
             │                         peroxide_tests
             │                         shelf_life_extensions
             │
             │ M:N (via user_locations, for specific-scope users)
             ▼
           users ──→ roles
             │
             ├── location_scope_type (all / specific)
             └── password_hash (bcrypt)
```

items ──────────────────────────────────────┐
   │ 1:M              M:N                  │
   ▼                   ▼                   │
item_location_settings  item_regulations    │
   │ 1:M                    │              │
   ▼                        ▼              │
item_lab_settings       regulations        │
                                           │
vendors ◄──────────────────────────────────┘
                                           │
item_categories ◄──────────────────────────┘

purchase_requests ──┐
                     │ 1:M
                     ▼
        purchase_request_items ──┐
                                  │ 1:M
                                  ▼
             purchase_request_item_revisions
```

> **Full field-level detail:** See `18-entity-list-and-field-planning.md`.
> **Normalization rationale:** See `19-relationship-and-normalization-notes.md`.

---

## Naming Conventions

| Convention | Rule | Example |
|---|---|---|
| Table names | Plural, snake_case | `inventory_lots`, `purchase_requests` |
| Column names | Singular, snake_case | `item_name`, `quantity_remaining` |
| Primary keys | `id` (UUID) | `id UUID PRIMARY KEY DEFAULT gen_random_uuid()` |
| Foreign keys | `{referenced_table_singular}_id` | `lab_id`, `item_id`, `vendor_id` |
| Boolean flags | `is_` or `has_` or verb prefix | `is_active`, `has_failed_email`, `requires_peroxide_monitoring` |
| Timestamps | `_at` suffix | `created_at`, `updated_at`, `checked_in_at` |
| User references | `_by` suffix | `created_by`, `approved_by`, `tested_by` |
| Status columns | `status` | `status VARCHAR NOT NULL DEFAULT 'active'` |
| Enum-like values | UPPER_SNAKE_CASE in application; lowercase in DB | `PENDING_APPROVAL` → `'pending_approval'` |

---

## Design Rationale Summary

| Decision | Rationale | Reference |
|---|---|---|
| Shared item master | Prevents data duplication; ensures consistency across labs | §Layer 1 above |
| Lab-scoped inventory | Matches physical reality; enables access control | §Layer 2 above |
| Normalized min stock | Avoids wide sparse tables; scales to new locations | `19-relationship-and-normalization-notes.md` §3 |
| Behavior flags on items | Makes category-driven behavior explicit and queryable | `18-entity-list-and-field-planning.md`, items entity |
| Separate audit_logs vs stock_transactions | Different audiences, different retention, different query patterns | §Layer 3 above |
| Append-only transaction tables | Regulatory compliance; immutable audit trail | All workflow docs (10–16) |
| UUID primary keys | Safe for distributed systems; no sequence conflicts | Industry standard |

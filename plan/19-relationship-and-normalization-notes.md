# 19 — Relationship and Normalization Notes

This document explains the **why** behind key relational design decisions. Each section addresses a specific normalization choice, its rationale, and what would go wrong without it.

---

## 1. Why Locations and Labs Are Separate Tables

### The Design

```
locations (1) ──→ (M) labs
```

- `locations` stores sites/campuses (AIE, MTP, CT, ATC).
- `labs` stores individual laboratories within those sites, with a `location_id` FK.

### Why Not a Single Table?

A single flat table would force one of two bad choices:
1. **Redundant location data** — repeating "AIE" and its address on every lab row, violating 2NF.
2. **Self-referencing hierarchy** — using `parent_id` on a single `organizational_units` table, which works but obscures the domain model and complicates queries.

### Why This Separation Matters

- **Access control** is enforced at the lab level, but reporting is often rolled up to the location level. The two-table design makes both queries natural.
- **Dashboard filters** cascade: Location → Lab. This maps directly to the table hierarchy.
- A location can exist without labs (e.g., a new site being set up).
- A lab always belongs to exactly one location — the FK enforces this.

---

## 2. Why Item Master Is Separate from Inventory Lots

### The Design

```
items (1) ──→ (M) inventory_lots
```

- `items` is the **shared product catalog**. One row per distinct product (e.g., "Acetone, 2.5 L, Sigma-Aldrich"). Shared across the entire organization.
- `inventory_lots` is the **lab-level physical stock**. One row per lot (batch) of an item physically present in a lab.

### Why Not Embed Stock Data in the Items Table?

An item like "Acetone" may be stocked in 8 different labs across 4 locations. Each lab may have 1–5 active lots with different lot numbers, expiry dates, and remaining quantities. Embedding this into the `items` table would mean:

- **Massive data redundancy** — the same item definition (name, CAS, vendor, category, flags) duplicated per lab per lot.
- **No lot-level tracking** — you cannot track "Lot A has 2.0 L remaining, expires June; Lot B has 0.5 L remaining, expires September" in a single row.
- **Update anomalies** — changing the item's vendor would require updating every lot row in every lab.

### The Correct Approach

- `items` answers: "What is this product?" (definition, category, vendor, behavior flags).
- `inventory_lots` answers: "Where is this product, how much of it is there, and what is its status?" (lab, quantity, expiry, lot number, status).
- The `item_id` FK on `inventory_lots` connects the two.

This is standard **master-detail normalization** (3NF).

---

## 3. Why Min Stock Must Be Normalized

### The Anti-Pattern (Spreadsheet Columns)

A common but incorrect approach models min stock like this:

```
items table:
  ...
  aie_po_lab_min   INTEGER
  aie_eou_lab_min  INTEGER
  mtp_po_lab_min   INTEGER
  ct_po_lab_min    INTEGER
  atc_po_lab_min   INTEGER
  ...
```

This fails because:

| Problem | Consequence |
|---|---|
| **Adding a new location/lab** requires a schema change | ALTER TABLE to add columns; redeploy application; update all queries |
| **Sparse data** | Most items are not stocked in most labs; columns are mostly NULL |
| **No referential integrity** | The column name "aie_po_lab_min" has no FK to verify AIE or PO Lab exist |
| **Cannot query generically** | "Show all items below min stock in any lab" requires UNION or complex CASE logic per column |
| **Violates 1NF** | Repeating groups (one column per lab) encode a dimension in the schema instead of the data |

### The Normalized Design

```
items (1) ──→ (M) item_lab_settings
                       ├── item_id   FK → items
                       ├── lab_id    FK → labs
                       ├── min_stock DECIMAL
                       └── ...
```

- One row per (item, lab) combination.
- Adding a new lab = INSERT rows into `item_lab_settings`. No schema change.
- "Items below min stock in Lab X" is a single JOIN, not a per-column CASE statement.
- `lab_id` FK guarantees referential integrity.

### The Two-Level Configuration Pattern

The system actually uses a **two-level** configuration:

```
items (1) ──→ (M) item_location_settings ──→ (M) item_lab_settings
                       ├── item_id                     ├── item_id
                       ├── location_id                 ├── lab_id
                       └── is_stocked                  ├── min_stock
                                                       └── is_stocked
```

- `item_location_settings`: "Is this item stocked at AIE at all?" (location-level)
- `item_lab_settings`: "What is the min stock for this item in PO Lab at AIE?" (lab-level)

This two-level approach allows:
- A location-level "not stocked here" flag without requiring lab-level rows.
- Lab-level overrides where needed.
- Queries to filter efficiently: first by location, then by lab.

---

## 4. Why Peroxide Results Need Their Own Table

### The Design

```
inventory_lots (1) ──→ (M) peroxide_tests
```

### Why Not Store Peroxide Data on the Lot Record?

A single lot may be tested **multiple times** over its lifetime (e.g., every 3–6 months). Each test is a distinct event with its own date, tester, result, and classification. Storing only "the latest result" on the lot would:

- **Lose test history** — no audit trail of previous readings.
- **Prevent trend analysis** — cannot see if PPM is increasing over time.
- **Violate 1NF** — if you try to store multiple results (e.g., `ppm_1`, `ppm_2`, `ppm_3`), you're encoding an unbounded list in columns.
- **Fail regulatory requirements** — inspectors need the complete test history, not just the current value.

### What the Lot Record Does Store

The lot record (`inventory_lots`) does **not** store test results directly. However, the lot's `status` field is updated when a quarantine result occurs (status → `quarantined`). This is a denormalized convenience field to enable efficient status-based queries (e.g., "block checkout if lot is quarantined").

The following fields on `inventory_lots` are relevant to peroxide tracking:
- `open_date` — when the container was first opened.
- `status` — may be set to `quarantined` by a peroxide test result.
- `extension_count` — tracks shelf-life extensions.

But the actual test data (PPM, classification, tester, notes) lives in `peroxide_tests`.

---

## 5. Why Shelf-Life Extensions Need a History Table

### The Design

```
inventory_lots (1) ──→ (M) shelf_life_extensions
```

### Why Not Just Update the Expiry Date?

If the system simply overwrote `inventory_lots.expiry_date` with the new date, the following would be lost:

| Lost Data | Why It Matters |
|---|---|
| Previous expiry date | Cannot verify what the original shelf life was |
| Extension count | Cannot tell if a lot has been extended 1 time or 5 times |
| Justification | No audit evidence for why the extension was granted |
| Qualifying test | No record of the test that justified the extension |
| Authorizer | No record of who approved the extension |
| Before/after comparison | Cannot calculate the magnitude of the extension |

### What the Lot Record Does Store

The lot record's `expiry_date` field is updated to the **new** expiry date. Additionally:
- `extension_count` is incremented by 1 on each extension.

But the full history — old date, new date, reason, test, authorizer — lives in `shelf_life_extensions`, one row per extension event. These rows are **immutable** (no UPDATE or DELETE).

---

## 6. Why Audit/Transaction History Is Essential

### Two Separate Audit Concerns

| Concern | Table | Tracks |
|---|---|---|
| **Operational actions** | `stock_transactions` | Checkouts, check-ins, orders, peroxide tests, shelf-life extensions |
| **Configuration changes** | `audit_logs` | Item master updates, vendor changes, user role changes, min-stock threshold changes |

### Why Not a Single Audit Table?

While a single audit table is simpler, these two concerns have different:

| Aspect | stock_transactions | audit_logs |
|---|---|---|
| **Audience** | Lab Users, Focal Points, Auditors | Admins, IT, Compliance |
| **Volume** | High (500–1000 checkouts/month across all labs) | Low (maybe 10–50 master data changes/month) |
| **Query patterns** | "Show all checkouts for this lot", "Show all peroxide tests this quarter" | "Who changed this item's vendor?", "When was this user deactivated?" |
| **Retention** | Indefinite (regulatory requirement) | Indefinite (regulatory requirement) |
| **Structure** | Typed with `transaction_type` + `metadata` JSONB | Generic with `table_name` + `changed_fields` JSONB |

Separating them allows:
- Different indexing strategies.
- Different access control (Lab Users see operational transactions; only Admins see configuration changes).
- Cleaner queries without type-filtering overhead.

### Immutability

Both tables are **append-only**: `INSERT` only, no `UPDATE`, no `DELETE`. This is a core design principle for regulatory compliance. If incorrect data is entered (e.g., wrong checkout quantity), a corrective transaction is added (`ADJUSTMENT` type), preserving the original erroneous record for audit trail completeness.

---

## 7. Why Purchase Request Items Have a Revisions Table

### The Design

```
purchase_request_items (1) ──→ (M) purchase_request_item_revisions
```

### Why Not Just Update the Line Item?

When a Focal Point modifies an order before approval, the system must preserve:
- **What the original requester ordered** — the original quantity, vendor, and items.
- **What was changed** — field-by-field before/after values.
- **Who changed it** — the modifier and timestamp.

If the system simply updated the `purchase_request_items` row:
- The original request values would be lost.
- There would be no evidence of what was modified.
- Audit and dispute resolution would be impossible.

The revisions table creates a complete **change log** with one row per field modification, enabling full traceability.

---

## 8. Primary Key Strategy: UUIDs

All tables use `UUID` primary keys (`gen_random_uuid()`) instead of auto-incrementing integers. The rationale:

| Benefit | Detail |
|---|---|
| **No sequence conflicts** | Safe for future distributed deployments, data imports, and migrations |
| **Opaque identifiers** | Cannot infer record counts or creation order from the ID |
| **QR code stability** | QR codes embed lot IDs; UUIDs remain valid even if data is migrated between databases |
| **ORM compatibility** | Entity Framework Core handles UUID PKs natively |

### Trade-off

UUID indexes are slightly larger than integer indexes. At the projected volume (~17,000 transactions/year), this is negligible.

---

## 9. Denormalization Choices

Some columns are intentionally denormalized for query convenience:

| Denormalized Column | On Table | Why |
|---|---|---|
| `location_id` | `inventory_lots`, `purchase_requests`, `stock_transactions` | Avoids a JOIN through `labs` to get the location for every dashboard/filter query. Maintained by the application on INSERT. |
| `user_name` | `stock_transactions` | Audit views need the actor's name, but the user could be deactivated/renamed. Denormalizing at write time preserves the name at the time of the action. |
| `unit` | `purchase_request_items`, `inventory_lots` | Copied from item at the time of creation. If the item's unit changes later, historical records retain the correct unit. |

These denormalized values are set once on INSERT and never updated (except `location_id` which would only change in a lab transfer scenario, which is a future feature).

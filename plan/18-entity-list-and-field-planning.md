# 18 — Entity List and Field Planning

This document describes every planned database entity, its key fields, purpose, and relationships. This is a **planning reference** — not executable DDL. See `17-database-conceptual-model.md` for the three-layer model these entities fit into.

All tables include standard audit columns unless otherwise noted:
- `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
- `updated_at TIMESTAMPTZ`
- `created_by UUID` (FK → users)
- `updated_by UUID` (FK → users)

All primary keys are `id UUID NOT NULL DEFAULT gen_random_uuid()`.

---

## Layer 1: Master Data

---

### 1. `locations`

Physical sites / campuses where labs operate.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | UUID PK | No | |
| `name` | VARCHAR(100) | No | Display name (e.g., "AIE", "MTP", "CT", "ATC") |
| `code` | VARCHAR(10) | No | Short code, unique (e.g., `AIE`) |
| `address` | TEXT | Yes | Physical address |
| `is_active` | BOOLEAN | No | Soft-delete / deactivation flag. Default `true` |

**Unique:** `code`

---

### 2. `labs`

Laboratories within a location. A location has one or more labs.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | UUID PK | No | |
| `location_id` | UUID FK → locations | No | Parent location |
| `name` | VARCHAR(100) | No | Display name (e.g., "PO Lab", "EOU Lab") |
| `code` | VARCHAR(20) | Yes | Optional short code |
| `description` | TEXT | Yes | |
| `is_active` | BOOLEAN | No | Default `true` |

**Unique:** `(location_id, name)`

---

### 3. `roles`

System-wide role definitions.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | UUID PK | No | |
| `name` | VARCHAR(50) | No | Role name: `admin`, `focal_point`, `user` |
| `display_name` | VARCHAR(100) | No | Human-readable: "Admin", "Focal Point", "User" |
| `description` | TEXT | Yes | |
| `is_active` | BOOLEAN | No | Default `true` |

**Unique:** `name`

---

### 4. `users`

All system users. Accounts are **admin-managed** — there is no self-registration. Authentication uses email + hashed password; the system issues JWT tokens.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | UUID PK | No | |
| `email` | VARCHAR(255) | No | Primary email, unique. Used as the login identifier. |
| `password_hash` | VARCHAR(255) | No | Bcrypt-hashed password. Plain-text passwords are **never stored**. |
| `full_name` | VARCHAR(200) | No | |
| `role_id` | UUID FK → roles | No | User's system role |
| `location_scope_type` | VARCHAR(20) | No | `all` or `specific`. Admins always `all`. Default `specific`. |
| `is_active` | BOOLEAN | No | Default `true`. Deactivated users cannot log in. |
| `last_login_at` | TIMESTAMPTZ | Yes | Last successful login timestamp |

**Unique:** `email`

> **Note:** `external_id` has been removed. This system does not integrate with an external identity provider. Authentication is fully managed by the backend.

---

### 5. `user_locations`

Junction table mapping users to the **locations** they can access. Only populated when `users.location_scope_type = 'specific'`. Users with `all` scope do not need entries here — they have implicit access to all locations.

Lab access is **derived from location access**: if a user has access to a location, they can access all labs within that location.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | UUID PK | No | |
| `user_id` | UUID FK → users | No | |
| `location_id` | UUID FK → locations | No | |

**Unique:** `(user_id, location_id)`

---

### 6. `vendors`

Supplier / vendor master list.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | UUID PK | No | |
| `name` | VARCHAR(200) | No | Vendor name (e.g., "Sigma-Aldrich") |
| `code` | VARCHAR(20) | Yes | Optional short code |
| `contact_email` | VARCHAR(255) | Yes | Primary order email |
| `contact_phone` | VARCHAR(50) | Yes | |
| `website` | VARCHAR(500) | Yes | |
| `address` | TEXT | Yes | |
| `notes` | TEXT | Yes | |
| `is_active` | BOOLEAN | No | Default `true` |

**Unique:** `name`

---

### 7. `item_categories`

Categories for the item master (e.g., Chemical & Reagent, Gas, Material & Consumable, Verify STD).

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | UUID PK | No | |
| `name` | VARCHAR(100) | No | Category name |
| `code` | VARCHAR(20) | No | Short code (e.g., `CHEM`, `GAS`, `MAT`, `STD`) |
| `description` | TEXT | Yes | |
| `display_order` | INTEGER | No | Sort order in UI dropdowns |
| `is_active` | BOOLEAN | No | Default `true` |

**Unique:** `name`, `code`

---

### 8. `items`

The **shared item master list**. Every orderable or trackable material/chemical is defined here once, shared across all locations and labs. Lab-specific settings (min stock, stocked flag) are in `item_lab_settings`.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | UUID PK | No | |
| `item_name` | VARCHAR(300) | No | Full official name |
| `item_short_name` | VARCHAR(100) | Yes | Abbreviated name for labels and compact views |
| `part_no` | VARCHAR(100) | Yes | Manufacturer part number / catalog number |
| `cas_no` | VARCHAR(50) | Yes | CAS registry number (chemicals only) |
| `category_id` | UUID FK → item_categories | No | Item category |
| `default_vendor_id` | UUID FK → vendors | Yes | Default / preferred vendor |
| `type` | VARCHAR(50) | Yes | Sub-type within category (e.g., "Solvent", "Acid", "Standard") |
| `size` | VARCHAR(50) | Yes | Package size (e.g., "2.5 L", "500 mL", "1 kg") |
| `unit` | VARCHAR(20) | No | Unit of measure (e.g., "L", "mL", "kg", "g", "ea") |
| `reference_price` | DECIMAL(12,2) | Yes | Indicative / reference price per unit (not binding) |
| `currency` | VARCHAR(3) | Yes | Currency code for reference price (e.g., "USD") |
| `lead_time_days` | INTEGER | Yes | Typical procurement lead time in days |
| `description` | TEXT | Yes | Detailed description or specifications |
| `storage_conditions` | VARCHAR(200) | Yes | Storage requirements (e.g., "Refrigerate 2–8°C", "Flammable cabinet") |
| **Behavior Flags** | | | |
| `is_orderable` | BOOLEAN | No | Can this item be added to a purchase request? Default `true` |
| `requires_checkin` | BOOLEAN | No | Must be checked in upon receipt? Default `true` |
| `allows_checkout` | BOOLEAN | No | Can be checked out via the checkout workflow? Default `true` |
| `tracks_expiry` | BOOLEAN | No | Does this item have an expiry date to monitor? Default `true` |
| `requires_peroxide_monitoring` | BOOLEAN | No | Is this a peroxide-forming chemical? Default `false` |
| `peroxide_class` | VARCHAR(20) | Yes | Peroxide sub-type: `Peroxide_TS`, `Peroxide_CRF`, `Peroxide_A`, `Peroxide_B`, `Peroxide_C1`, `Peroxide_C2`, `Peroxide_D`, `Peroxide_D1`, `Peroxide_D2` (null if not peroxide-forming). See `13-peroxide-workflow.md`. |
| `is_regulatory_related` | BOOLEAN | No | Does this item have regulatory reporting requirements? Default `false` |
| `expiry_warning_days` | INTEGER | Yes | Days before expiry to trigger an expiry warning notification (e.g., 14 = warn 14 days before expiry). Per-item override of system default. Spreadsheet shows most items use 14 days; some use 30 or 60 days. |
| `is_long_lead_time` | BOOLEAN | No | Indicates if this item has a long procurement lead time. Default `false`. Used for dashboard filtering and ordering priority. |
| `is_active` | BOOLEAN | No | Soft-delete flag. Default `true` |

**Unique:** `(part_no, default_vendor_id)` where both are non-null (same part number from the same vendor is the same item)

**Notes on behavior flags:**
- These flags make category-driven behavior **explicit and queryable**. Rather than writing logic like `IF category = 'Verify STD' THEN is_orderable = false`, the flag is stored directly on the item.
- Flags allow exceptions: a Material & Consumable item can set `is_orderable = false` if it is not available for ordering, even though the category generally is orderable.
- Default values for behavior flags should be set based on category when creating a new item (via application logic), but can be overridden per item.

**Category-to-flag defaults (application logic, not DB constraint):**

| Category | `is_orderable` | `requires_checkin` | `allows_checkout` | `tracks_expiry` | `requires_peroxide_monitoring` | `is_regulatory_related` |
|---|---|---|---|---|---|---|
| Chemical & Reagent | `true` | `true` | `true` | `true` | Per-item | Per-item |
| Gas | `true` | `false` (MVP) | `false` | `false` | `false` | `false` |
| Material & Consumable | Per-item | `true` | `true` | `false` | `false` | `false` |
| Verify STD | `false` | `true` (manual) | `true` | `true` | `false` | `true` |

---

### 9. `item_location_settings`

Per-item, per-location configuration. This is a **thin** layer between `items` and `item_lab_settings` that captures location-level defaults (e.g., "Is this item stocked at AIE at all?").

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | UUID PK | No | |
| `item_id` | UUID FK → items | No | |
| `location_id` | UUID FK → locations | No | |
| `is_stocked` | BOOLEAN | No | Is this item generally stocked at this location? Default `false` |
| `notes` | TEXT | Yes | Location-specific notes |

**Unique:** `(item_id, location_id)`

---

### 10. `item_lab_settings`

Per-item, per-lab configuration. This is where **min stock thresholds** live — properly normalized, not as spreadsheet columns.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | UUID PK | No | |
| `item_id` | UUID FK → items | No | |
| `lab_id` | UUID FK → labs | No | |
| `min_stock` | DECIMAL(12,3) | Yes | Minimum stock threshold for this item in this lab. Null = no minimum configured. |
| `max_stock` | DECIMAL(12,3) | Yes | Maximum stock threshold for this item in this lab. Null = no maximum configured. Spreadsheet provides max stock per location; normalize to per-lab. |
| `reorder_quantity` | DECIMAL(12,3) | Yes | Suggested reorder quantity when below min stock |
| `is_stocked` | BOOLEAN | No | Is this item stocked in this specific lab? Default `false` |
| `storage_sublocation` | VARCHAR(100) | Yes | Default storage sublocation (e.g., "Cabinet A3", "Fridge 2") |
| `notes` | TEXT | Yes | Lab-specific notes |

**Unique:** `(item_id, lab_id)`

---

### 11. `regulations`

Regulatory frameworks and standards that may apply to items.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | UUID PK | No | |
| `name` | VARCHAR(200) | No | Regulation name (e.g., "ISO 17025", "GLP", "OSHA HazCom") |
| `code` | VARCHAR(50) | No | Short code |
| `description` | TEXT | Yes | |
| `is_active` | BOOLEAN | No | Default `true` |

**Unique:** `code`

---

### 12. `item_regulations`

Many-to-many junction between items and regulations.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | UUID PK | No | |
| `item_id` | UUID FK → items | No | |
| `regulation_id` | UUID FK → regulations | No | |
| `compliance_notes` | TEXT | Yes | Specific compliance notes for this item under this regulation |

**Unique:** `(item_id, regulation_id)`

---

### 12a. `po_number_mappings`

Pre-assigned PO numbers keyed by (category, lab, vendor). Used when creating purchase requests and sending vendor emails. PO numbers are **not auto-generated**; they are fixed reference strings assigned by procurement.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | UUID PK | No | |
| `category_id` | UUID FK → item_categories | No | Item category |
| `lab_id` | UUID FK → labs | No | Target lab |
| `vendor_id` | UUID FK → vendors | No | Vendor |
| `po_number` | VARCHAR(50) | No | Pre-assigned PO number string (e.g., "45182095PG") |
| `description` | TEXT | Yes | Optional description |
| `is_active` | BOOLEAN | No | Default `true` |

**Unique:** `po_number`
**Index:** `(category_id, lab_id, vendor_id)`

> **Note:** Some (category, lab, vendor) triples have multiple PO numbers (e.g., PE Lab has 3 Gas PO numbers for BIG). The unique constraint is on `po_number`, not on the triple.

---

## Layer 2: Transactional Data

---

### 13. `purchase_requests`

An order submitted by a user for a specific lab. This is the "order header" — called `purchase_requests` rather than `orders` to distinguish from the vendor-facing PO number.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | UUID PK | No | |
| `request_number` | VARCHAR(50) | No | System-generated internal reference number (e.g., `REQ-2026-0001`). Unique. For internal tracking. |
| `lab_id` | UUID FK → labs | No | Target lab for this order |
| `location_id` | UUID FK → locations | No | Denormalized from lab for query convenience |
| `requested_by` | UUID FK → users | No | User who submitted the order |
| `status` | VARCHAR(30) | No | See `20-statuses-enums-and-reference-data.md`. Default `'pending_approval'` |
| `order_notes` | TEXT | Yes | Order-level notes from the requester |
| `approval_notes` | TEXT | Yes | Notes from the approver (approve or reject) |
| `approved_by` | UUID FK → users | Yes | Focal Point / Admin who approved |
| `approved_at` | TIMESTAMPTZ | Yes | Approval timestamp |
| `rejected_reason` | TEXT | Yes | Reason for rejection (required if status = cancelled via rejection) |
| `submitted_at` | TIMESTAMPTZ | No | When the order was submitted |
| `email_sent_at` | TIMESTAMPTZ | Yes | When vendor emails were dispatched |
| `has_failed_email` | BOOLEAN | No | True if any vendor email failed all retries. Default `false` |
| `completed_at` | TIMESTAMPTZ | Yes | When all line items were fully received |

**Unique:** `request_number`

> **Note:** The vendor-facing PO number is looked up from `po_number_mappings` at the vendor-email level (per vendor group), not stored directly on the purchase request header. A single purchase request may reference multiple PO numbers if items span multiple vendors.

**Indexes:** `lab_id`, `status`, `submitted_at`, `requested_by`

---

### 14. `purchase_request_items`

Individual line items within a purchase request.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | UUID PK | No | |
| `purchase_request_id` | UUID FK → purchase_requests | No | Parent order |
| `item_id` | UUID FK → items | No | Catalog item being ordered |
| `vendor_id` | UUID FK → vendors | Yes | Vendor for this line item (defaults from item.default_vendor_id) |
| `quantity_ordered` | DECIMAL(12,3) | No | Quantity requested |
| `quantity_received` | DECIMAL(12,3) | No | Quantity received so far. Default `0` |
| `unit` | VARCHAR(20) | No | Unit of measure (copied from item at time of order) |
| `unit_price` | DECIMAL(12,2) | Yes | Price per unit at time of order (nullable) |
| `line_item_notes` | TEXT | Yes | Per-line notes |
| `status` | VARCHAR(30) | No | Line-item status: `pending`, `partially_received`, `fully_received`, `removed`. Default `'pending'` |

**Indexes:** `purchase_request_id`, `item_id`, `vendor_id`

---

### 15. `purchase_request_item_revisions`

Records Focal Point modifications to line items before approval. Each revision captures a before/after snapshot.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | UUID PK | No | |
| `purchase_request_item_id` | UUID FK → purchase_request_items | Yes | The line item modified (null if the revision is an addition or relates to the order header) |
| `purchase_request_id` | UUID FK → purchase_requests | No | Parent order |
| `action` | VARCHAR(20) | No | `modified`, `added`, `removed` |
| `field_name` | VARCHAR(50) | Yes | Which field was changed (e.g., `quantity_ordered`, `vendor_id`) |
| `old_value` | TEXT | Yes | Previous value (as string representation) |
| `new_value` | TEXT | Yes | New value (as string representation) |
| `revised_by` | UUID FK → users | No | User who made the modification |
| `revised_at` | TIMESTAMPTZ | No | Timestamp of revision |
| `notes` | TEXT | Yes | Revision notes |

**Indexes:** `purchase_request_id`, `purchase_request_item_id`

---

### 16. `vendor_email_logs`

Records of vendor notification emails sent for purchase requests.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | UUID PK | No | |
| `purchase_request_id` | UUID FK → purchase_requests | No | Related order |
| `vendor_id` | UUID FK → vendors | No | Target vendor |
| `recipient_email` | VARCHAR(255) | No | Email address used |
| `subject` | VARCHAR(500) | No | Email subject line |
| `body_html` | TEXT | Yes | Email body (HTML) |
| `status` | VARCHAR(20) | No | `sent`, `failed`, `retrying` |
| `retry_count` | INTEGER | No | Number of retry attempts. Default `0` |
| `last_retry_at` | TIMESTAMPTZ | Yes | Timestamp of last retry |
| `error_message` | TEXT | Yes | Error details if failed |
| `sent_at` | TIMESTAMPTZ | Yes | Successful dispatch timestamp |
| `items_included` | INTEGER | No | Count of line items included in this email |

**Indexes:** `purchase_request_id`, `vendor_id`, `status`

---

### 17. `inventory_lots`

The core inventory table. Each row represents a **specific lot** of a specific item in a specific lab. This is where stock quantities, expiry dates, and lot-level status live.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | UUID PK | No | |
| `item_id` | UUID FK → items | No | Catalog item |
| `lab_id` | UUID FK → labs | No | Lab where this lot is stored |
| `location_id` | UUID FK → locations | No | Denormalized from lab |
| `lot_number` | VARCHAR(100) | No | Vendor-assigned or internal lot/batch number |
| `quantity_received` | DECIMAL(12,3) | No | Original quantity at check-in |
| `quantity_remaining` | DECIMAL(12,3) | No | Current remaining quantity |
| `unit` | VARCHAR(20) | No | Unit of measure |
| `manufacture_date` | DATE | Yes | Date of manufacture |
| `expiry_date` | DATE | Yes | Current expiry date (may be extended) |
| `open_date` | DATE | Yes | Date the container was first opened |
| `storage_sublocation` | VARCHAR(200) | Yes | Physical storage (cabinet, shelf, fridge) |
| `status` | VARCHAR(20) | No | Lot status: `active`, `depleted`, `expired`, `quarantined`, `disposed`. Default `'active'` |
| `source_type` | VARCHAR(20) | No | `purchase_order` or `manual` |
| `purchase_request_id` | UUID FK → purchase_requests | Yes | Source order (null if manual check-in) |
| `purchase_request_item_id` | UUID FK → purchase_request_items | Yes | Source line item (null if manual check-in) |
| `checked_in_by` | UUID FK → users | No | User who performed check-in |
| `checked_in_at` | TIMESTAMPTZ | No | Check-in timestamp |
| `qr_code_data` | JSONB | Yes | QR code payload data |
| `extension_count` | INTEGER | No | Number of shelf-life extensions. Default `0` |
| `version` | INTEGER | No | Optimistic concurrency version. Default `1`. Incremented on every `quantity_remaining` update. |
| `notes` | TEXT | Yes | Check-in notes |
| `manual_source_reason` | VARCHAR(50) | Yes | For manual check-ins: `donation`, `transfer`, `direct_delivery`, `other` |
| `certificate_of_analysis` | VARCHAR(200) | Yes | CoA reference (for Verify STD) |
| `assigned_value` | VARCHAR(100) | Yes | Certified value (for Verify STD) |
| `uncertainty` | VARCHAR(100) | Yes | Uncertainty value (for Verify STD) |
| `certifying_body` | VARCHAR(200) | Yes | Certifying organization (for Verify STD) |

**Indexes:** `lab_id`, `item_id`, `status`, `expiry_date`, `(item_id, lab_id)`, `lot_number`

---

### 18. `stock_transactions`

**Append-only** log of every operational action in the system. This serves as both the transaction history and the primary audit trail for daily operations. See `16-transaction-history-and-audit.md` for the full transaction type catalog.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | UUID PK | No | |
| `transaction_type` | VARCHAR(30) | No | One of the 16 defined types (see `20-statuses-enums-and-reference-data.md`) |
| `user_id` | UUID FK → users | No | User who performed the action |
| `user_name` | VARCHAR(200) | No | Denormalized for display in audit views |
| `lab_id` | UUID FK → labs | Yes | Lab context (nullable for org-wide actions) |
| `location_id` | UUID FK → locations | Yes | Location context |
| `lot_id` | UUID FK → inventory_lots | Yes | Related lot (if applicable) |
| `purchase_request_id` | UUID FK → purchase_requests | Yes | Related order (if applicable) |
| `item_id` | UUID FK → items | Yes | Related item (if applicable) |
| `quantity` | DECIMAL(12,3) | Yes | Quantity involved (if applicable) |
| `notes` | TEXT | Yes | |
| `metadata` | JSONB | No | Type-specific structured data (see `16-transaction-history-and-audit.md`) |
| `created_at` | TIMESTAMPTZ | No | Immutable timestamp. Default `now()` |

**No `updated_at` or `updated_by`** — this table is append-only.

**Indexes:** `transaction_type`, `lab_id`, `lot_id`, `purchase_request_id`, `item_id`, `created_at`, `user_id`

---

### 19. `peroxide_tests`

Individual peroxide monitoring events, each linked to a specific inventory lot.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | UUID PK | No | |
| `lot_id` | UUID FK → inventory_lots | No | Tested lot |
| `test_date` | DATE | No | Date the test was performed |
| `tested_by` | UUID FK → users | No | User who performed the test |
| `test_method` | VARCHAR(100) | Yes | Method: "Test strip", "Titration", "Electronic meter", etc. |
| `result_type` | VARCHAR(20) | No | `numeric`, `textual`, or `visual_inspection` |
| `ppm_result` | DECIMAL(8,2) | Yes | PPM measurement (required if result_type = numeric) |
| `result_text` | VARCHAR(200) | Yes | Textual result (required if result_type = textual or visual_inspection, e.g., "Pass", "Fail", "Negative") |
| `classification` | VARCHAR(20) | No | `normal`, `warning`, `quarantine` |
| `visual_observations` | TEXT | Yes | |
| `next_monitor_due` | DATE | Yes | Auto-calculated next test date (null if quarantined) |
| `notes` | TEXT | Yes | |

**Indexes:** `lot_id`, `test_date`, `classification`, `next_monitor_due`

---

### 20. `shelf_life_extensions`

Immutable record of each shelf-life extension event. One row per extension, per lot.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | UUID PK | No | |
| `lot_id` | UUID FK → inventory_lots | No | Extended lot |
| `extension_number` | INTEGER | No | Sequential number per lot (1, 2, 3, …) |
| `previous_expiry_date` | DATE | No | Expiry date before extension |
| `new_expiry_date` | DATE | No | Expiry date after extension |
| `previous_days_to_expiry` | INTEGER | No | Calculated: old expiry − extension date |
| `new_days_to_expiry` | INTEGER | No | Calculated: new expiry − extension date |
| `extension_days` | INTEGER | No | Calculated: new expiry − old expiry |
| `reason` | TEXT | No | Justification |
| `test_performed` | TEXT | No | Qualifying test description |
| `test_result` | VARCHAR(200) | No | Test outcome |
| `test_date` | DATE | No | When the qualifying test was performed |
| `authorized_by` | UUID FK → users | No | Focal Point / Admin |

**No `updated_at` or `updated_by`** — this table is append-only.

**Indexes:** `lot_id`, `extension_number`
**Unique:** `(lot_id, extension_number)`

---

### 21. `label_print_logs`

Records of QR label printing events for audit traceability.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | UUID PK | No | |
| `lot_id` | UUID FK → inventory_lots | No | Lot the label was printed for |
| `printed_by` | UUID FK → users | No | User who triggered printing |
| `printed_at` | TIMESTAMPTZ | No | Default `now()` |
| `print_method` | VARCHAR(20) | No | `single`, `batch` |
| `copies` | INTEGER | No | Number of copies printed. Default `1` |

**Indexes:** `lot_id`

---

## Layer 3: Reporting & Audit

---

### 22. `audit_logs`

Tracks **master data changes** (as opposed to `stock_transactions` which tracks operational activity). This table records when admin-level data is created, updated, or deactivated.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | UUID PK | No | |
| `table_name` | VARCHAR(100) | No | Which table was changed (e.g., `items`, `vendors`, `users`) |
| `record_id` | UUID | No | PK of the changed record |
| `action` | VARCHAR(20) | No | `insert`, `update`, `delete` (logical) |
| `changed_fields` | JSONB | Yes | `{ "field_name": { "old": "...", "new": "..." } }` |
| `changed_by` | UUID FK → users | No | User who made the change |
| `changed_at` | TIMESTAMPTZ | No | Default `now()` |
| `ip_address` | VARCHAR(45) | Yes | Client IP (if available) |

**No `updated_at` or `updated_by`** — this table is append-only.

**Indexes:** `table_name`, `record_id`, `changed_by`, `changed_at`

---

## Summary: Entity Count

| Layer | Entities | Count |
|---|---|---|
| Master Data | locations, labs, roles, users, user_locations, vendors, item_categories, items, item_location_settings, item_lab_settings, regulations, item_regulations, po_number_mappings | 13 |
| Transactional | purchase_requests, purchase_request_items, purchase_request_item_revisions, vendor_email_logs, inventory_lots, stock_transactions, peroxide_tests, shelf_life_extensions, label_print_logs | 9 |
| Reporting & Audit | audit_logs | 1 |
| **Total** | | **23** |

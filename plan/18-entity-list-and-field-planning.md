# 18 — Entity List and Field Planning

This document defines the major database entities, their key fields, data types, constraints, and relationships. This is a planning document — not executable DDL. Light SQL-style notation is used for clarity.

> **Convention:** All tables include audit columns (`created_at`, `updated_at`, `created_by`, `updated_by`) unless noted. These are omitted from the field lists below for brevity.

---

## 1. locations

**Purpose:** Top-level organizational unit. Examples: AIE, MTP, CT, ATC.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK | Unique location identifier |
| `code` | VARCHAR(20) | UNIQUE, NOT NULL | Short code (e.g., `AIE`, `MTP`) |
| `name` | VARCHAR(150) | NOT NULL | Full name (e.g., "Analytical & Industrial Engineering") |
| `address` | TEXT | NULL | Physical address |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT true | Soft delete flag |

---

## 2. labs

**Purpose:** Sub-unit of a location where inventory is owned and operations occur.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK | Unique lab identifier |
| `location_id` | UUID | FK → locations, NOT NULL | Parent location |
| `code` | VARCHAR(30) | NOT NULL | Short code (e.g., `PO_LAB`, `EOU`) |
| `name` | VARCHAR(150) | NOT NULL | Full name (e.g., "PO Lab") |
| `description` | TEXT | NULL | Description or notes about the lab |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT true | Soft delete flag |

**Unique constraint:** `(location_id, code)` — lab codes unique within a location.

---

## 3. users

**Purpose:** All system users (admins, focal points, lab users, auditors).

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK | Unique user identifier |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Login email / SSO identifier |
| `first_name` | VARCHAR(100) | NOT NULL | First name |
| `last_name` | VARCHAR(100) | NOT NULL | Last name |
| `display_name` | VARCHAR(200) | NOT NULL | Computed or entered display name |
| `phone` | VARCHAR(30) | NULL | Contact phone number |
| `external_id` | VARCHAR(255) | UNIQUE, NULL | Enterprise IdP identifier (Azure AD OID, etc.) |
| `role_id` | UUID | FK → roles, NOT NULL | User's system-wide role |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT true | Soft delete / deactivation flag |
| `last_login_at` | TIMESTAMPTZ | NULL | Most recent login timestamp |

---

## 4. roles

**Purpose:** System-wide role definitions.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK | Unique role identifier |
| `name` | VARCHAR(50) | UNIQUE, NOT NULL | Role name |
| `description` | TEXT | NULL | Human-readable description |

**Seed data:**

| name | Description |
|---|---|
| `Admin` | Full system access across all locations and labs |
| `Focal Point` | Lab manager; approve orders, manage inventory, perform monitoring |
| `Lab User` | Standard user; order, checkout, log tests within assigned labs |
| `Viewer` | Read-only access for auditors and compliance reviewers |

---

## 5. user_labs

**Purpose:** Maps users to labs, defining their operational scope. A user can be assigned to multiple labs.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK | Unique assignment identifier |
| `user_id` | UUID | FK → users, NOT NULL | The user |
| `lab_id` | UUID | FK → labs, NOT NULL | The lab the user can access |
| `is_primary` | BOOLEAN | NOT NULL, DEFAULT false | Whether this is the user's default lab |

**Unique constraint:** `(user_id, lab_id)` — prevent duplicate assignments.

> **Note:** The user's role (`users.role_id`) is system-wide. The lab assignment determines scope, not permissions. Admin users have implicit access to all labs.

---

## 6. vendors

**Purpose:** Vendors/suppliers who provide chemicals, reagents, or materials.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK | Unique vendor identifier |
| `name` | VARCHAR(200) | NOT NULL | Vendor company name |
| `code` | VARCHAR(30) | UNIQUE, NULL | Short vendor code |
| `contact_name` | VARCHAR(150) | NULL | Primary contact person |
| `contact_email` | VARCHAR(255) | NULL | Primary order email address |
| `contact_phone` | VARCHAR(30) | NULL | Phone number |
| `website` | VARCHAR(500) | NULL | Vendor website |
| `address` | TEXT | NULL | Vendor address |
| `notes` | TEXT | NULL | Internal notes about the vendor |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT true | Soft delete flag |

---

## 7. item_categories

**Purpose:** Classification of items by behavior type.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK | Unique category identifier |
| `name` | VARCHAR(100) | UNIQUE, NOT NULL | Category name |
| `code` | VARCHAR(30) | UNIQUE, NOT NULL | Short code for system use |
| `description` | TEXT | NULL | Description of the category |
| `display_order` | INT | NOT NULL, DEFAULT 0 | Sort order in UI dropdowns |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT true | Soft delete flag |

**Seed data:**

| code | name |
|---|---|
| `CHEM_REAGENT` | Chemical & Reagent |
| `VERIFY_STD` | Verify STD |
| `GAS` | Gas |
| `MAT_CONSUMABLE` | Material & Consumable |

---

## 8. items

**Purpose:** Organization-wide item master list (shared catalog). Every orderable or trackable item has one record here.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK | Unique item identifier |
| `item_name` | VARCHAR(300) | NOT NULL | Full item name |
| `item_short_name` | VARCHAR(100) | NULL | Abbreviated name for labels and compact views |
| `part_no` | VARCHAR(100) | NULL | Manufacturer or catalog part number |
| `cas_number` | VARCHAR(30) | NULL | CAS registry number (for chemicals) |
| `category_id` | UUID | FK → item_categories, NOT NULL | Item category |
| `default_vendor_id` | UUID | FK → vendors, NULL | Default/preferred vendor |
| `type` | VARCHAR(50) | NULL | Sub-type within category (e.g., "Solvent", "Acid", "Calibration Gas") |
| `size` | VARCHAR(50) | NULL | Package size description (e.g., "2.5 L", "500 mL", "25 kg") |
| `unit` | VARCHAR(30) | NOT NULL | Unit of measure (e.g., "L", "mL", "kg", "each") |
| `default_price` | DECIMAL(12,2) | NULL | Reference/estimated price (not binding) |
| `currency` | VARCHAR(3) | NULL, DEFAULT 'USD' | Currency for the reference price |
| `lead_time_days` | INT | NULL | Default procurement lead time in days |
| `description` | TEXT | NULL | Detailed item description |
| `storage_instructions` | TEXT | NULL | Handling or storage notes |
| `sds_url` | VARCHAR(500) | NULL | Link to Safety Data Sheet |
| **Behavior Flags** | | | |
| `is_orderable` | BOOLEAN | NOT NULL, DEFAULT true | Can be added to cart and ordered |
| `requires_checkin` | BOOLEAN | NOT NULL, DEFAULT true | Must be checked in upon receipt |
| `allows_checkout` | BOOLEAN | NOT NULL, DEFAULT true | Can be checked out from inventory |
| `tracks_expiry` | BOOLEAN | NOT NULL, DEFAULT true | Has an expiry date; appears on expired dashboard |
| `requires_peroxide_monitoring` | BOOLEAN | NOT NULL, DEFAULT false | Requires periodic peroxide testing |
| `is_regulatory` | BOOLEAN | NOT NULL, DEFAULT false | Subject to regulatory reporting |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT true | Soft delete flag |

### Behavior Flags by Category (Default Values)

These are the expected defaults when creating items in each category. Flags can be overridden per item.

| Flag | Chemical & Reagent | Verify STD | Gas | Material & Consumable |
|---|---|---|---|---|
| `is_orderable` | ✅ true | ❌ false | ✅ true | ✅ true (configurable) |
| `requires_checkin` | ✅ true | ✅ true | ❌ false (MVP) | ❌ false (MVP) |
| `allows_checkout` | ✅ true | ✅ true | ❌ false (MVP) | ❌ false (MVP) |
| `tracks_expiry` | ✅ true | ✅ true | ❌ false | ❌ false |
| `requires_peroxide_monitoring` | ⚙️ per item | ❌ false | ❌ false | ❌ false |
| `is_regulatory` | ⚙️ per item | ✅ true | ❌ false | ❌ false |

> **Design decision:** Behavior is driven by these explicit flags, not by inspecting the category name in code. This allows exceptions — e.g., a Material & Consumable item that does track expiry, or a Chemical & Reagent item that is not orderable because it's been discontinued.

---

## 9. item_location_settings

**Purpose:** Optional per-location configuration for items. Used when a location-level default applies to all labs within that location.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK | Unique record identifier |
| `item_id` | UUID | FK → items, NOT NULL | The item |
| `location_id` | UUID | FK → locations, NOT NULL | The location |
| `is_stocked` | BOOLEAN | NOT NULL, DEFAULT false | Whether this item is generally stocked at this location |
| `location_lead_time_days` | INT | NULL | Location-specific lead time override |
| `notes` | TEXT | NULL | Location-specific notes |

**Unique constraint:** `(item_id, location_id)`

---

## 10. item_lab_settings

**Purpose:** Per-lab configuration for items. This is where min stock thresholds live.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK | Unique record identifier |
| `item_id` | UUID | FK → items, NOT NULL | The item |
| `lab_id` | UUID | FK → labs, NOT NULL | The lab |
| `min_stock` | DECIMAL(10,3) | NULL | Minimum stock threshold for this item in this lab |
| `max_stock` | DECIMAL(10,3) | NULL | Optional maximum stock level |
| `reorder_qty` | DECIMAL(10,3) | NULL | Suggested reorder quantity when below min stock |
| `is_stocked_here` | BOOLEAN | NOT NULL, DEFAULT false | Whether this item is actively stocked in this lab |
| `custom_lead_time_days` | INT | NULL | Lab-specific lead time override |
| `storage_sublocation` | VARCHAR(200) | NULL | Default storage sublocation (e.g., "Cabinet A3") |
| `notes` | TEXT | NULL | Lab-specific notes |

**Unique constraint:** `(item_id, lab_id)`

> **Key normalization:** Instead of `items.AIE_PO_Lab_min`, `items.MTP_Lab_min`, etc., min stock is `item_lab_settings.min_stock` with a `(item_id, lab_id)` pair. New labs require only new rows, never schema changes.

---

## 11. regulations

**Purpose:** Reference table of regulatory frameworks that items may be subject to.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK | Unique regulation identifier |
| `code` | VARCHAR(50) | UNIQUE, NOT NULL | Short code (e.g., `OSHA_PEL`, `EPA_RCRA`) |
| `name` | VARCHAR(200) | NOT NULL | Full regulation name |
| `description` | TEXT | NULL | Description of the regulation |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT true | Soft delete flag |

---

## 12. item_regulations

**Purpose:** Many-to-many mapping between items and the regulations that apply to them.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK | Unique record identifier |
| `item_id` | UUID | FK → items, NOT NULL | The item |
| `regulation_id` | UUID | FK → regulations, NOT NULL | The applicable regulation |
| `notes` | TEXT | NULL | Notes on how the regulation applies |

**Unique constraint:** `(item_id, regulation_id)`

---

## 13. purchase_requests

**Purpose:** An order request submitted by a user for a specific lab. Replaces the generic "order" concept.

> **Naming note:** "Purchase Request" is used instead of "Order" because the record starts as a request that must be approved before becoming a purchase order. The PO number is assigned upon approval.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK | Unique request identifier |
| `request_number` | VARCHAR(30) | UNIQUE, NOT NULL | Auto-generated request number (e.g., `REQ-2026-0001`) |
| `po_number` | VARCHAR(30) | UNIQUE, NULL | PO number, assigned upon approval (e.g., `PO-2026-0001`) |
| `lab_id` | UUID | FK → labs, NOT NULL | Target lab for this request |
| `requester_id` | UUID | FK → users, NOT NULL | User who submitted the request |
| `status` | VARCHAR(30) | NOT NULL, CHECK | Current workflow status (see `20-statuses-enums-and-reference-data.md`) |
| `submitted_at` | TIMESTAMPTZ | NULL | When the request was submitted for approval |
| `approved_at` | TIMESTAMPTZ | NULL | When the request was approved |
| `approved_by` | UUID | FK → users, NULL | User who approved |
| `rejected_at` | TIMESTAMPTZ | NULL | When rejected (if applicable) |
| `rejected_by` | UUID | FK → users, NULL | User who rejected |
| `rejection_reason` | TEXT | NULL | Mandatory reason if rejected |
| `cancelled_at` | TIMESTAMPTZ | NULL | When cancelled (if applicable) |
| `cancelled_by` | UUID | FK → users, NULL | User who cancelled |
| `cancellation_reason` | TEXT | NULL | Reason for cancellation |
| `order_notes` | TEXT | NULL | General notes for the order |
| `total_line_items` | INT | NOT NULL, DEFAULT 0 | Denormalized line item count |

---

## 14. purchase_request_items

**Purpose:** Individual line items within a purchase request.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK | Unique line item identifier |
| `purchase_request_id` | UUID | FK → purchase_requests, NOT NULL | Parent request |
| `item_id` | UUID | FK → items, NOT NULL | The catalog item being ordered |
| `vendor_id` | UUID | FK → vendors, NULL | Vendor for this line (default from item, overrideable) |
| `quantity_requested` | DECIMAL(10,3) | NOT NULL, CHECK > 0 | Quantity requested |
| `quantity_approved` | DECIMAL(10,3) | NULL | Quantity after Focal Point modification (null = same as requested) |
| `quantity_received` | DECIMAL(10,3) | NOT NULL, DEFAULT 0 | Total quantity received across all check-ins |
| `unit` | VARCHAR(30) | NOT NULL | Unit of measure |
| `unit_price` | DECIMAL(12,2) | NULL | Price per unit (reference, not binding) |
| `line_notes` | TEXT | NULL | Per-line notes |
| `status` | VARCHAR(30) | NOT NULL, DEFAULT 'PENDING' | Line-level status: PENDING, PARTIALLY_RECEIVED, FULLY_RECEIVED, CANCELLED |

---

## 15. purchase_request_item_revisions

**Purpose:** Immutable record of Focal Point modifications to purchase request line items before approval.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK | Unique revision identifier |
| `purchase_request_item_id` | UUID | FK → purchase_request_items, NOT NULL | The line item that was modified |
| `revision_number` | INT | NOT NULL | Sequential revision counter (1, 2, 3...) |
| `field_changed` | VARCHAR(50) | NOT NULL | Which field was changed (e.g., `quantity_requested`, `vendor_id`) |
| `old_value` | TEXT | NULL | Previous value (as text representation) |
| `new_value` | TEXT | NULL | New value (as text representation) |
| `changed_by` | UUID | FK → users, NOT NULL | Focal Point who made the change |
| `changed_at` | TIMESTAMPTZ | NOT NULL | When the change was made |
| `change_reason` | TEXT | NULL | Optional reason for the modification |

---

## 16. vendor_email_logs

**Purpose:** Record of all vendor notification emails sent by the system.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK | Unique log entry identifier |
| `purchase_request_id` | UUID | FK → purchase_requests, NOT NULL | The order that triggered the email |
| `vendor_id` | UUID | FK → vendors, NOT NULL | The vendor being notified |
| `recipient_email` | VARCHAR(255) | NOT NULL | Email address the message was sent to |
| `subject` | VARCHAR(500) | NOT NULL | Email subject line |
| `body_snapshot` | TEXT | NULL | Copy of the email body (for audit) |
| `sent_at` | TIMESTAMPTZ | NULL | When the email was successfully sent |
| `status` | VARCHAR(20) | NOT NULL | `PENDING`, `SENT`, `FAILED`, `RETRYING` |
| `error_message` | TEXT | NULL | Error details if failed |
| `retry_count` | INT | NOT NULL, DEFAULT 0 | Number of retry attempts |
| `items_included` | INT | NOT NULL | Count of line items included in this email |

---

## 17. inventory_lots

**Purpose:** Each physical lot of an item in a specific lab. Created at check-in. This is the core inventory tracking entity.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK | Unique lot identifier |
| `item_id` | UUID | FK → items, NOT NULL | Which catalog item this lot is |
| `lab_id` | UUID | FK → labs, NOT NULL | Which lab owns this lot |
| `lot_number` | VARCHAR(100) | NOT NULL | Vendor or internally assigned lot/batch number |
| `quantity_received` | DECIMAL(10,3) | NOT NULL | Original quantity received at check-in |
| `quantity_remaining` | DECIMAL(10,3) | NOT NULL | Current remaining quantity |
| `unit` | VARCHAR(30) | NOT NULL | Unit of measure |
| `manufacture_date` | DATE | NULL | Date of manufacture |
| `expiry_date` | DATE | NULL | Expiration date (may be extended) |
| `original_expiry_date` | DATE | NULL | Original expiry before any extensions |
| `open_date` | DATE | NULL | Date container was first opened |
| `storage_location` | VARCHAR(200) | NULL | Physical sublocation (cabinet, shelf, fridge) |
| `status` | VARCHAR(20) | NOT NULL, CHECK | Lot status (see `20-statuses-enums-and-reference-data.md`) |
| `source_type` | VARCHAR(20) | NOT NULL | `PURCHASE_ORDER` or `MANUAL` |
| `purchase_request_id` | UUID | FK → purchase_requests, NULL | Linked order (null for manual check-in) |
| `purchase_request_item_id` | UUID | FK → purchase_request_items, NULL | Linked line item |
| `checked_in_by` | UUID | FK → users, NOT NULL | User who performed check-in |
| `checked_in_at` | TIMESTAMPTZ | NOT NULL | Check-in timestamp |
| `source_reason` | TEXT | NULL | For manual check-ins: reason/source (Donation, Transfer, etc.) |
| `qr_code_data` | TEXT | NULL | Encoded QR payload |
| `notes` | TEXT | NULL | Check-in notes |

**Indexes:** `(lab_id, item_id, status)`, `(expiry_date)`, `(lab_id, status)`

---

## 18. stock_transactions

**Purpose:** Append-only log of every inventory-affecting action. Each row represents one state change.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK | Unique transaction identifier |
| `transaction_type` | VARCHAR(30) | NOT NULL, CHECK | One of the defined transaction types |
| `lot_id` | UUID | FK → inventory_lots, NULL | The affected lot (null for order-level transactions) |
| `item_id` | UUID | FK → items, NULL | The item (for context; redundant with lot but useful for direct queries) |
| `purchase_request_id` | UUID | FK → purchase_requests, NULL | Linked order (if applicable) |
| `lab_id` | UUID | FK → labs, NOT NULL | Lab context |
| `user_id` | UUID | FK → users, NOT NULL | User who performed the action |
| `quantity` | DECIMAL(10,3) | NULL | Quantity involved (positive for in, negative for out) |
| `quantity_before` | DECIMAL(10,3) | NULL | Lot quantity before this transaction |
| `quantity_after` | DECIMAL(10,3) | NULL | Lot quantity after this transaction |
| `unit` | VARCHAR(30) | NULL | Unit of measure |
| `purpose` | VARCHAR(100) | NULL | Purpose/reason (especially for checkouts) |
| `notes` | TEXT | NULL | Additional context |
| `metadata` | JSONB | NULL | Type-specific structured data (see `16-transaction-history-and-audit.md`) |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Transaction timestamp |

**Constraints:** This table is INSERT-only. No UPDATE or DELETE operations are permitted at the application level.

**Indexes:** `(lot_id, created_at)`, `(transaction_type, lab_id, created_at)`, `(purchase_request_id)`, `(user_id, created_at)`

---

## 19. peroxide_tests

**Purpose:** Individual peroxide monitoring test events. Multiple tests per lot over time.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK | Unique test event identifier |
| `lot_id` | UUID | FK → inventory_lots, NOT NULL | The lot being tested |
| `test_date` | DATE | NOT NULL | When the test was performed |
| `tested_by` | UUID | FK → users, NOT NULL | User who performed the test |
| `test_method` | VARCHAR(200) | NULL | Description of the testing method |
| `ppm_result` | DECIMAL(8,2) | NOT NULL | Parts per million measured |
| `classification` | VARCHAR(20) | NOT NULL, CHECK | `NORMAL`, `WARNING`, `QUARANTINE` |
| `visual_observations` | TEXT | NULL | Observations (color, precipitate, odor) |
| `next_monitor_due` | DATE | NULL | Calculated next test date (null if quarantined) |
| `notes` | TEXT | NULL | Additional notes |

**Indexes:** `(lot_id, test_date)`, `(next_monitor_due)`

---

## 20. shelf_life_extensions

**Purpose:** Immutable record of each shelf-life extension event. History table — multiple extensions per lot.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK | Unique extension identifier |
| `lot_id` | UUID | FK → inventory_lots, NOT NULL | The lot being extended |
| `extension_number` | INT | NOT NULL | Sequential extension counter (1, 2, 3...) |
| `previous_expiry_date` | DATE | NOT NULL | Expiry date before this extension |
| `new_expiry_date` | DATE | NOT NULL | Expiry date after this extension |
| `extension_days` | INT | NOT NULL | Calculated: new - previous |
| `reason` | TEXT | NOT NULL | Justification for the extension |
| `test_performed` | TEXT | NOT NULL | Description of the qualifying test |
| `test_result` | VARCHAR(200) | NOT NULL | Test outcome (e.g., "Pass", numeric) |
| `test_date` | DATE | NOT NULL | When the qualifying test was performed |
| `authorized_by` | UUID | FK → users, NOT NULL | Focal Point or Admin who authorized |
| `authorized_at` | TIMESTAMPTZ | NOT NULL | When the extension was authorized |

**Indexes:** `(lot_id, extension_number)`

---

## 21. label_print_logs

**Purpose:** Track QR label printing events for audit purposes.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK | Unique log entry identifier |
| `lot_id` | UUID | FK → inventory_lots, NOT NULL | The lot whose label was printed |
| `printed_by` | UUID | FK → users, NOT NULL | User who initiated the print |
| `printed_at` | TIMESTAMPTZ | NOT NULL | When the label was printed |
| `print_method` | VARCHAR(30) | NOT NULL | `BROWSER_PRINT`, `PDF_DOWNLOAD`, `LABEL_PRINTER` |
| `label_content_snapshot` | JSONB | NULL | Snapshot of what was on the label at print time |

---

## 22. audit_logs

**Purpose:** System-wide audit trail capturing all significant actions, including non-inventory actions (user management, master data changes, configuration changes).

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK | Unique log entry identifier |
| `action` | VARCHAR(50) | NOT NULL | Action performed (e.g., `USER_CREATED`, `ITEM_UPDATED`, `ROLE_CHANGED`) |
| `entity_type` | VARCHAR(50) | NOT NULL | Type of entity affected (e.g., `user`, `item`, `lab`, `purchase_request`) |
| `entity_id` | UUID | NOT NULL | ID of the affected entity |
| `user_id` | UUID | FK → users, NOT NULL | User who performed the action |
| `lab_id` | UUID | FK → labs, NULL | Lab context (null for system-wide actions) |
| `old_values` | JSONB | NULL | Previous state of the changed fields |
| `new_values` | JSONB | NULL | New state of the changed fields |
| `ip_address` | VARCHAR(45) | NULL | Client IP address |
| `user_agent` | VARCHAR(500) | NULL | Client user agent string |
| `notes` | TEXT | NULL | Additional context |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | When the action occurred |

**Constraints:** INSERT-only. No UPDATE or DELETE.

**Indexes:** `(entity_type, entity_id, created_at)`, `(user_id, created_at)`, `(action, created_at)`

> **Note:** `audit_logs` captures master data and system configuration changes. `stock_transactions` captures inventory and order workflow actions. They are separate tables because their access patterns, retention policies, and query shapes differ.

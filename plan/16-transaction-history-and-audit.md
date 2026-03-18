# 16 — Transaction History and Audit

This document defines the comprehensive transaction history system, including all recordable actions, the data model for each transaction type, and the audit trail requirements.

---

## Purpose

The transaction history is the system's **immutable audit trail**. Every important action — whether it changes inventory, order state, monitoring records, or shelf-life dates — is recorded as a transaction. These records:

1. Support regulatory audits and compliance reviews.
2. Enable operational traceability ("who did what, when, and where").
3. Are **append-only** — transactions cannot be edited or deleted.
4. Serve as the single source of truth for all system activity over time.

---

## Complete Transaction Type Catalog

Every transaction type used across the system is defined below. These types are referenced consistently in all workflow documents (10–14).

| # | Transaction Type | Module | Description |
|---|---|---|---|
| 1 | `ADD_TO_CART` | Order | User adds an item to their cart |
| 2 | `SUBMIT_ORDER` | Order | User submits cart as an order for approval |
| 3 | `MODIFY_ORDER` | Approval | Focal Point modifies an order before approving |
| 4 | `APPROVE_ORDER` | Approval | Focal Point or Admin approves an order |
| 5 | `REJECT_ORDER` | Approval | Focal Point or Admin rejects an order |
| 6 | `SEND_VENDOR_EMAIL` | Vendor Email | System sends vendor notification email(s) |
| 7 | `CANCEL_ORDER` | Order | Order is cancelled by requester, Focal Point, or Admin |
| 8 | `CHECK_IN` | Check-In | Items checked in against a purchase order |
| 9 | `MANUAL_CHECK_IN` | Check-In | Items checked in without a purchase order |
| 10 | `CHECKOUT` | Checkout | Items withdrawn from inventory |
| 11 | `PEROXIDE_TEST_LOGGED` | Peroxide | Peroxide monitoring test result recorded |
| 12 | `LOT_QUARANTINED` | Peroxide | Lot quarantined due to high peroxide levels |
| 13 | `EXTEND_SHELF_LIFE` | Shelf Life | Shelf life of a lot extended |
| 14 | `ADJUSTMENT` | Inventory | Manual quantity adjustment (increase or decrease) |
| 15 | `DISPOSAL` | Inventory | Lot disposed (expired, failed test, waste) |
| 16 | `TRANSFER` | Inventory | Lot transferred between labs (future) |

---

## Transaction Record Data Model

Each transaction record contains a common set of fields plus type-specific data:

### Common Fields (present on every transaction)

| Field | Type | Description |
|---|---|---|
| `id` | PK (UUID) | Unique transaction identifier |
| `transaction_type` | Enum | One of the 16 types listed above |
| `user_id` | FK | User who performed the action |
| `user_name` | Text | Denormalized user name (for display in audit views) |
| `location_id` | FK | Location context of the action |
| `lab_id` | FK | Lab context of the action |
| `timestamp` | Timestamp | Exact date/time of the action (server time) |
| `notes` | Text | Optional notes or comments |
| `metadata` | JSONB | Type-specific additional data (see below) |

### Type-Specific Metadata

The `metadata` JSONB field stores structured data specific to each transaction type:

---

#### `ADD_TO_CART`
```json
{
  "chemical_id": "uuid",
  "chemical_name": "Acetone",
  "quantity": 5,
  "unit": "L"
}
```

---

#### `SUBMIT_ORDER`
```json
{
  "order_id": "uuid",
  "po_number": "PO-2026-0001",
  "line_items": [
    { "chemical_id": "uuid", "chemical_name": "Acetone", "quantity": 5, "unit": "L", "vendor": "Sigma-Aldrich" },
    { "chemical_id": "uuid", "chemical_name": "Methanol", "quantity": 2, "unit": "L", "vendor": "Fisher Scientific" }
  ],
  "total_line_items": 2
}
```

---

#### `MODIFY_ORDER`
```json
{
  "order_id": "uuid",
  "po_number": "PO-2026-0001",
  "modifier_user_id": "uuid",
  "changes": [
    {
      "chemical_name": "Acetone",
      "field": "quantity",
      "old_value": 5,
      "new_value": 3
    },
    {
      "chemical_name": "Toluene",
      "action": "added",
      "quantity": 2,
      "unit": "L"
    }
  ]
}
```

---

#### `APPROVE_ORDER`
```json
{
  "order_id": "uuid",
  "po_number": "PO-2026-0001",
  "approver_user_id": "uuid"
}
```

---

#### `REJECT_ORDER`
```json
{
  "order_id": "uuid",
  "po_number": "PO-2026-0001",
  "rejector_user_id": "uuid",
  "rejection_reason": "Budget not available for this quarter"
}
```

---

#### `SEND_VENDOR_EMAIL`
```json
{
  "order_id": "uuid",
  "po_number": "PO-2026-0001",
  "vendor_id": "uuid",
  "vendor_name": "Sigma-Aldrich",
  "vendor_email": "orders@sigma.com",
  "dispatch_status": "sent",
  "items_included": 3
}
```

---

#### `CANCEL_ORDER`
```json
{
  "order_id": "uuid",
  "po_number": "PO-2026-0001",
  "cancelled_by_user_id": "uuid",
  "cancellation_reason": "Duplicate order"
}
```

---

#### `CHECK_IN`
```json
{
  "order_id": "uuid",
  "po_number": "PO-2026-0001",
  "order_line_item_id": "uuid",
  "lot_id": "uuid",
  "chemical_name": "Acetone",
  "lot_number": "LOT-2025-042",
  "quantity_received": 5,
  "unit": "L",
  "expiry_date": "2026-06-15",
  "storage_location": "Cabinet A3"
}
```

---

#### `MANUAL_CHECK_IN`
```json
{
  "lot_id": "uuid",
  "chemical_name": "USP Reference Standard XYZ",
  "lot_number": "STD-2025-001",
  "quantity_received": 1,
  "unit": "vial",
  "expiry_date": "2027-01-15",
  "source_type": "Donation",
  "source_reason": "Received from partner lab"
}
```

---

#### `CHECKOUT`
```json
{
  "lot_id": "uuid",
  "chemical_name": "Acetone",
  "lot_number": "LOT-2025-042",
  "quantity_withdrawn": 0.5,
  "unit": "L",
  "quantity_remaining_after": 4.5,
  "purpose": "Routine testing",
  "checkout_method": "QR_SCAN"
}
```

---

#### `PEROXIDE_TEST_LOGGED`
```json
{
  "lot_id": "uuid",
  "chemical_name": "Tetrahydrofuran",
  "lot_number": "LOT-2025-019",
  "test_date": "2026-03-15",
  "ppm_result": 18,
  "classification": "Normal",
  "next_monitor_due": "2026-06-15",
  "tested_by_user_id": "uuid"
}
```

---

#### `LOT_QUARANTINED`
```json
{
  "lot_id": "uuid",
  "chemical_name": "Diethyl ether",
  "lot_number": "LOT-2025-006",
  "ppm_result": 125,
  "reason": "Peroxide level exceeded 100 ppm threshold"
}
```

---

#### `EXTEND_SHELF_LIFE`
```json
{
  "lot_id": "uuid",
  "chemical_name": "Tetrahydrofuran",
  "lot_number": "LOT-2025-019",
  "previous_expiry_date": "2026-04-15",
  "new_expiry_date": "2026-10-15",
  "previous_days_to_expiry": 28,
  "new_days_to_expiry": 211,
  "extension_days": 183,
  "test_performed": "Visual inspection",
  "test_result": "Pass",
  "authorized_by_user_id": "uuid"
}
```

---

#### `ADJUSTMENT`
```json
{
  "lot_id": "uuid",
  "chemical_name": "Methanol",
  "lot_number": "LOT-2025-033",
  "adjustment_type": "decrease",
  "quantity_before": 3.0,
  "quantity_after": 2.5,
  "quantity_adjusted": -0.5,
  "unit": "L",
  "reason": "Spill — correcting recorded quantity"
}
```

---

#### `DISPOSAL`
```json
{
  "lot_id": "uuid",
  "chemical_name": "Diethyl ether",
  "lot_number": "LOT-2025-006",
  "quantity_disposed": 1.5,
  "unit": "L",
  "disposal_reason": "Expired — peroxide quarantined",
  "disposal_method": "Hazardous waste vendor"
}
```

---

#### `TRANSFER`
```json
{
  "lot_id": "uuid",
  "chemical_name": "Acetone",
  "lot_number": "LOT-2025-042",
  "from_lab_id": "uuid",
  "from_lab_name": "PO Lab",
  "to_lab_id": "uuid",
  "to_lab_name": "EOU Lab",
  "quantity_transferred": 1.0,
  "unit": "L"
}
```

---

## Transaction History UI

### List View

The transaction history page displays a searchable, filterable, scrollable table:

| # | Column | Description | Sortable |
|---|---|---|---|
| 1 | **Timestamp** | Date and time of the action | Yes |
| 2 | **Type** | Transaction type (human-readable label) | Yes |
| 3 | **Item** | Chemical/material name (if applicable) | Yes |
| 4 | **Lot Number** | Lot number (if applicable) | Yes |
| 5 | **Quantity** | Quantity involved (if applicable) | Yes |
| 6 | **User** | User who performed the action | Yes |
| 7 | **Lab** | Lab context | Yes |
| 8 | **Location** | Location context | Yes |
| 9 | **Details** | Summary of the action (truncated; click to expand) | No |

### Filters

| Filter | Type | Options |
|---|---|---|
| **Transaction Type** | Multi-select | All 16 types |
| **Date Range** | Date picker | From / To |
| **Location** | Dropdown | User's accessible locations |
| **Lab** | Dropdown | Filtered by selected location |
| **User** | Searchable dropdown | All users (in scope) |
| **Item** | Searchable text | Chemical/material name |
| **Lot Number** | Text | Exact or partial lot number match |
| **Order / PO Number** | Text | PO number |
| **Search** | Fulltext | Searches across notes, item names, lot numbers |

### Export
- **CSV Export**: All columns + full metadata as a flat CSV.
- **PDF Export**: Formatted report with header, filters applied, and paginated table.

---

## Immutability and Integrity

| Principle | Implementation |
|---|---|
| **Append-only** | Transaction records are `INSERT` only. No `UPDATE` or `DELETE` allowed. |
| **No backdating** | The `timestamp` field is always set to the server's current time at insertion. Type-specific dates (e.g., `test_date`) may be backdated for historical data entry, but `timestamp` always reflects when the record was created. |
| **User attribution** | Every transaction records the `user_id` of the person who triggered the action, even for system-automated actions (documented as "system" user). |
| **Data preservation** | If a record is corrected (e.g., wrong quantity checked in), the original transaction remains; a new `ADJUSTMENT` transaction records the correction. |

---

## Audit-Specific Features

| Feature | Description |
|---|---|
| **Lot audit trail** | View all transactions for a specific lot in chronological order (from check-in to current state). |
| **Order audit trail** | View all transactions for a specific order (from add-to-cart through fully received). |
| **User activity log** | View all transactions by a specific user within a date range. |
| **Lab activity log** | View all transactions for a specific lab within a date range. |
| **Regulatory export** | Pre-filtered exports designed for regulatory submission: e.g., all peroxide tests for a given year, all shelf-life extensions for a given quarter. |

---

## Transaction Volume Expectations

| Scenario | Estimated Volume |
|---|---|
| Orders per month | ~50–100 orders across all labs |
| Check-ins per month | ~100–200 lot records created |
| Checkouts per month | ~500–1000 individual checkout events |
| Peroxide tests per month | ~20–50 tests |
| Shelf-life extensions per month | ~5–10 extensions |
| **Total transactions per month** | **~700–1400 records** |
| **Annual volume** | **~8,000–17,000 records** |

At this volume, standard PostgreSQL indexing on `timestamp`, `transaction_type`, `lab_id`, and `lot_id` should provide adequate query performance without specialized archival strategies in the near term.

---

## Access Control for Transaction History

| Role | Access Level |
|---|---|
| **Admin** | View all transactions across all locations and labs. Export all. |
| **Focal Point** | View all transactions within assigned lab(s). Export within scope. |
| **Lab User** | View own transactions only (filtered by `user_id`). Limited export. |
| **Viewer / Auditor** | View all transactions within assigned scope (read-only). Export within scope. |

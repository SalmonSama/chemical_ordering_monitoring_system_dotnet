# 11 — Check-In Workflow

This document defines both check-in flows in detail: check-in from a pending delivery (against a purchase order) and manual check-in (no purchase order). Both flows result in the creation of inventory lot records and transaction history entries.

---

## Check-In Flow Overview

There are two distinct check-in flows:

| Flow | Trigger | Use Case | Linked to PO? |
|---|---|---|---|
| **PO Check-In** | Items arrive from an approved vendor order | Standard delivery receipt | Yes |
| **Manual Check-In** | Items received outside the ordering workflow | Donations, transfers, direct deliveries, Verify STD items | No |

---

## Flow 1: Check-In from Pending Delivery (PO Check-In)

### Prerequisites
- An order exists in **Pending Delivery** or **Partially Received** status.
- The user performing check-in has access to the order's target lab.
- The user has Lab User, Focal Point, or Admin role.

### Step-by-Step Flow

#### Step 1: Select Order to Check In

**Actor:** Lab User, Focal Point, or Admin

**Actions:**
1. Navigate to the **Check-In** page.
2. The page displays a list of orders in **Pending Delivery** or **Partially Received** status for the user's lab(s).
3. Each order shows: PO number, vendor, order date, approval date, number of line items, received vs. total items.
4. User selects an order to begin check-in.

---

#### Step 2: Review Line Items

**Actions:**
1. System displays all line items for the selected order.
2. Each line item shows:
   - Item name
   - Catalog number
   - Ordered quantity
   - Previously received quantity (if any)
   - Remaining quantity expected
   - Vendor
3. User selects the line item(s) being received in this delivery.

**Rules:**
- Line items that have been fully received (ordered qty = received qty) are shown as completed and cannot be checked in again.
- Multiple line items can be checked in within a single check-in session.

---

#### Step 3: Enter Lot Details (per line item)

**Actor:** Lab User, Focal Point, or Admin

For each selected line item, the user enters:

| Field | Required | Description |
|---|---|---|
| **Quantity Received** | Yes | Number of units received in this delivery. Must be > 0 and ≤ remaining expected quantity. |
| **Lot Number** | Yes | Vendor-assigned or internally generated lot/batch number. |
| **Manufacture Date** | No | Date of manufacture (if printed on label). |
| **Expiry Date** | Yes (for Chemical & Reagent, Verify STD) | Expiration date from the product label. |
| **Storage Location** | Yes | Where the item is stored: lab + optional sublocation (cabinet, shelf, fridge). |
| **Notes** | No | Any observations about condition, discrepancies, etc. |

**Rules:**
- A single line item delivery can be split into **multiple lots** if the shipment contains different lot numbers for the same item (e.g., 10 bottles from Lot A and 5 from Lot B).
- Expiry date is required for Chemical & Reagent and Verify STD categories. Optional for others.
- Storage location defaults to the order's target lab; sublocation is entered manually.

---

#### Step 4: Confirm Check-In

**Actions:**
1. User reviews all entered lot details.
2. User clicks "Confirm Check-In".
3. System validates all entries:
   - Quantities are valid (> 0, ≤ remaining).
   - Required fields are filled.
   - Lot number is not a duplicate for the same item in the same lab (warn if already exists).
4. On success, the system:

   **a) Creates Inventory Lot Record(s):**
   Each lot entry becomes a new record in the inventory with:
   - `chemical_id` → linked to the catalog item.
   - `lot_number` → as entered.
   - `quantity_received` → as entered.
   - `quantity_remaining` → initially equal to `quantity_received`.
   - `manufacture_date` → as entered (nullable).
   - `expiry_date` → as entered.
   - `location_id` / `lab_id` → from the order's target lab.
   - `storage_location` → as entered.
   - `checked_in_by` → current user.
   - `checked_in_at` → current timestamp.
   - `order_id` / `order_line_item_id` → linked to the source order.
   - `status` → **Active**.

   **b) Updates Order Line Item:**
   - Increments `quantity_received` on the order line item.
   - If `quantity_received == quantity_ordered`: line item is fully received.

   **c) Updates Order Status:**
   - If all line items are fully received: order status → **Fully Received**.
   - If some but not all line items are received: order status → **Partially Received**.

   **d) Generates QR Code:**
   - A unique QR code is generated for each new lot.
   - QR payload encodes: lot ID, item name, lot number, lab, location.
   - QR code is available for printing/download immediately after check-in.

   **e) Creates Transaction History Entry:**
   - Type: `CHECK_IN`
   - Data: order ID, line item, lot number, quantity, user, lab, location, timestamp.

---

#### Step 5: Print Label / QR Code

**Actions:**
1. After successful check-in, the system displays a confirmation with the generated QR code(s).
2. User can:
   - **Print label** — triggers a print-friendly view or PDF with QR code + lot details.
   - **Download QR** — saves the QR code image.
   - **Skip** — proceed without printing (can print later from lot detail page).

**QR Label Content:**
```
┌──────────────────────────┐
│ [QR CODE]                │
│                          │
│ Item: Acetone            │
│ Lot: LOT-2025-042       │
│ Qty: 2.500 L             │
│ Exp: 2026-06-15          │
│ Lab: AIE / PO Lab        │
│ ID: INV-00123            │
└──────────────────────────┘
```

---

### PO Check-In Flow Diagram

```
┌────────────────────────┐
│ Select order from      │
│ Pending Delivery list  │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ Review line items      │
│ Select items to        │
│ check in               │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ Enter lot details:     │
│ qty, lot#, expiry,     │
│ storage, notes         │
│ (per line item)        │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ Confirm check-in       │
│ ► Create lot record(s) │
│ ► Update order status  │
│ ► Generate QR code     │
│ ► Log transaction      │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ Print / Download QR    │
│ or skip                │
└────────────────────────┘
```

---

## Flow 2: Manual Check-In (No Purchase Order)

### Purpose

Manual check-in is used when items are received **outside the ordering workflow**. Primary use cases:

1. **Verify STD items** — These are never ordered through the system; they are received directly from standards organizations and must be registered manually.
2. **Donated or transferred items** — Items received from other departments, labs, or organizations.
3. **Direct vendor deliveries** — Items procured outside the system (legacy orders, emergency purchases).

### Prerequisites
- User has **Focal Point** or **Admin** role (Lab Users cannot perform manual check-in).
- The item exists in the chemical catalog (master data).

### Step-by-Step Flow

#### Step 1: Navigate to Manual Check-In

**Actor:** Focal Point or Admin

**Actions:**
1. Navigate to the **Check-In** page.
2. Select the **"Manual Check-In"** tab or action.

---

#### Step 2: Search and Select Item

**Actions:**
1. Search the chemical catalog by name, CAS number, or catalog number.
2. Select the item to check in.
3. If the item is not in the catalog, the user must first add it via Master Data Management (Admin only) or request Admin to add it.

---

#### Step 3: Enter Lot Details

Same fields as PO check-in:

| Field | Required | Description |
|---|---|---|
| **Quantity Received** | Yes | Number of units being checked in. |
| **Lot Number** | Yes | Lot/batch number from the product label. |
| **Manufacture Date** | No | Date of manufacture. |
| **Expiry Date** | Yes (for Chemical & Reagent, Verify STD) | Expiration date. |
| **Storage Location** | Yes | Lab + optional sublocation. |
| **Source / Reason** | Yes | Why this item is being manually checked in (dropdown: Donation, Transfer, Direct Delivery, Other + freeform notes). |
| **Notes** | No | Additional observations. |

**Additional fields for Verify STD:**
| Field | Required | Description |
|---|---|---|
| **Certificate of Analysis #** | No | Reference to the CoA document. |
| **Assigned Value** | No | The certified value of the standard. |

---

#### Step 4: Confirm Check-In

Same as PO check-in Step 4, except:
- No order is linked. The lot record has `order_id = NULL`.
- Transaction history type: `MANUAL_CHECK_IN`.
- QR code is generated identically.

---

### Manual Check-In Flow Diagram

```
┌──────────────────────────┐
│ Select "Manual Check-In" │
└───────────┬──────────────┘
            │
            ▼
┌──────────────────────────┐
│ Search catalog for item  │
└───────────┬──────────────┘
            │
            ▼
┌──────────────────────────┐
│ Enter lot details:       │
│ qty, lot#, expiry,       │
│ storage, source/reason   │
└───────────┬──────────────┘
            │
            ▼
┌──────────────────────────┐
│ Confirm check-in         │
│ ► Create lot record      │
│ ► Generate QR code       │
│ ► Log transaction        │
└───────────┬──────────────┘
            │
            ▼
┌──────────────────────────┐
│ Print / Download QR      │
│ or skip                  │
└──────────────────────────┘
```

---

## Inventory Lot Record Structure

Every check-in (PO or manual) creates a lot record with matching structure:

| Field | Source: PO Check-In | Source: Manual Check-In |
|---|---|---|
| `chemical_id` | From order line item | From catalog search |
| `lot_number` | User-entered | User-entered |
| `quantity_received` | User-entered | User-entered |
| `quantity_remaining` | = `quantity_received` | = `quantity_received` |
| `manufacture_date` | User-entered (optional) | User-entered (optional) |
| `expiry_date` | User-entered | User-entered |
| `location_id` | From order target | Current user's lab context |
| `lab_id` | From order target | Current user's lab context |
| `storage_location` | User-entered | User-entered |
| `order_id` | Linked to source order | `NULL` |
| `order_line_item_id` | Linked to source line item | `NULL` |
| `checked_in_by` | Current user | Current user |
| `checked_in_at` | Current timestamp | Current timestamp |
| `status` | Active | Active |
| `qr_code_data` | Generated | Generated |
| `source_type` | `PURCHASE_ORDER` | `MANUAL` |

---

## Lot Statuses

| Status | Description |
|---|---|
| **Active** | Lot is in inventory, available for checkout. |
| **Depleted** | Lot quantity has reached zero through checkouts. |
| **Expired** | Lot has passed its expiry date. |
| **Quarantined** | Lot has been flagged (e.g., failed peroxide test). |
| **Disposed** | Lot has been officially disposed of. |
| **Extended** | Lot had its shelf life extended (returns to Active with new expiry). |

---

## Transaction History Entries for Check-In

| Action | Transaction Type | Key Data |
|---|---|---|
| PO check-in | `CHECK_IN` | Order ID, line item, lot number, quantity, expiry, user, lab, location, timestamp |
| Manual check-in | `MANUAL_CHECK_IN` | Item, lot number, quantity, expiry, source/reason, user, lab, location, timestamp |

---

## Notifications Generated

| Event | Recipients | Channel |
|---|---|---|
| Check-in completed (PO) | Order requester, Focal Point | In-app |
| All items received (order fully received) | Order requester, Focal Point | In-app, Email |
| Manual check-in completed | Admin (for audit visibility) | In-app |

---

## Edge Cases

### Duplicate Lot Numbers
If a lot number already exists for the same item in the same lab, the system should:
1. Warn the user: "Lot number {X} already exists for this item in this lab."
2. Allow the user to proceed (different deliveries of the same lot) or correct the entry.
3. This creates a second lot record with the same lot number — they are tracked independently by lot record ID.

### Over-Receipt
If the quantity received exceeds the ordered quantity:
1. Warn the user: "Received quantity exceeds ordered quantity."
2. Allow proceed for legitimate over-deliveries (vendor shipped extra).
3. Log in transaction history.

### Expiry Date in the Past
If the entered expiry date is before today:
1. Warn: "This item is already expired based on the entered expiry date."
2. Allow proceed (user may intentionally be logging already-expired stock for disposal tracking).
3. Lot status should be set to **Expired** immediately.

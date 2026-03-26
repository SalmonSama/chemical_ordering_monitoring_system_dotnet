# 12 — Checkout Workflow

This document defines the checkout flow for withdrawing/consuming inventory items from lab stock, including QR-based scanning, partial checkout, stock updates, and transaction history logging.

> **Frontend page:** Checkout (`/inventory/checkout`). Primary flow uses `QrScanPanel` component for QR scanning with manual search fallback. See `23-page-and-route-planning.md`.
> **UI components:** `QrScanPanel`, `FormSection`, `ConfirmationDialog`, `StatusBadge`. See `26-component-and-state-planning.md`.

---

## Checkout Overview

Checkout is the process of recording the consumption or withdrawal of an item from a specific inventory lot. The primary interaction model is **QR-scan-based**, though a manual fallback is also supported.

| Aspect | Detail |
|---|---|
| Primary method | QR code scan |
| Fallback method | Manual search and select |
| Granularity | Lot-level (checkout is always from a specific lot) |
| Partial checkout | Supported (withdraw less than the full lot quantity) |
| Who can checkout | Lab User, Focal Point, Admin (within assigned lab scope) |

---

## Checkout Flow: QR-Scan-Based (Primary)

### Step 1: Initiate Checkout via QR Scan

**Actor:** Lab User, Focal Point, or Admin

**Actions:**
1. Navigate to the **Checkout** page.
2. Click "Scan QR Code" or the scanner activates automatically.
3. Use the device camera (laptop webcam, tablet camera) to scan the QR code on the item's label.
4. The system decodes the QR payload and identifies the specific inventory lot.

**QR Payload Contains:**
- Lot record ID (primary identifier — UUID).
- Item name (for display verification).
- Lot number.
- Lab and location.

---

### Step 2: System Loads Lot Details

**Actions:**
After a successful scan, the system displays:

| Field | Value |
|---|---|
| Item Name | e.g., Acetone |
| Catalog Number | e.g., A1234 |
| Lot Number | e.g., LOT-2025-042 |
| Category | e.g., Chemical & Reagent |
| Lab / Location | e.g., AIE / PO Lab |
| Quantity Remaining | e.g., 2.500 L |
| Unit | e.g., L |
| Expiry Date | e.g., 2026-06-15 |
| Days to Expiry | e.g., 89 days |
| Lot Status | e.g., Active |
| Storage Location | e.g., Cabinet A3 |
| Open Date | e.g., 2025-11-01 (or "Not opened") |

**Validation checks on scan:**

| Check | Result |
|---|---|
| Lot exists in system | If not found → Error: "Lot not recognized" |
| Lot is in user's lab scope | If not → Error: "You do not have access to this lab's inventory" |
| Lot status is Active | If Expired → Error: "This lot is expired and cannot be checked out. Contact your Focal Point." |
| | If Quarantined → Error: "This lot is quarantined and cannot be checked out" |
| | If Depleted → Error: "This lot has zero quantity remaining" |
| | If Disposed → Error: "This lot has been disposed" |
| Near-expire warning | If Days to Expiry ≤ 30 → Warning: "This lot expires on {date} ({N} days). Proceed?" |

---

### Step 2a: Open Date Prompt (First Use)

If the lot's `open_date` is `NULL` at the time of this checkout:
1. System prompts: **"Is this the first time this container is being opened?"**
2. If the user answers **Yes**: `open_date` is set to today's date on the lot record.
3. If the user answers **No** or **Skip**: `open_date` remains `NULL` (can be set later from the lot detail page).

This is especially important for **peroxide-forming chemicals**, where the open date anchors monitoring schedules.

---

### Step 3: Enter Checkout Details

**Actor:** Lab User, Focal Point, or Admin

The user enters:

| Field | Required | Description |
|---|---|---|
| **Quantity to Checkout** | Yes | Amount to withdraw. Must be > 0 and ≤ `quantity_remaining`. |
| **Purpose / Reason** | Yes | Why the item is being used. Dropdown of common reasons + freeform text option. |
| **Notes** | No | Additional context or observations. |

**Common purpose/reason options (configurable):**
- Routine testing
- Sample preparation
- Calibration
- Research / experiment
- Quality control
- Disposal (intentional discard)
- Other (freeform)

---

### Step 4: Confirm Checkout

**Actions:**
1. User reviews the checkout summary: item, lot, quantity, purpose.
2. User clicks "Confirm Checkout".
3. System validates:
   - Quantity > 0.
   - Quantity ≤ `quantity_remaining` for the lot.
   - Lot status is Active.
   - User has access to the lot's lab.
4. On success, the system:

   **a) Updates Lot Record:**
   - `quantity_remaining` = `quantity_remaining` - `quantity_checked_out`.
   - If `quantity_remaining` reaches 0: lot status → **Depleted**.

   **b) Creates Transaction History Entry (immediately):**
   - Type: `CHECKOUT`
   - Data: lot ID, item, lot number, quantity withdrawn, quantity remaining after checkout, purpose/reason, user, lab, location, timestamp, checkout method (`QR_SCAN` or `MANUAL`).
   - The transaction record is written **in the same database transaction** as the stock update to ensure atomicity.

   **c) Displays Confirmation:**
   - "Checkout successful. {quantity} {unit} of {item} (Lot: {lot_number}) checked out."
   - Shows updated remaining quantity.

---

### Step 5: Continue or Finish

After confirmation, the user can:
- **Scan another QR** — immediately scan the next item for rapid checkout sessions.
- **Done** — return to the dashboard or inventory view.

---

## Checkout Flow: Manual (Fallback)

If QR scanning is unavailable (damaged label, no camera), the user can check out manually:

### Step 1: Search for Item
1. Navigate to the **Checkout** page.
2. Select "Manual Checkout" tab.
3. Search by item name, catalog number, or lot number.
4. Filter by lab (defaults to current lab context).

### Step 2: Select Lot
1. Search results show matching inventory lots with: item name, lot number, quantity remaining, expiry, storage location, lot status.
2. Only lots in **Active** status are selectable.
3. User selects the specific lot to check out from.

### Steps 3–5: Same as QR Flow
Enter quantity and purpose, open-date prompt if applicable, confirm, continue or finish.

---

## Checkout Flow Diagram

```
┌──────────────────────────┐      ┌─────────────────────────┐
│  QR Scan (Primary)       │      │  Manual Search          │
│  Scan lot QR code        │      │  (Fallback)             │
│  ► Lot auto-identified   │      │  Search item → pick lot │
└───────────┬──────────────┘      └───────────┬─────────────┘
            │                                  │
            └──────────────┬───────────────────┘
                           │
                           ▼
            ┌──────────────────────────┐
            │  Display lot details     │
            │  Validate lot status     │
            │  & user access           │
            └───────────┬──────────────┘
                        │
                        ▼
            ┌──────────────────────────┐
            │  Open Date prompt        │
            │  (if open_date is NULL)  │
            └───────────┬──────────────┘
                        │
                        ▼
            ┌──────────────────────────┐
            │  Enter checkout details  │
            │  ► Quantity              │
            │  ► Purpose / Reason      │
            │  ► Notes (optional)      │
            └───────────┬──────────────┘
                        │
                        ▼
            ┌──────────────────────────┐
            │  Confirm checkout        │
            │  ► Update lot qty        │
            │  ► Log transaction       │
            │  ► Show confirmation     │
            └───────────┬──────────────┘
                        │
               ┌────────┴────────┐
               ▼                 ▼
        ┌────────────┐    ┌────────────┐
        │ Scan next  │    │   Done     │
        │ QR code    │    │            │
        └────────────┘    └────────────┘
```

---

## Partial Checkout

Partial checkout means withdrawing **less than the full remaining quantity** of a lot. This is the common case.

| Scenario | Example | Result |
|---|---|---|
| Partial checkout | Lot has 2.5 L, user checks out 0.5 L | Lot: 2.0 L remaining, status: Active |
| Full lot checkout | Lot has 2.0 L, user checks out 2.0 L | Lot: 0 L remaining, status: **Depleted** |
| Multiple partial checkouts | Lot: 2.5 → 2.0 → 1.5 → 0 | Each checkout logged individually; lot depleted on final |

---

## Transaction History Entries for Checkout

| Action | Transaction Type | Key Data |
|---|---|---|
| Checkout (QR or manual) | `CHECKOUT` | Lot ID, item, lot number, quantity withdrawn, quantity remaining after, purpose/reason, user, lab, location, timestamp, checkout method |

---

## Notifications Generated

| Event | Recipients | Channel |
|---|---|---|
| Lot depleted (qty = 0) | Focal Point | In-app |
| Min-stock threshold breached (after checkout) | Focal Point, Admin | In-app, Dashboard |

---

## Edge Cases

### Lot Is About to Expire
- If the lot's expiry date is within the configured warning window (e.g., 30 days), display a warning: "This lot expires on {date}. Proceed with checkout?"
- Allow checkout (expired chemicals may still be usable depending on context; the user decides).

### Lot Is Expired
- If the lot's expiry date has passed, **block checkout** with: "This lot is expired and cannot be checked out. Contact your Focal Point."
- Expired lots must go through shelf-life extension or disposal, not direct checkout.

### Concurrent Checkouts
- If two users attempt to check out from the same lot simultaneously, the system must use **optimistic concurrency control** (version column on the lot record) to prevent over-withdrawal.
- Implementation: the lot record has a `version` column. On update, the query includes `WHERE version = {expected_version}`. If the update affects 0 rows, the system reloads the latest data and informs the user: "The lot quantity has been updated by another user. Please review and try again."
- The second user should see the updated remaining quantity and receive an error if their requested quantity exceeds what remains.

### Checkout for Disposal
- If the purpose is "Disposal," the checkout follows the same flow but the Focal Point may want visibility.
- The transaction type is still `CHECKOUT` with purpose = "Disposal."
- Future enhancement: a dedicated disposal workflow could be added.

### Open Date Already Set
- If the lot's `open_date` is already populated, the open-date prompt (Step 2a) is skipped entirely.
- The lot detail page shows the open date for reference.

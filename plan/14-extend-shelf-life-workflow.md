# 14 — Extend Shelf Life Workflow

This document defines the workflow for extending the shelf life of a specific inventory lot, ensuring full auditability with before/after values and traceable authorization.

---

## Overview

Shelf-life extension is the process of extending the expiry date of a specific chemical lot after a qualifying assessment determines the chemical is still fit for use. This is a controlled, auditable operation — the system must never silently overwrite an expiry date.

| Aspect | Detail |
|---|---|
| Scope | Single lot at a time |
| Who can initiate | Focal Point, Admin |
| Entry method | QR scan of the lot (primary) or manual search (fallback) |
| Audit requirement | Full before/after record preserved immutably |
| Category applicability | Chemical & Reagent only |

---

## Workflow Steps

### Step 1: Identify Lot via QR Scan

**Actor:** Focal Point or Admin

**Actions:**
1. Navigate to the **Extend Shelf Life** page (or access via the lot detail page or expired dashboard).
2. Scan the QR code on the chemical's label.
3. System decodes the QR payload and loads the lot record.

**Fallback:** If QR scanning is unavailable, the user can manually search by item name, lot number, or catalog number and select the specific lot.

---

### Step 2: System Displays Lot Details

The system shows the current lot information:

| Field | Value (Example) |
|---|---|
| Item Name | Tetrahydrofuran (THF) |
| Catalog Number | T1234 |
| Lot Number | LOT-2025-019 |
| Category | Chemical & Reagent |
| Lab / Location | AIE / PO Lab |
| Quantity Remaining | 1.800 L |
| Current Expiry Date | **2026-04-15** |
| Days to Expiry | **28 days** (or **-5 days** if already expired) |
| Lot Status | Active (or Expired) |
| Check-In Date | 2025-10-15 |
| Open Date | 2025-11-01 |
| Previous Extensions | 0 (or list of prior extensions) |

**Validation:**
- The lot must be in **Active** or **Expired** status. (Expired lots are valid candidates for extension — that is a primary use case.)
- The lot must not be **Quarantined** or **Disposed**.
- The lot's category must be **Chemical & Reagent**. Other categories do not support shelf-life extension.

---

### Step 3: Enter Extension Details

**Actor:** Focal Point or Admin

The user fills in the extension form:

| Field | Required | Description |
|---|---|---|
| **New Expiry Date** | Yes | The proposed new expiry date. Must be after the current expiry date. |
| **Reason / Justification** | Yes | Why the shelf life is being extended. Freeform text or structured dropdown + text. |
| **Test Performed** | Yes | Description of the qualifying test or assessment that justifies the extension (e.g., "Visual inspection — clear, no discoloration", "Titration test passed"). |
| **Test Result** | Yes | Outcome of the qualifying test (e.g., "Pass", numeric result, or descriptive). |
| **Test Date** | Yes | Date the qualifying test was performed. Defaults to today. |
| **Authorized By** | Auto | Auto-populated with the current user (Focal Point or Admin). |

---

### Step 4: System Calculates Before/After Summary

Before saving, the system displays a summary:

```
┌──────────────────────────────────────────────────┐
│  SHELF LIFE EXTENSION SUMMARY                    │
│                                                  │
│  Item:           Tetrahydrofuran (THF)           │
│  Lot:            LOT-2025-019                    │
│  Lab:            AIE / PO Lab                    │
│                                                  │
│  ── BEFORE ──────────────────────────────────    │
│  Expiry Date:    2026-04-15                      │
│  Days to Expiry: 28 days                         │
│                                                  │
│  ── AFTER ───────────────────────────────────    │
│  New Expiry Date:    2026-10-15                  │
│  New Days to Expiry: 211 days                    │
│  Extension Period:   183 days                    │
│                                                  │
│  Test: Visual inspection — clear, no discoloration│
│  Result: Pass                                    │
│  Authorized by: Jane Smith (Focal Point)         │
│                                                  │
│  [Cancel]                      [Confirm Extension]│
└──────────────────────────────────────────────────┘
```

---

### Step 5: Confirm and Save

**Actions:**
1. User reviews the before/after summary.
2. User clicks "Confirm Extension".
3. System performs the following actions:

   **a) Creates Extension Record:**
   An immutable record capturing:

   | Field | Value |
   |---|---|
   | `lot_id` | FK to the lot |
   | `previous_expiry_date` | The old expiry date (before extension) |
   | `new_expiry_date` | The new expiry date (after extension) |
   | `previous_days_to_expiry` | Calculated: old expiry − today |
   | `new_days_to_expiry` | Calculated: new expiry − today |
   | `extension_days` | Calculated: new expiry − old expiry |
   | `reason` | Justification text |
   | `test_performed` | Test description |
   | `test_result` | Test outcome |
   | `test_date` | When the test was performed |
   | `authorized_by` | Current user |
   | `created_at` | Current timestamp |

   **b) Updates Lot Record:**
   - `expiry_date` → set to the **new expiry date**.
   - `status` → if the lot was **Expired**, set back to **Active**.
   - The lot's `updated_at` and `updated_by` fields are updated.

   **c) Logs Transaction History:**
   - Type: `EXTEND_SHELF_LIFE`
   - Data: lot ID, item, lot number, previous expiry date, new expiry date, previous days to expiry, new days to expiry, extension days, test summary, authorized by, lab, location, timestamp.

   **d) Sends Notification:**
   - To Admin and Viewer/Auditor: "Shelf life extended for lot {lot_number} of {item}. New expiry: {date}. Authorized by: {user}."

---

## Extend Shelf Life Flow Diagram

```
┌─────────────────────────────────┐
│  Scan QR Code (or manual search)│
│  ► Identify specific lot        │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  Display lot details            │
│  ► Current expiry, days to exp  │
│  ► Previous extensions          │
│  ► Validate eligibility         │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  Enter extension details        │
│  ► New expiry date              │
│  ► Justification / test info    │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  Before / After summary         │
│  ► Old expiry vs. new expiry    │
│  ► Days to expiry comparison    │
│  ► Extension period             │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  Confirm Extension              │
│  ► Save extension record        │
│  ► Update lot expiry            │
│  ► Log transaction history      │
│  ► Send notifications           │
└─────────────────────────────────┘
```

---

## Auditability Requirements

The extension process is designed to be **fully auditable**:

1. **No silent overwrites** — The old expiry date is preserved in the extension record, not discarded.
2. **Immutable extension records** — Extension records are append-only. They cannot be edited or deleted.
3. **Authorization tracking** — Every extension records who authorized it and when.
4. **Test documentation** — The justifying test and its result are part of the permanent record.
5. **Transaction history** — A `EXTEND_SHELF_LIFE` transaction is logged for every extension.
6. **Extension count** — The lot detail page shows how many times the lot has been extended, with full history.
7. **Before/after values** — Both the old and new expiry dates, plus days-to-expiry calculations, are preserved.

---

## Extension History View

Each lot's detail page includes an **Extension History** section:

| # | Previous Expiry | New Expiry | Extension | Test | Authorized By | Date |
|---|---|---|---|---|---|---|
| 1 | 2026-04-15 | 2026-10-15 | 183 days | Visual inspection — Pass | Jane Smith | 2026-04-10 |
| 2 | 2026-10-15 | 2027-01-15 | 92 days | Titration test — Pass | John Doe | 2026-10-10 |

---

## Transaction History Entry

| Action | Transaction Type | Key Data |
|---|---|---|
| Extend shelf life | `EXTEND_SHELF_LIFE` | Lot ID, item, lot number, old expiry, new expiry, old days-to-expiry, new days-to-expiry, extension days, test summary, authorized by, lab, location, timestamp |

---

## Notifications Generated

| Event | Recipients | Channel |
|---|---|---|
| Shelf life extended | Admin, Viewer/Auditor | In-app |
| Shelf life extended (lot was previously expired) | Focal Point, Admin | In-app, Email |

---

## Restrictions and Validation Rules

| Rule | Description |
|---|---|
| **Category restriction** | Only lots categorized as **Chemical & Reagent** can have their shelf life extended. |
| **Status restriction** | Only **Active** or **Expired** lots can be extended. **Quarantined** and **Disposed** lots cannot. |
| **New date validation** | New expiry date must be **after** the current expiry date. |
| **Role restriction** | Only **Focal Point** and **Admin** can perform extensions. Lab Users cannot. |
| **Lot-level only** | Extension applies to a single lot, not all lots of the same chemical. |

---

## Edge Cases

### Extending an Already-Expired Lot
- This is a valid and expected scenario (one of the primary use cases for this feature).
- The lot is currently in **Expired** status.
- After extension, the lot status returns to **Active** with the new expiry date.
- Transaction history clearly records that the lot was expired and has been reactivated.

### Multiple Extensions
- A lot can be extended multiple times.
- Each extension creates a new, separate extension record.
- The extension history shows the full chain of extensions.
- Whether there is a maximum number of extensions is an open question (see `09-open-questions.md`, OQ-26).

### Extension After Peroxide Warning
- If a lot has a peroxide Warning classification, the Focal Point may choose to extend the shelf life.
- The system allows this, but the peroxide monitoring schedule is not reset by a shelf-life extension.
- Both the extended expiry date and the peroxide monitoring remain independently tracked.

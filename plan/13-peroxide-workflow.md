# 13 — Peroxide Monitoring Workflow

This document defines the peroxide monitoring workflow including the peroxide list page, lot-based monitoring events, PPM thresholds, and the data model for tracking key dates and test results.

> **Frontend pages:** Peroxide List (`/monitoring/peroxide`), Log Peroxide Test (`/monitoring/peroxide/:lotId/log`), Peroxide History (`/monitoring/peroxide/:lotId/history`), Peroxide Due Dashboard (`/monitoring/peroxide-due`). See `23-page-and-route-planning.md`.
> **UI components:** `DataTable`, `FilterBar`, `StatusBadge`, `FormSection`, `DashboardCard`. See `26-component-and-state-planning.md`.

---

## Overview

Peroxide monitoring is a **safety-critical** process that applies to chemicals classified as peroxide-forming. These chemicals can form explosive organic peroxides over time, requiring periodic testing of peroxide concentration levels.

Monitoring is:
- **Lot-based** — each inventory lot of a peroxide-forming chemical is monitored independently.
- **Event-driven** — multiple monitoring events can be recorded per lot over its lifetime.
- **Threshold-based** — PPM results determine actions (normal, warning, quarantine).

---

## Peroxide PPM Thresholds

| PPM Level | Classification | Action |
|---|---|---|
| **< 25 ppm** | ✅ **Normal** | Lot remains Active. Schedule next monitoring date. |
| **≥ 25 ppm and ≤ 100 ppm** | ⚠️ **Warning** | Lot remains Active but flagged for increased monitoring frequency. Notify Focal Point. |
| **> 100 ppm** | 🛑 **Quarantine** | Lot status → **Quarantined**. Block checkout. Notify Focal Point and Admin immediately. Require disposal decision. |

### Threshold Configuration

PPM thresholds are **system-wide defaults** in MVP:
- Normal: < 25 ppm
- Warning: ≥ 25 ppm
- Quarantine: > 100 ppm

> **Future:** If thresholds need to vary by chemical or classification group, make them configurable per peroxide classification group in the admin settings. See `09-open-questions.md`, OQ-52.

---

## Key Dates Tracked Per Lot

Each peroxide-monitored lot tracks the following dates:

| Date Field | Description | Set When |
|---|---|---|
| **Check-In Date** | Date the lot was received into inventory | At check-in |
| **Open Date** | Date the container was first opened | Manually recorded by user (first use via checkout prompt or explicit entry) |
| **First Inspect Date** | Date of the first peroxide monitoring test | At first monitoring event |
| **Last Monitor Date** | Date of the most recent monitoring event | Updated at each monitoring event |
| **Next Monitor Due** | Date the next monitoring test is due | Auto-calculated from last monitor date + interval |
| **Expiry Date** | Standard chemical expiry date | At check-in (may be extended via shelf-life extension) |

---

## Peroxide Classification Groups

Peroxide-forming chemicals are classified into groups that determine monitoring intervals:

| Group | Description | Example Chemicals | Monitoring Interval |
|---|---|---|---|
| **Class A** | Severe hazard — form peroxides readily without concentration | Diisopropyl ether, Potassium amide | 3 months |
| **Class B** | Concentration hazard — hazardous on concentration (e.g., distillation) | Tetrahydrofuran (THF), Diethyl ether | 6 months |
| **Class C** | Low hazard — can autopolymerize with peroxide initiation | Styrene, Methyl methacrylate | 12 months |

> **Note:** Exact intervals are configurable in the admin settings. The above are recommended defaults. See `09-open-questions.md`, OQ-21 and OQ-53 for stakeholder confirmation.

**Reduced intervals on Warning:**
When a lot receives a Warning classification (≥ 25 ppm), the next monitoring interval is **halved** (e.g., Class B 6 months → 3 months) to increase monitoring frequency.

---

## Peroxide List Page

### Purpose
Provide a centralized view of all peroxide-forming chemical lots that require monitoring, with search, filter, and status indicators.

### Page Layout

The peroxide list page displays a scrollable table with the following columns:

| Column | Description |
|---|---|
| **Status Indicator** | Color-coded icon: ✅ Normal, ⚠️ Warning, 🛑 Quarantined, 🔴 Overdue |
| **Item Name** | Chemical name |
| **Lot Number** | Inventory lot number |
| **Classification Group** | Class A, B, or C |
| **Lab** | Lab and location |
| **Check-In Date** | When the lot was received |
| **Open Date** | When the container was first opened |
| **Last Monitor Date** | Date of the most recent test |
| **Next Monitor Due** | When the next test is due |
| **Days Until Due** | Calculated: `Next Monitor Due - Today`. Negative = overdue. |
| **Last PPM Result** | Most recent PPM reading |
| **Last Classification** | Normal / Warning / Quarantine |
| **Actions** | Button: "Log Test" |

### Filters

| Filter | Options |
|---|---|
| Location | Dropdown: AIE, MTP, CT, ATC |
| Lab | Dropdown: filtered by selected location |
| Status | All, Normal, Warning, Quarantined, Overdue |
| Classification Group | Class A, Class B, Class C |
| Search | Item name, lot number |

### Sorting
- Default sort: **Days Until Due** ascending (most overdue first).
- Secondary sort: Last Monitor Date ascending (least recently tested first).

### Overdue Logic
A lot is **overdue** when `TODAY > Next Monitor Due`. Overdue lots are highlighted in red and sorted to the top of the list.

---

## Monitoring Event Entry

### Trigger
User clicks "Log Test" from the peroxide list or navigates to a specific lot's detail page.

### Step 1: Review Lot Information

The system displays the lot details:
- Item name, lot number, lab, location.
- Classification group and monitoring interval.
- Check-in date, open date, expiry date.
- Previous monitoring events (history table showing all past events).

### Step 2: Enter Monitoring Event

**Actor:** Lab User, Focal Point, or Admin

| Field | Required | Description |
|---|---|---|
| **Test Date** | Yes | Date the peroxide test was performed. Defaults to today. |
| **Tested By** | Yes | Auto-populated with current user. Can be overridden for data entry on behalf of another person. |
| **Test Method** | No | Description of the testing method used (dropdown or freeform). Common methods: Test strip, Titration, Electronic meter. |
| **PPM Result** | Conditional | Numeric value: parts per million of peroxide detected. Required if result type is numeric. |
| **Result Text** | Conditional | Textual description of result (e.g., "Negative", "Trace", "Positive"). Required if result type is textual. |
| **Result Type** | Yes | Dropdown: `Numeric (ppm)` or `Textual`. Determines which field (PPM Result or Result Text) is required. |
| **Result Classification** | Auto | System-calculated based on PPM thresholds (for numeric results): Normal / Warning / Quarantine. For textual results, the user selects the classification manually. |
| **Visual Observations** | No | Freeform text: color changes, precipitate, unusual odor, etc. |
| **Notes** | No | Additional observations or context. |

**Result type handling:**
- **Numeric (ppm):** PPM Result field is shown and required. System auto-calculates the classification.
- **Textual:** Result Text field is shown and required. User must manually select the classification (Normal / Warning / Quarantine) from a dropdown since the system cannot auto-calculate from text.

### Step 3: System Processes Result

Based on the classification (auto-calculated for numeric, user-selected for textual):

#### Normal (< 25 ppm or user-selected Normal)
1. Monitoring event is saved.
2. `Last Monitor Date` updated on the lot.
3. `Next Monitor Due` recalculated: `Test Date + Monitoring Interval`.
4. Lot status remains **Active**.
5. Transaction history entry: `PEROXIDE_TEST_LOGGED`.
6. If this is the first monitoring event: set `First Inspect Date` on the lot.

#### Warning (≥ 25 ppm and ≤ 100 ppm or user-selected Warning)
1. Monitoring event is saved with warning flag.
2. `Last Monitor Date` updated.
3. `Next Monitor Due` recalculated with **shortened interval** (monitoring interval / 2).
4. Lot status remains **Active** but flagged (warning indicator on the lot record).
5. Notification sent to the Focal Point: "Lot {lot_number} of {item} has elevated peroxide levels ({PPM} ppm). Increased monitoring required."
6. Transaction history entry: `PEROXIDE_TEST_LOGGED` with warning flag.

#### Quarantine (> 100 ppm or user-selected Quarantine)
1. Monitoring event is saved with quarantine flag.
2. Lot status changes to **Quarantined**.
3. Lot is **blocked from checkout**.
4. Notification sent to Focal Point and Admin: "CRITICAL: Lot {lot_number} of {item} has peroxide levels of {PPM} ppm (> 100 ppm). Lot has been quarantined. Disposal required."
5. `Next Monitor Due` is cleared — no further monitoring needed; the lot must be disposed.
6. Transaction history entries: `PEROXIDE_TEST_LOGGED` + `LOT_QUARANTINED`.

### Step 4: Confirm and Save

1. User reviews the entered data and system-calculated (or user-selected) classification.
2. User clicks "Save".
3. System saves the monitoring event and updates the lot record.
4. Confirmation displayed with the result and next action (if any).

---

## Monitoring Event Flow Diagram

```
┌──────────────────────────────────┐
│  Peroxide List Page              │
│  ► View all monitored lots       │
│  ► Filter / Search               │
│  ► Identify overdue lots         │
└──────────────┬───────────────────┘
               │ Click "Log Test"
               ▼
┌──────────────────────────────────┐
│  Review lot information          │
│  ► Current dates and status      │
│  ► Classification group          │
│  ► Previous test history         │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│  Enter monitoring event          │
│  ► Test date, tested by          │
│  ► PPM result OR textual result  │
│  ► Select result type            │
│  ► Observations / notes          │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│  System evaluates result         │
│                                  │
│  Numeric:                        │
│  < 25 ppm  → Normal              │
│  ≥ 25 ppm  → Warning             │
│  > 100 ppm → Quarantine          │
│                                  │
│  Textual:                        │
│  User selects classification     │
└──────────────┬───────────────────┘
               │
       ┌───────┼───────────┐
       ▼       ▼           ▼
   ┌────────┐ ┌────────┐ ┌──────────┐
   │ Normal │ │Warning │ │Quarantine│
   │        │ │        │ │          │
   │Schedule│ │Shorten │ │Block lot │
   │next    │ │interval│ │Notify FP │
   │monitor │ │Notify  │ │& Admin   │
   └────────┘ └────────┘ └──────────┘
               │
               ▼
┌──────────────────────────────────┐
│  Save & log transaction          │
│  ► Update lot dates              │
│  ► Write transaction history     │
└──────────────────────────────────┘
```

---

## Monitoring Event Data Model

Each monitoring event is a separate record linked to a lot:

| Field | Type | Description |
|---|---|---|
| `id` | PK | Unique event ID |
| `lot_id` | FK | Link to inventory lot |
| `test_date` | Date | When the test was performed |
| `tested_by` | FK | User who performed the test |
| `test_method` | Text | Method used (nullable) |
| `result_type` | Enum | `NUMERIC` or `TEXTUAL` |
| `ppm_result` | Decimal | Parts per million measured (nullable if textual) |
| `result_text` | Text | Textual result description (nullable if numeric) |
| `classification` | Enum | `Normal`, `Warning`, `Quarantine` |
| `visual_observations` | Text | Freeform observations (nullable) |
| `notes` | Text | Additional notes (nullable) |
| `next_monitor_due` | Date | Calculated next test date (null if quarantined) |
| `created_at` | Timestamp | Record creation time |

---

## Open Date Tracking

The **open date** is the date the container was first opened. This is significant because peroxide formation accelerates after a container is opened.

### How Open Date Is Set
1. **During first checkout:** If a lot's open date is `NULL` when a checkout occurs, the checkout workflow prompts the user: "Is this the first time this container is being opened?" If yes, set `open_date = today`. See `12-checkout-workflow.md`, Step 2a.
2. **Manual entry:** From the lot detail page, the Focal Point can manually enter an open date.
3. **At monitoring event:** If the operator notes the container was opened, the open date can be set from the monitoring event form.

### Impact on Monitoring
- Some monitoring schedules may use `open_date` as the anchor for calculating the first inspection due date rather than `check_in_date`.
- This is configurable per peroxide classification group.
- If a chemical is opened but has not yet been tested, the system calculates the first monitoring due date based on `open_date + initial monitoring interval`.

---

## Quarantined Lot Disposal Path

When a lot is quarantined (> 100 ppm):
1. The lot cannot be checked out.
2. The lot appears on the Peroxide Due Dashboard with 🛑 Quarantine indicator.
3. Focal Point or Admin must initiate disposal:
   - From the lot detail page, select "Dispose".
   - System prompts for disposal method and reason.
   - A `DISPOSAL` transaction is logged.
   - Lot status → **Disposed**.
4. Until disposal, the lot remains visible in the quarantine section of the dashboard.

---

## Transaction History Entries for Peroxide Monitoring

| Action | Transaction Type | Key Data |
|---|---|---|
| Log monitoring event | `PEROXIDE_TEST_LOGGED` | Lot ID, item, lot number, test date, PPM result or text result, classification, tester, lab, timestamp |
| Lot quarantined | `LOT_QUARANTINED` | Lot ID, item, lot number, PPM result, user, lab, timestamp |

---

## Notifications Generated

| Event | Recipients | Channel |
|---|---|---|
| Monitoring test due (upcoming) | Lab User (assigned), Focal Point | In-app, Dashboard |
| Monitoring test overdue | Focal Point, Admin | In-app, Dashboard, Email |
| Warning-level result (≥ 25 ppm) | Focal Point | In-app, Email |
| Quarantine-level result (> 100 ppm) | Focal Point, Admin | In-app, Email (urgent) |

---

## Edge Cases

### Multiple Open Containers
If the same lot number has been split into multiple containers and opened at different times, the system tracks a single `open_date` per lot record. If container-level tracking is needed, it should be noted in `09-open-questions.md`.

### Historical Data Entry
Users may need to log past monitoring events (e.g., migrating from paper records). The test date field allows backdating, but the `created_at` timestamp always reflects when the record was entered into the system.

### Quarantine → Disposal
A quarantined lot cannot be checked out. The Focal Point or Admin must initiate a disposal action. The disposal process creates a `DISPOSAL` transaction and sets the lot status to **Disposed**. See the "Quarantined Lot Disposal Path" section above.

### Textual vs. Numeric Results
Some test methods (e.g., test strips) produce textual results like "Negative" or "Positive" rather than exact PPM values. The system supports both result types:
- **Numeric:** Auto-classification based on PPM thresholds.
- **Textual:** User manually selects the classification (Normal / Warning / Quarantine).
- Dashboard and reporting treat both result types consistently by classification.

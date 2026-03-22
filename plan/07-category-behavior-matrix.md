# 07 — Category Behavior Matrix

## Overview

Not all item categories follow the same lifecycle workflow. The system must support **category-driven behavior**, where each category enables or disables specific modules and features. This ensures that the UI, business logic, and data model adapt based on the type of item being managed.

---

## Category Definitions

| Category | Description | Examples |
|---|---|---|
| **Chemical & Reagent** | Laboratory chemicals and reagents used in testing and research. Full lifecycle tracking including ordering, inventory, peroxide monitoring, and regulatory reporting. | Acetone, Hydrochloric Acid, Toluene, Ethanol |
| **Verify STD** | Verified reference standards used for instrument calibration and method validation. Not ordered through this system; received directly and tracked in inventory. | USP Reference Standards, Certified Reference Materials |
| **Gas** | Laboratory gases used in instrumentation and processes. Ordering is supported in MVP, but full inventory and checkout tracking is deferred. | Nitrogen, Helium, Argon, Hydrogen |
| **Material & Consumable** | General lab materials and consumable supplies. Selective ordering in MVP; full inventory tracking deferred. | Gloves, Pipette tips, Filter paper, Sample vials |

---

## Behavior Matrix

| Capability | Chemical & Reagent | Verify STD | Gas | Material & Consumable |
|---|---|---|---|---|
| **Ordering** | ✅ Full ordering workflow | ❌ Not ordered through system | ✅ Ordering only (MVP) | ⚠️ Ordering for selected items (MVP) |
| **Cart** | ✅ | ❌ | ✅ | ⚠️ (for orderable items) |
| **Approval** | ✅ | ❌ | ✅ | ⚠️ (for orderable items) |
| **Vendor Email** | ✅ | ❌ | ✅ | ⚠️ (for orderable items) |
| **Check-In** | ✅ Full lot-level check-in | ✅ Manual check-in (no PO) | ❌ (MVP) | ❌ (MVP) |
| **Lot Tracking** | ✅ | ✅ | ❌ (MVP) | ❌ (MVP) |
| **Checkout** | ✅ Full checkout with quantity tracking | ✅ Checkout with usage tracking | ❌ (MVP) | ❌ (MVP) |
| **QR Code** | ✅ Generate and scan | ✅ Generate and scan | ❌ (MVP) | ❌ (MVP) |
| **Notify / Remind** | ✅ Expiry, low stock, peroxide | ✅ Expiry, low stock | ❌ (MVP) | ❌ (MVP) |
| **Expiry Tracking** | ✅ | ✅ | ❌ | ❌ |
| **Peroxide Monitoring** | ✅ (for peroxide-forming chemicals) | ❌ | ❌ | ❌ |
| **Shelf-Life Extension** | ✅ | ❌ | ❌ | ❌ |
| **Min-Stock Dashboard** | ✅ | ✅ | ❌ (MVP) | ❌ (MVP) |
| **Transaction History** | ✅ | ✅ | ❌ (MVP) | ❌ (MVP) |
| **Regulatory Reporting** | ✅ Full regulatory support | ⚠️ Limited reporting | ❌ (MVP) | ❌ (MVP) |

### Legend

| Symbol | Meaning |
|---|---|
| ✅ | Fully supported |
| ⚠️ | Partially supported or conditional |
| ❌ | Not supported (in this phase) |

---

## Detailed Category Behavior

### Chemical & Reagent

This is the **primary category** with the full lifecycle:

```
Order → Approve → Vendor Email → Receive → Check-In → Inventory
   → Checkout → Transaction Log
   → Peroxide Monitoring (if applicable)
   → Shelf-Life Extension (if applicable)
   → Expiry Tracking → Notifications
   → Regulatory Reporting
```

**Key behaviors:**
- Full ordering and approval workflow.
- Lot-level check-in with manufacture date, expiry date, and storage location.
- Checkout with quantity reduction and purpose/reason logging.
- Peroxide monitoring applies only to chemicals flagged as peroxide-forming. Not all chemicals in this category undergo peroxide testing. The spreadsheet identifies **9** peroxide sub-types (see Peroxide Sub-Type Reference below).
- Shelf-life extension is available for qualifying lots.
- All transactions are logged and available for regulatory reporting.
- Min-stock thresholds trigger dashboard alerts.
- Expiry monitoring surfaces items approaching or past expiry.
- QR codes generated at check-in for fast checkout scanning.
- Regulatory flags include: `VoOrOrKo7`, `FACCHEM`, `Munition` (from stakeholder spreadsheet). These determine regulatory reporting requirements.

---

### Verify STD (Verified Standards)

Verified standards are **not ordered** through this system. They are received directly (from a standards organization or internal source) and checked into inventory manually.

```
Manual Check-In → Inventory → Checkout → Transaction Log
   → Expiry Tracking → Notifications
```

**Key behaviors:**
- **No ordering workflow.** Items appear in the system only after manual check-in.
- Manual check-in by Focal Point or Admin (no associated purchase order).
- Lot-level tracking with certificate of analysis, expiry date, and assigned value.
- Checkout tracks usage with the same rigor as chemicals (quantity, user, date, purpose).
- Expiry tracking is critical — expired standards must not be used.
- Min-stock thresholds alert when standard stocks are low.
- Notifications for expiring standards sent to Focal Point and relevant lab users.
- Peroxide monitoring does **not** apply.
- Shelf-life extension does **not** apply (standards have fixed validity periods).
- Transaction history is maintained for audit but regulatory reporting scope is limited.

---

### Gas

In the MVP, gas management is limited to **ordering only**. Full inventory lifecycle tracking for gas cylinders is deferred to a future phase.

```
Order → Approve → Vendor Email → (Delivery tracked externally)
```

**Key behaviors:**
- Ordering supported: browse gas catalog, add to cart, submit, approve.
- Vendor email notification sent upon approval.
- **No check-in** in MVP — gas deliveries are tracked outside this system.
- **No lot tracking** in MVP — cylinder tracking may be added later.
- **No checkout** in MVP — gas consumption is not recorded.
- **No expiry tracking** — gases do not expire in the same sense as chemicals.
- **No peroxide monitoring** — not applicable.
- **No notifications** beyond ordering-related notifications.
- Future phases may add cylinder tracking, return management, and usage logging.

---

### Material & Consumable

In the MVP, material and consumable management is limited to **ordering for selected items**. Not all materials are orderable; the catalog marks which items support ordering.

```
(Selected items) Order → Approve → Vendor Email → (Delivery tracked externally)
```

**Key behaviors:**
- Ordering supported **for designated items only**. Catalog items have an "orderable" flag.
- Standard ordering workflow for orderable items: cart, submit, approve, vendor email.
- **No check-in** in MVP — consumable deliveries are not lot-tracked.
- **No lot tracking** — consumables are typically not tracked at lot level.
- **No checkout** in MVP — consumption is not recorded individually.
- **No expiry tracking** — most consumables do not expire meaningfully.
- **No peroxide monitoring** — not applicable.
- **No notifications** beyond ordering-related notifications.
- Future phases may add bulk inventory tracking and reorder automation.

---

## Peroxide Sub-Type Reference

The stakeholder spreadsheet (Database_Info_Draft, MaterialList and Peroxide_Related sheets) reveals **9 distinct peroxide sub-types**, expanding the original 3-class system:

| Peroxide Sub-Type | Full Label | Description | Monitoring Notes |
|---|---|---|---|
| `Peroxide_TS` | Peroxide — Time Sensitive | Chemical with time-sensitive peroxide risk | Visual inspection every 6 months after check-in. Dispose 12 months after check-in. |
| `Peroxide_CRF` | Peroxide — Chloroform | Chloroform (stabilized with ethanol) | No periodic testing required if sealed. Dispose 18 months after open or 24 months after check-in. |
| `Peroxide_A` | Class A | Severe hazard — forms peroxides readily | Test before use (at open date). Dispose 3 months after open or 18 months after check-in. |
| `Peroxide_B` | Class B | Concentration hazard — hazardous on concentration | Test every 6 months after open and before distillation/concentration. Dispose 12 months after open or 24 months after check-in. |
| `Peroxide_C1` | Class C1 — With Inhibitor | Monomer with inhibitor | Test before distillation/concentration. Dispose 12 months after check-in (or per manufacturer expiry). |
| `Peroxide_C2` | Class C2 — Without Inhibitor | Monomer without inhibitor | Test before distillation/concentration. Dispose within 24 hours of opening. |
| `Peroxide_D` | Class D (General) | Polyether/glycol — general | Test before distillation/concentration. Dispose 24 months after open or 36 months after check-in. |
| `Peroxide_D1` | Class D1 — Chemical | Polyether/glycol — chemical usage | Test every 6 months after check-in. Dispose 24 months after open. |
| `Peroxide_D2` | Class D2 — Retain Sample | Polyether/glycol — retained sample | Test before use if > 6 months old; test before disposal (if opened). Dispose 36 months after open. |

> **Note:** This replaces the earlier simplified 3-class system (A/B/C). The `peroxide_class` field on items must accommodate all 9 sub-types. See `13-peroxide-workflow.md` for detailed rules per sub-type.

---

## Regulatory Type Reference

The spreadsheet's MaterialList `Regulatory` column identifies the following regulatory tags:

| Regulatory Tag | Description |
|---|---|
| `VoOrOrKo7` | Thai regulatory control (วอ.อร.คร.7 — Precursor chemical control) |
| `FACCHEM` | Factory chemical registration requirement |
| `Munition` | Munitions / dual-use chemical control |

Items may have **multiple regulatory tags** (e.g., "VoOrOrKo7, FACCHEM"). The data model should support a many-to-many relationship between items and regulations.

---

## MVP Impact Summary

| Category | MVP Scope | Full Scope (Future) |
|---|---|---|
| Chemical & Reagent | Full lifecycle | Maintained and enhanced |
| Verify STD | Check-in, inventory, checkout, expiry tracking | + advanced reporting |
| Gas | Ordering only | + cylinder tracking, usage, returns |
| Material & Consumable | Selective ordering only | + inventory tracking, consumption, reorder automation |

---

## Implementation Notes

### Category as a System-Level Concept

- The `category` field on the catalog item determines which workflow modules are available.
- The frontend must conditionally show/hide UI elements based on the item's category.
- The backend must validate operations against category rules (e.g., reject a checkout request for a Gas item in MVP).
- Category behavior should be **configurable** in the long term but can be **hardcoded** in MVP for speed of delivery.

### Category-Driven UI Adaptation

| Context | Behavior |
|---|---|
| Catalog browsing | All categories visible; "Order" button hidden for Verify STD |
| Cart | Only orderable categories can be added |
| Check-in | Only Chemical & Reagent and Verify STD show check-in forms |
| Checkout | Only Chemical & Reagent and Verify STD show checkout forms |
| Peroxide monitoring | Only Chemical & Reagent items flagged as peroxide-forming appear |
| Dashboards | Widgets adapt to show relevant categories only |

### Category-Driven Validation Rules

| Rule | Category | Validation |
|---|---|---|
| Order creation | Chemical & Reagent, Gas, Material & Consumable (orderable) | Allowed |
| Order creation | Verify STD | Rejected: "Verify STD items cannot be ordered" |
| Check-in | Chemical & Reagent, Verify STD | Allowed |
| Check-in | Gas, Material & Consumable | Rejected in MVP: "Not available for this item category" |
| Peroxide test logging | Chemical & Reagent (peroxide-forming) | Allowed |
| Peroxide test logging | All others | Rejected: "Peroxide monitoring not applicable" |
| Shelf-life extension | Chemical & Reagent | Allowed |
| Shelf-life extension | All others | Rejected: "Not applicable for this category" |

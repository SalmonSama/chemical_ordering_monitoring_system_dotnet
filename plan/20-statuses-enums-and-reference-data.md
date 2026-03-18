# 20 — Statuses, Enums, and Reference Data

This document defines all status values, enumeration types, and reference data used throughout the database. These definitions ensure consistent terminology across all planning documents (01–19) and will be used as `CHECK` constraints or reference tables during implementation.

---

## 1. Purchase Request Statuses

Used on `purchase_requests.status`.

| Value | Display Label | Description | Can Transition To |
|---|---|---|---|
| `DRAFT` | Draft | Request created but not yet finalized | `IN_CART`, _deleted_ |
| `IN_CART` | In Cart | Items in the user's cart; not yet submitted | `PENDING_APPROVAL`, _cleared_ |
| `PENDING_APPROVAL` | Pending Approval | Submitted; awaiting Focal Point review | `MODIFIED`, `APPROVED`, `CANCELLED` |
| `MODIFIED` | Modified | Focal Point has modified line items | `APPROVED` |
| `APPROVED` | Approved | Approved by Focal Point / Admin | `EMAIL_SENT` |
| `EMAIL_SENT` | Email Sent | Vendor notification email(s) dispatched | `PENDING_DELIVERY` |
| `PENDING_DELIVERY` | Pending Delivery | All vendor emails sent; awaiting physical delivery | `PARTIALLY_RECEIVED`, `CANCELLED` |
| `PARTIALLY_RECEIVED` | Partially Received | Some but not all line items fully received | `FULLY_RECEIVED` |
| `FULLY_RECEIVED` | Fully Received | All line items fully received; order complete | _(terminal)_ |
| `CANCELLED` | Cancelled | Cancelled by requester, Focal Point, or Admin | _(terminal)_ |

### Status Transition Rules

```
DRAFT → IN_CART → PENDING_APPROVAL → MODIFIED ──┐
                         │                       │
                         ├── APPROVED ◄──────────┘
                         │       │
                         │       ▼
                         │   EMAIL_SENT → PENDING_DELIVERY
                         │                      │
                         │          ┌────────────┤
                         │          ▼            ▼
                         │  PARTIALLY_RECEIVED → FULLY_RECEIVED
                         │
                         └── CANCELLED
```

**Reference:** `10-order-workflow.md`

---

## 2. Purchase Request Item Statuses

Used on `purchase_request_items.status`.

| Value | Display Label | Description |
|---|---|---|
| `PENDING` | Pending | Not yet received |
| `PARTIALLY_RECEIVED` | Partially Received | Some quantity received, more expected |
| `FULLY_RECEIVED` | Fully Received | All ordered quantity received |
| `CANCELLED` | Cancelled | Line item cancelled |

---

## 3. Inventory Lot Statuses

Used on `inventory_lots.status`.

| Value | Display Label | Description | Can Transition To |
|---|---|---|---|
| `ACTIVE` | Active | Lot is in inventory, available for checkout | `DEPLETED`, `EXPIRED`, `QUARANTINED`, `DISPOSED` |
| `DEPLETED` | Depleted | Lot quantity has reached zero through checkouts | _(terminal)_ |
| `EXPIRED` | Expired | Lot has passed its expiry date | `ACTIVE` (via shelf-life extension), `DISPOSED` |
| `QUARANTINED` | Quarantined | Lot flagged due to failed peroxide test (> 100 ppm) | `DISPOSED` |
| `DISPOSED` | Disposed | Lot has been officially disposed of | _(terminal)_ |

### Status Transition Diagram

```
                     ┌──────────────────────────────┐
                     │                              │
  CHECK_IN ──→ ACTIVE ──→ DEPLETED                 │
                  │                                  │
                  ├──→ EXPIRED ──→ ACTIVE (extended) │
                  │        │                         │
                  │        └──→ DISPOSED             │
                  │                                  │
                  └──→ QUARANTINED ──→ DISPOSED      │
                                                     │
                     (shelf-life extension) ──────────┘
```

**Reference:** `11-checkin-workflow.md`, `12-checkout-workflow.md`, `14-extend-shelf-life-workflow.md`

---

## 4. Peroxide Test Classifications

Used on `peroxide_tests.classification`.

| Value | Display Label | PPM Threshold | Action |
|---|---|---|---|
| `NORMAL` | Normal | < 25 ppm | Lot remains Active; schedule next test |
| `WARNING` | Warning | ≥ 25 ppm and ≤ 100 ppm | Increased monitoring frequency; notify Focal Point |
| `QUARANTINE` | Quarantine | > 100 ppm | Lot quarantined; block checkout; notify Focal Point + Admin |

**Reference:** `13-peroxide-workflow.md`

---

## 5. Lot Source Types

Used on `inventory_lots.source_type`.

| Value | Display Label | Description |
|---|---|---|
| `PURCHASE_ORDER` | Purchase Order | Received against an approved purchase request |
| `MANUAL` | Manual | Manually checked in (donation, transfer, Verify STD) |

---

## 6. Transaction Types

Used on `stock_transactions.transaction_type`.

| Value | Display Label | Description | Module |
|---|---|---|---|
| `ADD_TO_CART` | Add to Cart | User adds an item to their cart | Order |
| `SUBMIT_ORDER` | Submit Order | User submits cart as a purchase request | Order |
| `MODIFY_ORDER` | Modify Order | Focal Point modifies a request before approval | Approval |
| `APPROVE_ORDER` | Approve Order | Focal Point or Admin approves a request | Approval |
| `REJECT_ORDER` | Reject Order | Focal Point or Admin rejects a request | Approval |
| `SEND_VENDOR_EMAIL` | Send Vendor Email | System sends vendor notification email | Vendor Email |
| `CANCEL_ORDER` | Cancel Order | Request cancelled | Order |
| `CHECK_IN` | Check-In | Items checked in against a purchase order | Check-In |
| `MANUAL_CHECK_IN` | Manual Check-In | Items checked in without a purchase order | Check-In |
| `CHECKOUT` | Checkout | Items withdrawn from inventory | Checkout |
| `PEROXIDE_TEST` | Peroxide Test | Peroxide monitoring test result recorded | Peroxide |
| `LOT_QUARANTINED` | Lot Quarantined | Lot quarantined due to high peroxide levels | Peroxide |
| `EXTEND_SHELF_LIFE` | Shelf-Life Extension | Shelf life of a lot extended | Shelf Life |
| `ADJUSTMENT` | Adjustment | Manual quantity correction | Inventory |
| `DISPOSAL` | Disposal | Lot disposed | Inventory |
| `TRANSFER` | Transfer | Lot transferred between labs (future) | Inventory |

**Reference:** `16-transaction-history-and-audit.md`

---

## 7. Vendor Email Statuses

Used on `vendor_email_logs.status`.

| Value | Display Label | Description |
|---|---|---|
| `PENDING` | Pending | Email queued but not yet sent |
| `SENT` | Sent | Email successfully dispatched |
| `FAILED` | Failed | Email dispatch failed |
| `RETRYING` | Retrying | Failed email being retried |

---

## 8. Label Print Methods

Used on `label_print_logs.print_method`.

| Value | Display Label | Description |
|---|---|---|
| `BROWSER_PRINT` | Browser Print | Printed via browser's print dialog |
| `PDF_DOWNLOAD` | PDF Download | Downloaded as a PDF file |
| `LABEL_PRINTER` | Label Printer | Sent to a dedicated label printer |

---

## 9. Roles

Used in `roles` table as seed data.

| Name | Code | Description |
|---|---|---|
| Admin | `ADMIN` | Full system access across all locations and labs |
| Focal Point | `FOCAL_POINT` | Lab manager; approve orders, manage inventory, perform monitoring |
| Lab User | `LAB_USER` | Standard user; order, checkout, log tests within assigned labs |
| Viewer | `VIEWER` | Read-only access for auditors and compliance reviewers |

**Reference:** `04-user-roles-and-permissions.md`

---

## 10. Item Categories

Used in `item_categories` table as seed data.

| Code | Name | Default Behavior Summary |
|---|---|---|
| `CHEM_REAGENT` | Chemical & Reagent | Orderable, check-in, checkout, tracks expiry, may require peroxide monitoring |
| `VERIFY_STD` | Verify STD | Not orderable (manual check-in only), tracks expiry, regulatory |
| `GAS` | Gas | Orderable, no check-in/checkout in MVP |
| `MAT_CONSUMABLE` | Material & Consumable | Orderable (configurable), no check-in/checkout in MVP |

**Reference:** `07-category-behavior-matrix.md`

---

## 11. Audit Log Actions

Used on `audit_logs.action`.

| Value | Description |
|---|---|
| `USER_CREATED` | New user account created |
| `USER_UPDATED` | User profile or role updated |
| `USER_DEACTIVATED` | User account deactivated |
| `USER_REACTIVATED` | User account reactivated |
| `ROLE_CHANGED` | User's role was changed |
| `LAB_ASSIGNMENT_ADDED` | User assigned to a lab |
| `LAB_ASSIGNMENT_REMOVED` | User unassigned from a lab |
| `ITEM_CREATED` | New item added to catalog |
| `ITEM_UPDATED` | Item master data updated |
| `ITEM_DEACTIVATED` | Item deactivated in catalog |
| `VENDOR_CREATED` | New vendor added |
| `VENDOR_UPDATED` | Vendor details updated |
| `VENDOR_DEACTIVATED` | Vendor deactivated |
| `LAB_CREATED` | New lab added |
| `LAB_UPDATED` | Lab details updated |
| `LOCATION_CREATED` | New location added |
| `LOCATION_UPDATED` | Location details updated |
| `ITEM_LAB_SETTINGS_UPDATED` | Min stock or lab config changed for an item |
| `REGULATION_CREATED` | New regulation added |
| `REGULATION_UPDATED` | Regulation updated |
| `CONFIG_CHANGED` | System configuration changed |

---

## 12. Audit Log Entity Types

Used on `audit_logs.entity_type`.

| Value | Description |
|---|---|
| `user` | Users table |
| `role` | Roles table |
| `user_lab` | User-lab assignments |
| `location` | Locations table |
| `lab` | Labs table |
| `item` | Items table |
| `item_category` | Item categories table |
| `vendor` | Vendors table |
| `item_lab_settings` | Item lab settings |
| `item_location_settings` | Item location settings |
| `regulation` | Regulations table |
| `item_regulation` | Item-regulation mappings |
| `purchase_request` | Purchase requests |
| `inventory_lot` | Inventory lots |
| `system_config` | System configuration |

---

## 13. Manual Check-In Source Reasons

Suggested reference values for `inventory_lots.source_reason` when `source_type = 'MANUAL'`:

| Value | Description |
|---|---|
| `DONATION` | Received as a donation or sample |
| `TRANSFER` | Transferred from another lab or department |
| `DIRECT_DELIVERY` | Procured outside the system (emergency, legacy order) |
| `STANDARDS_BODY` | Received from a standards organization (Verify STD) |
| `OTHER` | Other reason (freeform notes required) |

---

## 14. Checkout Purpose Values

Suggested reference values for `stock_transactions.purpose` when `transaction_type = 'CHECKOUT'`:

| Value | Description |
|---|---|
| `ROUTINE_TESTING` | Standard laboratory testing |
| `SAMPLE_PREPARATION` | Preparing samples for analysis |
| `CALIBRATION` | Equipment calibration |
| `RESEARCH` | Research or experimental use |
| `QUALITY_CONTROL` | Quality control procedures |
| `DISPOSAL` | Intentional discard |
| `OTHER` | Other purpose (notes required) |

---

## Summary: All CHECK Constraint Values

For implementation reference, here is a consolidated list of all enumerated values that should be enforced via `CHECK` constraints:

| Column | Table | Valid Values |
|---|---|---|
| `status` | `purchase_requests` | DRAFT, IN_CART, PENDING_APPROVAL, MODIFIED, APPROVED, EMAIL_SENT, PENDING_DELIVERY, PARTIALLY_RECEIVED, FULLY_RECEIVED, CANCELLED |
| `status` | `purchase_request_items` | PENDING, PARTIALLY_RECEIVED, FULLY_RECEIVED, CANCELLED |
| `status` | `inventory_lots` | ACTIVE, DEPLETED, EXPIRED, QUARANTINED, DISPOSED |
| `classification` | `peroxide_tests` | NORMAL, WARNING, QUARANTINE |
| `source_type` | `inventory_lots` | PURCHASE_ORDER, MANUAL |
| `transaction_type` | `stock_transactions` | ADD_TO_CART, SUBMIT_ORDER, MODIFY_ORDER, APPROVE_ORDER, REJECT_ORDER, SEND_VENDOR_EMAIL, CANCEL_ORDER, CHECK_IN, MANUAL_CHECK_IN, CHECKOUT, PEROXIDE_TEST, LOT_QUARANTINED, EXTEND_SHELF_LIFE, ADJUSTMENT, DISPOSAL, TRANSFER |
| `status` | `vendor_email_logs` | PENDING, SENT, FAILED, RETRYING |
| `print_method` | `label_print_logs` | BROWSER_PRINT, PDF_DOWNLOAD, LABEL_PRINTER |

# 20 — Statuses, Enums, and Reference Data

This document defines all status values, enum-like constants, and reference data used throughout the system. These definitions are the single source of truth — all workflow documents (10–16) and entity definitions (18) must use these exact values.

---

## 1. Purchase Request Statuses

Used on `purchase_requests.status`. See `10-order-workflow.md` for transition rules.

| Value (DB) | Display Label | Description |
|---|---|---|
| `draft` | Draft | Order created but not finalized (future — not in MVP cart flow) |
| `in_cart` | In Cart | Items added to the user's cart; not yet submitted |
| `pending_approval` | Pending Approval | Order submitted; awaiting Focal Point review |
| `modified` | Modified | Focal Point has modified the order before approving |
| `approved` | Approved | Order approved; vendor email dispatch triggered |
| `email_sent` | Email Sent | Vendor notification email(s) dispatched |
| `pending_delivery` | Pending Delivery | Vendor notified; awaiting physical delivery |
| `partially_received` | Partially Received | Some (not all) line items have been checked in |
| `fully_received` | Fully Received | All line items fully received; order complete |
| `cancelled` | Cancelled | Order cancelled by requester, Focal Point, or Admin |

### Status Transitions

```
draft → in_cart → pending_approval → modified → approved → email_sent → pending_delivery → partially_received → fully_received
                  pending_approval → approved   (direct approve, no modification)
                  pending_approval → cancelled   (rejected or requester cancelled)
                  approved → email_sent          (auto-transition after emails sent)
                  email_sent → pending_delivery  (auto-transition after all emails succeed)
                  pending_delivery → partially_received → fully_received
                  approved/email_sent/pending_delivery → cancelled   (Admin only)
```

---

## 2. Purchase Request Line Item Statuses

Used on `purchase_request_items.status`. See `10-order-workflow.md`.

| Value (DB) | Display Label | Description |
|---|---|---|
| `pending` | Pending | Line item submitted; not yet received |
| `partially_received` | Partially Received | Some quantity checked in, but not all |
| `fully_received` | Fully Received | All ordered quantity checked in |
| `removed` | Removed | Line item removed by Focal Point during modification |

---

## 3. Inventory Lot Statuses

Used on `inventory_lots.status`. See `11-checkin-workflow.md`.

| Value (DB) | Display Label | Description |
|---|---|---|
| `active` | Active | Lot is in inventory, available for checkout |
| `depleted` | Depleted | Lot quantity has reached zero through checkouts |
| `expired` | Expired | Lot has passed its expiry date |
| `quarantined` | Quarantined | Lot flagged due to high peroxide levels (> 100 ppm) or other safety concern |
| `disposed` | Disposed | Lot has been officially disposed of |

### Status Transitions

```
active → depleted        (quantity_remaining reaches 0 via checkout)
active → expired         (expiry_date passes; can be set by scheduled job or on-access check)
active → quarantined     (peroxide test > 100 ppm)
expired → active         (shelf-life extension: new expiry date set)
quarantined → disposed   (disposal action by Focal Point / Admin)
expired → disposed       (disposal action)
```

### Note on `expired` Detection

The system can detect expiry in two ways:
1. **On-access check:** When a lot is loaded for checkout or display, compare `expiry_date` to today. If expired and status is still `active`, update to `expired`.
2. **Scheduled job:** A nightly batch process updates all lots where `expiry_date < today AND status = 'active'` to `expired`.

Both approaches should be used for robustness.

---

## 4. Peroxide Test Classifications

Used on `peroxide_tests.classification`. See `13-peroxide-workflow.md`.

| Value (DB) | Display Label | Indicator | PPM Threshold |
|---|---|---|---|
| `normal` | Normal | ✅ Green | < 25 ppm |
| `warning` | Warning | ⚠️ Orange | ≥ 25 ppm and ≤ 100 ppm |
| `quarantine` | Quarantine | 🛑 Red | > 100 ppm |

For **textual results** (where PPM is not available), the classification is manually selected by the user.

---

## 5. Peroxide Result Types

Used on `peroxide_tests.result_type`. See `13-peroxide-workflow.md`.

| Value (DB) | Display Label | Description |
|---|---|---|
| `numeric` | Numeric (ppm) | PPM value measured; system auto-calculates classification |
| `textual` | Textual | Descriptive result (e.g., "Negative"); user selects classification manually |

---

## 6. Peroxide Classification Groups

Used on `items.peroxide_class`. See `13-peroxide-workflow.md`.

| Value (DB) | Display Label | Description | Default Monitoring Interval |
|---|---|---|---|
| `A` | Class A | Severe hazard — form peroxides readily | 3 months |
| `B` | Class B | Concentration hazard — hazardous on concentration | 6 months |
| `C` | Class C | Low hazard — autopolymerize with peroxide initiation | 12 months |

> **Note:** Monitoring intervals are configurable. These are recommended defaults. On a Warning classification, the interval is halved.

---

## 7. Transaction Types

Used on `stock_transactions.transaction_type`. See `16-transaction-history-and-audit.md` for the full catalog and JSONB metadata schemas.

| Value (DB) | Display Label | Module |
|---|---|---|
| `add_to_cart` | Add to Cart | Order |
| `submit_order` | Submit Order | Order |
| `modify_order` | Modify Order | Approval |
| `approve_order` | Approve Order | Approval |
| `reject_order` | Reject Order | Approval |
| `send_vendor_email` | Send Vendor Email | Vendor Email |
| `cancel_order` | Cancel Order | Order |
| `check_in` | Check-In (PO) | Check-In |
| `manual_check_in` | Manual Check-In | Check-In |
| `checkout` | Checkout | Checkout |
| `peroxide_test_logged` | Peroxide Test Logged | Peroxide |
| `lot_quarantined` | Lot Quarantined | Peroxide |
| `extend_shelf_life` | Extend Shelf Life | Shelf Life |
| `adjustment` | Manual Adjustment | Inventory |
| `disposal` | Disposal | Inventory |
| `transfer` | Inter-Lab Transfer | Inventory (future) |

---

## 8. Inventory Lot Source Types

Used on `inventory_lots.source_type`. See `11-checkin-workflow.md`.

| Value (DB) | Display Label | Description |
|---|---|---|
| `purchase_order` | Purchase Order | Checked in against an approved order |
| `manual` | Manual | Manually registered (donation, transfer, Verify STD) |

---

## 9. Manual Check-In Source Reasons

Used on `inventory_lots.manual_source_reason`. See `11-checkin-workflow.md`, Flow 2.

| Value (DB) | Display Label | Description |
|---|---|---|
| `donation` | Donation | Received as a donation from another organization |
| `transfer` | Transfer | Transferred from another lab or department |
| `direct_delivery` | Direct Delivery | Delivered directly by vendor outside the ordering process |
| `other` | Other | Other reason (notes field should explain) |

---

## 10. Vendor Email Statuses

Used on `vendor_email_logs.status`. See `10-order-workflow.md`, Step 7.

| Value (DB) | Display Label | Description |
|---|---|---|
| `sent` | Sent | Email dispatched successfully |
| `failed` | Failed | Email failed all retry attempts |
| `retrying` | Retrying | Email failed but retries remaining |

---

## 11. Audit Log Actions

Used on `audit_logs.action`.

| Value (DB) | Display Label | Description |
|---|---|---|
| `insert` | Created | New record created |
| `update` | Updated | Existing record modified |
| `delete` | Deleted | Record soft-deleted / deactivated |

---

## 12. User Roles

Used on `roles.name`. See `04-user-roles-and-permissions.md`.

| Value (DB) | Display Label | Description |
|---|---|---|
| `admin` | Admin | Full system access across all locations and labs. Creates and manages users. |
| `focal_point` | Focal Point | Manages operations for assigned locations; approves orders, manages inventory, corrects peroxide tests |
| `user` | User | Standard operational user; submits orders, performs checkout, logs peroxide tests |

> **Note:** The "Viewer / Auditor" role has been removed from MVP scope. If read-only audit access is needed, it can be added as a fourth role later.

---

## 12a. Location Scope Types

Used on `users.location_scope_type`. See `04-user-roles-and-permissions.md`.

| Value (DB) | Display Label | Description |
|---|---|---|
| `all` | All Locations | User can access data across all locations and their labs |
| `specific` | Specific Locations | User can only access data from their assigned locations (stored in `user_locations`) |

**Rules:**
- Admin users always have `all`.
- Focal Point and User roles can have either value.
- If `specific`, at least one `user_locations` entry is required.

---

## 12b. User Active Status

Used on `users.is_active`.

| Value | Display Label | Description |
|---|---|---|
| `true` | Active | User can log in and use the system |
| `false` | Inactive | User cannot log in. Historical data (transactions, approvals) remains intact. |

---

## 13. Item Categories

Seeded into `item_categories`. See `02-business-rules-and-scope.md`.

| Code | Name | Description | Display Order |
|---|---|---|---|
| `CHEM` | Chemical & Reagent | Laboratory chemicals, solvents, acids, bases, reagents | 1 |
| `GAS` | Gas | Laboratory gases (nitrogen, argon, etc.) | 2 |
| `MAT` | Material & Consumable | Lab consumables, filters, glassware, PPE | 3 |
| `STD` | Verify STD | Certified reference standards (USP, NIST, etc.) | 4 |

---

## 14. Checkout Purpose / Reason

Used in the checkout workflow (captured in `stock_transactions.metadata`). See `12-checkout-workflow.md`.

| Value | Display Label |
|---|---|
| `routine_testing` | Routine Testing |
| `sample_preparation` | Sample Preparation |
| `calibration` | Calibration |
| `research` | Research / Experiment |
| `quality_control` | Quality Control |
| `disposal` | Disposal |
| `other` | Other |

---

## 15. Label Print Methods

Used on `label_print_logs.print_method`.

| Value (DB) | Display Label | Description |
|---|---|---|
| `single` | Single | One label printed for one lot |
| `batch` | Batch | Multiple labels printed in a single session |

---

## 16. Purchase Request Item Revision Actions

Used on `purchase_request_item_revisions.action`. See `10-order-workflow.md`, Step 5a.

| Value (DB) | Display Label | Description |
|---|---|---|
| `modified` | Modified | An existing field was changed (before/after recorded) |
| `added` | Added | A new line item was added to the order |
| `removed` | Removed | An existing line item was removed |

---

## Reference Data Seeding Summary

The following reference tables must be seeded with initial data before the application can operate:

| Table | Seed Data | Notes |
|---|---|---|
| `roles` | admin, focal_point, user | Fixed set of 3 roles; changes require application update |
| `item_categories` | CHEM, GAS, MAT, STD | Rarely changed; Admin can add more |
| `locations` | AIE, MTP, CT, ATC | Based on current org structure |
| `labs` | Per-location labs (from stakeholder input) | 17 labs total. See `03-locations-and-labs-structure.md` |
| `vendors` | Chemex, Hach, 3M, Sigma-Aldrich, Alfa Aesar, Ametek Brookfield, Labscan, Loba, Labsupply, BIG, Linde, S&T, ThreeBond, TBS | From MaterialList and POnumber sheets |
| `regulations` | VoOrOrKo7, FACCHEM, Munition | From MaterialList Regulatory column |
| `po_number_mappings` | 25 pre-assigned PO number mappings | From POnumber sheet. See `10-order-workflow.md` |
| `users` | Initial admin account(s) | At least one admin user must be seeded with a bcrypt-hashed password so the system can be bootstrapped. Additional users are created via the admin UI. |

All other enum-like values (statuses, transaction types, source types, location scope types) are **application-defined constants** validated in the API layer, not separate database tables.

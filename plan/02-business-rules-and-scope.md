# 02 — Business Rules and Scope

## In Scope

The following capabilities are within the scope of this system:

### Ordering & Procurement
- Catalog browsing and item selection for orderable categories.
- Cart management: add, edit quantity, remove items before submission.
- Order submission by Lab Users.
- Multi-step approval workflow (Lab Manager / Focal Point → Admin if needed).
- Automated vendor notification email upon final approval.
- Order status tracking: Draft → Submitted → Approved → Ordered → Partially Received → Received → Cancelled.

### Inventory Management
- Check-in of received items (manual data entry or QR-code scan).
- Lot-level tracking: lot number, manufacture date, expiry date, received quantity, remaining quantity.
- Storage location assignment (Location → Lab → specific storage area if modeled).
- Checkout/consumption recording with quantity, user, and purpose.
- QR-code generation and scanning for fast check-in and checkout operations.
- Real-time inventory quantities per lot.

### Monitoring & Safety
- Peroxide-forming chemical classification and monitoring schedule.
- Peroxide test logging with pass/fail results and date tracking.
- Shelf-life extension workflow: document qualifying test, extend expiry, record justification.
- Expired item dashboard and alerts.
- Min-stock threshold dashboard and alerts.

### Compliance & Reporting
- Full transaction history: every movement (check-in, checkout, adjustment, disposal) is recorded.
- Regulatory reporting: exportable records filtered by date range, location, lab, category.
- Audit trail: who did what, when, and where.

### Access Control & Organization
- Role-based access control (RBAC) with four defined roles.
- Location → Lab hierarchical structure for permissions scoping and data filtering.
- Lab-specific inventory ownership (items belong to a specific lab at a specific location).

### Administration
- Master data management: chemicals, vendors, categories, units, locations, labs.
- User management: create, deactivate, assign roles and lab access.
- System configuration: min-stock thresholds, peroxide monitoring intervals, notification preferences.

---

## Out of Scope

The following are explicitly **not** included in this system:

| Item | Rationale |
|---|---|
| Public-facing storefront or e-commerce | This is an internal operational system |
| Payment processing or invoicing | Financial systems are handled separately |
| Vendor management portal | Vendors receive email notifications only; no system login |
| Chemical hazard classification (SDS management) | Separate SDS systems exist; may integrate later |
| Equipment/instrument management | Separate concern; not part of chemical inventory |
| Environmental monitoring (temperature, humidity) | Handled by dedicated lab environmental systems |
| Barcode printing hardware integration | QR generation is in scope; printer driver integration is not |
| Mobile native apps (iOS/Android) | Web-based responsive design covers mobile use cases |
| Multi-language / i18n support | Single-language (English) in MVP |
| Integration with ERP or SAP systems | May be considered post-MVP as a phase |

---

## High-Level Business Rules

### BR-01: Order Submission
- Only users with the **Lab User**, **Focal Point**, or **Admin** role may submit orders.
- An order must contain at least one line item.
- Each line item must reference a valid catalog item and include a requested quantity.
- Orders are scoped to a specific **Lab** at a specific **Location**.

### BR-02: Approval Workflow
- All submitted orders require approval by the **Focal Point / Lab Manager** assigned to the relevant lab.
- An approver cannot approve their own order.
- Approved orders transition to "Ordered" status, triggering vendor notification.
- Rejected orders return to the requester with a reason.
- Admin users may override approval in exceptional circumstances.

### BR-03: Vendor Notification
- Upon approval, the system generates and sends a notification email to the designated vendor contact(s).
- The email includes: order number, item list with quantities, requester lab/location, and any special instructions.
- The vendor does not log in; this is a one-way notification.

### BR-04: Check-In
- Received items are checked in against an approved/ordered purchase order.
- Check-in records: lot number, quantity received, manufacture date, expiry date, and storage location.
- Partial check-ins are supported (not all items on an order need to arrive at once).
- Manual check-in (form entry) and QR-scan-assisted check-in are both supported.
- A check-in without a linked order is allowed for certain scenarios (e.g., donations, transfers).

### BR-05: Checkout / Consumption
- Lab Users may check out inventory items assigned to their lab.
- Checkout records: item, lot, quantity withdrawn, user, date/time, and purpose/reason.
- Checkout reduces the lot's remaining quantity.
- A lot at zero quantity is marked as depleted.

### BR-06: Inventory Ownership
- Each inventory item (lot) **belongs to a specific lab at a specific location**.
- Users can only view/checkout inventory for labs they have access to.
- Focal Points can view all inventory within their lab(s).
- Admins can view all inventory across all locations and labs.

### BR-07: Min-Stock Thresholds
- Each catalog item may have a defined minimum stock threshold per lab.
- When the aggregated quantity falls below the threshold, a dashboard alert is raised.
- The system does not auto-order; it alerts the responsible users.

### BR-08: Expiry Tracking
- All lots with an expiry date are subject to expiry monitoring.
- The system surfaces items expiring within a configurable window (e.g., 30, 60, 90 days).
- Expired items are flagged and require action: extend shelf life, dispose, or quarantine.

### BR-09: Peroxide Monitoring
- Chemicals classified as peroxide-forming have a mandatory monitoring schedule.
- Each scheduled test must be logged with: test date, tester, result (pass/fail), and next test date.
- Overdue tests are surfaced on dashboards and may trigger notifications.
- Peroxide classification groups (e.g., Class A, B, C) may define different monitoring intervals.

### BR-10: Shelf-Life Extension
- Certain chemicals may have their shelf life extended after passing a qualifying test.
- The extension must record: original expiry, new expiry, test performed, tester, and justification.
- A shelf-life extension resets the expiry date for the specific lot, not the entire catalog item.

### BR-11: Transaction History
- Every inventory-affecting action creates a transaction record.
- Transaction types include: Check-In, Checkout, Adjustment, Disposal, Transfer, Shelf-Life Extension.
- Transaction records are immutable (append-only).
- Transaction history is filterable by date range, item, lot, lab, location, user, and type.

### BR-12: Regulatory Reporting
- The system must support generating reports suitable for regulatory audits.
- Reports include: inventory snapshots, transaction histories, peroxide test logs, and shelf-life extension records.
- Reports are exportable in structured formats (e.g., CSV, PDF).

---

## Approval Concept

```
Lab User submits order
        │
        ▼
Focal Point / Lab Manager reviews
        │
    ┌───┴───┐
    │       │
 Approve  Reject
    │       │
    ▼       ▼
Vendor    Returned to
email     requester
sent      with reason
```

- **Single-tier approval** is the default: Focal Point / Lab Manager approves or rejects.
- **Escalation** to Admin is available if the Focal Point is unavailable or for high-value orders (threshold TBD).
- **Self-approval** is not permitted; an independent approver is always required.

---

## Inventory Ownership Concept

Inventory is owned at the **Lab** level within a **Location**:

```
Location (e.g., AIE)
  └── Lab (e.g., PO Lab)
        └── Inventory Item (Lot #12345)
              ├── Chemical: Acetone
              ├── Lot: LOT-2025-001
              ├── Qty Remaining: 2.5 L
              ├── Expiry: 2026-06-15
              └── Storage: Cabinet A3
```

- Items are not shared across labs unless explicitly transferred.
- Each lot is tied to exactly one lab at one location.
- Reporting and dashboards respect this ownership hierarchy.

---

## Reminder / Notification Concept

The system generates reminders and notifications for:

| Trigger | Recipients | Channel |
|---|---|---|
| Order submitted for approval | Focal Point / Lab Manager | In-app, Email |
| Order approved | Requester (Lab User) | In-app, Email |
| Order rejected | Requester (Lab User) | In-app, Email |
| Item checked in | Requester / Focal Point | In-app |
| Min-stock threshold breached | Focal Point, Admin | In-app, Dashboard |
| Item approaching expiry | Focal Point, Lab User | In-app, Dashboard |
| Item expired | Focal Point, Admin | In-app, Dashboard, Email |
| Peroxide test overdue | Focal Point, Admin | In-app, Dashboard, Email |
| Shelf-life extension recorded | Admin, Auditor | In-app |

---

## Monitoring Concept

Monitoring covers two distinct domains:

### 1. Expiry Monitoring
- Applies to all lots with expiry dates.
- Configurable alert windows (e.g., 30/60/90 days before expiry).
- Dashboard widget surfaces items grouped by urgency.

### 2. Peroxide Monitoring
- Applies only to chemicals classified as peroxide-forming.
- Monitoring interval depends on classification group.
- Dashboard widget surfaces overdue and upcoming tests.
- Historical test results are retained for audit purposes.

---

## Assumptions Requiring Confirmation

| # | Assumption | Impact if Incorrect |
|---|---|---|
| A-01 | Approval is single-tier (Focal Point only); no additional management approval chain is required. | May need to add multi-tier approval workflow. |
| A-02 | Vendors are notified by email only; no integration with vendor portals or EDI systems. | Vendor integration would require significant additional scope. |
| A-03 | Each lab has exactly one Focal Point / Lab Manager assigned. | If multiple, the approval routing logic needs refinement. |
| A-04 | Chemical catalog is maintained internally; no external catalog feed. | External catalog integration would add complexity. |
| A-05 | QR codes are printed externally; the system generates QR data but does not control printers. | Printer integration would be out of scope. |
| A-06 | Peroxide classification groups and intervals are predefined and static. | If dynamic, additional admin UI is needed. |
| A-07 | Shelf-life extension is a manual decision by qualified personnel, not automated. | Automation would require additional rule engine logic. |
| A-08 | "Shared" labs within a location represent a communal space, not a cross-location pool. | Cross-location sharing would require transfer workflows. |
| A-09 | Financial data (cost, budget) is not tracked within this system. | If cost tracking is needed, the order model needs extension. |
| A-10 | Authentication is handled via enterprise SSO or directory service (e.g., Azure AD). | If custom auth is needed, the authentication module must be built from scratch. |
| A-11 | Gas and Material & Consumable categories have limited workflows in MVP (ordering only). | If full lifecycle tracking is needed for these categories, the scope significantly increases. |
| A-12 | The system operates in a single timezone. | Multi-timezone support would require datetime normalization logic. |

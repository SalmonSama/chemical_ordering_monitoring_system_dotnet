# 02 — Business Rules and Scope

## In Scope

The following capabilities are within the scope of this system:

### Ordering & Procurement
- Catalog browsing and item selection for orderable categories.
- Cart management: add, edit quantity, remove items before submission.
- Order submission by Lab Users.
- Multi-step approval workflow (Lab Manager / Focal Point → Admin if needed).
- Automated vendor notification email upon final approval.
- Order status tracking: Draft → In Cart → Pending Approval → Modified → Approved → Email Sent → Pending Delivery → Partially Received → Fully Received → Cancelled. (See `10-order-workflow.md` for full status definitions.)

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
- The Focal Point may **modify** an order before approving (adjust quantities, add/remove items). Modified orders transition to **Modified** status and the requester is notified of changes. The system records a change log with original and new values for each modified field.
- Approved orders transition to **Approved** status, triggering vendor email dispatch.
- After vendor emails are sent, the order moves to **Pending Delivery**.
- Rejected orders are set to **Cancelled** with a mandatory reason.
- Admin users may override approval in exceptional circumstances.

### BR-03: Vendor Notification
- Upon approval, the system **groups order line items by vendor** and sends one email per vendor.
- Each vendor email includes: PO number, item list with quantities and catalog numbers, units, requesting lab/location, contact information, and any special instructions.
- Each vendor receives **only their own items**; vendors cannot see items from other vendors in the same order.
- All vendor emails must succeed before the order transitions to **Pending Delivery**. Failed emails are retried up to 3 times with exponential backoff; persistent failures notify Admin.
- The vendor does not log in; this is a one-way notification.
- See `10-order-workflow.md`, Step 7 for detailed email content and retry logic.

### BR-04: Check-In
- Received items are checked in against an approved/ordered purchase order at the **line-item level**.
- Check-in records: lot number, quantity received, manufacture date, expiry date, and storage location.
- Partial check-ins are supported (not all items on an order need to arrive at once). A single line item can also be split into **multiple lot records** if the shipment contains different lot numbers.
- Manual check-in (form entry) and QR-scan-assisted check-in are both supported.
- A check-in without a linked order is allowed for certain scenarios (e.g., donations, transfers, Verify STD items).
- Successful check-in generates a QR code for each lot and supports label/QR printing.

### BR-05: Checkout / Consumption
- Lab Users may check out inventory items assigned to their lab.
- Checkout records: item, lot, quantity withdrawn, user, date/time, and purpose/reason.
- Checkout reduces the lot's remaining quantity.
- On first checkout of a lot, the system prompts whether this is the first time the container is being opened; if yes, `open_date` is recorded on the lot. This is important for peroxide monitoring schedules.
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
- Each monitoring event is **lot-based** and records: test date, tester, PPM result (numeric) or textual result, classification, observations, and next test due date.
- Results may be **numeric (ppm)** or **textual** (e.g., "Negative", "Positive"). For numeric results, the system auto-calculates classification; for textual results, the user manually selects the classification.
- Peroxide PPM thresholds define classification:
  - **< 25 ppm** → Normal — lot remains Active, schedule next monitoring.
  - **≥ 25 ppm and ≤ 100 ppm** → Warning — increased monitoring frequency (interval halved), notify Focal Point.
  - **> 100 ppm** → Quarantine — lot blocked from checkout, notify Focal Point and Admin, require disposal.
- Key dates tracked per lot: check-in date, open date, first inspect date, last monitor date, next monitor due.
- Overdue tests are surfaced on dashboards and trigger notifications.
- Peroxide classification groups (e.g., Class A, B, C) define different monitoring intervals.
- Quarantined lots follow a disposal path: Focal Point/Admin initiates disposal, logs `DISPOSAL` transaction, lot status → Disposed.
- See `13-peroxide-workflow.md` for the complete workflow and PPM logic.

### BR-10: Shelf-Life Extension
- Certain chemicals may have their shelf life extended after passing a qualifying test.
- The extension must record: original expiry, new expiry, test performed, tester, and justification.
- A shelf-life extension resets the expiry date for the specific lot, not the entire catalog item.

### BR-11: Transaction History
- Every important action in the system creates a transaction record — not just inventory-affecting actions.
- Transaction types include: `ADD_TO_CART`, `SUBMIT_ORDER`, `MODIFY_ORDER`, `APPROVE_ORDER`, `REJECT_ORDER`, `SEND_VENDOR_EMAIL`, `CANCEL_ORDER`, `CHECK_IN`, `MANUAL_CHECK_IN`, `CHECKOUT`, `PEROXIDE_TEST_LOGGED`, `LOT_QUARANTINED`, `EXTEND_SHELF_LIFE`, `ADJUSTMENT`, `DISPOSAL`, `TRANSFER`.
- Transaction records are immutable (append-only). No updates or deletes.
- Transaction history is filterable by date range, transaction type, item, lot, lab, location, user, and order/PO number.
- See `16-transaction-history-and-audit.md` for the complete transaction type catalog, JSONB metadata schemas, and audit features.

### BR-13: Cart Behavior
- Cart is **per-user, per-lab**. Users cannot share carts.
- Cart data is stored **server-side** in the database, persisting across sessions and devices.
- Adding an item already in the cart increments its quantity or prompts the user to update.
- If a catalog item is deactivated while in a cart, the system warns the user on cart review and prevents submission.
- Carts have no automatic expiration; users clear their carts manually.
- See `10-order-workflow.md`, Steps 2–3 for cart behavior details.

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
    ┌───┴────────┬──────────┐
    │            │          │
 Approve    Modify +     Reject
    │       Approve        │
    ▼          │           ▼
    └──────┬───┘        Cancelled
           ▼            (with reason)
    Vendor emails
    (grouped by vendor)
           │
           ▼
    Pending Delivery
```

- **Single-tier approval** is the default: Focal Point / Lab Manager approves, modifies, or rejects.
- The Focal Point can **modify** the order (adjust quantities, add/remove items) before approving. The requester is notified of changes.
- **Escalation** to Admin is available if the Focal Point is unavailable or for high-value orders (threshold TBD).
- **Self-approval** is not permitted; an independent approver is always required.
- See `10-order-workflow.md` for the complete step-by-step flow.

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
| A-13 | Peroxide PPM thresholds are fixed at < 25 (Normal), ≥ 25 (Warning), > 100 (Quarantine). | If thresholds vary by chemical or classification group, configurable threshold support is needed. |
| A-14 | Vendor emails are grouped by vendor from a single order; vendors cannot see items from other vendors in the same batch. | If vendors need to see the full order context, email templates must be adjusted. |
| A-15 | Cart is per-user, per-lab; users cannot share carts. | If shared/team carts are needed, the data model and UI must support multi-user carts. |

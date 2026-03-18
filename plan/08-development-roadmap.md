# 08 — Development Roadmap

## Phasing Strategy

Development is organized into **four phases**, ordered by business value, risk reduction, and technical dependency. Each phase builds upon the previous, ensuring that foundational capabilities are available before dependent modules are implemented.

---

## Phase 1: Foundation & Core Data (MVP Foundation)

**Goal:** Establish the database schema, authentication, authorization, and master data management so that all subsequent features have a solid operational foundation.

**Duration Estimate:** 3–4 weeks

### Deliverables

| # | Deliverable | Description |
|---|---|---|
| 1.1 | **Database schema** | Design and create all core tables: `locations`, `labs`, `users`, `user_lab_assignments`, `roles`, `categories`, `chemicals`, `vendors`, `units_of_measure` |
| 1.2 | **Authentication integration** | JWT-based auth with enterprise identity provider; login/logout flow in React |
| 1.3 | **Authorization middleware** | Role-based access control (RBAC) with (Location, Lab) scope enforcement in ASP.NET Core |
| 1.4 | **User management** | Admin UI to create users, assign roles, assign lab access, deactivate users |
| 1.5 | **Master data management** | Admin UI for managing locations, labs, chemicals catalog, vendors, categories, and units |
| 1.6 | **App shell and navigation** | React app with layout, sidebar, routing, role-based menu visibility |
| 1.7 | **Dashboard placeholder** | Basic dashboard page with role-aware empty state (widgets populated in later phases) |

### Dependencies
- None (this is the foundation).

### Risks
- SSO/IdP integration complexity may extend timeline.
- Master data volume (chemical catalog) may require bulk import tooling.

---

## Phase 2: Ordering & Approval Workflow (Core MVP)

**Goal:** Enable the primary ordering workflow end-to-end: catalog browsing, cart, order submission, approval, and vendor notification.

**Duration Estimate:** 3–4 weeks

### Deliverables

| # | Deliverable | Description |
|---|---|---|
| 2.1 | **Chemical catalog UI** | Browse, search, and filter catalog items; category-aware display |
| 2.2 | **Cart module** | Add to cart, edit quantities, remove items, per-user per-lab, persist across sessions. See `10-order-workflow.md`, Steps 2–3. |
| 2.3 | **Order submission** | Submit cart as order; validate, create order record, clear cart, notify Focal Point. See `10-order-workflow.md`, Step 4. |
| 2.4 | **Approval queue** | Focal Point / Admin view of pending orders; approve, modify, or reject with comments. See `10-order-workflow.md`, Steps 5–6. |
| 2.5 | **Focal Point order modification** | Allow Focal Point to adjust quantities, add/remove items before approving; notify requester of changes |
| 2.6 | **Self-approval prevention** | Enforce rule that requester cannot approve their own order |
| 2.7 | **Order status tracking** | Full status lifecycle: Draft → In Cart → Pending Approval → Modified → Approved → Email Sent → Pending Delivery → Partially Received → Fully Received → Cancelled |
| 2.8 | **Vendor email notification** | Group line items by vendor; send one email per vendor with PO number, items, quantities. See `10-order-workflow.md`, Step 7. |
| 2.9 | **Order history** | View past orders with status, filterable by lab, date, status |
| 2.10 | **Order status dashboard** | Full-table view with ~50 rows, scroll behavior, filters, status color coding. See `15-dashboard-behavior.md`. |
| 2.11 | **Dashboard: Pending Approvals** | Widget showing count/list of orders awaiting approval |
| 2.12 | **Dashboard: My Orders** | Widget showing the user's own order statuses |
| 2.13 | **Transaction logging (ordering)** | Log `ADD_TO_CART`, `SUBMIT_ORDER`, `MODIFY_ORDER`, `APPROVE_ORDER`, `REJECT_ORDER`, `SEND_VENDOR_EMAIL`, `CANCEL_ORDER` events. See `16-transaction-history-and-audit.md`. |

### Dependencies
- Phase 1 complete (users, roles, master data, auth).

### Risks
- Email delivery reliability (SMTP configuration, spam filtering).
- Category-driven ordering rules may introduce edge cases.

---

## Phase 3: Inventory Management (Core MVP)

**Goal:** Enable receiving, tracking, and consuming inventory at the lot level, completing the core operational loop.

**Duration Estimate:** 4–5 weeks

### Deliverables

| # | Deliverable | Description |
|---|---|---|
| 3.1 | **Check-in (against PO)** | Line-item-level check-in with lot number, quantity, expiry, storage location. See `11-checkin-workflow.md`, Flow 1. |
| 3.2 | **Manual check-in** | Register items without a PO (esp. Verify STD); source/reason required. See `11-checkin-workflow.md`, Flow 2. |
| 3.3 | **QR code generation** | Generate QR codes for each lot at check-in; support label printing |
| 3.4 | **Label / QR printing** | Print-friendly label view with QR code + lot details after check-in |
| 3.5 | **Inventory list view** | View inventory by lab, with filters for category, status, expiry |
| 3.6 | **Checkout (QR-scan primary)** | QR-scan to identify lot, enter quantity and purpose, update stock. See `12-checkout-workflow.md`. |
| 3.7 | **Manual checkout fallback** | Search-based checkout when QR scanning is unavailable |
| 3.8 | **Lot detail view** | View full lot history: check-in, checkouts, adjustments, current quantity |
| 3.9 | **Transaction history module** | Append-only log of all system actions (16 types); filterable, searchable, exportable. See `16-transaction-history-and-audit.md`. |
| 3.10 | **Min stock dashboard** | Full-table view with total qty, min stock, deficit, long lead time. See `15-dashboard-behavior.md`. |
| 3.11 | **Expired dashboard** | Full-table view with days-to-expiry, near-expire/expired conditions. See `15-dashboard-behavior.md`. |
| 3.12 | **Inventory adjustments** | Manual quantity corrections by Focal Point / Admin, with reason logging |

### Dependencies
- Phase 2 complete (orders exist to check-in against).
- Phase 1 complete (master data, locations/labs, roles).

### Risks
- QR code scanning reliability across different devices/browsers.
- Partial check-in edge cases when orders have many line items.

---

## Phase 4: Monitoring, Compliance & Reporting

**Goal:** Add safety monitoring, regulatory reporting, and advanced dashboard capabilities to complete the system.

**Duration Estimate:** 3–4 weeks

### Deliverables

| # | Deliverable | Description |
|---|---|---|
| 4.1 | **Peroxide list page** | Scrollable, filterable list of all peroxide-monitored lots with status indicators. See `13-peroxide-workflow.md`. |
| 4.2 | **Peroxide monitoring events** | Log multiple monitoring events per lot: test date, PPM result, classification (Normal/Warning/Quarantine). See `13-peroxide-workflow.md`. |
| 4.3 | **PPM threshold logic** | < 25 ppm = Normal, ≥ 25 ppm = Warning, > 100 ppm = Quarantine (block checkout, notify). |
| 4.4 | **Open date tracking** | Track when a container was first opened; anchor for monitoring schedules. |
| 4.5 | **Peroxide classification management** | Admin UI for managing classification groups and monitoring intervals |
| 4.6 | **Shelf-life extension module** | QR-scan entry, before/after values, immutable audit records. See `14-extend-shelf-life-workflow.md`. |
| 4.7 | **Peroxide due dashboard** | Full-table view: reminder, item, lot, monitor due in, monitor date, lab. See `15-dashboard-behavior.md`. |
| 4.8 | **Notification system** | In-app and email notifications for approvals, expiry alerts, peroxide alerts, low stock |
| 4.9 | **Regulatory reports** | Predefined report templates: inventory snapshot, transaction report, peroxide test report, shelf-life extension report |
| 4.10 | **Export functionality** | CSV and PDF export for all reports |
| 4.11 | **Expired items dashboard** | Dedicated full-table view for managing expired and quarantined items |
| 4.12 | **Viewer / Auditor experience** | Read-only views optimized for compliance review |

### Dependencies
- Phase 3 complete (inventory and lot tracking must exist before monitoring).
- Phase 1 complete (master data, roles).

### Risks
- Peroxide monitoring schedule complexity if classification groups vary significantly.
- Regulatory report formats may require stakeholder review iterations.

---

## MVP Recommendation

The **Minimum Viable Product (MVP)** consists of **Phases 1, 2, and 3**, delivering:

| Capability | Phase |
|---|---|
| Authentication and authorization | Phase 1 |
| Master data and user management | Phase 1 |
| Ordering, cart, and approval workflow | Phase 2 |
| Vendor email notifications | Phase 2 |
| Check-in (standard and manual) | Phase 3 |
| Checkout with lot tracking | Phase 3 |
| QR-based workflows | Phase 3 |
| Transaction history | Phase 3 |
| Min-stock and expiry dashboards | Phase 3 |

This MVP covers the **daily operational loop**: order → approve → receive → store → consume → track.

Phase 4 (monitoring, compliance, advanced reporting) is critical but can be deployed as a fast-follow release after the MVP stabilizes.

---

## What to Build First

**Strict build order within phases:**

### Phase 1 (sequential dependencies)
1. Database schema (must come first).
2. Authentication integration (needed for all API calls).
3. Authorization middleware (needed for all protected endpoints).
4. App shell + routing (needed for UI).
5. Master data management (catalog must exist before orders).
6. User management (users must exist before they can interact).
7. Dashboard placeholder.

### Phase 2 (after Phase 1)
1. Catalog UI (depends on master data).
2. Cart module (depends on catalog).
3. Order submission (depends on cart).
4. Approval queue (depends on orders).
5. Vendor email (depends on approval).
6. Order history + dashboard widgets.

### Phase 3 (after Phase 2)
1. Check-in against PO (depends on approved orders).
2. QR code generation (depends on check-in creating lots).
3. Inventory list view (depends on check-in data).
4. Checkout (depends on inventory existing).
5. Transaction history (depends on check-in and checkout).
6. Manual check-in + adjustments.
7. Dashboard widgets: low stock, expiring items.

---

## What Can Wait

| Feature | Phase | Rationale |
|---|---|---|
| Peroxide monitoring | Phase 4 | Important for compliance but not needed for day-to-day ordering/inventory |
| Shelf-life extension | Phase 4 | Infrequent operation; can be manual initially |
| Regulatory reporting | Phase 4 | Transaction history (Phase 3) provides raw data; formal reports can wait |
| Notification system | Phase 4 | Users can check dashboards manually; push notifications are enhancement |
| Gas full lifecycle tracking | Post-MVP | Ordering is in Phase 2; cylinder tracking deferred |
| Material & Consumable full lifecycle | Post-MVP | Ordering is in Phase 2; inventory tracking deferred |
| Bulk data import tools | Post-MVP | Manual entry for initial data load; import for large catalogs |
| Scheduled report generation | Post-MVP | Manual report generation is sufficient initially |
| Transfer between labs | Post-MVP | Rare scenario; can be handled as adjustment + check-in initially |

---

## Phase Dependencies Diagram

```
Phase 1: Foundation
    │
    ├──────────────────────┐
    ▼                      ▼
Phase 2: Ordering    (Phase 1 enables user mgmt,
    │                 master data, auth)
    ▼
Phase 3: Inventory
    │
    ▼
Phase 4: Monitoring & Compliance
```

All phases are strictly sequential. No phase can begin until its predecessor is complete and verified.

---

## Timeline Summary

| Phase | Scope | Estimated Duration | Cumulative |
|---|---|---|---|
| Phase 1 | Foundation & Core Data | 3–4 weeks | 3–4 weeks |
| Phase 2 | Ordering & Approval | 3–4 weeks | 6–8 weeks |
| Phase 3 | Inventory Management | 4–5 weeks | 10–13 weeks |
| Phase 4 | Monitoring & Compliance | 3–4 weeks | 13–17 weeks |
| **MVP (Phases 1–3)** | | **10–13 weeks** | |
| **Full System** | | **13–17 weeks** | |

> **Note:** Estimates assume a small development team (2–3 developers). Actual timelines depend on team size, experience, and stakeholder feedback cycles.

---

## Workflow Document References

The following workflow documents provide detailed step-by-step flows that inform implementation within each phase:

| Document | Primary Phase | Content |
|---|---|---|
| `10-order-workflow.md` | Phase 2 | Complete order flow: cart, submit, approval, modification, vendor email |
| `11-checkin-workflow.md` | Phase 3 | PO check-in and manual check-in flows with lot record creation |
| `12-checkout-workflow.md` | Phase 3 | QR-scan checkout, manual fallback, partial checkout |
| `13-peroxide-workflow.md` | Phase 4 | Peroxide list page, monitoring events, PPM thresholds |
| `14-extend-shelf-life-workflow.md` | Phase 4 | QR-scan entry, before/after audit, expiry update |
| `15-dashboard-behavior.md` | Phases 2–4 | Table specs, columns, filters, scroll behavior for all dashboards |
| `16-transaction-history-and-audit.md` | Phases 2–4 | Complete transaction type catalog, JSONB schemas, audit features |

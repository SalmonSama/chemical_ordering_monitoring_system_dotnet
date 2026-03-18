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
| 2.2 | **Cart module** | Add to cart, edit quantities, remove items, persist across sessions |
| 2.3 | **Order submission** | Submit cart as order; order scoped to a specific lab |
| 2.4 | **Approval queue** | Focal Point / Admin view of pending orders; approve/reject with comments |
| 2.5 | **Self-approval prevention** | Enforce rule that requester cannot approve their own order |
| 2.6 | **Order status tracking** | Full status lifecycle: Draft → Submitted → Approved → Ordered → Partially Received → Received → Cancelled |
| 2.7 | **Vendor email notification** | Auto-send structured email to vendor upon approval |
| 2.8 | **Order history** | View past orders with status, filterable by lab, date, status |
| 2.9 | **Dashboard: Pending Approvals** | Widget showing count/list of orders awaiting approval |
| 2.10 | **Dashboard: My Orders** | Widget showing the user's own order statuses |

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
| 3.1 | **Check-in (against PO)** | Receive items against an approved order; record lot number, quantity, expiry, storage location |
| 3.2 | **Manual check-in** | Register items without a purchase order (Focal Point / Admin) |
| 3.3 | **QR code generation** | Generate QR codes for each lot at check-in |
| 3.4 | **QR-based check-in** | Scan QR to pre-populate check-in form |
| 3.5 | **Inventory list view** | View inventory by lab, with filters for category, status, expiry |
| 3.6 | **Checkout** | Record item withdrawal with lot selection, quantity, purpose |
| 3.7 | **QR-based checkout** | Scan lot QR code to pre-populate checkout form |
| 3.8 | **Lot detail view** | View full lot history: check-in, checkouts, adjustments, current quantity |
| 3.9 | **Transaction history module** | Append-only log of all inventory movements; filterable and searchable |
| 3.10 | **Dashboard: Low Stock** | Widget alerting when items are below min-stock threshold |
| 3.11 | **Dashboard: Expiring Items** | Widget showing items approaching expiry (30/60/90 day windows) |
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
| 4.1 | **Peroxide monitoring module** | Schedule, log tests, track results, flag overdue |
| 4.2 | **Peroxide classification management** | Admin UI for managing classification groups and monitoring intervals |
| 4.3 | **Shelf-life extension module** | Document and approve shelf-life extensions per lot |
| 4.4 | **Dashboard: Peroxide Alerts** | Widget showing overdue and upcoming peroxide tests |
| 4.5 | **Notification system** | In-app and email notifications for approvals, expiry alerts, peroxide alerts, low stock |
| 4.6 | **Regulatory reports** | Predefined report templates: inventory snapshot, transaction report, peroxide test report, shelf-life extension report |
| 4.7 | **Export functionality** | CSV and PDF export for all reports |
| 4.8 | **Expired items dashboard** | Dedicated view for managing expired and quarantined items |
| 4.9 | **Viewer / Auditor experience** | Read-only views optimized for compliance review |

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

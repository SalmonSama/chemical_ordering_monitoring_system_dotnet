# 05 — System Architecture

> **Note:** This document describes the planned architecture at a conceptual level. No code, scaffolding, or infrastructure provisioning is included. Implementation details will be defined during the development phase.

## Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React.js | Single-page application (SPA) for all user interactions |
| **Backend** | ASP.NET Core Web API | RESTful API layer handling business logic, authorization, and data access |
| **Database** | PostgreSQL | Relational data storage for all system data |

---

## React.js Responsibilities (Frontend)

The React application is responsible for:

- **Rendering the UI** — All pages, dashboards, forms, tables, and modals. See `22-frontend-information-architecture.md` for page hierarchy and `23-page-and-route-planning.md` for 33 defined routes.
- **Client-side routing** — Navigation between modules via React Router. Route guards enforce auth, role, and lab access. See `23-page-and-route-planning.md`.
- **State management** — Server state via React Query (TanStack Query); global state via React Context (auth, lab context, theme). See `26-component-and-state-planning.md`.
- **API communication** — Sending HTTP requests to the ASP.NET Core backend and handling responses.
- **Authentication token handling** — Storing and attaching JWT/auth tokens to API requests.
- **UI-level permission gating** — Showing/hiding UI elements based on the user's role and scope (visual only; backend enforces). Role-based sidebar visibility defined in `22-frontend-information-architecture.md`.
- **QR code interactions** — Generating QR code images and integrating with device camera for scanning via the `QrScanPanel` component.
- **Client-side validation** — Input validation for forms before submission.
- **Responsive design** — Adapting the UI for desktop and tablet use within the lab environment. Breakpoints defined in `25-design-system-and-theme-planning.md`.
- **Theme management** — Light/dark dual-theme support with CSS custom properties. Default light; toggle via header. See `25-design-system-and-theme-planning.md`.
- **Dashboard rendering** — Summary cards, data tables, filter bars, and status badges. Design tokens and component specs in `25-design-system-and-theme-planning.md` and `26-component-and-state-planning.md`.
- **Export triggers** — Initiating CSV/PDF export requests to the backend via `ExportActions` component.

**The frontend does NOT:**
- Enforce authorization (backend is the authority).
- Access the database directly.
- Execute business logic (e.g., approval routing, stock calculations).

---

## ASP.NET Core Web API Responsibilities (Backend)

The backend API is responsible for:

- **RESTful API endpoints** — CRUD operations for all entities (orders, inventory, users, etc.).
- **Business logic** — Order workflow state machine, approval routing, stock threshold calculations, peroxide schedule management.
- **Authentication** — Validating JWT tokens from the enterprise identity provider.
- **Authorization** — Role-based access control (RBAC) enforcement on every request. Checking user role and (Location, Lab) assignments.
- **Data validation** — Server-side validation of all inputs, ensuring data integrity.
- **Data access** — Querying and mutating the PostgreSQL database via an ORM (e.g., Entity Framework Core or Dapper).
- **Email dispatch** — Sending vendor notification emails and internal notification emails (via SMTP or email service integration).
- **Report generation** — Producing CSV and PDF exports for regulatory and audit reports.
- **QR code payload management** — Generating and validating QR code data payloads.
- **Audit logging** — Recording all state-changing operations in the transaction history.
- **Notification management** — Creating and managing in-app notifications.

---

## PostgreSQL Responsibilities (Database)

The database is responsible for:

- **Data persistence** — All relational data: users, locations, labs, chemicals, orders, inventory lots, transactions, etc.
- **Referential integrity** — Foreign key constraints enforcing the Location → Lab hierarchy, lot → chemical relationships, etc.
- **Indexing** — Performance-critical indexes on frequently queried columns (e.g., lab_id, status, expiry_date).
- **Constraints** — Check constraints and unique constraints to enforce data rules at the database level.
- **Views / Functions** — Aggregated views or stored functions for complex queries (e.g., stock summaries, expiry dashboards).
- **Audit columns** — `created_at`, `updated_at`, `created_by`, `updated_by` on all tables.

**The database does NOT:**
- Handle business logic (logic lives in the API layer).
- Manage authentication or session state.
- Send notifications or emails.

---

## Database Design Overview

The database schema is organized into three conceptual layers. See `17-database-conceptual-model.md` for the full rationale.

### Layer 1: Master Data (Shared)

Organization-wide reference data that changes infrequently:

| Entity Group | Tables | Purpose |
|---|---|---|
| Organization | `locations`, `labs` | Physical hierarchy: Location → Lab |
| Identity & Access | `users`, `roles`, `user_labs` | Who can access what |
| Catalog | `items`, `item_categories`, `vendors` | What can be ordered or tracked |
| Compliance | `regulations`, `item_regulations` | Regulatory applicability (M:N) |
| Lab Configuration | `item_location_settings`, `item_lab_settings` | Per-lab min stock, stocked flags |

### Layer 2: Transactional Data (Lab-Scoped)

Operational data scoped to specific labs, growing continuously:

| Entity Group | Tables | Purpose |
|---|---|---|
| Procurement | `purchase_requests`, `purchase_request_items`, `purchase_request_item_revisions` | Ordering and approval lifecycle |
| Vendor Comms | `vendor_email_logs` | Email dispatch records |
| Inventory | `inventory_lots`, `stock_transactions` | Lot-level stock tracking |
| Safety Monitoring | `peroxide_tests`, `shelf_life_extensions` | Monitoring events and expiry management |
| Operations | `label_print_logs` | QR label printing audit |

### Layer 3: Reporting & Audit (Cross-Cutting)

| Entity Group | Tables | Purpose |
|---|---|---|
| Audit | `audit_logs` | System-wide master data change tracking |
| Reporting | Database views / functions | Aggregated dashboard queries |

### Key Design Decisions

- **Shared item master, lab-level inventory.** The `items` table is organization-wide; `inventory_lots` is scoped to labs. See `19-relationship-and-normalization-notes.md`.
- **Normalized min stock.** Min stock is in `item_lab_settings` (per item, per lab), not as spreadsheet-style columns on items. See `19-relationship-and-normalization-notes.md`, Section 3.
- **Behavior flags on items.** Category-driven behavior (`is_orderable`, `requires_checkin`, `tracks_expiry`, `requires_peroxide_monitoring`) is stored as explicit boolean flags, not inferred from category names.
- **UUID primary keys** for all tables.
- **Audit columns** (`created_at`, `updated_at`, `created_by`, `updated_by`) on all tables.

> **Full entity-field specification:** `18-entity-list-and-field-planning.md`
> **All statuses and enums:** `20-statuses-enums-and-reference-data.md`
> **Dashboard query patterns:** `21-reporting-and-dashboard-data-needs.md`

---

## Separation of Concerns

```
┌─────────────────────────────────────────────────────┐
│                   React.js (SPA)                    │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │   Pages  │  │  State   │  │   API Client      │  │
│  │ & Comps  │  │  Mgmt    │  │   (fetch/axios)   │  │
│  └──────────┘  └──────────┘  └───────────────────┘  │
│                                     │               │
└─────────────────────────────────────│───────────────┘
                                      │ HTTPS / JSON
                                      ▼
┌─────────────────────────────────────────────────────┐
│              ASP.NET Core Web API                   │
│                                                     │
│  ┌───────────┐  ┌─────────────┐  ┌──────────────┐  │
│  │ Controllers│  │  Services   │  │ Auth Middleware│ │
│  │ (Endpoints)│  │ (Biz Logic) │  │ (JWT + RBAC) │  │
│  └───────────┘  └─────────────┘  └──────────────┘  │
│                       │                             │
│  ┌───────────────────────────────────────────────┐  │
│  │        Data Access Layer (EF Core / Dapper)   │  │
│  └───────────────────────────────────────────────┘  │
│                       │                             │
└───────────────────────│─────────────────────────────┘
                        │ SQL / TCP
                        ▼
┌─────────────────────────────────────────────────────┐
│                  PostgreSQL                         │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │  Tables  │  │  Indexes │  │  Views / Funcs    │  │
│  └──────────┘  └──────────┘  └───────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## High-Level Request Flow

### Example: Lab User submits an order

```
1. User fills out order form in React UI
2. React sends POST /api/orders to the backend
3. ASP.NET Core middleware validates JWT token
4. Authorization middleware checks:
   a. User has "Lab User" or higher role
   b. User is assigned to the target lab
5. Controller delegates to OrderService
6. OrderService:
   a. Validates order data
   b. Creates order record with status "Pending Approval"
   c. Creates order line items
   d. Creates a notification for the Focal Point
   e. Logs the transaction
7. Database persists all records
8. API returns 201 Created with the order details
9. React updates the UI to show the submitted order
```

### Example: Focal Point approves an order

```
1. Focal Point views pending approvals in React UI
2. React sends PUT /api/orders/{id}/approve to the backend
3. Auth middleware validates JWT and checks Focal Point role
4. Authorization middleware checks:
   a. The order belongs to a lab the Focal Point manages
   b. The Focal Point is not the order requester (self-approval blocked)
5. ApprovalService:
   a. Transitions order status from "Pending Approval" to "Approved"
   b. Triggers vendor email notification
   c. Creates notification for the requester
   d. Logs the transaction
6. Database updates order record
7. Email service sends vendor notification
8. API returns 200 OK
9. React updates the UI
```

---

## Authentication and Authorization Concept

### Authentication

| Aspect | Approach |
|---|---|
| Method | JWT-based authentication |
| Identity Provider | Enterprise SSO (e.g., Azure AD, Okta, or similar) |
| Token Flow | Frontend redirects to IdP → user authenticates → IdP returns JWT → frontend stores token → attaches token to all API requests |
| Token Validation | Backend validates JWT signature, issuer, audience, and expiry on every request |

> **Open Question:** Which enterprise identity provider will be used? (See `09-open-questions.md`)

### Authorization

Authorization is enforced at **three levels**:

| Level | Mechanism | Description |
|---|---|---|
| **Role check** | Middleware attribute | Verifies the user has the required role for the endpoint (e.g., `[Authorize(Roles = "Admin, FocalPoint")]`) |
| **Scope check** | Custom authorization handler | Verifies the user's assigned (Location, Lab) pairs include the resource's location/lab |
| **Business rule check** | Service logic | Enforces rules like "cannot approve own order" or "cannot checkout from another lab's inventory" |

### Authorization Data Flow

```
Incoming Request
       │
       ▼
┌─────────────────┐
│ JWT Validation   │  → Is the token valid?
└───────┬─────────┘
        │ Yes
        ▼
┌─────────────────┐
│ Role Check       │  → Does the user's role permit this endpoint?
└───────┬─────────┘
        │ Yes
        ▼
┌─────────────────┐
│ Scope Check      │  → Is the resource within the user's (Location, Lab) scope?
└───────┬─────────┘
        │ Yes
        ▼
┌─────────────────┐
│ Business Rules   │  → Do business rules permit this action?
└───────┬─────────┘
        │ Yes
        ▼
   Execute Action
```

---

## Deployment Topology (Conceptual)

```
┌───────────────────┐     ┌───────────────────┐     ┌───────────────────┐
│   Web Server      │     │   API Server      │     │   DB Server       │
│   (React SPA)     │────▶│   (ASP.NET Core)  │────▶│   (PostgreSQL)    │
│                   │     │                   │     │                   │
│   Static files    │     │   Business logic  │     │   Data store      │
│   served via CDN  │     │   Auth middleware  │     │   Backups         │
│   or web server   │     │   Email service    │     │                   │
└───────────────────┘     └───────────────────┘     └───────────────────┘
```

> **Note:** Actual deployment infrastructure (cloud provider, containerization, CI/CD) is out of scope for this planning document and will be determined during infrastructure planning.

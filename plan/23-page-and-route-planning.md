# 23 — Page and Route Planning

This document defines every page/route in the application, its purpose, primary layout pattern, role access, and the data it consumes.

---

## Route Naming Convention

- All routes use kebab-case: `/orders/my-orders`
- Dynamic segments use `:id`: `/orders/:id`
- Nested routes are expressed as path segments: `/inventory/check-in/:purchaseRequestId`

---

## Route Table

### Dashboard

| Route | Page Title | Layout | Access | Description |
|---|---|---|---|---|
| `/` | Dashboard | Cards + Lists | All roles | Role-aware landing page with summary widgets. See `22-frontend-information-architecture.md`, `24-dashboard-ui-planning.md`. |

---

### Orders

| Route | Page Title | Layout | Access | Description |
|---|---|---|---|---|
| `/orders/catalog` | Catalog & Cart | Table + Cart Panel | Lab User, FP, Admin | Browse/search items, add to cart. Cart is a persistent side panel or drawer that shows current items. |
| `/orders/cart` | Review Cart | Form | Lab User, FP, Admin | Full cart review before submission. Edit quantities, remove items, add notes, submit order. |
| `/orders/my-orders` | My Orders | Table | All roles (scoped) | User's submitted orders with status. Lab Users see own orders; FP/Admin see lab-scoped orders. |
| `/orders/my-orders/:id` | Order Detail | Detail | All roles (scoped) | Full order detail: line items, status timeline, line-item statuses, revision history, email logs. |
| `/orders/approval-queue` | Approval Queue | Table | FP, Admin | Pending orders awaiting approval. Approve, modify, or reject actions. |
| `/orders/approval-queue/:id` | Review Order | Detail + Form | FP, Admin | Review a specific pending order. Modify quantities/items, add notes, approve or reject. |
| `/orders/status` | Order Status Dashboard | Table (full) | All roles (scoped) | Full-table view of all orders with filters. See `24-dashboard-ui-planning.md`. |

---

### Inventory

| Route | Page Title | Layout | Access | Description |
|---|---|---|---|---|
| `/inventory/check-in` | Check-In Hub | Tab layout | Lab User, FP, Admin | Two tabs: **Pending Delivery** (PO-based) and **Manual Check-In**. See `11-checkin-workflow.md`. |
| `/inventory/check-in/po/:purchaseRequestId` | PO Check-In | Multi-step form | Lab User, FP, Admin | Check in items against a specific PO. Step through line items, enter lot/qty/expiry, generate QR. |
| `/inventory/check-in/manual` | Manual Check-In | Form | FP, Admin | Register items without a PO. Enter item, lot, qty, expiry, source/reason. Verify STD with CoA fields. |
| `/inventory/checkout` | Checkout | QR Scan + Form | Lab User, FP, Admin | Primary flow: scan QR → lot identified → enter qty & purpose → confirm. Fallback: manual search. |
| `/inventory/stock` | Stock Overview | Table | All roles (scoped) | Current inventory grouped by item, showing total quantity per item per lab, with lot-level expansion. |
| `/inventory/lots/:id` | Lot Detail | Detail | All roles (scoped) | Full lot detail: quantities, dates, status, peroxide history, extension history, transaction history. |

---

### Monitoring

| Route | Page Title | Layout | Access | Description |
|---|---|---|---|---|
| `/monitoring/peroxide` | Peroxide List | Table | All roles (scoped) | All peroxide-monitored lots with status indicators, filters, and due dates. See `13-peroxide-workflow.md`. |
| `/monitoring/peroxide/:lotId/log` | Log Peroxide Test | Form | Lab User, FP, Admin | Record a peroxide test event: result type, PPM/text, classification, observations. |
| `/monitoring/peroxide/:lotId/history` | Peroxide History | Table + Detail | All roles (scoped) | Full test history for a specific lot. |
| `/monitoring/extend-shelf-life` | Extend Shelf Life | QR Scan + Form | FP, Admin | Primary flow: scan QR → lot identified → review current expiry → enter new expiry, test, justification → confirm. |
| `/monitoring/extend-shelf-life/:lotId` | Review Extension | Form | FP, Admin | Extension form for a specific lot (pre-populated from QR scan or manual selection). |
| `/monitoring/expired` | Expired Dashboard | Table (full) | All roles (scoped) | All expired and near-expiry lots with filters. See `24-dashboard-ui-planning.md`. |
| `/monitoring/min-stock` | Min Stock Dashboard | Table (full) | FP, Admin | Items below minimum thresholds. See `24-dashboard-ui-planning.md`. |
| `/monitoring/peroxide-due` | Peroxide Due Dashboard | Table (full) | All roles (scoped) | Peroxide monitoring schedule with due dates. See `24-dashboard-ui-planning.md`. |

---

### Reports & History

| Route | Page Title | Layout | Access | Description |
|---|---|---|---|---|
| `/reports/transactions` | Transaction History | Table | All roles (scoped) | Full transaction log with filters: date, type, item, lot, user, lab. Export CSV/PDF. |
| `/reports/transactions/:id` | Transaction Detail | Detail | All roles (scoped) | Full detail of a single transaction including metadata. |
| `/reports/regulatory` | Regulatory Reports | Cards + Forms | FP, Admin, Viewer | Report template selection: choose report type → set parameters → generate → download. |

---

### Admin (Master Data)

| Route | Page Title | Layout | Access | Description |
|---|---|---|---|---|
| `/admin/users` | User Management | Table + Modal | Admin | List, create, edit, deactivate users. Assign roles and lab access. |
| `/admin/users/:id` | User Detail | Detail + Form | Admin | View/edit a specific user's profile, role, and lab assignments. |
| `/admin/locations` | Locations & Labs | Tree + Table | Admin | Manage locations and their child labs. |
| `/admin/items` | Item Catalog | Table | Admin | Full item master list. Search, filter by category, create, edit, deactivate items. |
| `/admin/items/:id` | Item Detail | Detail + Form | Admin | View/edit item definition including all behavior flags. View linked lab settings. |
| `/admin/items/:id/lab-settings` | Item Lab Settings | Table + Inline Edit | Admin | Per-lab configuration (min stock, stocked flag) for a specific item. |
| `/admin/vendors` | Vendor Management | Table + Modal | Admin | List, create, edit, deactivate vendors. |
| `/admin/categories` | Category Management | Table + Modal | Admin | List, create, edit item categories. |
| `/admin/regulations` | Regulation Management | Table + Modal | Admin | Manage regulatory frameworks and item-regulation links. |

---

## Route Count Summary

| Section | Routes |
|---|---|
| Dashboard | 1 |
| Orders | 7 |
| Inventory | 6 |
| Monitoring | 8 |
| Reports & History | 3 |
| Admin | 8 |
| **Total** | **33** |

---

## Route Guards

| Guard | Logic | Redirect |
|---|---|---|
| **AuthGuard** | User must be authenticated (valid JWT) | → `/login` |
| **RoleGuard** | User's role must match the route's access requirement | → `/unauthorized` or redirect to Dashboard |
| **LabGuard** | User must have at least one active lab assignment | → `/no-lab-assigned` info page |

Guards are applied at the route level using React Router's `loader` or layout wrapper pattern.

---

## Special Pages (Outside Main Layout)

| Route | Page | Description |
|---|---|---|
| `/login` | Login | Redirects to enterprise SSO. No sidebar/header. |
| `/unauthorized` | Unauthorized | "You don't have access" message with contact admin link. |
| `/no-lab-assigned` | No Lab Assigned | Shown when authenticated user has no lab assignments. |

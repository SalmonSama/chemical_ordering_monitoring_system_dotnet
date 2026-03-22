# 04 — User Roles and Permissions

## Login Model

This system uses **admin-managed accounts**. There is no self-registration.

| Aspect | Details |
|---|---|
| **Account creation** | Admin creates all user accounts from the admin area |
| **Login page** | Email + password + "Forgot password" link only |
| **Self-registration** | Not supported. No public sign-up page. |
| **Password storage** | Passwords are stored as **bcrypt hashes**. Plain-text passwords are never stored. |
| **Forgot password (MVP)** | User submits their email. System shows a message: *"Please contact your system administrator to reset your password."* No email-based reset flow in MVP. |
| **Session management** | JWT token issued on successful login. Token stored in memory (or httpOnly cookie). Attached to all API requests. |

---

## Role Definitions

The system has three roles:

| Role | Description | Typical Users |
|---|---|---|
| **Admin** | Full system access. Creates and manages user accounts, master data, and system configuration. Has visibility across all locations and labs. Can add/edit/delete users, items, and PO numbers. Can reset passwords for any user. | IT administrators, system owners |
| **Focal Point** | Manages operations for one or more specific locations. Can edit items and PO numbers. Can check in, check out, approve orders, extend shelf life, and add **and correct** peroxide test results within their scope. | Lab managers, senior lab technicians |
| **User** | Day-to-day operational user. Can input item entries. Can check in, check out, and add peroxide test results within their assigned location(s). Cannot correct peroxide tests, approve orders, or extend shelf life. | Lab technicians, researchers |

> **Note:** The earlier "Viewer / Auditor" role has been removed from the core role set. If read-only audit access is needed in the future, it can be added as a fourth role. All existing references to "Viewer / Auditor" across other plan documents should be treated as deferred/removed from MVP scope.

---

## Location Access Scope

Each user has a **location scope type** that controls their data visibility:

| Scope Type | Value | Behavior |
|---|---|---|
| **All Locations** | `all` | User can view and operate across **all** locations and their labs. No `user_locations` rows needed. |
| **Specific Locations** | `specific` | User can only view and operate within their **assigned locations** (stored in `user_locations` table). Must have at least one assigned location. |

### Scope Rules

- **Admin** users always have `location_scope_type = 'all'` — this is enforced by the system and cannot be changed.
- **Focal Point** and **User** roles can be either `all` or `specific`.
  - A Focal Point with `all` scope can approve orders and manage operations at any location.
  - A User with `all` scope can check in/out and log peroxide tests at any location.
  - A Focal Point or User with `specific` scope is restricted to their assigned locations only.
- The location scope determines which **locations and their labs** the user can access. Lab-level access is derived from the location: if a user has access to location AIE, they can access all labs under AIE (PO Lab, EOU Lab, PG Lab, etc.).

### How Scope Affects the System

| Area | Behavior |
|---|---|
| **Dashboard** | Widgets show data only from accessible locations |
| **Catalog & ordering** | Same catalog for all; orders are placed for a specific lab within an accessible location |
| **Inventory views** | Stock overview, check-in, checkout filtered by accessible locations |
| **Peroxide monitoring** | Monitored lots filtered by accessible locations |
| **Transaction history** | Only shows transactions from accessible locations |
| **Reports** | Filtered by user's location scope |
| **Admin area** | Only visible to Admin role |

---

## Permission Matrix

### Legend

| Symbol | Meaning |
|---|---|
| ✅ | Full permission |
| 🔍 | View / Read only |
| ⚙️ | Within assigned location scope only |
| ❌ | No permission |

---

### Ordering & Cart

| Action | Admin | Focal Point | User |
|---|---|---|---|
| Browse catalog | ✅ | ✅ ⚙️ | ✅ ⚙️ |
| Add items to cart | ✅ | ✅ ⚙️ | ✅ ⚙️ |
| Edit own cart | ✅ | ✅ ⚙️ | ✅ ⚙️ |
| Submit order | ✅ | ✅ ⚙️ | ✅ ⚙️ |
| View own orders | ✅ | ✅ ⚙️ | ✅ ⚙️ |
| View all orders in scope | ✅ | ✅ ⚙️ | ❌ |
| Cancel own pending order | ✅ | ✅ ⚙️ | ✅ ⚙️ |

### Approval

| Action | Admin | Focal Point | User |
|---|---|---|---|
| View pending approvals | ✅ | ✅ ⚙️ | ❌ |
| Approve order | ✅ | ✅ ⚙️ | ❌ |
| Reject order | ✅ | ✅ ⚙️ | ❌ |
| Override approval (escalation) | ✅ | ❌ | ❌ |

> **Rule:** An approver cannot approve their own order. If a Focal Point submits an order, it must be approved by another authorized Focal Point or an Admin.

### Inventory & Check-In

| Action | Admin | Focal Point | User |
|---|---|---|---|
| View inventory (in scope) | ✅ | ✅ ⚙️ | ✅ ⚙️ |
| Check-in received items | ✅ | ✅ ⚙️ | ✅ ⚙️ |
| Manual check-in (no PO) | ✅ | ✅ ⚙️ | ❌ |
| Edit lot details | ✅ | ✅ ⚙️ | ❌ |
| Adjust inventory quantity | ✅ | ✅ ⚙️ | ❌ |
| Dispose / write-off lot | ✅ | ✅ ⚙️ | ❌ |

### Checkout

| Action | Admin | Focal Point | User |
|---|---|---|---|
| Checkout items (in scope) | ✅ | ✅ ⚙️ | ✅ ⚙️ |
| View checkout history | ✅ | ✅ ⚙️ | ✅ ⚙️ (own) |
| QR-scan checkout | ✅ | ✅ ⚙️ | ✅ ⚙️ |

### Peroxide Monitoring

| Action | Admin | Focal Point | User |
|---|---|---|---|
| View peroxide schedule | ✅ | ✅ ⚙️ | ✅ ⚙️ |
| Log peroxide test result | ✅ | ✅ ⚙️ | ✅ ⚙️ |
| Correct peroxide test result | ✅ | ✅ ⚙️ | ❌ |
| View test history | ✅ | ✅ ⚙️ | ✅ ⚙️ |
| Configure monitoring schedule | ✅ | ✅ ⚙️ | ❌ |

### Shelf-Life Extension

| Action | Admin | Focal Point | User |
|---|---|---|---|
| Request shelf-life extension | ✅ | ✅ ⚙️ | ❌ |
| View extension history | ✅ | ✅ ⚙️ | 🔍 ⚙️ |

### Transaction History

| Action | Admin | Focal Point | User |
|---|---|---|---|
| View transaction history (in scope) | ✅ | ✅ ⚙️ | ✅ ⚙️ (own) |
| Export transaction data | ✅ | ✅ ⚙️ | ❌ |

### Reporting & Regulatory

| Action | Admin | Focal Point | User |
|---|---|---|---|
| View dashboards (in scope) | ✅ | ✅ ⚙️ | ✅ ⚙️ |
| Generate regulatory reports | ✅ | ✅ ⚙️ | ❌ |
| Export reports (CSV/PDF) | ✅ | ✅ ⚙️ | ❌ |

### Master Data Management

| Action | Admin | Focal Point | User |
|---|---|---|---|
| Manage chemicals catalog | ✅ | ❌ | ❌ |
| Manage vendors | ✅ | ❌ | ❌ |
| Manage categories | ✅ | ❌ | ❌ |
| Manage units of measure | ✅ | ❌ | ❌ |
| Manage locations and labs | ✅ | ❌ | ❌ |
| View master data | ✅ | 🔍 | 🔍 |

### User & Account Management

| Action | Admin | Focal Point | User |
|---|---|---|---|
| Create user accounts | ✅ | ❌ | ❌ |
| Assign / change roles | ✅ | ❌ | ❌ |
| Assign / change location scope | ✅ | ❌ | ❌ |
| Reset password for any user | ✅ | ❌ | ❌ |
| Deactivate user accounts | ✅ | ❌ | ❌ |
| View user list | ✅ | ✅ ⚙️ | ❌ |
| Edit own profile (name) | ✅ | ✅ | ✅ |
| Change own password | ✅ | ✅ | ✅ |

---

## Admin Account Management Workflow

### Creating a User

1. Admin navigates to **Admin → Users → Create User**.
2. Admin enters: **email**, **full name**, **password**, **role**, **location scope type** (`all` or `specific`).
3. If `specific` scope: Admin selects one or more **locations** to assign.
4. System validates: email uniqueness, password strength, at least one location if `specific`.
5. System creates user record with `password_hash` (bcrypt), `is_active = true`.
6. The new user can now log in with their email and password.

### Editing a User

Admin can change the following at any time:
- **Role** — effective immediately.
- **Location scope type** — switching from `all` to `specific` requires assigning locations; switching from `specific` to `all` retains existing location rows but they become unused.
- **Location assignments** — add or remove specific locations.
- **Active/inactive status** — deactivated users cannot log in but their historical data remains intact.

### Resetting a Password

1. Admin navigates to the user's detail page.
2. Clicks "Reset Password."
3. Enters a new password (or system generates one).
4. System hashes the new password and updates the user record.
5. The user must use the new password on next login.

> **Note:** There is no self-service password reset in MVP. The forgot password page instructs users to contact their administrator. A future enhancement may add email-based reset links.

---

## Spreadsheet Privilege Mapping

The following privilege definitions come from the stakeholder spreadsheet (Database_Info_Draft, Location&Users sheet):

| Role | Spreadsheet Privileges |
|---|---|
| **Admin** | Maintain database [add/edit/delete] — users, items, PO number |
| **Focal Point** | Maintain database [edit] — items, PO number; Checkin/Checkout/Approve order/Extend shelf life/Add **and make correction for** peroxide test |
| **User** | Input entry [items]; Checkin/Checkout/Add peroxide test |

**Key distinction:** Focal Points can **correct** peroxide test results; Users can only **add** them.

---

## Known User Assignments (Seed Data Reference)

The spreadsheet provides an initial list of user-to-role-to-location assignments:

| Role | Location Scope | Users (Name) |
|---|---|---|
| Admin | All | Prapapan, Wataporn, Kunlaya |
| Focal Point | All | Kannarach |
| Focal Point | AIE | Wataporn, Natee, Panida, Nantawan |
| Focal Point | MTP | Thongchai |
| Focal Point | CT | Onwara |
| User | All | Kesinee, NattapornA, Suwichar |
| User | ATC | NattapornK, Soparat |
| User | CT | Onwara, NarinL |
| User | AIE | Jariya, Sriprai |
| User | MTP | Chonnipa, Wanna, Supawadee, Nannaphas, Sunisa, Sudarat, Saowaluck |

> **Note:** Some users appear in multiple roles/locations (e.g., Wataporn is both Admin and AIE Focal Point; Onwara is both CT Focal Point and CT User). The system should handle this: a single user record with the **highest** role assigned, plus location scope covering all their assignments.

---

## Scope Enforcement

All data access and mutations are enforced at the **API layer** via authorization middleware:

1. **Authentication** verifies the user's identity (JWT token issued on login with email/password).
2. **Authorization** checks:
   - The user's role.
   - The user's location scope (`all` or specific locations from `user_locations`).
   - The requested resource's location ownership.
3. **Row-level filtering** ensures queries only return data within the user's location scope.

The frontend respects the same permissions to show/hide UI elements, but the **backend is the source of truth** for access control. The frontend never decides access by itself.

---

## Role Assignment Rules

- Every user must have exactly **one role**.
- Admin users always have `location_scope_type = 'all'`.
- Focal Point and User roles may have `all` or `specific` location scope.
- If `location_scope_type = 'specific'`, the user must have at least one assigned location.
- Role changes are effective immediately and logged in the audit trail.
- Deactivated users cannot log in but their historical data (transactions, approvals) remains intact.
- When a user holds multiple roles in the spreadsheet (e.g., Onwara is CT Focal Point and CT User), the system assigns the **highest-privilege** role and grants location access accordingly.

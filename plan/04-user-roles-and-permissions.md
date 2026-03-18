# 04 — User Roles and Permissions

## Role Definitions

| Role | Description | Typical Users |
|---|---|---|
| **Admin** | Full system access. Manages users, master data, and system configuration. Has visibility across all locations and labs. | IT administrators, system owners |
| **Focal Point / Lab Manager** | Manages operations for one or more specific labs. Approves orders, monitors inventory, and ensures compliance within their scope. | Lab managers, senior lab technicians |
| **Lab User** | Day-to-day operational user. Creates orders, checks out chemicals, and performs routine tasks within their assigned lab(s). | Lab technicians, researchers |
| **Viewer / Auditor** | Read-only access for compliance review and audit purposes. Cannot create, modify, or approve any records. | Quality auditors, compliance officers, management |

---

## Lab / Location Access Scope

Each user is assigned to one or more **(Location, Lab)** pairs. This assignment defines their data visibility and action permissions.

| Role | Default Scope | Can Be Assigned Multiple Labs? |
|---|---|---|
| Admin | All locations, all labs (system-wide) | N/A — implicit full access |
| Focal Point / Lab Manager | Assigned lab(s) within assigned location(s) | Yes |
| Lab User | Assigned lab(s) within assigned location(s) | Yes (typically 1–2) |
| Viewer / Auditor | Assigned lab(s) or location(s) for review | Yes |

---

## Permission Matrix

### Legend

| Symbol | Meaning |
|---|---|
| ✅ | Full permission |
| 🔍 | View / Read only |
| ⚙️ | Within assigned scope only |
| ❌ | No permission |

---

### Ordering & Cart

| Action | Admin | Focal Point | Lab User | Viewer / Auditor |
|---|---|---|---|---|
| Browse catalog | ✅ | ✅ ⚙️ | ✅ ⚙️ | 🔍 ⚙️ |
| Add items to cart | ✅ | ✅ ⚙️ | ✅ ⚙️ | ❌ |
| Edit own cart | ✅ | ✅ ⚙️ | ✅ ⚙️ | ❌ |
| Submit order | ✅ | ✅ ⚙️ | ✅ ⚙️ | ❌ |
| View own orders | ✅ | ✅ ⚙️ | ✅ ⚙️ | 🔍 ⚙️ |
| View all orders in scope | ✅ | ✅ ⚙️ | ❌ | 🔍 ⚙️ |
| Cancel own pending order | ✅ | ✅ ⚙️ | ✅ ⚙️ | ❌ |

### Approval

| Action | Admin | Focal Point | Lab User | Viewer / Auditor |
|---|---|---|---|---|
| View pending approvals | ✅ | ✅ ⚙️ | ❌ | 🔍 ⚙️ |
| Approve order | ✅ | ✅ ⚙️ | ❌ | ❌ |
| Reject order | ✅ | ✅ ⚙️ | ❌ | ❌ |
| Override approval (escalation) | ✅ | ❌ | ❌ | ❌ |

> **Rule:** An approver cannot approve their own order. If a Focal Point submits an order, it must be approved by another authorized Focal Point or an Admin.

### Inventory & Check-In

| Action | Admin | Focal Point | Lab User | Viewer / Auditor |
|---|---|---|---|---|
| View inventory (in scope) | ✅ | ✅ ⚙️ | ✅ ⚙️ | 🔍 ⚙️ |
| Check-in received items | ✅ | ✅ ⚙️ | ✅ ⚙️ | ❌ |
| Manual check-in (no PO) | ✅ | ✅ ⚙️ | ❌ | ❌ |
| Edit lot details | ✅ | ✅ ⚙️ | ❌ | ❌ |
| Adjust inventory quantity | ✅ | ✅ ⚙️ | ❌ | ❌ |
| Dispose / write-off lot | ✅ | ✅ ⚙️ | ❌ | ❌ |

### Checkout

| Action | Admin | Focal Point | Lab User | Viewer / Auditor |
|---|---|---|---|---|
| Checkout items (in scope) | ✅ | ✅ ⚙️ | ✅ ⚙️ | ❌ |
| View checkout history | ✅ | ✅ ⚙️ | ✅ ⚙️ (own) | 🔍 ⚙️ |
| QR-scan checkout | ✅ | ✅ ⚙️ | ✅ ⚙️ | ❌ |

### Peroxide Monitoring

| Action | Admin | Focal Point | Lab User | Viewer / Auditor |
|---|---|---|---|---|
| View peroxide schedule | ✅ | ✅ ⚙️ | ✅ ⚙️ | 🔍 ⚙️ |
| Log peroxide test result | ✅ | ✅ ⚙️ | ✅ ⚙️ | ❌ |
| View test history | ✅ | ✅ ⚙️ | ✅ ⚙️ | 🔍 ⚙️ |
| Configure monitoring schedule | ✅ | ✅ ⚙️ | ❌ | ❌ |

### Shelf-Life Extension

| Action | Admin | Focal Point | Lab User | Viewer / Auditor |
|---|---|---|---|---|
| Request shelf-life extension | ✅ | ✅ ⚙️ | ❌ | ❌ |
| View extension history | ✅ | ✅ ⚙️ | 🔍 ⚙️ | 🔍 ⚙️ |

### Transaction History

| Action | Admin | Focal Point | Lab User | Viewer / Auditor |
|---|---|---|---|---|
| View transaction history (in scope) | ✅ | ✅ ⚙️ | ✅ ⚙️ (own) | 🔍 ⚙️ |
| Export transaction data | ✅ | ✅ ⚙️ | ❌ | 🔍 ⚙️ |

### Reporting & Regulatory

| Action | Admin | Focal Point | Lab User | Viewer / Auditor |
|---|---|---|---|---|
| View dashboards (in scope) | ✅ | ✅ ⚙️ | ✅ ⚙️ | 🔍 ⚙️ |
| Generate regulatory reports | ✅ | ✅ ⚙️ | ❌ | 🔍 ⚙️ |
| Export reports (CSV/PDF) | ✅ | ✅ ⚙️ | ❌ | 🔍 ⚙️ |

### Master Data Management

| Action | Admin | Focal Point | Lab User | Viewer / Auditor |
|---|---|---|---|---|
| Manage chemicals catalog | ✅ | ❌ | ❌ | ❌ |
| Manage vendors | ✅ | ❌ | ❌ | ❌ |
| Manage categories | ✅ | ❌ | ❌ | ❌ |
| Manage units of measure | ✅ | ❌ | ❌ | ❌ |
| Manage locations and labs | ✅ | ❌ | ❌ | ❌ |
| View master data | ✅ | 🔍 | 🔍 | 🔍 |

### User & Admin Management

| Action | Admin | Focal Point | Lab User | Viewer / Auditor |
|---|---|---|---|---|
| Create user accounts | ✅ | ❌ | ❌ | ❌ |
| Assign roles | ✅ | ❌ | ❌ | ❌ |
| Assign lab access | ✅ | ❌ | ❌ | ❌ |
| Deactivate user accounts | ✅ | ❌ | ❌ | ❌ |
| View user list | ✅ | ✅ ⚙️ | ❌ | 🔍 |
| Edit own profile | ✅ | ✅ | ✅ | ✅ |

---

## Scope Enforcement

All data access and mutations are enforced at the **API layer** via authorization middleware:

1. **Authentication** verifies the user's identity (JWT token from SSO/enterprise auth).
2. **Authorization** checks:
   - The user's role.
   - The user's assigned (Location, Lab) pairs.
   - The requested resource's (Location, Lab) ownership.
3. **Row-level filtering** ensures queries only return data within the user's scope.

The frontend respects the same permissions to show/hide UI elements, but the **backend is the source of truth** for access control.

---

## Role Assignment Rules

- Every user must have exactly **one role**.
- Every non-Admin user must be assigned to at least **one lab**.
- Admin users implicitly have access to all locations and labs.
- A Focal Point may be assigned to multiple labs within one or more locations.
- Role changes are effective immediately and logged in the audit trail.
- Deactivated users cannot log in but their historical data (transactions, approvals) remains intact.

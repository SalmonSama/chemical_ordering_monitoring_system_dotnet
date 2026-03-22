# 06 — Module Breakdown

This document describes the purpose, scope, and key capabilities of each major module in the system. Modules are organized by functional area and grouped to reflect their dependencies.

---

## 1. Dashboard Module

**Purpose:** Provide role-specific, at-a-glance operational visibility across all critical system functions.

**Key Capabilities:**
- Display actionable summary widgets based on the user's role and lab/location scope.
- Widgets include:
  - **Pending Approvals** — Count and list of orders awaiting the current user's approval (Focal Point / Admin).
  - **My Orders** — Status of the current user's submitted orders (User).
  - **Low Stock Alerts** — Items below minimum stock thresholds in the user's lab(s).
  - **Expiring Items** — Items approaching or past expiry date, grouped by urgency (30/60/90 days).
  - **Overdue Peroxide Tests** — Peroxide-forming chemicals with overdue monitoring.
  - **Recent Activity** — Latest check-ins, checkouts, and order activity.
- Support drill-down from widgets to detailed module views ("View All →" pattern).
- Respect the (Location, Lab) scope of the current user for all displayed data.
- Refresh data on page load; optionally support periodic auto-refresh.

> **See also:** `15-dashboard-behavior.md` for detailed table specifications, columns, filters, color coding, and scroll behavior.
> **Frontend UI:** `24-dashboard-ui-planning.md` for dashboard card grid, filter bar, column specs, and export configuration.
> **Route:** Dashboard home (`/`). See `23-page-and-route-planning.md`.
> **Component:** `DashboardCard`, `StatusBadge`, `DataTable`, `FilterBar`. See `26-component-and-state-planning.md`.

**User Access:** All roles (data filtered by scope).

---

## 2. Order Module

**Purpose:** Enable Users and Focal Points to request chemicals and materials from approved vendors through a structured ordering process.

**Key Capabilities:**
- Browse the chemical/material catalog, filtered by category, vendor, and availability.
- Search items by name, CAS number, catalog number, or vendor.
- View item details: description, unit, packaging, vendor, category, and current stock level.
- Initiate an order by selecting a target lab, adding items, and specifying quantities.
- Support category-specific ordering rules:
  - **Chemical & Reagent:** Full ordering workflow.
  - **Gas:** Ordering supported in MVP; limited to order submission.
  - **Material & Consumable:** Ordering supported for specified items in MVP.
  - **Verify STD:** No ordering — items are received directly.
- Track order status: Draft → In Cart → Pending Approval → Modified → Approved → Email Sent → Pending Delivery → Partially Received → Fully Received → Cancelled.
- Allow the requester to cancel a pending (not yet approved) order.

> **See also:** `10-order-workflow.md` for full step-by-step workflow, modification rules, and vendor email grouping.

**User Access:** User, Focal Point, Admin (within scope).

---

## 3. Cart Module

**Purpose:** Allow users to collect and review items before submitting an order.

**Key Capabilities:**
- Maintain a per-user, per-lab cart of selected items and quantities.
- Allow users to:
  - Add items from the catalog.
  - Adjust quantities.
  - Remove items.
  - Add notes or special instructions per line item or per order.
- Validate cart contents before submission (e.g., at least one item, valid quantities).
- Submit the cart as an order, which transitions the order to **Pending Approval** status and routes it for approval.
- Cart persists across sessions (server-side storage) until submitted or cleared.

> **See also:** `10-order-workflow.md`, Steps 2–4 for cart behavior and submission rules.

**User Access:** User, Focal Point, Admin (within scope).

---

## 4. Approval Module

**Purpose:** Route submitted orders to authorized approvers and enable accept/reject decisions with feedback.

**Key Capabilities:**
- Display a queue of orders in **Pending Approval** status, scoped to the current user's assigned lab(s).
- Show order details: requester, lab, items, quantities, notes, and submission date.
- Allow approvers to:
  - **Approve** — Moves the order to **Approved** status, triggering vendor notification.
  - **Modify then Approve** — Focal Point can adjust quantities, add/remove items, then approve. Order transitions through **Modified** → **Approved**.
  - **Reject** — Sets the order to **Cancelled** with a mandatory rejection reason.
- Enforce self-approval prevention: a user cannot approve an order they submitted.
- Admin can override approval for escalation scenarios.
- Maintain an approval history log: who approved/rejected/modified, when, and with what comments.

> **See also:** `10-order-workflow.md`, Steps 5–6 for approval and modification details.

**User Access:** Focal Point, Admin.

---

## 5. Vendor Email Module

**Purpose:** Automatically notify vendors when an order is approved, providing them with the information needed to fulfill the order.

**Key Capabilities:**
- Triggered automatically upon order approval.
- **Group line items by vendor** — if an order contains items from multiple vendors, one email is sent per vendor.
- Each vendor email contains: PO number, item name, catalog number, quantity, unit, requesting lab/location, contact information, and any notes.
- Send to the vendor contact email address defined in the vendor master data.
- Log email dispatch status (sent, failed) per vendor against the order record.
- Support retry for failed email dispatches.
- All vendor emails must succeed before order transitions to **Pending Delivery**.
- Configurable email templates per vendor or as a system-wide default.

> **See also:** `10-order-workflow.md`, Step 7 for vendor email content specification.

**User Access:** System-triggered (no direct user interaction); Admin can view email logs.

---

## 6. Check-In Module

**Purpose:** Record received items into inventory, associating them with lots and storage locations.

**Key Capabilities:**

### Standard Check-In (against a Purchase Order)
- Select an approved/ordered purchase order.
- Check-in is done at the **line-item level** — each line item is checked in individually.
- For each line item, record:
  - Quantity received.
  - Lot number.
  - Manufacture date (if available).
  - Expiry date.
  - Storage location (lab, shelf/cabinet).
- Support partial check-ins (not all items received at once).
- A single line item can be split into **multiple lots** if the shipment contains different lot numbers.
- Update order line-item status (**Pending** → **Partially Received** → **Fully Received**) and order-level status.
- Generate a QR code for each new lot upon check-in.
- Support label/QR printing immediately after check-in (single or batch).

### Manual Check-In (no Purchase Order)
- Register items received outside the ordering process (donations, transfers, direct deliveries).
- Especially relevant for **Verify STD** items that are never ordered through the system. Additional fields for Verify STD: Certificate of Analysis #, Assigned Value, Uncertainty, Certifying Body.
- Requires Focal Point or Admin role.
- Same lot-level data capture as standard check-in, plus a source/reason field.
- Creates an inventory record without a linked purchase order.

### QR-Based Check-In
- Scan a QR code on a received item to pre-populate check-in fields.
- Suitable for items with vendor-supplied or internally generated QR/barcodes.

> **See also:** `11-checkin-workflow.md` for detailed step-by-step flows, lot record structure, QR data payload specification, and edge cases.

**User Access:** User, Focal Point, Admin (standard). Focal Point, Admin (manual).

---

## 7. Checkout Module

**Purpose:** Record consumption or withdrawal of inventory items, reducing lot quantities and maintaining traceability.

**Key Capabilities:**
- Select an item and lot from the user's lab inventory.
- Record:
  - Quantity checked out.
  - Purpose / reason for use.
  - Date and time.
- On first checkout of a lot, prompt whether the container is being opened for the first time; if yes, record `open_date` on the lot.
- Validate that sufficient quantity remains in the lot.
- Update lot remaining quantity.
- Mark lots as depleted when quantity reaches zero.
- Support QR-scan checkout as the **primary** interaction model: scan a lot's QR code to identify the lot and pre-populate the checkout form.
- Manual fallback: search by item name, catalog number, or lot number.
- Create a transaction record for every checkout operation **in the same database transaction** as the stock update.
- Use **optimistic concurrency control** (version column) to prevent over-withdrawal from concurrent checkouts.

> **See also:** `12-checkout-workflow.md` for QR-scan flow, open-date prompt, partial checkout, and concurrency handling.

**User Access:** User, Focal Point, Admin (within scope).

---

## 8. Peroxide Monitoring Module

**Purpose:** Track and manage the mandatory monitoring schedule for peroxide-forming chemicals to ensure safety compliance.

**Key Capabilities:**
- Maintain a list of chemicals classified as peroxide-forming, with their classification group (e.g., Class A, B, C).
- Define monitoring intervals per classification group. Warning results halve the interval.
- Display a **peroxide list page** showing all monitored lots with status indicators, searchable and filterable (including by classification group).
- Support **multiple monitoring events per lot** over the lot's lifetime.
- Track key dates per lot: check-in date, open date, first inspect date, last monitor date, next monitor due.
- Log monitoring events with: test date, tester, result type (numeric or textual), PPM result or text result, classification (auto-calculated for numeric; user-selected for textual), observations/notes.
- PPM-based classification thresholds:
  - **< 25 ppm** → Normal.
  - **≥ 25 ppm and ≤ 100 ppm** → Warning — increased monitoring frequency (halved interval).
  - **> 100 ppm** → Quarantine — block checkout, notify Focal Point and Admin.
- Quarantined lots follow a disposal path: Focal Point/Admin initiates disposal from the lot detail page.
- Maintain full test history per lot for audit purposes.

> **See also:** `13-peroxide-workflow.md` for the complete workflow, PPM thresholds, textual result handling, classification groups, disposal path, and monitoring event data model.

**User Access:** User (log results), Focal Point (configure schedule, log results), Admin (full access).

---

## 9. Extend Shelf Life Module

**Purpose:** Document and manage the controlled extension of chemical shelf life based on qualifying tests and professional judgment.

**Key Capabilities:**
- Initiate a shelf-life extension for a specific lot.
- Record:
  - Original expiry date.
  - New (extended) expiry date.
  - Test performed to justify extension.
  - Test result.
  - Justification / comments.
  - Person authorizing the extension.
- Update the lot's expiry date in the inventory.
- If the lot was in **Expired** status, transition it back to **Active**.
- Maintain a complete extension history per lot with sequential extension numbers.
- Apply only to individual lots, not to the entire catalog item.
- Extensions are logged as a distinct transaction type (`EXTEND_SHELF_LIFE`) for audit trail.
- Preserve **before/after** values: old expiry, new expiry, days-to-expiry comparison.
- Track **extension count** per lot (how many times extended), visible on the lot detail page.
- Entry point is via **QR scan** of the lot (primary) or manual search (fallback).

> **See also:** `14-extend-shelf-life-workflow.md` for the complete workflow, extension numbering, and audit requirements.

**User Access:** Focal Point, Admin.

---

## 10. Transaction History Module

**Purpose:** Provide a complete, immutable audit trail of every inventory-affecting action.

**Key Capabilities:**
- Record **all important actions** (not just inventory movements) with the following 16 transaction types:
  - `ADD_TO_CART` — Item added to cart.
  - `SUBMIT_ORDER` — Order submitted for approval.
  - `MODIFY_ORDER` — Order modified by Focal Point.
  - `APPROVE_ORDER` — Order approved.
  - `REJECT_ORDER` — Order rejected.
  - `SEND_VENDOR_EMAIL` — Vendor notification email sent.
  - `CANCEL_ORDER` — Order cancelled.
  - `CHECK_IN` — Items checked in against a purchase order.
  - `MANUAL_CHECK_IN` — Items checked in without a purchase order.
  - `CHECKOUT` — Items withdrawn from inventory.
  - `PEROXIDE_TEST_LOGGED` — Peroxide monitoring event recorded.
  - `LOT_QUARANTINED` — Lot quarantined due to high peroxide levels.
  - `EXTEND_SHELF_LIFE` — Shelf life extended for a lot.
  - `ADJUSTMENT` — Manual quantity correction.
  - `DISPOSAL` — Lot disposed.
  - `TRANSFER` — Lot transferred between labs (future).
- Each record includes: transaction type, item, lot, quantity, user, date/time, lab, location, notes, and type-specific metadata (JSONB).
- Filter and search by: date range, transaction type, item, lot, user, lab, location, PO number.
- Export to CSV and PDF for external analysis and audit.
- Records are append-only; transactions cannot be edited or deleted.

> **See also:** `16-transaction-history-and-audit.md` for the complete catalog of transaction types, JSONB metadata schemas, and audit features.

**User Access:** Admin, Focal Point (full scope). User (own transactions).

---

## 11. Regulatory / Reporting Module

**Purpose:** Support compliance and audit requirements by providing structured, exportable reports.

**Key Capabilities:**
- Predefined report templates:
  - **Inventory Snapshot** — Current inventory by location/lab/category as of a given date.
  - **Transaction Report** — All transactions within a date range, filterable by all dimensions.
  - **Peroxide Test Report** — Peroxide monitoring results for a given period.
  - **Shelf-Life Extension Report** — All extensions logged within a period.
  - **Expired Items Report** — Items currently expired or expiring within a window.
  - **Order History Report** — Orders by status, date range, requester, and lab.
- Export formats: CSV, PDF.
- Reports respect the user's (Location, Lab) scope.
- Date range selection for all time-based reports.
- Optionally schedule periodic report generation (post-MVP).

**User Access:** Admin, Focal Point.

> **Data requirements:** See `21-reporting-and-dashboard-data-needs.md` for the exact query patterns, calculations, index strategy, and suggested database views behind each report.

---

## 12. Master Data Module

**Purpose:** Manage the reference data that underpins all system operations.

**Key Capabilities:**
- **Chemical / Item Catalog** — Create, edit, deactivate chemicals and materials. Fields include: name, short name, CAS number, part number, category, default vendor, unit, size, description, storage conditions, and all behavior flags (`is_orderable`, `requires_checkin`, `allows_checkout`, `tracks_expiry`, `requires_peroxide_monitoring`, `is_regulatory_related`, `peroxide_class`). See `18-entity-list-and-field-planning.md`, entity 8.
- **Behavior Flag Management** — Set category-based defaults for behavior flags; override per item as needed. Flags make category-driven behavior explicit and queryable.
- **Vendors** — Manage vendor records: name, contact email, phone, address, notes.
- **Categories** — Define and manage item categories (Chemical & Reagent, Verify STD, Gas, Material & Consumable). Categories drive default behavior flag values.
- **Regulations** — Define regulatory frameworks and link items to applicable regulations (M:N via `item_regulations`). See `18-entity-list-and-field-planning.md`, entities 11–12.
- **Locations** — Create, edit, deactivate locations (AIE, MTP, CT, ATC).
- **Labs** — Create, edit, deactivate labs within locations. Each lab is linked to a parent location.
- **Peroxide Classification Groups** — Define groups (Class A, B, C) with monitoring intervals.
- **Min-Stock Thresholds** — Set per-item, per-lab minimum stock levels via `item_lab_settings` (normalized, not spreadsheet columns). See `19-relationship-and-normalization-notes.md`, Section 3.
- **Item Location Settings** — Configure which items are stocked at each location via `item_location_settings`.

> **Database entities:** `items`, `item_categories`, `vendors`, `regulations`, `item_regulations`, `item_location_settings`, `item_lab_settings`, `locations`, `labs`. See `18-entity-list-and-field-planning.md`.

**User Access:** Admin only (full CRUD). Focal Point and others (read-only where applicable).

---

## 13. Authentication & User Management Module

**Purpose:** Provide admin-managed user accounts, login/logout, password management, role assignment, and location scope control.

This module has five sub-modules:

### 13a. Authentication Sub-Module

**Purpose:** Handle login, logout, and session management.

**Key Capabilities:**
- **Login page** — Standalone page (no sidebar/header) with email and password fields, plus a "Forgot Password" link.
- **Credential validation** — Backend validates email + bcrypt-hashed password; issues a JWT token on success.
- **Session management** — JWT token stored in memory (or httpOnly cookie) and attached to all API requests.
- **Logout** — Clear token and redirect to login page.
- **No self-registration** — There is no public sign-up page. All accounts are created by Admin.

**Dependencies:** Users and Roles must exist (from master data seeding).

### 13b. User Management Sub-Module

**Purpose:** Allow Admin to create, edit, and deactivate user accounts.

**Key Capabilities:**
- **Create user** — Admin enters email, full name, password, role, and location scope type.
- **Edit user** — Admin can change role, location scope, active/inactive status, and full name.
- **Reset password** — Admin sets a new password for any user.
- **Deactivate user** — Soft-deactivate; user cannot log in but historical data remains.
- **User directory** — Searchable, filterable list of all users with role and location scope.
- **User detail page** — View and edit a user's profile, role, location scope, and location assignments.

**User Access:** Admin only (full management). Focal Point (view users within their scope). Users (own profile, change own password).

### 13c. Role Management Sub-Module

**Purpose:** Define and assign the three system roles (Admin, Focal Point, User).

**Key Capabilities:**
- **Role assignment** — Admin assigns one role to each user.
- **Role display** — Role-based indicators throughout the UI (badges, filters).
- **Role change** — Effective immediately; logged in audit trail.

> **Note:** Roles are fixed reference data (seeded). There is no UI for creating new roles. The three roles cover all use cases.

### 13d. Location Scope Management Sub-Module

**Purpose:** Configure each user's data visibility scope.

**Key Capabilities:**
- **Scope type selector** — Admin selects `All Locations` or `Specific Locations` for each user.
- **Location assignment** — If `Specific`, Admin selects one or more locations (AIE, MTP, CT, ATC) to grant access.
- **Scope enforcement** — The backend filters all data queries by the user's location scope. The frontend hides out-of-scope navigation but backend is the authority.
- **Admin constraint** — Admin users always have `All Locations` scope (system-enforced).

### 13e. Forgot Password Sub-Module

**Purpose:** Handle password recovery requests.

**MVP Approach (contact admin):**
- User clicks "Forgot Password" on the login page.
- A standalone page is shown with a message: *"Please contact your system administrator to reset your password."*
- Optionally displays an admin contact email or link.
- No automated email-based reset flow in MVP.

**Future Enhancement:** Email-based password reset link flow (planned for post-MVP).

**User Access:** Public (accessible without login).

---

## Module Dependency Map

```
Master Data ◄────────────────────────────────────────────────┐
    │                                                        │
    ▼                                                        │
User/Admin Management                                        │
    │                                                        │
    ▼                                                        │
Dashboard ◄── Order ──► Cart ──► Approval ──► Vendor Email   │
    ▲            │                   │                        │
    │            ▼                   ▼                        │
    │        Check-In ──────────► Inventory ◄── Checkout      │
    │            │                   │             │          │
    │            ▼                   ▼             ▼          │
    │     Peroxide Monitoring   Extend Shelf Life             │
    │            │                   │                        │
    │            ▼                   ▼                        │
    └──── Transaction History ◄──────┘                        │
                 │                                            │
                 ▼                                            │
          Regulatory / Reporting ─────────────────────────────┘
```

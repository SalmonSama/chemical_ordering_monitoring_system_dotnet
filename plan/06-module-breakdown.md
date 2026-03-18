# 06 — Module Breakdown

This document describes the purpose, scope, and key capabilities of each major module in the system. Modules are organized by functional area and grouped to reflect their dependencies.

---

## 1. Dashboard Module

**Purpose:** Provide role-specific, at-a-glance operational visibility across all critical system functions.

**Key Capabilities:**
- Display actionable summary widgets based on the user's role and lab/location scope.
- Widgets include:
  - **Pending Approvals** — Count and list of orders awaiting the current user's approval (Focal Point / Admin).
  - **My Orders** — Status of the current user's submitted orders (Lab User).
  - **Low Stock Alerts** — Items below minimum stock thresholds in the user's lab(s).
  - **Expiring Items** — Items approaching or past expiry date, grouped by urgency (30/60/90 days).
  - **Overdue Peroxide Tests** — Peroxide-forming chemicals with overdue monitoring.
  - **Recent Activity** — Latest check-ins, checkouts, and order activity.
- Support drill-down from widgets to detailed module views.
- Respect the (Location, Lab) scope of the current user for all displayed data.
- Refresh data on page load; optionally support periodic auto-refresh.

**User Access:** All roles (data filtered by scope).

---

## 2. Order Module

**Purpose:** Enable Lab Users and Focal Points to request chemicals and materials from approved vendors through a structured ordering process.

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
- Track order status: Draft → Submitted → Approved → Ordered → Partially Received → Received → Cancelled.
- Allow the requester to cancel a pending (not yet approved) order.

**User Access:** Lab User, Focal Point, Admin (within scope).

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
- Submit the cart as an order, which transitions the order to "Submitted" status and routes it for approval.
- Cart persists across sessions (server-side storage) until submitted or cleared.

**User Access:** Lab User, Focal Point, Admin (within scope).

---

## 4. Approval Module

**Purpose:** Route submitted orders to authorized approvers and enable accept/reject decisions with feedback.

**Key Capabilities:**
- Display a queue of orders pending the current user's approval, scoped to their assigned lab(s).
- Show order details: requester, lab, items, quantities, notes, and submission date.
- Allow approvers to:
  - **Approve** — Moves the order to "Approved" status, triggering vendor notification.
  - **Reject** — Returns the order to the requester with a mandatory rejection reason.
- Enforce self-approval prevention: a user cannot approve an order they submitted.
- Admin can override approval for escalation scenarios.
- Maintain an approval history log: who approved/rejected, when, and with what comments.

**User Access:** Focal Point, Admin.

---

## 5. Vendor Email Module

**Purpose:** Automatically notify vendors when an order is approved, providing them with the information needed to fulfill the order.

**Key Capabilities:**
- Triggered automatically upon order approval.
- Generate a structured email containing:
  - Order reference number.
  - List of items with quantities, catalog numbers, and units.
  - Requesting lab and location.
  - Contact information for the requester or lab.
  - Any special instructions.
- Send to the vendor contact email address defined in the vendor master data.
- Log email dispatch status (sent, failed) against the order record.
- Support retry for failed email dispatches.
- Configurable email templates per vendor or as a system-wide default.

**User Access:** System-triggered (no direct user interaction); Admin can view email logs.

---

## 6. Check-In Module

**Purpose:** Record received items into inventory, associating them with lots and storage locations.

**Key Capabilities:**

### Standard Check-In (against a Purchase Order)
- Select an approved/ordered purchase order.
- For each line item, record:
  - Quantity received.
  - Lot number.
  - Manufacture date (if available).
  - Expiry date.
  - Storage location (lab, shelf/cabinet).
- Support partial check-ins (not all items received at once).
- Update order status: Partially Received or Received.
- Generate a QR code for each new lot upon check-in.

### Manual Check-In (no Purchase Order)
- Register items received outside the ordering process (donations, transfers, direct deliveries).
- Requires Focal Point or Admin role.
- Same lot-level data capture as standard check-in.
- Creates an inventory record without a linked purchase order.

### QR-Based Check-In
- Scan a QR code on a received item to pre-populate check-in fields.
- Suitable for items with vendor-supplied or internally generated QR/barcodes.

**User Access:** Lab User, Focal Point, Admin (standard). Focal Point, Admin (manual).

---

## 7. Checkout Module

**Purpose:** Record consumption or withdrawal of inventory items, reducing lot quantities and maintaining traceability.

**Key Capabilities:**
- Select an item and lot from the user's lab inventory.
- Record:
  - Quantity checked out.
  - Purpose / reason for use.
  - Date and time.
- Validate that sufficient quantity remains in the lot.
- Update lot remaining quantity.
- Mark lots as depleted when quantity reaches zero.
- Support QR-scan checkout: scan a lot's QR code to pre-populate checkout form.
- Create a transaction record for every checkout operation.

**User Access:** Lab User, Focal Point, Admin (within scope).

---

## 8. Peroxide Monitoring Module

**Purpose:** Track and manage the mandatory monitoring schedule for peroxide-forming chemicals to ensure safety compliance.

**Key Capabilities:**
- Maintain a list of chemicals classified as peroxide-forming, with their classification group (e.g., Class A, B, C).
- Define monitoring intervals per classification group (e.g., Class A every 3 months, Class B every 6 months).
- Display a monitoring schedule dashboard showing:
  - Upcoming tests.
  - Overdue tests (highlighted).
  - Past test results.
- Log test results:
  - Tester name (auto-populated from logged-in user).
  - Test date.
  - Result: Pass / Fail.
  - Observations / notes.
  - Next test due date (auto-calculated from interval).
- If a test **fails**, trigger actions:
  - Flag the lot for disposal or quarantine.
  - Notify Focal Point and Admin.
- Maintain full test history per lot for audit purposes.

**User Access:** Lab User (log results), Focal Point (configure schedule, log results), Admin (full access), Viewer/Auditor (read-only).

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
- Maintain a complete extension history per lot.
- Apply only to individual lots, not to the entire catalog item.
- Extensions are logged as a distinct transaction type for audit trail.

**User Access:** Focal Point, Admin.

---

## 10. Transaction History Module

**Purpose:** Provide a complete, immutable audit trail of every inventory-affecting action.

**Key Capabilities:**
- Record all inventory movements with the following transaction types:
  - **Check-In** — Item received into inventory.
  - **Checkout** — Item withdrawn from inventory.
  - **Adjustment** — Manual quantity correction (increase or decrease).
  - **Disposal** — Item disposed of (expired, failed test, waste).
  - **Transfer** — Item moved between labs (future capability).
  - **Shelf-Life Extension** — Expiry date modification.
- Each record includes: transaction type, item, lot, quantity, user, date/time, lab, location, and notes.
- Filter and search by: date range, transaction type, item, lot, user, lab, location.
- Export to CSV for external analysis.
- Records are append-only; transactions cannot be edited or deleted.

**User Access:** Admin, Focal Point, Viewer/Auditor (full scope). Lab User (own transactions).

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

**User Access:** Admin, Focal Point, Viewer/Auditor.

---

## 12. Master Data Module

**Purpose:** Manage the reference data that underpins all system operations.

**Key Capabilities:**
- **Chemical / Item Catalog** — Create, edit, deactivate chemicals and materials. Fields include: name, CAS number, catalog number, category, default vendor, unit, packaging, hazard classification, peroxide-forming flag.
- **Vendors** — Manage vendor records: name, contact email, phone, address, notes.
- **Categories** — Define and manage item categories (Chemical & Reagent, Verify STD, Gas, Material & Consumable). Categories drive workflow behavior.
- **Units of Measure** — Define units (L, mL, kg, g, each, etc.).
- **Locations** — Create, edit, deactivate locations (AIE, MTP, CT, ATC).
- **Labs** — Create, edit, deactivate labs within locations. Each lab is linked to a parent location.
- **Peroxide Classification Groups** — Define groups (Class A, B, C) with monitoring intervals.
- **Min-Stock Thresholds** — Set per-item, per-lab minimum stock levels.

**User Access:** Admin only (full CRUD). Focal Point and others (read-only where applicable).

---

## 13. User / Admin Management Module

**Purpose:** Manage user accounts, role assignments, and lab access within the system.

**Key Capabilities:**
- **User Provisioning** — Create user accounts (or sync from enterprise directory).
- **Role Assignment** — Assign one of the four defined roles to each user.
- **Lab Access Assignment** — Assign one or more (Location, Lab) pairs to each user.
- **User Deactivation** — Deactivate users without deleting historical data.
- **User Directory** — View all users with their roles and lab assignments.
- **Profile Management** — Users can view and edit limited aspects of their own profile.
- **Activity Log** — View a user's recent actions (orders, check-ins, checkouts).

**User Access:** Admin only (full management). Focal Point (view users in their labs). Users (own profile).

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

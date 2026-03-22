# 10 — Order Workflow

This document defines the complete order workflow from item selection through vendor notification, including all statuses, decision points, role interactions, and transaction history entries.

> **Frontend pages:** Catalog & Cart (`/orders/catalog`), Cart Review (`/orders/cart`), My Orders (`/orders/my-orders`), Order Detail (`/orders/my-orders/:id`), Approval Queue (`/orders/approval-queue`), Order Status Dashboard (`/orders/status`). See `23-page-and-route-planning.md`.
> **UI components:** `DataTable`, `FilterBar`, `DashboardCard`, `StatusBadge`, `ExportActions`. See `26-component-and-state-planning.md`.
> **Cart state:** Server-persisted, client-cached via React Query. See `26-component-and-state-planning.md`, Cart State section.

---

## Normalized Order Statuses

All documents in this plan must use the following order statuses consistently:

| Status | Description |
|---|---|
| **Draft** | Order created but not yet finalized by the user. |
| **In Cart** | Items have been added to the user's cart; order has not been submitted. |
| **Pending Approval** | Order submitted by the requester; awaiting Focal Point / Lab Manager review. |
| **Modified** | Focal Point has modified the order (quantities, items) before approving. Visible to requester. |
| **Approved** | Order approved by Focal Point / Lab Manager. Ready for vendor email dispatch. |
| **Email Sent** | Vendor notification email(s) successfully dispatched. |
| **Pending Delivery** | Vendor has been notified; order is awaiting physical delivery. |
| **Partially Received** | Some (but not all) line items have been checked in. |
| **Fully Received** | All line items have been checked in. Order complete. |
| **Cancelled** | Order cancelled by requester (before approval) or by Admin/Focal Point. |

### Order-Line-Item Statuses

Each line item within an order also carries its own status:

| Line-Item Status | Description |
|---|---|
| **Pending** | Line item part of a submitted order; not yet received. |
| **Partially Received** | Some quantity has been checked in, but ordered quantity is not fully met. |
| **Fully Received** | All ordered quantity has been checked in. |
| **Removed** | Line item was removed during Focal Point modification. |

The order-level status is computed from the aggregate of its line-item statuses:
- If **all** line items are Fully Received → order is **Fully Received**.
- If **at least one** (but not all) line items has received quantity > 0 → order is **Partially Received**.
- Otherwise, the order keeps its current status from the approval/email flow.

### Status Transition Diagram

```
                    ┌──────────┐
                    │  Draft   │
                    └────┬─────┘
                         │ User adds items
                         ▼
                    ┌──────────┐
                    │ In Cart  │◄──── User edits cart
                    └────┬─────┘
                         │ User submits
                         ▼
                 ┌────────────────┐
                 │Pending Approval│
                 └───────┬────────┘
                         │
              ┌──────────┼──────────┐
              │          │          │
              ▼          ▼          ▼
        ┌──────────┐ ┌────────┐ ┌───────────┐
        │ Modified │ │Approved│ │ Cancelled │
        └────┬─────┘ └───┬────┘ └───────────┘
             │            │
             │ FP approves│
             └──────┬─────┘
                    ▼
              ┌───────────┐
              │Email Sent │
              └─────┬─────┘
                    │ (auto-transition)
                    ▼
           ┌─────────────────┐
           │Pending Delivery │
           └───────┬─────────┘
                   │
         ┌─────────┼─────────────┐
         ▼                       ▼
┌──────────────────┐   ┌───────────────┐
│Partially Received│──▶│Fully Received │
└──────────────────┘   └───────────────┘
```

---

## Workflow Steps in Detail

### Step 1: Search / Select Item

**Actor:** Lab User, Focal Point, or Admin

**Actions:**
1. Navigate to the catalog / item search page.
2. Search by item name, CAS number, catalog number, or vendor.
3. Filter by category (Chemical & Reagent, Gas, Material & Consumable).
4. View item details: name, description, unit, packaging, vendor, category, current stock level in the user's lab.

**Rules:**
- Verify STD items are visible in the catalog but do **not** have an "Add to Cart" action.
- Gas items are orderable in MVP.
- Material & Consumable items show "Add to Cart" only if the item has the `is_orderable` flag set to `true`.
- Items display vendor name and current in-stock quantity for the user's selected lab to aid ordering decisions.

---

### Step 2: Add to Cart

**Actor:** Lab User, Focal Point, or Admin

**Actions:**
1. Click "Add to Cart" on a catalog item.
2. Specify the desired quantity.
3. Optionally add a line-item note (e.g., "Urgent — running low").
4. The item appears in the user's cart for the currently selected lab context.

**Rules:**
- Cart is **per-user, per-lab**. A user ordering for PO Lab at AIE has a separate cart from the same user ordering for EOU Lab at AIE.
- Adding an item already in the cart increments its quantity or prompts the user to update.
- Cart persists **server-side** across sessions (stored in the database, not local storage). This ensures cart contents are not lost when switching devices or browsers.
- Adding to cart creates a **transaction history entry** (type: `ADD_TO_CART`).

**Status change:** Item status is **In Cart**.

**Cart data model per line:**

| Field | Description |
|---|---|
| `user_id` | Owner of the cart |
| `lab_id` | Target lab |
| `chemical_id` | Catalog item |
| `quantity` | Requested quantity |
| `note` | Optional line-item note |
| `added_at` | Timestamp of addition |

---

### Step 3: Review Cart

**Actor:** Lab User, Focal Point, or Admin

**Actions:**
1. Navigate to the Cart page.
2. See all items in the current lab's cart: item name, catalog number, vendor, quantity, unit, and notes.
3. Edit quantities for any line item.
4. Remove items from the cart.
5. Add additional notes at the order level.
6. Review the target lab (auto-populated from context; can be changed if user has access to multiple labs).

**Rules:**
- Cart must have at least one item to proceed to submission.
- All quantities must be greater than zero.
- Cart displays the vendor for each item to help the user anticipate vendor grouping.
- Cart page shows a grouped preview of vendor grouping: items are visually grouped by vendor so the user can see how many vendor emails will be generated.

---

### Step 4: Submit Order

**Actor:** Lab User, Focal Point, or Admin

**Actions:**
1. Click "Submit Order" from the cart review page.
2. System validates cart contents:
   - At least one line item.
   - Valid quantities.
   - All items are from orderable categories.
   - Target lab is set.
3. System creates an **order record** with:
   - **PO number** looked up from the pre-assigned PO number table based on **category + lab + vendor** combination. Each vendor group within the order may reference a different PO number. If no PO number mapping exists for a given combination, the system flags it for Admin attention.
   - Requester user ID.
   - Target lab and location.
   - Submission date/time.
   - Status: **Pending Approval**.
4. System creates **order line items** from the cart contents, each with status **Pending**.
5. Cart is cleared for the user/lab combination.
6. Notification sent to the Focal Point(s) of the target lab.

**Transaction history entry:** `SUBMIT_ORDER` — records order ID, requester, lab, location, line items, and timestamp.

**Status change:** In Cart → **Pending Approval**

> **Important — PO Numbers:** The spreadsheet confirms that PO numbers are **pre-assigned** per (Category, Lab, Vendor) combination, not auto-generated sequential IDs. For example, `45182095PG` is the PO number for Chemical & Reagent orders from PG Lab to Chemex. A single purchase request containing items for multiple vendors may reference multiple PO numbers. See the "Pre-Assigned PO Number Reference" section below.

---

### Step 5: Focal Point Reviews Order

**Actor:** Focal Point / Lab Manager (or Admin for escalation)

**Actions:**
1. Navigate to the **Approval Queue** (or see the notification/dashboard widget).
2. View order details: requester, lab, submission date, all line items with quantities, notes.
3. Focal Point has three options:
   - **Approve** — proceed to Step 6.
   - **Modify then Approve** — proceed to Step 5a.
   - **Reject** — proceed to Step 5b.

**Rules:**
- The Focal Point must be assigned to the order's target lab.
- Self-approval is blocked: if the Focal Point is the order requester, a different Focal Point or Admin must approve.

**Approval Queue display columns:**

| Column | Description |
|---|---|
| PO Number | Auto-generated order ID |
| Requester | Who submitted the order |
| Lab | Target lab |
| Items | Count + first item name |
| Total Qty | Sum of line-item quantities |
| Submitted | Submission date |
| Priority | Visual indicator if notes contain "Urgent" |

---

### Step 5a: Modify Order (before approval)

**Actor:** Focal Point / Lab Manager

**Actions:**
1. Focal Point edits the order:
   - Adjust quantities on existing line items.
   - Remove line items (line item status → **Removed**).
   - Add new line items from the catalog.
   - Change vendor for a specific line item (if multiple vendors supply the same item).
   - Add approval-level notes.
2. System records the original values and the modified values in a change log:
   - For each changed field: `{ field, old_value, new_value }`.
   - For added items: `{ action: "added", item, quantity }`.
   - For removed items: `{ action: "removed", item }`.
3. Order status transitions to **Modified**.
4. A notification is sent to the requester informing them the order was modified, including a summary of changes.
5. The Focal Point then approves the modified order.

**Transaction history entry:** `MODIFY_ORDER` — records order ID, modifier (Focal Point), what changed (original vs. new values), timestamp.

**Status change:** Pending Approval → **Modified** → (on approve) **Approved**

---

### Step 5b: Reject Order

**Actor:** Focal Point / Lab Manager (or Admin)

**Actions:**
1. Focal Point selects "Reject".
2. System requires a mandatory **rejection reason** (text field).
3. Order status transitions to **Cancelled**.
4. Notification sent to the requester with the rejection reason.

**Transaction history entry:** `REJECT_ORDER` — records order ID, rejector, rejection reason, timestamp.

**Status change:** Pending Approval → **Cancelled**

> **Note:** Rejected orders are set to **Cancelled** status. If the business requires revision and resubmission, a separate "Returned for Revision" status should be introduced (see `09-open-questions.md`, OQ-11).

---

### Step 6: Approve Order

**Actor:** Focal Point / Lab Manager (or Admin)

**Actions:**
1. Focal Point clicks "Approve".
2. System validates:
   - Approver is not the requester.
   - Approver is assigned to the order's lab.
   - Order has at least one active (non-removed) line item.
3. Order status transitions to **Approved**.
4. System immediately triggers the vendor email process (Step 7).
5. Approval timestamp and approver are recorded on the order.

**Transaction history entry:** `APPROVE_ORDER` — records order ID, approver, approval timestamp.

**Status change:** Pending Approval (or Modified) → **Approved**

---

### Step 7: Send Vendor Email(s)

**Actor:** System (automated)

**Actions:**
1. System groups approved order line items **by vendor**.
   - If the order contains items from 3 different vendors, 3 separate vendor emails are sent.
2. For each vendor group, the system generates an email containing:

| Field | Description |
|---|---|
| **To** | Vendor contact email (from vendor master data) |
| **Subject** | `Purchase Order {PO Number} — {Location} / {Lab}` |
| **PO Number** | The system-generated order number |
| **Items** | Table of line items: item name, catalog number, quantity, unit |
| **Requesting Lab** | Location and lab name |
| **Contact** | Requester name and/or lab contact information |
| **Notes** | Any order-level or line-item-level notes |
| **Date** | Approval date |

3. System sends each email.
4. System records email dispatch status per vendor:
   - **Sent** — email dispatched successfully.
   - **Failed** — email dispatch failed; queued for retry.

**Email retry logic:**
- On failure, the system retries up to **3 times** with exponential backoff (e.g., 1 min, 5 min, 15 min).
- If all retries fail, the order remains in **Email Sent** status with a `has_failed_email = true` flag.
- Admin is notified of persistent failures.
- Admin can manually re-trigger email dispatch from the order detail page.

**Transaction history entry:** `SEND_VENDOR_EMAIL` — records order ID, vendor, email recipient, dispatch status, timestamp.

**Status change:** Approved → **Email Sent**

**Transition to Pending Delivery:** After all vendor emails for the order are successfully sent, the system automatically transitions the order to **Pending Delivery**.

**Status change:** Email Sent → **Pending Delivery**

---

### Step 8: Await Delivery

**Actor:** None (passive state)

The order remains in **Pending Delivery** status until items are physically received and checked in (see `11-checkin-workflow.md`).

---

### Step 9: Check-In (Receive Delivery)

This step is covered in detail in `11-checkin-workflow.md`. In summary:

- Check-in is performed at the **line-item level** — each line item is checked in individually.
- When a line item is checked in, the order tracks received quantities per line item.
- If some but not all line items are fully received: **Partially Received**.
- When all line items are fully received: **Fully Received**.

**Status change:** Pending Delivery → **Partially Received** → **Fully Received**

---

## Order Cancellation Rules

| Situation | Who Can Cancel | Resulting Status |
|---|---|---|
| Order is In Cart | Requester (clear cart) | Cart cleared (no order record) |
| Order is Pending Approval | Requester | **Cancelled** |
| Order is Pending Approval | Focal Point (via reject) | **Cancelled** |
| Order is Approved, Email Sent, or Pending Delivery | Admin only | **Cancelled** (with reason) |
| Order is Partially Received or Fully Received | Cannot be cancelled | N/A |

**Transaction history entry:** `CANCEL_ORDER` — records order ID, canceller, reason, timestamp.

---

## Transaction History Entries for Order Flow

| Action | Transaction Type | Key Data Recorded |
|---|---|---|
| Add item to cart | `ADD_TO_CART` | User, item, quantity, lab, timestamp |
| Submit order | `SUBMIT_ORDER` | Order ID, requester, lab, location, line items, timestamp |
| Modify order | `MODIFY_ORDER` | Order ID, modifier, changes (before/after), timestamp |
| Approve order | `APPROVE_ORDER` | Order ID, approver, timestamp |
| Reject order | `REJECT_ORDER` | Order ID, rejector, reason, timestamp |
| Send vendor email | `SEND_VENDOR_EMAIL` | Order ID, vendor, email, status, timestamp |
| Cancel order | `CANCEL_ORDER` | Order ID, canceller, reason, timestamp |

---

## Notifications Generated

| Event | Recipients | Channel |
|---|---|---|
| Order submitted | Focal Point(s) for the target lab | In-app, Email |
| Order modified by Focal Point | Original requester | In-app, Email |
| Order approved | Requester | In-app, Email |
| Order rejected | Requester | In-app, Email |
| Vendor email sent | Requester, Focal Point | In-app |
| Vendor email failed (all retries exhausted) | Admin | In-app, Email |
| Order cancelled | Requester (if cancelled by FP/Admin) | In-app, Email |

---

## Edge Cases and Special Scenarios

### Multi-Vendor Orders
An order may contain items from multiple vendors. The system handles this by:
1. Grouping line items by vendor at the email step.
2. Sending one email per vendor.
3. The order itself is a single record; vendor grouping is a presentation/email concern.
4. All vendor emails must succeed for the order to transition to Pending Delivery. If any fail, the order remains in Email Sent with a pending retry flag.
5. Each vendor email includes **only that vendor's items** — vendors cannot see items assigned to other vendors.

### Focal Point Ordering for Their Own Lab
A Focal Point can create and submit an order for their own lab but cannot approve it. Another Focal Point (if available) or Admin must approve.

### Admin Override
Admin can approve any order regardless of lab assignment. This is for escalation scenarios and should be logged as an override in the transaction history.

### Category Restrictions
- **Verify STD:** Cannot be added to cart. "Add to Cart" button hidden in UI; API rejects attempts.
- **Gas:** Orderable in MVP. Standard order + approval + email flow. No check-in in MVP.
- **Material & Consumable:** Orderable only if `is_orderable = true` on the catalog item.

### Cart Session Behavior
- Cart data is stored **server-side** (database row per cart item, keyed by `user_id + lab_id + chemical_id`).
- If a user starts a cart on a desktop and switches to a tablet, the cart is intact.
- Carts have no automatic expiration. Users can clear their cart manually.
- If a catalog item is deactivated while it is in a user's cart, the system should warn the user on cart review and prevent submission until the deactivated item is removed.

---

## Pre-Assigned PO Number Reference

The stakeholder spreadsheet (POnumber sheet) confirms that PO numbers are **pre-assigned per (Category, Lab, Vendor) combination**. They are not auto-generated. The system must store these mappings and look them up when creating orders and sending vendor emails.

### PO Number Mappings

| Category | Lab | PO Number | Vendor |
|---|---|---|---|
| Chemical & Reagent | PG Lab | 45182095PG | Chemex |
| Chemical & Reagent | POL Lab | 4518209POL | Chemex |
| Chemical & Reagent | RIGID Lab | 4518209RIG | Chemex |
| Chemical & Reagent | PO Lab | 45182732PO | Chemex |
| Chemical & Reagent | EOU Lab | 45182067EOU | Chemex |
| Chemical & Reagent | EOU Lab | 45182068EOU | Hach |
| Chemical & Reagent | SE Lab | 45182056SE | Chemex |
| Chemical & Reagent | FM Lab | 45182811FM | Chemex |
| Chemical & Reagent | PU Lab | 45182771PU | Chemex |
| Chemical & Reagent | PS Lab | 45182771PS | Chemex |
| Chemical & Reagent | SM Lab | 45182740SM | Chemex |
| Chemical & Reagent | Latex Lab | 45182733LTX | Chemex |
| Chemical & Reagent | EFF Lab | 45182735EFF | Chemex |
| Chemical & Reagent | PE Lab | 45182740111 | Chemex |
| Gas | SM Lab | 45182061222 | BIG |
| Gas | PS Lab | 45182061223 | BIG |
| Gas | Latex Lab | 45182061224 | BIG |
| Gas | PE Lab | 45182061225 | BIG |
| Gas | PE Lab | 45182061226 | BIG |
| Gas | PE Lab | 45182061227 | BIG |
| Gas | PO Lab | 45182061228 | Linde |
| Gas | EOU Lab | 45182061229 | Linde |
| Material & Consumable | PE Lab | 45182061230 | S&T |
| Material & Consumable | PO Lab | 45182061231 | ThreeBond |
| Material & Consumable | EOU Lab | 45182061232 | ThreeBond |

### Data Model Implications

1. **New entity: `po_number_mappings`** — a reference table keyed by `(category_id, lab_id, vendor_id)` that stores the pre-assigned PO number string.
2. The `purchase_requests.po_number` field references this mapping rather than being auto-generated.
3. A single purchase request may reference **multiple PO numbers** if items from different vendors are included — the PO number is resolved at the vendor-email level (per vendor group), not at the order level.
4. The internal order identifier should use a separate auto-generated field (e.g., `internal_ref` or `request_number`) to uniquely identify each purchase request in the system.
5. **SM Lab** appears in PO number mappings but is not listed in Location&Users. This is recorded as an open question in `09-open-questions.md`.
6. Some labs have **multiple PO numbers for the same category** with different vendors (e.g., EOU Lab has separate PO numbers for Chemex and Hach). Some labs also have **multiple PO numbers for the same vendor** in the same category (e.g., PE Lab has three Gas PO numbers for BIG).

> **Open Question:** Should the system also generate an internal sequential reference number (e.g., `REQ-2026-0001`) for each purchase request, separate from the vendor-facing PO number? See `09-open-questions.md`.

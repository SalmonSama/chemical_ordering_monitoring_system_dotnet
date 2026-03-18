# 10 — Order Workflow

This document defines the complete order workflow from item selection through vendor notification, including all statuses, decision points, role interactions, and transaction history entries.

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
- Cart persists server-side across sessions.
- Adding to cart creates a **transaction history entry** (type: `ADD_TO_CART`).

**Status change:** Item status is **In Cart**.

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
   - Order number (auto-generated, e.g., `PO-2026-0001`).
   - Requester user ID.
   - Target lab and location.
   - Submission date/time.
   - Status: **Pending Approval**.
4. System creates **order line items** from the cart contents.
5. Cart is cleared for the user/lab combination.
6. Notification sent to the Focal Point(s) of the target lab.

**Transaction history entry:** `SUBMIT_ORDER` — records order ID, requester, lab, location, line items, and timestamp.

**Status change:** In Cart → **Pending Approval**

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

---

### Step 5a: Modify Order (before approval)

**Actor:** Focal Point / Lab Manager

**Actions:**
1. Focal Point edits the order:
   - Adjust quantities on existing line items.
   - Remove line items.
   - Add new line items from the catalog.
   - Change vendor for a specific line item (if multiple vendors supply the same item).
   - Add approval-level notes.
2. System records the original values and the modified values.
3. Order status transitions to **Modified**.
4. A notification is sent to the requester informing them the order was modified.
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
   - Order has at least one line item.
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

- When a line item is checked in, the order tracks received quantities.
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
| Vendor email failed | Admin | In-app, Email |
| Order cancelled | Requester (if cancelled by FP/Admin) | In-app, Email |

---

## Edge Cases and Special Scenarios

### Multi-Vendor Orders
An order may contain items from multiple vendors. The system handles this by:
1. Grouping line items by vendor at the email step.
2. Sending one email per vendor.
3. The order itself is a single record; vendor grouping is a presentation/email concern.
4. All vendor emails must succeed for the order to transition to Pending Delivery. If any fail, the order remains in Email Sent with a pending retry flag.

### Focal Point Ordering for Their Own Lab
A Focal Point can create and submit an order for their own lab but cannot approve it. Another Focal Point (if available) or Admin must approve.

### Admin Override
Admin can approve any order regardless of lab assignment. This is for escalation scenarios and should be logged as an override in the transaction history.

### Category Restrictions
- **Verify STD:** Cannot be added to cart. "Add to Cart" button hidden in UI; API rejects attempts.
- **Gas:** Orderable in MVP. Standard order + approval + email flow. No check-in in MVP.
- **Material & Consumable:** Orderable only if `is_orderable = true` on the catalog item.

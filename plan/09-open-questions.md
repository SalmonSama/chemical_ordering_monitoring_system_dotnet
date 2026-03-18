# 09 — Open Questions

This document lists unresolved questions that require stakeholder input before or during implementation. Each question is categorized by domain and includes context on why the answer matters.

---

## Authentication & Identity

| # | Question | Context | Impact |
|---|---|---|---|
| OQ-01 | **Which enterprise identity provider (IdP) will be used?** (e.g., Azure AD, Okta, LDAP, custom) | The authentication integration approach depends entirely on the IdP. JWT token structure, claims, and login flow differ by provider. | Blocks Phase 1: Authentication integration. |
| OQ-02 | **Should users be provisioned manually by Admin, or synced from the enterprise directory?** | If synced, the system needs a directory sync mechanism. If manual, the Admin UI handles all user creation. | Affects User Management module design. |
| OQ-03 | **Is multi-factor authentication (MFA) required?** | If yes, MFA must be configured at the IdP level or integrated into the login flow. | Affects authentication configuration. |

---

## Roles & Permissions

| # | Question | Context | Impact |
|---|---|---|---|
| OQ-04 | **Can a lab have multiple Focal Points / Lab Managers?** | Currently assumed to be one per lab. If multiple, the approval routing and notification logic needs adjustment. | Affects approval routing and notification delivery. |
| OQ-05 | **Can a Focal Point be assigned across locations (e.g., manage labs in both AIE and MTP)?** | Currently allowed in the data model. Stakeholders should confirm if this is a real scenario. | Affects scope assignment UI and authorization logic. |
| OQ-06 | **Is there a need for a "Super Focal Point" or "Location Manager" role?** | Someone responsible for all labs within a single location but not system-wide like Admin. | May require adding a new role. |
| OQ-07 | **Should the Viewer / Auditor role have access to all locations by default, or be scoped to specific locations/labs?** | Auditors may need organization-wide access for compliance reviews. | Affects role assignment workflow. |

---

## Approval Workflow

| # | Question | Context | Impact |
|---|---|---|---|
| OQ-08 | **Is single-tier approval sufficient, or is multi-tier approval required?** (e.g., Lab Manager → Department Head → Procurement) | Currently designed as single-tier. Multi-tier adds significant workflow complexity. | Affects approval module design and state machine. |
| OQ-09 | **Is there a monetary or quantity threshold that triggers escalated approval?** | High-value orders might require Admin or management approval beyond the Focal Point. | Affects approval routing logic. |
| OQ-10 | **What happens when the Focal Point is unavailable (vacation, sick leave)?** | Options: delegate to another Focal Point, auto-escalate to Admin, or designate a backup. | Affects availability and delegation logic. |
| OQ-11 | **Can a rejected order be revised and resubmitted, or must a new order be created?** | If revisable, the order status needs a "Returned for Revision" state. If new, the workflow is simpler. | Affects order status state machine. |

---

## Ordering & Vendor Management

| # | Question | Context | Impact |
|---|---|---|---|
| OQ-12 | **What information should be included in the vendor notification email?** | Need to confirm the exact email template content and whether it varies by vendor. | Affects email template design. |
| OQ-13 | **Do vendors ever need to confirm receipt of the order or provide an estimated delivery date?** | Currently one-way notification. If two-way, a vendor response mechanism is needed. | May expand scope significantly. |
| OQ-14 | **Are there preferred/approved vendor lists per lab or per chemical?** | If yes, the catalog needs vendor restrictions. If no, any vendor can supply any item. | Affects catalog and ordering data model. |
| OQ-15 | **Which specific Gas items should be orderable in MVP?** | Gas ordering is in scope but needs a defined list. | Affects catalog configuration. |
| OQ-16 | **Which specific Material & Consumable items should be orderable in MVP?** | Material & Consumable ordering is partially in scope; need a defined list. | Affects catalog configuration. |

---

## Inventory & Check-In

| # | Question | Context | Impact |
|---|---|---|---|
| OQ-17 | **Should the system support inter-lab transfers?** | Currently out of MVP scope. If needed soon, the transaction model must support "Transfer" transactions. | May add a transfer workflow to Phase 3 or post-MVP. |
| OQ-18 | **What constitutes a "storage location" within a lab?** | Options: just the lab name, or more granular (cabinet, shelf, fridge, freezer). Granularity affects data model and check-in forms. | Affects check-in form and inventory data model. |
| OQ-19 | **Should the system track item cost/price at check-in?** | Currently out of scope (no financial tracking). If cost tracking is desired, the lot model needs price fields. | May expand the data model. |
| OQ-20 | **Is there a verification step at check-in?** (e.g., comparing received items against a packing slip) | If yes, the check-in workflow may need a confirmation/verification state. | Affects check-in workflow and UI. |

---

## Peroxide Monitoring

| # | Question | Context | Impact |
|---|---|---|---|
| OQ-21 | **What are the specific peroxide classification groups and their monitoring intervals?** | Need the exact definitions (e.g., Class A = every 3 months, Class B = every 6 months). | Affects master data seeding and monitoring schedule logic. |
| OQ-22 | **What happens to a lot that fails a peroxide test?** | Options: automatic quarantine, disposal notification, manual handling. Define the workflow after a failure. | Affects lot status management and notification logic. |
| OQ-23 | **Who is authorized to perform and log peroxide tests?** | Can Lab Users log results, or only Focal Points? Does it require certification? | Affects role permissions for peroxide module. |
| OQ-24 | **Is there a standard test protocol or form that should be captured in the system?** | If a structured test form exists, the data model should reflect its fields. | Affects peroxide test data model. |

---

## Shelf-Life Extension

| # | Question | Context | Impact |
|---|---|---|---|
| OQ-25 | **What qualifying tests are required before a shelf-life extension can be granted?** | Need to know if the test is freeform text or a structured checklist. | Affects extension form design. |
| OQ-26 | **Is there a maximum number of times a lot can be extended?** | Some organizations limit extensions (e.g., max 2 extensions per lot). | Affects validation logic. |
| OQ-27 | **Does shelf-life extension require approval by a different person, or can the tester self-authorize?** | If approval is needed, this adds an approval step to the extension workflow. | Affects workflow complexity. |

---

## "Shared" Labs

| # | Question | Context | Impact |
|---|---|---|---|
| OQ-28 | **Do users assigned to any lab within a location automatically have access to that location's "Shared" lab?** | If yes, the permission model implicitly grants Shared access. If no, Shared access must be explicitly assigned. | Affects authorization logic. |
| OQ-29 | **Does the "Shared" lab have its own inventory, or is it a communal pool for the entire location?** | Determines whether Shared inventory is treated differently from lab-specific inventory. | Affects inventory ownership and dashboard scoping. |
| OQ-30 | **Does the "Shared" lab have a dedicated Focal Point, or is it managed by a location-level manager?** | Affects approval routing for orders placed for the Shared lab. | Affects Focal Point assignment model. |

---

## Notifications & Reminders

| # | Question | Context | Impact |
|---|---|---|---|
| OQ-31 | **What are the desired notification channels?** (In-app only? Email? Both?) | Affects scope of the notification system. Email adds delivery infrastructure. | Affects Phase 4 notification module design. |
| OQ-32 | **What are the desired lead times for expiry reminders?** (e.g., 30, 60, 90 days before expiry) | Determines alert window configuration. | Affects notification rule configuration. |
| OQ-33 | **Should users be able to configure their own notification preferences?** (e.g., opt out of certain alerts) | If yes, a notification preferences UI is needed. | Affects notification system design. |

---

## Reporting & Regulatory

| # | Question | Context | Impact |
|---|---|---|---|
| OQ-34 | **What specific regulatory reports are required?** | Need exact report formats and fields expected by regulators. | Affects report template design. |
| OQ-35 | **What export formats are required?** (CSV, PDF, Excel, XML) | Currently planned: CSV, PDF. If others are needed, add export format support. | Affects export implementation. |
| OQ-36 | **Are there retention requirements for transaction history?** (e.g., keep records for 7 years) | If yes, archiving and storage strategies are needed. | Affects database design and maintenance. |
| OQ-37 | **Are there regulatory bodies that need direct system access or API-based reporting?** | If yes, an external reporting API or data feed may be needed. | May expand scope significantly. |

---

## General / Cross-Cutting

| # | Question | Context | Impact |
|---|---|---|---|
| OQ-38 | **What is the anticipated number of concurrent users?** | Affects infrastructure sizing and performance requirements. | Affects deployment planning. |
| OQ-39 | **What browsers and devices must be supported?** | Need to define the support matrix (e.g., Chrome, Edge, Safari; desktop, tablet). | Affects frontend testing scope. |
| OQ-40 | **What is the target timezone for the system?** | If all labs are in the same timezone, datetime handling is simple. If multi-timezone, normalization is needed. | Affects date/time handling across the system. |
| OQ-41 | **Is there an existing chemical catalog or master data that can be imported?** | Bulk import tooling may be needed if the initial catalog is large (hundreds or thousands of items). | Affects Phase 1 timeline and tooling needs. |
| OQ-42 | **Should the system support multiple languages or is English-only sufficient?** | Currently assumed English-only. i18n adds significant effort if needed. | Affects all UI components. |
| OQ-43 | **Are there any existing systems that this system must integrate with?** (ERP, LIMS, SDS databases) | Integration points expand scope and add dependency risks. | Affects architecture and timeline. |
| OQ-44 | **What is the data backup and disaster recovery requirement?** | Affects database hosting and infrastructure decisions. | Affects deployment and operations planning. |

---

## Workflow-Specific Questions (from Deep-Dive)

The following questions emerged during the detailed workflow analysis (documents 10–16):

### Order & Approval Workflow

| # | Question | Context | Impact |
|---|---|---|---|
| OQ-45 | **When a Focal Point modifies an order, should the requester be able to reject the modifications?** | Currently, modifications are applied and the requester is notified. If the requester can reject, it adds a back-and-forth negotiation step. | Affects order status state machine and UI. |
| OQ-46 | **Should the system enforce maximum order quantities (per item or per order)?** | Some organizations limit order sizes to control spending. | Affects order validation logic. |
| OQ-47 | **What is the PO number format?** (e.g., `PO-2026-0001`, `{Location}-{Year}-{Seq}`) | Auto-generated PO numbers need a defined format agreed upon by stakeholders. | Affects order creation logic. |

### Check-In Workflow

| # | Question | Context | Impact |
|---|---|---|---|
| OQ-48 | **Should check-in support receiving items from a different vendor than the one on the PO?** | Sometimes vendors substitute or a different vendor fulfills part of an order. | Affects check-in validation and data model. |
| OQ-49 | **Should the system support splitting a single received delivery into multiple lots?** | e.g., 10 bottles of acetone arrive, 5 from Lot A and 5 from Lot B. Currently planned as supported. Confirm this is required. | Affects check-in UI complexity. |

### Checkout Workflow

| # | Question | Context | Impact |
|---|---|---|---|
| OQ-50 | **Should checkout of expired lots be blocked or just warned?** | Currently planned as blocked. Some labs may need to use recently expired chemicals under certain conditions. | Affects checkout validation logic. |
| OQ-51 | **Should the system track the "open date" of a container at first checkout?** | Important for peroxide monitoring. Currently planned as a prompt at first checkout. | Affects checkout flow and lot data model. |

### Peroxide Monitoring

| # | Question | Context | Impact |
|---|---|---|---|
| OQ-52 | **Are the PPM thresholds (< 25, ≥ 25, > 100) fixed for all chemicals, or do they vary by chemical or classification group?** | Currently assumed fixed. If variable, the thresholds need to be configurable per classification group. | Affects peroxide configuration data model. |
| OQ-53 | **What is the standard monitoring interval per peroxide classification group?** (e.g., Class A = 3 months, Class B = 6 months) | Need exact intervals to configure the monitoring schedule engine. | Affects monitoring schedule calculations. |

### Shelf-Life Extension

| # | Question | Context | Impact |
|---|---|---|---|
| OQ-54 | **Is there a maximum extension period per extension?** (e.g., max 6 months per extension) | If yes, the validation prevents excessively long extensions. | Affects extension validation logic. |
| OQ-55 | **Should lot status changes (e.g., Expired → Active after extension) be highlighted in the audit trail?** | Currently logged as a transaction. Stakeholders may want additional visibility (e.g., a separate status change log). | Affects audit trail granularity. |

### Cart & Catalog (from Deep-Dive)

| # | Question | Context | Impact |
|---|---|---|---|
| OQ-56 | **Should carts have an automatic expiration policy?** (e.g., clear carts older than 30 days) | Currently carts persist indefinitely. Stale carts with outdated items could cause confusion. | Affects cart cleanup logic. |
| OQ-57 | **How should the system handle a deactivated catalog item that is currently in a user's cart?** | Currently planned: warn on cart review and block submission. Alternative: auto-remove with notification. | Affects cart validation and user notification. |

### Peroxide Monitoring (from Deep-Dive)

| # | Question | Context | Impact |
|---|---|---|---|
| OQ-58 | **When a peroxide test result is textual (not numeric ppm), who has authority to assign the classification?** | Currently planned: user selects Normal/Warning/Quarantine manually. Should it require Focal Point role? | Affects role permissions for classification assignment. |
| OQ-59 | **Should the system support uploading photos or documents as evidence for peroxide test results?** | Some labs photograph test strips as evidence. If yes, file upload and storage is needed. | Affects monitoring event data model and storage requirements. |

### Checkout (from Deep-Dive)

| # | Question | Context | Impact |
|---|---|---|---|
| OQ-60 | **What should the user experience be when a concurrent checkout conflict occurs?** | Currently planned: show error, reload latest quantity, ask user to retry. Alternative: auto-retry with the same quantity if still available. | Affects checkout UX and concurrency handling. |

### Database Design (from Deep-Dive)

| # | Question | Context | Impact |
|---|---|---|---|
| OQ-61 | **How long should `audit_logs` and `stock_transactions` be retained?** | Both tables are append-only. At ~17,000 records/year, storage is minimal, but a retention policy should be defined for compliance. | Affects storage planning and archival strategy. |
| OQ-62 | **Should soft-deleting a parent (e.g., a vendor) cascade to related items' `default_vendor_id`?** | Currently planned: `is_active = false` on vendor, but `items.default_vendor_id` still references it. Should the UI warn, clear, or block? | Affects soft-delete cascade logic. |
| OQ-63 | **Should Verify STD items require Certificate of Analysis fields at manual check-in?** | Currently planned: CoA #, Assigned Value, Uncertainty, and Certifying Body are optional fields on `inventory_lots`. Should any of these be mandatory for Verify STD? | Affects validation rules for manual check-in. |
| OQ-64 | **Should `item_location_settings.is_stocked` be required before `item_lab_settings` rows can be created?** | The two-level config pattern (location → lab) suggests that an item must be stocked at a location before it can be configured at the lab level. Should the system enforce this? | Affects item configuration workflow. |
| OQ-65 | **Should denormalized `location_id` on transactional tables be maintained via database triggers or application logic?** | Currently planned: application sets `location_id` on INSERT by looking up `labs.location_id`. Alternative: a database trigger sets it automatically. | Affects data integrity guarantees. |
| OQ-66 | **For `purchase_requests.po_number` auto-generation, what format should be used?** | Currently planned: `PO-{YYYY}-{####}` (e.g., `PO-2026-0001`). Should it include location code? Lab code? Reset counter annually? | Affects PO number readability and uniqueness. |

---

## Priority Classification

| Priority | Questions | Rationale |
|---|---|---|
| **Must resolve before Phase 1** | OQ-01, OQ-02, OQ-04, OQ-38, OQ-39, OQ-40, OQ-41, OQ-61, OQ-65, OQ-66 | Foundation decisions that affect schema, auth, initial data, and PO numbering |
| **Must resolve before Phase 2** | OQ-08, OQ-09, OQ-10, OQ-11, OQ-12, OQ-14, OQ-15, OQ-16, OQ-45, OQ-46, OQ-47, OQ-56, OQ-57, OQ-62 | Ordering, approval workflow design, cart behavior, and vendor soft-delete |
| **Must resolve before Phase 3** | OQ-17, OQ-18, OQ-19, OQ-20, OQ-28, OQ-29, OQ-30, OQ-48, OQ-49, OQ-50, OQ-51, OQ-60, OQ-63, OQ-64 | Inventory management, check-in/checkout, Verify STD validation, and concurrency |
| **Must resolve before Phase 4** | OQ-21, OQ-22, OQ-23, OQ-24, OQ-25, OQ-26, OQ-27, OQ-31, OQ-32, OQ-33, OQ-34, OQ-35, OQ-36, OQ-52, OQ-53, OQ-54, OQ-55, OQ-58, OQ-59 | Monitoring, notifications, reporting, shelf-life extension, and peroxide result authority |
| **Can be deferred** | OQ-03, OQ-05, OQ-06, OQ-07, OQ-13, OQ-37, OQ-42, OQ-43, OQ-44 | Enhancements or post-MVP concerns |

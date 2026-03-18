# 03 — Locations and Labs Structure

## Full Location → Lab Hierarchy

```
Organization
│
├── AIE
│   ├── PO Lab
│   ├── EOU Lab
│   ├── PG Lab
│   ├── POL Lab
│   ├── SE Lab
│   └── Shared
│
├── MTP
│   ├── EBSM Lab
│   ├── PS Lab
│   ├── Latex Lab
│   ├── PU Lab
│   ├── FM Lab
│   ├── EFF Lab
│   ├── PE Lab
│   └── Shared
│
├── CT
│   └── CT Lab
│
└── ATC
    └── ATC Lab
```

### Summary

| Location | Labs | Count |
|---|---|---|
| AIE | PO Lab, EOU Lab, PG Lab, POL Lab, SE Lab, Shared | 6 |
| MTP | EBSM Lab, PS Lab, Latex Lab, PU Lab, FM Lab, EFF Lab, PE Lab, Shared | 8 |
| CT | CT Lab | 1 |
| ATC | ATC Lab | 1 |
| **Total** | | **16** |

---

## Why Locations and Labs Must Be Modeled Separately

The Location → Lab relationship is a **strict hierarchical parent-child model**, not a flat tag system. This separation is critical for the following reasons:

### 1. Organizational Reality
Locations represent **physical sites** (buildings, campuses). Labs represent **operational units** within those sites. A lab cannot exist without a location. Different locations may have labs with similar functions but distinct operational ownership.

### 2. Data Integrity
Flattening Location and Lab into a single string (e.g., "AIE - PO Lab") would:
- Make filtering and grouping unreliable (string parsing vs. relational joins).
- Prevent clean foreign key relationships.
- Introduce data inconsistency risks (typos, variant formats).

### 3. Extensibility
New locations or labs may be added over time. A normalized model allows:
- Adding a lab to an existing location without schema changes.
- Adding a new location with its own set of labs.
- Renaming or restructuring without cascading string updates.

---

## Implications

### Permissions Scoping

Roles are assigned with a scope that may span:

| Scope Level | Example | Who |
|---|---|---|
| **System-wide** | All locations, all labs | Admin |
| **Location-wide** | All labs within AIE | Location-level Focal Point |
| **Lab-specific** | Only PO Lab at AIE | Lab-specific User or Focal Point |

A user's access is defined by **one or more (Location, Lab) pairs** assigned to their profile. This determines:
- What inventory they can see.
- What orders they can create or approve.
- What dashboards and reports show.

### Filtering & Navigation

The UI must provide hierarchical filtering:

```
[Select Location ▾]  →  [Select Lab ▾]  →  [View Data]
```

- Selecting a Location narrows the Lab dropdown to labs within that location.
- Dashboards, inventory lists, and reports all respect this filter chain.
- Users with access to multiple labs across locations can switch context.

### Dashboard Scoping

Dashboards render data based on the user's access scope:

| Role | Dashboard Scope |
|---|---|
| Admin | Aggregated across all locations and labs; drill-down available |
| Focal Point | Aggregated across assigned labs; drill-down to individual labs |
| Lab User | Scoped to assigned lab(s) only |
| Viewer / Auditor | Read-only view based on assigned scope |

### Inventory Ownership

Every inventory lot is assigned to exactly one **(Location, Lab)** pair:

```
inventory_lot
  ├── location_id  → FK to locations
  ├── lab_id       → FK to labs
  ├── chemical_id  → FK to chemicals
  ├── lot_number
  ├── quantity_remaining
  └── ...
```

- A lab's inventory is the sum of all lots assigned to it.
- Transfers between labs (even within the same location) must be explicitly recorded as transactions.

### Reporting

Reports can be scoped at multiple levels:

| Report Level | Description |
|---|---|
| **Organization** | All locations, all labs — Admin/Auditor only |
| **Location** | All labs within a single location |
| **Lab** | Single lab — most granular level |

This hierarchical structure supports:
- Roll-up reports (aggregate from lab → location → organization).
- Drill-down reports (start at organization, click into location, then lab).
- Regulatory reports scoped by any level.

---

## Data Model Implications

The normalized structure requires at minimum:

| Entity | Key Fields | Relationships |
|---|---|---|
| `locations` | `id`, `name`, `code`, `is_active` | Parent of `labs` |
| `labs` | `id`, `location_id`, `name`, `code`, `is_active` | Child of `locations` |
| `user_lab_assignments` | `user_id`, `lab_id` | Joins users to their assigned labs |

- `labs.location_id` is a non-nullable foreign key to `locations.id`.
- A lab's full context is always `{Location.Name} → {Lab.Name}` (e.g., "AIE → PO Lab").
- Shared labs are modeled as regular labs named "Shared" under their respective location, with broader user assignment.

---

## "Shared" Labs

Both AIE and MTP have a lab named **"Shared"**. This represents a communal workspace or storage area within that location, not a cross-location pool.

- AIE → Shared: Accessible to users assigned to any lab under AIE (or specifically to the Shared lab).
- MTP → Shared: Accessible to users assigned to any lab under MTP (or specifically to the Shared lab).
- These are two distinct lab records in the database, differentiated by their parent `location_id`.

> **Open Question:** Should users assigned to any lab within a location automatically have access to that location's "Shared" lab, or must access be explicitly granted? (See `09-open-questions.md`)

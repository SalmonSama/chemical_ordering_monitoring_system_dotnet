# 26 — Component and State Planning

This document describes the reusable frontend components, their responsibilities, and the client-side state management strategy.

---

## Layout Components

### `AppShell`
The root layout wrapper. Renders the sidebar, header, and content area.

| Prop / Concern | Detail |
|---|---|
| Children | The routed page content |
| State consumed | Auth state, theme state, lab context |
| Responsive | Collapses sidebar on mobile |

```
<AppShell>
  <Sidebar />
  <div class="main-area">
    <TopHeader />
    <main class="content">
      <Outlet />  ← React Router outlet
    </main>
  </div>
</AppShell>
```

---

### `Sidebar`
Persistent vertical navigation. Renders nav groups and items based on user role.

| Concern | Detail |
|---|---|
| Data | Navigation structure (static definition filtered by role) |
| Active state | Derived from current route (React Router `useLocation`) |
| Collapse | Toggled via button; state in `localStorage` |
| Badge | Approval queue count (from API) |

---

### `TopHeader`
Persistent horizontal bar.

| Element | Component | State Source |
|---|---|---|
| App name/logo | Static | — |
| Lab selector | `LabContextSelector` | Lab context state |
| Notification bell | `NotificationBell` | Notification count (API) |
| Theme toggle | `ThemeToggle` | Theme state |
| User menu | `UserProfileMenu` | Auth state |

---

### `LabContextSelector`
Dropdown showing the user's assigned labs. Selecting a lab updates the global lab context.

| Concern | Detail |
|---|---|
| Data source | `user_labs` from auth state (loaded on login) |
| Display | "Location / Lab" format |
| On change | Update lab context → re-fetch current page data |
| Admin override | Option for "All Locations / All Labs" |

---

## Data Display Components

### `DataTable`
Generic sortable/filterable table wrapper used across all dashboard and list pages.

| Prop | Type | Description |
|---|---|---|
| `columns` | Column definition array | Column key, header, width, sortable, render function |
| `data` | Array of row objects | The data to display |
| `isLoading` | Boolean | Shows skeleton loader |
| `onRowClick` | Function | Row click handler (typically navigation) |
| `sortState` | `{ column, direction }` | Controlled sort state |
| `onSort` | Function | Sort change handler |
| `emptyMessage` | String | Message when no data |
| `stickyHeader` | Boolean | Default: `true` |
| `rowAlternation` | Boolean | Default: `true` (subtle striping) |

Internal features:
- Virtualized rendering for large datasets (>100 rows).
- Responsive column hiding on smaller viewports (priority-based).
- Sticky scroll for header.

---

### `FilterBar`
Composable filter container above tables.

| Prop | Type | Description |
|---|---|---|
| `filters` | Filter config array | Defines available filters |
| `values` | Current filter state | Controlled values |
| `onChange` | Function | Filter change handler |
| `onClearAll` | Function | Reset all filters |

Renders `FilterChip` components for multi-select, dropdowns for single-select, and date pickers for date ranges.

---

### `SearchInput`
Debounced search field with clear button and search icon.

| Prop | Type | Description |
|---|---|---|
| `value` | String | Controlled value |
| `onChange` | Function | Debounced (300ms) change handler |
| `placeholder` | String | E.g., "Search items, PO numbers…" |

---

### `DateRangeFilter`
Date range picker for "from" and "to" dates.

| Prop | Type | Description |
|---|---|---|
| `from` | Date | Start date |
| `to` | Date | End date |
| `onChange` | Function | `({ from, to }) => void` |
| `presets` | Array | Quick-select presets: "Last 7 days", "Last 30 days", "This month", "This quarter" |

---

### `DashboardCard`
Summary card for the main dashboard.

| Prop | Type | Description |
|---|---|---|
| `icon` | ReactNode | Module icon |
| `title` | String | Card title |
| `count` | Number | Primary metric |
| `subtitle` | String | Descriptive text |
| `trend` | `{ direction, value }` | Optional trend indicator |
| `linkTo` | String | Route for "View All →" link |

---

### `StatusBadge`
Pill-shaped status indicator.

| Prop | Type | Description |
|---|---|---|
| `status` | String | Status key (maps to status-color config) |
| `label` | String | Display text (overrides default for status) |
| `size` | `sm` / `md` | Small (inline) or medium (standalone) |

Internally maps status key → semantic color → badge background/text/icon using the design system tokens from `25-design-system-and-theme-planning.md`.

---

## Workflow Components

### `QrScanPanel`
QR code scanning interface used in Checkout and Extend Shelf Life flows.

| Concern | Detail |
|---|---|
| Camera access | Uses `navigator.mediaDevices.getUserMedia` |
| QR parsing | Decodes QR payload → lot ID |
| Lot lookup | Calls API with lot ID → returns lot details |
| Fallback | "Enter lot number manually" link → shows `SearchInput` |
| States | `idle`, `scanning`, `lot_found`, `not_found`, `error` |
| Layout | Camera preview (centered), status message below, lot detail card on success |

---

### `FormSection`
Grouped form fields with a section title and optional description.

| Prop | Type | Description |
|---|---|---|
| `title` | String | Section heading |
| `description` | String | Optional help text |
| `children` | ReactNode | Form fields |

---

### `LabelPreviewModal`
Modal showing a print preview of a QR code label for a lot.

| Content | Source |
|---|---|
| QR code image | Generated from lot data payload |
| Item name | From lot → item |
| Lot number | From lot |
| Expiry date | From lot |
| Lab / location | From lot |
| **Print** button | Triggers `window.print()` with print-only CSS |
| **Close** button | Closes modal |

---

### `ExportActions`
Dropdown button for export operations.

| Action | Behavior |
|---|---|
| Export CSV | Sends current filter state to API → downloads CSV file |
| Export PDF | Sends current filter state to API → downloads PDF file |

Placed in the `FilterBar` area, right-aligned.

---

### `ConfirmationDialog`
Reusable modal for confirming destructive or important actions.

| Prop | Type | Description |
|---|---|---|
| `title` | String | Dialog title |
| `message` | String / ReactNode | Confirmation message |
| `confirmLabel` | String | Confirm button text |
| `variant` | `primary` / `danger` | Button styling |
| `onConfirm` | Function | Confirmed action |
| `onCancel` | Function | Cancel action |

---

## State Management

### State Categories

| Category | Technology | Scope | Examples |
|---|---|---|---|
| **Server state** | React Query (TanStack Query) | Per-query, cached | API data: orders, lots, items, transactions |
| **Auth state** | React Context | Global | User profile, role, lab assignments, JWT token |
| **Lab context** | React Context | Global | Currently selected (location, lab) |
| **Theme state** | React Context + localStorage | Global | Light/dark preference |
| **Cart state** | React Query (server-synced) | Global | Cart items (persisted server-side) |
| **UI state** | Local component state | Per-component | Modal open, sidebar collapsed, form values |
| **Filter/query state** | URL search params | Per-page | Table filters, sort, search — synced to URL for shareability |

---

### Server State (React Query)

All API data is fetched and cached via React Query:

| Concern | Approach |
|---|---|
| **Query keys** | Structured: `['orders', { lab_id, status, page }]` |
| **Stale time** | 30 seconds for dashboard data; 5 minutes for master data |
| **Refetch triggers** | On window focus; on mutation success (invalidate related queries) |
| **Optimistic updates** | For cart add/remove and checkout (with rollback on error) |
| **Infinite scroll** | For transaction history and large tables; use `useInfiniteQuery` |
| **Error handling** | React Query's built-in error boundaries; toast notifications on API errors |

---

### Auth State

Provided via `AuthContext` at the app root:

```
AuthContext:
  user: { id, email, fullName, role, labAssignments[] }
  isAuthenticated: boolean
  isLoading: boolean
  login(): void → redirect to SSO
  logout(): void → clear token, redirect to login
  hasRole(role): boolean
  hasLabAccess(labId): boolean
```

Populated from JWT token claims on login. Lab assignments fetched from `/api/users/me/labs`.

---

### Lab Context State

Provided via `LabContext` at the app root:

```
LabContext:
  currentLocation: { id, name, code }
  currentLab: { id, name, code }
  setLabContext(locationId, labId): void
  isOrgWide: boolean   (Admin "All" mode)
```

All data queries include `lab_id` from this context. Changing lab context invalidates all React Query caches.

---

### Cart State

Cart is **server-persisted** (see `10-order-workflow.md`), but cached client-side via React Query:

```
Query key: ['cart', { userId, labId }]

Mutations:
  addToCart(itemId, quantity)
  updateCartItem(cartItemId, quantity)
  removeCartItem(cartItemId)
  submitCart() → creates purchase_request
```

The cart item count is displayed as a badge on the "Catalog & Cart" nav item.

---

### Filter / Query State (URL Params)

All table-heavy pages sync their filter, sort, and search state to URL query parameters:

```
/orders/status?status=pending_approval,approved&lab=abc-123&search=acetone&sort=submitted_at:desc
```

This enables:
- **Shareability:** Copy URL → colleague sees the same filtered view.
- **Back/forward:** Browser history navigation preserves filter state.
- **Bookmarkability:** Save a filtered view as a browser bookmark.

Implementation: custom `useUrlFilters()` hook that reads/writes `URLSearchParams`.

---

### Theme State

Provided via `ThemeContext`:

```
ThemeContext:
  theme: 'light' | 'dark'
  toggleTheme(): void
```

On change: sets `data-theme` attribute on `<html>`, saves to `localStorage`.

---

## Component Inventory Summary

| Category | Components | Count |
|---|---|---|
| Layout | AppShell, Sidebar, TopHeader, LabContextSelector | 4 |
| Data Display | DataTable, FilterBar, SearchInput, DateRangeFilter, DashboardCard, StatusBadge | 6 |
| Workflow | QrScanPanel, FormSection, LabelPreviewModal, ExportActions, ConfirmationDialog | 5 |
| State Providers | AuthContext, LabContext, ThemeContext, React Query Provider | 4 |
| **Total** | | **19** |

> **Styling tokens:** See `25-design-system-and-theme-planning.md`.
> **Route structure:** See `23-page-and-route-planning.md`.
> **Information architecture:** See `22-frontend-information-architecture.md`.

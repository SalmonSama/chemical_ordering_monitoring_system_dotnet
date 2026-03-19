// ─── Domain Models ───────────────────────────────────────────────
// Mirrors backend C# models (ChemWatch.Models namespace).
// Only frontend-visible properties are included; navigation
// properties are nullable where the backend may or may not include them.

export interface TestItem {
  id: number;
  name: string;
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface User {
  id: string;
  externalId: string | null;
  email: string;
  fullName: string;
  roleId: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string | null;
  role?: Role;
}

export interface Lab {
  id: string;
  locationId: string;
  name: string;
  code: string | null;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  location?: Location;
}

export interface Location {
  id: string;
  name: string;
  code: string;
  address: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  labs?: Lab[];
}

export interface Vendor {
  id: string;
  name: string;
  code: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  website: string | null;
  address: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface ItemCategory {
  id: string;
  name: string;
  code: string;
  description: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface Item {
  id: string;
  itemName: string;
  itemShortName: string | null;
  partNo: string | null;
  casNo: string | null;
  categoryId: string;
  defaultVendorId: string | null;
  type: string | null;
  size: string | null;
  unit: string;
  referencePrice: number | null;
  currency: string | null;
  leadTimeDays: number | null;
  description: string | null;
  storageConditions: string | null;
  isOrderable: boolean;
  requiresCheckin: boolean;
  allowsCheckout: boolean;
  tracksExpiry: boolean;
  requiresPeroxideMonitoring: boolean;
  peroxideClass: string | null;
  isRegulatoryRelated: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  category?: ItemCategory;
  defaultVendor?: Vendor;
}

export interface ItemLabSetting {
  id: string;
  itemId: string;
  labId: string;
  minStock: number | null;
  reorderQuantity: number | null;
  isStocked: boolean;
  storageSublocation: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string | null;
  item?: Item;
  lab?: Lab;
}

export interface InventoryLot {
  id: string;
  itemId: string;
  labId: string;
  locationId: string;
  vendorId: string | null;
  lotNumber: string;
  quantityReceived: number;
  quantityRemaining: number;
  unit: string;
  manufactureDate: string | null;
  expiryDate: string | null;
  openDate: string | null;
  storageSublocation: string | null;
  status: string;
  sourceType: string;
  purchaseRequestId: string | null;
  purchaseRequestItemId: string | null;
  checkedInBy: string;
  checkedInAt: string;
  qrCodeData: string | null;
  extensionCount: number;
  version: number;
  notes: string | null;
  manualSourceReason: string | null;
  createdAt: string;
  updatedAt: string | null;
  item?: Item;
  lab?: Lab;
  location?: Location;
  vendor?: Vendor;
  checkedInByUser?: User;
}

export interface StockTransaction {
  id: string;
  transactionType: string;
  userId: string;
  userName: string;
  labId: string | null;
  locationId: string | null;
  lotId: string | null;
  purchaseRequestId: string | null;
  itemId: string | null;
  quantity: number | null;
  notes: string | null;
  metadata: string;
  createdAt: string;
  user?: User;
  lab?: Lab;
  location?: Location;
  inventoryLot?: InventoryLot;
  item?: Item;
}

// ─── Request / Response DTOs ─────────────────────────────────────

export interface ManualCheckInRequest {
  itemId: string;
  labId: string;
  locationId: string;
  vendorId: string | null;
  lotNumber: string;
  quantity: number;
  unit: string;
  expiryDate: string | null;
  manufactureDate: string | null;
  storageSublocation: string | null;
  sourceReason: string | null;
  notes: string | null;
  performedByUserId: string;
}

export interface ManualCheckInResponse {
  inventoryLot: InventoryLot;
  stockTransaction: StockTransaction;
}

// ─── Form State (used by ManualCheckInPage) ──────────────────────

export interface ManualCheckInFormState {
  itemId: string;
  labId: string;
  locationId: string;
  vendorId: string;
  lotNumber: string;
  quantity: string;
  unit: string;
  expiryDate: string;
  manufactureDate: string;
  storageSublocation: string;
  sourceReason: string;
  notes: string;
  performedByUserId: string;
}

// ─── Phase 4: Order Workflow Types ───────────────────────────────

export interface PurchaseRequest {
  id: string;
  poNumber: string;
  labId: string;
  labName: string | null;
  locationId: string;
  locationName: string | null;
  requestedBy: string;
  requestedByName: string | null;
  status: string;
  orderNotes: string | null;
  approvalNotes: string | null;
  approvedBy: string | null;
  approvedByName: string | null;
  approvedAt: string | null;
  rejectedReason: string | null;
  submittedAt: string;
  lastModifiedBy: string | null;
  lastModifiedAt: string | null;
  createdAt: string;
  itemCount?: number;
  totalQty?: number;
  items?: PurchaseRequestLineItem[];
  revisions?: PurchaseRequestItemRevision[];
}

export interface PurchaseRequestLineItem {
  id: string;
  itemId: string;
  itemName: string | null;
  itemUnit: string | null;
  vendorId: string | null;
  vendorName: string | null;
  quantityOrdered: number;
  unit: string;
  unitPrice: number | null;
  lineItemNotes: string | null;
  status: string;
}

export interface PurchaseRequestItemRevision {
  id: string;
  purchaseRequestItemId: string | null;
  action: string;
  fieldName: string | null;
  oldValue: string | null;
  newValue: string | null;
  revisedBy: string;
  revisedByName: string | null;
  revisedAt: string;
  notes: string | null;
}

export interface CartItem {
  itemId: string;
  itemName: string;
  unit: string;
  vendorId: string | null;
  vendorName: string | null;
  quantity: number;
  note: string;
}

export interface SubmitOrderRequest {
  requestedBy: string;
  labId: string;
  locationId: string;
  orderNotes: string | null;
  items: { itemId: string; vendorId: string | null; quantity: number; note: string | null }[];
}

export interface ModifyLineItemRequest {
  lineItemId: string;
  newQuantity: number | null;
  newVendorId: string | null;
  remove: boolean;
}

export interface ModifyOrderRequest {
  modifiedBy: string;
  notes: string | null;
  items: ModifyLineItemRequest[];
}

export interface ApproveOrderRequest {
  approvedBy: string;
  approvalNotes: string | null;
}


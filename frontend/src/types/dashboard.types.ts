// ─── Dashboard Summary API Response Types ────────────────────────

export interface DashboardSummary {
  pendingApprovals: number;
  lowStockCount: number;
  expiringSoonCount: number;
  peroxideDueCount: number;
  pendingOrdersPreview: PendingOrderPreview[];
  lowStockPreview: LowStockPreview[];
  expiringPreview: ExpiringPreview[];
  peroxidePreview: PeroxidePreview[];
  recentTransactions: RecentTransaction[];
}

export interface PendingOrderPreview {
  id: string;
  poNumber: string;
  itemSummary: string;
  totalQty: number;
  requester: string;
  labName: string;
  submittedAt: string;
}

export interface LowStockPreview {
  statusIndicator: string;
  itemName: string;
  catalogNumber: string | null;
  category: string;
  labName: string;
  locationName: string;
  totalQuantity: number;
  unit: string;
  minStock: number | null;
  deficit: number;
}

export interface ExpiringPreview {
  id: string;
  statusIndicator: string;
  itemName: string;
  lotNumber: string;
  category: string;
  labName: string;
  expiryDate: string | null;
  daysToExpiry: number;
  quantityRemaining: number;
  unit: string;
}

export interface PeroxidePreview {
  id: string;
  statusIndicator: string;
  itemName: string;
  lotNumber: string;
  labName: string;
  monitorDueIn: number;
  monitorDate: string;
  lastClassification: string;
}

export interface RecentTransaction {
  id: string;
  timestamp: string;
  type: string;
  itemName: string;
  lotNumber: string;
  quantity: number | null;
  userName: string;
  labName: string;
}

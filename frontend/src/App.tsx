import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import MasterDataLayout from './layout/MasterDataLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import LocationsPage from './pages/LocationsPage';
import RolesPage from './pages/RolesPage';
import VendorsPage from './pages/VendorsPage';
import ItemCategoriesPage from './pages/ItemCategoriesPage';
import ItemsPage from './pages/ItemsPage';
import ItemLabSettingsPage from './pages/ItemLabSettingsPage';
import ManualCheckInPage from './pages/ManualCheckInPage';
import InventoryLotsPage from './pages/InventoryLotsPage';
import StockTransactionsPage from './pages/StockTransactionsPage';
import CatalogPage from './pages/CatalogPage';
import CartPage from './pages/CartPage';
import MyOrdersPage from './pages/MyOrdersPage';
import ApprovalQueuePage from './pages/ApprovalQueuePage';
import PendingDeliveryPage from './pages/PendingDeliveryPage';
import AdminUsersPage from './pages/AdminUsersPage';
import CreateUserPage from './pages/CreateUserPage';
import EditUserPage from './pages/EditUserPage';
import CheckoutPage from './pages/CheckoutPage';
import PeroxideLotsPage from './pages/PeroxideLotsPage';
import ExtendShelfLifePage from './pages/ExtendShelfLifePage';
import OrderStatusPage from './pages/reports/OrderStatusPage';
import MinStockPage from './pages/reports/MinStockPage';
import ExpiredPage from './pages/reports/ExpiredPage';
import PeroxideDuePage from './pages/reports/PeroxideDuePage';
import TransactionHistoryPage from './pages/reports/TransactionHistoryPage';
import RegulatoryReportPage from './pages/reports/RegulatoryReportPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import type { CartItem } from './types/models';

function App(): React.JSX.Element {
  const [cart, setCart] = useState<CartItem[]>([]);

  return (
    <Routes>
      {/* Public routes — no auth required */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected routes — require authentication */}
      <Route element={
        <ProtectedRoute>
          <MasterDataLayout cartCount={cart.length} />
        </ProtectedRoute>
      }>
        {/* Phase 1 */}
        <Route path="/" element={<DashboardPage />} />

        {/* Phase A — Admin User Management (admin only) */}
        <Route path="/admin/users" element={
          <ProtectedRoute requiredRole="admin"><AdminUsersPage /></ProtectedRoute>
        } />
        <Route path="/admin/users/create" element={
          <ProtectedRoute requiredRole="admin"><CreateUserPage /></ProtectedRoute>
        } />
        <Route path="/admin/users/:id/edit" element={
          <ProtectedRoute requiredRole="admin"><EditUserPage /></ProtectedRoute>
        } />

        {/* Phase 2 — Master Data (admin only) */}
        <Route path="/admin/locations" element={
          <ProtectedRoute requiredRole="admin"><LocationsPage /></ProtectedRoute>
        } />
        <Route path="/admin/roles" element={
          <ProtectedRoute requiredRole="admin"><RolesPage /></ProtectedRoute>
        } />
        <Route path="/admin/vendors" element={
          <ProtectedRoute requiredRole="admin"><VendorsPage /></ProtectedRoute>
        } />
        <Route path="/admin/categories" element={
          <ProtectedRoute requiredRole="admin"><ItemCategoriesPage /></ProtectedRoute>
        } />
        <Route path="/admin/items" element={
          <ProtectedRoute requiredRole="admin"><ItemsPage /></ProtectedRoute>
        } />
        <Route path="/admin/item-lab-settings" element={
          <ProtectedRoute requiredRole="admin"><ItemLabSettingsPage /></ProtectedRoute>
        } />

        {/* Phase 3 — Inventory Core (all authenticated) */}
        <Route path="/inventory/check-in/manual" element={
          <ProtectedRoute requiredRoles={['admin', 'focal_point']}><ManualCheckInPage /></ProtectedRoute>
        } />
        <Route path="/inventory/checkout" element={<CheckoutPage />} />
        <Route path="/inventory/lots" element={<InventoryLotsPage />} />
        <Route path="/inventory/transactions" element={<StockTransactionsPage />} />

        {/* Phase 4 — Order Workflow (all authenticated) */}
        <Route path="/orders/catalog" element={<CatalogPage cart={cart} setCart={setCart} />} />
        <Route path="/orders/cart" element={<CartPage cart={cart} setCart={setCart} />} />
        <Route path="/orders/my-orders" element={<MyOrdersPage />} />
        <Route path="/orders/approval-queue" element={
          <ProtectedRoute requiredRoles={['admin', 'focal_point']}><ApprovalQueuePage /></ProtectedRoute>
        } />

        {/* Phase 5 — Pending Delivery Check-In (all authenticated) */}
        <Route path="/inventory/check-in/pending-delivery" element={<PendingDeliveryPage />} />

        {/* Phase 7 — Peroxide Monitoring (all authenticated) */}
        <Route path="/monitoring/peroxide" element={<PeroxideLotsPage />} />

        {/* Phase 8 — Extend Shelf Life (admin + focal_point only) */}
        <Route path="/inventory/extend-shelf-life" element={
          <ProtectedRoute requiredRoles={['admin', 'focal_point']}><ExtendShelfLifePage /></ProtectedRoute>
        } />

        {/* Phase 9 — Dashboards & Reports (all authenticated) */}
        <Route path="/reports/orders" element={<OrderStatusPage />} />
        <Route path="/reports/min-stock" element={<MinStockPage />} />
        <Route path="/reports/expired" element={<ExpiredPage />} />
        <Route path="/reports/peroxide-due" element={<PeroxideDuePage />} />
        <Route path="/reports/transactions" element={<TransactionHistoryPage />} />
        <Route path="/reports/regulatory" element={<RegulatoryReportPage />} />
      </Route>
    </Routes>
  );
}

export default App;

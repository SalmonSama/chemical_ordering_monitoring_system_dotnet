import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import MasterDataLayout from './layout/MasterDataLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import TestPage from './pages/TestPage';
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
import type { CartItem } from './types/models';

function App(): React.JSX.Element {
  const [cart, setCart] = useState<CartItem[]>([]);

  return (
    <Routes>
      {/* Public routes — no auth required */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected routes — require authentication */}
      <Route element={
        <ProtectedRoute>
          <MasterDataLayout cartCount={cart.length} />
        </ProtectedRoute>
      }>
        {/* Phase 1 */}
        <Route path="/" element={<TestPage />} />

        {/* Phase A — Admin User Management */}
        <Route path="/admin/users" element={
          <ProtectedRoute requiredRole="admin"><AdminUsersPage /></ProtectedRoute>
        } />
        <Route path="/admin/users/create" element={
          <ProtectedRoute requiredRole="admin"><CreateUserPage /></ProtectedRoute>
        } />
        <Route path="/admin/users/:id/edit" element={
          <ProtectedRoute requiredRole="admin"><EditUserPage /></ProtectedRoute>
        } />

        {/* Phase 2 — Master Data */}
        <Route path="/admin/locations" element={<LocationsPage />} />
        <Route path="/admin/roles" element={<RolesPage />} />
        <Route path="/admin/vendors" element={<VendorsPage />} />
        <Route path="/admin/categories" element={<ItemCategoriesPage />} />
        <Route path="/admin/items" element={<ItemsPage />} />
        <Route path="/admin/item-lab-settings" element={<ItemLabSettingsPage />} />

        {/* Phase 3 — Inventory Core */}
        <Route path="/inventory/check-in/manual" element={<ManualCheckInPage />} />
        <Route path="/inventory/checkout" element={<CheckoutPage />} />
        <Route path="/inventory/lots" element={<InventoryLotsPage />} />
        <Route path="/inventory/transactions" element={<StockTransactionsPage />} />

        {/* Phase 4 — Order Workflow */}
        <Route path="/orders/catalog" element={<CatalogPage cart={cart} setCart={setCart} />} />
        <Route path="/orders/cart" element={<CartPage cart={cart} setCart={setCart} />} />
        <Route path="/orders/my-orders" element={<MyOrdersPage />} />
        <Route path="/orders/approval-queue" element={<ApprovalQueuePage />} />

        {/* Phase 5 — Pending Delivery Check-In */}
        <Route path="/inventory/check-in/pending-delivery" element={<PendingDeliveryPage />} />
      </Route>
    </Routes>
  );
}

export default App;

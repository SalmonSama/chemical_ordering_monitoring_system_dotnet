import { Routes, Route } from 'react-router-dom';
import MasterDataLayout from './layout/MasterDataLayout';
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

function App(): React.JSX.Element {
  return (
    <Routes>
      <Route element={<MasterDataLayout />}>
        {/* Phase 1 */}
        <Route path="/" element={<TestPage />} />

        {/* Phase 2 — Master Data */}
        <Route path="/admin/locations" element={<LocationsPage />} />
        <Route path="/admin/roles" element={<RolesPage />} />
        <Route path="/admin/vendors" element={<VendorsPage />} />
        <Route path="/admin/categories" element={<ItemCategoriesPage />} />
        <Route path="/admin/items" element={<ItemsPage />} />
        <Route path="/admin/item-lab-settings" element={<ItemLabSettingsPage />} />

        {/* Phase 3 — Inventory Core */}
        <Route path="/inventory/check-in/manual" element={<ManualCheckInPage />} />
        <Route path="/inventory/lots" element={<InventoryLotsPage />} />
        <Route path="/inventory/transactions" element={<StockTransactionsPage />} />
      </Route>
    </Routes>
  );
}

export default App;

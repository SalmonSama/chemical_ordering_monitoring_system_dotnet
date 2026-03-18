import { Routes, Route } from 'react-router-dom';
import MasterDataLayout from './layout/MasterDataLayout';
import TestPage from './pages/TestPage';
import LocationsPage from './pages/LocationsPage';
import RolesPage from './pages/RolesPage';
import VendorsPage from './pages/VendorsPage';
import ItemCategoriesPage from './pages/ItemCategoriesPage';
import ItemsPage from './pages/ItemsPage';
import ItemLabSettingsPage from './pages/ItemLabSettingsPage';

function App() {
  return (
    <Routes>
      <Route element={<MasterDataLayout />}>
        <Route path="/" element={<TestPage />} />
        <Route path="/admin/locations" element={<LocationsPage />} />
        <Route path="/admin/roles" element={<RolesPage />} />
        <Route path="/admin/vendors" element={<VendorsPage />} />
        <Route path="/admin/categories" element={<ItemCategoriesPage />} />
        <Route path="/admin/items" element={<ItemsPage />} />
        <Route path="/admin/item-lab-settings" element={<ItemLabSettingsPage />} />
      </Route>
    </Routes>
  );
}

export default App;

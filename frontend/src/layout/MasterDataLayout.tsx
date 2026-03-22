import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { CSSProperties } from 'react';

interface NavItem {
  to: string;
  label: string;
}

interface MasterDataLayoutProps {
  cartCount?: number;
}

const orderNav: NavItem[] = [
  { to: '/orders/catalog', label: '🛒 Catalog' },
  { to: '/orders/cart', label: '📋 Cart' },
  { to: '/orders/my-orders', label: '📄 My Orders' },
  { to: '/orders/approval-queue', label: '✅ Approval Queue' },
];

const adminNav: NavItem[] = [
  { to: '/admin/users', label: '👥 Users' },
  { to: '/admin/locations', label: '📍 Locations & Labs' },
  { to: '/admin/roles', label: '👤 Roles' },
  { to: '/admin/vendors', label: '🏭 Vendors' },
  { to: '/admin/categories', label: '📂 Item Categories' },
  { to: '/admin/items', label: '🧪 Items' },
  { to: '/admin/item-lab-settings', label: '⚙️ Item Lab Settings' },
];

const inventoryNav: NavItem[] = [
  { to: '/inventory/check-in/pending-delivery', label: '📬 Pending Delivery' },
  { to: '/inventory/check-in/manual', label: '📥 Manual Check-In' },
  { to: '/inventory/checkout', label: '📤 Checkout / Consume' },
  { to: '/inventory/lots', label: '📦 Inventory Lots' },
  { to: '/inventory/transactions', label: '📋 Stock Transactions' },
];

const utilityNav: NavItem[] = [
  { to: '/', label: '🔌 Connection Test' },
];

function MasterDataLayout({ cartCount = 0 }: MasterDataLayoutProps): React.JSX.Element {
  const { user, logout, hasRole } = useAuth();

  return (
    <div style={styles.wrapper}>
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>🧪 ChemWatch</h2>
        <p style={styles.phase}>Lab Inventory & Ordering System</p>

        {/* User info */}
        {user && (
          <div style={styles.userBox}>
            <div style={styles.userName}>{user.fullName}</div>
            <div style={styles.userRole}>{user.roleDisplayName}</div>
            <button onClick={logout} style={styles.logoutBtn}>Sign Out</button>
          </div>
        )}

        <nav style={styles.nav}>
          {/* Orders section */}
          <p style={styles.sectionLabel}>Orders</p>
          {orderNav.map(({ to, label }) => (
            <NavLink key={to} to={to} end style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.activeLink : {}) })}>
              {label}{to === '/orders/cart' && cartCount > 0 ? ` (${cartCount})` : ''}
            </NavLink>
          ))}

          <div style={styles.separator} />
          <p style={styles.sectionLabel}>Admin</p>
          {adminNav
            .filter(item => {
              // Only show Users link to admin users
              if (item.to === '/admin/users') return hasRole('admin');
              return true;
            })
            .map(({ to, label }) => (
            <NavLink key={to} to={to} end style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.activeLink : {}) })}>
              {label}
            </NavLink>
          ))}

          <div style={styles.separator} />
          <p style={styles.sectionLabel}>Inventory</p>
          {inventoryNav.map(({ to, label }) => (
            <NavLink key={to} to={to} end style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.activeLink : {}) })}>
              {label}
            </NavLink>
          ))}

          <div style={styles.separator} />
          {utilityNav.map(({ to, label }) => (
            <NavLink key={to} to={to} end style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.activeLink : {}) })}>
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    background: '#0f172a',
  },
  sidebar: {
    width: '260px',
    background: '#1e293b',
    borderRight: '1px solid #334155',
    padding: '1.5rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    flexShrink: 0,
  },
  logo: {
    color: '#f1f5f9',
    fontSize: '1.25rem',
    fontWeight: 700,
    marginBottom: '0.25rem',
  },
  phase: {
    color: '#64748b',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '0.75rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid #334155',
  },
  userBox: {
    background: '#0f172a',
    borderRadius: '8px',
    padding: '0.75rem',
    marginBottom: '1rem',
  },
  userName: {
    color: '#f1f5f9',
    fontSize: '0.9rem',
    fontWeight: 600,
  },
  userRole: {
    color: '#94a3b8',
    fontSize: '0.75rem',
    marginBottom: '0.5rem',
  },
  logoutBtn: {
    background: 'none',
    border: '1px solid #475569',
    borderRadius: '6px',
    color: '#94a3b8',
    fontSize: '0.75rem',
    padding: '0.3rem 0.6rem',
    cursor: 'pointer',
    width: '100%',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  link: {
    color: '#94a3b8',
    textDecoration: 'none',
    padding: '0.6rem 0.75rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    transition: 'all 0.15s ease',
  },
  activeLink: {
    background: 'rgba(59, 130, 246, 0.15)',
    color: '#60a5fa',
    fontWeight: 600,
  },
  separator: {
    height: '1px',
    background: '#334155',
    margin: '0.75rem 0',
  },
  sectionLabel: {
    color: '#64748b',
    fontSize: '0.7rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    margin: '0 0 0.25rem 0.75rem',
  },
  main: {
    flex: 1,
    padding: '2rem',
    overflowX: 'auto',
  },
};

export default MasterDataLayout;

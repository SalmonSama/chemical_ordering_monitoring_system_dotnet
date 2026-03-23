import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface MasterDataLayoutProps {
  cartCount?: number;
}

function MasterDataLayout({ cartCount = 0 }: MasterDataLayoutProps): React.JSX.Element {
  const { user, logout, hasRole } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isAdmin = hasRole('admin');
  const isFocalPoint = hasRole('focal_point');
  const canApprove = isAdmin || isFocalPoint;

  // Initials avatar
  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div style={styles.wrapper}>
      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside style={styles.sidebar}>
        {/* Logo */}
        <div style={styles.logoArea}>
          <span style={styles.logoIcon}>⚗️</span>
          <div>
            <div style={styles.logoName}>ChemWatch</div>
            <div style={styles.logoSub}>Lab Inventory System</div>
          </div>
        </div>

        {/* User box */}
        {user && (
          <div style={styles.userBox}>
            <div style={styles.userAvatar}>{initials}</div>
            <div style={styles.userInfo}>
              <div style={styles.userName}>{user.fullName}</div>
              <div style={styles.userRole}>{user.roleDisplayName}</div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav style={styles.nav}>

          {/* Dashboard */}
          <NavLink to="/" end style={navLinkStyle}>
            📊 Dashboard
          </NavLink>

          <div style={styles.separator} />
          <p style={styles.sectionLabel}>Orders</p>
          <NavLink to="/orders/catalog" end style={navLinkStyle}>🛒 Catalog</NavLink>
          <NavLink to="/orders/cart" end style={navLinkStyle}>📦 Cart{cartCount > 0 ? ` (${cartCount})` : ''}</NavLink>
          <NavLink to="/orders/my-orders" end style={navLinkStyle}>📄 My Orders</NavLink>
          {canApprove && (
            <NavLink to="/orders/approval-queue" end style={navLinkStyle}>✅ Approval Queue</NavLink>
          )}

          <div style={styles.separator} />
          <p style={styles.sectionLabel}>Inventory</p>
          <NavLink to="/inventory/check-in/pending-delivery" end style={navLinkStyle}>📬 Pending Delivery</NavLink>
          {canApprove && (
            <NavLink to="/inventory/check-in/manual" end style={navLinkStyle}>📥 Manual Check-In</NavLink>
          )}
          <NavLink to="/inventory/checkout" end style={navLinkStyle}>📤 Checkout / Consume</NavLink>
          <NavLink to="/inventory/lots" end style={navLinkStyle}>📦 Inventory Lots</NavLink>
          <NavLink to="/inventory/transactions" end style={navLinkStyle}>📋 Stock Transactions</NavLink>

          <div style={styles.separator} />
          <p style={styles.sectionLabel}>Monitoring</p>
          <NavLink to="/monitoring/peroxide" end style={navLinkStyle}>⚗️ Peroxide Tracking</NavLink>
          {canApprove && (
            <NavLink to="/inventory/extend-shelf-life" end style={navLinkStyle}>⏳ Extend Shelf Life</NavLink>
          )}

          <div style={styles.separator} />
          <p style={styles.sectionLabel}>Reports</p>
          <NavLink to="/reports/orders" end style={navLinkStyle}>📈 Order Status</NavLink>
          <NavLink to="/reports/min-stock" end style={navLinkStyle}>📉 Min Stock Alerts</NavLink>
          <NavLink to="/reports/expired" end style={navLinkStyle}>⏳ Expiry Tracking</NavLink>
          <NavLink to="/reports/peroxide-due" end style={navLinkStyle}>🧪 Peroxide Schedule</NavLink>
          <NavLink to="/reports/transactions" end style={navLinkStyle}>📋 Audit Log</NavLink>
          <NavLink to="/reports/regulatory" end style={navLinkStyle}>⚖️ Regulatory Report</NavLink>

          {/* Admin section — admin only */}
          {isAdmin && (
            <>
              <div style={styles.separator} />
              <p style={styles.sectionLabel}>Admin</p>
              <NavLink to="/admin/users" end style={navLinkStyle}>👥 Users</NavLink>
              <NavLink to="/admin/locations" end style={navLinkStyle}>📍 Locations &amp; Labs</NavLink>
              <NavLink to="/admin/roles" end style={navLinkStyle}>👤 Roles</NavLink>
              <NavLink to="/admin/vendors" end style={navLinkStyle}>🏭 Vendors</NavLink>
              <NavLink to="/admin/categories" end style={navLinkStyle}>📂 Categories</NavLink>
              <NavLink to="/admin/items" end style={navLinkStyle}>🧪 Items</NavLink>
              <NavLink to="/admin/item-lab-settings" end style={navLinkStyle}>⚙️ Item Lab Settings</NavLink>
            </>
          )}
        </nav>

        {/* Sign out at bottom */}
        <div style={styles.sidebarFooter}>
          <button onClick={logout} style={styles.logoutBtn}>
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main area ───────────────────────────────────────────── */}
      <div style={styles.mainArea}>
        {/* Top header */}
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            {/* Page breadcrumb placeholder — pages can override page title */}
          </div>
          <div style={styles.headerRight}>
            {user && (
              <span style={styles.headerUser}>
                {user.fullName}
                <span style={styles.headerRole}>{user.roleDisplayName}</span>
              </span>
            )}
            <button
              onClick={toggleTheme}
              style={styles.themeToggleBtn}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        {/* Content */}
        <main style={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Helper: NavLink style with active state using CSS vars
function navLinkStyle({ isActive }: { isActive: boolean }): React.CSSProperties {
  return {
    display: 'block',
    color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
    textDecoration: 'none',
    padding: '7px 12px',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontWeight: isActive ? 600 : 400,
    background: isActive ? 'var(--color-accent-soft)' : 'transparent',
    borderLeft: isActive ? '3px solid var(--color-accent)' : '3px solid transparent',
    transition: 'all 0.15s ease',
  };
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    height: '100vh',
    background: 'var(--color-bg-primary)',
    fontFamily: 'var(--font-family-sans)',
  },

  // Sidebar
  sidebar: {
    width: '240px',
    background: 'var(--color-bg-sidebar)',
    borderRight: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    minHeight: 0,
    overflowY: 'auto',
  },
  logoArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '20px 16px 16px',
    borderBottom: '1px solid var(--color-border)',
  },
  logoIcon: { fontSize: '1.5rem' },
  logoName: {
    color: 'var(--color-text-primary)',
    fontSize: '1rem',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  logoSub: {
    color: 'var(--color-text-tertiary)',
    fontSize: '0.7rem',
    letterSpacing: '0.03em',
  },
  userBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    borderBottom: '1px solid var(--color-border)',
  },
  userAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'var(--color-accent)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 700,
    flexShrink: 0,
  },
  userInfo: { minWidth: 0 },
  userName: {
    color: 'var(--color-text-primary)',
    fontSize: '0.8125rem',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userRole: {
    color: 'var(--color-text-tertiary)',
    fontSize: '0.6875rem',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    padding: '12px 8px',
    flex: 1,
  },
  separator: {
    height: '1px',
    background: 'var(--color-border)',
    margin: '8px 0',
  },
  sectionLabel: {
    color: 'var(--color-text-tertiary)',
    fontSize: '0.6875rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    padding: '4px 12px 2px',
    margin: 0,
  },
  sidebarFooter: {
    padding: '12px 8px',
    borderTop: '1px solid var(--color-border)',
  },
  logoutBtn: {
    width: '100%',
    background: 'transparent',
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
    color: 'var(--color-text-secondary)',
    fontSize: '0.8125rem',
    fontWeight: 500,
    padding: '7px 12px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.15s ease',
  },

  // Main area
  mainArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    minHeight: 0,
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 24px',
    height: '52px',
    background: 'var(--color-bg-header)',
    borderBottom: '1px solid var(--color-border)',
    flexShrink: 0,
  },
  headerLeft: { flex: 1 },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  headerUser: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.8125rem',
    color: 'var(--color-text-secondary)',
  },
  headerRole: {
    background: 'var(--color-accent-soft)',
    color: 'var(--color-accent)',
    borderRadius: '9999px',
    padding: '2px 8px',
    fontSize: '0.6875rem',
    fontWeight: 600,
  },
  themeToggleBtn: {
    background: 'var(--color-bg-hover)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '1rem',
    color: 'var(--color-text-primary)',
    padding: 0,
    flexShrink: 0,
  },
  content: {
    flex: 1,
    padding: '24px',
    overflowY: 'auto',
    overflowX: 'auto',
  },
};

export default MasterDataLayout;

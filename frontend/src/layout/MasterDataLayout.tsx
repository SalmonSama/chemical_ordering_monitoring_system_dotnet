import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FileText,
  CheckSquare,
  Mail,
  PackageCheck,
  PackageMinus,
  Boxes,
  ClipboardList,
  FlaskConical,
  TimerReset,
  BarChart3,
  TrendingDown,
  Clock,
  TestTube,
  ScrollText,
  Scale,
  Users,
  MapPin,
  UserCircle,
  Factory,
  FolderTree,
  Beaker,
  Settings,
  LogOut,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface MasterDataLayoutProps {
  cartCount?: number;
}

/* =========================================================================
   Sidebar Nav Item Definitions
   ========================================================================= */

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  end?: boolean;
}

interface NavSection {
  label: string;
  items: NavItem[];
  /** 'admin' | 'approver' | undefined (visible to all) */
  visibleTo?: 'admin' | 'approver';
}

function useNavSections(cartCount: number, canApprove: boolean, isAdmin: boolean): NavSection[] {
  return [
    {
      label: '',
      items: [
        { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={18} />, end: true },
      ],
    },
    {
      label: 'Orders',
      items: [
        { to: '/orders/catalog', label: 'Catalog', icon: <ShoppingCart size={18} /> },
        { to: '/orders/cart', label: `Cart${cartCount > 0 ? ` (${cartCount})` : ''}`, icon: <Package size={18} /> },
        { to: '/orders/my-orders', label: 'My Orders', icon: <FileText size={18} /> },
        ...(canApprove ? [{ to: '/orders/approval-queue', label: 'Approval Queue', icon: <CheckSquare size={18} /> }] : []),
      ],
    },
    {
      label: 'Inventory',
      items: [
        { to: '/inventory/check-in/pending-delivery', label: 'Pending Delivery', icon: <Mail size={18} /> },
        ...(canApprove ? [{ to: '/inventory/check-in/manual', label: 'Manual Check-In', icon: <PackageCheck size={18} /> }] : []),
        { to: '/inventory/checkout', label: 'Checkout / Consume', icon: <PackageMinus size={18} /> },
        { to: '/inventory/lots', label: 'Inventory Lots', icon: <Boxes size={18} /> },
        { to: '/inventory/transactions', label: 'Stock Transactions', icon: <ClipboardList size={18} /> },
      ],
    },
    {
      label: 'Monitoring',
      items: [
        { to: '/monitoring/peroxide', label: 'Peroxide Tracking', icon: <FlaskConical size={18} /> },
        ...(canApprove ? [{ to: '/inventory/extend-shelf-life', label: 'Extend Shelf Life', icon: <TimerReset size={18} /> }] : []),
      ],
    },
    {
      label: 'Reports',
      items: [
        { to: '/reports/orders', label: 'Order Status', icon: <BarChart3 size={18} /> },
        { to: '/reports/min-stock', label: 'Min Stock Alerts', icon: <TrendingDown size={18} /> },
        { to: '/reports/expired', label: 'Expiry Tracking', icon: <Clock size={18} /> },
        { to: '/reports/peroxide-due', label: 'Peroxide Schedule', icon: <TestTube size={18} /> },
        { to: '/reports/transactions', label: 'Audit Log', icon: <ScrollText size={18} /> },
        { to: '/reports/regulatory', label: 'Regulatory Report', icon: <Scale size={18} /> },
      ],
    },
    ...(isAdmin ? [{
      label: 'Admin',
      items: [
        { to: '/admin/users', label: 'Users', icon: <Users size={18} /> },
        { to: '/admin/locations', label: 'Locations & Labs', icon: <MapPin size={18} /> },
        { to: '/admin/roles', label: 'Roles', icon: <UserCircle size={18} /> },
        { to: '/admin/vendors', label: 'Vendors', icon: <Factory size={18} /> },
        { to: '/admin/categories', label: 'Categories', icon: <FolderTree size={18} /> },
        { to: '/admin/items', label: 'Items', icon: <Beaker size={18} /> },
        { to: '/admin/item-lab-settings', label: 'Item Lab Settings', icon: <Settings size={18} /> },
      ],
    }] : []),
  ];
}

/* =========================================================================
   Breadcrumb Helper
   ========================================================================= */

const ROUTE_LABELS: Record<string, string> = {
  '/': 'Dashboard',
  '/orders': 'Orders',
  '/orders/catalog': 'Catalog',
  '/orders/cart': 'Cart',
  '/orders/my-orders': 'My Orders',
  '/orders/approval-queue': 'Approval Queue',
  '/inventory': 'Inventory',
  '/inventory/check-in': 'Check-In',
  '/inventory/check-in/pending-delivery': 'Pending Delivery',
  '/inventory/check-in/manual': 'Manual Check-In',
  '/inventory/checkout': 'Checkout',
  '/inventory/lots': 'Inventory Lots',
  '/inventory/transactions': 'Stock Transactions',
  '/inventory/extend-shelf-life': 'Extend Shelf Life',
  '/monitoring': 'Monitoring',
  '/monitoring/peroxide': 'Peroxide Tracking',
  '/reports': 'Reports',
  '/reports/orders': 'Order Status',
  '/reports/min-stock': 'Min Stock Alerts',
  '/reports/expired': 'Expiry Tracking',
  '/reports/peroxide-due': 'Peroxide Schedule',
  '/reports/transactions': 'Audit Log',
  '/reports/regulatory': 'Regulatory Report',
  '/admin': 'Admin',
  '/admin/users': 'Users',
  '/admin/users/create': 'Create User',
  '/admin/locations': 'Locations & Labs',
  '/admin/roles': 'Roles',
  '/admin/vendors': 'Vendors',
  '/admin/categories': 'Categories',
  '/admin/items': 'Items',
  '/admin/item-lab-settings': 'Item Lab Settings',
};

function Breadcrumbs() {
  const location = useLocation();
  if (location.pathname === '/') return null;

  const parts = location.pathname.split('/').filter(Boolean);
  const crumbs: Array<{ label: string; path: string }> = [{ label: 'Dashboard', path: '/' }];

  let accumulated = '';
  for (const part of parts) {
    accumulated += '/' + part;
    const label = ROUTE_LABELS[accumulated] || part.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    crumbs.push({ label, path: accumulated });
  }

  return (
    <nav aria-label="Breadcrumb" style={styles.breadcrumbNav}>
      {crumbs.map((crumb, i) => (
        <span key={crumb.path} style={styles.breadcrumbItem}>
          {i > 0 && <span style={styles.breadcrumbSep}>›</span>}
          {i === crumbs.length - 1 ? (
            <span style={styles.breadcrumbCurrent}>{crumb.label}</span>
          ) : (
            <NavLink to={crumb.path} style={styles.breadcrumbLink}>{crumb.label}</NavLink>
          )}
        </span>
      ))}
    </nav>
  );
}

/* =========================================================================
   Layout Component
   ========================================================================= */

function MasterDataLayout({ cartCount = 0 }: MasterDataLayoutProps): React.JSX.Element {
  const { user, logout, hasRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  const isAdmin = hasRole('admin');
  const isFocalPoint = hasRole('focal_point');
  const canApprove = isAdmin || isFocalPoint;

  const sections = useNavSections(cartCount, canApprove, isAdmin);

  // Initials avatar
  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const sidebarWidth = collapsed ? 64 : 240;

  return (
    <div style={styles.wrapper}>
      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside style={{ ...styles.sidebar, width: sidebarWidth }}>
        {/* Logo */}
        <div style={styles.logoArea}>
          <FlaskConical size={22} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
          {!collapsed && (
            <div>
              <div style={styles.logoName}>ChemWatch</div>
              <div style={styles.logoSub}>Lab Inventory System</div>
            </div>
          )}
        </div>

        {/* User box */}
        {user && (
          <div style={{ ...styles.userBox, justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <div style={styles.userAvatar}>{initials}</div>
            {!collapsed && (
              <div style={styles.userInfo}>
                <div style={styles.userName}>{user.fullName}</div>
                <div style={styles.userRole}>{user.roleDisplayName}</div>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <nav style={styles.nav}>
          {sections.map((section, si) => (
            <div key={si}>
              {si > 0 && <div style={styles.separator} />}
              {section.label && !collapsed && (
                <p style={styles.sectionLabel}>{section.label}</p>
              )}
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  style={({ isActive }) => navLinkStyle(isActive, collapsed)}
                  title={collapsed ? item.label : undefined}
                >
                  <span style={styles.navIcon}>{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={styles.sidebarFooter}>
          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(prev => !prev)}
            style={styles.collapseBtn}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            {!collapsed && <span>Collapse</span>}
          </button>
          {/* Sign out */}
          <button onClick={logout} style={{ ...styles.logoutBtn, justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <LogOut size={16} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ── Main area ───────────────────────────────────────────── */}
      <div style={styles.mainArea}>
        {/* Top header */}
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <Breadcrumbs />
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
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
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

/* =========================================================================
   NavLink Style Helper
   ========================================================================= */

function navLinkStyle(isActive: boolean, collapsed: boolean): React.CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: collapsed ? '0' : '0.5rem',
    justifyContent: collapsed ? 'center' : 'flex-start',
    color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
    textDecoration: 'none',
    padding: collapsed ? '8px' : '7px 12px',
    borderRadius: '6px',
    fontSize: '0.8125rem',
    fontWeight: isActive ? 600 : 400,
    background: isActive ? 'var(--color-accent-soft)' : 'transparent',
    borderLeft: collapsed ? 'none' : (isActive ? '3px solid var(--color-accent)' : '3px solid transparent'),
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap',
  };
}

/* =========================================================================
   Styles
   ========================================================================= */

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    height: '100vh',
    background: 'var(--color-bg-primary)',
    fontFamily: 'var(--font-family-sans)',
  },

  // Sidebar
  sidebar: {
    background: 'var(--color-bg-sidebar)',
    borderRight: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    minHeight: 0,
    overflowY: 'auto',
    overflowX: 'hidden',
    transition: 'width 0.2s ease',
  },
  logoArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '16px',
    borderBottom: '1px solid var(--color-border)',
    minHeight: '56px',
  },
  logoName: {
    color: 'var(--color-text-primary)',
    fontSize: '1rem',
    fontWeight: 700,
    lineHeight: 1.2,
    whiteSpace: 'nowrap',
  },
  logoSub: {
    color: 'var(--color-text-tertiary)',
    fontSize: '0.6875rem',
    letterSpacing: '0.03em',
    whiteSpace: 'nowrap',
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
  navIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: '20px',
    height: '20px',
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
    padding: '8px',
    borderTop: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  collapseBtn: {
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderRadius: '6px',
    color: 'var(--color-text-tertiary)',
    fontSize: '0.75rem',
    fontWeight: 500,
    padding: '6px 12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    justifyContent: 'center',
    transition: 'all 0.15s ease',
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
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
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
  headerLeft: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
  },
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

  // Breadcrumbs
  breadcrumbNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '0',
    fontSize: '0.8125rem',
  },
  breadcrumbItem: {
    display: 'inline-flex',
    alignItems: 'center',
  },
  breadcrumbSep: {
    margin: '0 6px',
    color: 'var(--color-text-tertiary)',
    fontSize: '0.8rem',
  },
  breadcrumbLink: {
    color: 'var(--color-text-tertiary)',
    textDecoration: 'none',
    transition: 'color 0.15s ease',
  },
  breadcrumbCurrent: {
    color: 'var(--color-text-primary)',
    fontWeight: 500,
  },
};

export default MasterDataLayout;

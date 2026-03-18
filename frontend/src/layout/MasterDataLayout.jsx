import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/admin/locations', label: '📍 Locations & Labs' },
  { to: '/admin/roles', label: '👤 Roles' },
  { to: '/admin/vendors', label: '🏭 Vendors' },
  { to: '/admin/categories', label: '📂 Item Categories' },
  { to: '/admin/items', label: '🧪 Items' },
  { to: '/admin/item-lab-settings', label: '⚙️ Item Lab Settings' },
  { to: '/', label: '🔌 Connection Test' },
];

function MasterDataLayout() {
  return (
    <div style={styles.wrapper}>
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>🧪 ChemWatch</h2>
        <p style={styles.phase}>Phase 2 — Master Data</p>
        <nav style={styles.nav}>
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end
              style={({ isActive }) => ({
                ...styles.link,
                ...(isActive ? styles.activeLink : {}),
              })}
            >
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

const styles = {
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
    marginBottom: '1.25rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #334155',
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
  main: {
    flex: 1,
    padding: '2rem',
    overflowX: 'auto',
  },
};

export default MasterDataLayout;

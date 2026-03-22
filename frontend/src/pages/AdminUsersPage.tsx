import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUsers, resetPassword } from '../api/usersApi';
import type { UserResponse } from '../types/auth';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resetUserId, setResetUserId] = useState<string | null>(null);
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetMsg, setResetMsg] = useState('');
  const navigate = useNavigate();

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleResetPassword = async () => {
    if (!resetUserId || !resetNewPassword) return;
    try {
      const result = await resetPassword(resetUserId, { newPassword: resetNewPassword });
      setResetMsg(result.message);
      setResetNewPassword('');
      setTimeout(() => {
        setResetUserId(null);
        setResetMsg('');
      }, 2000);
    } catch {
      setResetMsg('Failed to reset password.');
    }
  };

  if (loading) return <div style={styles.loading}>Loading users...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>User Management</h1>
        <button onClick={() => navigate('/admin/users/create')} style={styles.createBtn}>
          + Create User
        </button>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Location Scope</th>
              <th style={styles.th}>Locations</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={styles.tr}>
                <td style={styles.td}>{user.fullName}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>
                  <span style={styles.badge}>{user.roleDisplayName}</span>
                </td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.scopeBadge,
                    background: user.locationScopeType === 'all' ? '#dbeafe' : '#fef3c7',
                    color: user.locationScopeType === 'all' ? '#1e40af' : '#92400e',
                  }}>
                    {user.locationScopeType.toUpperCase()}
                  </span>
                </td>
                <td style={styles.td}>
                  {user.locationScopeType === 'all'
                    ? 'All Locations'
                    : user.locations.map(l => l.code).join(', ') || '—'}
                </td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.statusBadge,
                    background: user.isActive ? '#dcfce7' : '#fee2e2',
                    color: user.isActive ? '#166534' : '#dc2626',
                  }}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={styles.actions}>
                    <Link to={`/admin/users/${user.id}/edit`} style={styles.actionLink}>Edit</Link>
                    <button
                      onClick={() => { setResetUserId(user.id); setResetMsg(''); }}
                      style={styles.actionBtn}
                    >
                      Reset PW
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reset Password Modal */}
      {resetUserId && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={{ margin: '0 0 1rem' }}>Reset Password</h3>
            <p style={{ fontSize: '0.9rem', color: '#666', margin: '0 0 1rem' }}>
              Enter new password for: <strong>{users.find(u => u.id === resetUserId)?.fullName}</strong>
            </p>
            {resetMsg && (
              <div style={{ ...styles.inlineMsg, color: resetMsg.includes('Failed') ? '#dc2626' : '#166534' }}>
                {resetMsg}
              </div>
            )}
            <input
              type="password"
              value={resetNewPassword}
              onChange={(e) => setResetNewPassword(e.target.value)}
              placeholder="New password"
              style={styles.input}
            />
            <div style={styles.modalActions}>
              <button onClick={handleResetPassword} style={styles.createBtn}>Reset</button>
              <button onClick={() => { setResetUserId(null); setResetMsg(''); }} style={styles.cancelBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: '1.5rem' },
  loading: { padding: '2rem', textAlign: 'center', color: '#666' },
  error: { padding: '1rem', color: '#dc2626', background: '#fee2e2', borderRadius: '8px', margin: '1rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  title: { fontSize: '1.5rem', fontWeight: 700, color: '#1a1a2e', margin: 0 },
  createBtn: {
    padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none',
    background: '#0f3460', color: '#fff', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
  },
  cancelBtn: {
    padding: '0.6rem 1.25rem', borderRadius: '8px', border: '1px solid #ddd',
    background: '#fff', color: '#333', fontSize: '0.9rem', cursor: 'pointer',
  },
  tableWrapper: { overflowX: 'auto' as const },
  table: { width: '100%', borderCollapse: 'collapse' as const, fontSize: '0.9rem' },
  th: {
    padding: '0.75rem 1rem', textAlign: 'left' as const, fontWeight: 600,
    color: '#555', borderBottom: '2px solid #e5e7eb', whiteSpace: 'nowrap' as const,
  },
  tr: { borderBottom: '1px solid #f3f4f6' },
  td: { padding: '0.75rem 1rem', verticalAlign: 'middle' as const },
  badge: {
    display: 'inline-block', padding: '0.25rem 0.6rem', borderRadius: '6px',
    background: '#ede9fe', color: '#5b21b6', fontSize: '0.8rem', fontWeight: 500,
  },
  scopeBadge: {
    display: 'inline-block', padding: '0.25rem 0.6rem', borderRadius: '6px',
    fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.5px',
  },
  statusBadge: {
    display: 'inline-block', padding: '0.25rem 0.6rem', borderRadius: '6px',
    fontSize: '0.8rem', fontWeight: 500,
  },
  actions: { display: 'flex', gap: '0.5rem', alignItems: 'center' },
  actionLink: {
    color: '#0f3460', textDecoration: 'none', fontWeight: 500, fontSize: '0.85rem',
  },
  actionBtn: {
    background: 'none', border: '1px solid #ddd', borderRadius: '6px', padding: '0.3rem 0.6rem',
    fontSize: '0.8rem', color: '#666', cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed' as const, top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 1000,
  },
  modal: { background: '#fff', borderRadius: '12px', padding: '2rem', width: '360px' },
  input: {
    width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1.5px solid #ddd',
    fontSize: '0.9rem', boxSizing: 'border-box' as const, marginBottom: '1rem',
  },
  modalActions: { display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' },
  inlineMsg: { fontSize: '0.85rem', marginBottom: '0.75rem', fontWeight: 500 },
};

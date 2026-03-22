import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUsers, resetPassword } from '../api/usersApi';
import type { UserResponse } from '../types/auth';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import StatusBadge from '../components/StatusBadge';

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
      setError('');
      const data = await getUsers();
      setUsers(data);
    } catch {
      setError('Failed to load users. Please check your connection and try again.');
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

  if (loading) return <LoadingState message="Loading users…" />;

  return (
    <div>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>User Management</h1>
          <p style={styles.pageSubtitle}>Manage accounts, roles, and location access.</p>
        </div>
        <button onClick={() => navigate('/admin/users/create')} style={styles.createBtn}>
          + Create User
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {users.length === 0 && !error ? (
        <EmptyState
          icon="👥"
          title="No Users Found"
          message="No user accounts have been created yet."
        />
      ) : (
        <div style={styles.tableWrapper}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Scope</th>
                <th>Locations</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{user.fullName}</td>
                  <td style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>{user.email}</td>
                  <td>
                    <span style={styles.roleBadge}>{user.roleDisplayName}</span>
                  </td>
                  <td>
                    <span style={{
                      ...styles.scopeBadge,
                      background: user.locationScopeType === 'all' ? 'var(--color-info-bg)' : 'var(--color-warning-bg)',
                      color: user.locationScopeType === 'all' ? 'var(--color-info)' : 'var(--color-warning)',
                    }}>
                      {user.locationScopeType === 'all' ? 'ALL' : 'SPECIFIC'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                    {user.locationScopeType === 'all'
                      ? 'All Locations'
                      : user.locations.map(l => l.code).join(', ') || '—'}
                  </td>
                  <td>
                    <StatusBadge status={user.isActive ? 'active' : 'inactive'} />
                  </td>
                  <td>
                    <div style={styles.actions}>
                      <Link to={`/admin/users/${user.id}/edit`} style={styles.actionLink}>Edit</Link>
                      <button
                        onClick={() => { setResetUserId(user.id); setResetMsg(''); }}
                        style={styles.resetBtn}
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
      )}

      {/* Reset Password Modal */}
      {resetUserId && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={{ margin: '0 0 0.75rem', color: 'var(--color-text-primary)', fontSize: '1rem' }}>
              Reset Password
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: '0 0 1rem' }}>
              Setting new password for: <strong>{users.find(u => u.id === resetUserId)?.fullName}</strong>
            </p>
            {resetMsg && (
              <div style={{
                ...styles.inlineMsg,
                color: resetMsg.includes('Failed') ? 'var(--color-danger)' : 'var(--color-success)',
                background: resetMsg.includes('Failed') ? 'var(--color-danger-bg)' : 'var(--color-success-bg)',
              }}>
                {resetMsg}
              </div>
            )}
            <input
              type="password"
              value={resetNewPassword}
              onChange={(e) => setResetNewPassword(e.target.value)}
              placeholder="New password"
              style={{ marginBottom: '1rem' }}
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
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
  },
  pageTitle: {
    fontSize: 'var(--text-xl)',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    margin: 0,
  },
  pageSubtitle: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
    marginTop: '4px',
  },
  createBtn: {
    background: 'var(--color-accent)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: 'var(--text-base)',
    whiteSpace: 'nowrap',
  },
  cancelBtn: {
    background: 'transparent',
    color: 'var(--color-text-secondary)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: 'var(--text-base)',
  },
  tableWrapper: { overflowX: 'auto' },
  roleBadge: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: '9999px',
    background: 'var(--color-accent-soft)',
    color: 'var(--color-accent)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
  },
  scopeBadge: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: '9999px',
    fontSize: 'var(--text-xs)',
    fontWeight: 700,
    letterSpacing: '0.05em',
  },
  actions: { display: 'flex', gap: '0.5rem', alignItems: 'center' },
  actionLink: {
    color: 'var(--color-accent)',
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: 'var(--text-sm)',
  },
  resetBtn: {
    background: 'transparent',
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
    padding: '4px 10px',
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    background: 'var(--color-bg-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: '12px',
    padding: '1.75rem',
    width: '380px',
    boxShadow: 'var(--shadow-md)',
  },
  modalActions: { display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' },
  inlineMsg: {
    fontSize: 'var(--text-sm)',
    marginBottom: '0.75rem',
    fontWeight: 500,
    padding: '8px 12px',
    borderRadius: '6px',
  },
};

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUsers, resetPassword } from '../api/usersApi';
import type { UserResponse } from '../types/auth';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import StatusBadge from '../components/StatusBadge';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import { Plus, Users, RotateCcw, Pencil } from 'lucide-react';

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
      <PageHeader
        title="User Management"
        subtitle="Manage accounts, roles, and location access."
        actions={
          <button onClick={() => navigate('/admin/users/create')} className="btn-primary">
            <Plus size={16} /> Create User
          </button>
        }
      />

      {error && <div className="error-banner">{error}</div>}

      {users.length === 0 && !error ? (
        <EmptyState
          icon={<Users size={40} strokeWidth={1.5} />}
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
                    <span className="badge" style={{
                      background: 'var(--color-accent-soft)',
                      color: 'var(--color-accent)',
                    }}>{user.roleDisplayName}</span>
                  </td>
                  <td>
                    <span className="badge" style={{
                      background: user.locationScopeType === 'all' ? 'var(--color-info-bg)' : 'var(--color-warning-bg)',
                      color: user.locationScopeType === 'all' ? 'var(--color-info)' : 'var(--color-warning)',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
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
                      <Link to={`/admin/users/${user.id}/edit`} style={styles.actionLink}>
                        <Pencil size={14} /> Edit
                      </Link>
                      <button
                        onClick={() => { setResetUserId(user.id); setResetMsg(''); }}
                        style={styles.resetBtn}
                      >
                        <RotateCcw size={12} /> Reset PW
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
      <Modal
        open={!!resetUserId}
        onClose={() => { setResetUserId(null); setResetMsg(''); }}
        title="Reset Password"
        footer={
          <>
            <button onClick={() => { setResetUserId(null); setResetMsg(''); }} className="btn-ghost">Cancel</button>
            <button onClick={handleResetPassword} className="btn-primary">Reset Password</button>
          </>
        }
      >
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: '0 0 1rem' }}>
          Setting new password for: <strong>{users.find(u => u.id === resetUserId)?.fullName}</strong>
        </p>
        {resetMsg && (
          <div style={{
            fontSize: 'var(--text-sm)',
            marginBottom: '0.75rem',
            fontWeight: 500,
            padding: '8px 12px',
            borderRadius: '6px',
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
        />
      </Modal>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  tableWrapper: { overflowX: 'auto' },
  actions: { display: 'flex', gap: '0.5rem', alignItems: 'center' },
  actionLink: {
    color: 'var(--color-accent)',
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: 'var(--text-sm)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  },
  resetBtn: {
    background: 'transparent',
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
    padding: '4px 10px',
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  },
};

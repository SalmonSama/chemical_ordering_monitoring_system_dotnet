import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUser, updateUser, getRoles, getLocations } from '../api/usersApi';
import type { RoleOption, LocationOption } from '../types/auth';

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [locations, setLocations] = useState<LocationOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    roleId: '',
    locationScopeType: 'specific',
    locationIds: [] as string[],
    isActive: true,
  });

  useEffect(() => {
    if (!id) return;
    Promise.all([getUser(id), getRoles(), getLocations()]).then(([user, r, l]) => {
      setRoles(r);
      setLocations(l);
      setEmail(user.email);
      setForm({
        fullName: user.fullName,
        roleId: user.roleId,
        locationScopeType: user.locationScopeType,
        locationIds: user.locations.map(loc => loc.id),
        isActive: user.isActive,
      });
      setLoading(false);
    }).catch(() => {
      setError('Failed to load user data.');
      setLoading(false);
    });
  }, [id]);

  const selectedRole = roles.find(r => r.id === form.roleId);
  const isAdmin = selectedRole?.name === 'admin';

  const handleLocationToggle = (locId: string) => {
    setForm(prev => ({
      ...prev,
      locationIds: prev.locationIds.includes(locId)
        ? prev.locationIds.filter(l => l !== locId)
        : [...prev.locationIds, locId],
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError('');
    setSaving(true);

    try {
      await updateUser(id, {
        ...form,
        locationScopeType: isAdmin ? 'all' : form.locationScopeType,
        locationIds: isAdmin || form.locationScopeType === 'all' ? [] : form.locationIds,
      });
      navigate('/admin/users');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || 'Failed to update user.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Edit User</h1>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.readonlyField}>
        <label style={styles.label}>Email</label>
        <div style={styles.readonlyValue}>{email}</div>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Full Name</label>
          <input
            value={form.fullName}
            onChange={(e) => setForm(prev => ({ ...prev, fullName: e.target.value }))}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Role</label>
          <select
            value={form.roleId}
            onChange={(e) => setForm(prev => ({ ...prev, roleId: e.target.value }))}
            style={styles.select}
          >
            {roles.map(r => (
              <option key={r.id} value={r.id}>{r.displayName}</option>
            ))}
          </select>
        </div>

        {!isAdmin && (
          <>
            <div style={styles.field}>
              <label style={styles.label}>Location Scope</label>
              <select
                value={form.locationScopeType}
                onChange={(e) => setForm(prev => ({ ...prev, locationScopeType: e.target.value }))}
                style={styles.select}
              >
                <option value="all">ALL — Access to all locations</option>
                <option value="specific">SPECIFIC — Assigned locations only</option>
              </select>
            </div>

            {form.locationScopeType === 'specific' && (
              <div style={styles.field}>
                <label style={styles.label}>Assigned Locations</label>
                <div style={styles.checkboxGroup}>
                  {locations.map(loc => (
                    <label key={loc.id} style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={form.locationIds.includes(loc.id)}
                        onChange={() => handleLocationToggle(loc.id)}
                      />
                      <span>{loc.code} — {loc.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {isAdmin && (
          <div style={styles.info}>
            Admin users automatically have access to all locations.
          </div>
        )}

        <div style={styles.field}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm(prev => ({ ...prev, isActive: e.target.checked }))}
            />
            <span>Active</span>
          </label>
        </div>

        <div style={styles.actions}>
          <button type="submit" disabled={saving} style={styles.submitBtn}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" onClick={() => navigate('/admin/users')} style={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: '1.5rem', maxWidth: '600px' },
  title: { fontSize: '1.5rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1.5rem' },
  error: { background: '#fee2e2', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' },
  form: { display: 'flex', flexDirection: 'column' as const, gap: '1.25rem' },
  field: { display: 'flex', flexDirection: 'column' as const, gap: '0.4rem' },
  readonlyField: { display: 'flex', flexDirection: 'column' as const, gap: '0.4rem', marginBottom: '1rem' },
  readonlyValue: { padding: '0.65rem', borderRadius: '8px', background: '#f3f4f6', color: '#666', fontSize: '0.9rem' },
  label: { fontSize: '0.85rem', fontWeight: 500, color: '#555' },
  input: { padding: '0.65rem', borderRadius: '8px', border: '1.5px solid #ddd', fontSize: '0.9rem' },
  select: { padding: '0.65rem', borderRadius: '8px', border: '1.5px solid #ddd', fontSize: '0.9rem', background: '#fff' },
  checkboxGroup: { display: 'flex', flexDirection: 'column' as const, gap: '0.5rem', padding: '0.5rem', background: '#f9fafb', borderRadius: '8px' },
  checkboxLabel: { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' },
  info: { background: '#dbeafe', color: '#1e40af', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem' },
  actions: { display: 'flex', gap: '0.75rem', marginTop: '0.5rem' },
  submitBtn: {
    padding: '0.7rem 1.5rem', borderRadius: '8px', border: 'none',
    background: '#0f3460', color: '#fff', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
  },
  cancelBtn: {
    padding: '0.7rem 1.5rem', borderRadius: '8px', border: '1px solid #ddd',
    background: '#fff', color: '#333', fontSize: '0.9rem', cursor: 'pointer',
  },
};

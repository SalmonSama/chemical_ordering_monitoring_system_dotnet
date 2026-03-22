import { useEffect, useState } from 'react';
import type { CSSProperties, ChangeEvent } from 'react';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { CartItem, Location, Lab, User, SubmitOrderRequest } from '../types/models';

interface CartPageProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

function CartPage({ cart, setCart }: CartPageProps): React.JSX.Element {
  const [locations, setLocations] = useState<Location[]>([]);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [locationId, setLocationId] = useState<string>('');
  const [labId, setLabId] = useState<string>('');
  const { user } = useAuth();
  const [userId, setUserId] = useState<string>(user?.id || '');
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      apiClient.get<Location[]>('/locations'),
      apiClient.get<User[]>('/users'),
    ])
      .then(([locRes, usersRes]) => {
        setLocations(locRes.data);
        setUsers(usersRes.data);
      })
      .catch(() => setError('Failed to load reference data'));
  }, []);

  // Compute labs when location changes
  useEffect(() => {
    const loc = locations.find(l => l.id === locationId);
    setLabs(loc?.labs ?? []);
    setLabId('');
  }, [locationId, locations]);

  // Pre-select user
  useEffect(() => {
    if (user && !userId) {
      setUserId(user.id);
    }
  }, [user, userId]);

  const updateQty = (itemId: string, qty: number): void => {
    if (qty <= 0) {
      setCart(prev => prev.filter(c => c.itemId !== itemId));
    } else {
      setCart(prev => prev.map(c => c.itemId === itemId ? { ...c, quantity: qty } : c));
    }
  };

  const updateNote = (itemId: string, note: string): void => {
    setCart(prev => prev.map(c => c.itemId === itemId ? { ...c, note } : c));
  };

  const removeItem = (itemId: string): void => {
    setCart(prev => prev.filter(c => c.itemId !== itemId));
  };

  const handleSubmit = async (): Promise<void> => {
    if (cart.length === 0) { setError('Cart is empty.'); return; }
    if (!locationId) { setError('Please select a location.'); return; }
    if (!labId) { setError('Please select a lab.'); return; }
    if (!userId) { setError('Please select who is submitting.'); return; }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const payload: SubmitOrderRequest = {
      requestedBy: userId,
      labId,
      locationId,
      orderNotes: orderNotes || null,
      items: cart.map(c => ({
        itemId: c.itemId,
        vendorId: c.vendorId,
        quantity: c.quantity,
        note: c.note || null,
      })),
    };

    try {
      const res = await apiClient.post('/orders', payload);
      const poNumber = res.data?.poNumber ?? 'N/A';
      setSuccess(`✅ Order submitted successfully! PO Number: ${poNumber}`);
      setCart([]);
      setOrderNotes('');
    } catch (err) {
      const axiosErr = err as { response?: { data?: { error?: string } }; message?: string };
      setError('Submit failed: ' + (axiosErr.response?.data?.error ?? axiosErr.message ?? 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 style={styles.title}>Review Cart</h1>
      <p style={styles.subtitle}>Review your items before submitting the order.</p>

      {success && <div style={styles.successBox}>{success}</div>}
      {error && <div style={styles.errorBox}>❌ {error}</div>}

      {cart.length === 0 && !success && (
        <p style={styles.info}>Your cart is empty. Go to the Catalog to add items.</p>
      )}

      {cart.length > 0 && (
        <>
          {/* Cart items table */}
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Item</th>
                  <th style={styles.th}>Vendor</th>
                  <th style={styles.th}>Qty</th>
                  <th style={styles.th}>Unit</th>
                  <th style={styles.th}>Note</th>
                  <th style={styles.th}></th>
                </tr>
              </thead>
              <tbody>
                {cart.map(c => (
                  <tr key={c.itemId}>
                    <td style={styles.td}>{c.itemName}</td>
                    <td style={styles.td}>{c.vendorName ?? '—'}</td>
                    <td style={styles.td}>
                      <input
                        type="number"
                        min="1"
                        step="any"
                        value={c.quantity}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => updateQty(c.itemId, parseFloat(e.target.value) || 0)}
                        style={styles.qtyInput}
                      />
                    </td>
                    <td style={styles.td}>{c.unit}</td>
                    <td style={styles.td}>
                      <input
                        type="text"
                        value={c.note}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => updateNote(c.itemId, e.target.value)}
                        style={styles.noteInput}
                        placeholder="Optional note"
                      />
                    </td>
                    <td style={styles.td}>
                      <button onClick={() => removeItem(c.itemId)} style={styles.removeBtn}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Order context selectors */}
          <div style={styles.formSection}>
            <h3 style={styles.formTitle}>Order Details</h3>
            <div style={styles.formRow}>
              <label style={styles.formField}>
                <span style={styles.label}>Location *</span>
                <select value={locationId} onChange={e => setLocationId(e.target.value)} style={styles.select}>
                  <option value="">— Select —</option>
                  {locations.map(l => <option key={l.id} value={l.id}>{l.name} ({l.code})</option>)}
                </select>
              </label>
              <label style={styles.formField}>
                <span style={styles.label}>Lab *</span>
                <select value={labId} onChange={e => setLabId(e.target.value)} style={styles.select} disabled={!locationId}>
                  <option value="">— Select —</option>
                  {labs.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </label>
              <label style={styles.formField}>
                <span style={styles.label}>Requester *</span>
                <select value={userId} onChange={e => setUserId(e.target.value)} style={styles.select}>
                  <option value="">— Select —</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.fullName}</option>)}
                </select>
              </label>
            </div>
            <label style={{ ...styles.formField, maxWidth: '600px' }}>
              <span style={styles.label}>Order Notes (optional)</span>
              <textarea
                value={orderNotes}
                onChange={e => setOrderNotes(e.target.value)}
                style={{ ...styles.select, minHeight: '50px', resize: 'vertical' }}
                placeholder="Optional order-level notes..."
              />
            </label>

            <button onClick={handleSubmit} disabled={submitting} style={styles.submitBtn}>
              {submitting ? '⏳ Submitting...' : '📤 Submit Order'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  title: { color: 'var(--color-text-primary)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' },
  subtitle: { color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' },
  info: { color: 'var(--color-text-secondary)', fontStyle: 'italic' },
  successBox: {
    background: 'var(--color-success-bg)', border: '1px solid var(--color-success-bg)',
    borderRadius: '8px', padding: '0.75rem 1rem', color: 'var(--color-success)', marginBottom: '1rem', fontWeight: 600,
  },
  errorBox: {
    background: 'var(--color-danger-bg)', border: '1px solid var(--color-danger-bg)',
    borderRadius: '8px', padding: '0.75rem 1rem', color: 'var(--color-danger)', marginBottom: '1rem',
  },
  tableWrapper: { overflowX: 'auto', marginBottom: '1.5rem' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '0.6rem 0.75rem', color: 'var(--color-text-tertiary)', borderBottom: '1px solid var(--color-border)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
  td: { padding: '0.5rem 0.75rem', color: 'var(--color-text-primary)', borderBottom: '1px solid var(--color-bg-surface)' },
  qtyInput: {
    width: '70px', background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)',
    borderRadius: '6px', padding: '0.3rem 0.5rem', fontSize: '0.9rem', textAlign: 'right',
  },
  noteInput: {
    width: '160px', background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)',
    borderRadius: '6px', padding: '0.3rem 0.5rem', fontSize: '0.85rem',
  },
  removeBtn: {
    background: 'var(--color-danger-bg)', color: 'var(--color-danger)', border: 'none',
    borderRadius: '6px', padding: '0.3rem 0.6rem', cursor: 'pointer', fontSize: '0.85rem',
  },
  formSection: {
    background: 'var(--color-bg-surface)', borderRadius: '12px', border: '1px solid var(--color-border)',
    padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem',
  },
  formTitle: { color: 'var(--color-text-primary)', fontSize: '1rem', fontWeight: 600, margin: 0 },
  formRow: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
  formField: { display: 'flex', flexDirection: 'column', gap: '0.3rem', flex: 1, minWidth: '160px' },
  label: { color: 'var(--color-text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' },
  select: {
    background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)', borderRadius: '8px',
    padding: '0.5rem 0.75rem', fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box',
  },
  submitBtn: {
    background: 'linear-gradient(135deg, var(--color-accent), #6366f1)', color: '#fff', border: 'none',
    borderRadius: '8px', padding: '0.7rem 1.5rem', fontSize: '0.95rem', fontWeight: 600,
    cursor: 'pointer', alignSelf: 'flex-start', marginTop: '0.5rem',
  },
};

export default CartPage;

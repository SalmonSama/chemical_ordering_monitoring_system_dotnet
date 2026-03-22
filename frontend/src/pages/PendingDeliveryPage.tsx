import { useEffect, useState } from 'react';
import type { CSSProperties, ChangeEvent } from 'react';
import apiClient from '../api/client';
import type { PendingDeliveryItem, PendingDeliveryCheckInRequest, User } from '../types/models';

interface CheckInForm {
  lotNumber: string;
  quantity: string;
  expiryDate: string;
  storageSublocation: string;
  notes: string;
}

const emptyForm: CheckInForm = { lotNumber: '', quantity: '', expiryDate: '', storageSublocation: '', notes: '' };

function PendingDeliveryPage(): React.JSX.Element {
  const [items, setItems] = useState<PendingDeliveryItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [form, setForm] = useState<CheckInForm>(emptyForm);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [msg, setMsg] = useState<string | null>(null);

  const fetchData = (): void => {
    setLoading(true);
    Promise.all([
      apiClient.get<PendingDeliveryItem[]>('/checkin/pending-delivery'),
      apiClient.get<User[]>('/users'),
    ])
      .then(([itemsRes, usersRes]) => {
        setItems(itemsRes.data);
        setUsers(usersRes.data);
        setError(null);
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const openForm = (itemId: string, remaining: number): void => {
    setActiveId(itemId);
    setForm({ ...emptyForm, quantity: String(remaining) });
    setMsg(null);
  };

  const updateField = (field: keyof CheckInForm, value: string): void => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckIn = async (): Promise<void> => {
    if (!activeId || !userId) { setMsg('Select a user first.'); return; }
    const qty = parseFloat(form.quantity);
    if (!qty || qty <= 0) { setMsg('Quantity must be > 0.'); return; }
    if (!form.lotNumber.trim()) { setMsg('Lot number is required.'); return; }

    setSubmitting(true);
    setMsg(null);

    const payload: PendingDeliveryCheckInRequest = {
      purchaseRequestItemId: activeId,
      receivedQuantity: qty,
      lotNumber: form.lotNumber.trim(),
      expiryDate: form.expiryDate || null,
      storageSublocation: form.storageSublocation.trim() || null,
      notes: form.notes.trim() || null,
      performedByUserId: userId,
    };

    try {
      const res = await apiClient.post('/checkin/from-pending-delivery', payload);
      const data = res.data as { message: string; lineItem?: { status: string; remaining: number }; orderStatus?: string };
      const lineStatus = data.lineItem?.status ?? '';
      const orderStatus = data.orderStatus ?? '';
      setMsg(`✅ ${data.message} Line item: ${lineStatus}. Order: ${orderStatus}.`);
      setActiveId(null);
      setForm(emptyForm);
      fetchData();
    } catch (err) {
      const axiosErr = err as { response?: { data?: { error?: string } }; message?: string };
      setMsg('❌ ' + (axiosErr.response?.data?.error ?? axiosErr.message ?? 'Error'));
    } finally {
      setSubmitting(false);
    }
  };

  const sc = (status: string): { color: string; bg: string } => {
    if (status === 'partially_received') return { color: 'var(--color-warning)', bg: 'rgba(251, 191, 36, 0.1)' };
    if (status === 'fully_received') return { color: 'var(--color-success)', bg: 'var(--color-success-bg)' };
    return { color: 'var(--color-text-secondary)', bg: 'rgba(148, 163, 184, 0.1)' };
  };

  return (
    <div>
      <h1 style={styles.title}>Pending Delivery Check-In</h1>
      <p style={styles.subtitle}>Receive items from approved purchase orders into inventory.</p>

      {msg && <div style={msg.startsWith('✅') ? styles.successBox : styles.errorBox}>{msg}</div>}

      {/* User selector */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={styles.inlineLabel}>
          Performing as:
          <select value={userId} onChange={e => setUserId(e.target.value)} style={styles.selectInline}>
            <option value="">— Select user —</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.fullName}</option>)}
          </select>
        </label>
      </div>

      {loading && <p style={styles.info}>Loading...</p>}
      {error && <p style={styles.error}>❌ {error}</p>}

      {/* Check-in form (inline panel) */}
      {activeId && (
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <h3 style={{ color: 'var(--color-text-primary)', margin: 0 }}>
              Check In: {items.find(i => i.purchaseRequestItemId === activeId)?.itemName ?? ''}
            </h3>
            <button onClick={() => { setActiveId(null); setMsg(null); }} style={styles.closeBtn}>✕ Close</button>
          </div>
          <div style={styles.formRow}>
            <label style={styles.formField}>
              <span style={styles.label}>Lot Number *</span>
              <input type="text" value={form.lotNumber} onChange={(e: ChangeEvent<HTMLInputElement>) => updateField('lotNumber', e.target.value)} style={styles.input} />
            </label>
            <label style={styles.formField}>
              <span style={styles.label}>Quantity *</span>
              <input type="number" min="0.001" step="any" value={form.quantity} onChange={(e: ChangeEvent<HTMLInputElement>) => updateField('quantity', e.target.value)} style={styles.input} />
            </label>
            <label style={styles.formField}>
              <span style={styles.label}>Expiry Date</span>
              <input type="date" value={form.expiryDate} onChange={(e: ChangeEvent<HTMLInputElement>) => updateField('expiryDate', e.target.value)} style={styles.input} />
            </label>
            <label style={styles.formField}>
              <span style={styles.label}>Storage Location</span>
              <input type="text" value={form.storageSublocation} onChange={(e: ChangeEvent<HTMLInputElement>) => updateField('storageSublocation', e.target.value)} style={styles.input} placeholder="e.g. Cabinet A2" />
            </label>
            <label style={styles.formField}>
              <span style={styles.label}>Notes</span>
              <input type="text" value={form.notes} onChange={(e: ChangeEvent<HTMLInputElement>) => updateField('notes', e.target.value)} style={styles.input} placeholder="Optional" />
            </label>
          </div>
          <button onClick={handleCheckIn} disabled={submitting || !userId} style={styles.checkInBtn}>
            {submitting ? '⏳ Processing...' : '📥 Confirm Check-In'}
          </button>
        </div>
      )}

      {/* Pending items table */}
      {!loading && !error && items.length === 0 && (
        <p style={styles.info}>No pending delivery items at this time.</p>
      )}

      {!loading && !error && items.length > 0 && (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>PO #</th>
                <th style={styles.th}>Item</th>
                <th style={styles.th}>Vendor</th>
                <th style={styles.th}>Lab</th>
                <th style={styles.th}>Ordered</th>
                <th style={styles.th}>Received</th>
                <th style={styles.th}>Remaining</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}></th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const { color, bg } = sc(item.status);
                return (
                  <tr key={item.purchaseRequestItemId}>
                    <td style={styles.td}><code style={styles.code}>{item.poNumber}</code></td>
                    <td style={styles.td}>{item.itemName}</td>
                    <td style={styles.td}>{item.vendorName ?? '—'}</td>
                    <td style={styles.td}>{item.labName} / {item.locationName}</td>
                    <td style={styles.tdNum}>{item.quantityOrdered} {item.unit}</td>
                    <td style={styles.tdNum}>{item.quantityReceived} {item.unit}</td>
                    <td style={styles.tdNum}>{item.quantityRemaining} {item.unit}</td>
                    <td style={styles.td}>
                      <span style={{ color, background: bg, padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize' }}>
                        {item.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button
                        onClick={() => openForm(item.purchaseRequestItemId, item.quantityRemaining)}
                        style={styles.receiveBtn}
                        disabled={activeId === item.purchaseRequestItemId}
                      >
                        📥 Receive
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  title: { color: 'var(--color-text-primary)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' },
  subtitle: { color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' },
  info: { color: 'var(--color-text-secondary)', fontStyle: 'italic' },
  error: { color: 'var(--color-danger)' },
  successBox: {
    background: 'var(--color-success-bg)', border: '1px solid var(--color-success-bg)',
    borderRadius: '8px', padding: '0.75rem 1rem', color: 'var(--color-success)', marginBottom: '1rem', fontWeight: 600,
  },
  errorBox: {
    background: 'var(--color-danger-bg)', border: '1px solid var(--color-danger-bg)',
    borderRadius: '8px', padding: '0.75rem 1rem', color: 'var(--color-danger)', marginBottom: '1rem',
  },
  inlineLabel: { color: 'var(--color-text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
  selectInline: {
    background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)', borderRadius: '6px',
    padding: '0.3rem 0.5rem', fontSize: '0.85rem',
  },
  panel: {
    background: 'var(--color-bg-surface)', borderRadius: '12px', border: '1px solid var(--color-border)',
    padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem',
  },
  panelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  closeBtn: { background: 'rgba(148, 163, 184, 0.15)', color: 'var(--color-text-secondary)', border: 'none', borderRadius: '6px', padding: '0.3rem 0.7rem', cursor: 'pointer' },
  formRow: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
  formField: { display: 'flex', flexDirection: 'column', gap: '0.3rem', flex: 1, minWidth: '140px' },
  label: { color: 'var(--color-text-secondary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' },
  input: {
    background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)', borderRadius: '8px',
    padding: '0.5rem 0.75rem', fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box',
  },
  checkInBtn: {
    background: 'linear-gradient(135deg, #059669, #10b981)', color: '#fff', border: 'none',
    borderRadius: '8px', padding: '0.6rem 1.2rem', fontSize: '0.9rem', fontWeight: 600,
    cursor: 'pointer', alignSelf: 'flex-start',
  },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '0.6rem 0.75rem', color: 'var(--color-text-tertiary)', borderBottom: '1px solid var(--color-border)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' },
  td: { padding: '0.5rem 0.75rem', color: 'var(--color-text-primary)', fontSize: '0.9rem', whiteSpace: 'nowrap' },
  tdNum: { padding: '0.5rem 0.75rem', color: 'var(--color-text-primary)', fontSize: '0.9rem', textAlign: 'right', fontVariantNumeric: 'tabular-nums' },
  code: { color: 'var(--color-accent-hover)', background: 'var(--color-bg-primary)', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.85rem' },
  receiveBtn: {
    background: 'linear-gradient(135deg, var(--color-accent), #6366f1)', color: '#fff', border: 'none',
    borderRadius: '6px', padding: '0.35rem 0.8rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
  },
};

export default PendingDeliveryPage;

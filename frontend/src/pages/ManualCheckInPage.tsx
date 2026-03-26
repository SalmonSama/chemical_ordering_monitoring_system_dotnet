import { useEffect, useState } from 'react';
import type { CSSProperties, ChangeEvent, FormEvent } from 'react';
import apiClient from '../api/client';
import type {
  Item,
  Location,
  Lab,
  Vendor,
  User,
  ManualCheckInFormState,
  ManualCheckInRequest,
  ManualCheckInResponse,
} from '../types/models';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';

interface SourceReasonOption {
  value: string;
  label: string;
}

const INITIAL_FORM: ManualCheckInFormState = {
  itemId: '',
  labId: '',
  locationId: '',
  vendorId: '',
  lotNumber: '',
  quantity: '',
  unit: '',
  expiryDate: '',
  manufactureDate: '',
  storageSublocation: '',
  sourceReason: '',
  notes: '',
  performedByUserId: '',
};

const SOURCE_REASONS: SourceReasonOption[] = [
  { value: 'donation', label: 'Donation' },
  { value: 'transfer', label: 'Transfer' },
  { value: 'direct_delivery', label: 'Direct Delivery' },
  { value: 'other', label: 'Other' },
];

function ManualCheckInPage(): React.JSX.Element {
  const [form, setForm] = useState<ManualCheckInFormState>(INITIAL_FORM);
  const [items, setItems] = useState<Item[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<ManualCheckInResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch reference data on mount
  useEffect(() => {
    Promise.all([
      apiClient.get<Item[]>('/items'),
      apiClient.get<Location[]>('/locations'),
      apiClient.get<Vendor[]>('/vendors'),
      apiClient.get<User[]>('/users'),
    ])
      .then(([itemsRes, locRes, vendorsRes, usersRes]) => {
        let filteredLocs = locRes.data;
        if (user && user.locationScopeType === 'specific') {
          const allowedSet = new Set(user.locations.map(l => l.id));
          filteredLocs = filteredLocs.filter(l => allowedSet.has(l.id));
        }
        setItems(itemsRes.data);
        setLocations(filteredLocs);
        setVendors(vendorsRes.data);
        setUsers(usersRes.data);
      })
      .catch(err => setError('Failed to load reference data: ' + (err instanceof Error ? err.message : String(err))));
  }, []);

  // When location changes, compute available labs
  useEffect(() => {
    const loc = locations.find(l => l.id === form.locationId);
    setLabs(loc?.labs ?? []);
    if (loc && !loc.labs?.find(l => l.id === form.labId)) {
      setForm(f => ({ ...f, labId: '' }));
    }
  }, [form.locationId, locations]);

  // When item changes, auto-fill unit
  useEffect(() => {
    const item = items.find(i => i.id === form.itemId);
    if (item) {
      setForm(f => ({ ...f, unit: item.unit }));
    }
  }, [form.itemId, items]);

  const onChange = (field: keyof ManualCheckInFormState) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    setForm(f => ({ ...f, [field]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    setError(null);

    const payload: ManualCheckInRequest = {
      itemId: form.itemId,
      labId: form.labId,
      locationId: form.locationId,
      vendorId: form.vendorId || null,
      lotNumber: form.lotNumber,
      quantity: parseFloat(form.quantity),
      unit: form.unit,
      expiryDate: form.expiryDate || null,
      manufactureDate: form.manufactureDate || null,
      storageSublocation: form.storageSublocation || null,
      sourceReason: form.sourceReason || null,
      notes: form.notes || null,
      performedByUserId: form.performedByUserId,
    };

    try {
      const res = await apiClient.post<ManualCheckInResponse>('/checkin/manual', payload);
      setResult(res.data);
      setForm(INITIAL_FORM);
    } catch (err) {
      const axiosErr = err as { response?: { data?: { error?: string } }; message?: string };
      const msg = axiosErr.response?.data?.error || axiosErr.message || 'Unknown error';
      setError('Check-in failed: ' + msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 style={styles.title}>Manual Check-In</h1>
      <p style={styles.subtitle}>
        Register items received outside the ordering workflow (donations, transfers, direct deliveries).
      </p>

      {error && <div style={styles.errorBox}>❌ {error}</div>}

      {result && (
        <div style={styles.successBox}>
          <p style={{ margin: 0, fontWeight: 600 }}>✅ Check-in completed successfully</p>
          <p style={{ margin: '0.5rem 0 0', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
            Lot <strong style={{ color: 'var(--color-accent-hover)' }}>{result.inventoryLot.lotNumber}</strong> created
            — {result.inventoryLot.quantityReceived} received
            — Status: <StatusBadge status={result.inventoryLot.status} />
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Row 1: Item + User */}
        <div style={styles.row}>
          <label style={styles.fieldBlock}>
            <span style={styles.label}>Item *</span>
            <select value={form.itemId} onChange={onChange('itemId')} required>
              <option value="">— Select item —</option>
              {items.map(i => (
                <option key={i.id} value={i.id}>{i.itemName} ({i.unit})</option>
              ))}
            </select>
          </label>
          <label style={styles.fieldBlock}>
            <span style={styles.label}>Performed By *</span>
            <select value={form.performedByUserId} onChange={onChange('performedByUserId')} required>
              <option value="">— Select user —</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.fullName}</option>
              ))}
            </select>
          </label>
        </div>

        {/* Row 2: Location + Lab */}
        <div style={styles.row}>
          <label style={styles.fieldBlock}>
            <span style={styles.label}>Location *</span>
            <select value={form.locationId} onChange={onChange('locationId')} required>
              <option value="">— Select location —</option>
              {locations.map(l => (
                <option key={l.id} value={l.id}>{l.name} ({l.code})</option>
              ))}
            </select>
          </label>
          <label style={styles.fieldBlock}>
            <span style={styles.label}>Lab *</span>
            <select value={form.labId} onChange={onChange('labId')} required disabled={!form.locationId}>
              <option value="">— Select lab —</option>
              {labs.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </label>
        </div>

        {/* Row 3: Vendor + Source Reason */}
        <div style={styles.row}>
          <label style={styles.fieldBlock}>
            <span style={styles.label}>Vendor (optional)</span>
            <select value={form.vendorId} onChange={onChange('vendorId')}>
              <option value="">— None —</option>
              {vendors.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </label>
          <label style={styles.fieldBlock}>
            <span style={styles.label}>Source / Reason</span>
            <select value={form.sourceReason} onChange={onChange('sourceReason')}>
              <option value="">— None —</option>
              {SOURCE_REASONS.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </label>
        </div>

        {/* Row 4: Lot #, Qty */}
        <div style={styles.row}>
          <label style={styles.fieldBlock}>
            <span style={styles.label}>Lot Number *</span>
            <input type="text" value={form.lotNumber} onChange={onChange('lotNumber')} required placeholder="e.g. LOT-2026-001" />
          </label>
          <label style={{ ...styles.fieldBlock, maxWidth: '140px' }}>
            <span style={styles.label}>Quantity *</span>
            <input type="number" min="0.001" step="any" value={form.quantity} onChange={onChange('quantity')} required placeholder="0.00" />
          </label>

        </div>

        {/* Row 5: Dates */}
        <div style={styles.row}>
          <label style={styles.fieldBlock}>
            <span style={styles.label}>Expiry Date</span>
            <input type="date" value={form.expiryDate} onChange={onChange('expiryDate')} />
          </label>
          <label style={styles.fieldBlock}>
            <span style={styles.label}>Manufacture Date</span>
            <input type="date" value={form.manufactureDate} onChange={onChange('manufactureDate')} />
          </label>
          <label style={styles.fieldBlock}>
            <span style={styles.label}>Storage Sublocation</span>
            <input type="text" value={form.storageSublocation} onChange={onChange('storageSublocation')} placeholder="e.g. Cabinet A3" />
          </label>
        </div>

        {/* Row 6: Notes */}
        <label style={{ ...styles.fieldBlock, width: '100%' }}>
          <span style={styles.label}>Notes</span>
          <textarea value={form.notes} onChange={onChange('notes')} style={{ minHeight: '60px', resize: 'vertical' }} placeholder="Optional notes..." />
        </label>

        <button type="submit" disabled={submitting} className="btn-primary" style={{ marginTop: '0.5rem', alignSelf: 'flex-start' }}>
          {submitting ? '⏳ Processing...' : '📥 Submit Check-In'}
        </button>
      </form>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  title: { color: 'var(--color-text-primary)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' },
  subtitle: { color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px' },
  row: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
  fieldBlock: { display: 'flex', flexDirection: 'column', gap: '0.3rem', flex: 1, minWidth: '180px' },
  label: { color: 'var(--color-text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' },
  errorBox: {
    background: 'var(--color-danger-bg)', border: '1px solid var(--color-danger-bg)', borderRadius: '8px',
    padding: '0.75rem 1rem', color: 'var(--color-danger)', marginBottom: '1rem', fontSize: '0.9rem',
  },
  successBox: {
    background: 'var(--color-success-bg)', border: '1px solid var(--color-success-bg)', borderRadius: '8px',
    padding: '0.75rem 1rem', color: 'var(--color-success)', marginBottom: '1rem',
  },
};

export default ManualCheckInPage;

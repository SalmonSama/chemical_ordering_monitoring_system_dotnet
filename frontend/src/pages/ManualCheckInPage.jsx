import { useEffect, useState } from 'react';
import apiClient from '../api/client';

const INITIAL_FORM = {
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

const SOURCE_REASONS = [
  { value: 'donation', label: 'Donation' },
  { value: 'transfer', label: 'Transfer' },
  { value: 'direct_delivery', label: 'Direct Delivery' },
  { value: 'other', label: 'Other' },
];

function ManualCheckInPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [items, setItems] = useState([]);
  const [locations, setLocations] = useState([]);
  const [labs, setLabs] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [users, setUsers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Fetch reference data on mount
  useEffect(() => {
    Promise.all([
      apiClient.get('/items'),
      apiClient.get('/locations'),
      apiClient.get('/vendors'),
      apiClient.get('/users'),
    ])
      .then(([itemsRes, locRes, vendorsRes, usersRes]) => {
        setItems(itemsRes.data);
        setLocations(locRes.data);
        setVendors(vendorsRes.data);
        setUsers(usersRes.data);
      })
      .catch(err => setError('Failed to load reference data: ' + err.message));
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

  const onChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    setError(null);

    const payload = {
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
      const res = await apiClient.post('/checkin/manual', payload);
      setResult(res.data);
      setForm(INITIAL_FORM);
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
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
          <p style={{ margin: '0.5rem 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>
            Lot <strong style={{ color: '#60a5fa' }}>{result.inventoryLot.lotNumber}</strong> created
            — {result.inventoryLot.quantityReceived} {result.inventoryLot.unit}
            — Status: <span style={styles.statusBadge}>{result.inventoryLot.status}</span>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Row 1: Item + User */}
        <div style={styles.row}>
          <label style={styles.fieldBlock}>
            <span style={styles.label}>Item *</span>
            <select value={form.itemId} onChange={onChange('itemId')} required style={styles.select}>
              <option value="">— Select item —</option>
              {items.map(i => (
                <option key={i.id} value={i.id}>{i.itemName} ({i.unit})</option>
              ))}
            </select>
          </label>
          <label style={styles.fieldBlock}>
            <span style={styles.label}>Performed By *</span>
            <select value={form.performedByUserId} onChange={onChange('performedByUserId')} required style={styles.select}>
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
            <select value={form.locationId} onChange={onChange('locationId')} required style={styles.select}>
              <option value="">— Select location —</option>
              {locations.map(l => (
                <option key={l.id} value={l.id}>{l.name} ({l.code})</option>
              ))}
            </select>
          </label>
          <label style={styles.fieldBlock}>
            <span style={styles.label}>Lab *</span>
            <select value={form.labId} onChange={onChange('labId')} required style={styles.select} disabled={!form.locationId}>
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
            <select value={form.vendorId} onChange={onChange('vendorId')} style={styles.select}>
              <option value="">— None —</option>
              {vendors.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </label>
          <label style={styles.fieldBlock}>
            <span style={styles.label}>Source / Reason</span>
            <select value={form.sourceReason} onChange={onChange('sourceReason')} style={styles.select}>
              <option value="">— None —</option>
              {SOURCE_REASONS.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </label>
        </div>

        {/* Row 4: Lot #, Qty, Unit */}
        <div style={styles.row}>
          <label style={styles.fieldBlock}>
            <span style={styles.label}>Lot Number *</span>
            <input type="text" value={form.lotNumber} onChange={onChange('lotNumber')} required style={styles.input} placeholder="e.g. LOT-2026-001" />
          </label>
          <label style={{ ...styles.fieldBlock, maxWidth: '140px' }}>
            <span style={styles.label}>Quantity *</span>
            <input type="number" min="0.001" step="any" value={form.quantity} onChange={onChange('quantity')} required style={styles.input} placeholder="0.00" />
          </label>
          <label style={{ ...styles.fieldBlock, maxWidth: '100px' }}>
            <span style={styles.label}>Unit</span>
            <input type="text" value={form.unit} onChange={onChange('unit')} style={styles.input} readOnly />
          </label>
        </div>

        {/* Row 5: Dates */}
        <div style={styles.row}>
          <label style={styles.fieldBlock}>
            <span style={styles.label}>Expiry Date</span>
            <input type="date" value={form.expiryDate} onChange={onChange('expiryDate')} style={styles.input} />
          </label>
          <label style={styles.fieldBlock}>
            <span style={styles.label}>Manufacture Date</span>
            <input type="date" value={form.manufactureDate} onChange={onChange('manufactureDate')} style={styles.input} />
          </label>
          <label style={styles.fieldBlock}>
            <span style={styles.label}>Storage Sublocation</span>
            <input type="text" value={form.storageSublocation} onChange={onChange('storageSublocation')} style={styles.input} placeholder="e.g. Cabinet A3" />
          </label>
        </div>

        {/* Row 6: Notes */}
        <label style={{ ...styles.fieldBlock, width: '100%' }}>
          <span style={styles.label}>Notes</span>
          <textarea value={form.notes} onChange={onChange('notes')} style={{ ...styles.input, minHeight: '60px', resize: 'vertical' }} placeholder="Optional notes..." />
        </label>

        <button type="submit" disabled={submitting} style={styles.submitBtn}>
          {submitting ? '⏳ Processing...' : '📥 Submit Check-In'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  title: { color: '#f1f5f9', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' },
  subtitle: { color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px' },
  row: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
  fieldBlock: { display: 'flex', flexDirection: 'column', gap: '0.3rem', flex: 1, minWidth: '180px' },
  label: { color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' },
  input: {
    background: '#1e293b', color: '#e2e8f0', border: '1px solid #334155', borderRadius: '8px',
    padding: '0.55rem 0.75rem', fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box',
  },
  select: {
    background: '#1e293b', color: '#e2e8f0', border: '1px solid #334155', borderRadius: '8px',
    padding: '0.55rem 0.75rem', fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box',
  },
  submitBtn: {
    background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#fff', border: 'none', borderRadius: '8px',
    padding: '0.7rem 1.5rem', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', alignSelf: 'flex-start',
    marginTop: '0.5rem', transition: 'opacity 0.2s ease',
  },
  errorBox: {
    background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px',
    padding: '0.75rem 1rem', color: '#f87171', marginBottom: '1rem', fontSize: '0.9rem',
  },
  successBox: {
    background: 'rgba(52, 211, 153, 0.08)', border: '1px solid rgba(52, 211, 153, 0.25)', borderRadius: '8px',
    padding: '0.75rem 1rem', color: '#34d399', marginBottom: '1rem',
  },
  statusBadge: {
    background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', padding: '0.15rem 0.5rem', borderRadius: '4px',
    fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize',
  },
};

export default ManualCheckInPage;

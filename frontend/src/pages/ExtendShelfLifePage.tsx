import { useState, useEffect } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import apiClient from '../api/client';
import type { User } from '../types/models';

interface LotLookupResult {
  id: string;
  itemId: string;
  itemName: string;
  labName: string;
  locationName: string;
  vendorName: string | null;
  lotNumber: string;
  quantityRemaining: number;
  unit: string;
  expiryDate: string | null;
  daysToExpiry: number | null;
  status: string;
  extensionCount: number;
  openDate: string | null;
}

interface ExtensionHistory {
  id: string;
  extensionNumber: number;
  previousExpiryDate: string | null;
  newExpiryDate: string;
  previousDaysToExpiry: number | null;
  newDaysToExpiry: number;
  extensionDays: number;
  reason: string;
  testPerformed: string;
  testResult: string;
  testDate: string;
  authorizedBy: string;
  createdAt: string;
}

interface ExtendForm {
  newExpiryDate: string;
  reason: string;
  testPerformed: string;
  testResult: string;
  testDate: string;
}

const emptyForm: ExtendForm = {
  newExpiryDate: '',
  reason: '',
  testPerformed: '',
  testResult: '',
  testDate: new Date().toISOString().substring(0, 10),
};

function ExtendShelfLifePage() {
  const [lotNumber, setLotNumber] = useState('');
  const [lot, setLot] = useState<LotLookupResult | null>(null);
  const [history, setHistory] = useState<ExtensionHistory[]>([]);
  
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState<string>('');
  
  const [form, setForm] = useState<ExtendForm>(emptyForm);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Load users for authorization
    apiClient.get<User[]>('/users')
      .then(res => {
        setUsers(res.data);
        const token = localStorage.getItem('chemwatch_token');
        if (token && !userId) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const uid = payload.sub || payload.nameid;
            if (uid) setUserId(uid);
          } catch(e) {}
        }
      })
      .catch();
  }, [userId]);

  const handleLookup = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!lotNumber.trim()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);
    setLot(null);
    setHistory([]);
    setForm(emptyForm);

    try {
      const res = await apiClient.get<LotLookupResult>(`/shelflife/lookup/${encodeURIComponent(lotNumber.trim())}`);
      setLot(res.data);
      loadHistory(res.data.id);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Lot not found or could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async (id: string) => {
    try {
      const res = await apiClient.get<ExtensionHistory[]>(`/shelflife/history/${id}`);
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!lot || !userId) {
      setError('Please select an authorized user.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const payload = {
      inventoryLotId: lot.id,
      newExpiryDate: new Date(form.newExpiryDate).toISOString(),
      reason: form.reason.trim(),
      testPerformed: form.testPerformed.trim(),
      testResult: form.testResult.trim(),
      testDate: new Date(form.testDate).toISOString(),
      authorizedByUserId: userId
    };

    try {
      const res = await apiClient.post('/shelflife/extend', payload);
      setSuccess(res.data.message);
      
      // Refresh lot data and history
      handleLookup();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to extend shelf life.');
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 style={styles.title}>Extend Shelf Life</h1>
      <p style={styles.subtitle}>Modify the expiry date of qualifying chemical lots with full audit tracking.</p>

      {/* User selector */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <label style={styles.inlineLabel}>
          Authorized User (Focal Point / Admin):
          <select value={userId} onChange={e => setUserId(e.target.value)} style={styles.selectInline}>
            <option value="">— Select Authorization —</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.fullName} ({u.email})</option>)}
          </select>
        </label>
      </div>

      {success && <div style={styles.successBox}>✅ {success}</div>}
      {error && <div style={styles.errorBox}>❌ {error}</div>}

      {/* Lookup Form */}
      <div style={styles.panel}>
        <form onSubmit={handleLookup} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <label style={{ ...styles.formField, flex: 1, maxWidth: '400px' }}>
            <span style={styles.label}>Scan or Enter Lot Number</span>
            <input 
              type="text" 
              value={lotNumber} 
              onChange={e => setLotNumber(e.target.value)} 
              placeholder="e.g. LOT-2026-001"
              style={styles.input}
              required
            />
          </label>
          <button type="submit" disabled={loading || !lotNumber.trim()} style={styles.primaryBtn}>
            {loading ? 'Searching...' : '🔍 Load Lot'}
          </button>
        </form>
      </div>

      {lot && (
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          
          {/* Lot Details Panel */}
          <div style={{ ...styles.panel, flex: 1, minWidth: '300px' }}>
            <h3 style={styles.panelTitle}>Lot Details</h3>
            <div style={styles.detailGrid}>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Item Name</span>
                <span style={styles.detailValue}>{lot.itemName}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Lot Number</span>
                <span style={styles.detailValue}><code style={styles.code}>{lot.lotNumber}</code></span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Location</span>
                <span style={styles.detailValue}>{lot.labName} ({lot.locationName})</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Remaining</span>
                <span style={styles.detailValue}>{lot.quantityRemaining} {lot.unit}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Status</span>
                <span style={styles.detailValue}>
                  <span style={{
                    ...styles.badge, 
                    background: lot.status === 'expired' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(52, 211, 153, 0.2)',
                    color: lot.status === 'expired' ? '#f87171' : '#34d399'
                  }}>
                    {lot.status.toUpperCase()}
                  </span>
                </span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Expiry Date</span>
                <span style={styles.detailValue}>
                  {lot.expiryDate ? new Date(lot.expiryDate).toLocaleDateString() : 'None'}
                </span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Days to Expiry</span>
                <span style={{ ...styles.detailValue, color: (lot.daysToExpiry ?? 0) < 0 ? '#f87171' : '#e2e8f0', fontWeight: 'bold' }}>
                  {lot.daysToExpiry !== null ? lot.daysToExpiry : '—'}
                </span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Previous Extensions</span>
                <span style={styles.detailValue}>{lot.extensionCount}</span>
              </div>
            </div>
          </div>

          {/* Extend Form Panel */}
          <div style={{ ...styles.panel, flex: 1, minWidth: '400px' }}>
            <h3 style={{ ...styles.panelTitle, color: '#60a5fa' }}>Execute Extension</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label style={styles.formField}>
                  <span style={styles.label}>New Expiry Date *</span>
                  <input 
                    type="date" 
                    value={form.newExpiryDate} 
                    onChange={e => setForm({...form, newExpiryDate: e.target.value})} 
                    required 
                    style={styles.input} 
                  />
                  {lot.expiryDate && (
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                      Must be strictly after {new Date(lot.expiryDate).toLocaleDateString()}
                    </span>
                  )}
                </label>
                <label style={styles.formField}>
                  <span style={styles.label}>Test Date *</span>
                  <input 
                    type="date" 
                    value={form.testDate} 
                    onChange={e => setForm({...form, testDate: e.target.value})} 
                    required 
                    style={styles.input} 
                  />
                </label>
              </div>

              <label style={styles.formField}>
                <span style={styles.label}>Test Performed *</span>
                <input 
                  type="text" 
                  value={form.testPerformed} 
                  onChange={e => setForm({...form, testPerformed: e.target.value})} 
                  placeholder="e.g. Visual Inspection, Titration" 
                  required 
                  style={styles.input} 
                />
              </label>

              <label style={styles.formField}>
                <span style={styles.label}>Test Result *</span>
                <input 
                  type="text" 
                  value={form.testResult} 
                  onChange={e => setForm({...form, testResult: e.target.value})} 
                  placeholder="e.g. Pass, Clear, 15 PPM" 
                  required 
                  style={styles.input} 
                />
              </label>

              <label style={styles.formField}>
                <span style={styles.label}>Reason / Justification *</span>
                <textarea 
                  value={form.reason} 
                  onChange={e => setForm({...form, reason: e.target.value})} 
                  placeholder="Why is it safe to extend the shelf life?" 
                  required 
                  style={{ ...styles.input, minHeight: '60px', resize: 'vertical' }} 
                />
              </label>

              <button type="submit" disabled={submitting || !userId} style={styles.actionBtn}>
                {submitting ? '⏳ Submitting...' : '✅ Confirm Extension'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* History Area */}
      {lot && history.length > 0 && (
        <div style={{ ...styles.panel, marginTop: '2rem' }}>
          <h3 style={styles.panelTitle}>Life Extension History</h3>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Ext #</th>
                  <th style={styles.th}>Previous Expiry</th>
                  <th style={styles.th}>New Expiry</th>
                  <th style={styles.th}>Added Days</th>
                  <th style={styles.th}>Test & Result</th>
                  <th style={styles.th}>Authorized By</th>
                  <th style={styles.th}>Date Extended</th>
                </tr>
              </thead>
              <tbody>
                {history.map(item => (
                  <tr key={item.id}>
                    <td style={styles.td}><strong>{item.extensionNumber}</strong></td>
                    <td style={styles.td}>{item.previousExpiryDate ? new Date(item.previousExpiryDate).toLocaleDateString() : '—'}</td>
                    <td style={styles.td}><span style={{ color: '#60a5fa', fontWeight: 'bold' }}>{new Date(item.newExpiryDate).toLocaleDateString()}</span></td>
                    <td style={styles.td}>+{item.extensionDays} d</td>
                    <td style={styles.td}>
                      <div style={{ fontSize: '0.85rem' }}><strong>Test:</strong> {item.testPerformed}</div>
                      <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}><strong>Result:</strong> {item.testResult}</div>
                    </td>
                    <td style={styles.td}>{item.authorizedBy}</td>
                    <td style={styles.td}>{new Date(item.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  title: { color: '#f1f5f9', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' },
  subtitle: { color: '#94a3b8', fontSize: '1rem', marginBottom: '1.5rem' },
  panel: {
    background: '#1e293b', borderRadius: '12px', border: '1px solid #334155',
    padding: '1.5rem', marginBottom: '1rem'
  },
  panelTitle: { color: '#f1f5f9', fontSize: '1.1rem', margin: '0 0 1rem 0' },
  formField: { display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 },
  label: { color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' },
  input: {
    background: '#0f172a', color: '#e2e8f0', border: '1px solid #334155', borderRadius: '8px',
    padding: '0.6rem 0.75rem', fontSize: '0.95rem', outline: 'none', width: '100%', boxSizing: 'border-box',
    fontFamily: 'inherit'
  },
  inlineLabel: { color: '#94a3b8', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
  selectInline: {
    background: '#0f172a', color: '#e2e8f0', border: '1px solid #334155', borderRadius: '6px',
    padding: '0.35rem 0.5rem', fontSize: '0.9rem', outline: 'none'
  },
  primaryBtn: {
    background: 'linear-gradient(135deg, #3b82f6, #4f46e5)', color: '#fff', border: 'none',
    borderRadius: '8px', padding: '0.65rem 1.2rem', fontSize: '0.95rem', fontWeight: 600,
    cursor: 'pointer', whiteSpace: 'nowrap', alignSelf: 'flex-end', height: '42px',
  },
  actionBtn: {
    background: 'linear-gradient(135deg, #059669, #10b981)', color: '#fff', border: 'none',
    borderRadius: '8px', padding: '0.75rem', fontSize: '1rem', fontWeight: 600,
    cursor: 'pointer', marginTop: '0.5rem'
  },
  successBox: {
    background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.3)',
    borderRadius: '8px', padding: '0.75rem 1rem', color: '#34d399', marginBottom: '1rem', fontWeight: 500,
  },
  errorBox: {
    background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px', padding: '0.75rem 1rem', color: '#f87171', marginBottom: '1rem',
  },
  detailGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' },
  detailItem: { display: 'flex', flexDirection: 'column', gap: '0.2rem' },
  detailLabel: { fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' },
  detailValue: { fontSize: '1rem', color: '#e2e8f0' },
  code: { background: '#0f172a', color: '#60a5fa', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.9rem', border: '1px solid #1e293b' },
  badge: { padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '0.6rem 0.75rem', color: '#64748b', borderBottom: '1px solid #334155', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' },
  td: { padding: '0.75rem', color: '#e2e8f0', fontSize: '0.9rem', borderBottom: '1px solid rgba(51, 65, 85, 0.5)', verticalAlign: 'middle' },
};

export default ExtendShelfLifePage;

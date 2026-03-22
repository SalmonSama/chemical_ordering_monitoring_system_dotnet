import { useEffect, useState } from 'react';
import type { CSSProperties, ChangeEvent, FormEvent } from 'react';
import apiClient from '../api/client';
import type { User } from '../types/models';

interface PeroxideLot {
  id: string;
  lotNumber: string;
  itemName: string;
  peroxideClass: string | null;
  labName: string;
  locationName: string;
  openDate: string | null;
  firstInspectDate: string | null;
  lastMonitorDate: string | null;
  nextMonitorDate: string | null;
  peroxideStatus: string | null;
  quantityRemaining: number;
  unit: string;
  status: string;
  daysUntilDue: number | null;
}

interface PeroxideTestRequest {
  inventoryLotId: string;
  testDate: string;
  testedByUserId: string;
  testMethod: string;
  resultType: string;
  ppmResult?: number;
  resultText?: string;
  classification?: string;
  visualObservations?: string;
  notes?: string;
  setOpenDate?: string;
}

const emptyForm: Omit<PeroxideTestRequest, 'inventoryLotId' | 'testedByUserId' | 'testDate'> = {
  testMethod: 'Test strip',
  resultType: 'NUMERIC',
  ppmResult: undefined,
  resultText: '',
  classification: 'Normal',
  visualObservations: '',
  notes: '',
  setOpenDate: ''
};

function PeroxideLotsPage(): React.JSX.Element {
  const [lots, setLots] = useState<PeroxideLot[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  
  // Auth/Session
  const [userId, setUserId] = useState<string>('');

  // Form
  const [form, setForm] = useState(emptyForm);
  const [testDate, setTestDate] = useState<string>(new Date().toISOString().substring(0, 10));
  
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchData = (): void => {
    setLoading(true);
    Promise.all([
      apiClient.get<PeroxideLot[]>('/peroxide/lots'),
      apiClient.get<User[]>('/users')
    ])
      .then(([lotsRes, usersRes]) => {
        setLots(lotsRes.data);
        setUsers(usersRes.data);
         
        // Try to auto-select current user from token
        const token = localStorage.getItem('chemwatch_token');
        if (token && !userId) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const uid = payload.sub || payload.nameid;
            if (uid) setUserId(uid);
          } catch(e) {}
        }
        setError(null);
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : 'Failed to load peroxide lots.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const openForm = (lotId: string): void => {
    setActiveId(lotId);
    setForm(emptyForm);
    setTestDate(new Date().toISOString().substring(0, 10));
    setMsg(null);
  };

  const updateField = (field: keyof typeof emptyForm, value: string | number | undefined): void => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitTest = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!activeId || !userId) { 
      setMsg({ text: 'Please ensure a user is performing the test.', type: 'error' });
      return; 
    }
    if (form.resultType === 'NUMERIC' && (form.ppmResult === undefined || form.ppmResult < 0)) {
        setMsg({ text: 'Valid PPM result is required for numeric tests.', type: 'error' });
        return;
    }
    if (form.resultType === 'TEXTUAL' && !form.resultText?.trim()) {
        setMsg({ text: 'Result text is required for textual tests.', type: 'error' });
        return;
    }

    setSubmitting(true);
    setMsg(null);

    const payload: PeroxideTestRequest = {
      inventoryLotId: activeId,
      testDate: new Date(testDate).toISOString(),
      testedByUserId: userId,
      testMethod: form.testMethod,
      resultType: form.resultType,
      ppmResult: form.resultType === 'NUMERIC' ? form.ppmResult : undefined,
      resultText: form.resultType === 'TEXTUAL' ? form.resultText : undefined,
      classification: form.resultType === 'TEXTUAL' ? form.classification : undefined,
      visualObservations: form.visualObservations || undefined,
      notes: form.notes || undefined,
      setOpenDate: form.setOpenDate ? new Date(form.setOpenDate).toISOString() : undefined
    };

    try {
      const res = await apiClient.post('/peroxide/tests', payload);
      setMsg({ text: `✅ ${res.data.message}`, type: 'success' });
      setActiveId(null);
      fetchData(); // Refresh lot dates and statuses
    } catch (err: any) {
      setMsg({ text: `❌ ${err.response?.data?.error || err.message}`, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string | null): { color: string; bg: string } => {
    if (!status) return { color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)' };
    const s = status.toLowerCase();
    if (s === 'normal') return { color: '#34d399', bg: 'rgba(52, 211, 153, 0.1)' };
    if (s === 'warning') return { color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)' };
    if (s === 'quarantine') return { color: '#f87171', bg: 'rgba(239, 68, 68, 0.1)' };
    return { color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)' };
  };

  return (
    <div>
      <h1 style={styles.title}>Peroxide Due Dashboard</h1>
      <p style={styles.subtitle}>Monitor and log tests for peroxide-forming chemicals.</p>

      {msg && (
        <div style={msg.type === 'success' ? styles.successBox : styles.errorBox}>
          {msg.text}
        </div>
      )}

      {/* User selector */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={styles.inlineLabel}>
          Tested by:
          <select value={userId} onChange={e => setUserId(e.target.value)} style={styles.selectInline}>
            <option value="">— Select user —</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.fullName}</option>)}
          </select>
        </label>
      </div>

      {loading && <p style={styles.info}>Loading lots...</p>}
      {error && <p style={styles.errorText}>❌ {error}</p>}

      {/* Test Entry Form Panel */}
      {activeId && (
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <h3 style={{ color: '#f1f5f9', margin: 0 }}>
              Log Test: {lots.find(l => l.id === activeId)?.itemName} ({lots.find(l => l.id === activeId)?.lotNumber})
            </h3>
            <button type="button" onClick={() => { setActiveId(null); setMsg(null); }} style={styles.closeBtn}>✕ Cancel</button>
          </div>
          
          <form onSubmit={handleSubmitTest}>
             {/* Read-only Context */}
             {!lots.find(l => l.id === activeId)?.openDate && (
               <div style={{ marginBottom: '1rem' }}>
                 <label style={styles.formField}>
                   <span style={styles.label}>Set Open Date (Required for new containers)</span>
                   <input 
                     type="date" 
                     value={form.setOpenDate} 
                     onChange={(e: ChangeEvent<HTMLInputElement>) => updateField('setOpenDate', e.target.value)} 
                     style={styles.input} 
                   />
                 </label>
               </div>
             )}

             <div style={styles.formRow}>
               <label style={styles.formField}>
                 <span style={styles.label}>Test Date *</span>
                 <input type="date" value={testDate} onChange={(e: ChangeEvent<HTMLInputElement>) => setTestDate(e.target.value)} required style={styles.input} />
               </label>
               <label style={styles.formField}>
                 <span style={styles.label}>Method</span>
                 <select value={form.testMethod} onChange={(e: ChangeEvent<HTMLSelectElement>) => updateField('testMethod', e.target.value)} style={styles.input}>
                    <option value="Test strip">Test strip</option>
                    <option value="Titration">Titration</option>
                 </select>
               </label>
               <label style={styles.formField}>
                 <span style={styles.label}>Result Type *</span>
                 <select value={form.resultType} onChange={(e: ChangeEvent<HTMLSelectElement>) => updateField('resultType', e.target.value)} style={styles.input}>
                    <option value="NUMERIC">Numeric (PPM)</option>
                    <option value="TEXTUAL">Text (Visual/Pass/Fail)</option>
                 </select>
               </label>
             </div>

             <div style={styles.formRow}>
               {form.resultType === 'NUMERIC' ? (
                 <label style={styles.formField}>
                   <span style={styles.label}>PPM Result *</span>
                   <input type="number" min="0" step="0.1" value={form.ppmResult ?? ''} onChange={(e: ChangeEvent<HTMLInputElement>) => updateField('ppmResult', e.target.value ? parseFloat(e.target.value) : undefined)} required style={styles.input} placeholder="e.g. 15.5" />
                 </label>
               ) : (
                 <>
                   <label style={styles.formField}>
                     <span style={styles.label}>Result Text *</span>
                     <input type="text" value={form.resultText} onChange={(e: ChangeEvent<HTMLInputElement>) => updateField('resultText', e.target.value)} required style={styles.input} placeholder="e.g. Negative" />
                   </label>
                   <label style={styles.formField}>
                     <span style={styles.label}>Manual Classification *</span>
                     <select value={form.classification} onChange={(e: ChangeEvent<HTMLSelectElement>) => updateField('classification', e.target.value)} style={styles.input}>
                        <option value="Normal">Normal</option>
                        <option value="Warning">Warning</option>
                        <option value="Quarantine">Quarantine</option>
                     </select>
                   </label>
                 </>
               )}
             </div>

             <div style={styles.formRow}>
               <label style={styles.formField}>
                 <span style={styles.label}>Observations / Notes</span>
                 <input type="text" value={form.notes} onChange={(e: ChangeEvent<HTMLInputElement>) => updateField('notes', e.target.value)} style={styles.input} placeholder="Color changes, precipitate?" />
               </label>
             </div>

             <button type="submit" disabled={submitting || !userId} style={styles.submitBtn}>
               {submitting ? '⏳ Saving...' : '💾 Save Test Result'}
             </button>
          </form>
        </div>
      )}

      {/* Dashboard Table */}
      {!loading && !error && lots.length === 0 && (
        <p style={styles.info}>No peroxide-monitored lots found.</p>
      )}

      {!loading && !error && lots.length > 0 && (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Item</th>
                <th style={styles.th}>Lot Number</th>
                <th style={styles.th}>Lab</th>
                <th style={styles.th}>Due In</th>
                <th style={styles.th}>Next Monitor Due</th>
                <th style={styles.th}>Last Monitor</th>
                <th style={styles.th}>Open Date</th>
                <th style={styles.th}>Class</th>
                <th style={styles.th}></th>
              </tr>
            </thead>
            <tbody>
              {lots.map(lot => {
                const isOverdue = lot.daysUntilDue !== null && lot.daysUntilDue < 0;
                const { color, bg } = getStatusColor(lot.peroxideStatus);
                
                return (
                  <tr key={lot.id} style={isOverdue ? { background: 'rgba(239, 68, 68, 0.05)' } : {}}>
                    <td style={styles.td}>
                      <span style={{ color, background: bg, padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                        {lot.peroxideStatus || 'PENDING'}
                      </span>
                    </td>
                    <td style={styles.td}>{lot.itemName}</td>
                    <td style={styles.td}><code style={styles.code}>{lot.lotNumber}</code></td>
                    <td style={styles.td}>{lot.labName} / {lot.locationName}</td>
                    <td style={styles.td}>
                        {lot.daysUntilDue === null ? '—' : (
                            <span style={{ color: isOverdue ? '#f87171' : '#e2e8f0', fontWeight: isOverdue ? 'bold' : 'normal' }}>
                                {lot.daysUntilDue} days
                            </span>
                        )}
                    </td>
                    <td style={styles.td}>{lot.nextMonitorDate ? new Date(lot.nextMonitorDate).toLocaleDateString() : '—'}</td>
                    <td style={styles.td}>{lot.lastMonitorDate ? new Date(lot.lastMonitorDate).toLocaleDateString() : 'Never'}</td>
                    <td style={styles.td}>{lot.openDate ? new Date(lot.openDate).toLocaleDateString() : 'Unopened'}</td>
                    <td style={styles.td}>{lot.peroxideClass ?? '—'}</td>
                    <td style={styles.td}>
                      <button
                        onClick={() => openForm(lot.id)}
                        style={styles.actionBtn}
                        disabled={activeId === lot.id || lot.status === 'quarantined'}
                      >
                        {lot.status === 'quarantined' ? '🚫 Quarantined' : '📝 Log Test'}
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
  title: { color: '#f1f5f9', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' },
  subtitle: { color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem' },
  info: { color: '#94a3b8', fontStyle: 'italic' },
  errorText: { color: '#f87171' },
  successBox: {
    background: 'rgba(52, 211, 153, 0.08)', border: '1px solid rgba(52, 211, 153, 0.25)',
    borderRadius: '8px', padding: '0.75rem 1rem', color: '#34d399', marginBottom: '1rem', fontWeight: 600,
  },
  errorBox: {
    background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px', padding: '0.75rem 1rem', color: '#f87171', marginBottom: '1rem',
  },
  inlineLabel: { color: '#94a3b8', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
  selectInline: {
    background: '#0f172a', color: '#e2e8f0', border: '1px solid #334155', borderRadius: '6px',
    padding: '0.3rem 0.5rem', fontSize: '0.85rem',
  },
  panel: {
    background: '#1e293b', borderRadius: '12px', border: '1px solid #334155',
    padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem',
  },
  panelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  closeBtn: { background: 'rgba(148, 163, 184, 0.15)', color: '#94a3b8', border: 'none', borderRadius: '6px', padding: '0.3rem 0.7rem', cursor: 'pointer' },
  formRow: { display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' },
  formField: { display: 'flex', flexDirection: 'column', gap: '0.3rem', flex: 1, minWidth: '180px' },
  label: { color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' },
  input: {
    background: '#0f172a', color: '#e2e8f0', border: '1px solid #334155', borderRadius: '8px',
    padding: '0.5rem 0.75rem', fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box',
  },
  submitBtn: {
    background: 'linear-gradient(135deg, #059669, #10b981)', color: '#fff', border: 'none',
    borderRadius: '8px', padding: '0.6rem 1.2rem', fontSize: '0.9rem', fontWeight: 600,
    cursor: 'pointer', alignSelf: 'flex-start',
  },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '0.6rem 0.75rem', color: '#64748b', borderBottom: '1px solid #334155', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' },
  td: { padding: '0.5rem 0.75rem', color: '#e2e8f0', fontSize: '0.9rem', whiteSpace: 'nowrap' },
  code: { color: '#60a5fa', background: '#0f172a', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.85rem' },
  actionBtn: {
    background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#fff', border: 'none',
    borderRadius: '6px', padding: '0.35rem 0.8rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
  },
};

export default PeroxideLotsPage;

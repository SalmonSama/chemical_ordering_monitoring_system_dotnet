import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';

interface ExpiredRow {
  id: string;
  statusIndicator: string;
  itemName: string;
  lotNumber: string;
  category: string;
  labName: string;
  locationName: string;
  expiryDate: string;
  daysToExpiry: number;
  quantityRemaining: number;
  unit: string;
  extensionCount: number;
  lastActionDate: string;
}

export default function ExpiredPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<ExpiredRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    apiClient.get<ExpiredRow[]>('/dashboard/expired')
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const exportCsv = () => {
    if (!data || data.length === 0) return;
    const rows = filteredData.map(r => ({
      'Status': r.statusIndicator.toUpperCase(),
      'Item Name': r.itemName,
      'Lot Number': r.lotNumber,
      'Category': r.category,
      'Lab': r.labName,
      'Location': r.locationName,
      'Expiry Date': new Date(r.expiryDate).toLocaleDateString(),
      'Days to Expiry': r.daysToExpiry,
      'Quantity': `${r.quantityRemaining} ${r.unit}`,
      'Ext. Count': r.extensionCount,
      'Last Action': new Date(r.lastActionDate).toLocaleDateString()
    }));

    const headers = Object.keys(rows[0]);
    const csvContent = [
      headers.join(','), 
      ...rows.map(row => headers.map(h => `"${(row as any)[h] ?? ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Expiry_Report_${new Date().toISOString().substring(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredData = filterStatus ? data.filter(d => d.statusIndicator === filterStatus) : data;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={styles.title}>Expiry Dashboard</h1>
          <p style={styles.subtitle}>Lots that have expired or are nearing expiration.</p>
        </div>
        <button onClick={exportCsv} style={styles.exportBtn}>📥 Export CSV</button>
      </div>

      <div style={styles.filterBar}>
        <label style={styles.filterLabel}>
          Status Filter:
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={styles.select}>
            <option value="">All Urgent (Expired & Near Expire)</option>
            <option value="expired">Expired Only</option>
            <option value="near_expire">Near Expire (≤ 90 days)</option>
            <option value="active">Active (&gt; 90 days - Hidden)</option>
          </select>
        </label>
      </div>

      <div style={styles.panel}>
        {loading ? (
          <div style={{ color: 'var(--color-text-secondary)' }}>Loading expiry data...</div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Item & Lot</th>
                  <th style={styles.th}>Lab & Location</th>
                  <th style={styles.th}>Expiry Date</th>
                  <th style={styles.th}>Days Left</th>
                  <th style={styles.th}>Quantity</th>
                  <th style={styles.th}>Extensions</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(row => (
                  <tr key={row.id}>
                    <td style={styles.td}>
                      {row.statusIndicator === 'expired' 
                        ? <span style={{...styles.badge, background: 'var(--color-danger-bg)', color: 'var(--color-danger)'}}>🔴 EXPIRED</span>
                        : <span style={{...styles.badge, background: 'var(--color-warning-bg)', color: 'var(--color-warning)'}}>🟡 NEAR EXPIRE</span>}
                    </td>
                    <td style={styles.td}>
                      <strong>{row.itemName}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-accent-hover)', marginTop: '0.2rem' }}>
                        <code style={styles.code}>{row.lotNumber}</code>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div>{row.labName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{row.locationName}</div>
                    </td>
                    <td style={styles.td}>{new Date(row.expiryDate).toLocaleDateString()}</td>
                    <td style={styles.td}>
                      <strong style={{ color: row.daysToExpiry < 0 ? 'var(--color-danger)' : 'var(--color-text-primary)' }}>
                        {row.daysToExpiry}
                      </strong>
                    </td>
                    <td style={styles.td}>{row.quantityRemaining} {row.unit}</td>
                    <td style={styles.td}>{row.extensionCount}</td>
                    <td style={styles.td}>
                      {row.category === 'Chemical & Reagent' && (
                        <button 
                          style={styles.actionLink}
                          onClick={() => navigate('/inventory/extend-shelf-life')}
                        >
                          Extend Shelf Life
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && data.length > 0 && (
                   <tr><td colSpan={8} style={{...styles.td, textAlign: 'center', color: 'var(--color-text-secondary)'}}>No lots match the selected filter.</td></tr>
                )}
                {data.length === 0 && (
                   <tr><td colSpan={8} style={{...styles.td, textAlign: 'center', color: 'var(--color-success)'}}>✅ No active lots are expired or expiring soon.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  title: { color: 'var(--color-text-primary)', fontSize: '1.75rem', fontWeight: 800, margin: 0 },
  subtitle: { color: 'var(--color-text-secondary)', fontSize: '1rem', marginTop: '0.25rem' },
  exportBtn: {
    background: 'var(--color-border)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)',
    borderRadius: '6px', padding: '0.5rem 1rem', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer'
  },
  filterBar: { display: 'flex', gap: '1rem', marginBottom: '1rem', background: 'var(--color-bg-surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-border)' },
  filterLabel: { color: 'var(--color-text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 },
  select: { background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '0.4rem', fontSize: '0.9rem' },
  panel: { background: 'var(--color-bg-surface)', borderRadius: '12px', border: '1px solid var(--color-border)', padding: '1rem', overflow: 'hidden' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '0.75rem', color: 'var(--color-text-tertiary)', borderBottom: '1px solid var(--color-border)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' },
  td: { padding: '0.75rem', color: 'var(--color-text-primary)', fontSize: '0.9rem', borderBottom: '1px solid rgba(51, 65, 85, 0.5)', verticalAlign: 'middle' },
  badge: { padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', whiteSpace: 'nowrap' },
  code: { background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)', padding: '0.1rem 0.3rem', borderRadius: '4px', border: '1px solid var(--color-border)', fontSize: '0.85rem' },
  actionLink: { background: 'none', border: 'none', color: 'var(--color-accent-hover)', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.85rem', padding: 0 }
};

import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import apiClient from '../../api/client';

interface MinStockRow {
  statusIndicator: string;
  itemName: string;
  catalogNumber: string;
  category: string;
  labName: string;
  locationName: string;
  totalQuantity: number;
  unit: string;
  minStock: number;
  deficit: number;
  longLeadTime: string;
}

export default function MinStockPage() {
  const [data, setData] = useState<MinStockRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLab, setFilterLab] = useState('');

  useEffect(() => {
    apiClient.get<MinStockRow[]>('/dashboard/min-stock')
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const exportCsv = () => {
    if (!data || data.length === 0) return;
    const rows = filteredData.map(r => ({
      'Indicator': r.statusIndicator.replace('_', ' ').toUpperCase(),
      'Item Name': r.itemName,
      'Catalog #': r.catalogNumber,
      'Category': r.category,
      'Lab': r.labName,
      'Location': r.locationName,
      'Qty Available': r.totalQuantity,
      'Unit': r.unit,
      'Min Config': r.minStock,
      'Deficit': r.deficit,
      'Long Lead Time': r.longLeadTime
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
    a.download = `MinStock_Alerts_${new Date().toISOString().substring(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredData = filterLab ? data.filter(d => d.labName === filterLab) : data;
  const labs = Array.from(new Set(data.map(d => d.labName)));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={styles.title}>Min Stock Alerts</h1>
          <p style={styles.subtitle}>Items currently sitting at or below your configured safety thresholds.</p>
        </div>
        <button onClick={exportCsv} style={styles.exportBtn}>📥 Export CSV</button>
      </div>

      <div style={styles.filterBar}>
        <label style={styles.filterLabel}>
          Filter Lab:
          <select value={filterLab} onChange={e => setFilterLab(e.target.value)} style={styles.select}>
            <option value="">All Labs</option>
            {labs.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </label>
      </div>

      <div style={styles.panel}>
        {loading ? (
          <div style={{ color: '#94a3b8' }}>Loading stock levels...</div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Alert</th>
                  <th style={styles.th}>Item</th>
                  <th style={styles.th}>Catalog #</th>
                  <th style={styles.th}>Lab & Location</th>
                  <th style={styles.th}>Available</th>
                  <th style={styles.th}>Min Config</th>
                  <th style={styles.th}>Deficit</th>
                  <th style={styles.th}>Lead Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, idx) => (
                  <tr key={idx}>
                    <td style={styles.td}>
                      {row.statusIndicator === 'out_of_stock' 
                        ? <span style={{...styles.badge, background: 'rgba(239, 68, 68, 0.2)', color: '#f87171'}}>🔴 OUT OF STOCK</span>
                        : <span style={{...styles.badge, background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24'}}>🟡 BELOW MIN</span>}
                    </td>
                    <td style={styles.td}>
                      <strong>{row.itemName}</strong>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{row.category}</div>
                    </td>
                    <td style={styles.td}><code style={styles.code}>{row.catalogNumber || '—'}</code></td>
                    <td style={styles.td}>
                      <div>{row.labName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{row.locationName}</div>
                    </td>
                    <td style={styles.td}><strong style={{ color: row.statusIndicator === 'out_of_stock' ? '#f87171' : '#e2e8f0'}}>{row.totalQuantity} {row.unit}</strong></td>
                    <td style={styles.td}>{row.minStock} {row.unit}</td>
                    <td style={styles.td}><strong style={{ color: '#fbbf24' }}>-{row.deficit} {row.unit}</strong></td>
                    <td style={styles.td}>
                      {row.longLeadTime === 'Yes' ? <span style={styles.leadTimeBadge}>⚠️ LONG</span> : <span style={{ color: '#475569' }}>Standard</span>}
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && data.length > 0 && (
                   <tr><td colSpan={8} style={{...styles.td, textAlign: 'center', color: '#94a3b8'}}>No alerts in this lab.</td></tr>
                )}
                {data.length === 0 && (
                   <tr><td colSpan={8} style={{...styles.td, textAlign: 'center', color: '#34d399'}}>✅ All active inventories are above minimum thresholds.</td></tr>
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
  title: { color: '#f1f5f9', fontSize: '1.75rem', fontWeight: 800, margin: 0 },
  subtitle: { color: '#94a3b8', fontSize: '1rem', marginTop: '0.25rem' },
  exportBtn: {
    background: '#334155', color: '#f1f5f9', border: '1px solid #475569',
    borderRadius: '6px', padding: '0.5rem 1rem', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer'
  },
  filterBar: { display: 'flex', gap: '1rem', marginBottom: '1rem', background: '#1e293b', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' },
  filterLabel: { color: '#94a3b8', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 },
  select: { background: '#0f172a', color: '#e2e8f0', border: '1px solid #334155', borderRadius: '4px', padding: '0.4rem', fontSize: '0.9rem' },
  panel: { background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '1rem', overflow: 'hidden' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '0.75rem', color: '#64748b', borderBottom: '1px solid #334155', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' },
  td: { padding: '0.75rem', color: '#e2e8f0', fontSize: '0.9rem', borderBottom: '1px solid rgba(51, 65, 85, 0.5)', verticalAlign: 'middle' },
  badge: { padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', whiteSpace: 'nowrap' },
  code: { background: '#0f172a', color: '#e2e8f0', padding: '0.15rem 0.4rem', borderRadius: '4px', border: '1px solid #334155', fontSize: '0.85rem' },
  leadTimeBadge: { background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', border: '1px solid rgba(245, 158, 11, 0.3)' }
};

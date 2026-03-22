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
          <div style={{ color: 'var(--color-text-secondary)' }}>Loading stock levels...</div>
        ) : (
          <div style={styles.tableWrapper}>
            <table className="data-table">
              <thead>
                <tr>
                  <th >Alert</th>
                  <th >Item</th>
                  <th >Catalog #</th>
                  <th >Lab & Location</th>
                  <th >Available</th>
                  <th >Min Config</th>
                  <th >Deficit</th>
                  <th >Lead Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, idx) => (
                  <tr key={idx}>
                    <td >
                      {row.statusIndicator === 'out_of_stock' 
                        ? <span style={{...styles.badge, background: 'var(--color-danger-bg)', color: 'var(--color-danger)'}}>🔴 OUT OF STOCK</span>
                        : <span style={{...styles.badge, background: 'var(--color-warning-bg)', color: 'var(--color-warning)'}}>🟡 BELOW MIN</span>}
                    </td>
                    <td >
                      <strong>{row.itemName}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{row.category}</div>
                    </td>
                    <td ><code style={styles.code}>{row.catalogNumber || '—'}</code></td>
                    <td >
                      <div>{row.labName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{row.locationName}</div>
                    </td>
                    <td ><strong style={{ color: row.statusIndicator === 'out_of_stock' ? 'var(--color-danger)' : 'var(--color-text-primary)'}}>{row.totalQuantity} {row.unit}</strong></td>
                    <td >{row.minStock} {row.unit}</td>
                    <td ><strong style={{ color: 'var(--color-warning)' }}>-{row.deficit} {row.unit}</strong></td>
                    <td >
                      {row.longLeadTime === 'Yes' ? <span style={styles.leadTimeBadge}>⚠️ LONG</span> : <span style={{ color: 'var(--color-border)' }}>Standard</span>}
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && data.length > 0 && (
                   <tr><td colSpan={8} style={{...styles.td, textAlign: 'center', color: 'var(--color-text-secondary)'}}>No alerts in this lab.</td></tr>
                )}
                {data.length === 0 && (
                   <tr><td colSpan={8} style={{...styles.td, textAlign: 'center', color: 'var(--color-success)'}}>✅ All active inventories are above minimum thresholds.</td></tr>
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
  badge: { padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', whiteSpace: 'nowrap' },
  code: { background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)', padding: '0.15rem 0.4rem', borderRadius: '4px', border: '1px solid var(--color-border)', fontSize: '0.85rem' },
  leadTimeBadge: { background: 'var(--color-warning-bg)', color: 'var(--color-warning)', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', border: '1px solid var(--color-warning-bg)' }
};

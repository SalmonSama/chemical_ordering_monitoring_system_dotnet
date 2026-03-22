import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import apiClient from '../../api/client';

interface RegulatoryRow {
  itemCode: string;
  category: string;
  itemName: string;
  casNo: string;
  labName: string;
  locationName: string;
  bottleCount: number;
  totalQuantity: number;
  unit: string;
}

export default function RegulatoryReportPage() {
  const [data, setData] = useState<RegulatoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<RegulatoryRow[]>('/reports/regulatory')
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const exportCsv = () => {
    if (!data || data.length === 0) return;
    const rows = data.map(r => ({
      'Item Code': r.itemCode,
      'Item Name': r.itemName,
      'CAS No': r.casNo,
      'Category': r.category,
      'Lab': r.labName,
      'Location': r.locationName,
      'Bottle Count': r.bottleCount,
      'Total Base Qty': `${r.totalQuantity} ${r.unit}`
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
    a.download = `Regulatory_Stock_${new Date().toISOString().substring(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={styles.title}>Regulatory Reporting</h1>
          <p style={styles.subtitle}>Aggregated summary of highly regulated chemical stocks.</p>
        </div>
        <button onClick={exportCsv} style={styles.exportBtn}>📥 Export CSV</button>
      </div>

      <div style={styles.panel}>
        {loading ? (
          <div style={{ color: '#94a3b8' }}>Loading regulatory aggregates...</div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Item / Code</th>
                  <th style={styles.th}>CAS Number</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Lab & Location</th>
                  <th style={styles.th}>Bottle Count</th>
                  <th style={styles.th}>Total Quantity</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx}>
                    <td style={styles.td}>
                      <strong>{row.itemName}</strong>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                        Ref: {row.itemCode}
                      </div>
                    </td>
                    <td style={styles.td}><code style={styles.code}>{row.casNo}</code></td>
                    <td style={styles.td}>{row.category}</td>
                    <td style={styles.td}>
                      <div>{row.labName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{row.locationName}</div>
                    </td>
                    <td style={styles.td}>{row.bottleCount}</td>
                    <td style={styles.td}>
                      <strong style={{ color: '#60a5fa' }}>{row.totalQuantity} {row.unit}</strong>
                    </td>
                  </tr>
                ))}
                {data.length === 0 && (
                   <tr><td colSpan={6} style={{...styles.td, textAlign: 'center', color: '#94a3b8'}}>No regulatory flagged items found in the system.</td></tr>
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
  panel: { background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '1rem', overflow: 'hidden' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '0.75rem', color: '#64748b', borderBottom: '1px solid #334155', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' },
  td: { padding: '0.75rem', color: '#e2e8f0', fontSize: '0.9rem', borderBottom: '1px solid rgba(51, 65, 85, 0.5)', verticalAlign: 'middle' },
  code: { background: '#0f172a', color: '#e2e8f0', padding: '0.1rem 0.3rem', borderRadius: '4px', border: '1px solid #334155', fontSize: '0.85rem' }
};

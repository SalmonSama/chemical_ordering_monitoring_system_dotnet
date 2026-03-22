import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import apiClient from '../../api/client';

interface TransactionRow {
  id: string;
  timestamp: string;
  type: string;
  itemName: string;
  lotNumber: string;
  quantity: number;
  userName: string;
  labName: string;
  locationName: string;
  details: string;
}

export default function TransactionHistoryPage() {
  const [data, setData] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    // We can fetch up to 500 for the report view to have a decent log set
    apiClient.get<TransactionRow[]>('/reports/transactions?limit=500')
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const exportCsv = () => {
    if (!data || data.length === 0) return;
    const rows = filteredData.map(r => ({
      'Date/Time': new Date(r.timestamp).toLocaleString(),
      'Type': r.type,
      'Item': r.itemName,
      'Lot #': r.lotNumber,
      'Qty Change': r.quantity,
      'User': r.userName,
      'Lab': r.labName,
      'Location': r.locationName,
      'Details': r.details
    }));

    const headers = Object.keys(rows[0]);
    const csvContent = [
      headers.join(','), 
      ...rows.map(row => headers.map(h => `"${String((row as any)[h]).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Stock_Transactions_${new Date().toISOString().substring(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredData = filterType ? data.filter(d => d.type === filterType) : data;
  const types = Array.from(new Set(data.map(d => d.type))).sort();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={styles.title}>Transaction History</h1>
          <p style={styles.subtitle}>Audit log for all inventory additions, deductions, and actions.</p>
        </div>
        <button onClick={exportCsv} style={styles.exportBtn}>📥 Export CSV</button>
      </div>

      <div style={styles.filterBar}>
        <label style={styles.filterLabel}>
          Filter by Event:
          <select value={filterType} onChange={e => setFilterType(e.target.value)} style={styles.select}>
            <option value="">All Transactions</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
      </div>

      <div style={styles.panel}>
        {loading ? (
          <div style={{ color: 'var(--color-text-secondary)' }}>Loading sequence...</div>
        ) : (
          <div style={styles.tableWrapper}>
            <table className="data-table">
              <thead>
                <tr>
                  <th >Timestamp</th>
                  <th >Event</th>
                  <th >Item & Lot</th>
                  <th >Lab</th>
                  <th >Qty Change</th>
                  <th >User</th>
                  <th >Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(row => (
                  <tr key={row.id}>
                    <td >
                      <div style={{ whiteSpace: 'nowrap' }}>{new Date(row.timestamp).toLocaleDateString()}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{new Date(row.timestamp).toLocaleTimeString()}</div>
                    </td>
                    <td >
                      <span style={styles.badge}>{row.type}</span>
                    </td>
                    <td >
                      <strong>{row.itemName}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-accent-hover)', marginTop: '0.2rem' }}>
                        <code style={styles.code}>{row.lotNumber}</code>
                      </div>
                    </td>
                    <td >
                      <div>{row.labName}</div>
                    </td>
                    <td >
                      <strong style={{ color: row.quantity > 0 ? 'var(--color-success)' : (row.quantity < 0 ? 'var(--color-danger)' : 'var(--color-text-secondary)') }}>
                        {row.quantity > 0 ? `+${row.quantity}` : row.quantity}
                      </strong>
                    </td>
                    <td >{row.userName}</td>
                    <td style={{...styles.td, color: 'var(--color-text-secondary)', fontSize: '0.85rem', maxWidth: '300px' }}>
                      {row.details || '—'}
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                   <tr><td colSpan={7} style={{...styles.td, textAlign: 'center', color: 'var(--color-text-secondary)'}}>No transactions found.</td></tr>
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
  badge: { padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', whiteSpace: 'nowrap', background: 'var(--color-border)', color: 'var(--color-text-primary)' },
  code: { background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)', padding: '0.1rem 0.3rem', borderRadius: '4px', border: '1px solid var(--color-border)', fontSize: '0.85rem' }
};

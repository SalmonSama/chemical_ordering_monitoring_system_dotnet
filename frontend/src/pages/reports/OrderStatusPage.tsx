import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import apiClient from '../../api/client';

interface OrderStatusRow {
  id: string;
  poNumber: string;
  status: string;
  category: string;
  itemSummary: string;
  totalQty: number;
  vendor: string;
  labName: string;
  locationName: string;
  requester: string;
  entryDate: string;
  approveDate: string | null;
  lastUpdated: string;
}

export default function OrderStatusPage() {
  const [data, setData] = useState<OrderStatusRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    apiClient.get<OrderStatusRow[]>('/dashboard/order-status')
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const exportCsv = () => {
    if (!data || data.length === 0) return;
    const rows = filteredData.map(r => ({
      'PO Number': r.poNumber,
      'Status': r.status,
      'Category': r.category,
      'Item Summary': r.itemSummary,
      'Total Qty': r.totalQty,
      'Vendor': r.vendor,
      'Lab': r.labName,
      'Location': r.locationName,
      'Requester': r.requester,
      'Entry Date': new Date(r.entryDate).toLocaleDateString(),
      'Approve Date': r.approveDate ? new Date(r.approveDate).toLocaleDateString() : ''
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
    a.download = `OrderStatus_Report_${new Date().toISOString().substring(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredData = filterStatus 
    ? data.filter(d => d.status === filterStatus) 
    : data.filter(d => d.status !== 'fully_received' && d.status !== 'cancelled');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={styles.title}>Order Status Dashboard</h1>
          <p style={styles.subtitle}>Track all chemical and supply orders across the facility.</p>
        </div>
        <button onClick={exportCsv} style={styles.exportBtn}>📥 Export CSV</button>
      </div>

      <div style={styles.filterBar}>
        <label style={styles.filterLabel}>
          Status Filter:
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={styles.select}>
            <option value="">Active Orders Only (Hide Completed/Cancelled)</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="pending_delivery">Pending Delivery</option>
            <option value="partially_received">Partially Received</option>
            <option value="fully_received">Fully Received</option>
            <option value="cancelled">Cancelled</option>
            <option value="SHOW_ALL">Show All Statuses</option>
          </select>
        </label>
      </div>

      <div style={styles.panel}>
        {loading ? (
          <div style={{ color: '#94a3b8' }}>Loading orders...</div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>PO Number</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Items</th>
                  <th style={styles.th}>Total Qty</th>
                  <th style={styles.th}>Vendor</th>
                  <th style={styles.th}>Destination</th>
                  <th style={styles.th}>Requester</th>
                  <th style={styles.th}>Entry Date</th>
                </tr>
              </thead>
              <tbody>
                {(filterStatus === 'SHOW_ALL' ? data : filteredData).map(row => (
                  <tr key={row.id}>
                    <td style={styles.td}><strong style={{ color: '#60a5fa' }}>{row.poNumber}</strong></td>
                    <td style={styles.td}>
                      <span style={{...styles.badge, ...getStatusStyle(row.status)}}>
                        {row.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div>{row.itemSummary}</div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{row.category}</div>
                    </td>
                    <td style={styles.td}>{row.totalQty}</td>
                    <td style={styles.td}>{row.vendor}</td>
                    <td style={styles.td}>
                      <div>{row.labName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{row.locationName}</div>
                    </td>
                    <td style={styles.td}>{row.requester}</td>
                    <td style={styles.td}>{new Date(row.entryDate).toLocaleDateString()}</td>
                  </tr>
                ))}
                {filteredData.length === 0 && filterStatus !== 'SHOW_ALL' && data.length > 0 && (
                   <tr><td colSpan={8} style={{...styles.td, textAlign: 'center', color: '#94a3b8'}}>No orders match the selected filter.</td></tr>
                )}
                {data.length === 0 && (
                   <tr><td colSpan={8} style={{...styles.td, textAlign: 'center', color: '#94a3b8'}}>No orders found in the system.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function getStatusStyle(status: string): CSSProperties {
  switch (status) {
    case 'pending_approval': return { background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24' };
    case 'approved': return { background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' };
    case 'pending_delivery': return { background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' };
    case 'partially_received': return { background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc' };
    case 'fully_received': return { background: 'rgba(5, 150, 105, 0.2)', color: '#10b981' };
    case 'cancelled': return { background: 'rgba(239, 68, 68, 0.2)', color: '#f87171' };
    case 'draft': case 'in_cart': return { background: 'rgba(148, 163, 184, 0.2)', color: '#94a3b8' };
    default: return { background: 'rgba(148, 163, 184, 0.2)', color: '#e2e8f0' };
  }
}

const styles: Record<string, CSSProperties> = {
  title: { color: '#f1f5f9', fontSize: '1.75rem', fontWeight: 800, margin: 0 },
  subtitle: { color: '#94a3b8', fontSize: '1rem', marginTop: '0.25rem' },
  exportBtn: {
    background: '#334155', color: '#f1f5f9', border: '1px solid #475569',
    borderRadius: '6px', padding: '0.5rem 1rem', fontSize: '0.9rem', fontWeight: 600,
    cursor: 'pointer'
  },
  filterBar: { display: 'flex', gap: '1rem', marginBottom: '1rem', background: '#1e293b', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' },
  filterLabel: { color: '#94a3b8', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 },
  select: { background: '#0f172a', color: '#e2e8f0', border: '1px solid #334155', borderRadius: '4px', padding: '0.4rem', fontSize: '0.9rem' },
  panel: { background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '1rem', overflow: 'hidden' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '0.75rem', color: '#64748b', borderBottom: '1px solid #334155', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' },
  td: { padding: '0.75rem', color: '#e2e8f0', fontSize: '0.9rem', borderBottom: '1px solid rgba(51, 65, 85, 0.5)', verticalAlign: 'middle' },
  badge: { padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', whiteSpace: 'nowrap' }
};

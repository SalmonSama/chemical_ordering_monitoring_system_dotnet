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
          <div style={{ color: 'var(--color-text-secondary)' }}>Loading orders...</div>
        ) : (
          <div style={styles.tableWrapper}>
            <table className="data-table">
              <thead>
                <tr>
                  <th >PO Number</th>
                  <th >Status</th>
                  <th >Items</th>
                  <th >Total Qty</th>
                  <th >Vendor</th>
                  <th >Destination</th>
                  <th >Requester</th>
                  <th >Entry Date</th>
                </tr>
              </thead>
              <tbody>
                {(filterStatus === 'SHOW_ALL' ? data : filteredData).map(row => (
                  <tr key={row.id}>
                    <td ><strong style={{ color: 'var(--color-accent-hover)' }}>{row.poNumber}</strong></td>
                    <td >
                      <span style={{...styles.badge, ...getStatusStyle(row.status)}}>
                        {row.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td >
                      <div>{row.itemSummary}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{row.category}</div>
                    </td>
                    <td >{row.totalQty}</td>
                    <td >{row.vendor}</td>
                    <td >
                      <div>{row.labName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{row.locationName}</div>
                    </td>
                    <td >{row.requester}</td>
                    <td >{new Date(row.entryDate).toLocaleDateString()}</td>
                  </tr>
                ))}
                {filteredData.length === 0 && filterStatus !== 'SHOW_ALL' && data.length > 0 && (
                   <tr><td colSpan={8} style={{...styles.td, textAlign: 'center', color: 'var(--color-text-secondary)'}}>No orders match the selected filter.</td></tr>
                )}
                {data.length === 0 && (
                   <tr><td colSpan={8} style={{...styles.td, textAlign: 'center', color: 'var(--color-text-secondary)'}}>No orders found in the system.</td></tr>
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
    case 'pending_approval': return { background: 'var(--color-warning-bg)', color: 'var(--color-warning)' };
    case 'approved': return { background: 'rgba(16, 185, 129, 0.2)', color: 'var(--color-success)' };
    case 'pending_delivery': return { background: 'var(--color-info-bg)', color: 'var(--color-accent-hover)' };
    case 'partially_received': return { background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc' };
    case 'fully_received': return { background: 'rgba(5, 150, 105, 0.2)', color: '#10b981' };
    case 'cancelled': return { background: 'var(--color-danger-bg)', color: 'var(--color-danger)' };
    case 'draft': case 'in_cart': return { background: 'rgba(148, 163, 184, 0.2)', color: 'var(--color-text-secondary)' };
    default: return { background: 'rgba(148, 163, 184, 0.2)', color: 'var(--color-text-primary)' };
  }
}

const styles: Record<string, CSSProperties> = {
  title: { color: 'var(--color-text-primary)', fontSize: '1.75rem', fontWeight: 800, margin: 0 },
  subtitle: { color: 'var(--color-text-secondary)', fontSize: '1rem', marginTop: '0.25rem' },
  exportBtn: {
    background: 'var(--color-border)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)',
    borderRadius: '6px', padding: '0.5rem 1rem', fontSize: '0.9rem', fontWeight: 600,
    cursor: 'pointer'
  },
  filterBar: { display: 'flex', gap: '1rem', marginBottom: '1rem', background: 'var(--color-bg-surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-border)' },
  filterLabel: { color: 'var(--color-text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 },
  select: { background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '0.4rem', fontSize: '0.9rem' },
  panel: { background: 'var(--color-bg-surface)', borderRadius: '12px', border: '1px solid var(--color-border)', padding: '1rem', overflow: 'hidden' },
  tableWrapper: { overflowX: 'auto' },
  badge: { padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', whiteSpace: 'nowrap' }
};

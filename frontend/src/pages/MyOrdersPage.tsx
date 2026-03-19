import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import apiClient from '../api/client';
import type { PurchaseRequest } from '../types/models';

interface StatusStyle {
  color: string;
  bg: string;
}

const STATUS_COLORS: Record<string, StatusStyle> = {
  pending_approval: { color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)' },
  modified:         { color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.1)' },
  approved:         { color: '#34d399', bg: 'rgba(52, 211, 153, 0.1)' },
  cancelled:        { color: '#f87171', bg: 'rgba(248, 113, 113, 0.1)' },
};

const STATUS_LABELS: Record<string, string> = {
  pending_approval: 'Pending Approval',
  modified: 'Modified',
  approved: 'Approved',
  cancelled: 'Cancelled',
};

function MyOrdersPage(): React.JSX.Element {
  const [orders, setOrders] = useState<PurchaseRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<PurchaseRequest | null>(null);

  useEffect(() => {
    apiClient.get<PurchaseRequest[]>('/orders')
      .then(res => { setOrders(res.data); setError(null); })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const viewDetail = async (id: string): Promise<void> => {
    try {
      const res = await apiClient.get<PurchaseRequest>(`/orders/${id}`);
      setDetail(res.data);
    } catch {
      setError('Failed to load order detail');
    }
  };

  const sc = (status: string): StatusStyle => STATUS_COLORS[status] ?? { color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)' };

  return (
    <div>
      <h1 style={styles.title}>My Orders</h1>
      <p style={styles.subtitle}>All submitted purchase requests.</p>

      {loading && <p style={styles.info}>Loading...</p>}
      {error && <p style={styles.error}>❌ {error}</p>}

      {/* Detail panel */}
      {detail && (
        <div style={styles.detailPanel}>
          <div style={styles.detailHeader}>
            <h3 style={{ color: '#f1f5f9', margin: 0 }}>{detail.poNumber}</h3>
            <button onClick={() => setDetail(null)} style={styles.closeBtn}>✕ Close</button>
          </div>
          <div style={styles.detailMeta}>
            <span>Status: <span style={{ color: sc(detail.status).color, fontWeight: 600 }}>{STATUS_LABELS[detail.status] ?? detail.status}</span></span>
            <span>Lab: {detail.labName}</span>
            <span>Location: {detail.locationName}</span>
            <span>Requester: {detail.requestedByName}</span>
            <span>Submitted: {new Date(detail.submittedAt).toLocaleString()}</span>
            {detail.approvedByName && <span>Approved by: {detail.approvedByName}</span>}
            {detail.orderNotes && <span>Notes: {detail.orderNotes}</span>}
          </div>

          {detail.items && detail.items.length > 0 && (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Item</th>
                  <th style={styles.th}>Vendor</th>
                  <th style={styles.th}>Qty</th>
                  <th style={styles.th}>Unit</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {detail.items.map(i => {
                  const isc = sc(i.status === 'pending' ? 'pending_approval' : i.status);
                  return (
                    <tr key={i.id}>
                      <td style={styles.td}>{i.itemName}</td>
                      <td style={styles.td}>{i.vendorName ?? '—'}</td>
                      <td style={styles.tdNum}>{i.quantityOrdered}</td>
                      <td style={styles.td}>{i.unit}</td>
                      <td style={styles.td}>
                        <span style={{ color: isc.color, background: isc.bg, padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize' }}>
                          {i.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {detail.revisions && detail.revisions.length > 0 && (
            <>
              <h4 style={{ color: '#94a3b8', marginTop: '1rem', marginBottom: '0.5rem' }}>Revision History</h4>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Action</th>
                    <th style={styles.th}>Field</th>
                    <th style={styles.th}>Old</th>
                    <th style={styles.th}>New</th>
                    <th style={styles.th}>By</th>
                    <th style={styles.th}>At</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.revisions.map(r => (
                    <tr key={r.id}>
                      <td style={styles.td}><span style={{ textTransform: 'capitalize' }}>{r.action}</span></td>
                      <td style={styles.td}>{r.fieldName ?? '—'}</td>
                      <td style={styles.td}>{r.oldValue ?? '—'}</td>
                      <td style={styles.td}>{r.newValue ?? '—'}</td>
                      <td style={styles.td}>{r.revisedByName}</td>
                      <td style={styles.td}>{new Date(r.revisedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}

      {/* Orders list */}
      {!loading && !error && orders.length === 0 && (
        <p style={styles.info}>No orders found. Submit an order from the Cart page.</p>
      )}

      {!loading && !error && orders.length > 0 && (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>PO Number</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Lab</th>
                <th style={styles.th}>Location</th>
                <th style={styles.th}>Items</th>
                <th style={styles.th}>Total Qty</th>
                <th style={styles.th}>Requester</th>
                <th style={styles.th}>Submitted</th>
                <th style={styles.th}></th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => {
                const osc = sc(o.status);
                return (
                  <tr key={o.id}>
                    <td style={styles.td}><code style={styles.code}>{o.poNumber}</code></td>
                    <td style={styles.td}>
                      <span style={{ color: osc.color, background: osc.bg, padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                        {STATUS_LABELS[o.status] ?? o.status}
                      </span>
                    </td>
                    <td style={styles.td}>{o.labName}</td>
                    <td style={styles.td}>{o.locationName}</td>
                    <td style={styles.tdNum}>{o.itemCount ?? '—'}</td>
                    <td style={styles.tdNum}>{o.totalQty ?? '—'}</td>
                    <td style={styles.td}>{o.requestedByName}</td>
                    <td style={styles.td}>{new Date(o.submittedAt).toLocaleDateString()}</td>
                    <td style={styles.td}>
                      <button onClick={() => viewDetail(o.id)} style={styles.viewBtn}>View</button>
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
  subtitle: { color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' },
  info: { color: '#94a3b8', fontStyle: 'italic' },
  error: { color: '#f87171' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '0.6rem 0.75rem', color: '#64748b', borderBottom: '1px solid #334155', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' },
  td: { padding: '0.5rem 0.75rem', color: '#e2e8f0', fontSize: '0.9rem', whiteSpace: 'nowrap' },
  tdNum: { padding: '0.5rem 0.75rem', color: '#e2e8f0', fontSize: '0.9rem', textAlign: 'right', fontVariantNumeric: 'tabular-nums' },
  code: { color: '#60a5fa', background: '#0f172a', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.85rem' },
  viewBtn: {
    background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: 'none', borderRadius: '6px',
    padding: '0.3rem 0.7rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
  },
  detailPanel: {
    background: '#1e293b', borderRadius: '12px', border: '1px solid #334155',
    padding: '1.25rem', marginBottom: '1.5rem',
  },
  detailHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' },
  closeBtn: {
    background: 'rgba(148, 163, 184, 0.15)', color: '#94a3b8', border: 'none', borderRadius: '6px',
    padding: '0.3rem 0.7rem', cursor: 'pointer', fontSize: '0.85rem',
  },
  detailMeta: { display: 'flex', flexWrap: 'wrap', gap: '0.4rem 1.2rem', color: '#cbd5e1', fontSize: '0.88rem', marginBottom: '1rem' },
};

export default MyOrdersPage;

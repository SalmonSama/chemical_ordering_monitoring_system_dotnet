import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import apiClient from '../api/client';
import type { PurchaseRequest } from '../types/models';
import StatusBadge from '../components/StatusBadge';

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
            <h3 style={{ color: 'var(--color-text-primary)', margin: 0 }}>{detail.poNumber}</h3>
            <button onClick={() => setDetail(null)} style={styles.closeBtn}>✕ Close</button>
          </div>
          <div style={styles.detailMeta}>
            <span>Status: <StatusBadge status={detail.status} /></span>
            <span>Lab: {detail.labName}</span>
            <span>Location: {detail.locationName}</span>
            <span>Requester: {detail.requestedByName ?? 'Unknown requester'}</span>
            <span>Submitted: {new Date(detail.submittedAt).toLocaleString()}</span>
            {detail.approvedByName && <span>Approved by: {detail.approvedByName}</span>}
            {detail.orderNotes && <span>Notes: {detail.orderNotes}</span>}
          </div>

          {detail.items && detail.items.length > 0 && (
            <div style={styles.tableWrapper}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Vendor</th>
                    <th>Qty</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.items.map(i => {
                    return (
                      <tr key={i.id}>
                        <td>{i.itemName}</td>
                        <td>{i.vendorName ?? '—'}</td>
                        <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{i.quantityOrdered}</td>
                        <td>
                          <StatusBadge status={i.status === 'pending' ? 'pending_approval' : i.status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {detail.revisions && detail.revisions.length > 0 && (
            <>
              <h4 style={{ color: 'var(--color-text-secondary)', marginTop: '1rem', marginBottom: '0.5rem' }}>Revision History</h4>
              <div style={styles.tableWrapper}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Action</th>
                      <th>Field</th>
                      <th>Old</th>
                      <th>New</th>
                      <th>By</th>
                      <th>At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.revisions.map(r => (
                      <tr key={r.id}>
                        <td><span style={{ textTransform: 'capitalize' }}>{r.action}</span></td>
                        <td>{r.fieldName ?? '—'}</td>
                        <td>{r.oldValue ?? '—'}</td>
                        <td>{r.newValue ?? '—'}</td>
                        <td>{r.revisedByName}</td>
                        <td>{new Date(r.revisedAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
          <table className="data-table">
            <thead>
              <tr>
                <th>PO Number</th>
                <th>Status</th>
                <th>Lab</th>
                <th>Location</th>
                <th>Items</th>
                <th>Total Qty</th>
                <th>Requester</th>
                <th>Submitted</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => {
                return (
                  <tr key={o.id}>
                    <td><code style={styles.code}>{o.poNumber}</code></td>
                    <td><StatusBadge status={o.status} /></td>
                    <td>{o.labName}</td>
                    <td>{o.locationName}</td>
                    <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{o.itemCount ?? '—'}</td>
                    <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{o.totalQty ?? '—'}</td>
                    <td>{o.requestedByName ?? 'Unknown requester'}</td>
                    <td>{new Date(o.submittedAt).toLocaleDateString()}</td>
                    <td>
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
  title: { color: 'var(--color-text-primary)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' },
  subtitle: { color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' },
  info: { color: 'var(--color-text-secondary)', fontStyle: 'italic' },
  error: { color: 'var(--color-danger)' },
  tableWrapper: { overflowX: 'auto' },
  code: { color: 'var(--color-accent-hover)', background: 'var(--color-bg-primary)', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.85rem' },
  viewBtn: {
    background: 'var(--color-info-bg)', color: 'var(--color-accent-hover)', border: 'none', borderRadius: '6px',
    padding: '0.3rem 0.7rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
  },
  detailPanel: {
    background: 'var(--color-bg-surface)', borderRadius: '12px', border: '1px solid var(--color-border)',
    padding: '1.25rem', marginBottom: '1.5rem',
  },
  detailHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' },
  closeBtn: {
    background: 'rgba(148, 163, 184, 0.15)', color: 'var(--color-text-secondary)', border: 'none', borderRadius: '6px',
    padding: '0.3rem 0.7rem', cursor: 'pointer', fontSize: '0.85rem',
  },
  detailMeta: { display: 'flex', flexWrap: 'wrap', gap: '0.4rem 1.2rem', color: '#cbd5e1', fontSize: '0.88rem', marginBottom: '1rem' },
};

export default MyOrdersPage;

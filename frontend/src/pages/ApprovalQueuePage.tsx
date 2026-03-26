import { useEffect, useState } from 'react';
import type { CSSProperties, ChangeEvent } from 'react';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import type {
  PurchaseRequest,
  PurchaseRequestLineItem,
  User,
  Vendor,
  ModifyOrderRequest,
  ApproveOrderRequest,
} from '../types/models';

interface EditState {
  [lineItemId: string]: { qty: string; vendorId: string; remove: boolean };
}

function ApprovalQueuePage(): React.JSX.Element {
  const { user } = useAuth();
  const [orders, setOrders] = useState<PurchaseRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseRequest | null>(null);
  const [edits, setEdits] = useState<EditState>({});
  const [approverUserId, setApproverUserId] = useState<string>(user?.id || '');
  const [approvalNotes, setApprovalNotes] = useState<string>('');

  useEffect(() => {
    if (user?.id && !approverUserId) {
      setApproverUserId(user.id);
    }
  }, [user?.id, approverUserId]);
  const [modifyNotes, setModifyNotes] = useState<string>('');
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);

  const fetchPending = (): void => {
    setLoading(true);
    apiClient.get<PurchaseRequest[]>('/orders?status=pending_approval')
      .then(res => { setOrders(res.data); setError(null); })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPending();
    Promise.all([
      apiClient.get<User[]>('/users'),
      apiClient.get<Vendor[]>('/vendors'),
    ]).then(([uRes, vRes]) => {
      setUsers(uRes.data);
      setVendors(vRes.data);
    });
  }, []);

  const openReview = async (orderId: string): Promise<void> => {
    try {
      const res = await apiClient.get<PurchaseRequest>(`/orders/${orderId}`);
      const order = res.data;
      setSelectedOrder(order);
      setActionMsg(null);
      setModifyNotes('');

      // Initialize edit state from current line items
      const initial: EditState = {};
      (order.items ?? []).forEach((li: PurchaseRequestLineItem) => {
        if (li.status !== 'removed') {
          initial[li.id] = { qty: String(li.quantityOrdered), vendorId: li.vendorId ?? '', remove: false };
        }
      });
      setEdits(initial);
    } catch {
      setError('Failed to load order');
    }
  };

  const updateEdit = (id: string, field: 'qty' | 'vendorId' | 'remove', value: string | boolean): void => {
    setEdits(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  // Detect if any modifications exist
  const hasChanges = (): boolean => {
    if (!selectedOrder?.items) return false;
    for (const li of selectedOrder.items) {
      const edit = edits[li.id];
      if (!edit) continue;
      if (edit.remove) return true;
      if (parseFloat(edit.qty) !== li.quantityOrdered) return true;
      if (edit.vendorId !== (li.vendorId ?? '')) return true;
    }
    return false;
  };

  const handleModify = async (): Promise<void> => {
    if (!selectedOrder || !approverUserId) { setActionMsg('Select an approver/modifier user.'); return; }
    setProcessing(true);
    setActionMsg(null);

    const modItems = (selectedOrder.items ?? [])
      .filter(li => li.status !== 'removed' && edits[li.id])
      .map(li => {
        const e = edits[li.id];
        return {
          lineItemId: li.id,
          newQuantity: parseFloat(e.qty) !== li.quantityOrdered ? parseFloat(e.qty) : null,
          newVendorId: e.vendorId && e.vendorId !== (li.vendorId ?? '') ? e.vendorId : null,
          remove: e.remove,
        };
      })
      .filter(m => m.newQuantity !== null || m.newVendorId !== null || m.remove);

    if (modItems.length === 0) { setActionMsg('No changes to apply.'); setProcessing(false); return; }

    const payload: ModifyOrderRequest = {
      modifiedBy: approverUserId,
      notes: modifyNotes || null,
      items: modItems,
    };

    try {
      await apiClient.put(`/orders/${selectedOrder.id}/modify`, payload);
      setActionMsg('✅ Order modified successfully!');
      setSelectedOrder(null);
      fetchPending();
    } catch (err) {
      const axiosErr = err as { response?: { data?: { error?: string } }; message?: string };
      setActionMsg('❌ ' + (axiosErr.response?.data?.error ?? axiosErr.message ?? 'Error'));
    } finally {
      setProcessing(false);
    }
  };

  const handleApprove = async (): Promise<void> => {
    if (!selectedOrder || !approverUserId) { setActionMsg('Select an approver user.'); return; }
    setProcessing(true);
    setActionMsg(null);

    const payload: ApproveOrderRequest = {
      approvedBy: approverUserId,
      approvalNotes: approvalNotes || null,
    };

    try {
      await apiClient.put(`/orders/${selectedOrder.id}/approve`, payload);
      setActionMsg('✅ Order approved successfully!');
      setSelectedOrder(null);
      fetchPending();
    } catch (err) {
      const axiosErr = err as { response?: { data?: { error?: string } }; message?: string };
      setActionMsg('❌ ' + (axiosErr.response?.data?.error ?? axiosErr.message ?? 'Error'));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <h1 style={styles.title}>Approval Queue</h1>
      <p style={styles.subtitle}>Pending orders awaiting focal point review.</p>

      {actionMsg && (
        <div style={actionMsg.startsWith('✅') ? styles.successBox : styles.errorBox}>{actionMsg}</div>
      )}

      {loading && <p style={styles.info}>Loading...</p>}
      {error && <p style={styles.error}>❌ {error}</p>}

      {/* Approver selector (global) */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={styles.inlineLabel}>
          Acting as:
          <select value={approverUserId} onChange={e => setApproverUserId(e.target.value)} style={styles.selectInline}>
            <option value="">— Select user —</option>
            {users.filter(u => u.role?.name === 'focal_point' || u.role?.name === 'admin').map(u => (
              <option key={u.id} value={u.id}>{u.fullName} ({u.role?.displayName})</option>
            ))}
          </select>
        </label>
      </div>

      {/* Review panel */}
      {selectedOrder && (
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <h3 style={{ color: 'var(--color-text-primary)', margin: 0 }}>
              Review: <code style={styles.code}>{selectedOrder.poNumber}</code>
            </h3>
            <button onClick={() => setSelectedOrder(null)} style={styles.closeBtn}>✕ Close</button>
          </div>
          <div style={styles.meta}>
            <span>Requester: {selectedOrder.requestedByName ?? 'Unknown requester'}</span>
            <span>Lab: {selectedOrder.labName}</span>
            <span>Location: {selectedOrder.locationName}</span>
            <span>Submitted: {new Date(selectedOrder.submittedAt).toLocaleString()}</span>
            {selectedOrder.orderNotes && <span>Notes: {selectedOrder.orderNotes}</span>}
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Vendor</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {(selectedOrder.items ?? []).filter(i => i.status !== 'removed').map(li => {
                const edit = edits[li.id];
                if (!edit) return null;
                return (
                  <tr key={li.id} style={edit.remove ? { opacity: 0.4 } : undefined}>
                    <td>{li.itemName}</td>
                    <td>
                      <select
                        value={edit.vendorId}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => updateEdit(li.id, 'vendorId', e.target.value)}
                        style={styles.inlineSelect}
                        disabled={edit.remove}
                      >
                        <option value="">— Default —</option>
                        {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0.001"
                        step="any"
                        value={edit.qty}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => updateEdit(li.id, 'qty', e.target.value)}
                        style={styles.qtyInput}
                        disabled={edit.remove}
                      />
                    </td>
                    <td>{li.unit}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={edit.remove}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => updateEdit(li.id, 'remove', e.target.checked)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div style={styles.actionRow}>
            <label style={styles.inlineLabel}>
              Notes:
              <input
                type="text"
                value={hasChanges() ? modifyNotes : approvalNotes}
                onChange={e => hasChanges() ? setModifyNotes(e.target.value) : setApprovalNotes(e.target.value)}
                style={styles.noteInput}
                placeholder="Optional notes..."
              />
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {hasChanges() && (
                <button onClick={handleModify} disabled={processing} style={styles.modifyBtn}>
                  {processing ? '⏳...' : '✏️ Save Modifications'}
                </button>
              )}
              <button onClick={handleApprove} disabled={processing} style={styles.approveBtn}>
                {processing ? '⏳...' : '✅ Approve'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pending orders list */}
      {!loading && !error && orders.length === 0 && (
        <p style={styles.info}>No pending orders at this time.</p>
      )}

      {!loading && !error && orders.length > 0 && !selectedOrder && (
        <div style={styles.tableWrapper}>
          <table className="data-table">
            <thead>
              <tr>
                <th>PO Number</th>
                <th>Requester</th>
                <th>Lab</th>
                <th>Items</th>
                <th>Total Qty</th>
                <th>Submitted</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td><code style={styles.code}>{o.poNumber}</code></td>
                  <td>{o.requestedByName ?? 'Unknown requester'}</td>
                  <td>{o.labName}</td>
                  <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{o.itemCount ?? '—'}</td>
                  <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{o.totalQty ?? '—'}</td>
                  <td>{new Date(o.submittedAt).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => openReview(o.id)} style={styles.reviewBtn}>Review</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  title: { color: 'var(--color-text-primary)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' },
  subtitle: { color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' },
  info: { color: 'var(--color-text-secondary)', fontStyle: 'italic' },
  error: { color: 'var(--color-danger)' },
  successBox: {
    background: 'var(--color-success-bg)', border: '1px solid var(--color-success-bg)',
    borderRadius: '8px', padding: '0.75rem 1rem', color: 'var(--color-success)', marginBottom: '1rem', fontWeight: 600,
  },
  errorBox: {
    background: 'var(--color-danger-bg)', border: '1px solid var(--color-danger-bg)',
    borderRadius: '8px', padding: '0.75rem 1rem', color: 'var(--color-danger)', marginBottom: '1rem',
  },
  tableWrapper: { overflowX: 'auto' },
  code: { color: 'var(--color-accent-hover)', background: 'var(--color-bg-primary)', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.85rem' },
  reviewBtn: {
    background: 'linear-gradient(135deg, var(--color-accent), #6366f1)', color: '#fff', border: 'none',
    borderRadius: '6px', padding: '0.35rem 0.8rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
  },
  panel: {
    background: 'var(--color-bg-surface)', borderRadius: '12px', border: '1px solid var(--color-border)',
    padding: '1.25rem', marginBottom: '1.5rem',
  },
  panelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' },
  closeBtn: { background: 'rgba(148, 163, 184, 0.15)', color: 'var(--color-text-secondary)', border: 'none', borderRadius: '6px', padding: '0.3rem 0.7rem', cursor: 'pointer' },
  meta: { display: 'flex', flexWrap: 'wrap', gap: '0.3rem 1.2rem', color: '#cbd5e1', fontSize: '0.88rem', marginBottom: '1rem' },
  inlineLabel: { color: 'var(--color-text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
  selectInline: {
    background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)', borderRadius: '6px',
    padding: '0.3rem 0.5rem', fontSize: '0.85rem',
  },
  inlineSelect: {
    background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)', borderRadius: '6px',
    padding: '0.3rem 0.5rem', fontSize: '0.85rem', width: '140px',
  },
  qtyInput: {
    width: '70px', background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)',
    borderRadius: '6px', padding: '0.3rem 0.5rem', fontSize: '0.9rem', textAlign: 'right',
  },
  noteInput: {
    background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)', borderRadius: '6px',
    padding: '0.3rem 0.5rem', fontSize: '0.85rem', minWidth: '200px',
  },
  actionRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', flexWrap: 'wrap', gap: '0.5rem' },
  modifyBtn: {
    background: 'linear-gradient(135deg, #a78bfa, #7c3aed)', color: '#fff', border: 'none',
    borderRadius: '6px', padding: '0.45rem 1rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
  },
  approveBtn: {
    background: 'linear-gradient(135deg, #059669, #10b981)', color: '#fff', border: 'none',
    borderRadius: '6px', padding: '0.45rem 1rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
  },
};

export default ApprovalQueuePage;

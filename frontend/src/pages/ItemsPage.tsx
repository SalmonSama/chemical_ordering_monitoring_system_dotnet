import { useEffect, useState, useCallback } from 'react';
import type { CSSProperties, ChangeEvent, FormEvent } from 'react';
import apiClient from '../api/client';
import type { Item, ItemCategory, Vendor } from '../types/models';

/* ================================================================
   Item Form State
   ================================================================ */

interface ItemFormState {
  itemName: string;
  itemShortName: string;
  partNo: string;
  casNo: string;
  categoryId: string;
  defaultVendorId: string;
  type: string;
  size: string;
  unit: string;
  referencePrice: string;
  currency: string;
  leadTimeDays: string;
  description: string;
  storageConditions: string;
  isOrderable: boolean;
  requiresCheckin: boolean;
  allowsCheckout: boolean;
  tracksExpiry: boolean;
  requiresPeroxideMonitoring: boolean;
  peroxideClass: string;
  isRegulatoryRelated: boolean;
  isActive: boolean;
}

const EMPTY_FORM: ItemFormState = {
  itemName: '',
  itemShortName: '',
  partNo: '',
  casNo: '',
  categoryId: '',
  defaultVendorId: '',
  type: '',
  size: '',
  unit: '',
  referencePrice: '',
  currency: '',
  leadTimeDays: '',
  description: '',
  storageConditions: '',
  isOrderable: true,
  requiresCheckin: true,
  allowsCheckout: true,
  tracksExpiry: true,
  requiresPeroxideMonitoring: false,
  peroxideClass: '',
  isRegulatoryRelated: false,
  isActive: true,
};

function itemToForm(item: Item): ItemFormState {
  return {
    itemName: item.itemName,
    itemShortName: item.itemShortName ?? '',
    partNo: item.partNo ?? '',
    casNo: item.casNo ?? '',
    categoryId: item.categoryId,
    defaultVendorId: item.defaultVendorId ?? '',
    type: item.type ?? '',
    size: item.size ?? '',
    unit: item.unit,
    referencePrice: item.referencePrice != null ? String(item.referencePrice) : '',
    currency: item.currency ?? '',
    leadTimeDays: item.leadTimeDays != null ? String(item.leadTimeDays) : '',
    description: item.description ?? '',
    storageConditions: item.storageConditions ?? '',
    isOrderable: item.isOrderable,
    requiresCheckin: item.requiresCheckin,
    allowsCheckout: item.allowsCheckout,
    tracksExpiry: item.tracksExpiry,
    requiresPeroxideMonitoring: item.requiresPeroxideMonitoring,
    peroxideClass: item.peroxideClass ?? '',
    isRegulatoryRelated: item.isRegulatoryRelated,
    isActive: item.isActive,
  };
}

function formToPayload(form: ItemFormState) {
  return {
    itemName: form.itemName,
    itemShortName: form.itemShortName || null,
    partNo: form.partNo || null,
    casNo: form.casNo || null,
    categoryId: form.categoryId,
    defaultVendorId: form.defaultVendorId || null,
    type: form.type || null,
    size: form.size || null,
    unit: form.unit,
    referencePrice: form.referencePrice ? parseFloat(form.referencePrice) : null,
    currency: form.currency || null,
    leadTimeDays: form.leadTimeDays ? parseInt(form.leadTimeDays, 10) : null,
    description: form.description || null,
    storageConditions: form.storageConditions || null,
    isOrderable: form.isOrderable,
    requiresCheckin: form.requiresCheckin,
    allowsCheckout: form.allowsCheckout,
    tracksExpiry: form.tracksExpiry,
    requiresPeroxideMonitoring: form.requiresPeroxideMonitoring,
    peroxideClass: form.peroxideClass || null,
    isRegulatoryRelated: form.isRegulatoryRelated,
    isActive: form.isActive,
  };
}

/* ================================================================
   BoolFlag Helper
   ================================================================ */

function BoolFlag({ value }: { value: boolean }): React.JSX.Element {
  return (
    <span style={{ color: value ? 'var(--color-success)' : 'var(--color-text-tertiary)', fontSize: '0.9rem' }}>
      {value ? '✓' : '—'}
    </span>
  );
}

/* ================================================================
   Items Page
   ================================================================ */

function ItemsPage(): React.JSX.Element {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<ItemCategory[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [form, setForm] = useState<ItemFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchItems = useCallback(() => {
    setLoading(true);
    apiClient.get<Item[]>('/items')
      .then(res => { setItems(res.data); setError(null); })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchItems();
    // Load reference data for dropdowns
    apiClient.get<ItemCategory[]>('/itemcategories').then(r => setCategories(r.data)).catch(() => {});
    apiClient.get<Vendor[]>('/vendors').then(r => setVendors(r.data)).catch(() => {});
  }, [fetchItems]);

  // ── Modal handlers ──────────────────────────────────────────
  const openCreate = () => {
    setEditingItem(null);
    setForm({ ...EMPTY_FORM, categoryId: categories[0]?.id ?? '' });
    setFormError(null);
    setShowModal(true);
  };

  const openEdit = (item: Item) => {
    setEditingItem(item);
    setForm(itemToForm(item));
    setFormError(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormError(null);
  };

  const setField = (field: keyof ItemFormState, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Client-side validation
    if (!form.itemName.trim()) { setFormError('Item name is required.'); return; }
    if (!form.categoryId) { setFormError('Category is required.'); return; }
    if (!form.unit.trim()) { setFormError('Unit is required.'); return; }

    setSaving(true);
    setFormError(null);

    try {
      const payload = formToPayload(form);
      if (editingItem) {
        await apiClient.put(`/items/${editingItem.id}`, payload);
      } else {
        await apiClient.post('/items', payload);
      }
      closeModal();
      fetchItems();
    } catch (err) {
      const axiosErr = err as { response?: { data?: { error?: string } }; message?: string };
      setFormError(axiosErr.response?.data?.error ?? axiosErr.message ?? 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete handler ──────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await apiClient.delete(`/items/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchItems();
    } catch (err) {
      const axiosErr = err as { response?: { data?: { error?: string } }; message?: string };
      setDeleteError(axiosErr.response?.data?.error ?? axiosErr.message ?? 'Delete failed.');
    } finally {
      setDeleting(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div style={S.headerRow}>
        <div>
          <h1 style={S.title}>Items</h1>
          <p style={S.subtitle}>Master item catalog with behavior flags per plan category behavior matrix.</p>
        </div>
        <button onClick={openCreate} style={S.addBtn}>+ Add Item</button>
      </div>

      {loading && <p style={S.info}>Loading...</p>}
      {error && <p style={S.error}>❌ {error}</p>}

      {!loading && !error && (
        <div style={S.card}>
          <div style={S.tableWrap}>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Name</th>
                  <th style={S.th}>Category</th>
                  <th style={S.th}>Part No</th>
                  <th style={S.th}>Vendor</th>
                  <th style={S.th}>Size</th>
                  <th style={S.th}>Unit</th>
                  <th style={S.th}>Price</th>
                  <th style={S.thCenter}>Orderable</th>
                  <th style={S.thCenter}>Check-In</th>
                  <th style={S.thCenter}>Checkout</th>
                  <th style={S.thCenter}>Expiry</th>
                  <th style={S.thCenter}>Peroxide</th>
                  <th style={S.thCenter}>Regulatory</th>
                  <th style={S.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td style={S.td}>
                      <div>{item.itemName}</div>
                      {item.casNo && <div style={S.cas}>CAS: {item.casNo}</div>}
                    </td>
                    <td style={S.td}>
                      <code style={S.code}>{item.category?.code}</code>
                    </td>
                    <td style={S.td}>{item.partNo || '—'}</td>
                    <td style={S.td}>{item.defaultVendor?.name || '—'}</td>
                    <td style={S.td}>{item.size || '—'}</td>
                    <td style={S.td}>{item.unit}</td>
                    <td style={S.td}>
                      {item.referencePrice != null
                        ? `${item.currency || '$'}${item.referencePrice.toFixed(2)}`
                        : '—'}
                    </td>
                    <td style={S.tdCenter}><BoolFlag value={item.isOrderable} /></td>
                    <td style={S.tdCenter}><BoolFlag value={item.requiresCheckin} /></td>
                    <td style={S.tdCenter}><BoolFlag value={item.allowsCheckout} /></td>
                    <td style={S.tdCenter}><BoolFlag value={item.tracksExpiry} /></td>
                    <td style={S.tdCenter}><BoolFlag value={item.requiresPeroxideMonitoring} /></td>
                    <td style={S.tdCenter}><BoolFlag value={item.isRegulatoryRelated} /></td>
                    <td style={S.td}>
                      <div style={S.actionsCell}>
                        <button onClick={() => openEdit(item)} style={S.editBtn}>Edit</button>
                        <button onClick={() => { setDeleteError(null); setDeleteTarget(item); }} style={S.deleteBtn}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Modal Overlay ─────────────────────────────────────── */}
      {showModal && (
        <div style={S.overlay} onClick={closeModal}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <div style={S.modalHeader}>
              <h2 style={S.modalTitle}>{editingItem ? 'Edit Item' : 'Add Item'}</h2>
              <button onClick={closeModal} style={S.closeBtn}>✕</button>
            </div>

            {formError && <div style={S.formError}>{formError}</div>}

            <form onSubmit={handleSubmit} style={S.form}>
              {/* ── Basic Info ── */}
              <fieldset style={S.fieldset}>
                <legend style={S.legend}>Basic Information</legend>
                <div style={S.fieldGrid}>
                  <div style={S.field}>
                    <label style={S.label}>Item Name *</label>
                    <input
                      value={form.itemName}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setField('itemName', e.target.value)}
                      required style={S.input} placeholder="e.g. Acetone, HPLC-grade"
                    />
                  </div>
                  <div style={S.field}>
                    <label style={S.label}>Short Name</label>
                    <input
                      value={form.itemShortName}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setField('itemShortName', e.target.value)}
                      style={S.input} placeholder="Abbreviated name"
                    />
                  </div>
                  <div style={S.field}>
                    <label style={S.label}>Category *</label>
                    <select
                      value={form.categoryId}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setField('categoryId', e.target.value)}
                      required style={S.input}
                    >
                      <option value="">— Select —</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
                    </select>
                  </div>
                  <div style={S.field}>
                    <label style={S.label}>Part Number</label>
                    <input
                      value={form.partNo}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setField('partNo', e.target.value)}
                      style={S.input} placeholder="e.g. A929-4"
                    />
                  </div>
                  <div style={S.field}>
                    <label style={S.label}>CAS Number</label>
                    <input
                      value={form.casNo}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setField('casNo', e.target.value)}
                      style={S.input} placeholder="e.g. 67-64-1"
                    />
                  </div>
                  <div style={S.field}>
                    <label style={S.label}>Type</label>
                    <input
                      value={form.type}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setField('type', e.target.value)}
                      style={S.input} placeholder="e.g. Solvent, Reagent"
                    />
                  </div>
                </div>
              </fieldset>

              {/* ── Supply Info ── */}
              <fieldset style={S.fieldset}>
                <legend style={S.legend}>Supply &amp; Pricing</legend>
                <div style={S.fieldGrid}>
                  <div style={S.field}>
                    <label style={S.label}>Default Vendor</label>
                    <select
                      value={form.defaultVendorId}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setField('defaultVendorId', e.target.value)}
                      style={S.input}
                    >
                      <option value="">— None —</option>
                      {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                    </select>
                  </div>
                  <div style={S.field}>
                    <label style={S.label}>Size</label>
                    <input
                      value={form.size}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setField('size', e.target.value)}
                      style={S.input} placeholder="e.g. 500ml, 1kg"
                    />
                  </div>
                  <div style={S.field}>
                    <label style={S.label}>Unit *</label>
                    <input
                      value={form.unit}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setField('unit', e.target.value)}
                      required style={S.input} placeholder="e.g. bottle, pack"
                    />
                  </div>
                  <div style={S.field}>
                    <label style={S.label}>Reference Price</label>
                    <input
                      type="number" step="0.01" min="0"
                      value={form.referencePrice}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setField('referencePrice', e.target.value)}
                      style={S.input} placeholder="0.00"
                    />
                  </div>
                  <div style={S.field}>
                    <label style={S.label}>Currency</label>
                    <input
                      value={form.currency}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setField('currency', e.target.value)}
                      style={S.input} placeholder="e.g. USD, THB"
                    />
                  </div>
                  <div style={S.field}>
                    <label style={S.label}>Lead Time (days)</label>
                    <input
                      type="number" min="0"
                      value={form.leadTimeDays}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setField('leadTimeDays', e.target.value)}
                      style={S.input} placeholder="e.g. 14"
                    />
                  </div>
                </div>
              </fieldset>

              {/* ── Behavior Flags ── */}
              <fieldset style={S.fieldset}>
                <legend style={S.legend}>Behavior Flags</legend>
                <div style={S.flagGrid}>
                  {([
                    ['isOrderable', 'Orderable'],
                    ['requiresCheckin', 'Requires Check-In'],
                    ['allowsCheckout', 'Allows Checkout'],
                    ['tracksExpiry', 'Tracks Expiry'],
                    ['requiresPeroxideMonitoring', 'Peroxide Monitoring'],
                    ['isRegulatoryRelated', 'Regulatory Related'],
                    ['isActive', 'Active'],
                  ] as [keyof ItemFormState, string][]).map(([key, lbl]) => (
                    <label key={key} style={S.flagLabel}>
                      <input
                        type="checkbox"
                        checked={form[key] as boolean}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setField(key, e.target.checked)}
                        style={S.checkbox}
                      />
                      <span>{lbl}</span>
                    </label>
                  ))}
                </div>
                {form.requiresPeroxideMonitoring && (
                  <div style={{ ...S.field, marginTop: '0.75rem', maxWidth: '280px' }}>
                    <label style={S.label}>Peroxide Class</label>
                    <input
                      value={form.peroxideClass}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setField('peroxideClass', e.target.value)}
                      style={S.input} placeholder="e.g. A, B, C"
                    />
                  </div>
                )}
              </fieldset>

              {/* ── Notes ── */}
              <fieldset style={S.fieldset}>
                <legend style={S.legend}>Notes</legend>
                <div style={S.fieldGrid}>
                  <div style={S.field}>
                    <label style={S.label}>Description</label>
                    <textarea
                      value={form.description}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setField('description', e.target.value)}
                      style={{ ...S.input, minHeight: '60px', resize: 'vertical' }}
                      placeholder="Optional description..."
                    />
                  </div>
                  <div style={S.field}>
                    <label style={S.label}>Storage Conditions</label>
                    <textarea
                      value={form.storageConditions}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setField('storageConditions', e.target.value)}
                      style={{ ...S.input, minHeight: '60px', resize: 'vertical' }}
                      placeholder="e.g. Store at 2-8°C"
                    />
                  </div>
                </div>
              </fieldset>

              {/* ── Actions ── */}
              <div style={S.formActions}>
                <button type="submit" disabled={saving} style={S.submitBtn}>
                  {saving ? '⏳ Saving...' : editingItem ? '💾 Save Changes' : '➕ Create Item'}
                </button>
                <button type="button" onClick={closeModal} style={S.cancelBtn}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Dialog ────────────────────────────── */}
      {deleteTarget && (
        <div style={S.overlay} onClick={() => { if (!deleting) setDeleteTarget(null); }}>
          <div style={S.confirmBox} onClick={e => e.stopPropagation()}>
            <h3 style={S.confirmTitle}>⚠️ Deactivate Item</h3>
            <p style={S.confirmText}>
              Are you sure you want to deactivate <strong>{deleteTarget.itemName}</strong>?
            </p>
            <p style={S.confirmSubtext}>
              The item will be hidden from all listings but preserved in the database for historical records.
            </p>
            {deleteError && <div style={S.formError}>{deleteError}</div>}
            <div style={S.confirmActions}>
              <button onClick={handleDelete} disabled={deleting} style={S.confirmDeleteBtn}>
                {deleting ? '⏳ Deactivating...' : '🗑 Deactivate'}
              </button>
              <button onClick={() => setDeleteTarget(null)} disabled={deleting} style={S.cancelBtn}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================================
   Styles
   ================================================================ */

const S: Record<string, CSSProperties> = {
  // Page
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' },
  title: { color: 'var(--color-text-primary)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' },
  subtitle: { color: 'var(--color-text-secondary)', fontSize: '0.9rem', margin: 0 },
  info: { color: 'var(--color-text-secondary)', fontStyle: 'italic' },
  error: { color: 'var(--color-danger)' },
  addBtn: {
    background: 'linear-gradient(135deg, var(--color-accent), #6366f1)', color: '#fff',
    border: 'none', borderRadius: '8px', padding: '0.6rem 1.25rem',
    fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
    flexShrink: 0,
  },

  // Table
  card: { background: 'var(--color-bg-surface)', borderRadius: '12px', border: '1px solid var(--color-border)', padding: '1.25rem' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '1200px' },
  th: { textAlign: 'left', padding: '0.6rem 0.75rem', color: 'var(--color-text-tertiary)', borderBottom: '1px solid var(--color-border)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' },
  thCenter: { textAlign: 'center', padding: '0.6rem 0.5rem', color: 'var(--color-text-tertiary)', borderBottom: '1px solid var(--color-border)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' },
  td: { padding: '0.6rem 0.75rem', color: 'var(--color-text-primary)', borderBottom: '1px solid var(--color-bg-surface)', verticalAlign: 'top' },
  tdCenter: { padding: '0.6rem 0.5rem', color: 'var(--color-text-primary)', borderBottom: '1px solid var(--color-bg-surface)', textAlign: 'center' },
  cas: { color: 'var(--color-text-tertiary)', fontSize: '0.8rem', marginTop: '0.2rem' },
  code: { color: 'var(--color-accent-hover)', background: 'var(--color-bg-primary)', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.85rem' },
  actionsCell: { display: 'flex', gap: '0.4rem' },
  editBtn: {
    background: 'var(--color-accent-soft)', color: 'var(--color-accent)', border: '1px solid var(--color-accent)',
    borderRadius: '6px', padding: '0.3rem 0.7rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
  },
  deleteBtn: {
    background: 'transparent', color: 'var(--color-danger)', border: '1px solid var(--color-danger)',
    borderRadius: '6px', padding: '0.3rem 0.7rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
  },

  // Modal
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: '1rem',
  },
  modal: {
    background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)',
    borderRadius: '16px', width: '100%', maxWidth: '780px',
    maxHeight: '90vh', overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
  },
  modalHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)',
    position: 'sticky', top: 0, background: 'var(--color-bg-surface)',
    zIndex: 1, borderRadius: '16px 16px 0 0',
  },
  modalTitle: { fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 },
  closeBtn: {
    background: 'var(--color-bg-hover)', border: '1px solid var(--color-border)',
    borderRadius: '8px', width: '32px', height: '32px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: '1rem', padding: 0,
  },
  formError: {
    background: 'var(--color-danger-bg)', color: 'var(--color-danger)',
    border: '1px solid var(--color-danger)', borderRadius: '8px',
    padding: '0.6rem 1rem', margin: '1rem 1.5rem 0', fontSize: '0.85rem',
  },

  // Form
  form: { padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' },
  fieldset: {
    border: '1px solid var(--color-border)', borderRadius: '10px',
    padding: '1rem 1.25rem', margin: 0,
  },
  legend: {
    color: 'var(--color-text-secondary)', fontSize: '0.8rem', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 0.5rem',
  },
  fieldGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  label: { color: 'var(--color-text-secondary)', fontSize: '0.8rem', fontWeight: 600 },
  input: {
    background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)',
    border: '1px solid var(--color-border)', borderRadius: '6px',
    padding: '0.5rem 0.65rem', fontSize: '0.875rem', outline: 'none',
    width: '100%', boxSizing: 'border-box',
  },
  flagGrid: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1.5rem' },
  flagLabel: {
    display: 'flex', alignItems: 'center', gap: '0.4rem',
    fontSize: '0.85rem', color: 'var(--color-text-primary)', cursor: 'pointer',
  },
  checkbox: { accentColor: 'var(--color-accent)', width: '16px', height: '16px' },

  // Form actions
  formActions: { display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' },
  submitBtn: {
    background: 'linear-gradient(135deg, var(--color-accent), #6366f1)', color: '#fff',
    border: 'none', borderRadius: '8px', padding: '0.65rem 1.5rem',
    fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
  },
  cancelBtn: {
    background: 'transparent', color: 'var(--color-text-secondary)',
    border: '1px solid var(--color-border)', borderRadius: '8px',
    padding: '0.65rem 1.25rem', fontSize: '0.9rem', cursor: 'pointer',
  },

  // Confirm dialog
  confirmBox: {
    background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)',
    borderRadius: '14px', padding: '1.5rem', width: '100%', maxWidth: '440px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
  },
  confirmTitle: { color: 'var(--color-text-primary)', fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.5rem' },
  confirmText: { color: 'var(--color-text-primary)', fontSize: '0.9rem', margin: '0 0 0.25rem' },
  confirmSubtext: { color: 'var(--color-text-tertiary)', fontSize: '0.8rem', margin: '0 0 1rem' },
  confirmActions: { display: 'flex', gap: '0.75rem' },
  confirmDeleteBtn: {
    background: 'var(--color-danger)', color: '#fff',
    border: 'none', borderRadius: '8px', padding: '0.6rem 1.25rem',
    fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
  },
};

export default ItemsPage;

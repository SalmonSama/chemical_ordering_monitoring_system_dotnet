import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import apiClient from '../api/client';
import type { InventoryLot } from '../types/models';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';

function InventoryLotsPage(): React.JSX.Element {
  const [lots, setLots] = useState<InventoryLot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    apiClient.get<InventoryLot[]>('/inventorylots')
      .then(res => { 
        let filtered = res.data;
        if (user && user.locationScopeType === 'specific') {
          const allowedSet = new Set(user.locations.map(l => l.id));
          filtered = filtered.filter(lot => allowedSet.has(lot.locationId));
        }
        setLots(filtered); 
        setError(null); 
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);


  const fmtDate = (d: string | null): string => d ? new Date(d).toLocaleDateString() : '—';

  return (
    <div>
      <h1 style={styles.title}>Inventory Lots</h1>
      <p style={styles.subtitle}>All inventory lots — lab-level stock records created via check-in.</p>

      {loading && <p style={styles.info}>Loading...</p>}
      {error && <p style={styles.error}>❌ {error}</p>}

      {!loading && !error && lots.length === 0 && (
        <p style={styles.info}>No inventory lots yet. Use Manual Check-In to create one.</p>
      )}

      {!loading && !error && lots.length > 0 && (
        <div style={styles.tableWrapper}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Lot #</th>
                <th>Lab</th>
                <th>Location</th>
                <th>Qty Received</th>
                <th>Qty Remaining</th>
                <th>Unit</th>
                <th>Status</th>
                <th>Expiry</th>
                <th>Source</th>
                <th>Checked-In At</th>
                <th>Checked-In By</th>
              </tr>
            </thead>
            <tbody>
              {lots.map(lot => {
                return (
                  <tr key={lot.id}>
                    <td>{lot.item?.itemName ?? lot.itemId}</td>
                    <td><code style={styles.code}>{lot.lotNumber}</code></td>
                    <td>{lot.lab?.name ?? '—'}</td>
                    <td>{lot.location?.name ?? '—'}</td>
                    <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{lot.quantityReceived}</td>
                    <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{lot.quantityRemaining}</td>
                    <td>{lot.unit}</td>
                    <td><StatusBadge status={lot.status} /></td>
                    <td>{fmtDate(lot.expiryDate)}</td>
                    <td><span style={styles.sourceTag}>{lot.sourceType}</span></td>
                    <td>{new Date(lot.checkedInAt).toLocaleString()}</td>
                    <td>{lot.checkedInByUser?.fullName ?? '—'}</td>
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
  sourceTag: { color: '#a78bfa', background: 'rgba(167, 139, 250, 0.1)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize' },
};

export default InventoryLotsPage;

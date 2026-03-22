import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import apiClient from '../api/client';
import type { InventoryLot } from '../types/models';

interface StatusColor {
  color: string;
  bg: string;
}

function InventoryLotsPage(): React.JSX.Element {
  const [lots, setLots] = useState<InventoryLot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient.get<InventoryLot[]>('/inventorylots')
      .then(res => { setLots(res.data); setError(null); })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const statusColor = (status: string): StatusColor => {
    switch (status) {
      case 'active': return { color: 'var(--color-success)', bg: 'var(--color-success-bg)' };
      case 'expired': return { color: 'var(--color-danger)', bg: 'rgba(248, 113, 113, 0.1)' };
      case 'depleted': return { color: 'var(--color-text-secondary)', bg: 'rgba(148, 163, 184, 0.1)' };
      case 'quarantined': return { color: 'var(--color-warning)', bg: 'rgba(251, 191, 36, 0.1)' };
      case 'disposed': return { color: 'var(--color-text-tertiary)', bg: 'rgba(100, 116, 139, 0.1)' };
      default: return { color: 'var(--color-text-secondary)', bg: 'rgba(148, 163, 184, 0.1)' };
    }
  };

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
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Item</th>
                <th style={styles.th}>Lot #</th>
                <th style={styles.th}>Lab</th>
                <th style={styles.th}>Location</th>
                <th style={styles.th}>Qty Received</th>
                <th style={styles.th}>Qty Remaining</th>
                <th style={styles.th}>Unit</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Expiry</th>
                <th style={styles.th}>Source</th>
                <th style={styles.th}>Checked-In At</th>
                <th style={styles.th}>Checked-In By</th>
              </tr>
            </thead>
            <tbody>
              {lots.map(lot => {
                const sc = statusColor(lot.status);
                return (
                  <tr key={lot.id} style={styles.tr}>
                    <td style={styles.td}>{lot.item?.itemName ?? lot.itemId}</td>
                    <td style={styles.td}><code style={styles.code}>{lot.lotNumber}</code></td>
                    <td style={styles.td}>{lot.lab?.name ?? '—'}</td>
                    <td style={styles.td}>{lot.location?.name ?? '—'}</td>
                    <td style={styles.tdNum}>{lot.quantityReceived}</td>
                    <td style={styles.tdNum}>{lot.quantityRemaining}</td>
                    <td style={styles.td}>{lot.unit}</td>
                    <td style={styles.td}>
                      <span style={{ color: sc.color, background: sc.bg, padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize' }}>
                        {lot.status}
                      </span>
                    </td>
                    <td style={styles.td}>{fmtDate(lot.expiryDate)}</td>
                    <td style={styles.td}><span style={styles.sourceTag}>{lot.sourceType}</span></td>
                    <td style={styles.td}>{new Date(lot.checkedInAt).toLocaleString()}</td>
                    <td style={styles.td}>{lot.checkedInByUser?.fullName ?? '—'}</td>
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
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '1000px' },
  th: { textAlign: 'left', padding: '0.6rem 0.75rem', color: 'var(--color-text-tertiary)', borderBottom: '1px solid var(--color-border)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' },
  tr: { borderBottom: '1px solid var(--color-bg-surface)' },
  td: { padding: '0.6rem 0.75rem', color: 'var(--color-text-primary)', fontSize: '0.9rem', whiteSpace: 'nowrap' },
  tdNum: { padding: '0.6rem 0.75rem', color: 'var(--color-text-primary)', fontSize: '0.9rem', textAlign: 'right', fontVariantNumeric: 'tabular-nums' },
  code: { color: 'var(--color-accent-hover)', background: 'var(--color-bg-primary)', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.85rem' },
  sourceTag: { color: '#a78bfa', background: 'rgba(167, 139, 250, 0.1)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize' },
};

export default InventoryLotsPage;

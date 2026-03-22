import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import apiClient from '../api/client';
import type { StockTransaction } from '../types/models';

interface TypeColor {
  color: string;
  bg: string;
}

const TYPE_LABELS: Record<string, string> = {
  manual_check_in: 'Manual Check-In',
  check_in: 'Check-In (PO)',
  checkout: 'Checkout',
  adjustment: 'Adjustment',
  disposal: 'Disposal',
};

function StockTransactionsPage(): React.JSX.Element {
  const [txns, setTxns] = useState<StockTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient.get<StockTransaction[]>('/stocktransactions')
      .then(res => { setTxns(res.data); setError(null); })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const typeColor = (type: string): TypeColor => {
    switch (type) {
      case 'manual_check_in':
      case 'check_in': return { color: 'var(--color-success)', bg: 'var(--color-success-bg)' };
      case 'checkout': return { color: 'var(--color-accent-hover)', bg: 'rgba(96, 165, 250, 0.1)' };
      case 'adjustment': return { color: 'var(--color-warning)', bg: 'rgba(251, 191, 36, 0.1)' };
      case 'disposal': return { color: 'var(--color-danger)', bg: 'rgba(248, 113, 113, 0.1)' };
      default: return { color: 'var(--color-text-secondary)', bg: 'rgba(148, 163, 184, 0.1)' };
    }
  };

  return (
    <div>
      <h1 style={styles.title}>Stock Transactions</h1>
      <p style={styles.subtitle}>Append-only log of all inventory actions — the system's immutable audit trail.</p>

      {loading && <p style={styles.info}>Loading...</p>}
      {error && <p style={styles.error}>❌ {error}</p>}

      {!loading && !error && txns.length === 0 && (
        <p style={styles.info}>No transactions yet. Perform a check-in to create the first entry.</p>
      )}

      {!loading && !error && txns.length > 0 && (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Timestamp</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Item</th>
                <th style={styles.th}>Lot #</th>
                <th style={styles.th}>Quantity</th>
                <th style={styles.th}>User</th>
                <th style={styles.th}>Lab</th>
                <th style={styles.th}>Location</th>
                <th style={styles.th}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {txns.map(txn => {
                const tc = typeColor(txn.transactionType);
                return (
                  <tr key={txn.id} style={styles.tr}>
                    <td style={styles.td}>{new Date(txn.createdAt).toLocaleString()}</td>
                    <td style={styles.td}>
                      <span style={{ color: tc.color, background: tc.bg, padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {TYPE_LABELS[txn.transactionType] ?? txn.transactionType}
                      </span>
                    </td>
                    <td style={styles.td}>{txn.item?.itemName ?? '—'}</td>
                    <td style={styles.td}>
                      {txn.inventoryLot ? <code style={styles.code}>{txn.inventoryLot.lotNumber}</code> : '—'}
                    </td>
                    <td style={styles.tdNum}>{txn.quantity ?? '—'}</td>
                    <td style={styles.td}>{txn.userName}</td>
                    <td style={styles.td}>{txn.lab?.name ?? '—'}</td>
                    <td style={styles.td}>{txn.location?.name ?? '—'}</td>
                    <td style={{ ...styles.td, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {txn.notes ?? '—'}
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
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '900px' },
  th: { textAlign: 'left', padding: '0.6rem 0.75rem', color: 'var(--color-text-tertiary)', borderBottom: '1px solid var(--color-border)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' },
  tr: { borderBottom: '1px solid var(--color-bg-surface)' },
  td: { padding: '0.6rem 0.75rem', color: 'var(--color-text-primary)', fontSize: '0.9rem', whiteSpace: 'nowrap' },
  tdNum: { padding: '0.6rem 0.75rem', color: 'var(--color-text-primary)', fontSize: '0.9rem', textAlign: 'right', fontVariantNumeric: 'tabular-nums' },
  code: { color: 'var(--color-accent-hover)', background: 'var(--color-bg-primary)', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.85rem' },
};

export default StockTransactionsPage;

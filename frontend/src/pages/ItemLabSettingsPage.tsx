import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import apiClient from '../api/client';
import type { ItemLabSetting } from '../types/models';

function ItemLabSettingsPage(): React.JSX.Element {
  const [settings, setSettings] = useState<ItemLabSetting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient.get<ItemLabSetting[]>('/itemlabsettings')
      .then(res => { setSettings(res.data); setError(null); })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 style={styles.title}>Item Lab Settings</h1>
      <p style={styles.subtitle}>Per-item, per-lab configuration — normalized min stock thresholds (not spreadsheet columns).</p>

      {loading && <p style={styles.info}>Loading...</p>}
      {error && <p style={styles.error}>❌ {error}</p>}

      {!loading && !error && (
        <div style={styles.card}>
          {settings.length === 0 ? (
            <p style={styles.info}>No item lab settings configured yet.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Item</th>
                  <th style={styles.th}>Location</th>
                  <th style={styles.th}>Lab</th>
                  <th style={styles.th}>Min Stock</th>
                  <th style={styles.th}>Reorder Qty</th>
                  <th style={styles.th}>Stocked</th>
                  <th style={styles.th}>Storage</th>
                </tr>
              </thead>
              <tbody>
                {settings.map(s => (
                  <tr key={s.id}>
                    <td style={styles.td}>{s.item?.itemName || '—'}</td>
                    <td style={styles.td}>
                      <code style={styles.code}>{s.lab?.location?.code || '—'}</code>
                    </td>
                    <td style={styles.td}>{s.lab?.name || '—'}</td>
                    <td style={styles.td}>{s.minStock != null ? s.minStock : '—'}</td>
                    <td style={styles.td}>{s.reorderQuantity != null ? s.reorderQuantity : '—'}</td>
                    <td style={styles.td}>
                      <span style={s.isStocked ? styles.activeBadge : styles.inactiveBadge}>
                        {s.isStocked ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td style={styles.td}>{s.storageSublocation || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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
  card: { background: 'var(--color-bg-surface)', borderRadius: '12px', border: '1px solid var(--color-border)', padding: '1.25rem' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '0.6rem 0.75rem', color: 'var(--color-text-tertiary)', borderBottom: '1px solid var(--color-border)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
  td: { padding: '0.6rem 0.75rem', color: 'var(--color-text-primary)', borderBottom: '1px solid var(--color-bg-surface)' },
  code: { color: 'var(--color-accent-hover)', background: 'var(--color-bg-primary)', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.85rem' },
  activeBadge: { color: 'var(--color-success)', background: 'var(--color-success-bg)', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem' },
  inactiveBadge: { color: 'var(--color-text-tertiary)', background: 'rgba(100, 116, 139, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem' },
};

export default ItemLabSettingsPage;

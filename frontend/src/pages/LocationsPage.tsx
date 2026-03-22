import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import apiClient from '../api/client';
import type { Location } from '../types/models';

function LocationsPage(): React.JSX.Element {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient.get<Location[]>('/locations')
      .then(res => { setLocations(res.data); setError(null); })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 style={styles.title}>Locations &amp; Labs</h1>
      <p style={styles.subtitle}>Organization hierarchy — each location contains one or more labs.</p>

      {loading && <p style={styles.info}>Loading...</p>}
      {error && <p style={styles.error}>❌ {error}</p>}

      {!loading && !error && locations.map(loc => (
        <div key={loc.id} style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.locationName}>{loc.name}</span>
            <span style={styles.badge}>{loc.code}</span>
          </div>
          {loc.labs && loc.labs.length > 0 ? (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Lab Name</th>
                  <th style={styles.th}>Code</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {loc.labs.map(lab => (
                  <tr key={lab.id}>
                    <td style={styles.td}>{lab.name}</td>
                    <td style={styles.td}><code style={styles.code}>{lab.code}</code></td>
                    <td style={styles.td}>
                      <span style={lab.isActive ? styles.activeBadge : styles.inactiveBadge}>
                        {lab.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={styles.info}>No labs configured.</p>
          )}
        </div>
      ))}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  title: { color: 'var(--color-text-primary)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' },
  subtitle: { color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' },
  info: { color: 'var(--color-text-secondary)', fontStyle: 'italic' },
  error: { color: 'var(--color-danger)' },
  card: { background: 'var(--color-bg-surface)', borderRadius: '12px', border: '1px solid var(--color-border)', padding: '1.25rem', marginBottom: '1rem' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' },
  locationName: { color: 'var(--color-text-primary)', fontSize: '1.1rem', fontWeight: 600 },
  badge: { background: 'var(--color-accent)', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '0.6rem 0.75rem', color: 'var(--color-text-tertiary)', borderBottom: '1px solid var(--color-border)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
  td: { padding: '0.6rem 0.75rem', color: 'var(--color-text-primary)', borderBottom: '1px solid var(--color-bg-surface)' },
  code: { color: 'var(--color-accent-hover)', background: 'var(--color-bg-primary)', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.85rem' },
  activeBadge: { color: 'var(--color-success)', background: 'var(--color-success-bg)', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem' },
  inactiveBadge: { color: 'var(--color-danger)', background: 'rgba(248, 113, 113, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem' },
};

export default LocationsPage;

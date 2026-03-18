import { useEffect, useState } from 'react';
import apiClient from '../api/client';

function LocationsPage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiClient.get('/locations')
      .then(res => { setLocations(res.data); setError(null); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 style={styles.title}>Locations & Labs</h1>
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

const styles = {
  title: { color: '#f1f5f9', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' },
  subtitle: { color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' },
  info: { color: '#94a3b8', fontStyle: 'italic' },
  error: { color: '#f87171' },
  card: { background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '1.25rem', marginBottom: '1rem' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' },
  locationName: { color: '#f1f5f9', fontSize: '1.1rem', fontWeight: 600 },
  badge: { background: '#3b82f6', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '0.6rem 0.75rem', color: '#64748b', borderBottom: '1px solid #334155', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
  td: { padding: '0.6rem 0.75rem', color: '#e2e8f0', borderBottom: '1px solid #1e293b' },
  code: { color: '#60a5fa', background: '#0f172a', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.85rem' },
  activeBadge: { color: '#34d399', background: 'rgba(52, 211, 153, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem' },
  inactiveBadge: { color: '#f87171', background: 'rgba(248, 113, 113, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem' },
};

export default LocationsPage;

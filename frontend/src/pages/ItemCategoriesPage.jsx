import { useEffect, useState } from 'react';
import apiClient from '../api/client';

function ItemCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiClient.get('/itemcategories')
      .then(res => { setCategories(res.data); setError(null); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 style={styles.title}>Item Categories</h1>
      <p style={styles.subtitle}>Categories that determine item behavior and workflow capabilities.</p>

      {loading && <p style={styles.info}>Loading...</p>}
      {error && <p style={styles.error}>❌ {error}</p>}

      {!loading && !error && (
        <div style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Order</th>
                <th style={styles.th}>Code</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(c => (
                <tr key={c.id}>
                  <td style={styles.td}>{c.displayOrder}</td>
                  <td style={styles.td}><code style={styles.code}>{c.code}</code></td>
                  <td style={styles.td}>{c.name}</td>
                  <td style={styles.tdDesc}>{c.description || '—'}</td>
                  <td style={styles.td}>
                    <span style={c.isActive ? styles.activeBadge : styles.inactiveBadge}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
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

const styles = {
  title: { color: '#f1f5f9', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' },
  subtitle: { color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' },
  info: { color: '#94a3b8', fontStyle: 'italic' },
  error: { color: '#f87171' },
  card: { background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '1.25rem' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '0.6rem 0.75rem', color: '#64748b', borderBottom: '1px solid #334155', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
  td: { padding: '0.6rem 0.75rem', color: '#e2e8f0', borderBottom: '1px solid #1e293b' },
  tdDesc: { padding: '0.6rem 0.75rem', color: '#94a3b8', borderBottom: '1px solid #1e293b', fontSize: '0.9rem' },
  code: { color: '#60a5fa', background: '#0f172a', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.85rem' },
  activeBadge: { color: '#34d399', background: 'rgba(52, 211, 153, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem' },
  inactiveBadge: { color: '#f87171', background: 'rgba(248, 113, 113, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem' },
};

export default ItemCategoriesPage;

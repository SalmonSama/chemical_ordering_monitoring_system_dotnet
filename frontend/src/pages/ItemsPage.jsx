import { useEffect, useState } from 'react';
import apiClient from '../api/client';

function ItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiClient.get('/items')
      .then(res => { setItems(res.data); setError(null); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const BoolFlag = ({ value }) => (
    <span style={{ color: value ? '#34d399' : '#64748b', fontSize: '0.9rem' }}>
      {value ? '✓' : '—'}
    </span>
  );

  return (
    <div>
      <h1 style={styles.title}>Items</h1>
      <p style={styles.subtitle}>Master item catalog with behavior flags per plan category behavior matrix.</p>

      {loading && <p style={styles.info}>Loading...</p>}
      {error && <p style={styles.error}>❌ {error}</p>}

      {!loading && !error && (
        <div style={styles.card}>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Part No</th>
                  <th style={styles.th}>Vendor</th>
                  <th style={styles.th}>Size</th>
                  <th style={styles.th}>Unit</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.thCenter}>Orderable</th>
                  <th style={styles.thCenter}>Check-In</th>
                  <th style={styles.thCenter}>Checkout</th>
                  <th style={styles.thCenter}>Expiry</th>
                  <th style={styles.thCenter}>Peroxide</th>
                  <th style={styles.thCenter}>Regulatory</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td style={styles.td}>
                      <div>{item.itemName}</div>
                      {item.casNo && <div style={styles.cas}>CAS: {item.casNo}</div>}
                    </td>
                    <td style={styles.td}>
                      <code style={styles.code}>{item.category?.code}</code>
                    </td>
                    <td style={styles.td}>{item.partNo || '—'}</td>
                    <td style={styles.td}>{item.defaultVendor?.name || '—'}</td>
                    <td style={styles.td}>{item.size || '—'}</td>
                    <td style={styles.td}>{item.unit}</td>
                    <td style={styles.td}>
                      {item.referencePrice != null
                        ? `${item.currency || '$'}${item.referencePrice.toFixed(2)}`
                        : '—'}
                    </td>
                    <td style={styles.tdCenter}><BoolFlag value={item.isOrderable} /></td>
                    <td style={styles.tdCenter}><BoolFlag value={item.requiresCheckin} /></td>
                    <td style={styles.tdCenter}><BoolFlag value={item.allowsCheckout} /></td>
                    <td style={styles.tdCenter}><BoolFlag value={item.tracksExpiry} /></td>
                    <td style={styles.tdCenter}><BoolFlag value={item.requiresPeroxideMonitoring} /></td>
                    <td style={styles.tdCenter}><BoolFlag value={item.isRegulatoryRelated} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '1100px' },
  th: { textAlign: 'left', padding: '0.6rem 0.75rem', color: '#64748b', borderBottom: '1px solid #334155', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' },
  thCenter: { textAlign: 'center', padding: '0.6rem 0.5rem', color: '#64748b', borderBottom: '1px solid #334155', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' },
  td: { padding: '0.6rem 0.75rem', color: '#e2e8f0', borderBottom: '1px solid #1e293b', verticalAlign: 'top' },
  tdCenter: { padding: '0.6rem 0.5rem', color: '#e2e8f0', borderBottom: '1px solid #1e293b', textAlign: 'center' },
  cas: { color: '#64748b', fontSize: '0.8rem', marginTop: '0.2rem' },
  code: { color: '#60a5fa', background: '#0f172a', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.85rem' },
};

export default ItemsPage;

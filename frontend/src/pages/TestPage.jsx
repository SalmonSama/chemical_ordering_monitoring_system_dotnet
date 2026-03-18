import { useEffect, useState } from 'react';
import apiClient from '../api/client';

function TestPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newItemName, setNewItemName] = useState('');

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/testitems');
      setItems(response.data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    try {
      await apiClient.post('/testitems', { name: newItemName.trim() });
      setNewItemName('');
      fetchItems();
    } catch (err) {
      setError(err.message || 'Failed to add item');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🧪 ChemWatch — Connection Test</h1>
        <p style={styles.subtitle}>
          This page verifies the frontend → backend → PostgreSQL connection.
        </p>

        <form onSubmit={handleAddItem} style={styles.form}>
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Enter a test item name..."
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Add Item
          </button>
        </form>

        <h2 style={styles.sectionTitle}>Test Items from Database</h2>

        {loading && <p style={styles.status}>Loading...</p>}
        {error && <p style={styles.error}>❌ Error: {error}</p>}
        {!loading && !error && items.length === 0 && (
          <p style={styles.status}>
            No items yet. Add one above or insert directly into the database.
          </p>
        )}
        {!loading && !error && items.length > 0 && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Created At</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td style={styles.td}>{item.id}</td>
                  <td style={styles.td}>{item.name}</td>
                  <td style={styles.td}>
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div style={styles.info}>
          <strong>Stack verified:</strong> React (Vite) → ASP.NET Core Web API →
          PostgreSQL via EF Core
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    padding: '2rem',
  },
  card: {
    background: '#1e293b',
    borderRadius: '16px',
    padding: '2.5rem',
    maxWidth: '640px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
    border: '1px solid #334155',
  },
  title: {
    color: '#f1f5f9',
    fontSize: '1.75rem',
    marginBottom: '0.5rem',
    fontWeight: 700,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '0.95rem',
    marginBottom: '1.5rem',
  },
  form: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '2rem',
  },
  input: {
    flex: 1,
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid #475569',
    background: '#0f172a',
    color: '#f1f5f9',
    fontSize: '0.95rem',
    outline: 'none',
  },
  button: {
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
  sectionTitle: {
    color: '#e2e8f0',
    fontSize: '1.1rem',
    marginBottom: '1rem',
    fontWeight: 600,
  },
  status: {
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  error: {
    color: '#f87171',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '1.5rem',
  },
  th: {
    textAlign: 'left',
    padding: '0.75rem',
    color: '#94a3b8',
    borderBottom: '1px solid #334155',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  td: {
    padding: '0.75rem',
    color: '#e2e8f0',
    borderBottom: '1px solid #1e293b',
  },
  info: {
    marginTop: '1rem',
    padding: '0.75rem 1rem',
    background: '#0f172a',
    borderRadius: '8px',
    color: '#94a3b8',
    fontSize: '0.85rem',
    border: '1px solid #334155',
  },
};

export default TestPage;

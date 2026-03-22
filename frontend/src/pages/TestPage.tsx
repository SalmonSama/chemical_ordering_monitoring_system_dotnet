import { useEffect, useState } from 'react';
import type { CSSProperties, FormEvent, ChangeEvent } from 'react';
import apiClient from '../api/client';
import type { TestItem } from '../types/models';

function TestPage(): React.JSX.Element {
  const [items, setItems] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState<string>('');

  const fetchItems = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await apiClient.get<TestItem[]>('/testitems');
      setItems(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    try {
      await apiClient.post('/testitems', { name: newItemName.trim() });
      setNewItemName('');
      fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item');
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
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewItemName(e.target.value)}
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

const styles: Record<string, CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-surface) 100%)',
    padding: '2rem',
  },
  card: {
    background: 'var(--color-bg-surface)',
    borderRadius: '16px',
    padding: '2.5rem',
    maxWidth: '640px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
    border: '1px solid var(--color-border)',
  },
  title: {
    color: 'var(--color-text-primary)',
    fontSize: '1.75rem',
    marginBottom: '0.5rem',
    fontWeight: 700,
  },
  subtitle: {
    color: 'var(--color-text-secondary)',
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
    border: '1px solid var(--color-border)',
    background: 'var(--color-bg-primary)',
    color: 'var(--color-text-primary)',
    fontSize: '0.95rem',
    outline: 'none',
  },
  button: {
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(135deg, var(--color-accent), #2563eb)',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
  sectionTitle: {
    color: 'var(--color-text-primary)',
    fontSize: '1.1rem',
    marginBottom: '1rem',
    fontWeight: 600,
  },
  status: {
    color: 'var(--color-text-secondary)',
    fontStyle: 'italic',
  },
  error: {
    color: 'var(--color-danger)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '1.5rem',
  },
  th: {
    textAlign: 'left',
    padding: '0.75rem',
    color: 'var(--color-text-secondary)',
    borderBottom: '1px solid var(--color-border)',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  td: {
    padding: '0.75rem',
    color: 'var(--color-text-primary)',
    borderBottom: '1px solid var(--color-bg-surface)',
  },
  info: {
    marginTop: '1rem',
    padding: '0.75rem 1rem',
    background: 'var(--color-bg-primary)',
    borderRadius: '8px',
    color: 'var(--color-text-secondary)',
    fontSize: '0.85rem',
    border: '1px solid var(--color-border)',
  },
};

export default TestPage;

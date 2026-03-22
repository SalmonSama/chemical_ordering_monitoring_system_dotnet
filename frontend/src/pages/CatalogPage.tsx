import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import apiClient from '../api/client';
import type { Item, CartItem } from '../types/models';

interface CatalogPageProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

function CatalogPage({ cart, setCart }: CatalogPageProps): React.JSX.Element {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    apiClient.get<Item[]>('/items')
      .then(res => {
        // Only show orderable, active items
        setItems(res.data.filter(i => i.isOrderable && i.isActive));
        setError(null);
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load items'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter(i => {
    const q = search.toLowerCase();
    return i.itemName.toLowerCase().includes(q) ||
           (i.partNo?.toLowerCase().includes(q) ?? false) ||
           (i.casNo?.toLowerCase().includes(q) ?? false);
  });

  const addToCart = (item: Item): void => {
    setCart(prev => {
      const existing = prev.find(c => c.itemId === item.id);
      if (existing) {
        // Merge: increment quantity
        return prev.map(c =>
          c.itemId === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, {
        itemId: item.id,
        itemName: item.itemName,
        unit: item.unit,
        vendorId: item.defaultVendorId,
        vendorName: item.defaultVendor?.name ?? null,
        quantity: 1,
        note: '',
      }];
    });

    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  const getCartQty = (itemId: string): number => {
    return cart.find(c => c.itemId === itemId)?.quantity ?? 0;
  };

  return (
    <div>
      <h1 style={styles.title}>Catalog</h1>
      <p style={styles.subtitle}>Browse items and add them to your cart. Cart: {cart.length} item(s).</p>

      <input
        type="text"
        placeholder="Search by name, part #, or CAS #..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={styles.search}
      />

      {loading && <p style={styles.info}>Loading items...</p>}
      {error && <p style={styles.error}>❌ {error}</p>}

      {!loading && !error && (
        <div style={styles.grid}>
          {filtered.length === 0 && <p style={styles.info}>No orderable items found.</p>}
          {filtered.map(item => {
            const inCart = getCartQty(item.id);
            const justAdded = addedId === item.id;
            return (
              <div key={item.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.itemName}>{item.itemName}</span>
                  {item.category && (
                    <span style={styles.categoryBadge}>{item.category.code}</span>
                  )}
                </div>
                <div style={styles.details}>
                  {item.partNo && <span style={styles.detail}>Part: <code style={styles.code}>{item.partNo}</code></span>}
                  {item.casNo && <span style={styles.detail}>CAS: <code style={styles.code}>{item.casNo}</code></span>}
                  <span style={styles.detail}>Unit: {item.unit}</span>
                  {item.size && <span style={styles.detail}>Size: {item.size}</span>}
                  {item.defaultVendor && <span style={styles.detail}>Vendor: {item.defaultVendor.name}</span>}
                  {item.referencePrice != null && (
                    <span style={styles.detail}>Price: {item.currency ?? '$'}{item.referencePrice}</span>
                  )}
                </div>
                <div style={styles.cardFooter}>
                  {inCart > 0 && (
                    <span style={styles.inCartBadge}>In cart: {inCart}</span>
                  )}
                  <button
                    onClick={() => addToCart(item)}
                    style={justAdded ? { ...styles.addBtn, ...styles.addedBtn } : styles.addBtn}
                  >
                    {justAdded ? '✓ Added' : '+ Add to Cart'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  title: { color: '#f1f5f9', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' },
  subtitle: { color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem' },
  info: { color: '#94a3b8', fontStyle: 'italic' },
  error: { color: '#f87171' },
  search: {
    width: '100%', maxWidth: '500px', background: '#1e293b', color: '#e2e8f0',
    border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 1rem',
    fontSize: '0.9rem', marginBottom: '1.5rem', outline: 'none', boxSizing: 'border-box',
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' },
  card: {
    background: '#1e293b', borderRadius: '12px', border: '1px solid #334155',
    padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem',
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' },
  itemName: { color: '#f1f5f9', fontWeight: 600, fontSize: '0.95rem' },
  categoryBadge: {
    color: '#a78bfa', background: 'rgba(167, 139, 250, 0.15)', padding: '0.15rem 0.5rem',
    borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0,
  },
  details: { display: 'flex', flexWrap: 'wrap', gap: '0.4rem 1rem' },
  detail: { color: '#94a3b8', fontSize: '0.82rem' },
  code: { color: '#60a5fa', background: '#0f172a', padding: '0.1rem 0.3rem', borderRadius: '3px', fontSize: '0.8rem' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem' },
  inCartBadge: {
    color: '#34d399', background: 'rgba(52, 211, 153, 0.1)', padding: '0.2rem 0.6rem',
    borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600,
  },
  addBtn: {
    background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#fff', border: 'none',
    borderRadius: '6px', padding: '0.4rem 0.9rem', fontSize: '0.85rem', fontWeight: 600,
    cursor: 'pointer', transition: 'opacity 0.2s ease', marginLeft: 'auto',
  },
  addedBtn: { background: 'linear-gradient(135deg, #059669, #10b981)' },
};

export default CatalogPage;

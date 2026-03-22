import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    pendingApprovals: 0,
    lowStock: 0,
    expiringSoon: 0,
    peroxideDue: 0
  });

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const [ordersRes, minStockRes, expiredRes, peroxideRes] = await Promise.all([
          apiClient.get('/dashboard/order-status'),
          apiClient.get('/dashboard/min-stock'),
          apiClient.get('/dashboard/expired'),
          apiClient.get('/dashboard/peroxide-due')
        ]);

        const pending = (ordersRes.data as any[]).filter(o => o.status === 'pending_approval').length;
        // Min stock API already filters out 'adequate'
        const lowStock = (minStockRes.data as any[]).length;
        // Expired API already filters out 'active'
        const expiring = (expiredRes.data as any[]).length;
        // Peroxide API doesn't filter, we just count urgent ones
        const peroxideurgent = (peroxideRes.data as any[]).filter(p => ['overdue', 'due_soon', 'quarantined'].includes(p.statusIndicator)).length;

        setMetrics({
          pendingApprovals: pending,
          lowStock: lowStock,
          expiringSoon: expiring,
          peroxideDue: peroxideurgent
        });
      } catch (err) {
        console.error("Failed to load dashboard metrics", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const widgets = [
    { 
      title: 'Pending Approvals', 
      count: metrics.pendingApprovals, 
      desc: 'Orders waiting for focal point review', 
      onClick: () => navigate('/reports/orders'),
      urgent: metrics.pendingApprovals > 0,
      icon: '📝'
    },
    { 
      title: 'Low Stock Alerts', 
      count: metrics.lowStock, 
      desc: 'Items below minimum stock threshold', 
      onClick: () => navigate('/reports/min-stock'),
      urgent: metrics.lowStock > 0,
      icon: '📉'
    },
    { 
      title: 'Expiring Soon', 
      count: metrics.expiringSoon, 
      desc: 'Inventory lots at or near expiration', 
      onClick: () => navigate('/reports/expired'),
      urgent: metrics.expiringSoon > 0,
      icon: '⏳'
    },
    { 
      title: 'Peroxide Monitoring', 
      count: metrics.peroxideDue, 
      desc: 'Peroxide lots overdue or due soon', 
      onClick: () => navigate('/reports/peroxide-due'),
      urgent: metrics.peroxideDue > 0,
      icon: '⚠️'
    }
  ];

  return (
    <div>
      <h1 style={styles.title}>Welcome back!</h1>
      <p style={styles.subtitle}>Here is your live operational overview.</p>

      {loading ? (
        <div style={{ color: 'var(--color-text-secondary)' }}>Loading metrics...</div>
      ) : (
        <div style={styles.grid}>
          {widgets.map((w, idx) => (
            <div 
              key={idx} 
              style={{...styles.card, ...(w.urgent ? styles.urgentCard : {})}}
              onClick={w.onClick}
            >
              <div style={styles.cardHeader}>
                <span style={styles.icon}>{w.icon}</span>
                <span style={styles.cardTitle}>{w.title}</span>
              </div>
              <div style={{...styles.count, color: w.urgent ? 'var(--color-danger)' : 'var(--color-text-primary)'}}>
                {w.count}
              </div>
              <div style={styles.desc}>{w.desc}</div>
              <div style={styles.action}>➔ View Dashboard</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '3rem', ...styles.panel }}>
        <h3 style={styles.panelTitle}>Quick Links</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button style={styles.btn} onClick={() => navigate('/orders/catalog')}>🛒 Start New Order</button>
          <button style={styles.btn} onClick={() => navigate('/inventory/check-in/pending-delivery')}>📦 Receive Delivery</button>
          <button style={styles.btn} onClick={() => navigate('/inventory/extend-shelf-life')}>🧪 Extend Shelf Life</button>
          <button style={styles.btnAlt} onClick={() => navigate('/reports/transactions')}>📋 Audit Log</button>
          <button style={styles.btnAlt} onClick={() => navigate('/reports/regulatory')}>⚖️ Regulatory</button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  title: { color: 'var(--color-text-primary)', fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' },
  subtitle: { color: 'var(--color-text-secondary)', fontSize: '1rem', marginBottom: '2rem' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem'
  },
  card: {
    background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: '12px',
    padding: '1.5rem', cursor: 'pointer', display: 'flex', flexDirection: 'column',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  urgentCard: {
    border: '1px solid var(--color-danger-bg)',
    boxShadow: '0 4px 20px var(--color-danger-bg)'
  },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' },
  icon: { fontSize: '1.5rem' },
  cardTitle: { color: 'var(--color-text-primary)', fontSize: '1.1rem', fontWeight: 600 },
  count: { fontSize: '3rem', fontWeight: 800, lineHeight: 1, marginBottom: '0.5rem' },
  desc: { color: 'var(--color-text-secondary)', fontSize: '0.85rem', flex: 1, marginBottom: '1rem' },
  action: { color: 'var(--color-accent-hover)', fontSize: '0.85rem', fontWeight: 600, alignSelf: 'flex-start' },
  panel: {
    background: 'var(--color-bg-surface)', borderRadius: '12px', border: '1px solid var(--color-border)',
    padding: '1.5rem', marginBottom: '1rem'
  },
  panelTitle: { color: 'var(--color-text-primary)', fontSize: '1.1rem', margin: '0 0 1.5rem 0' },
  btn: {
    background: 'linear-gradient(135deg, var(--color-accent), #4f46e5)', color: '#fff', border: 'none',
    borderRadius: '8px', padding: '0.75rem 1.25rem', fontSize: '0.95rem', fontWeight: 600,
    cursor: 'pointer'
  },
  btnAlt: {
    background: 'var(--color-border)', color: 'var(--color-text-primary)', border: 'none',
    borderRadius: '8px', padding: '0.75rem 1.25rem', fontSize: '0.95rem', fontWeight: 600,
    cursor: 'pointer'
  }
};

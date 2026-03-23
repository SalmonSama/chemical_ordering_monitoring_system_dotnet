import { useState, useEffect, useCallback } from 'react';
import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';
import StatusBadge from '../components/StatusBadge';
import type {
  DashboardSummary,
  PendingOrderPreview,
  LowStockPreview,
  ExpiringPreview,
  PeroxidePreview,
  RecentTransaction,
} from '../types/dashboard.types';

/* ================================================================
   Dashboard Page — Operational Overview
   ================================================================ */

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();

  const isAdmin = hasRole('admin');
  const isFocalPoint = hasRole('focal_point');
  const canApprove = isAdmin || isFocalPoint;

  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<DashboardSummary>('/dashboard/summary');
      setData(res.data);
    } catch (err) {
      console.error('Dashboard load failed', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  // Location context string
  const locationLabel = user?.locations?.length
    ? user.locations.map(l => l.name).join(', ')
    : 'All Locations';

  return (
    <div style={S.page}>

      {/* ── Header ──────────────────────────────────────────── */}
      <div style={S.headerRow}>
        <div>
          <h1 style={S.title}>
            Welcome back, {user?.fullName?.split(' ')[0] ?? 'User'}
          </h1>
          <p style={S.subtitle}>
            Here is your live operational overview.
          </p>
        </div>
        <div style={S.headerBadges}>
          <span style={S.locationBadge}>📍 {locationLabel}</span>
          <span style={S.roleBadge}>{user?.roleDisplayName ?? 'User'}</span>
          <button onClick={fetchDashboard} style={S.refreshBtn} title="Refresh dashboard">
            🔄
          </button>
        </div>
      </div>

      {/* ── Error banner ────────────────────────────────────── */}
      {error && (
        <div style={S.errorBanner}>
          ⚠️ {error}
          <button onClick={fetchDashboard} style={S.retryBtn}>Retry</button>
        </div>
      )}

      {/* ── Metric Cards ────────────────────────────────────── */}
      <div style={S.cardGrid}>
        <MetricCard
          icon="📋" title="Pending Approvals"
          count={data?.pendingApprovals ?? 0}
          subtitle="Orders awaiting review"
          loading={loading} urgent={!!data && data.pendingApprovals > 0}
          accentColor="var(--color-info)"
          onClick={() => navigate(canApprove ? '/orders/approval-queue' : '/orders/my-orders')}
        />
        <MetricCard
          icon="📦" title="Low Stock Alerts"
          count={data?.lowStockCount ?? 0}
          subtitle="Items below minimum threshold"
          loading={loading} urgent={!!data && data.lowStockCount > 0}
          accentColor="var(--color-warning)"
          onClick={() => navigate('/reports/min-stock')}
        />
        <MetricCard
          icon="⏳" title="Expiring Soon"
          count={data?.expiringSoonCount ?? 0}
          subtitle="Lots at or near expiration"
          loading={loading} urgent={!!data && data.expiringSoonCount > 0}
          accentColor="var(--color-danger)"
          onClick={() => navigate('/reports/expired')}
        />
        <MetricCard
          icon="🧪" title="Peroxide Due"
          count={data?.peroxideDueCount ?? 0}
          subtitle="Lots overdue or due soon"
          loading={loading} urgent={!!data && data.peroxideDueCount > 0}
          accentColor="var(--color-accent)"
          onClick={() => navigate('/reports/peroxide-due')}
        />
      </div>

      {/* ── Quick Actions ───────────────────────────────────── */}
      <SectionHeader title="Quick Actions" />
      <div style={S.actionsGrid}>
        <ActionCard icon="🛒" label="Start New Order"    onClick={() => navigate('/orders/catalog')} />
        <ActionCard icon="📬" label="Receive Delivery"   onClick={() => navigate('/inventory/check-in/pending-delivery')} />
        {canApprove && (
          <ActionCard icon="📥" label="Manual Check-In"  onClick={() => navigate('/inventory/check-in/manual')} />
        )}
        <ActionCard icon="📤" label="Checkout / Consume" onClick={() => navigate('/inventory/checkout')} />
        <ActionCard icon="⚗️" label="Peroxide Tracking"  onClick={() => navigate('/monitoring/peroxide')} />
        {canApprove && (
          <ActionCard icon="⏳" label="Extend Shelf Life" onClick={() => navigate('/inventory/extend-shelf-life')} />
        )}
        <ActionCard icon="📋" label="Audit Log"          onClick={() => navigate('/reports/transactions')} />
        <ActionCard icon="⚖️" label="Regulatory"         onClick={() => navigate('/reports/regulatory')} />
      </div>

      {/* ── Preview Tables ──────────────────────────────────── */}
      <div style={S.tablesGrid}>
        {/* Recent Activity */}
        <PreviewPanel title="Recent Activity" viewAllPath="/reports/transactions" navigate={navigate}>
          {loading ? <SkeletonRows /> :
           !data?.recentTransactions?.length ? <EmptyPreview label="No recent transactions" /> : (
            <table className="data-table" style={S.miniTable}>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>User</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {data.recentTransactions.map((t: RecentTransaction) => (
                  <tr key={t.id}>
                    <td><StatusBadge status={t.type} /></td>
                    <td style={S.ellipsis}>{t.itemName}</td>
                    <td style={{ fontWeight: 600, color: (t.quantity ?? 0) > 0 ? 'var(--color-success)' : (t.quantity ?? 0) < 0 ? 'var(--color-danger)' : 'var(--color-text-secondary)' }}>
                      {(t.quantity ?? 0) > 0 ? `+${t.quantity}` : t.quantity ?? '—'}
                    </td>
                    <td style={S.ellipsis}>{t.userName}</td>
                    <td style={S.nowrap}>{timeAgo(t.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </PreviewPanel>

        {/* Pending Orders */}
        {canApprove && (
          <PreviewPanel title="Pending Orders" viewAllPath="/orders/approval-queue" navigate={navigate}>
            {loading ? <SkeletonRows /> :
             !data?.pendingOrdersPreview?.length ? <EmptyPreview label="No pending orders" /> : (
              <table className="data-table" style={S.miniTable}>
                <thead>
                  <tr>
                    <th>PO #</th>
                    <th>Items</th>
                    <th>Requester</th>
                    <th>Lab</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.pendingOrdersPreview.map((o: PendingOrderPreview) => (
                    <tr key={o.id}>
                      <td style={{ fontWeight: 600, color: 'var(--color-accent)' }}>{o.poNumber}</td>
                      <td style={S.ellipsis}>{o.itemSummary}</td>
                      <td style={S.ellipsis}>{o.requester}</td>
                      <td>{o.labName}</td>
                      <td style={S.nowrap}>{shortDate(o.submittedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </PreviewPanel>
        )}

        {/* Low Stock */}
        <PreviewPanel title="Low Stock Items" viewAllPath="/reports/min-stock" navigate={navigate}>
          {loading ? <SkeletonRows /> :
           !data?.lowStockPreview?.length ? <EmptyPreview label="All items above minimum" /> : (
            <table className="data-table" style={S.miniTable}>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Item</th>
                  <th>Lab</th>
                  <th>Stock</th>
                  <th>Min</th>
                  <th>Deficit</th>
                </tr>
              </thead>
              <tbody>
                {data.lowStockPreview.map((s: LowStockPreview, i: number) => (
                  <tr key={i}>
                    <td><StatusBadge status={s.statusIndicator} /></td>
                    <td style={S.ellipsis}>{s.itemName}</td>
                    <td>{s.labName}</td>
                    <td>{s.totalQuantity} {s.unit}</td>
                    <td>{s.minStock}</td>
                    <td style={{ fontWeight: 700, color: 'var(--color-danger)' }}>−{s.deficit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </PreviewPanel>

        {/* Expiring Soon */}
        <PreviewPanel title="Expiring Lots" viewAllPath="/reports/expired" navigate={navigate}>
          {loading ? <SkeletonRows /> :
           !data?.expiringPreview?.length ? <EmptyPreview label="No lots near expiry" /> : (
            <table className="data-table" style={S.miniTable}>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Item</th>
                  <th>Lot #</th>
                  <th>Lab</th>
                  <th>Days Left</th>
                </tr>
              </thead>
              <tbody>
                {data.expiringPreview.map((e: ExpiringPreview) => (
                  <tr key={e.id}>
                    <td><StatusBadge status={e.statusIndicator} /></td>
                    <td style={S.ellipsis}>{e.itemName}</td>
                    <td><code style={S.code}>{e.lotNumber}</code></td>
                    <td>{e.labName}</td>
                    <td style={{ fontWeight: 700, color: e.daysToExpiry < 0 ? 'var(--color-danger)' : e.daysToExpiry <= 30 ? 'var(--color-warning)' : 'var(--color-text-primary)' }}>
                      {e.daysToExpiry < 0 ? `${Math.abs(e.daysToExpiry)}d overdue` : `${e.daysToExpiry}d`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </PreviewPanel>

        {/* Peroxide Due (only if items exist) */}
        {(data?.peroxideDueCount ?? 0) > 0 && (
          <PreviewPanel title="Peroxide Attention" viewAllPath="/reports/peroxide-due" navigate={navigate}>
            {loading ? <SkeletonRows /> :
             !data?.peroxidePreview?.length ? <EmptyPreview label="All peroxide lots normal" /> : (
              <table className="data-table" style={S.miniTable}>
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Item</th>
                    <th>Lot #</th>
                    <th>Lab</th>
                    <th>Due In</th>
                  </tr>
                </thead>
                <tbody>
                  {data.peroxidePreview.map((p: PeroxidePreview) => (
                    <tr key={p.id}>
                      <td><StatusBadge status={p.statusIndicator} /></td>
                      <td style={S.ellipsis}>{p.itemName}</td>
                      <td><code style={S.code}>{p.lotNumber}</code></td>
                      <td>{p.labName}</td>
                      <td style={{ fontWeight: 700, color: p.monitorDueIn < 0 ? 'var(--color-danger)' : 'var(--color-warning)' }}>
                        {p.monitorDueIn < 0 ? `${Math.abs(p.monitorDueIn)}d overdue` : `${p.monitorDueIn}d`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </PreviewPanel>
        )}
      </div>
    </div>
  );
}

/* ================================================================
   Sub-Components
   ================================================================ */

/* ── Metric Card ─────────────────────────────────────────────── */

interface MetricCardProps {
  icon: string;
  title: string;
  count: number;
  subtitle: string;
  loading: boolean;
  urgent: boolean;
  accentColor: string;
  onClick: () => void;
}

function MetricCard({ icon, title, count, subtitle, loading, urgent, accentColor, onClick }: MetricCardProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        ...S.metricCard,
        borderTop: `3px solid ${accentColor}`,
        boxShadow: urgent
          ? `0 4px 20px color-mix(in srgb, ${accentColor} 20%, transparent)`
          : hovered ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        transform: hovered ? 'translateY(-2px)' : 'none',
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={S.metricHeader}>
        <span style={S.metricIcon}>{icon}</span>
        <span style={S.metricTitle}>{title}</span>
      </div>
      {loading ? (
        <div style={S.skeletonCount} />
      ) : (
        <div style={{
          ...S.metricCount,
          color: urgent ? accentColor : 'var(--color-text-primary)',
        }}>
          {count}
        </div>
      )}
      <div style={S.metricSub}>{subtitle}</div>
      <div style={S.metricAction}>View Details →</div>
    </div>
  );
}

/* ── Section Header ──────────────────────────────────────────── */

function SectionHeader({ title }: { title: string }) {
  return (
    <h2 style={S.sectionTitle}>{title}</h2>
  );
}

/* ── Action Card ─────────────────────────────────────────────── */

function ActionCard({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      style={{
        ...S.actionCard,
        background: hovered ? 'var(--color-bg-hover)' : 'var(--color-bg-surface)',
        borderColor: hovered ? 'var(--color-accent)' : 'var(--color-border)',
        transform: hovered ? 'translateY(-1px)' : 'none',
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={S.actionIcon}>{icon}</span>
      <span style={S.actionLabel}>{label}</span>
    </button>
  );
}

/* ── Preview Panel ───────────────────────────────────────────── */

interface PreviewPanelProps {
  title: string;
  viewAllPath: string;
  navigate: (p: string) => void;
  children: React.ReactNode;
}

function PreviewPanel({ title, viewAllPath, navigate, children }: PreviewPanelProps) {
  return (
    <div style={S.previewPanel}>
      <div style={S.previewHeader}>
        <h3 style={S.previewTitle}>{title}</h3>
        <button
          style={S.viewAllBtn}
          onClick={() => navigate(viewAllPath)}
        >
          View All →
        </button>
      </div>
      <div style={S.previewBody}>
        {children}
      </div>
    </div>
  );
}

/* ── Skeleton Rows ───────────────────────────────────────────── */

function SkeletonRows() {
  return (
    <div style={{ padding: '0.75rem 0' }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={S.skeletonRow}>
          <div style={{ ...S.skeletonBar, width: '20%' }} />
          <div style={{ ...S.skeletonBar, width: '35%' }} />
          <div style={{ ...S.skeletonBar, width: '15%' }} />
          <div style={{ ...S.skeletonBar, width: '20%' }} />
        </div>
      ))}
    </div>
  );
}

/* ── Empty Preview ───────────────────────────────────────────── */

function EmptyPreview({ label }: { label: string }) {
  return (
    <div style={S.emptyState}>
      <span style={{ fontSize: '1.5rem', opacity: 0.5 }}>✅</span>
      <span>{label}</span>
    </div>
  );
}

/* ================================================================
   Helpers
   ================================================================ */

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return shortDate(iso);
}

function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/* ================================================================
   Styles
   ================================================================ */

const S: Record<string, CSSProperties> = {
  page: {
    maxWidth: '1400px',
  },

  // ── Header ──
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '1rem',
    marginBottom: '1.75rem',
    flexWrap: 'wrap',
  },
  title: {
    color: 'var(--color-text-primary)',
    fontSize: '1.75rem',
    fontWeight: 800,
    margin: 0,
    lineHeight: 1.3,
  },
  subtitle: {
    color: 'var(--color-text-secondary)',
    fontSize: '0.9375rem',
    margin: '0.25rem 0 0',
  },
  headerBadges: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  locationBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.3rem',
    background: 'var(--color-bg-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: '9999px',
    padding: '0.3rem 0.75rem',
    fontSize: '0.8125rem',
    color: 'var(--color-text-secondary)',
    fontWeight: 500,
  },
  roleBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    background: 'var(--color-accent-soft)',
    color: 'var(--color-accent)',
    borderRadius: '9999px',
    padding: '0.3rem 0.75rem',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  refreshBtn: {
    background: 'var(--color-bg-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    width: '34px',
    height: '34px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '0.9rem',
    padding: 0,
    transition: 'all 0.15s ease',
  },

  // ── Error ──
  errorBanner: {
    background: 'var(--color-danger-bg)',
    color: 'var(--color-danger)',
    border: '1px solid var(--color-danger)',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    fontSize: '0.875rem',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.75rem',
  },
  retryBtn: {
    background: 'var(--color-danger)',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '0.35rem 0.75rem',
    fontSize: '0.8125rem',
    fontWeight: 600,
    cursor: 'pointer',
    flexShrink: 0,
  },

  // ── Metric Cards ──
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.25rem',
    marginBottom: '2rem',
  },
  metricCard: {
    background: 'var(--color-bg-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: '12px',
    padding: '1.25rem 1.5rem',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  metricHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.75rem',
  },
  metricIcon: { fontSize: '1.25rem' },
  metricTitle: {
    color: 'var(--color-text-secondary)',
    fontSize: '0.8125rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  metricCount: {
    fontSize: '2.5rem',
    fontWeight: 800,
    lineHeight: 1,
    marginBottom: '0.35rem',
  },
  metricSub: {
    color: 'var(--color-text-tertiary)',
    fontSize: '0.8125rem',
    flex: 1,
    marginBottom: '0.75rem',
  },
  metricAction: {
    color: 'var(--color-accent)',
    fontSize: '0.8125rem',
    fontWeight: 600,
  },
  skeletonCount: {
    width: '60px',
    height: '2.5rem',
    borderRadius: '6px',
    background: 'var(--color-bg-hover)',
    marginBottom: '0.35rem',
    animation: 'none',
  },

  // ── Section Title ──
  sectionTitle: {
    color: 'var(--color-text-primary)',
    fontSize: '1.0625rem',
    fontWeight: 700,
    margin: '0 0 0.75rem',
  },

  // ── Action Cards ──
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '0.75rem',
    marginBottom: '2rem',
  },
  actionCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '1rem 0.75rem',
    border: '1px solid var(--color-border)',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    fontFamily: 'var(--font-family-sans)',
  },
  actionIcon: { fontSize: '1.5rem' },
  actionLabel: {
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    textAlign: 'center',
  },

  // ── Preview Panels ──
  tablesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
    gap: '1.25rem',
    marginBottom: '1rem',
  },
  previewPanel: {
    background: 'var(--color-bg-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  previewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.875rem 1.25rem',
    borderBottom: '1px solid var(--color-border)',
  },
  previewTitle: {
    margin: 0,
    fontSize: '0.9375rem',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
  },
  viewAllBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--color-accent)',
    fontSize: '0.8125rem',
    fontWeight: 600,
    cursor: 'pointer',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    transition: 'background 0.15s',
  },
  previewBody: {
    overflowX: 'auto',
  },
  miniTable: {
    fontSize: '0.8125rem',
    margin: 0,
  },
  ellipsis: {
    maxWidth: '180px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  nowrap: {
    whiteSpace: 'nowrap',
    color: 'var(--color-text-tertiary)',
    fontSize: '0.75rem',
  },
  code: {
    background: 'var(--color-bg-primary)',
    color: 'var(--color-text-primary)',
    padding: '0.1rem 0.35rem',
    borderRadius: '4px',
    border: '1px solid var(--color-border)',
    fontSize: '0.75rem',
    fontFamily: 'var(--font-family-mono)',
  },

  // ── Skeleton ──
  skeletonRow: {
    display: 'flex',
    gap: '0.75rem',
    padding: '0.5rem 1.25rem',
    borderBottom: '1px solid var(--color-border)',
  },
  skeletonBar: {
    height: '0.875rem',
    borderRadius: '4px',
    background: 'var(--color-bg-hover)',
  },

  // ── Empty State ──
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '2rem 1rem',
    color: 'var(--color-text-tertiary)',
    fontSize: '0.875rem',
  },
};

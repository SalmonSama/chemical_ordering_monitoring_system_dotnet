export interface StatusBadgeProps {
    status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    if (!status) return null;

    const s = status.toLowerCase();
    let type: 'success' | 'warning' | 'danger' | 'info' | 'neutral' = 'neutral';
    
    // Success mapping
    if (['active', 'received', 'fully received', 'fully_received', 'approved', 'email sent', 'email_sent', 'normal', 'adequate'].includes(s)) type = 'success';
    // Warning mapping
    else if (['warning', 'near_expire', 'near-expiry', 'below min', 'below_min', 'partially received', 'partially_received'].includes(s)) type = 'warning';
    // Danger mapping
    else if (['critical', 'expired', 'quarantine', 'quarantined', 'out of stock', 'out_of_stock', 'overdue', 'rejected'].includes(s)) type = 'danger';
    // Info mapping
    else if (['pending approval', 'pending_approval', 'modified', 'pending delivery', 'pending_delivery', 'pending', 'in-progress', 'in_progress', 'due_soon'].includes(s)) type = 'info';
    // Neutral mapping
    else if (['draft', 'in cart', 'in_cart', 'cancelled', 'inactive', 'depleted', 'disposed', 'removed', 'consumed'].includes(s)) type = 'neutral';

    let icon = '⚪';
    if (type === 'success') icon = '✅';
    if (type === 'warning') icon = '⚠️';
    if (type === 'danger') icon = '🔴';
    if (type === 'info') icon = '🔵';

    const cleanLabel = status.replace(/_/g, ' ');

    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: `var(--color-${type}-bg)`,
            color: `var(--color-${type})`,
            padding: '2px 10px',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'capitalize',
            whiteSpace: 'nowrap',
            border: `1px solid var(--color-${type})`,
            opacity: 0.9
        }}>
            <span style={{fontSize: '0.65rem'}}>{icon}</span> {cleanLabel}
        </span>
    );
}

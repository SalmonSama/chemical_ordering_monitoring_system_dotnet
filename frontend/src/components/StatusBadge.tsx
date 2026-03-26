export interface StatusBadgeProps {
    status: string;
    size?: 'sm' | 'md';
}

type BadgeType = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const STATUS_MAP: Record<string, BadgeType> = {
    // Success
    active: 'success', received: 'success', 'fully received': 'success', fully_received: 'success',
    approved: 'success', 'email sent': 'success', email_sent: 'success', normal: 'success', adequate: 'success',
    // Warning
    warning: 'warning', near_expire: 'warning', 'near-expiry': 'warning', 'below min': 'warning',
    below_min: 'warning', 'partially received': 'warning', partially_received: 'warning',
    // Danger
    critical: 'danger', expired: 'danger', quarantine: 'danger', quarantined: 'danger',
    'out of stock': 'danger', out_of_stock: 'danger', overdue: 'danger', rejected: 'danger',
    // Info
    'pending approval': 'info', pending_approval: 'info', modified: 'info',
    'pending delivery': 'info', pending_delivery: 'info', pending: 'info',
    'in-progress': 'info', in_progress: 'info', due_soon: 'info',
    // Neutral
    draft: 'neutral', 'in cart': 'neutral', in_cart: 'neutral', cancelled: 'neutral',
    inactive: 'neutral', depleted: 'neutral', disposed: 'neutral', removed: 'neutral', consumed: 'neutral',
};

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
    if (!status) return null;

    const type = STATUS_MAP[status.toLowerCase()] ?? 'neutral';
    const cleanLabel = status.replace(/_/g, ' ');
    const isSmall = size === 'sm';

    return (
        <span
            className="badge"
            style={{
                background: `var(--color-${type}-bg)`,
                color: `var(--color-${type})`,
                fontSize: isSmall ? 'var(--text-xs)' : '0.8125rem',
                padding: isSmall ? '2px 10px' : '3px 12px',
                textTransform: 'capitalize',
            }}
        >
            <span
                style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: `var(--color-${type})`,
                    flexShrink: 0,
                }}
            />
            {cleanLabel}
        </span>
    );
}

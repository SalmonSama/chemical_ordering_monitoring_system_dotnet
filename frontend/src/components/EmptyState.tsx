import type { CSSProperties, ReactNode } from 'react';
import { Inbox } from 'lucide-react';

export interface EmptyStateProps {
    title?: string;
    message?: string;
    icon?: ReactNode;
    action?: ReactNode;
}

export default function EmptyState({
    title = 'No Data Found',
    message = 'There is no data to display here yet.',
    icon,
    action,
}: EmptyStateProps) {
    return (
        <div style={styles.container}>
            <div style={styles.iconWrap}>
                {icon ?? <Inbox size={40} strokeWidth={1.5} />}
            </div>
            <h3 style={styles.title}>{title}</h3>
            <p style={styles.message}>{message}</p>
            {action && <div style={styles.action}>{action}</div>}
        </div>
    );
}

const styles: Record<string, CSSProperties> = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2rem',
        background: 'var(--color-bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--color-border)',
        textAlign: 'center',
        margin: '1rem 0',
    },
    iconWrap: {
        color: 'var(--color-text-tertiary)',
        marginBottom: '0.75rem',
        opacity: 0.6,
    },
    title: {
        color: 'var(--color-text-primary)',
        fontSize: 'var(--text-lg)',
        marginBottom: '0.35rem',
        fontWeight: 600,
    },
    message: {
        color: 'var(--color-text-secondary)',
        fontSize: 'var(--text-sm)',
        maxWidth: '400px',
        lineHeight: 1.6,
    },
    action: {
        marginTop: '1rem',
    },
};

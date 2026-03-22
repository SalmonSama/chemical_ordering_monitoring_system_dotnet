import type { CSSProperties } from 'react';

export interface EmptyStateProps {
    title?: string;
    message?: string;
    icon?: string;
}

export default function EmptyState({ 
    title = 'No Data Found', 
    message = 'There is no data to display here yet.', 
    icon = '📭' 
}: EmptyStateProps) {
    return (
        <div style={styles.container}>
            <div style={styles.icon}>{icon}</div>
            <h3 style={styles.title}>{title}</h3>
            <p style={styles.message}>{message}</p>
        </div>
    );
}

const styles: Record<string, CSSProperties> = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        background: 'var(--color-bg-surface)',
        borderRadius: '8px',
        border: '1px dashed var(--color-border)',
        textAlign: 'center',
        margin: '1rem 0'
    },
    icon: {
        fontSize: '2.5rem',
        marginBottom: '1rem',
        opacity: 0.7
    },
    title: {
        color: 'var(--color-text-primary)',
        fontSize: '1.1rem',
        marginBottom: '0.5rem',
        fontWeight: 600
    },
    message: {
        color: 'var(--color-text-secondary)',
        fontSize: '0.9rem',
        maxWidth: '400px',
        lineHeight: 1.5
    }
};

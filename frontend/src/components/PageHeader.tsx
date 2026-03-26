import type { CSSProperties, ReactNode } from 'react';

export interface PageHeaderProps {
    title: string;
    subtitle?: string;
    actions?: ReactNode;
    breadcrumb?: ReactNode;
}

export default function PageHeader({ title, subtitle, actions, breadcrumb }: PageHeaderProps) {
    return (
        <div style={styles.wrapper}>
            {breadcrumb && <div style={styles.breadcrumb}>{breadcrumb}</div>}
            <div style={styles.row}>
                <div style={styles.textBlock}>
                    <h1 style={styles.title}>{title}</h1>
                    {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
                </div>
                {actions && <div style={styles.actions}>{actions}</div>}
            </div>
        </div>
    );
}

const styles: Record<string, CSSProperties> = {
    wrapper: {
        marginBottom: 'var(--space-6)',
    },
    breadcrumb: {
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text-tertiary)',
        marginBottom: 'var(--space-2)',
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '1rem',
        flexWrap: 'wrap',
    },
    textBlock: {
        minWidth: 0,
    },
    title: {
        fontSize: 'var(--text-xl)',
        fontWeight: 700,
        color: 'var(--color-text-primary)',
        margin: 0,
        lineHeight: 1.3,
    },
    subtitle: {
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text-secondary)',
        marginTop: '4px',
    },
    actions: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        flexShrink: 0,
    },
};

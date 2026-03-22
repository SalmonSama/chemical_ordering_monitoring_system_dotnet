import type { CSSProperties } from 'react';

export default function LoadingState({ message = 'Loading data...' }: { message?: string }) {
    return (
        <div style={styles.container}>
            <div style={styles.spinner}>⏳</div>
            <div style={styles.text}>{message}</div>
        </div>
    );
}

const styles: Record<string, CSSProperties> = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
        color: 'var(--color-text-secondary)',
    },
    spinner: {
        fontSize: '2rem',
        marginBottom: '1rem',
        opacity: 0.8
    },
    text: {
        fontSize: '0.95rem',
        fontWeight: 500
    }
};

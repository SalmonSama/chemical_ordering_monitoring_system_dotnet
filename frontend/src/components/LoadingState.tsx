import type { CSSProperties } from 'react';

interface LoadingStateProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg';
}

export default function LoadingState({ message = 'Loading data...', size = 'md' }: LoadingStateProps) {
    const spinnerSize = size === 'sm' ? 16 : size === 'lg' ? 32 : 24;

    return (
        <div style={styles.container}>
            <div
                className="spinner"
                style={{
                    width: spinnerSize,
                    height: spinnerSize,
                    borderWidth: size === 'sm' ? 2 : 3,
                }}
            />
            {message && <div style={styles.text}>{message}</div>}
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
        gap: '0.75rem',
    },
    text: {
        fontSize: 'var(--text-sm)',
        fontWeight: 500,
    },
};

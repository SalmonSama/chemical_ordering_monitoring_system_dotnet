import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    footer?: ReactNode;
    width?: number | string;
}

export default function Modal({ open, onClose, title, children, footer, width = 420 }: ModalProps) {
    const dialogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [open, onClose]);

    // Focus trap: focus dialog on open
    useEffect(() => {
        if (open && dialogRef.current) {
            dialogRef.current.focus();
        }
    }, [open]);

    if (!open) return null;

    return (
        <div style={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
            <div
                ref={dialogRef}
                tabIndex={-1}
                style={{ ...styles.dialog, maxWidth: typeof width === 'number' ? `${width}px` : width }}
                onClick={(e) => e.stopPropagation()}
                className="fade-in"
            >
                {/* Header */}
                <div style={styles.header}>
                    <h2 style={styles.title}>{title}</h2>
                    <button onClick={onClose} style={styles.closeBtn} aria-label="Close dialog">
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div style={styles.body}>
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div style={styles.footer}>
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}

const styles: Record<string, CSSProperties> = {
    overlay: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.45)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '1rem',
    },
    dialog: {
        background: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-md)',
        width: '100%',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        outline: 'none',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid var(--color-border)',
        flexShrink: 0,
    },
    title: {
        margin: 0,
        fontSize: 'var(--text-lg)',
        fontWeight: 600,
        color: 'var(--color-text-primary)',
    },
    closeBtn: {
        background: 'transparent',
        border: 'none',
        color: 'var(--color-text-tertiary)',
        cursor: 'pointer',
        padding: '4px',
        borderRadius: 'var(--radius-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'color 150ms ease',
    },
    body: {
        padding: '1.25rem 1.5rem',
        overflowY: 'auto',
        flex: 1,
    },
    footer: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 'var(--space-3)',
        padding: '1rem 1.5rem',
        borderTop: '1px solid var(--color-border)',
        flexShrink: 0,
    },
};

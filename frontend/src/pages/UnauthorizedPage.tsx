import { useNavigate } from 'react-router-dom';

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'var(--color-bg-primary)',
      fontFamily: 'var(--font-family-sans)',
    }}>
      <div style={{
        textAlign: 'center',
        background: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '16px',
        padding: '3rem',
        maxWidth: '440px',
        width: '100%',
        boxShadow: 'var(--shadow-md)',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
        <h1 style={{
          fontSize: 'var(--text-xl)',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          margin: '0 0 0.75rem',
        }}>
          Access Denied
        </h1>
        <p style={{
          fontSize: 'var(--text-base)',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.6,
          margin: '0 0 2rem',
        }}>
          You don't have permission to access this page.
          Please contact your administrator if you believe this is a mistake.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'var(--color-accent)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.625rem 1.25rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 'var(--text-base)',
            }}
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'transparent',
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              padding: '0.625rem 1.25rem',
              fontWeight: 500,
              cursor: 'pointer',
              fontSize: 'var(--text-base)',
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

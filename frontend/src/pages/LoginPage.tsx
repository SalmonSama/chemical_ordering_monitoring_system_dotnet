import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Logo / branding */}
        <div style={styles.brand}>
          <div style={styles.brandIcon}>⚗️</div>
          <h1 style={styles.brandName}>ChemWatch</h1>
          <p style={styles.brandSub}>Lab Inventory &amp; Chemical Ordering System</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          <h2 style={styles.formTitle}>Sign In</h2>

          {error && (
            <div style={styles.errorBox} role="alert">
              <span>⚠️</span> {error}
            </div>
          )}

          <div style={styles.field}>
            <label htmlFor="email" style={styles.label}>Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              autoFocus
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              style={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? '⏳ Signing in…' : 'Sign In →'}
          </button>

          <div style={styles.links}>
            <Link to="/forgot-password" style={styles.link}>
              Forgot your password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'var(--color-bg-primary)',
    fontFamily: 'var(--font-family-sans)',
    padding: '24px',
  },
  card: {
    background: 'var(--color-bg-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: '16px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '400px',
    boxShadow: 'var(--shadow-md)',
  },
  brand: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  brandIcon: {
    fontSize: '2.5rem',
    marginBottom: '0.5rem',
  },
  brandName: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    margin: '0 0 0.25rem',
    letterSpacing: '-0.3px',
  },
  brandSub: {
    fontSize: '0.8125rem',
    color: 'var(--color-text-tertiary)',
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.125rem',
  },
  formTitle: {
    fontSize: '1.0625rem',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    margin: 0,
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'var(--color-danger-bg)',
    color: 'var(--color-danger)',
    border: '1px solid var(--color-danger)',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '0.875rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  label: {
    fontSize: '0.8125rem',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
  },
  input: {
    // Base styles come from index.css; override only what's needed
    padding: '9px 12px',
    borderRadius: '8px',
    fontSize: '0.9375rem',
  },
  button: {
    background: 'var(--color-accent)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '11px 16px',
    fontSize: '0.9375rem',
    fontWeight: 600,
    marginTop: '4px',
    width: '100%',
    justifyContent: 'center',
  },
  links: {
    textAlign: 'center',
  },
  link: {
    color: 'var(--color-accent)',
    fontSize: '0.8125rem',
    textDecoration: 'none',
  },
};

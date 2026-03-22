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
        <div style={styles.header}>
          <h1 style={styles.title}>ChemWatch</h1>
          <p style={styles.subtitle}>Lab Inventory & Chemical Ordering System</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.formTitle}>Sign In</h2>

          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.field}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={styles.input}
              autoComplete="email"
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
              style={styles.input}
              autoComplete="current-password"
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
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div style={styles.links}>
            <Link to="/forgot-password" style={styles.link}>
              Forgot Password?
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
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '3rem',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '2rem',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 700,
    color: '#1a1a2e',
    margin: 0,
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '0.85rem',
    color: '#666',
    margin: '0.5rem 0 0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.25rem',
  },
  formTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#333',
    margin: 0,
  },
  error: {
    background: '#fee2e2',
    color: '#dc2626',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    fontSize: '0.875rem',
    border: '1px solid #fecaca',
  },
  field: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.4rem',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: 500,
    color: '#555',
  },
  input: {
    padding: '0.7rem 0.9rem',
    borderRadius: '8px',
    border: '1.5px solid #ddd',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  button: {
    padding: '0.8rem',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(135deg, #0f3460, #1a1a2e)',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 600,
    marginTop: '0.5rem',
  },
  links: {
    textAlign: 'center' as const,
  },
  link: {
    color: '#0f3460',
    fontSize: '0.875rem',
    textDecoration: 'none',
  },
};

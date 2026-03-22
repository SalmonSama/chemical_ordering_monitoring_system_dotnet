import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Forgot Password</h1>
        <div style={styles.message}>
          <div style={styles.icon}>🔒</div>
          <p style={styles.text}>
            Please contact your system administrator to reset your password.
          </p>
          <p style={styles.subtext}>
            This system uses admin-managed accounts. Only administrators can reset passwords.
          </p>
        </div>
        <Link to="/login" style={styles.link}>
          ← Back to Login
        </Link>
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
    textAlign: 'center' as const,
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#1a1a2e',
    marginBottom: '1.5rem',
  },
  message: {
    background: '#f0f9ff',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    border: '1px solid #bae6fd',
  },
  icon: {
    fontSize: '2.5rem',
    marginBottom: '0.75rem',
  },
  text: {
    fontSize: '1rem',
    color: '#1e40af',
    fontWeight: 500,
    margin: '0 0 0.5rem',
  },
  subtext: {
    fontSize: '0.85rem',
    color: '#666',
    margin: 0,
  },
  link: {
    color: '#0f3460',
    fontSize: '0.9rem',
    textDecoration: 'none',
    fontWeight: 500,
  },
};

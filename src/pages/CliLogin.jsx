import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useHermaAuth } from '../context/HermaAuthContext';

const API_URL = process.env.REACT_APP_HERMA_API_URL || '';

const CliLogin = () => {
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useHermaAuth();

  const code = searchParams.get('code');
  const redirectUri = searchParams.get('redirect_uri');
  const state = searchParams.get('state');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [jwtFailed, setJwtFailed] = useState(false);

  // Validate required params
  const missingParams = !code || !redirectUri;
  const showLoginForm = !isAuthenticated || jwtFailed;

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      setEmail(user.email);
    }
  }, [isAuthenticated, user]);

  const handleApprove = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('herma_token');
      const headers = { 'Content-Type': 'application/json' };

      let body;
      if (isAuthenticated && token && !jwtFailed) {
        headers['Authorization'] = `Bearer ${token}`;
        body = JSON.stringify({ code, state });
      } else {
        if (!email || !password) {
          setError('Email and password are required');
          setLoading(false);
          return;
        }
        body = JSON.stringify({ code, state, email, password });
      }

      const res = await fetch(`${API_URL}/auth/cli/approve`, {
        method: 'POST',
        headers,
        body,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        // If JWT auth failed, fall back to email/password form
        if (!jwtFailed && (res.status === 401 || res.status === 403)) {
          setJwtFailed(true);
          setError('');
          setLoading(false);
          return;
        }
        throw new Error(data.detail || data.message || 'Authorization failed');
      }

      const data = await res.json();
      setSuccess(true);

      // Redirect to CLI's local server
      if (data.redirect_to) {
        setTimeout(() => {
          window.location.href = data.redirect_to;
        }, 500);
      } else {
        // Fallback: construct redirect manually
        const url = new URL(redirectUri);
        url.searchParams.set('code', code);
        if (state) url.searchParams.set('state', state);
        setTimeout(() => {
          window.location.href = url.toString();
        }, 500);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (missingParams) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.logoSection}>
            <img src="/herma-logo.png" alt="" style={styles.logoIcon} />
            <span style={styles.wordmark}>H E R M A</span>
          </div>
          <p style={styles.errorText}>
            Invalid authorization request. Missing required parameters.
          </p>
          <p style={styles.mutedText}>
            Please try running the CLI command again.
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.logoSection}>
            <img src="/herma-logo.png" alt="" style={styles.logoIcon} />
            <span style={styles.wordmark}>H E R M A</span>
          </div>
          <svg style={styles.successSvg} viewBox="0 0 56 56"><circle cx="28" cy="28" r="26" fill="none" stroke="var(--hero-glow, #e8956a)" strokeWidth="2"/><path d="M17 28l7 7 15-15" fill="none" stroke="var(--hero-glow, #e8956a)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <h2 style={styles.heading}>Authorized</h2>
          <p style={styles.mutedText}>
            Redirecting back to CLI...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoSection}>
          <img src="/herma-logo.png" alt="" style={styles.logoIcon} />
          <span style={styles.wordmark}>H E R M A</span>
        </div>

        <h2 style={styles.heading}>Authorize CLI</h2>
        <p style={styles.description}>
          {!showLoginForm
            ? <>Herma CLI is requesting access to your account as <strong style={styles.emailHighlight}>{user?.email}</strong></>
            : 'Herma CLI is requesting access to your account'}
        </p>

        {error && <div style={styles.errorBox}>{error}</div>}

        {showLoginForm && (
          <form onSubmit={handleApprove} style={styles.form}>
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="cli-email">Email</label>
              <input
                id="cli-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={styles.input}
                required
                autoComplete="email"
              />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="cli-password">Password</label>
              <input
                id="cli-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                style={styles.input}
                required
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                ...(loading ? styles.buttonDisabled : {}),
              }}
            >
              {loading ? 'Authorizing...' : 'Authorize Herma CLI'}
            </button>
          </form>
        )}

        {!showLoginForm && (
          <button
            onClick={handleApprove}
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {}),
            }}
          >
            {loading ? 'Authorizing...' : 'Authorize'}
          </button>
        )}

        <p style={styles.footerText}>
          This will grant the CLI access to your Herma account.
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--hero-bg, #0e0c14)',
    padding: '24px',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    background: 'rgba(22, 19, 30, 0.8)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid var(--hero-border, #2a2438)',
    borderRadius: '16px',
    padding: '40px 32px',
    textAlign: 'center',
  },
  logoSection: {
    marginBottom: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
  },
  wordmark: {
    fontFamily: "'Space Grotesk', -apple-system, sans-serif",
    fontSize: '18px',
    fontWeight: '500',
    color: 'var(--hero-fg, #ece6d8)',
    letterSpacing: '0.2em',
  },
  heading: {
    fontFamily: "'Space Grotesk', -apple-system, sans-serif",
    fontSize: '22px',
    fontWeight: '600',
    color: 'var(--hero-fg, #ece6d8)',
    margin: '0 0 12px 0',
  },
  successSvg: {
    width: '56px',
    height: '56px',
    margin: '0 auto 16px',
    display: 'block',
  },
  description: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '14px',
    color: 'var(--hero-fg-muted, #a59cb1)',
    margin: '0 0 24px 0',
    lineHeight: '1.5',
  },
  emailHighlight: {
    color: 'var(--hero-fg, #ece6d8)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '16px',
  },
  fieldGroup: {
    textAlign: 'left',
  },
  label: {
    display: 'block',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--hero-fg-muted, #a59cb1)',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    fontSize: '14px',
    fontFamily: "'DM Sans', sans-serif",
    background: 'var(--hero-bg, #0e0c14)',
    border: '1px solid var(--hero-border, #2a2438)',
    borderRadius: '8px',
    color: 'var(--hero-fg, #ece6d8)',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '14px 24px',
    fontSize: '15px',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: '600',
    background: 'var(--hero-glow, #e8956a)',
    color: 'var(--hero-fg, #ece6d8)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.2s, opacity 0.2s',
    marginTop: '8px',
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  errorBox: {
    background: 'rgba(220, 38, 38, 0.1)',
    border: '1px solid rgba(220, 38, 38, 0.3)',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '13px',
    fontFamily: "'DM Sans', sans-serif",
    color: '#fca5a5',
    marginBottom: '16px',
    textAlign: 'left',
  },
  errorText: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '15px',
    color: '#fca5a5',
    margin: '0 0 8px 0',
  },
  mutedText: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '13px',
    color: 'var(--hero-fg-dim, #6e6479)',
    margin: '0',
  },
  footerText: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '12px',
    color: 'var(--hero-fg-dim, #6e6479)',
    marginTop: '20px',
  },
};

export default CliLogin;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useHermaAuth } from '../context/HermaAuthContext';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const Login = () => {
  const initialSearchParams = new URLSearchParams(window.location.search);
  const [isLogin, setIsLogin] = useState(initialSearchParams.get('signup') !== 'true');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    website_url: '',  // honeypot — hidden from real users
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, signup, loginWithGoogle } = useHermaAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const googleButtonRef = useRef(null);
  const isLoginRef = useRef(isLogin);
  isLoginRef.current = isLogin;

  const from = location.state?.from?.pathname;

  const searchParams = new URLSearchParams(window.location.search);
  const redirectParam = searchParams.get('redirect');
  const nextParam = searchParams.get('next');

  const redirectParams = { redirectParam, nextParam, from };
  const redirectParamsRef = useRef(redirectParams);
  redirectParamsRef.current = redirectParams;

  const handlePostAuthRedirect = (isNewUser) => {
    const { redirectParam: rp, nextParam: np, from: f } = redirectParamsRef.current;
    if (rp === 'comparison') {
      navigate('/', { replace: true });
      setTimeout(() => {
        document.getElementById('see-the-difference')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else if (np) {
      navigate(np, { replace: true });
    } else {
      navigate(isLoginRef.current && !isNewUser ? (f || '/dashboard') : '/chat', { replace: true });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password });
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (formData.password.length < 8) {
          throw new Error('Password must be at least 8 characters');
        }
        // Honeypot: bots fill hidden fields, humans don't
        if (formData.website_url) {
          navigate('/verify-email', { replace: true });
          return;
        }
        const signupData = await signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        if (!signupData.email_verified) {
          navigate('/verify-email', { replace: true });
          return;
        }
      }
      handlePostAuthRedirect(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth setup
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    const handleGoogleResponse = async (response) => {
      setGoogleLoading(true);
      setError('');
      try {
        const data = await loginWithGoogle(response.credential);
        if (data.email_verified === false) {
          navigate('/verify-email', { replace: true });
          return;
        }
        handlePostAuthRedirect(data.is_new_user);
      } catch (err) {
        setError(err.message);
      } finally {
        setGoogleLoading(false);
      }
    };

    const initGoogle = () => {
      if (!window.google?.accounts?.id) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });
      if (googleButtonRef.current) {
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          width: 400,
          text: 'continue_with',
        });
      }
    };

    if (window.google?.accounts?.id) {
      initGoogle();
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.head.appendChild(script);
      return () => {
        if (document.head.contains(script)) document.head.removeChild(script);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex flex-col pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-[var(--bg-primary)]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-6">
          <span
            className="text-2xl font-bold text-[var(--text-primary)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            HΞRMΛ
          </span>
        </Link>
        <h2
          className="text-center text-3xl font-bold text-[var(--text-primary)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {isLogin ? 'Sign in to your account' : 'Create your account'}
        </h2>
        <p
          className="mt-2 text-center text-sm text-[var(--text-secondary)]"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {isLogin
            ? 'Access your API dashboard'
            : 'Get $1.00 in free credits — save 65%+ on AI costs'}
        </p>
        {!isLogin && (
          <div className="mt-4 flex flex-col items-center gap-1.5 text-xs text-[var(--text-tertiary)]" style={{ fontFamily: 'var(--font-ui)' }}>
            <span>OpenAI-compatible API — one URL swap, no code changes</span>
            <span>868+ benchmark tests passing — quality verified</span>
          </div>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div
          className="bg-[var(--bg-secondary)] backdrop-blur-sm py-8 px-6 shadow-lg sm:px-10 border border-[var(--border-secondary)]"
          style={{ borderRadius: 'var(--radius-lg)' }}
        >
          {error && (
            <div
              className="mb-6 p-3 bg-[var(--error)]/10 border border-[var(--error)]/30 text-sm text-[var(--error)]"
              style={{ borderRadius: 'var(--radius-sm)' }}
            >
              {error}
            </div>
          )}

          {/* Google Sign In */}
          {GOOGLE_CLIENT_ID && (
            <div className="mb-5">
              <div ref={googleButtonRef} className="w-full flex justify-center" />
              {googleLoading && (
                <div className="flex justify-center mt-2">
                  <div className="w-5 h-5 rounded-full border-2 border-[var(--accent-primary)] border-t-transparent animate-spin" />
                </div>
              )}
              <div className="flex items-center gap-3 mt-5">
                <div className="flex-1 h-px bg-[var(--border-secondary)]" />
                <span className="text-xs text-[var(--text-tertiary)]" style={{ fontFamily: 'var(--font-ui)' }}>
                  or continue with email
                </span>
                <div className="flex-1 h-px bg-[var(--border-secondary)]" />
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-[var(--text-secondary)]"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required={!isLogin}
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-[var(--border-secondary)] bg-[var(--bg-input)] text-[var(--text-primary)] py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/30 focus:border-[var(--accent-primary)] placeholder-[var(--text-tertiary)]"
                  style={{ borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-ui)' }}
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[var(--text-secondary)]"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-[var(--border-secondary)] bg-[var(--bg-input)] text-[var(--text-primary)] py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/30 focus:border-[var(--accent-primary)] placeholder-[var(--text-tertiary)]"
                style={{ borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-ui)' }}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[var(--text-secondary)]"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full border border-[var(--border-secondary)] bg-[var(--bg-input)] text-[var(--text-primary)] py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/30 focus:border-[var(--accent-primary)] placeholder-[var(--text-tertiary)]"
                style={{ borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-ui)' }}
              />
            </div>

            {isLogin && (
              <div className="text-right">
                <Link
                  to="/reset-password"
                  className="text-xs text-[var(--accent-primary)] hover:underline"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Forgot password?
                </Link>
              </div>
            )}

            {!isLogin && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-[var(--text-secondary)]"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required={!isLogin}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-[var(--border-secondary)] bg-[var(--bg-input)] text-[var(--text-primary)] py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/30 focus:border-[var(--accent-primary)] placeholder-[var(--text-tertiary)]"
                  style={{ borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-ui)' }}
                />
              </div>
            )}

            {/* Honeypot — hidden from real users, traps simple bots */}
            {!isLogin && (
              <input
                type="text"
                name="website_url"
                value={formData.website_url}
                onChange={handleChange}
                autoComplete="off"
                tabIndex={-1}
                aria-hidden="true"
                style={{ display: 'none' }}
              />
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 text-sm font-medium text-[var(--text-inverse)] bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-primary)] focus:ring-offset-[var(--bg-secondary)] disabled:opacity-50 transition-colors"
              style={{ borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-ui)' }}
            >
              {loading ? 'Processing...' : isLogin ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-sm text-[var(--accent-primary)] hover:underline"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;

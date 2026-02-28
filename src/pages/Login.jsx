import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useHermaAuth } from '../context/HermaAuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, signup } = useHermaAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  // Check for ?redirect=comparison in the hash URL
  const searchParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const redirectParam = searchParams.get('redirect');

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
        const signupData = await signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        // If email not verified, redirect to verification page
        if (!signupData.email_verified) {
          navigate('/verify-email', { replace: true });
          return;
        }
      }
      if (redirectParam === 'comparison') {
        navigate('/', { replace: true });
        setTimeout(() => {
          document.getElementById('see-the-difference')?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      } else {
        navigate(isLogin ? (from || '/dashboard') : '/chat', { replace: true });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[var(--bg-primary)]">
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
            : 'Get started with Herma API'}
        </p>
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

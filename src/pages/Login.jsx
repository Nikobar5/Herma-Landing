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

  const from = location.state?.from?.pathname || '/dashboard';

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
        await signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: 'var(--primary-bg)' }}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-6">
          <span
            className="text-2xl font-bold text-[var(--highlight-color)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            HΞRMΛ
          </span>
        </Link>
        <h2
          className="text-center text-3xl font-bold text-[var(--highlight-color)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {isLogin ? 'Sign in to your account' : 'Create your account'}
        </h2>
        <p
          className="mt-2 text-center text-sm text-[var(--highlight-color)]/60"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {isLogin
            ? 'Access your API dashboard'
            : 'Get started with Herma API'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div
          className="bg-white/90 backdrop-blur-sm py-8 px-6 shadow-lg sm:px-10"
          style={{ borderRadius: 'var(--radius-md)' }}
        >
          {error && (
            <div
              className="mb-6 p-3 bg-red-50 border border-red-200 text-sm text-red-700"
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
                  className="block text-sm font-medium text-[var(--highlight-color)]"
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
                  className="mt-1 block w-full border border-[var(--secondary-bg)]/30 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--highlight-color)]/30 focus:border-[var(--highlight-color)]"
                  style={{ borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-ui)' }}
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[var(--highlight-color)]"
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
                className="mt-1 block w-full border border-[var(--secondary-bg)]/30 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--highlight-color)]/30 focus:border-[var(--highlight-color)]"
                style={{ borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-ui)' }}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[var(--highlight-color)]"
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
                className="mt-1 block w-full border border-[var(--secondary-bg)]/30 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--highlight-color)]/30 focus:border-[var(--highlight-color)]"
                style={{ borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-ui)' }}
              />
            </div>

            {!isLogin && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-[var(--highlight-color)]"
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
                  className="mt-1 block w-full border border-[var(--secondary-bg)]/30 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--highlight-color)]/30 focus:border-[var(--highlight-color)]"
                  style={{ borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-ui)' }}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 text-sm font-medium text-white bg-[var(--highlight-color)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--highlight-color)] disabled:opacity-50 transition-opacity"
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
              className="text-sm text-[var(--highlight-color)] hover:underline"
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

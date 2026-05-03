import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { forgotPassword, resetPassword } from '../services/hermaApi';

const ResetPassword = () => {
  const navigate = useNavigate();

  // Parse token from URL: /reset-password?token=abc
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get('token');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | sent | success | error
  const [errorMsg, setErrorMsg] = useState('');
  // --- Mode 2: Token in URL — new password form ---
  if (token) {
    const handleReset = async (e) => {
      e.preventDefault();
      setErrorMsg('');

      if (password.length < 8) {
        setErrorMsg('Password must be at least 8 characters');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match');
        return;
      }

      setStatus('loading');
      try {
        await resetPassword(token, password);
        setStatus('success');
        setTimeout(() => navigate('/login', { replace: true }), 2000);
      } catch (err) {
        setStatus('error');
        setErrorMsg(err.message || 'Reset failed');
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

          <div
            className="bg-[var(--bg-secondary)] backdrop-blur-sm py-8 px-6 shadow-lg sm:px-10 border border-[var(--border-secondary)] text-center"
            style={{ borderRadius: 'var(--radius-lg)' }}
          >
            {status === 'success' ? (
              <div className="py-4">
                <div className="w-12 h-12 bg-[var(--success)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-[var(--success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  Password reset!
                </h3>
                <p className="text-sm text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-ui)' }}>
                  Redirecting to login...
                </p>
              </div>
            ) : status === 'error' ? (
              <div className="py-4">
                <div className="w-12 h-12 bg-[var(--error)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-[var(--error)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  {errorMsg}
                </h3>
                <Link
                  to="/reset-password"
                  className="mt-4 inline-block text-sm text-[var(--accent-primary)] hover:underline"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Try again
                </Link>
              </div>
            ) : (
              <>
                <h2
                  className="text-2xl font-bold text-[var(--text-primary)] mb-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Set new password
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mb-6" style={{ fontFamily: 'var(--font-body)' }}>
                  Enter your new password below.
                </p>

                {errorMsg && (
                  <div
                    className="mb-4 p-3 bg-[var(--error)]/10 border border-[var(--error)]/30 text-sm text-[var(--error)]"
                    style={{ borderRadius: 'var(--radius-sm)' }}
                  >
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleReset} className="space-y-4 text-left">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-ui)' }}>
                      New Password
                    </label>
                    <input
                      type="password"
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 block w-full border border-[var(--border-secondary)] bg-[var(--bg-input)] text-[var(--text-primary)] py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/30 focus:border-[var(--accent-primary)]"
                      style={{ borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-ui)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-ui)' }}>
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mt-1 block w-full border border-[var(--border-secondary)] bg-[var(--bg-input)] text-[var(--text-primary)] py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/30 focus:border-[var(--accent-primary)]"
                      style={{ borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-ui)' }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full py-2.5 px-4 text-sm font-medium text-[var(--text-inverse)] bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
                    style={{ borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-ui)' }}
                  >
                    {status === 'loading' ? 'Resetting...' : 'Reset Password'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- Mode 1: No token — forgot password form ---
  const handleForgot = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setStatus('loading');
    try {
      await forgotPassword(email);
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong');
    }
  };

  if (status === 'sent') {
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

          <div
            className="bg-[var(--bg-secondary)] backdrop-blur-sm py-8 px-6 shadow-lg sm:px-10 border border-[var(--border-secondary)] text-center"
            style={{ borderRadius: 'var(--radius-lg)' }}
          >
            <div className="w-14 h-14 bg-[var(--accent-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-[var(--accent-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>

            <h2
              className="text-2xl font-bold text-[var(--text-primary)] mb-2"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Check your email
            </h2>

            <p className="text-sm text-[var(--text-secondary)] mb-6" style={{ fontFamily: 'var(--font-body)', lineHeight: '1.6' }}>
              If an account exists for <strong className="text-[var(--text-primary)]">{email}</strong>,
              we've sent a password reset link.
            </p>

            <p className="text-xs text-[var(--text-tertiary)]" style={{ fontFamily: 'var(--font-ui)' }}>
              Check your spam folder if you don't see the email. The link expires in 30 minutes.
            </p>

            <div className="mt-4 flex gap-3 justify-center">
              <a
                href="https://mail.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[var(--accent-primary)] hover:underline"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Open Gmail
              </a>
              <a
                href="https://outlook.live.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[var(--accent-primary)] hover:underline"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Open Outlook
              </a>
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--border-secondary)]">
              <Link
                to="/login"
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          Reset your password
        </h2>
        <p
          className="mt-2 text-center text-sm text-[var(--text-secondary)]"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Enter your email and we'll send you a reset link
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div
          className="bg-[var(--bg-secondary)] backdrop-blur-sm py-8 px-6 shadow-lg sm:px-10 border border-[var(--border-secondary)]"
          style={{ borderRadius: 'var(--radius-lg)' }}
        >
          {errorMsg && (
            <div
              className="mb-6 p-3 bg-[var(--error)]/10 border border-[var(--error)]/30 text-sm text-[var(--error)]"
              style={{ borderRadius: 'var(--radius-sm)' }}
            >
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleForgot} className="space-y-5">
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
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border border-[var(--border-secondary)] bg-[var(--bg-input)] text-[var(--text-primary)] py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/30 focus:border-[var(--accent-primary)] placeholder-[var(--text-tertiary)]"
                style={{ borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-ui)' }}
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full flex justify-center py-2.5 px-4 text-sm font-medium text-[var(--text-inverse)] bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors"
              style={{ borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-ui)' }}
            >
              {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-[var(--accent-primary)] hover:underline"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

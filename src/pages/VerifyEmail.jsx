import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useHermaAuth } from '../context/HermaAuthContext';
import { verifyEmail, resendVerification } from '../services/hermaApi';

const COOLDOWN_SECONDS = 60;

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { user, setEmailVerified, isAuthenticated } = useHermaAuth();

  // Parse token from hash URL: /#/verify-email?token=abc
  const searchParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const token = searchParams.get('token');

  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [resendStatus, setResendStatus] = useState('');

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const handleVerify = useCallback(async () => {
    if (!token) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      await verifyEmail(token);
      setEmailVerified(true);
      setStatus('success');
      setTimeout(() => navigate('/chat', { replace: true }), 2000);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Verification failed');
    }
  }, [token, setEmailVerified, navigate]);

  const handleResend = async () => {
    setResendStatus('');
    try {
      await resendVerification();
      setResendStatus('Verification email sent!');
      setCooldown(COOLDOWN_SECONDS);
    } catch (err) {
      if (err.message?.includes('wait')) {
        setResendStatus('Please wait before requesting another email.');
        setCooldown(COOLDOWN_SECONDS);
      } else {
        setResendStatus(err.message || 'Failed to resend');
      }
    }
  };

  // Mode 2: Token in URL — show verify button
  if (token) {
    return (
      <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[var(--bg-primary)]">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link to="/" className="flex items-center justify-center gap-2 mb-6">
            <span
              className="text-2xl font-bold text-[var(--text-primary)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              HERMA
            </span>
          </Link>

          <div
            className="bg-[var(--bg-secondary)] backdrop-blur-sm py-8 px-6 shadow-lg sm:px-10 border border-[var(--border-secondary)] text-center"
            style={{ borderRadius: 'var(--radius-lg)' }}
          >
            {status === 'idle' && (
              <>
                <h2
                  className="text-2xl font-bold text-[var(--text-primary)] mb-4"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Verify your email
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mb-6" style={{ fontFamily: 'var(--font-body)' }}>
                  Click the button below to verify your email address.
                </p>
                <button
                  onClick={handleVerify}
                  className="w-full py-2.5 px-4 text-sm font-medium text-[var(--text-inverse)] bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] transition-colors"
                  style={{ borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-ui)' }}
                >
                  Verify my email
                </button>
              </>
            )}

            {status === 'loading' && (
              <div className="py-8">
                <div className="w-8 h-8 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-ui)' }}>
                  Verifying...
                </p>
              </div>
            )}

            {status === 'success' && (
              <div className="py-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  Email verified!
                </h3>
                <p className="text-sm text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-ui)' }}>
                  Redirecting to chat...
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="py-4">
                <div className="w-12 h-12 bg-[var(--error)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-[var(--error)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  {errorMsg}
                </h3>
                {isAuthenticated && (
                  <button
                    onClick={handleResend}
                    disabled={cooldown > 0}
                    className="mt-4 text-sm text-[var(--accent-primary)] hover:underline disabled:opacity-50"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend verification email'}
                  </button>
                )}
                {!isAuthenticated && (
                  <Link to="/login" className="mt-4 inline-block text-sm text-[var(--accent-primary)] hover:underline" style={{ fontFamily: 'var(--font-ui)' }}>
                    Log in to resend
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Mode 1: No token — "Check your inbox" screen
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[var(--bg-primary)]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-6">
          <span
            className="text-2xl font-bold text-[var(--text-primary)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            HERMA
          </span>
        </Link>

        <div
          className="bg-[var(--bg-secondary)] backdrop-blur-sm py-8 px-6 shadow-lg sm:px-10 border border-[var(--border-secondary)] text-center"
          style={{ borderRadius: 'var(--radius-lg)' }}
        >
          {/* Email icon */}
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
            We sent a verification link to{' '}
            <strong className="text-[var(--text-primary)]">{user?.email || 'your email'}</strong>.
            <br />
            Click the link to activate your account.
          </p>

          {/* Resend button */}
          <button
            onClick={handleResend}
            disabled={cooldown > 0}
            className="w-full py-2.5 px-4 text-sm font-medium border border-[var(--border-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors disabled:opacity-50"
            style={{ borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-ui)' }}
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend verification email'}
          </button>

          {resendStatus && (
            <p className="mt-3 text-xs text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-ui)' }}>
              {resendStatus}
            </p>
          )}

          <p className="mt-6 text-xs text-[var(--text-tertiary)]" style={{ fontFamily: 'var(--font-ui)' }}>
            Check your spam folder if you don't see the email.
          </p>

          {/* Email client shortcuts */}
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
              Wrong email? Sign up again
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;

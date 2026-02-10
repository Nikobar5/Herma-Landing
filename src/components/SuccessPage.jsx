import React, { useEffect, useState } from 'react';
import { useHermaAuth } from '../context/HermaAuthContext';
import { useNavigate } from 'react-router-dom';
import { getBalance } from '../services/hermaApi';

const SuccessPage = () => {
  const { isAuthenticated } = useHermaAuth();
  const navigate = useNavigate();
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Short delay to let the webhook process the payment
    const timer = setTimeout(() => {
      getBalance()
        .then((data) => {
          setBalance(data.balance ?? data.balance_usd ?? 0);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Please Sign In</h2>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-[var(--accent-primary)] text-[var(--text-inverse)] rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-20 pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1
            className="text-4xl font-bold text-[var(--text-primary)] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Payment Successful!
          </h1>
          <p className="text-xl text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>
            Your credits have been added to your account.
          </p>
        </div>

        {/* Balance Card */}
        <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-hover)] px-6 py-4">
            <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>Account Balance</h2>
          </div>
          <div className="p-8 text-center">
            {loading ? (
              <div>
                <div className="animate-spin inline-block w-8 h-8 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full mb-4"></div>
                <p className="text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>Loading your balance...</p>
              </div>
            ) : (
              <>
                <div className="text-sm text-[var(--text-tertiary)] mb-2" style={{ fontFamily: 'var(--font-ui)' }}>Current Balance</div>
                <div className="text-5xl font-bold text-[var(--accent-primary)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  ${Number(balance).toFixed(2)}
                </div>
                <div className="text-sm text-[var(--text-tertiary)]" style={{ fontFamily: 'var(--font-ui)' }}>in API credits</div>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] p-6 mb-8">
          <div className="grid sm:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-[var(--accent-primary)] text-[var(--text-inverse)] font-semibold rounded-lg hover:bg-[var(--accent-hover)] transition duration-300 flex items-center justify-center gap-2"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Dashboard
            </button>

            <button
              onClick={() => navigate('/upgrade')}
              className="px-6 py-3 bg-[var(--bg-tertiary)] text-[var(--text-primary)] font-semibold rounded-lg hover:bg-[var(--bg-hover)] transition duration-300 flex items-center justify-center gap-2 border border-[var(--border-secondary)]"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Buy More Credits
            </button>

            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 border-2 border-[var(--border-secondary)] text-[var(--text-secondary)] font-semibold rounded-lg hover:border-[var(--border-accent)] hover:text-[var(--text-primary)] transition duration-300 flex items-center justify-center gap-2"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" />
              </svg>
              Home
            </button>
          </div>
        </div>

        {/* Help */}
        <div className="bg-[var(--accent-muted)] border border-[var(--border-accent)] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Need Help?</h3>
          <p className="text-[var(--text-secondary)] mb-4" style={{ fontFamily: 'var(--font-body)' }}>
            If you have questions about your credits or need assistance, we're here to help.
          </p>
          <a
            href="mailto:support@hermaai.com"
            className="px-4 py-2 bg-[var(--accent-primary)] text-[var(--text-inverse)] rounded-lg hover:bg-[var(--accent-hover)] transition duration-300 inline-block"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;

import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useHermaAuth } from '../context/HermaAuthContext';

const MenuOverlay = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useHermaAuth();

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleRequestDemo = () => {
    window.open('https://calendly.com/hermalocal/30min', '_blank');
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex justify-end"
      onClick={handleOverlayClick}
    >
      <div className="w-64 bg-[var(--bg-secondary)] shadow-xl h-full overflow-y-auto animate-slide-in-right border-l border-[var(--border-primary)]">
        <div className="p-5 flex flex-col h-full">
          <div className="flex justify-between items-center mb-8">
            <span className="text-xl font-bold text-[var(--text-primary)]">Menu</span>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-tertiary)]"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation links */}
          <nav className="flex flex-col gap-2 mb-6">
            <Link
              to="/docs"
              onClick={onClose}
              className="px-4 py-3 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Docs
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/chat"
                  onClick={onClose}
                  className="px-4 py-3 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Chat
                </Link>
                <Link
                  to="/dashboard"
                  onClick={onClose}
                  className="px-4 py-3 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Dashboard
                </Link>
                <Link
                  to="/dashboard/usage"
                  onClick={onClose}
                  className="px-4 py-3 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors text-sm"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Usage
                </Link>
                <Link
                  to="/dashboard/api-keys"
                  onClick={onClose}
                  className="px-4 py-3 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors text-sm"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  API Keys
                </Link>
                <Link
                  to="/dashboard/billing"
                  onClick={onClose}
                  className="px-4 py-3 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors text-sm"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Billing
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                onClick={onClose}
                className="px-4 py-3 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Log in
              </Link>
            )}
          </nav>

          <div className="mt-auto pt-4 border-t border-[var(--border-primary)] space-y-3">
            {isAuthenticated && user && (
              <div className="px-4 mb-2">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate" style={{ fontFamily: 'var(--font-ui)' }}>
                  {user.name}
                </p>
                <p className="text-xs text-[var(--text-tertiary)] truncate" style={{ fontFamily: 'var(--font-ui)' }}>
                  {user.email}
                </p>
              </div>
            )}

            <button
              onClick={handleRequestDemo}
              className="w-full py-3 bg-[var(--accent-primary)] text-[var(--text-inverse)] font-medium rounded-lg flex items-center justify-center gap-2 hover:bg-[var(--accent-hover)] transition-colors"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              <span>Request a Demo</span>
              <svg className="w-4 h-4 transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>

            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="w-full py-2 text-sm text-[var(--error)] hover:bg-[var(--error)]/10 rounded-lg transition-colors"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Log out
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuOverlay;

import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useHermaAuth } from '../context/HermaAuthContext';
import OnboardingModal, { ONBOARDING_KEY } from '../components/OnboardingModal';

const navItems = [
  { to: '/dashboard', label: 'Overview', end: true },
  { to: '/dashboard/usage', label: 'Usage' },
  { to: '/dashboard/api-keys', label: 'API Keys' },
  { to: '/dashboard/billing', label: 'Billing' },
];

const Dashboard = () => {
  const { user, logout } = useHermaAuth();
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Auto-show for new users who land on dashboard before visiting chat
  useEffect(() => {
    if (user && !localStorage.getItem(ONBOARDING_KEY)) {
      setShowOnboarding(true);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `block px-4 py-2.5 text-sm font-medium transition-colors ${isActive
      ? 'text-[var(--accent-primary)] bg-[var(--accent-muted)]'
      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
    }`;

  const linkStyle = { borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-ui)' };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:fixed md:inset-y-0 md:left-0 md:w-64 md:flex-col border-r border-[var(--border-primary)] bg-[var(--bg-secondary)] pt-20">
        <div className="flex-1 flex flex-col px-4 py-6 gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={linkClass}
              style={linkStyle}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="px-4 py-4 border-t border-[var(--border-primary)]">
          <button
            onClick={() => {
              localStorage.removeItem(ONBOARDING_KEY);
              setShowOnboarding(true);
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors text-left mb-1"
            style={{ borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-ui)' }}
            title="Re-open the getting started guide"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Getting started
          </button>
          {user && (
            <div className="mb-3 px-4">
              <p
                className="text-sm font-medium text-[var(--text-primary)] truncate"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                {user.name}
              </p>
              <p
                className="text-xs text-[var(--text-tertiary)] truncate"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                {user.email}
              </p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm text-[var(--error)] hover:bg-[var(--error)]/10 transition-colors text-left"
            style={{ borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-ui)' }}
          >
            Log out
          </button>
        </div>
      </aside>

      {/* Mobile tabs (Bottom Nav) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-secondary)]/95 backdrop-blur-sm border-t border-[var(--border-primary)] px-2 pt-2 pb-[max(8px,env(safe-area-inset-bottom))] flex gap-1 overflow-x-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex-1 text-center px-1 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors ${isActive
                ? 'text-[var(--accent-primary)] bg-[var(--accent-muted)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
              }`
            }
            style={{ borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-ui)' }}
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* Main content */}
      <main className="md:ml-64 pt-20 px-4 sm:px-6 lg:px-8 pb-24 md:pb-8">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>

      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        userName={user?.name}
      />
    </div>
  );
};

export default Dashboard;

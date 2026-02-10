import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useHermaAuth } from '../context/HermaAuthContext';

const navItems = [
  { to: '/dashboard', label: 'Overview', end: true },
  { to: '/dashboard/usage', label: 'Usage' },
  { to: '/dashboard/api-keys', label: 'API Keys' },
  { to: '/dashboard/billing', label: 'Billing' },
];

const Dashboard = () => {
  const { user, logout } = useHermaAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `block px-4 py-2.5 text-sm font-medium transition-colors ${
      isActive
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

      {/* Mobile tabs */}
      <div className="md:hidden fixed top-[60px] left-0 right-0 z-30 bg-[var(--bg-secondary)]/95 backdrop-blur-sm border-b border-[var(--border-primary)] px-2 py-1 flex gap-1 overflow-x-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'text-[var(--accent-primary)] bg-[var(--accent-muted)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`
            }
            style={{ borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-ui)' }}
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* Main content */}
      <main className="md:ml-64 pt-24 md:pt-20 px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

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
        ? 'text-[var(--highlight-color)] bg-[var(--secondary-bg)]/15'
        : 'text-[var(--highlight-color)]/60 hover:text-[var(--highlight-color)] hover:bg-[var(--secondary-bg)]/10'
    }`;

  const linkStyle = { borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-ui)' };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--primary-bg)' }}>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:fixed md:inset-y-0 md:left-0 md:w-64 md:flex-col border-r border-[var(--secondary-bg)]/20 bg-white/80 backdrop-blur-sm pt-20">
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

        <div className="px-4 py-4 border-t border-[var(--secondary-bg)]/20">
          {user && (
            <div className="mb-3 px-4">
              <p
                className="text-sm font-medium text-[var(--highlight-color)] truncate"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                {user.name}
              </p>
              <p
                className="text-xs text-[var(--highlight-color)]/50 truncate"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                {user.email}
              </p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
            style={{ borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-ui)' }}
          >
            Log out
          </button>
        </div>
      </aside>

      {/* Mobile tabs */}
      <div className="md:hidden fixed top-[60px] left-0 right-0 z-30 bg-white/90 backdrop-blur-sm border-b border-[var(--secondary-bg)]/20 px-2 py-1 flex gap-1 overflow-x-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'text-[var(--highlight-color)] bg-[var(--secondary-bg)]/15'
                  : 'text-[var(--highlight-color)]/60 hover:text-[var(--highlight-color)]'
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

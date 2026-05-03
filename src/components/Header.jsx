import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import MenuOverlay from './MenuOverlay';
import { useHermaAuth } from '../context/HermaAuthContext';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useHermaAuth();

  const isHome = location.pathname === '/';
  const isOverDark = isHome && !scrolled;

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 60;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => { setMenuOpen(false); }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 w-full border-b ${
          isOverDark
            ? 'py-4 bg-transparent border-transparent'
            : scrolled
              ? 'py-2 bg-[var(--bg-primary)]/95 backdrop-blur-sm shadow-lg border-[var(--border-primary)]'
              : 'py-4 bg-[var(--bg-primary)]/80 backdrop-blur-sm border-transparent'
        }`}
      >
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center">
            <div className="flex items-center relative z-10">
              <Link to="/" className="flex items-center group" aria-label="Home">
                <div className={`h-8 w-8 sm:h-10 sm:w-10 overflow-hidden rounded-lg mr-2 sm:mr-3 transition-all duration-300
                  group-hover:shadow-lg ${scrolled ? 'scale-90' : ''} ${isOverDark ? 'brightness-[10]' : ''}`}>
                  <img src="/herma-logo.png" alt="Herma Logo" className="h-full w-full object-cover" />
                </div>
                <span className={`herma-wordmark transition-all duration-300 ${scrolled ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'}`}>
                  <span style={{ color: isOverDark ? 'var(--hero-fg)' : 'var(--text-primary)' }}>HΞRMΛ</span>
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <nav className="hidden sm:flex items-center gap-1">
                {[
                  { to: '/docs', label: 'Docs' },
                  { to: '/about', label: 'About' },
                  ...(!isAuthenticated ? [{ to: '/upgrade', label: 'Pricing' }] : []),
                  ...(isAuthenticated ? [{ to: '/chat', label: 'Chat' }] : []),
                ].map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                      isOverDark
                        ? 'text-[var(--hero-fg-muted)] hover:text-[var(--hero-fg)] hover:bg-white/5'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                    }`}
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {label}
                  </Link>
                ))}
              </nav>

              <button
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
                className={`hidden sm:flex px-5 py-2 font-medium rounded-full transition-all duration-300 hover:-translate-y-0.5 items-center gap-2 group ${
                  isOverDark
                    ? 'text-[var(--hero-bg)] shadow-md hover:shadow-lg'
                    : 'bg-[var(--accent-primary)] text-[var(--text-inverse)] shadow-md hover:shadow-lg hover:bg-[var(--accent-hover)]'
                }`}
                style={{
                  fontFamily: 'var(--font-ui)',
                  ...(isOverDark ? { background: 'var(--hero-glow)' } : {}),
                }}
              >
                <span className="text-sm">{isAuthenticated ? 'Dashboard' : 'Login'}</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`md:hidden w-10 h-10 flex items-center justify-center rounded-full transition-colors focus:outline-none ${
                  isOverDark
                    ? 'bg-white/10 text-[var(--hero-fg-muted)] hover:bg-white/15'
                    : 'bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:bg-[var(--bg-active)]'
                }`}
                aria-expanded={menuOpen}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
};

export default Header;

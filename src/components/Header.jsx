import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MenuOverlay from './MenuOverlay';
import { useHermaAuth } from '../context/HermaAuthContext';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useHermaAuth();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleRequestDemo = () => {
    window.open('https://calendly.com/hermalocal/30min', '_blank');
    closeMenu();
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 backdrop-blur-sm transition-all duration-300 w-full border-b
        ${scrolled
          ? 'py-2 bg-[var(--bg-primary)]/95 shadow-lg border-[var(--border-primary)]'
          : 'py-4 bg-[var(--bg-primary)]/80 border-transparent'
        }`}
      >
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center relative z-10">
              <Link
                to="/"
                className="flex items-center group"
                aria-label="Home"
              >
                <div className={`h-8 w-8 sm:h-10 sm:w-10 overflow-hidden rounded-lg mr-2 sm:mr-3 transition-all duration-300
                  group-hover:shadow-lg ${scrolled ? 'scale-90' : ''}`}>
                  <img
                    src="/herma-logo.png"
                    alt="Herma Logo"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col items-start">
                  <span className={`font-bold tracking-wide transition-all duration-300
                    ${scrolled ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'}`}>
                    <span className="text-[var(--text-primary)]">HΞRMΛ</span>
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation and Mobile Menu Toggle */}
            <div className="flex items-center gap-2">
              {/* Auth-aware nav links (desktop) */}
              <nav className="hidden sm:flex items-center gap-2">
                <Link
                  to="/docs"
                  className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-full transition-colors"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Docs
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/chat"
                      className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-full transition-colors"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      Chat
                    </Link>
                    <Link
                      to="/dashboard"
                      className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-full transition-colors"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      Dashboard
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-full transition-colors"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    Log in
                  </Link>
                )}
              </nav>

              {/* Request Demo Button */}
              <button
                onClick={handleRequestDemo}
                className="hidden sm:flex px-5 py-2 bg-[var(--accent-primary)] text-[var(--text-inverse)] font-medium rounded-full shadow-md hover:shadow-lg hover:bg-[var(--accent-hover)] transition-all duration-300 hover:-translate-y-0.5 items-center gap-2 group"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                <span className="text-sm">
                  Request a Demo
                </span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMenu}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:bg-[var(--bg-active)] transition-colors focus:outline-none"
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

      {/* Menu Overlay */}
      <MenuOverlay
        isOpen={menuOpen}
        onClose={closeMenu}
      />
    </>
  );
};

export default Header;

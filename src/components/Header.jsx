import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HermaLogo from './Herma.jpeg';
import MenuOverlay from './MenuOverlay';
import { useHermaAuth } from '../context/HermaAuthContext';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useHermaAuth();

  const safeNavigate = (path) => {
    if (navigate) {
      navigate(path);
    } else {
      window.location.href = path;
    }
  };

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
        className={`fixed top-0 left-0 right-0 z-40 backdrop-blur-sm transition-all duration-300 w-full
        ${scrolled
          ? 'py-2 bg-[var(--primary-bg)]/95 shadow-lg'
          : 'py-4 bg-[var(--primary-bg)]/80'
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
                <div className={`h-8 w-8 sm:h-10 sm:w-10 overflow-hidden rounded-lg mr-2 sm:mr-3 shadow-sm transition-all duration-300
                  group-hover:shadow-lg ${scrolled ? 'scale-90' : ''}`}>
                  <img
                    src={HermaLogo}
                    alt="Herma Logo"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col items-start">
                  <span className={`font-bold tracking-wide transition-all duration-300
                    ${scrolled ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'}`}>
                    <span className="text-[var(--highlight-color)]">HΞRMΛ</span>
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
                  className="px-4 py-2 text-sm font-medium text-[var(--highlight-color)] hover:bg-[var(--secondary-bg)]/20 rounded-full transition-colors"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Docs
                </Link>
                {isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 text-sm font-medium text-[var(--highlight-color)] hover:bg-[var(--secondary-bg)]/20 rounded-full transition-colors"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-[var(--highlight-color)] hover:bg-[var(--secondary-bg)]/20 rounded-full transition-colors"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    Log in
                  </Link>
                )}
              </nav>

              {/* Request Demo Button */}
              <button
                onClick={handleRequestDemo}
                className="hidden sm:flex px-5 py-2 bg-blue-900 text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 items-center gap-2 group"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                <span className="text-sm text-white/90 group-hover:text-white transition-colors">
                  Request a Demo
                </span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMenu}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-[var(--secondary-bg)]/20 text-[var(--highlight-color)] hover:bg-[var(--secondary-bg)]/40 transition-colors focus:outline-none"
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

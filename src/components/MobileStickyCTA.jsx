import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHermaAuth } from '../context/HermaAuthContext';

const MobileStickyCTA = () => {
  const [visible, setVisible] = useState(false);
  const { isAuthenticated } = useHermaAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div
        className="bg-[var(--bg-primary)] border-t border-[var(--border-secondary)] px-4 py-3"
        style={{ boxShadow: '0 -4px 20px rgba(232, 149, 106, 0.18)' }}
      >
        <button
          onClick={() => navigate(isAuthenticated ? '/dashboard' : '/upgrade')}
          className="w-full py-3.5 bg-[var(--accent-primary)] text-white font-semibold rounded-xl text-base flex items-center justify-center gap-2 hover:bg-[var(--accent-hover)] transition-colors active:scale-[0.98]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {isAuthenticated ? 'Go to chat' : 'Get started free — $1 credit included'}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MobileStickyCTA;

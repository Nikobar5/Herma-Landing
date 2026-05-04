import React, { createContext, useContext, useState, useEffect } from 'react';
import * as hermaApi from '../services/hermaApi';
import { trackSignup } from '../services/analyticsTracker';

const HermaAuthContext = createContext();

function isInternalUser(email) {
  return typeof email === 'string' && email.toLowerCase().endsWith('@hermaai.com');
}

function posthogIdentify(customerId, email, name, method) {
  if (!window.posthog) return;
  if (isInternalUser(email)) {
    window.posthog.opt_out_capturing();
    return;
  }
  window.posthog.opt_in_capturing();
  window.posthog.identify(
    customerId,
    { email, name, $name: name },
    { first_seen_at: new Date().toISOString(), auth_method: method }
  );
}

export function useHermaAuth() {
  const ctx = useContext(HermaAuthContext);
  if (!ctx) throw new Error('useHermaAuth must be used inside HermaAuthProvider');
  return ctx;
}

export function HermaAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const token = localStorage.getItem('herma_token');
      const stored = localStorage.getItem('herma_user');
      if (token && stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        if (window.posthog && isInternalUser(parsed.email)) {
          window.posthog.opt_out_capturing();
        }
      }
    } catch {
      try {
        localStorage.removeItem('herma_token');
        localStorage.removeItem('herma_user');
      } catch { /* storage unavailable */ }
    } finally {
      setLoading(false);
    }
  }, []);

  async function login({ email, password }) {
    const data = await hermaApi.login({ email, password });
    const u = { customer_id: data.customer_id, name: data.name, email: data.email, is_admin: data.is_admin || false, email_verified: data.email_verified ?? true };
    setUser(u);
    localStorage.setItem('herma_user', JSON.stringify(u));
    posthogIdentify(data.customer_id, data.email, data.name, 'email');
    return data;
  }

  async function signup({ name, email, password, company }) {
    const data = await hermaApi.signup({ name, email, password, company });
    const u = { customer_id: data.customer_id, name: data.name, email: data.email, is_admin: data.is_admin || false, email_verified: data.email_verified || false };
    setUser(u);
    localStorage.setItem('herma_user', JSON.stringify(u));
    trackSignup();
    posthogIdentify(data.customer_id, data.email, data.name, 'email');
    return data;
  }

  async function loginWithGoogle(credential) {
    const data = await hermaApi.loginWithGoogle(credential);
    const u = { customer_id: data.customer_id, name: data.name, email: data.email, is_admin: data.is_admin || false, email_verified: data.email_verified ?? true };
    setUser(u);
    localStorage.setItem('herma_user', JSON.stringify(u));
    if (data.is_new_user) trackSignup();
    posthogIdentify(data.customer_id, data.email, data.name, 'google');
    return data;
  }

  function setEmailVerified(verified) {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, email_verified: verified };
      localStorage.setItem('herma_user', JSON.stringify(updated));
      return updated;
    });
  }

  function logout() {
    hermaApi.logoutSession(); // revoke JWT on backend (fire-and-forget)
    localStorage.removeItem('herma_token');
    localStorage.removeItem('herma_user');
    setUser(null);
    if (window.posthog) {
      window.posthog.opt_in_capturing();
      window.posthog.reset();
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: !!user?.is_admin,
    login,
    signup,
    loginWithGoogle,
    logout,
    setEmailVerified,
  };

  if (loading) {
    return (
      <HermaAuthContext.Provider value={{ ...value, loading: true }}>
        <div className="flex items-center justify-center min-h-screen bg-gray-950">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </HermaAuthContext.Provider>
    );
  }

  return (
    <HermaAuthContext.Provider value={value}>
      {children}
    </HermaAuthContext.Provider>
  );
}

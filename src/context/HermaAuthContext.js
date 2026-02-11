import React, { createContext, useContext, useState, useEffect } from 'react';
import * as hermaApi from '../services/hermaApi';

const HermaAuthContext = createContext();

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
        setUser(JSON.parse(stored));
      }
    } catch {
      localStorage.removeItem('herma_token');
      localStorage.removeItem('herma_user');
    } finally {
      setLoading(false);
    }
  }, []);

  async function login({ email, password }) {
    const data = await hermaApi.login({ email, password });
    setUser({ customer_id: data.customer_id, name: data.name, email: data.email });
    return data;
  }

  async function signup({ name, email, password, company }) {
    const data = await hermaApi.signup({ name, email, password, company });
    setUser({ customer_id: data.customer_id, name: data.name, email: data.email });
    return data;
  }

  function loginAsDemo() {
    const demoUser = {
      customer_id: 'demo_user_123',
      name: 'Demo User',
      email: 'demo@herma.ai',
      is_demo: true
    };
    localStorage.setItem('herma_token', 'DEMO_TOKEN');
    localStorage.setItem('herma_user', JSON.stringify(demoUser));
    setUser(demoUser);
    return demoUser;
  }

  function logout() {
    localStorage.removeItem('herma_token');
    localStorage.removeItem('herma_user');
    setUser(null);
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    loginAsDemo,
    logout,
  };

  if (loading) return null;

  return (
    <HermaAuthContext.Provider value={value}>
      {children}
    </HermaAuthContext.Provider>
  );
}

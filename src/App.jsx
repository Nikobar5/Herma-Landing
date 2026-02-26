// App.jsx - Main Application Component
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import ValueProposition from './components/ValueProposition';
import HowItWorksSection from './components/HowItWorksSection';
import ComplianceSection from './components/ComplianceSection';
import Footer from './components/Footer';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Attributions from './pages/Attributions';
import PurchasePage from './pages/PurchasePage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Overview from './pages/dashboard/Overview';
import Usage from './pages/dashboard/Usage';
import ApiKeys from './pages/dashboard/ApiKeys';
import Billing from './pages/dashboard/Billing';
import ChatPage from './pages/ChatPage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { HermaAuthProvider } from './context/HermaAuthContext';
import { initAnalytics, trackPageView, trackScrollDepth, trackTimeOnPage, trackPerformance } from './services/analyticsTracker';
import SuccessPage from './components/SuccessPage';
import Documentation from './pages/Documentation';

initAnalytics();

const RouteTracker = () => {
  const location = useLocation();

  // Track page views on route change
  useEffect(() => {
    trackPageView();
  }, [location]);

  // Track scroll depth
  useEffect(() => {
    const thresholds = [25, 50, 75, 100];
    const fired = new Set();

    const handleScroll = () => {
      const scrollPct = Math.round(
        ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
      );
      for (const t of thresholds) {
        if (scrollPct >= t && !fired.has(t)) {
          fired.add(t);
          trackScrollDepth(t);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  // Track time on page via visibilitychange
  useEffect(() => {
    const start = Date.now();
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        const seconds = Math.round((Date.now() - start) / 1000);
        if (seconds > 0) trackTimeOnPage(seconds);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [location]);

  return null;
};

// Conditionally render Header (hide on chat page — chat has its own top bar)
const ConditionalHeader = () => {
  const location = useLocation();
  if (location.pathname === '/chat' || location.pathname.startsWith('/admin')) return null;
  return <Header />;
};

// Conditionally render Footer (hide on dashboard and login pages)
const ConditionalFooter = () => {
  const location = useLocation();
  const hideFooter = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin') || location.pathname === '/login' || location.pathname === '/chat';
  if (hideFooter) return null;
  return <Footer />;
};

// Home component to wrap main page content
const Home = () => {
  return (
    <>
      <Hero />
      <ValueProposition />
      <HowItWorksSection />
      <ComplianceSection />
    </>
  );
};

function App() {
  useEffect(() => {
    window.addEventListener('load', () => {
      if (window.performance) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        if (pageLoadTime > 0) trackPerformance(Math.round(pageLoadTime));
      }
    });
  }, []);

  return (
    <Router>
      <HermaAuthProvider>
        <div className="app">
          <RouteTracker />
          <ConditionalHeader />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<Overview />} />
              <Route path="usage" element={<Usage />} />
              <Route path="api-keys" element={<ApiKeys />} />
              <Route path="billing" element={<Billing />} />
            </Route>
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/docs" element={<Documentation />} />
            <Route path="/upgrade" element={<PurchasePage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/attributions" element={<Attributions />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/cancel" element={<Home />} />
          </Routes>
          <ConditionalFooter />
        </div>
      </HermaAuthProvider>
    </Router>
  );
}

export default App;

// App.jsx - Main Application Component
import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import ValueProposition from './components/ValueProposition';
import HowItWorksSection from './components/HowItWorksSection';
import BenchmarkTrust from './components/BenchmarkTrust';
import FAQAccordion from './components/FAQAccordion';
import MobileStickyCTA from './components/MobileStickyCTA';
import AskHermaWidget from './components/AskHermaWidget';
import { AskHermaProvider } from './context/AskHermaContext';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import { HermaAuthProvider } from './context/HermaAuthContext';
import { initAnalytics, trackPageView, trackScrollDepth, trackTimeOnPage, trackPerformance } from './services/analyticsTracker';
import { setPageMeta, resetPageMeta } from './utils/seo';

// Lazy-loaded pages — each becomes a separate chunk
const Login = lazy(() => import('./pages/Login'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Overview = lazy(() => import('./pages/dashboard/Overview'));
const Usage = lazy(() => import('./pages/dashboard/Usage'));
const ApiKeys = lazy(() => import('./pages/dashboard/ApiKeys'));
const Billing = lazy(() => import('./pages/dashboard/Billing'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const PurchasePage = lazy(() => import('./pages/PurchasePage'));
const SuccessPage = lazy(() => import('./components/SuccessPage'));
const Documentation = lazy(() => import('./pages/Documentation'));
const About = lazy(() => import('./pages/About'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const Attributions = lazy(() => import('./pages/Attributions'));
const BlogIndex = lazy(() => import('./pages/blog/BlogIndex'));
const CostQualityMatrix = lazy(() => import('./pages/blog/CostQualityMatrix'));
const ShadowRouting = lazy(() => import('./pages/blog/ShadowRouting'));
const EVRouting = lazy(() => import('./pages/blog/EVRouting'));
const HowWeBenchmark = lazy(() => import('./pages/blog/HowWeBenchmark'));
const BestLLMRouters = lazy(() => import('./pages/blog/BestLLMRouters'));
const AgenticRouting = lazy(() => import('./pages/blog/AgenticRouting'));
const SaveOnAICosts = lazy(() => import('./pages/blog/SaveOnAICosts'));
const APIGatewayVsRouter = lazy(() => import('./pages/blog/APIGatewayVsRouter'));
const HowRoutersWork = lazy(() => import('./pages/blog/HowRoutersWork'));
const LLMPricingComparison = lazy(() => import('./pages/blog/LLMPricingComparison'));
const ChooseRightLLM = lazy(() => import('./pages/blog/ChooseRightLLM'));
const OpenAIAlternatives = lazy(() => import('./pages/blog/OpenAIAlternatives'));
const ClaudeVsGPT4o = lazy(() => import('./pages/blog/ClaudeVsGPT4o'));
const GPT5VsClaudeOpus = lazy(() => import('./pages/blog/GPT5VsClaudeOpus'));
const Gemini25VsGPT5 = lazy(() => import('./pages/blog/Gemini25VsGPT5'));
const BestAIForCoding = lazy(() => import('./pages/blog/BestAIForCoding'));
const DeepSeekVsGPT5 = lazy(() => import('./pages/blog/DeepSeekVsGPT5'));

const NotFound = lazy(() => Promise.resolve({
  default: () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
      <p className="text-xl text-gray-400 mb-6">Page not found</p>
      <a href="/" className="text-blue-400 hover:text-blue-300 underline">Back to home</a>
    </div>
  ),
}));

initAnalytics();

const RouteTracker = () => {
  const location = useLocation();

  // Track page views on route change
  useEffect(() => {
    trackPageView();
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
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
  if (location.pathname === '/chat' || location.pathname === '/verify-email' || location.pathname === '/reset-password' || location.pathname.startsWith('/admin')) return null;
  return <Header />;
};

// Conditionally render Footer (hide on dashboard and login pages)
const ConditionalFooter = () => {
  const location = useLocation();
  const hideFooter = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin') || location.pathname === '/login' || location.pathname === '/chat' || location.pathname === '/verify-email' || location.pathname === '/reset-password';
  if (hideFooter) return null;
  return <Footer />;
};

// Home component to wrap main page content
const Home = () => {
  useEffect(() => {
    // SEO: keyword-rich title and meta for homepage
    setPageMeta(
      'AI Model Router | Save 60-90% on AI Costs',
      'Herma routes every API call to the cheapest model that maintains frontier quality. OpenAI-compatible — swap your API key and keep your code. Free $1 to start.',
      { url: 'https://hermaai.com', type: 'website' }
    );
    return () => resetPageMeta();
  }, []);

  useEffect(() => {
    // Organization structured data for rich search results
    const script = document.createElement('script');
    script.id = 'ld-organization';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Herma AI',
      url: 'https://hermaai.com',
      description: 'Intelligent LLM router | same AI quality, save 65%+ on costs. OpenAI-compatible API.',
      sameAs: ['https://github.com/Nikobar5/herma-eval'],
    });
    document.head.appendChild(script);
    return () => { document.getElementById('ld-organization')?.remove(); };
  }, []);

  return (
    <>
      <Hero />
      <ValueProposition />
      <HowItWorksSection />
      <BenchmarkTrust />
      <FAQAccordion />
      <MobileStickyCTA />
    </>
  );
};

function App() {
  useEffect(() => {
    window.addEventListener('load', () => {
      const entries = performance.getEntriesByType('navigation');
      if (entries.length > 0) {
        const pageLoadTime = Math.round(entries[0].loadEventEnd);
        if (pageLoadTime > 0) trackPerformance(pageLoadTime);
      }
    });
  }, []);

  return (
    <Router>
      <HermaAuthProvider>
        <AskHermaProvider>
        <ErrorBoundary>
          <div className="app">
            <RouteTracker />
            <ConditionalHeader />
            <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/reset-password" element={<ResetPassword />} />
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
                <Route path="/about" element={<About />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/blog" element={<BlogIndex />} />
                <Route path="/blog/cost-quality-matrix" element={<CostQualityMatrix />} />
                <Route path="/blog/shadow-routing" element={<ShadowRouting />} />
                <Route path="/blog/ev-routing" element={<EVRouting />} />
                <Route path="/blog/how-we-benchmark" element={<HowWeBenchmark />} />
                <Route path="/blog/best-llm-routers" element={<BestLLMRouters />} />
                <Route path="/blog/agentic-routing" element={<AgenticRouting />} />
                <Route path="/blog/save-on-ai-costs" element={<SaveOnAICosts />} />
                <Route path="/blog/llm-api-gateway-vs-router" element={<APIGatewayVsRouter />} />
                <Route path="/blog/how-llm-routers-work" element={<HowRoutersWork />} />
                <Route path="/blog/llm-api-pricing-comparison" element={<LLMPricingComparison />} />
                <Route path="/blog/choose-right-llm" element={<ChooseRightLLM />} />
                <Route path="/blog/openai-alternatives" element={<OpenAIAlternatives />} />
                <Route path="/blog/claude-vs-gpt-4o" element={<ClaudeVsGPT4o />} />
                <Route path="/blog/gpt-5-vs-claude-opus" element={<GPT5VsClaudeOpus />} />
                <Route path="/blog/gemini-2-5-pro-vs-gpt-5" element={<Gemini25VsGPT5 />} />
                <Route path="/blog/best-ai-for-coding" element={<BestAIForCoding />} />
                <Route path="/blog/deepseek-r1-vs-gpt-5" element={<DeepSeekVsGPT5 />} />
                <Route path="/upgrade" element={<PurchasePage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/attributions" element={<Attributions />} />
                <Route path="/success" element={<SuccessPage />} />
                <Route path="/cancel" element={<Home />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <ConditionalFooter />
            <AskHermaWidget />
          </div>
        </ErrorBoundary>
        </AskHermaProvider>
      </HermaAuthProvider>
    </Router>
  );
}

export default App;

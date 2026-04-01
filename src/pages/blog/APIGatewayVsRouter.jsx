import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { setPageMeta, resetPageMeta, setStructuredData, removeStructuredData } from '../../utils/seo';

const COMPARISON_ROWS = [
  {
    feature: 'Model selection',
    gateway: 'Static — you choose per request',
    router: 'Dynamic — AI chooses per request',
  },
  {
    feature: 'Primary goal',
    gateway: 'Provider abstraction & access',
    router: 'Cost optimization & quality preservation',
  },
  {
    feature: 'Billing',
    gateway: 'Unified across providers',
    router: 'Per-query cost minimization',
  },
  {
    feature: 'Intelligence layer',
    gateway: 'None — passthrough',
    router: 'Query classification & complexity scoring',
  },
  {
    feature: 'Quality guarantees',
    gateway: 'Depends on model you select',
    router: 'Maintained via validation & shadow routing',
  },
  {
    feature: 'Engineering effort',
    gateway: 'Low — swap endpoint once',
    router: 'Low — swap endpoint once',
  },
];

const GATEWAY_USE_CASES = [
  {
    title: 'Multi-provider access',
    description:
      'You want to use models from multiple providers without managing separate API keys, rate limits, and SDK differences for each one.',
  },
  {
    title: 'Unified billing',
    description:
      'Your team sends spend to multiple providers and wants one invoice, one dashboard, and one place to set spend limits.',
  },
  {
    title: 'Fallback chains',
    description:
      'When your primary provider goes down, you want automatic failover to a secondary without application code changes.',
  },
  {
    title: 'Rate limit management',
    description:
      'You hit rate limits at scale and need request queuing, retry logic, and load balancing handled outside your application.',
  },
];

const ROUTER_USE_CASES = [
  {
    title: 'Cost optimization without quality loss',
    description:
      'You want to stop paying frontier model prices for every query — most queries are simpler than that, and cheaper models handle them just as well.',
  },
  {
    title: 'Automatic model selection',
    description:
      "You don't want to maintain routing logic by hand. As your query distribution shifts, the router adapts automatically.",
  },
  {
    title: 'Per-query intelligence',
    description:
      'Each request is classified by complexity, task type, and required reasoning depth. The right model is chosen for each specific query — not for your workload in aggregate.',
  },
  {
    title: 'Quality validation',
    description:
      'Shadow routing runs both cheap and frontier models on a sample of traffic and compares outputs. You get confidence data before trusting cheaper paths at scale.',
  },
];

const APIGatewayVsRouter = () => {
  useEffect(() => {
    setPageMeta(
      'LLM API Gateway vs Model Router: What\'s the Difference?',
      'API gateways handle plumbing. Model routers handle intelligence. Learn the difference and why modern AI apps need both.',
      { type: 'article' }
    );
    setStructuredData('ld-article-gateway-vs-router', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'LLM API Gateway vs Model Router: What\'s the Difference?',
      description:
        'API gateways handle plumbing. Model routers handle intelligence. Learn the difference and why modern AI apps need both.',
      author: { '@type': 'Organization', name: 'Herma AI' },
      publisher: { '@type': 'Organization', name: 'Herma AI' },
      datePublished: '2026-03-24',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://hermaai.com/blog/llm-api-gateway-vs-router',
      },
    });
    return () => {
      resetPageMeta();
      removeStructuredData('ld-article-gateway-vs-router');
    };
  }, []);

  const [heroRef, heroVisible] = useScrollAnimation(0.1);
  const [hookRef, hookVisible] = useScrollAnimation(0.1);
  const [gatewayRef, gatewayVisible] = useScrollAnimation(0.1);
  const [routerRef, routerVisible] = useScrollAnimation(0.1);
  const [comparisonRef, comparisonVisible] = useScrollAnimation(0.1);
  const [gatewayUseCasesRef, gatewayUseCasesVisible] = useScrollAnimation(0.1);
  const [routerUseCasesRef, routerUseCasesVisible] = useScrollAnimation(0.1);
  const [bothRef, bothVisible] = useScrollAnimation(0.1);
  const [ctaRef, ctaVisible] = useScrollAnimation(0.1);

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-16">
      <article className="max-w-[750px] mx-auto px-4 sm:px-6">

        {/* Back link */}
        <div className="mb-8">
          <Link
            to="/blog"
            className="text-sm text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] transition-colors inline-flex items-center gap-1"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All posts
          </Link>
        </div>

        {/* Hero / Title */}
        <header
          ref={heroRef}
          className={`animate-on-scroll animate-fade-up ${heroVisible ? 'is-visible' : ''} mb-12`}
        >
          <div className="mb-6">
            <span
              className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-[var(--accent-muted)] text-[var(--accent-primary)] border border-[var(--border-accent)]"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Guide
            </span>
            <span
              className="ml-3 text-sm text-[var(--text-tertiary)]"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              March 2026
            </span>
          </div>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            LLM API Gateway vs Model Router: What's the Difference?
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-hover)]"></div>
        </header>

        {/* Hook */}
        <section
          ref={hookRef}
          className={`animate-on-scroll animate-fade-up ${hookVisible ? 'is-visible' : ''} mb-12`}
        >
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              If you're building with AI APIs, you've probably heard both "API gateway" and "model
              router" — but they solve fundamentally different problems.
            </p>
            <p>
              The terms get used interchangeably in blog posts and vendor marketing, which creates real
              confusion when you're trying to figure out what your stack actually needs. One is
              plumbing. The other is a brain. You often want both, but for very different reasons.
            </p>
            <p>
              Here's a precise breakdown of what each does, when you need it, and why the best AI
              infrastructure combines them.
            </p>
          </div>
        </section>

        {/* What is an LLM API Gateway */}
        <section
          ref={gatewayRef}
          className={`animate-on-scroll animate-fade-up ${gatewayVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            What is an LLM API Gateway?
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              An LLM API gateway is a unified interface that sits between your application and multiple
              AI providers. Instead of managing separate API keys, SDKs, and rate limits for each
              provider, your application talks to one endpoint. The gateway handles the rest.
            </p>
            <p>
              Think of it as a reverse proxy for AI APIs. Your application sends requests in a
              standardized format — usually OpenAI-compatible — and the gateway translates, routes,
              and manages provider-specific details behind the scenes.
            </p>
          </div>

          <div className="my-8 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
            <div
              className="text-sm font-medium text-[var(--text-tertiary)] mb-4 uppercase tracking-wider"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              What a gateway handles
            </div>
            <ul className="space-y-3">
              {[
                'Authentication — one API key for your application, credentials-per-provider managed server-side',
                'Rate limiting — queuing and retry logic so provider limits don\'t surface as errors in your app',
                'Load balancing — distributing requests across provider accounts or regions',
                'Fallback chains — automatic failover when a provider is down or returning errors',
                'Unified billing — one invoice for spend across all providers',
                'Model catalog — access to many models through one API without SDK changes',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-[var(--accent-primary)] mt-1 flex-shrink-0">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span
                    className="text-sm text-[var(--text-secondary)]"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              The key thing to understand about a gateway: it's{' '}
              <em className="text-[var(--text-primary)]">passive about model selection</em>. You tell
              it which model to use. It executes. The intelligence about which model is right for a
              given query lives entirely in your application code — not in the gateway.
            </p>
            <p>
              <strong className="text-[var(--text-primary)]">Gateway = plumbing.</strong> It makes
              multi-provider access manageable. It does not make your AI stack smarter or cheaper to
              run.
            </p>
          </div>
        </section>

        {/* What is a Model Router */}
        <section
          ref={routerRef}
          className={`animate-on-scroll animate-fade-up ${routerVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            What is a Model Router?
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              A model router is an intelligent decision layer that selects the optimal model for each
              individual request — automatically, based on an analysis of the query itself.
            </p>
            <p>
              Where a gateway accepts your model choice and executes it, a router makes the model
              choice for you. It classifies the incoming query by complexity, task type, and required
              reasoning depth, then routes to the cheapest model that can handle it without quality
              degradation.
            </p>
            <p>
              The business case is direct: not every query needs a frontier model. Simple factual
              lookups, summarization, classification, and reformatting tasks are handled just as well
              by models that cost 80-95% less per token. A router identifies which queries fall into
              which category — on every request, without you maintaining routing rules by hand.
            </p>
          </div>

          <div className="my-8 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
            <div
              className="text-sm font-medium text-[var(--text-tertiary)] mb-4 uppercase tracking-wider"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              What a router does on each request
            </div>
            <div className="space-y-4">
              {[
                { step: '1', label: 'Classify', desc: 'Analyze the query for complexity, task type, required reasoning depth, and domain specificity' },
                { step: '2', label: 'Score', desc: 'Assign a confidence score for routing to each tier — cheap, mid, and frontier' },
                { step: '3', label: 'Route', desc: 'Send to the cheapest model whose confidence score clears your quality threshold' },
                { step: '4', label: 'Validate', desc: 'Shadow routing on a sample of traffic compares outputs across tiers — builds confidence over time' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--accent-muted)] border border-[var(--border-accent)] flex items-center justify-center text-xs font-bold text-[var(--accent-primary)]"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {item.step}
                  </div>
                  <div>
                    <span
                      className="text-sm font-semibold text-[var(--text-primary)]"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="text-sm text-[var(--text-secondary)] ml-2"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      — {item.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              <strong className="text-[var(--text-primary)]">Router = brain.</strong> It makes your
              AI stack cheaper to run without requiring you to manually maintain model selection logic
              or accept quality tradeoffs.
            </p>
          </div>
        </section>

        {/* Comparison Table */}
        <section
          ref={comparisonRef}
          className={`animate-on-scroll animate-fade-up ${comparisonVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Key Differences
          </h2>

          <div className="rounded-xl border border-[var(--border-secondary)] overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-3 bg-[var(--bg-tertiary)] border-b border-[var(--border-secondary)]">
              <div
                className="px-4 py-3 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Feature
              </div>
              <div
                className="px-4 py-3 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider border-l border-[var(--border-secondary)]"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                API Gateway
              </div>
              <div
                className="px-4 py-3 text-xs font-semibold text-[var(--accent-primary)] uppercase tracking-wider border-l border-[var(--border-secondary)]"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Model Router
              </div>
            </div>

            {/* Table rows */}
            <div className="divide-y divide-[var(--border-secondary)]">
              {COMPARISON_ROWS.map((row, i) => (
                <div
                  key={row.feature}
                  className={`grid grid-cols-3 ${i % 2 === 0 ? 'bg-[var(--bg-secondary)]' : 'bg-[var(--bg-primary)]'}`}
                >
                  <div
                    className="px-4 py-4 text-sm font-medium text-[var(--text-primary)]"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {row.feature}
                  </div>
                  <div
                    className="px-4 py-4 text-sm text-[var(--text-secondary)] border-l border-[var(--border-secondary)]"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {row.gateway}
                  </div>
                  <div
                    className="px-4 py-4 text-sm text-[var(--text-secondary)] border-l border-[var(--border-secondary)]"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {row.router}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* When You Need a Gateway */}
        <section
          ref={gatewayUseCasesRef}
          className={`animate-on-scroll animate-fade-up ${gatewayUseCasesVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            When You Need a Gateway
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-8"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              A gateway makes sense when the problem is operational complexity — managing multiple
              providers, unifying spend, or building resilient failover. It's infrastructure work that
              pays off at scale.
            </p>
          </div>

          <div className="space-y-4">
            {GATEWAY_USE_CASES.map((item) => (
              <div
                key={item.title}
                className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-5"
              >
                <h3
                  className="text-base font-semibold text-[var(--text-primary)] mb-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm text-[var(--text-secondary)] leading-relaxed"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* When You Need a Router */}
        <section
          ref={routerUseCasesRef}
          className={`animate-on-scroll animate-fade-up ${routerUseCasesVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            When You Need a Router
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-8"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              A router makes sense when the problem is cost — you're using the right providers but
              paying too much because every query goes to your most capable (and most expensive) model
              by default.
            </p>
          </div>

          <div className="space-y-4">
            {ROUTER_USE_CASES.map((item) => (
              <div
                key={item.title}
                className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-accent)] p-5"
              >
                <h3
                  className="text-base font-semibold text-[var(--text-primary)] mb-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm text-[var(--text-secondary)] leading-relaxed"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Not Both */}
        <section
          ref={bothRef}
          className={`animate-on-scroll animate-fade-up ${bothVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Why Not Both?
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              The best modern AI infrastructure combines gateway and router into one layer. The gateway
              handles the plumbing — one endpoint, one API key, multi-provider access, fallbacks. The
              router handles the intelligence — per-query model selection, cost optimization, quality
              validation.
            </p>
            <p>
              From your application's perspective, nothing changes. You send requests to one endpoint.
              Under the hood, every query is classified, routed to the optimal model, and validated.
              You get the operational simplicity of a gateway and the cost efficiency of a router with
              no additional integration work.
            </p>
          </div>

          <div className="my-8 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
            <div
              className="text-sm text-[var(--text-tertiary)] mb-3"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              One integration — gateway + router combined
            </div>
            <div className="bg-[var(--bg-primary)] rounded-lg p-4 overflow-x-auto">
              <pre
                className="text-sm text-[var(--text-secondary)]"
                style={{ fontFamily: 'var(--font-code)' }}
              >
                <code>{`# Before — direct to one provider
client = OpenAI(
    base_url="https://api.openai.com/v1",
    api_key="sk-..."
)

# After — gateway + intelligent router, same API shape
client = OpenAI(
    base_url="https://api.hermaai.com/v1",
    api_key="herma-..."
)

# Your code stays the same
response = client.chat.completions.create(
    model="herma",
    messages=[{"role": "user", "content": "..."}]
)
# Herma classifies the query and routes to the
# cheapest model that can handle it correctly`}</code>
              </pre>
            </div>
          </div>

          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              This matters because the alternative — building a gateway for provider abstraction and
              then maintaining separate routing logic in your application — is brittle. Routing rules
              you write by hand break when your query distribution shifts. They miss edge cases. They
              require ongoing engineering time to maintain. And they don't learn.
            </p>
            <p>
              A combined gateway-router approach is one integration, no maintenance burden, and savings
              that compound as the router accumulates confidence in cheaper paths over time.
            </p>
            <p>
              For more on how intelligent routing works in practice, see{' '}
              <Link to="/blog/save-on-ai-costs" className="text-[var(--accent-primary)] hover:underline">
                how to save 65% on AI API costs without losing quality
              </Link>
              {' '}and{' '}
              <Link to="/blog/shadow-routing" className="text-[var(--accent-primary)] hover:underline">
                shadow routing: how to validate routing without risk
              </Link>
              .
            </p>
          </div>
        </section>

        {/* CTA */}
        <section
          ref={ctaRef}
          className={`animate-on-scroll animate-fade-up ${ctaVisible ? 'is-visible' : ''}`}
        >
          <div className="bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] rounded-2xl border border-[var(--border-accent)] p-8 sm:p-12 text-center">
            <h2
              className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Try it free — change 2 lines of code
            </h2>
            <p
              className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Herma is a unified LLM API gateway with intelligent per-query routing built in. One
              endpoint, one key, automatic cost optimization. No code changes beyond the base URL.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/docs"
                className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--accent-primary)] text-[var(--text-inverse)] font-medium rounded-full shadow-md hover:shadow-lg hover:bg-[var(--accent-hover)] transition-all duration-300 hover:-translate-y-0.5 group"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                <span>Read the docs</span>
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                to="/upgrade"
                className="inline-flex items-center gap-2 px-8 py-3 border border-[var(--border-accent)] text-[var(--text-primary)] font-medium rounded-full hover:bg-[var(--bg-secondary)] transition-all duration-300"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Get started
              </Link>
            </div>
          </div>
        </section>

      </article>
    </main>
  );
};

export default APIGatewayVsRouter;

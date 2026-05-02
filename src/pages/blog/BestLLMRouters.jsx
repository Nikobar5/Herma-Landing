import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { setPageMeta, resetPageMeta, setStructuredData, removeStructuredData } from '../../utils/seo';

const ROUTERS = [
  {
    name: 'Herma',
    approach: 'EV-based routing with shadow validation',
    strengths: 'Zero-config, OpenAI-compatible API, quality-first with cost savings, per-query confidence scoring',
    tradeoffs: 'Newer entrant, building production track record',
    openSource: 'Eval toolkit (herma-eval)',
    bestFor: 'Teams that want frontier quality at lower cost without managing model selection',
  },
  {
    name: 'RouteLLM',
    approach: 'Binary strong/weak classifier (MF, BERT, causal LLM)',
    strengths: 'Open-source, multiple classifier architectures, research-backed (Chatbot Arena data)',
    tradeoffs: 'Binary routing only (2 models), no confidence scoring, requires self-hosting and tuning',
    openSource: 'Fully open-source',
    bestFor: 'Research teams comfortable training and hosting their own classifiers',
  },
  {
    name: 'Martian',
    approach: 'Model-as-judge routing with quality prediction',
    strengths: 'Multi-model selection, quality prediction layer, managed service',
    tradeoffs: 'Closed-source routing logic, limited transparency into routing decisions',
    openSource: 'No',
    bestFor: 'Enterprise teams wanting a managed routing service',
  },
  {
    name: 'Unify',
    approach: 'Benchmark-driven routing with quality-cost Pareto optimization',
    strengths: 'Broad model support, benchmark-based selection, endpoint marketplace',
    tradeoffs: 'Static benchmark routing may not reflect real-world query distribution',
    openSource: 'No',
    bestFor: 'Teams optimizing across many providers and endpoints',
  },
  {
    name: 'OpenRouter',
    approach: 'Unified API gateway with optional auto-routing',
    strengths: 'Massive model catalog, simple API, community pricing, fallback chains',
    tradeoffs: 'Auto-routing is basic (not query-aware), primarily a gateway not a router',
    openSource: 'No',
    bestFor: 'Developers wanting access to many models through one API',
  },
];

const CRITERIA = [
  {
    title: 'Routing Intelligence',
    description: 'Does it analyze query complexity, or just pick from a static mapping? The best routers classify each query and route based on predicted quality.',
  },
  {
    title: 'Quality Preservation',
    description: 'Cost savings mean nothing if quality drops. Look for routers that measure quality retention against frontier baselines with real benchmarks.',
  },
  {
    title: 'API Compatibility',
    description: 'Can you swap it in without rewriting your integration? OpenAI-compatible APIs make adoption trivial — change the base URL, keep your code.',
  },
  {
    title: 'Transparency',
    description: 'Can you see why a model was selected? Confidence scores, routing logs, and shadow comparison data help you trust the system.',
  },
  {
    title: 'Adaptivity',
    description: 'Does the router learn from production data, or is it frozen at deploy time? Adaptive systems improve as they see more of your traffic.',
  },
];

const BestLLMRouters = () => {
  useEffect(() => {
    setPageMeta(
      'Best LLM Routers in 2026: A Technical Comparison',
      'Compare the top LLM routers of 2026 — RouteLLM, Martian, Unify, OpenRouter, and Herma. Evaluation criteria, architecture differences, and which router fits your use case.',
      { type: 'article' }
    );
    setStructuredData('ld-article-best-routers', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Best LLM Routers in 2026: A Technical Comparison',
      description: 'Compare the top LLM routers of 2026. Evaluation criteria, architecture differences, and which router fits your use case.',
      author: { '@type': 'Organization', name: 'Herma AI' },
      publisher: { '@type': 'Organization', name: 'Herma AI' },
      datePublished: '2026-03-24',
    });
    return () => {
      resetPageMeta();
      removeStructuredData('ld-article-best-routers');
    };
  }, []);

  const [heroRef, heroVisible] = useScrollAnimation(0.1);
  const [problemRef, problemVisible] = useScrollAnimation(0.1);
  const [criteriaRef, criteriaVisible] = useScrollAnimation(0.1);
  const [comparisonRef, comparisonVisible] = useScrollAnimation(0.1);
  const [deepDiveRef, deepDiveVisible] = useScrollAnimation(0.1);
  const [pickRef, pickVisible] = useScrollAnimation(0.1);
  const [ctaRef, ctaVisible] = useScrollAnimation(0.1);

  const CheckIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-16">
      <article className="max-w-[750px] mx-auto px-4 sm:px-6">

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
            Best LLM Routers in 2026: A Technical Comparison
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-hover)]"></div>
        </header>

        {/* Why Routing Matters */}
        <section
          ref={problemRef}
          className={`animate-on-scroll animate-fade-up ${problemVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Why LLM Routing Matters
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              If you're building with LLMs, you've faced the cost-quality tradeoff. Frontier models
              deliver the best results but cost 10-100x more per token than capable mid-tier alternatives.
              Most queries don't need frontier-level reasoning — but the ones that do <em className="text-[var(--text-primary)]">really</em> need it.
            </p>
            <p>
              LLM routers solve this by analyzing each query and selecting the most cost-effective model
              that can handle it. The best routers save 60-90% on API costs while maintaining 95%+ quality
              retention against frontier baselines.
            </p>
            <p>
              The space has matured significantly in 2026. Here's how the leading options compare.
            </p>
          </div>
        </section>

        {/* What to Look For */}
        <section
          ref={criteriaRef}
          className={`animate-on-scroll animate-fade-up ${criteriaVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            What to Look For in an LLM Router
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-8"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              Not all routers are built the same. Before comparing specific tools, here are the
              criteria that actually matter:
            </p>
          </div>

          <div className="space-y-4">
            {CRITERIA.map((item) => (
              <div
                key={item.title}
                className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-5"
              >
                <div className="flex items-start gap-3">
                  <span className="text-[var(--accent-primary)] mt-1 flex-shrink-0">
                    <CheckIcon />
                  </span>
                  <div>
                    <h3
                      className="text-base font-semibold text-[var(--text-primary)] mb-1"
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
                </div>
              </div>
            ))}
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
            The LLM Routers Worth Evaluating
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-8"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              We've evaluated the routers that are actively maintained and used in production as of
              early 2026. This isn't an exhaustive list — it's the ones worth your time.
            </p>
          </div>

          {/* Router Cards */}
          <div className="space-y-6">
            {ROUTERS.map((router, i) => (
              <div
                key={router.name}
                className={`rounded-xl border p-6 ${
                  i === 0
                    ? 'border-[var(--border-accent)] bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)]'
                    : 'border-[var(--border-secondary)] bg-[var(--bg-secondary)]'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <h3
                    className="text-lg font-bold text-[var(--text-primary)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {router.name}
                  </h3>
                  {router.openSource !== 'No' && (
                    <span
                      className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-[var(--success)]/15 text-[var(--success)]"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      {router.openSource === 'Fully open-source' ? 'Open Source' : 'Partial OSS'}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div
                      className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-1"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      Approach
                    </div>
                    <p className="text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>
                      {router.approach}
                    </p>
                  </div>
                  <div>
                    <div
                      className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-1"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      Best For
                    </div>
                    <p className="text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>
                      {router.bestFor}
                    </p>
                  </div>
                  <div>
                    <div
                      className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-1"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      Strengths
                    </div>
                    <p className="text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>
                      {router.strengths}
                    </p>
                  </div>
                  <div>
                    <div
                      className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-1"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      Tradeoffs
                    </div>
                    <p className="text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>
                      {router.tradeoffs}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Deep Dive: What Separates Them */}
        <section
          ref={deepDiveRef}
          className={`animate-on-scroll animate-fade-up ${deepDiveVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Key Architectural Differences
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              The fundamental split in the router landscape is between <strong className="text-[var(--text-primary)]">binary
              classifiers</strong> and <strong className="text-[var(--text-primary)]">multi-model selectors</strong>.
            </p>
          </div>

          <div className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
              <div
                className="text-lg font-bold text-[var(--text-primary)] mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Binary Classifiers
              </div>
              <p
                className="text-sm text-[var(--text-secondary)] mb-3"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Route to either a "strong" or "weak" model. Simple, fast, easy to understand.
              </p>
              <p
                className="text-sm text-[var(--text-tertiary)]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Example: RouteLLM picks between GPT-4 and Mixtral. Great for research, but limited
                in production where you have 5-10 models at different price points.
              </p>
            </div>
            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
              <div
                className="text-lg font-bold text-[var(--text-primary)] mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Multi-Model Selectors
              </div>
              <p
                className="text-sm text-[var(--text-secondary)] mb-3"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Choose from a full model catalog based on query characteristics. More complex, but
                captures the real cost-quality landscape.
              </p>
              <p
                className="text-sm text-[var(--text-tertiary)]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Example: Herma and Martian evaluate across the full spectrum — routing simple
                queries to budget models, code to specialized models, and hard reasoning to frontier.
              </p>
            </div>
          </div>

          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              The other major differentiator is <strong className="text-[var(--text-primary)]">quality
              validation</strong>. Some routers route and hope for the best. Others — like shadow
              routing — validate decisions against frontier baselines before trusting cheaper models.
            </p>
            <p>
              This matters because routing failures are silent. If a router sends a complex query to
              a cheap model and it produces a plausible-but-wrong answer, nobody notices until it's
              in production. Routers that build in quality feedback loops catch these failures before
              they reach users.
            </p>
          </div>
        </section>

        {/* How to Pick */}
        <section
          ref={pickRef}
          className={`animate-on-scroll animate-fade-up ${pickVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            How to Pick the Right Router
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              The right choice depends on your team and workload:
            </p>
          </div>

          <div className="my-8 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
            <ul
              className="space-y-4 text-[var(--text-secondary)]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <li className="flex items-start gap-3">
                <span className="text-[var(--accent-primary)] mt-1.5 flex-shrink-0">
                  <CheckIcon />
                </span>
                <span>
                  <strong className="text-[var(--text-primary)]">You want maximum control and have ML expertise</strong> — RouteLLM
                  lets you train and host your own classifier. Fork it, tune it, own the entire stack.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--accent-primary)] mt-1.5 flex-shrink-0">
                  <CheckIcon />
                </span>
                <span>
                  <strong className="text-[var(--text-primary)]">You need enterprise support and don't mind vendor lock-in</strong> — Martian
                  offers a managed service with quality guarantees.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--accent-primary)] mt-1.5 flex-shrink-0">
                  <CheckIcon />
                </span>
                <span>
                  <strong className="text-[var(--text-primary)]">You want a unified gateway first, routing second</strong> — OpenRouter
                  gives you access to every model through one API, with basic auto-routing as a bonus.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--accent-primary)] mt-1.5 flex-shrink-0">
                  <CheckIcon />
                </span>
                <span>
                  <strong className="text-[var(--text-primary)]">You want to optimize across many providers and endpoints</strong> — Unify's
                  benchmark-driven approach helps you find the best price-performance point.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--accent-primary)] mt-1.5 flex-shrink-0">
                  <CheckIcon />
                </span>
                <span>
                  <strong className="text-[var(--text-primary)]">You want drop-in cost savings with quality guarantees</strong> — Herma
                  routes automatically with an OpenAI-compatible API, shadow-validates decisions, and
                  publishes benchmark results so you can verify quality retention.
                </span>
              </li>
            </ul>
          </div>

          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              Regardless of which router you choose, the key metric to track is <em className="text-[var(--text-primary)]">quality
              retention vs. frontier</em>. If a router claims 80% cost savings but can't show you
              benchmark data proving quality is preserved, those savings come at a hidden cost.
            </p>
            <p>
              We built <Link to="/blog/how-we-benchmark" className="text-[var(--accent-primary)] hover:underline">an
              open evaluation toolkit</Link> specifically for this — it runs standardized benchmarks
              (MMLU, HumanEval+, GSM8K, and more) against any routing system so you can compare
              apples to apples.
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
              See intelligent routing in action
            </h2>
            <p
              className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Send queries and watch Herma select the right model for each one. No signup required.
            </p>
            <Link
              to="/upgrade"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--accent-primary)] text-[var(--text-inverse)] font-medium rounded-full shadow-md hover:shadow-lg hover:bg-[var(--accent-hover)] transition-all duration-300 hover:-translate-y-0.5 group"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              <span>Try the demo</span>
              <svg
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>
      </article>
    </main>
  );
};

export default BestLLMRouters;

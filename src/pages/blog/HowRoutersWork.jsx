import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { setPageMeta, resetPageMeta, setStructuredData, removeStructuredData } from '../../utils/seo';

const QUALITY_MAP_ROWS = [
  { category: 'factual:easy', example: '"What year was Python released?"', tier: 'cheap', note: 'Simple recall, no reasoning required' },
  { category: 'factual:hard', example: '"Explain the CAP theorem tradeoffs"', tier: 'mid', note: 'Requires depth, but structured' },
  { category: 'coding:easy', example: '"Write a hello world in Rust"', tier: 'cheap', note: 'Mechanical, well-documented pattern' },
  { category: 'coding:hard', example: '"Implement a distributed cache"', tier: 'frontier', note: 'Architecture decisions, edge cases' },
  { category: 'reasoning:hard', example: '"Debug this race condition"', tier: 'frontier', note: 'Multi-step, context-dependent' },
  { category: 'summarization:easy', example: '"Summarize this paragraph"', tier: 'cheap', note: 'Compression, no new reasoning' },
];

const HARD_PARTS = [
  {
    title: 'False negatives',
    description:
      'A query that looks easy can require deep reasoning. "What time is it in Tokyo?" is trivial. "What time is it in Tokyo for a meeting tomorrow if DST just changed?" is not. Surface-level patterns miss this.',
  },
  {
    title: 'Cold start',
    description:
      'A new router has no accumulated quality data. It must either rely entirely on heuristics — which are imprecise — or default to frontier models and observe. The bootstrap phase is the most expensive period.',
  },
  {
    title: 'Agentic workflows',
    description:
      'Multi-turn conversations with tool calls break single-query classification. The first turn sets context that constrains every subsequent turn. A cheap model that handles turn 1 may fail at turn 3 in ways that corrupt the whole session.',
  },
  {
    title: 'Quality measurement',
    description:
      'How do you know a cheaper model\'s answer was "good enough"? You need a quality judge — itself a model — that can compare outputs across tiers accurately. A bad judge produces false confidence and routes hard queries to cheap models.',
  },
];

const HowRoutersWork = () => {
  useEffect(() => {
    setPageMeta(
      'How LLM Routers Work: A Technical Deep Dive',
      'Inside the routing pipeline: query classification, model selection, shadow validation, and expected value optimization. A technical guide for AI engineers.',
      { type: 'article' }
    );
    setStructuredData('ld-article-how-routers-work', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'How LLM Routers Work: A Technical Deep Dive',
      description:
        'Inside the routing pipeline: query classification, model selection, shadow validation, and expected value optimization. A technical guide for AI engineers.',
      author: { '@type': 'Organization', name: 'Herma AI' },
      publisher: { '@type': 'Organization', name: 'Herma AI' },
      datePublished: '2026-03-24',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://hermaai.com/blog/how-llm-routers-work',
      },
    });
    return () => {
      resetPageMeta();
      removeStructuredData('ld-article-how-routers-work');
    };
  }, []);

  const [heroRef, heroVisible] = useScrollAnimation(0.1);
  const [hookRef, hookVisible] = useScrollAnimation(0.1);
  const [pipelineRef, pipelineVisible] = useScrollAnimation(0.1);
  const [classificationRef, classificationVisible] = useScrollAnimation(0.1);
  const [qualityMapRef, qualityMapVisible] = useScrollAnimation(0.1);
  const [shadowRef, shadowVisible] = useScrollAnimation(0.1);
  const [evRef, evVisible] = useScrollAnimation(0.1);
  const [hardPartsRef, hardPartsVisible] = useScrollAnimation(0.1);
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
              Engineering
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
            How LLM Routers Work: A Technical Deep Dive
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
              Every LLM API call costs money. A router decides which model handles each request
              — and the difference between a good router and a bad one is whether you notice.
            </p>
            <p>
              A good router is invisible. You get the same quality responses you'd get from the
              most capable model, at a fraction of the cost, without changing your application
              code. A bad router degrades quality on hard queries while saving money on easy ones
              — a tradeoff that destroys trust quickly.
            </p>
            <p>
              This is a technical walkthrough of what happens inside a router on every request:
              how queries get classified, how models get selected, how quality gets validated, and
              how the system learns over time.
            </p>
          </div>
        </section>

        {/* The Routing Pipeline */}
        <section
          ref={pipelineRef}
          className={`animate-on-scroll animate-fade-up ${pipelineVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            The Routing Pipeline
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-8"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              Every request passes through four stages before a model ever sees it. Each stage
              narrows the decision space and accumulates signal that feeds back into future routing.
            </p>
          </div>

          <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
            <div className="space-y-5">
              {[
                {
                  step: '1',
                  label: 'Query classification',
                  desc: 'Analyze the incoming message for category (coding, factual, reasoning, summarization) and difficulty (easy, medium, hard). This is the foundation — all downstream decisions depend on it.',
                },
                {
                  step: '2',
                  label: 'Model selection',
                  desc: 'Look up the category:difficulty combination in the quality map. Select the cheapest model tier whose historical quality score clears the configured threshold for that query type.',
                },
                {
                  step: '3',
                  label: 'Quality validation',
                  desc: 'In shadow mode, run both the selected cheap model and the frontier model in parallel. Compare outputs using a quality judge. Build confidence data without affecting the user response.',
                },
                {
                  step: '4',
                  label: 'Feedback loop',
                  desc: 'Update the quality map with observed results. Over time, confidence in cheaper paths increases — or decreases if quality drops. The router adapts without engineering intervention.',
                },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--accent-muted)] border border-[var(--border-accent)] flex items-center justify-center text-sm font-bold text-[var(--accent-primary)]"
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
                    <p
                      className="text-sm text-[var(--text-secondary)] mt-1 leading-relaxed"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Query Classification */}
        <section
          ref={classificationRef}
          className={`animate-on-scroll animate-fade-up ${classificationVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Query Classification
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              Classification is the hardest step. A router needs to quickly determine two things
              about every query: what kind of task it is, and how hard that task is.
            </p>
            <p>
              Common signals used in classification:
            </p>
          </div>

          <div className="my-8 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
            <ul className="space-y-4">
              {[
                {
                  signal: 'Regex pattern matching',
                  desc: 'Detects task type — code blocks, import statements, library names, question words (what, why, how). A message containing `def ` or `import numpy` is almost certainly a coding task.',
                },
                {
                  signal: 'Word count heuristics',
                  desc: 'Short queries with simple vocabulary tend to be factual:easy. Long queries with technical terminology tend to be harder. Not a perfect signal, but cheap and fast.',
                },
                {
                  signal: 'Library and domain detection',
                  desc: 'Mentions of specific libraries, frameworks, or protocols (gRPC, consensus algorithms, database internals) elevate the difficulty estimate. These topics require specialized knowledge.',
                },
                {
                  signal: 'Reasoning keyword detection',
                  desc: 'Phrases like "debug this", "explain why", "optimize for", and "compare the tradeoffs" signal reasoning tasks that often require deeper models.',
                },
              ].map((item) => (
                <li key={item.signal} className="flex items-start gap-3">
                  <span className="text-[var(--accent-primary)] mt-1 flex-shrink-0">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <div>
                    <span
                      className="text-sm font-semibold text-[var(--text-primary)]"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {item.signal}
                    </span>
                    <span
                      className="text-sm text-[var(--text-secondary)] ml-2"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      — {item.desc}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="space-y-4 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>Two examples of what this produces in practice:</p>
          </div>

          <div className="my-6 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-secondary)] overflow-hidden">
            <div className="bg-[var(--bg-tertiary)] px-4 py-2 border-b border-[var(--border-secondary)]">
              <span
                className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Classification examples
              </span>
            </div>
            <div className="p-4 overflow-x-auto">
              <pre
                className="text-sm text-[var(--text-secondary)]"
                style={{ fontFamily: 'var(--font-code)' }}
              >
                <code>{`classify("What is Python?")
→ { category: "factual", difficulty: "easy" }
→ route to: cheap model tier

classify("Implement a distributed cache with LRU eviction and TTL")
→ { category: "coding", difficulty: "hard" }
→ route to: frontier model tier`}</code>
              </pre>
            </div>
          </div>

          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              Classification runs in microseconds — it has to, because it sits on the critical path
              of every request. It uses no LLM calls. The speed constraint is why most routers use
              heuristics and pattern matching rather than embedding similarity or a classifier model,
              which would add 50-200ms of latency.
            </p>
          </div>
        </section>

        {/* The Quality Map */}
        <section
          ref={qualityMapRef}
          className={`animate-on-scroll animate-fade-up ${qualityMapVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            The Quality Map
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-8"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              The quality map is a lookup table that pairs each{' '}
              <code
                className="text-[var(--accent-primary)] bg-[var(--accent-muted)] px-1.5 py-0.5 rounded text-sm"
                style={{ fontFamily: 'var(--font-code)' }}
              >
                category:difficulty
              </code>{' '}
              combination with a model tier and a quality confidence score. It's the router's
              accumulated knowledge about which queries different models can handle reliably.
            </p>
            <p>
              The map starts from benchmarks and heuristics. It gets more precise over time as
              shadow comparisons return quality data from real queries.
            </p>
          </div>

          {/* Quality map table */}
          <div className="rounded-xl border border-[var(--border-secondary)] overflow-hidden mb-8">
            <div className="grid grid-cols-[1fr_auto_1fr] bg-[var(--bg-tertiary)] border-b border-[var(--border-secondary)]">
              <div
                className="px-4 py-3 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Category:Difficulty
              </div>
              <div
                className="px-4 py-3 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider border-l border-[var(--border-secondary)]"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Model tier
              </div>
              <div
                className="px-4 py-3 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider border-l border-[var(--border-secondary)]"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Why
              </div>
            </div>
            <div className="divide-y divide-[var(--border-secondary)]">
              {QUALITY_MAP_ROWS.map((row, i) => (
                <div
                  key={row.category}
                  className={`grid grid-cols-[1fr_auto_1fr] ${i % 2 === 0 ? 'bg-[var(--bg-secondary)]' : 'bg-[var(--bg-primary)]'}`}
                >
                  <div
                    className="px-4 py-3"
                    style={{ fontFamily: 'var(--font-code)' }}
                  >
                    <span className="text-xs text-[var(--accent-primary)] bg-[var(--accent-muted)] px-1.5 py-0.5 rounded">
                      {row.category}
                    </span>
                  </div>
                  <div
                    className="px-4 py-3 border-l border-[var(--border-secondary)] flex items-center"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        row.tier === 'frontier'
                          ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                          : row.tier === 'mid'
                          ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                          : 'bg-green-500/10 text-green-400 border border-green-500/20'
                      }`}
                    >
                      {row.tier}
                    </span>
                  </div>
                  <div
                    className="px-4 py-3 text-sm text-[var(--text-secondary)] border-l border-[var(--border-secondary)]"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {row.note}
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
              The model tier isn't a fixed assignment — it's a starting point with a confidence
              score. As shadow comparisons accumulate evidence, the confidence in routing a given
              category:difficulty pair to a given tier goes up or down. When confidence crosses a
              threshold, the router graduates that path from shadow to active routing.
            </p>
          </div>
        </section>

        {/* Shadow Mode */}
        <section
          ref={shadowRef}
          className={`animate-on-scroll animate-fade-up ${shadowVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Shadow Mode: Validating Quality Without Risk
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              The core problem with deploying a router is trust. You need to know a cheaper model
              produces equivalent results before you send real users to it. Shadow mode solves this
              without affecting anyone.
            </p>
            <p>
              In shadow mode, every request gets two responses: the frontier model's response
              (which is returned to the user) and the cheaper model's response (which is compared
              against it silently). A quality judge scores both. The router accumulates
              evidence about whether the cheaper model is safe to activate on that query type.
            </p>
          </div>

          <div className="my-8 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
            <div
              className="text-sm font-medium text-[var(--text-tertiary)] mb-5 uppercase tracking-wider"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Shadow mode flow
            </div>
            <div className="space-y-4">
              {[
                { step: '1', text: 'Request arrives. Classification assigns category:difficulty.' },
                { step: '2', text: 'Router fires the request to the frontier model (user gets this response) and the candidate cheap model (runs silently in parallel).' },
                { step: '3', text: 'Quality judge compares the two outputs on a 0–1 scale. Scores accumulate in the quality map for that category:difficulty pair.' },
                { step: '4', text: 'Once confidence crosses the activation threshold (e.g., 95% quality equivalence over 50+ comparisons), the router activates the cheaper path for that query type.' },
                { step: '5', text: 'Activated paths are still monitored. If quality drift is detected, the path rolls back to frontier automatically.' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--accent-muted)] border border-[var(--border-accent)] flex items-center justify-center text-xs font-bold text-[var(--accent-primary)]"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {item.step}
                  </div>
                  <p
                    className="text-sm text-[var(--text-secondary)] leading-relaxed pt-0.5"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              The key insight is that shadow mode separates risk from learning. You accumulate
              quality data at no risk to users. The router only activates cheaper paths when it has
              statistical confidence that they're safe — not when a benchmark says so, but when your
              actual traffic proves it.
            </p>
            <p>
              For a deeper treatment of shadow routing, see{' '}
              <Link to="/blog/shadow-routing" className="text-[var(--accent-primary)] hover:underline">
                shadow routing: how to validate routing without risk
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Expected Value Routing */}
        <section
          ref={evRef}
          className={`animate-on-scroll animate-fade-up ${evVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Expected Value Routing
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              A naive router picks the cheapest model that exceeds a quality threshold. This works
              but misses the full picture. The better framing is expected value: which model
              produces the highest{' '}
              <em className="text-[var(--text-primary)]">value per dollar spent</em>?
            </p>
          </div>

          <div className="my-8 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
            <div
              className="text-sm font-medium text-[var(--text-tertiary)] mb-4 uppercase tracking-wider"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              The EV formula
            </div>
            <div className="bg-[var(--bg-primary)] rounded-lg p-4 text-center">
              <code
                className="text-lg text-[var(--accent-primary)]"
                style={{ fontFamily: 'var(--font-code)' }}
              >
                EV = quality_score × (1 - cost_ratio)
              </code>
            </div>
            <p
              className="text-sm text-[var(--text-tertiary)] mt-3"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Route to the model with the highest EV — not just the cheapest model above a threshold.
              A model that costs 40% less but produces 99% of the quality may outperform one that
              costs 80% less but produces only 80% of the quality, depending on the use case.
            </p>
          </div>

          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              EV routing also handles the confidence dimension correctly. A cheap model with high
              quality scores but only 10 shadow comparisons should be trusted less than the same
              model with 500 comparisons. Confidence bounds on the quality estimate factor into the
              routing decision — so the router is more conservative early (fewer comparisons) and
              more aggressive later (high confidence in cheaper paths).
            </p>
            <p>
              See{' '}
              <Link to="/blog/ev-routing" className="text-[var(--accent-primary)] hover:underline">
                why AI routers fail — and how expected value fixes them
              </Link>{' '}
              for a full treatment of this framework, including why threshold-based routing tends
              to degrade under distribution shift.
            </p>
          </div>
        </section>

        {/* The Hard Part */}
        <section
          ref={hardPartsRef}
          className={`animate-on-scroll animate-fade-up ${hardPartsVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            The Hard Part
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-8"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              The pipeline above makes routing sound mechanical. In practice, there are four
              failure modes that are genuinely difficult to solve.
            </p>
          </div>

          <div className="space-y-4">
            {HARD_PARTS.map((item) => (
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

          <div
            className="mt-8 space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              Agentic workflows get their own post:{' '}
              <Link to="/blog/agentic-routing" className="text-[var(--accent-primary)] hover:underline">
                LLM routing for agentic AI: why single-turn routers fail
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
              See it in action
            </h2>
            <p
              className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Herma implements the full pipeline described here — classification, quality map,
              shadow validation, and EV routing — behind an OpenAI-compatible API. Change 2 lines
              of code. No routing logic to maintain.
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
                to="/"
                className="inline-flex items-center gap-2 px-8 py-3 border border-[var(--border-accent)] text-[var(--text-primary)] font-medium rounded-full hover:bg-[var(--bg-secondary)] transition-all duration-300"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                See Route Preview
              </Link>
            </div>
          </div>
        </section>

      </article>
    </main>
  );
};

export default HowRoutersWork;

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { setPageMeta, resetPageMeta, setStructuredData, removeStructuredData } from '../../utils/seo';

const ShadowRouting = () => {
  useEffect(() => {
    setPageMeta('Shadow Routing: Test LLM Cost Optimization Without Risk', 'How to validate an LLM routing system in production without affecting users. Shadow mode, quality judging, and graduation criteria.', { type: 'article' });
    setStructuredData('ld-article-shadow-routing', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Shadow Routing: How to Test LLM Cost Optimization Without Risk',
      description: 'How to validate an LLM routing system in production without affecting users. Shadow mode, quality judging, and graduation criteria.',
      author: { '@type': 'Organization', name: 'Herma AI' },
      publisher: { '@type': 'Organization', name: 'Herma AI' },
      datePublished: '2026-03-22',
    });
    return () => {
      resetPageMeta();
      removeStructuredData('ld-article-shadow-routing');
    };
  }, []);

  const [heroRef, heroVisible] = useScrollAnimation(0.1);
  const [problemRef, problemVisible] = useScrollAnimation(0.1);
  const [shadowRef, shadowVisible] = useScrollAnimation(0.1);
  const [pipelineRef, pipelineVisible] = useScrollAnimation(0.1);
  const [judgingRef, judgingVisible] = useScrollAnimation(0.1);
  const [resultsRef, resultsVisible] = useScrollAnimation(0.1);
  const [graduationRef, graduationVisible] = useScrollAnimation(0.1);
  const [ctaRef, ctaVisible] = useScrollAnimation(0.1);

  const benchmarkData = [
    { benchmark: 'MMLU', n: 500, router: '86.4%', opus: '88.0%', vs: '98.2%' },
    { benchmark: 'ARC-Challenge', n: 300, router: '96.7%', opus: '96.0%', vs: '100.7%' },
    { benchmark: 'GSM8K', n: 100, router: '95.0%', opus: '95.0%', vs: '100.0%' },
    { benchmark: 'HumanEval+', n: 164, router: '92.1%', opus: '90.2%', vs: '102.1%' },
    { benchmark: 'MBPP+', n: 378, router: '91.0%', opus: '86.0%', vs: '105.8%' },
  ];

  const CheckIcon = () => (
    <span className="text-[var(--accent-primary)] mt-1.5 flex-shrink-0">
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    </span>
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
            Shadow Routing: How to Test LLM Cost Optimization Without Risk
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-hover)]"></div>
        </header>

        {/* The Problem */}
        <section
          ref={problemRef}
          className={`animate-on-scroll animate-fade-up ${problemVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            The Problem
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              You know cheaper models exist. You've seen the benchmarks. You understand that
              routing simple queries to budget models could cut your API bill by 80-95%. But
              there's a problem that stops most teams from ever flipping the switch:
            </p>
            <p className="text-[var(--text-primary)] font-medium text-lg sm:text-xl">
              What if the cheaper model gets it wrong?
            </p>
            <p>
              A bad response on a customer-facing query isn't just an error -- it's a trust
              violation. Users don't care about your cost optimization strategy. They care
              that the answer is correct. One visible quality degradation can undo months of
              goodwill.
            </p>
            <p>
              So teams stay on frontier models for everything, paying 10-50x more than
              necessary, because the risk of switching feels higher than the cost of staying.
            </p>
            <p>
              Shadow routing solves this. It lets you validate a routing system against real
              production traffic -- without touching a single user response.
            </p>
          </div>
        </section>

        {/* Shadow Mode Explained */}
        <section
          ref={shadowRef}
          className={`animate-on-scroll animate-fade-up ${shadowVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Shadow Mode Explained
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              The core idea is simple: observe everything, change nothing. In shadow mode,
              your production system operates exactly as it does today. Every request hits
              the frontier model. Every user gets the same response they always would. Nothing
              changes from the user's perspective.
            </p>
            <p>
              But behind the scenes, the router is working. For every incoming request, it
              runs a parallel analysis:
            </p>
          </div>

          <div className="my-8 space-y-4">
            {[
              {
                step: '1',
                title: 'Classify the query',
                desc: 'The router analyzes the request and determines its category (coding, analysis, creative, math, factual, simple chat) and difficulty level (easy, medium, hard).'
              },
              {
                step: '2',
                title: 'Log the recommendation',
                desc: 'Based on the classification, the router records which cheaper model it would have selected -- but does not actually use it. The frontier model still handles the request.'
              },
              {
                step: '3',
                title: 'Score both responses',
                desc: 'A quality judge evaluates the frontier model\'s actual response. Separately, the recommended cheaper model also generates a response, and the judge scores that too.'
              },
              {
                step: '4',
                title: 'Build the evidence base',
                desc: 'Over time, this produces a statistical picture: "For category X at difficulty Y, the cheaper model achieves N% of frontier quality at a fraction of the cost."'
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex gap-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-5"
              >
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--accent-primary)] flex items-center justify-center text-sm font-bold text-[var(--text-inverse)]"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  {item.step}
                </div>
                <div>
                  <h3
                    className="text-[var(--text-primary)] font-semibold mb-1"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-sm text-[var(--text-secondary)] leading-relaxed"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              The key property of shadow mode is that it's <em className="text-[var(--text-primary)]">zero-risk
              by construction</em>. You can't degrade quality because you're not changing any
              user-facing behavior. You're just collecting data about what would have happened
              if you had.
            </p>
          </div>
        </section>

        {/* The Classification Pipeline */}
        <section
          ref={pipelineRef}
          className={`animate-on-scroll animate-fade-up ${pipelineVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            The Classification Pipeline
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              Routing decisions depend on understanding what the user is asking. The
              classification pipeline breaks each query into two dimensions:
            </p>
          </div>

          <div className="my-8 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
            <h3
              className="text-lg font-semibold text-[var(--text-primary)] mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Category Detection
            </h3>
            <ul
              className="space-y-3 text-[var(--text-secondary)]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {[
                { label: 'Coding', desc: 'Code generation, debugging, refactoring, code review' },
                { label: 'Analysis', desc: 'Data interpretation, comparisons, trade-off evaluations' },
                { label: 'Creative', desc: 'Writing, brainstorming, content generation' },
                { label: 'Math', desc: 'Calculations, proofs, statistical reasoning' },
                { label: 'Factual', desc: 'Lookups, definitions, straightforward Q&A' },
                { label: 'Simple chat', desc: 'Greetings, clarifications, format conversions' },
              ].map((cat) => (
                <li key={cat.label} className="flex items-start gap-3">
                  <CheckIcon />
                  <span>
                    <strong className="text-[var(--text-primary)]">{cat.label}:</strong> {cat.desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="my-8 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
            <h3
              className="text-lg font-semibold text-[var(--text-primary)] mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Difficulty Estimation
            </h3>
            <ul
              className="space-y-3 text-[var(--text-secondary)]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {[
                { label: 'Easy', desc: 'Well-defined tasks with clear correct answers. Budget models handle these reliably.' },
                { label: 'Medium', desc: 'Requires reasoning or synthesis but follows known patterns. Mid-tier models excel here.' },
                { label: 'Hard', desc: 'System design, formal verification, CRDTs, multi-step proofs. Frontier models only.' },
              ].map((diff) => (
                <li key={diff.label} className="flex items-start gap-3">
                  <CheckIcon />
                  <span>
                    <strong className="text-[var(--text-primary)]">{diff.label}:</strong> {diff.desc}
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
              Each (category, difficulty) pair forms a cell in the routing matrix. Over time,
              shadow mode populates every cell with real performance data: how often the cheaper
              model matched frontier quality, and by how much it fell short when it didn't.
            </p>
            <p>
              Some cells converge quickly. Simple factual queries at easy difficulty are almost
              always safe to route cheaply -- budget models answer "What is the capital of France?"
              just as well as frontier ones. Other cells, like hard coding problems or complex
              mathematical proofs, may never leave frontier routing, and that's by design.
            </p>
          </div>
        </section>

        {/* Quality Judging */}
        <section
          ref={judgingRef}
          className={`animate-on-scroll animate-fade-up ${judgingVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Quality Judging
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              The quality judge is what makes shadow routing trustworthy. Without automated
              evaluation, you'd need humans to review every shadow comparison -- which defeats
              the purpose of automation.
            </p>
            <p>
              The judge model evaluates each response on three dimensions, scoring each from
              1 to 5:
            </p>
          </div>

          <div className="my-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                title: 'Relevance',
                desc: 'Does the response address what the user actually asked? Off-topic or partially-on-topic answers score low.',
              },
              {
                title: 'Accuracy',
                desc: 'Are the facts, code, and reasoning correct? A confident but wrong answer scores lower than a hedged but correct one.',
              },
              {
                title: 'Helpfulness',
                desc: 'Would the user be satisfied? Includes completeness, clarity, appropriate level of detail, and actionability.',
              },
            ].map((dim) => (
              <div
                key={dim.title}
                className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-5"
              >
                <h3
                  className="text-[var(--text-primary)] font-semibold mb-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {dim.title}
                </h3>
                <p
                  className="text-sm text-[var(--text-secondary)] leading-relaxed"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {dim.desc}
                </p>
              </div>
            ))}
          </div>

          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              A response needs an overall score of <strong className="text-[var(--text-primary)]">4
              or higher</strong> to be considered "good enough." This is a deliberately high
              bar -- we're not looking for "acceptable," we're looking for "users wouldn't
              notice the difference."
            </p>
            <p>
              The critical threshold is the <strong className="text-[var(--text-primary)]">pass
              rate per cell</strong>. A (category, difficulty) cell only becomes eligible for
              cheaper routing when the pass rate -- the percentage of shadow comparisons where
              the cheaper model scored 4 or above -- exceeds <strong className="text-[var(--text-primary)]">95%</strong>.
            </p>
          </div>

          <div className="my-8 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-accent)] p-6">
            <p
              className="text-sm text-[var(--text-tertiary)] leading-relaxed"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              <strong className="text-[var(--text-secondary)]">Why 95%?</strong> Because
              the 5% failure margin accounts for edge cases, ambiguous queries, and judge model
              noise. At 95%, even the worst-case user experience is nearly indistinguishable
              from always using frontier. And the cells that can't hit 95% simply stay on
              frontier -- no forced downgrades, ever.
            </p>
          </div>
        </section>

        {/* Results */}
        <section
          ref={resultsRef}
          className={`animate-on-scroll animate-fade-up ${resultsVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Results From Our Deployment
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-8"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              We ran shadow mode against our own production traffic, scoring 805 responses
              across 9 models spanning the full cost spectrum. The router's recommendations
              were evaluated against frontier baselines across five standard benchmarks:
            </p>
          </div>

          {/* Benchmark Table */}
          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-secondary)]">
                  <th
                    className="text-left py-3 px-4 text-sm font-semibold text-[var(--text-primary)]"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    Benchmark
                  </th>
                  <th
                    className="text-right py-3 px-4 text-sm font-semibold text-[var(--text-primary)]"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    N
                  </th>
                  <th
                    className="text-right py-3 px-4 text-sm font-semibold text-[var(--accent-primary)]"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    Router
                  </th>
                  <th
                    className="text-right py-3 px-4 text-sm font-semibold text-[var(--text-primary)]"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    Frontier Reference
                  </th>
                  <th
                    className="text-right py-3 px-4 text-sm font-semibold text-[var(--text-primary)]"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    Quality vs Frontier
                  </th>
                </tr>
              </thead>
              <tbody>
                {benchmarkData.map((row, i) => (
                  <tr
                    key={row.benchmark}
                    className={`border-b border-[var(--border-primary)] ${
                      i % 2 === 0 ? 'bg-[var(--bg-secondary)]' : ''
                    }`}
                  >
                    <td
                      className="py-3 px-4 text-sm text-[var(--text-primary)] font-medium"
                      style={{ fontFamily: 'var(--font-code)' }}
                    >
                      {row.benchmark}
                    </td>
                    <td
                      className="py-3 px-4 text-sm text-[var(--text-tertiary)] text-right"
                      style={{ fontFamily: 'var(--font-code)' }}
                    >
                      {row.n}
                    </td>
                    <td
                      className="py-3 px-4 text-sm text-[var(--accent-primary)] text-right font-semibold"
                      style={{ fontFamily: 'var(--font-code)' }}
                    >
                      {row.router}
                    </td>
                    <td
                      className="py-3 px-4 text-sm text-[var(--text-secondary)] text-right"
                      style={{ fontFamily: 'var(--font-code)' }}
                    >
                      {row.opus}
                    </td>
                    <td className="py-3 px-4 text-sm text-right" style={{ fontFamily: 'var(--font-code)' }}>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                          parseFloat(row.vs) >= 100
                            ? 'bg-[var(--success)]/15 text-[var(--success)]'
                            : 'bg-[var(--warning)]/15 text-[var(--warning)]'
                        }`}
                      >
                        {row.vs}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-accent)] p-6 mb-8"
          >
            <p
              className="text-sm text-[var(--text-tertiary)] leading-relaxed"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              <strong className="text-[var(--text-secondary)]">Reading the table:</strong> "Quality
              vs Frontier" shows the router's accuracy as a percentage of the frontier reference.
              Values at or above 100% mean the router matched or beat the most expensive model.
              On code benchmarks (HumanEval+, MBPP+), the router outperformed the
              frontier baseline by selecting specialized models.
            </p>
          </div>

          <div className="my-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6 text-center">
              <div
                className="text-3xl font-bold text-[var(--success)] mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                89%
              </div>
              <p
                className="text-sm text-[var(--text-secondary)]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                average cost savings across balanced workloads
              </p>
            </div>
            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6 text-center">
              <div
                className="text-3xl font-bold text-[var(--accent-primary)] mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                95%+
              </div>
              <p
                className="text-sm text-[var(--text-secondary)]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                quality retention on every traffic scenario tested
              </p>
            </div>
            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6 text-center">
              <div
                className="text-3xl font-bold text-[var(--text-primary)] mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                0
              </div>
              <p
                className="text-sm text-[var(--text-secondary)]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                user-facing changes during the entire shadow evaluation period
              </p>
            </div>
          </div>

          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              The shadow data confirmed what our initial benchmarks suggested: the majority
              of real-world queries don't need frontier models. Simple factual questions,
              routine code generation, content formatting -- these categories showed pass
              rates well above 95% with budget models, at a fraction of the cost.
            </p>
          </div>
        </section>

        {/* Graduating from Shadow to Active */}
        <section
          ref={graduationRef}
          className={`animate-on-scroll animate-fade-up ${graduationVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            When to Graduate from Shadow to Active
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              Shadow mode isn't meant to run forever. It's a validation phase. The goal is to
              collect enough evidence to confidently activate cheaper routing for the cells
              that have proven themselves. Here's what graduation looks like:
            </p>
          </div>

          <div className="my-8 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
            <h3
              className="text-lg font-semibold text-[var(--text-primary)] mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Graduation Criteria
            </h3>
            <ul
              className="space-y-3 text-[var(--text-secondary)]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <li className="flex items-start gap-3">
                <CheckIcon />
                <span>
                  <strong className="text-[var(--text-primary)]">Minimum sample size:</strong> Each
                  (category, difficulty) cell needs a statistically meaningful number of scored
                  comparisons. A handful of data points isn't enough -- you need enough samples
                  to trust the pass rate.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon />
                <span>
                  <strong className="text-[var(--text-primary)]">Pass rate above threshold:</strong> The
                  cell must show a pass rate of 95% or higher. This means 19 out of every 20
                  shadow comparisons showed the cheaper model scoring 4+ on quality.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon />
                <span>
                  <strong className="text-[var(--text-primary)]">Cascade fallback active:</strong> Even
                  after graduation, a safety net remains. If the cheaper model's response
                  scores below threshold at runtime, the system automatically falls back to
                  the frontier model and serves that response instead. The user never sees the
                  low-quality attempt.
                </span>
              </li>
            </ul>
          </div>

          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              The cascade fallback is what makes active routing safe even after graduation.
              The flow is: cheaper model generates a response, the quality judge scores it,
              and if the score is below 4, the frontier model handles the request instead.
              This means worst-case latency increases slightly on failed attempts, but quality
              never degrades.
            </p>
            <p>
              Cells that consistently fail to meet the 95% threshold simply stay on frontier
              routing permanently. There's no pressure to force cheaper routing where the data
              doesn't support it. The savings come from the cells that <em className="text-[var(--text-primary)]">do</em> converge
              -- and in practice, that's the majority of traffic.
            </p>
          </div>

          {/* Architecture Diagram */}
          <div className="my-8 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
            <h3
              className="text-lg font-semibold text-[var(--text-primary)] mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              The Full Lifecycle
            </h3>
            <div className="bg-[var(--bg-primary)] rounded-lg p-4 overflow-x-auto">
              <pre
                className="text-sm text-[var(--text-secondary)]"
                style={{ fontFamily: 'var(--font-code)' }}
              >
                <code>{`Shadow Mode (zero risk)
  Request → Frontier model → User gets response
          → Router classifies query (shadow)
          → Cheaper model generates response (shadow)
          → Judge scores both (shadow)
          → Results logged to routing matrix

                    ↓  (when cell reaches 95% pass rate)

Active Mode (graduated cells only)
  Request → Router classifies query
          → If cell graduated:
              Cheaper model → Judge scores → Score ≥ 4? Serve it
                                           → Score < 4? Frontier fallback
          → If cell not graduated:
              Frontier model → Serve directly`}</code>
              </pre>
            </div>
          </div>

          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              This architecture means the system gets cheaper over time as more cells
              graduate, but it can never get worse. Quality has a hard floor at frontier
              level. Cost has a soft ceiling that drops as evidence accumulates.
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
              Try it yourself
            </h2>
            <p
              className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Herma handles all of this automatically -- shadow evaluation, quality judging,
              graduated routing. Send a query and see the router in action.
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

export default ShadowRouting;

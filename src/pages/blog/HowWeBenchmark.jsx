import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { setPageMeta, resetPageMeta, setStructuredData, removeStructuredData } from '../../utils/seo';

const BENCHMARK_DATA = [
  { benchmark: 'MMLU', n: 500, router: '86.4%', frontier: '88.0%', vs: '98.2%' },
  { benchmark: 'ARC-Challenge', n: 300, router: '96.7%', frontier: '96.0%', vs: '100.7%' },
  { benchmark: 'GSM8K', n: 100, router: '95.0%', frontier: '95.0%', vs: '100.0%' },
  { benchmark: 'HumanEval+', n: 164, router: '92.1%', frontier: '90.2%', vs: '102.1%' },
  { benchmark: 'MBPP+', n: 378, router: '91.0%', frontier: '86.0%', vs: '105.8%' },
];

const CheckIcon = () => (
  <span className="text-[var(--accent-primary)] mt-1.5 flex-shrink-0">
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  </span>
);

const HowWeBenchmark = () => {
  useEffect(() => {
    setPageMeta(
      'How We Benchmark AI Routers: Methodology, Pitfalls, and What We Learned',
      'The real challenges of benchmarking a model routing system | broken datasets, answer extraction bugs, and what we learned about classifier design.',
      { type: 'article' }
    );
    setStructuredData('ld-article-how-we-benchmark', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'How We Benchmark AI Routers: Methodology, Pitfalls, and What We Learned',
      description: 'The real challenges of benchmarking a model routing system | broken datasets, answer extraction bugs, and what we learned about classifier design.',
      author: { '@type': 'Organization', name: 'Herma AI' },
      publisher: { '@type': 'Organization', name: 'Herma AI' },
      datePublished: '2026-03-22',
    });
    return () => {
      resetPageMeta();
      removeStructuredData('ld-article-how-we-benchmark');
    };
  }, []);

  const [heroRef, heroVisible] = useScrollAnimation(0.1);
  const [whyHardRef, whyHardVisible] = useScrollAnimation(0.1);
  const [methodRef, methodVisible] = useScrollAnimation(0.1);
  const [pitfallsRef, pitfallsVisible] = useScrollAnimation(0.1);
  const [learnedRef, learnedVisible] = useScrollAnimation(0.1);
  const [resultsRef, resultsVisible] = useScrollAnimation(0.1);
  const [ctaRef, ctaVisible] = useScrollAnimation(0.1);

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
            How We Benchmark AI Routers: Methodology, Pitfalls, and What We Learned
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-hover)]"></div>
        </header>

        {/* Why Benchmarking Routers Is Hard */}
        <section
          ref={whyHardRef}
          className={`animate-on-scroll animate-fade-up ${whyHardVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Why Benchmarking Routers Is Hard
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              Benchmarking a single model is straightforward: give it questions, score the answers,
              compare to other models. Benchmarking a <em className="text-[var(--text-primary)]">routing
              system</em> is a fundamentally different problem.
            </p>
            <p>
              A router doesn't generate answers -- it decides <em className="text-[var(--text-primary)]">which
              model</em> should generate each answer. That means you're not testing one model's
              capability. You're testing a decision system that must balance two competing objectives:
              cost and quality.
            </p>
            <p>
              The trivial solution is obvious: always pick the frontier model. You get 100% quality
              retention -- and 0% cost savings. The router adds overhead with no value. Going the
              other direction, always picking the cheapest model maximizes savings but tanks quality.
            </p>
            <p>
              The challenge is proving that savings are possible <em className="text-[var(--text-primary)]">without</em> quality
              loss. That requires knowing, for every query, which cheaper models would have produced
              an equally good answer. And the only way to know that is to actually run the queries
              across every model and score them all.
            </p>
          </div>
        </section>

        {/* Our Methodology */}
        <section
          ref={methodRef}
          className={`animate-on-scroll animate-fade-up ${methodVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Our Methodology
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              We scored <strong className="text-[var(--text-primary)]">805 responses</strong> across <strong className="text-[var(--text-primary)]">9
              models</strong> spanning the full cost spectrum. Each model received identical prompts
              under identical conditions, and every response was scored independently.
            </p>
          </div>

          <div className="my-8 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
            <h3
              className="text-lg font-semibold text-[var(--text-primary)] mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Evaluation Framework
            </h3>
            <ul
              className="space-y-3 text-[var(--text-secondary)]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <li className="flex items-start gap-3">
                <CheckIcon />
                <span><strong className="text-[var(--text-primary)]">Quality judge:</strong> Automated scoring on relevance, accuracy, and helpfulness using a 1-5 scale. An independent judge model evaluated each response blind -- no knowledge of which model produced it.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon />
                <span><strong className="text-[var(--text-primary)]">Categories:</strong> Coding, analysis, creative writing, math, factual Q&A, and simple chat -- covering the real distribution of API traffic.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon />
                <span><strong className="text-[var(--text-primary)]">Difficulty levels:</strong> Easy, medium, and hard prompts within each category. This is critical -- the router's value comes from knowing which difficulty levels can be safely downgraded.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon />
                <span><strong className="text-[var(--text-primary)]">Quality threshold:</strong> A score of 4 or higher (out of 5) means "good enough" to replace the frontier model. Below 4, the quality gap is noticeable.</span>
              </li>
            </ul>
          </div>

          <div className="my-8 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
            <h3
              className="text-lg font-semibold text-[var(--text-primary)] mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Standard Benchmarks
            </h3>
            <p
              className="text-[var(--text-secondary)] mb-4"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Beyond our custom evaluation, we ran established academic benchmarks to validate
              against known baselines:
            </p>
            <ul
              className="space-y-3 text-[var(--text-secondary)]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <li className="flex items-start gap-3">
                <CheckIcon />
                <span><strong className="text-[var(--text-primary)]">MMLU</strong> (500 questions) -- Massive Multitask Language Understanding across 57 subjects</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon />
                <span><strong className="text-[var(--text-primary)]">ARC-Challenge</strong> (300 questions) -- Grade-school science questions requiring reasoning</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon />
                <span><strong className="text-[var(--text-primary)]">GSM8K</strong> (100 questions) -- Grade school math word problems</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon />
                <span><strong className="text-[var(--text-primary)]">HumanEval+</strong> (164 questions) -- Python code generation with augmented test cases</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon />
                <span><strong className="text-[var(--text-primary)]">MBPP+</strong> (378 questions) -- Mostly Basic Python Problems with extended validation</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Pitfalls We Discovered */}
        <section
          ref={pitfallsRef}
          className={`animate-on-scroll animate-fade-up ${pitfallsVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Pitfalls We Discovered
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              Running benchmarks sounds simple. In practice, we hit multiple issues that would
              have silently corrupted our results if we hadn't caught them. Here's what went wrong
              and how we fixed it.
            </p>
          </div>

          {/* Pitfall 1 */}
          <div className="my-8 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
            <h3
              className="text-lg font-semibold text-[var(--text-primary)] mb-3"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Broken Ground Truth Data
            </h3>
            <div
              className="space-y-4 text-[var(--text-secondary)]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <p>
                We initially used RouterBench as our data source for GSM8K evaluation. It seemed
                like the right choice -- it's designed specifically for router benchmarking. But when
                we looked at the actual numbers, something was off: only <strong className="text-[var(--text-primary)]">28
                out of 7,450</strong> GSM8K samples loaded successfully, and many of the "ground truth"
                answers were corrupt.
              </p>
              <p>
                The issue was in how the dataset stored answers. Fields were missing, formats were
                inconsistent, and the extraction pipeline silently dropped most samples. We would
                have been evaluating on a statistically meaningless subset.
              </p>
              <p className="text-[var(--accent-primary)]">
                <strong>Fix:</strong> We rebuilt the GSM8K evaluation from scratch using the original
                HuggingFace dataset, parsing the answer field ourselves and validating every sample
                before including it in the test set.
              </p>
            </div>
          </div>

          {/* Pitfall 2 */}
          <div className="my-8 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
            <h3
              className="text-lg font-semibold text-[var(--text-primary)] mb-3"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Answer Extraction Failures
            </h3>
            <div
              className="space-y-4 text-[var(--text-secondary)]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <p>
                The model computed the right answer. Our extractor got the wrong one. This is a
                surprisingly common failure mode in LLM evaluation.
              </p>
              <p>
                The problem: when a model produces a long chain-of-thought response to a math
                problem, it mentions multiple numbers throughout -- intermediate calculations,
                unit conversions, references to the problem statement. Our initial extractor
                simply took the last number in the response, which was often an intermediate
                value or a restated part of the question, not the final answer.
              </p>
              <p className="text-[var(--accent-primary)]">
                <strong>Fix:</strong> We added a structured format instruction -- asking models
                to end their response with <code className="bg-[var(--bg-primary)] px-2 py-0.5 rounded text-sm" style={{ fontFamily: 'var(--font-code)' }}>####
                answer</code> -- and updated the extractor to look for that delimiter first. This
                brought extraction accuracy from ~85% to over 99%.
              </p>
            </div>
          </div>

          {/* Pitfall 3 */}
          <div className="my-8 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
            <h3
              className="text-lg font-semibold text-[var(--text-primary)] mb-3"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Platform-Specific Sandbox Failures
            </h3>
            <div
              className="space-y-4 text-[var(--text-secondary)]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <p>
                Code evaluation benchmarks (HumanEval+, MBPP+) require running generated code in
                a sandbox to check correctness. The standard evaluation tool uses{' '}
                <code className="bg-[var(--bg-primary)] px-2 py-0.5 rounded text-sm" style={{ fontFamily: 'var(--font-code)' }}>RLIMIT_AS</code>{' '}
                to limit memory -- a Linux-specific feature that silently fails on macOS.
              </p>
              <p>
                This meant our local evaluation was running code without memory limits, which
                could give different results from the controlled environment the benchmark expects.
                Tests that should have timed out or been killed for memory exhaustion were passing.
              </p>
              <p className="text-[var(--accent-primary)]">
                <strong>Fix:</strong> We bypassed the sandbox for local development and validated
                against a Linux environment for final numbers. The lesson: always check that your
                evaluation infrastructure actually enforces the constraints it claims to.
              </p>
            </div>
          </div>

          {/* Pitfall 4 */}
          <div className="my-8 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
            <h3
              className="text-lg font-semibold text-[var(--text-primary)] mb-3"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Classifier Blind Spots
            </h3>
            <div
              className="space-y-4 text-[var(--text-secondary)]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <p>
                On BigCodeBench Hard, our initial accuracy was 33.8%. That's low, but the real
                problem wasn't model capability -- it was our difficulty classifier. Tasks
                requiring multi-library integration (combining data processing, numerical
                computation, and machine learning libraries in a single solution) are genuinely
                hard, but our classifier wasn't detecting them as such.
              </p>
              <p>
                Without correctly identifying these tasks as hard, the router would try to route
                them to cheaper models that can't handle the complexity. The classifier was looking
                at surface-level signals (question length, keywords) and missing the structural
                complexity of multi-library coordination.
              </p>
              <p className="text-[var(--accent-primary)]">
                <strong>Fix:</strong> We added multi-library integration as an explicit hard signal
                in the difficulty classifier. If a task requires coordinating across multiple
                specialized libraries, it's hard -- regardless of how simple the prompt looks.
              </p>
            </div>
          </div>
        </section>

        {/* What We Learned About Routing */}
        <section
          ref={learnedRef}
          className={`animate-on-scroll animate-fade-up ${learnedVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            What We Learned About Routing
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              Beyond the mechanical bugs, the benchmark surfaced genuine insights about how
              routing should work. These findings directly shaped our production router design.
            </p>
          </div>

          <div className="my-8 space-y-6">
            {/* Insight 1 */}
            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
              <h3
                className="text-lg font-semibold text-[var(--text-primary)] mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Category classification is less important than you'd think
              </h3>
              <p
                className="text-[var(--text-secondary)]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                75% of GSM8K word problems -- which are math problems by definition -- were
                classified as "simple_chat" by our category classifier, not "math." Why? Because
                they're written in plain English without explicit math keywords. "Sarah has 5
                apples and gives 2 to Tom" doesn't pattern-match to math. But here's the
                thing: the models handled them correctly anyway, because they're easy enough
                that category doesn't matter. This told us that <em className="text-[var(--text-primary)]">difficulty
                estimation matters more than category classification</em> for routing decisions.
              </p>
            </div>

            {/* Insight 2 */}
            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
              <h3
                className="text-lg font-semibold text-[var(--text-primary)] mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                The difficulty estimator is the core of the router
              </h3>
              <p
                className="text-[var(--text-secondary)]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Getting the easy/medium/hard classification right is what determines cost savings.
                If you classify a hard problem as easy and route it to a cheap model, you get a
                bad answer. If you classify an easy problem as hard and route it to a frontier
                model, you waste money. The difficulty estimator is the single highest-leverage
                component in the entire routing pipeline -- more important than model selection,
                category classification, or any other signal.
              </p>
            </div>

            {/* Insight 3 */}
            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
              <h3
                className="text-lg font-semibold text-[var(--text-primary)] mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Multi-library integration is a genuine hard signal
              </h3>
              <p
                className="text-[var(--text-secondary)]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                When a coding task requires coordinating multiple specialized libraries -- data
                processing, numerical computation, machine learning, visualization -- it's reliably
                hard. Not because any single library is complex, but because integrating them
                requires understanding each library's conventions, data formats, and edge cases
                simultaneously. This turned out to be one of our most reliable difficulty signals
                for code-related queries.
              </p>
            </div>

            {/* Insight 4 */}
            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
              <h3
                className="text-lg font-semibold text-[var(--text-primary)] mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Short prompts can still be hard
              </h3>
              <p
                className="text-[var(--text-secondary)]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                "Explain how X works" looks like an easy question. It's concise, it's a single
                sentence, it doesn't have complex formatting. But explaining a concept well --
                with accuracy, appropriate depth, and clear structure -- is a medium-difficulty
                task at minimum. Our initial classifier was using prompt length as a difficulty
                signal, which systematically underestimated these substantive-but-concise queries.
                We recalibrated to treat explanation requests as at least medium difficulty.
              </p>
            </div>
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
            Results
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-8"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              After fixing the evaluation pipeline and incorporating these insights into our
              routing logic, here's how the router performs against a frontier-only baseline
              across standard benchmarks:
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
                {BENCHMARK_DATA.map((row, i) => (
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
                      {row.frontier}
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
              On code benchmarks (HumanEval+, MBPP+), the router actually outperformed the
              frontier baseline by selecting specialized models.
            </p>
          </div>

          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              Average quality retention across all benchmarks: <strong className="text-[var(--text-primary)]">101.4%</strong> of
              the frontier reference. The router preserves quality while selecting cheaper models
              where they perform equally well -- and occasionally finds models that outperform
              the frontier baseline on specific task types.
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
              See the router in action. Send a few queries and watch it select the right model
              for each one -- no signup required.
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

export default HowWeBenchmark;

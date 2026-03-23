import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { setPageMeta, resetPageMeta, setStructuredData, removeStructuredData } from '../../utils/seo';

// Benchmark results from our 9-model evaluation. ShadowRouting.jsx has its own copy of this data.
const BENCHMARK_DATA = [
  { benchmark: 'MMLU', n: 500, router: '86.4%', frontier: '88.0%', vs: '98.2%' },
  { benchmark: 'ARC-Challenge', n: 300, router: '96.7%', frontier: '96.0%', vs: '100.7%' },
  { benchmark: 'GSM8K', n: 100, router: '95.0%', frontier: '95.0%', vs: '100.0%' },
  { benchmark: 'HumanEval+', n: 164, router: '92.1%', frontier: '90.2%', vs: '102.1%' },
  { benchmark: 'MBPP+', n: 378, router: '91.0%', frontier: '86.0%', vs: '105.8%' },
];

const CostQualityMatrix = () => {
  useEffect(() => {
    setPageMeta('We Benchmarked 9 Models: The LLM Cost-Quality Matrix', 'Original benchmark data from 805 scored responses across 9 models. Find which models match frontier quality at a fraction of the cost.', { type: 'article' });
    setStructuredData('ld-article-cost-quality', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'We Benchmarked 9 Models Across 800+ Queries: The LLM Cost-Quality Matrix',
      description: 'Original benchmark data from 805 scored responses across 9 models. Find which models match frontier quality at a fraction of the cost.',
      author: { '@type': 'Organization', name: 'Herma AI' },
      publisher: { '@type': 'Organization', name: 'Herma AI' },
      datePublished: '2026-03-22',
    });
    return () => {
      resetPageMeta();
      removeStructuredData('ld-article-cost-quality');
    };
  }, []);

  const [heroRef, heroVisible] = useScrollAnimation(0.1);
  const [problemRef, problemVisible] = useScrollAnimation(0.1);
  const [methodRef, methodVisible] = useScrollAnimation(0.1);
  const [findingsRef, findingsVisible] = useScrollAnimation(0.1);
  const [insightRef, insightVisible] = useScrollAnimation(0.1);
  const [hermaRef, hermaVisible] = useScrollAnimation(0.1);
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
              Research
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
            We Benchmarked 9 Models Across 800+ Queries: The LLM Cost-Quality Matrix
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-hover)]"></div>
        </header>

        {/* Problem Statement */}
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
              Most teams default to frontier models for everything. It makes sense -- you want the
              best results, and frontier models are the safest bet. But this means paying 10-100x
              more than necessary for the majority of queries.
            </p>
            <p>
              The real question isn't whether cheaper models exist. It's: <em className="text-[var(--text-primary)]">how
              do you know when a cheaper model is "good enough"?</em>
            </p>
            <p>
              To answer that, we ran a systematic benchmark across 9 models spanning the full
              cost spectrum -- from budget models at fractions of a cent per call to frontier
              models at 10-50x the price. We wanted hard numbers, not vibes.
            </p>
          </div>
        </section>

        {/* Methodology */}
        <section
          ref={methodRef}
          className={`animate-on-scroll animate-fade-up ${methodVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Methodology
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              We scored <strong className="text-[var(--text-primary)]">805 responses</strong> across <strong className="text-[var(--text-primary)]">9
              models</strong>, ranging from the cheapest available options to the most capable frontier models.
            </p>
          </div>

          <div className="my-8 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
            <h3
              className="text-lg font-semibold text-[var(--text-primary)] mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Benchmark Design
            </h3>
            <ul
              className="space-y-3 text-[var(--text-secondary)]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <li className="flex items-start gap-3">
                <span className="text-[var(--accent-primary)] mt-1.5 flex-shrink-0">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                <span><strong className="text-[var(--text-primary)]">Quality scoring:</strong> Each response judged on a 1-5 scale across relevance, accuracy, helpfulness, and overall quality</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--accent-primary)] mt-1.5 flex-shrink-0">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                <span><strong className="text-[var(--text-primary)]">Categories tested:</strong> Coding, analysis, creative writing, math, factual Q&A, simple chat</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--accent-primary)] mt-1.5 flex-shrink-0">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                <span><strong className="text-[var(--text-primary)]">Difficulty levels:</strong> Easy, medium, and hard prompts to test where quality degrades</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--accent-primary)] mt-1.5 flex-shrink-0">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                <span><strong className="text-[var(--text-primary)]">Cost spectrum:</strong> Models ranging from $0.0005/call to $0.011/call -- a 22x price difference</span>
              </li>
            </ul>
          </div>

          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              Every model received the same prompts under identical conditions. Responses were
              evaluated by an independent judge model to eliminate human bias. The judge had no
              knowledge of which model produced which response.
            </p>
          </div>
        </section>

        {/* Key Findings */}
        <section
          ref={findingsRef}
          className={`animate-on-scroll animate-fade-up ${findingsVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Key Findings
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-8"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              When we applied intelligent routing -- selecting the most cost-effective model
              per query based on complexity -- the results were striking. Across five standard
              benchmarks, routed performance matched or exceeded the frontier baseline:
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
              The average quality retention across all benchmarks was <strong className="text-[var(--text-primary)]">101.4%</strong> of
              the frontier reference -- meaning the router didn't just preserve quality, it
              marginally improved it by selecting the best-fit model per task.
            </p>
          </div>
        </section>

        {/* The Insight */}
        <section
          ref={insightRef}
          className={`animate-on-scroll animate-fade-up ${insightVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            The Insight
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              You don't need frontier for everything. The data tells a clear story:
            </p>
          </div>

          <div className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
              <div
                className="text-3xl font-bold text-[var(--success)] mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                1/50th
              </div>
              <p
                className="text-sm text-[var(--text-secondary)]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                the cost for simple questions, factual lookups, and routine coding tasks --
                with no measurable quality loss
              </p>
            </div>
            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
              <div
                className="text-3xl font-bold text-[var(--accent-primary)] mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Frontier
              </div>
              <p
                className="text-sm text-[var(--text-secondary)]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                still needed for system design, formal verification, and complex multi-step
                reasoning -- where quality gains justify the cost
              </p>
            </div>
          </div>

          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              The hard problems -- system design, formal verification, complex multi-library
              integration -- still need the best. But those represent a minority of real-world
              API calls. The majority of queries are well within the capability range of models
              that cost a fraction of the price.
            </p>
            <p>
              The key is knowing <em className="text-[var(--text-primary)]">which</em> queries
              can be safely routed to cheaper models. That's the hard part, and it's what our
              benchmark was designed to answer.
            </p>
          </div>
        </section>

        {/* How Herma Uses This */}
        <section
          ref={hermaRef}
          className={`animate-on-scroll animate-fade-up ${hermaVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            How Herma Uses This
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              Herma routes automatically based on query complexity. When a request comes in, our
              router analyzes it and selects the most cost-effective model that will maintain
              frontier-level quality for that specific task.
            </p>
            <p>
              No configuration needed. No model selection dropdowns. No guessing. You send a
              request through the API, and Herma handles the rest.
            </p>
          </div>

          <div className="my-8 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
            <div
              className="text-sm text-[var(--text-tertiary)] mb-3"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Drop-in replacement -- same interface you already use
            </div>
            <div className="bg-[var(--bg-primary)] rounded-lg p-4 overflow-x-auto">
              <pre
                className="text-sm text-[var(--text-secondary)]"
                style={{ fontFamily: 'var(--font-code)' }}
              >
                <code>{`from openai import OpenAI

client = OpenAI(
    base_url="https://api.hermaai.com/v1",
    api_key="your-herma-key"
)

response = client.chat.completions.create(
    model="herma-auto",  # router selects the best model
    messages=[{"role": "user", "content": "Your prompt here"}]
)`}</code>
              </pre>
            </div>
          </div>

          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              Pricing is simple and transparent: <strong className="text-[var(--text-primary)]">$2
              per million input tokens, $8 per million output tokens</strong>. The router saves
              you money by selecting cheaper models when quality allows -- you get the savings
              without any of the complexity.
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
              to="/demo"
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

export default CostQualityMatrix;

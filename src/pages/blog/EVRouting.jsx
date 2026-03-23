import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { setPageMeta, resetPageMeta, setStructuredData, removeStructuredData } from '../../utils/seo';

const EVRouting = () => {
  useEffect(() => {
    setPageMeta(
      'Why AI Routers Fail — And How Expected Value Fixes Them',
      'Most AI routers treat quality as a linear tradeoff. It isn\'t. Here\'s the expected value framework that makes routing safe enough to actually use.',
      { type: 'article' }
    );
    setStructuredData('ld-article-ev-routing', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Why AI Routers Fail — And How Expected Value Fixes Them',
      description: 'Most AI routers treat quality as a linear tradeoff. It isn\'t. Here\'s the expected value framework that makes routing safe enough to actually use.',
      author: { '@type': 'Organization', name: 'Herma AI' },
      publisher: { '@type': 'Organization', name: 'Herma AI' },
      datePublished: '2026-03-22',
    });
    return () => {
      resetPageMeta();
      removeStructuredData('ld-article-ev-routing');
    };
  }, []);

  const [heroRef, heroVisible] = useScrollAnimation(0.1);
  const [graveyardRef, graveyardVisible] = useScrollAnimation(0.1);
  const [evRef, evVisible] = useScrollAnimation(0.1);
  const [confidenceRef, confidenceVisible] = useScrollAnimation(0.1);
  const [flywheelRef, flywheelVisible] = useScrollAnimation(0.1);
  const [diffRef, diffVisible] = useScrollAnimation(0.1);
  const [ctaRef, ctaVisible] = useScrollAnimation(0.1);

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
            Why AI Routers Fail -- And How Expected Value Fixes Them
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-hover)]"></div>
        </header>

        {/* Section 1: The Router Graveyard */}
        <section
          ref={graveyardRef}
          className={`animate-on-scroll animate-fade-up ${graveyardVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            The Router Graveyard
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              LLM routers have a bad track record. The pitch is always the same: "send simple
              queries to cheap models, complex ones to frontier, save 80% on your API bill." It
              sounds reasonable. It almost never works in practice.
            </p>
            <p>
              The core mistake is treating quality as a <em className="text-[var(--text-primary)]">linear
              tradeoff</em>. Router builders think: "10% worse quality for 50% lower cost is a
              good deal." But users don't think this way.
            </p>
            <p>
              Demand for AI quality is a <strong className="text-[var(--text-primary)]">step
              function</strong>, not a curve. Either a user can't tell the difference between
              a cheap response and a frontier response -- in which case they keep using the
              product at the same rate -- or they can tell, and they stop trusting it. There
              is no middle ground where a user accepts "10% worse" and slightly reduces usage.
              They just leave.
            </p>
            <p>
              This means routers that optimize for average quality across queries are optimizing
              the wrong thing. The question is never "what's our average quality?" It's "what's
              our probability of a quality failure on any given query?"
            </p>
          </div>
        </section>

        {/* Section 2: The Expected Value Framework */}
        <section
          ref={evRef}
          className={`animate-on-scroll animate-fade-up ${evVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            The Expected Value Framework
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              Herma routes using <strong className="text-[var(--text-primary)]">expected
              value</strong> -- the same decision framework used in quantitative finance to
              evaluate bets where outcomes are probabilistic. The question is simple: does
              the expected payoff of routing to a cheaper model exceed the expected cost?
            </p>
          </div>

          <div className="my-8 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
            <h3
              className="text-lg font-semibold text-[var(--text-primary)] mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              The EV Formula
            </h3>
            <div className="bg-[var(--bg-primary)] rounded-lg p-4 overflow-x-auto mb-4">
              <pre
                className="text-sm text-[var(--text-secondary)]"
                style={{ fontFamily: 'var(--font-code)' }}
              >
                <code>{`EV(downgrade) =
    P(equivalent) × savings
  - P(not_equivalent) × P(churn | bad_response) × LTV`}</code>
              </pre>
            </div>
            <p
              className="text-sm text-[var(--text-tertiary)] leading-relaxed"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Route to a cheaper model only when EV &gt; 0. If the expected savings don't
              outweigh the expected cost of a quality failure, keep the frontier model.
            </p>
          </div>

          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              With reasonable real-world assumptions, the formula produces a specific
              confidence threshold. Assume a user lifetime value of $100, a 2% churn
              probability per bad response, and per-query savings of $0.01. Plugging in:
            </p>
          </div>

          <div className="my-8 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
            <h3
              className="text-lg font-semibold text-[var(--text-primary)] mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Threshold Derivation
            </h3>
            <div className="bg-[var(--bg-primary)] rounded-lg p-4 overflow-x-auto mb-4">
              <pre
                className="text-sm text-[var(--text-secondary)]"
                style={{ fontFamily: 'var(--font-code)' }}
              >
                <code>{`# Solve for break-even P(equivalent):
# P × $0.01 = (1 - P) × 0.02 × $100
# P × $0.01 = $2.00 - P × $2.00
# P × $2.01 = $2.00
# P ≥ 0.995

# You need 99.5% confidence before downgrading.`}</code>
              </pre>
            </div>
            <p
              className="text-sm text-[var(--text-tertiary)] leading-relaxed"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              <strong className="text-[var(--text-secondary)]">This isn't arbitrary.</strong> The
              99.5% threshold falls directly out of the economics. Change the inputs, and the
              threshold adjusts automatically. The framework generalizes -- it's not a hardcoded
              number someone guessed at.
            </p>
          </div>

          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              The implication is uncomfortable for most routers: you need extremely high
              confidence before a downgrade is economically justified. Not 80%, not 95% --
              closer to 99.5%. The reason is that LTV dwarfs per-query savings. You can't
              make up for losing a user by saving a cent on their queries.
            </p>
          </div>
        </section>

        {/* Section 3: How We Build Confidence */}
        <section
          ref={confidenceRef}
          className={`animate-on-scroll animate-fade-up ${confidenceVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            How We Build Confidence
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              The 99.5% threshold sounds prohibitive until you understand how confidence
              accumulates. We build it through three mechanisms working in parallel.
            </p>
          </div>

          <div className="my-8 space-y-4">
            {[
              {
                step: '1',
                title: 'Shadow comparisons',
                desc: 'For a sample of every request, we call both the frontier model (served to the user) and a cheaper candidate model (background). A quality judge evaluates whether the responses are indistinguishable. The user always gets the frontier response. The comparison is invisible.'
              },
              {
                step: '2',
                title: 'Wilson Score confidence intervals',
                desc: 'We don\'t just track raw pass rates -- we track the statistical lower bound on P(equivalent) using Wilson Score intervals. This means confidence values are conservative: a cell with 20 comparisons and a 100% raw pass rate has a lower confidence bound than a cell with 500 comparisons at the same rate. We only act on what the data actually supports.'
              },
              {
                step: '3',
                title: 'Embedding-based similarity',
                desc: 'Instead of bucketing queries into coarse categories like "coding" or "analysis," we embed each query into a high-dimensional semantic space. A "hello world" coding query and a "implement distributed consensus" coding query are very different. Our confidence estimates are specific to the actual semantics of the query, not a coarse label that groups dissimilar things together.'
              },
              {
                step: '4',
                title: 'Per-user trust balance',
                desc: 'Each user builds a trust balance through successful interactions. A user who has received high-quality responses on hundreds of interactions has demonstrated lower churn risk per individual failure -- the P(churn | bad_response) term shrinks. This means routing freedom scales with relationship depth.'
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
              These mechanisms compound. Shadow comparisons provide the raw data. Wilson
              Score intervals prevent overconfidence from small samples. Embedding-based
              similarity prevents coarse buckets from masking high-variance query subsets.
              Trust balance personalizes the risk calculation to each user. Together, they
              let confidence accumulate at a pace the data actually supports -- no faster.
            </p>
          </div>
        </section>

        {/* Section 4: The Flywheel */}
        <section
          ref={flywheelRef}
          className={`animate-on-scroll animate-fade-up ${flywheelVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            The Flywheel
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              The EV framework isn't just a decision function -- it creates a self-reinforcing
              loop. The longer a user stays, the cheaper they become to serve, which improves
              margins, which funds better models and infrastructure, which keeps quality high,
              which keeps the user.
            </p>
          </div>

          <div className="my-8 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
            <h3
              className="text-lg font-semibold text-[var(--text-primary)] mb-6"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              User Lifecycle
            </h3>
            <div className="space-y-3">
              {[
                {
                  stage: 'New user',
                  desc: 'Starts on frontier models. No routing. Zero quality risk.',
                  accent: false,
                },
                {
                  stage: 'Shadow phase',
                  desc: 'Shadow comparisons run in the background. Confidence accumulates. User still gets frontier responses.',
                  accent: false,
                },
                {
                  stage: 'EV positive',
                  desc: 'Specific query types reach 99.5% confidence. Those queries begin routing to cheaper models. User doesn\'t notice.',
                  accent: true,
                },
                {
                  stage: 'Established user',
                  desc: 'Higher trust balance lowers churn risk. More query types become EV-positive. Serving cost drops significantly.',
                  accent: true,
                },
                {
                  stage: 'Continuous monitoring',
                  desc: 'Any model whose quality drops triggers automatic reversion. Confidence levels adjust in real time.',
                  accent: false,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`flex gap-4 rounded-lg p-4 border ${
                    item.accent
                      ? 'border-[var(--border-accent)] bg-[var(--accent-muted)]'
                      : 'border-[var(--border-primary)] bg-[var(--bg-primary)]'
                  }`}
                >
                  <div className="flex-shrink-0 flex flex-col items-center gap-1">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        item.accent ? 'bg-[var(--accent-primary)]' : 'bg-[var(--border-secondary)]'
                      }`}
                    />
                    {i < 4 && (
                      <div className="w-px flex-1 min-h-[16px] bg-[var(--border-secondary)]" />
                    )}
                  </div>
                  <div className="pb-1">
                    <span
                      className="text-sm font-semibold text-[var(--text-primary)]"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      {item.stage}
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

          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              The critical property here is asymmetry. Quality can never fall below frontier
              -- the system has a hard floor. But cost has a soft ceiling that keeps dropping
              as evidence accumulates. More interactions produce more shadow comparisons,
              which produce more confidence, which unlock cheaper routing for more query
              types. The system gets better without human intervention.
            </p>
          </div>
        </section>

        {/* Section 5: What Makes This Different */}
        <section
          ref={diffRef}
          className={`animate-on-scroll animate-fade-up ${diffVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            What Makes This Different
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-8"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              Most routers rely on heuristics: if the query is short, use the cheap model;
              if it mentions "code," route one way; if it's long, route another. These rules
              degrade quickly outside their training distribution and give users no visibility
              into why they sometimes get worse responses.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: 'Never degrades quality',
                desc: 'Savings emerge only from accumulated statistical evidence. There is no assumed equivalence -- routing only happens when the data proves it safe.'
              },
              {
                title: 'Semantic confidence',
                desc: 'Embedding-based similarity replaces coarse category buckets. Confidence is specific to what the user actually asked, not a broad label that hides variance.'
              },
              {
                title: 'Per-user personalization',
                desc: 'Individual routing profiles adapt to each user\'s usage patterns. Trust builds over time, and the risk calculation reflects each user\'s actual history.'
              },
              {
                title: 'Automatic reversion',
                desc: 'Continuous monitoring compares active model quality against the frontier baseline. Any quality drop triggers immediate reversion -- no manual intervention required.'
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-5"
              >
                <div className="flex items-start gap-3 mb-2">
                  <CheckIcon />
                  <h3
                    className="text-[var(--text-primary)] font-semibold"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {item.title}
                  </h3>
                </div>
                <p
                  className="text-sm text-[var(--text-secondary)] leading-relaxed pl-7"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-accent)] p-6">
            <p
              className="text-sm text-[var(--text-tertiary)] leading-relaxed"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              <strong className="text-[var(--text-secondary)]">The key difference:</strong> Other
              routers ask "which model is cheapest for this category?" Herma asks "what is the
              probability this specific query gets an equivalent response from a cheaper model,
              and does that probability justify the cost risk?" The second question is harder
              to answer but it's the right question.
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
              Try the demo to see the router in action, or read the benchmark post to see
              the cost-quality data the EV framework is built on.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/demo"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[var(--accent-primary)] text-[var(--text-inverse)] font-medium rounded-full shadow-md hover:shadow-lg hover:bg-[var(--accent-hover)] transition-all duration-300 hover:-translate-y-0.5 group"
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
              <Link
                to="/blog/cost-quality-matrix"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-[var(--border-accent)] text-[var(--accent-primary)] font-medium rounded-full hover:bg-[var(--accent-muted)] transition-all duration-300 hover:-translate-y-0.5"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Check the numbers
              </Link>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
};

export default EVRouting;

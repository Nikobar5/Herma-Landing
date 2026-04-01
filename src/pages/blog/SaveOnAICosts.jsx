import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { setPageMeta, resetPageMeta, setStructuredData, removeStructuredData } from '../../utils/seo';

const APPROACHES = [
  {
    name: 'Prompt optimization',
    savings: '15-20%',
    effort: 'High',
    risk: 'Low',
    description:
      "Shorten system prompts, compress few-shot examples, reduce repeated context. Real but limited — once you've trimmed the fat, there's no more to cut. And it doesn't change which model you're running.",
  },
  {
    name: 'Manual model switching',
    savings: '40-60%',
    effort: 'High',
    risk: 'High',
    description:
      "Route cheap queries to cheaper models yourself. Works until it doesn't — you'll miss edge cases, quality will drop unpredictably on your blind spots, and you'll spend ongoing engineering time maintaining routing rules that break when your query distribution shifts.",
  },
  {
    name: 'Intelligent routing',
    savings: '60-90%',
    effort: 'Low',
    risk: 'Low',
    description:
      'Automatic query classification routes each request to the cheapest model that can handle it, with quality validation to catch misroutes before they affect users. One integration, no ongoing maintenance, no silent quality drops.',
  },
];

const ROUTER_CRITERIA = [
  {
    title: 'Published benchmark results',
    description:
      "Any router can claim quality parity. Look for published benchmark data — standardized evals like MMLU, HumanEval, and GSM8K run against both the router output and the frontier baseline you're comparing against. If the numbers aren't published, assume they don't exist.",
  },
  {
    title: 'OpenAI API compatibility',
    description:
      "You should be able to integrate by changing two things: the base URL and your API key. If the router requires a new SDK, a new request schema, or significant code changes, the switching cost will eat your savings — and lock you in.",
  },
  {
    title: 'No vendor lock-in',
    description:
      'A router that ties you to specific upstream models limits your options as the model landscape evolves. Look for routers that work across multiple providers and let you configure the model pool yourself.',
  },
  {
    title: 'Quality validation, not just classification',
    description:
      'Classification tells you which model to route to. Validation tells you whether that choice was right. Shadow routing — running both cheap and frontier models in parallel on a sample of traffic and comparing outputs — catches silent quality drops before they affect users at scale.',
  },
];

const SaveOnAICosts = () => {
  useEffect(() => {
    setPageMeta(
      'How to Save 65% on AI API Costs Without Losing Quality',
      'Three approaches to cutting AI API costs | prompt optimization, manual model switching, and intelligent routing. Real numbers, real tradeoffs, and what actually works in production.',
      { type: 'article' }
    );
    setStructuredData('ld-article-save-ai-costs', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'How to Save 65% on AI API Costs Without Losing Quality',
      description:
        'Three approaches to cutting AI API costs | prompt optimization, manual model switching, and intelligent routing. Real numbers, real tradeoffs, and what actually works in production.',
      author: { '@type': 'Organization', name: 'Herma AI' },
      publisher: { '@type': 'Organization', name: 'Herma AI' },
      datePublished: '2026-03-24',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://hermaai.com/blog/save-on-ai-costs',
      },
    });
    return () => {
      resetPageMeta();
      removeStructuredData('ld-article-save-ai-costs');
    };
  }, []);

  const [heroRef, heroVisible] = useScrollAnimation(0.1);
  const [hookRef, hookVisible] = useScrollAnimation(0.1);
  const [approachesRef, approachesVisible] = useScrollAnimation(0.1);
  const [howRef, howVisible] = useScrollAnimation(0.1);
  const [mathRef, mathVisible] = useScrollAnimation(0.1);
  const [criteriaRef, criteriaVisible] = useScrollAnimation(0.1);
  const [ctaRef, ctaVisible] = useScrollAnimation(0.1);

  const CheckIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
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
            How to Save 65% on AI API Costs Without Losing Quality
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-hover)]"></div>
        </header>

        {/* Hook */}
        <section
          ref={hookRef}
          className={`animate-on-scroll animate-fade-up ${hookVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            You're Probably Paying 60-80% More Than You Need To
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              Most teams building with LLMs make the same mistake: pick a frontier model, route
              everything through it, and accept the bill as the cost of doing business. It's the safe
              choice — frontier models rarely fail, so the product works, the demos look good, and nobody
              asks hard questions about the API spend line.
            </p>
            <p>
              Then the bill lands. And it's 5x what you expected. And your product is growing, which
              means it's going to be 10x next month.
            </p>
            <p>
              Here's the thing: a significant portion of the queries you send to a frontier model{' '}
              <em className="text-[var(--text-primary)]">don't need it</em>. Simple factual lookups,
              summarization, classification, reformatting — these tasks are handled just as well by
              models that cost 80-95% less per token. You're paying for capability you're not using.
            </p>
            <p>
              The question isn't whether you can cut costs — you can. The question is which approach
              gets you the most savings without introducing quality problems you'll regret.
            </p>
          </div>
        </section>

        {/* The 3 Approaches */}
        <section
          ref={approachesRef}
          className={`animate-on-scroll animate-fade-up ${approachesVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            The 3 Approaches to Cutting AI API Costs
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-8"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              There are three real approaches, ordered from least to most savings. The tradeoffs are not
              what most people expect.
            </p>
          </div>

          <div className="space-y-5">
            {APPROACHES.map((approach, i) => (
              <div
                key={approach.name}
                className={`rounded-xl border p-6 ${
                  i === 2
                    ? 'border-[var(--border-accent)] bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)]'
                    : 'border-[var(--border-secondary)] bg-[var(--bg-secondary)]'
                }`}
              >
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <h3
                    className="text-lg font-bold text-[var(--text-primary)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {i + 1}. {approach.name}
                  </h3>
                  <span
                    className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-[var(--success)]/15 text-[var(--success)]"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {approach.savings} savings
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <div
                      className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-1"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      Engineering effort
                    </div>
                    <p
                      className={`font-medium ${
                        approach.effort === 'Low'
                          ? 'text-[var(--success)]'
                          : 'text-[var(--warning)]'
                      }`}
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {approach.effort}
                    </p>
                  </div>
                  <div>
                    <div
                      className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-1"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      Quality risk
                    </div>
                    <p
                      className={`font-medium ${
                        approach.risk === 'Low'
                          ? 'text-[var(--success)]'
                          : 'text-[var(--error)]'
                      }`}
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {approach.risk}
                    </p>
                  </div>
                </div>
                <p
                  className="text-sm text-[var(--text-secondary)] leading-relaxed"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {approach.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How Intelligent Routing Works */}
        <section
          ref={howRef}
          className={`animate-on-scroll animate-fade-up ${howVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            How Intelligent Routing Works
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              The core idea is straightforward: not every query needs a frontier model. A question like
              "what's the capital of France" has the same correct answer whether you ask a $15/M-token
              model or a $0.30/M-token model. Routing is the act of identifying which queries fall into
              which category — automatically, on every request, without you maintaining routing rules
              by hand.
            </p>
            <p>
              A router sits between your application and the model APIs. When a request comes in, it
              classifies the query by difficulty — looking at factors like reasoning complexity, domain
              specificity, required knowledge depth, and whether the task involves multi-step logic.
              Simple queries go to cost-efficient models. Hard queries go to frontier models. The
              threshold adapts based on your quality requirements.
            </p>
          </div>

          <div className="my-8 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
            <div
              className="text-sm text-[var(--text-tertiary)] mb-3"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              From your application's perspective
            </div>
            <div className="bg-[var(--bg-primary)] rounded-lg p-4 overflow-x-auto">
              <pre
                className="text-sm text-[var(--text-secondary)]"
                style={{ fontFamily: 'var(--font-code)' }}
              >
                <code>{`# Before — one line change
client = OpenAI(
    base_url="https://api.openai.com/v1",
    api_key="sk-..."
)

# After — intelligent routing, same API shape
client = OpenAI(
    base_url="https://api.hermaai.com/v1",
    api_key="herma-..."
)

# Everything else stays the same
response = client.chat.completions.create(
    model="herma",
    messages=[{"role": "user", "content": "..."}]
)`}</code>
              </pre>
            </div>
          </div>

          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              The hard part isn't the integration. It's the quality guarantee. How do you know the
              router isn't silently downgrading quality on queries that actually needed the frontier
              model? The answer is shadow routing: run both models in parallel on a sample of traffic,
              compare outputs using a quality judge, and build confidence in the cheaper path before
              fully trusting it. Hard queries always go to frontier — savings come from the large
              portion of your workload that doesn't need it.
            </p>
          </div>
        </section>

        {/* The Math */}
        <section
          ref={mathRef}
          className={`animate-on-scroll animate-fade-up ${mathVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            The Math: 1 Million Tokens Per Month
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-8"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              Concrete numbers make this real. Assume 1M input tokens per month — a moderate API
              workload for a small team with an AI-powered product.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border-secondary)] overflow-hidden mb-8">
            <div className="bg-[var(--bg-secondary)] px-6 py-4 border-b border-[var(--border-secondary)]">
              <h3
                className="text-base font-semibold text-[var(--text-primary)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Monthly cost at 1M input tokens
              </h3>
            </div>
            <div className="divide-y divide-[var(--border-secondary)]">
              <div className="flex items-center justify-between px-6 py-4 bg-[var(--bg-secondary)]">
                <div>
                  <div
                    className="text-sm font-medium text-[var(--text-primary)]"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    Everything routed to frontier
                  </div>
                  <div
                    className="text-xs text-[var(--text-tertiary)] mt-0.5"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    ~$15/M input tokens (frontier tier)
                  </div>
                </div>
                <div
                  className="text-lg font-bold text-[var(--text-primary)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  ~$15.00
                </div>
              </div>
              <div className="flex items-center justify-between px-6 py-4 bg-[var(--bg-secondary)]">
                <div>
                  <div
                    className="text-sm font-medium text-[var(--text-primary)]"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    Everything routed to mid-tier
                  </div>
                  <div
                    className="text-xs text-[var(--text-tertiary)] mt-0.5"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    ~$3/M input tokens — quality degrades on hard tasks
                  </div>
                </div>
                <div
                  className="text-lg font-bold text-[var(--warning)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  ~$3.00
                </div>
              </div>
              <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[var(--bg-secondary)] to-[var(--bg-tertiary)] border-l-2 border-[var(--accent-primary)]">
                <div>
                  <div
                    className="text-sm font-medium text-[var(--text-primary)]"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    Intelligent routing
                  </div>
                  <div
                    className="text-xs text-[var(--text-tertiary)] mt-0.5"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    Models matched to query difficulty — quality maintained
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className="text-lg font-bold text-[var(--success)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    ~$2-6
                  </div>
                  <div
                    className="text-xs text-[var(--accent-primary)]"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    60-87% savings
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              The key point: manual model switching and intelligent routing can hit similar cost numbers,
              but intelligent routing gets there without the quality risk and without ongoing engineering
              maintenance. You're not writing if/else routing rules that break when your query distribution
              shifts. The classifier handles that automatically.
            </p>
            <p>
              At scale, the savings compound quickly. A team spending $5,000/month on frontier APIs can
              realistically cut that to $1,500-2,000 without touching a single prompt or rewriting any
              application logic. That's a $36,000-42,000/year difference from one integration change.
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
            What to Look For in a Router
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-8"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              Not every router delivers on the promise. Some save costs by quietly degrading quality.
              Some require so much configuration that the engineering cost exceeds the savings. Here's
              what separates the ones worth using:
            </p>
          </div>

          <div className="space-y-4">
            {ROUTER_CRITERIA.map((item) => (
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

          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mt-8"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              For a detailed comparison of routers available today, see our{' '}
              <Link to="/blog/best-llm-routers" className="text-[var(--accent-primary)] hover:underline">
                LLM router comparison
              </Link>
              . For the benchmark methodology behind quality claims, see{' '}
              <Link to="/blog/how-we-benchmark" className="text-[var(--accent-primary)] hover:underline">
                how we benchmark AI routers
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
              See your savings estimate
            </h2>
            <p
              className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Send your own prompts through the demo and watch the router select models in real time.
              No signup required — see how it handles your actual query distribution.
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </section>

      </article>
    </main>
  );
};

export default SaveOnAICosts;

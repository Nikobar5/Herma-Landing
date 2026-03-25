import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { setPageMeta, resetPageMeta, setStructuredData, removeStructuredData } from '../../utils/seo';

const PRICING_DATA = [
  {
    model: 'GPT-4o',
    provider: 'OpenAI',
    tier: 'Frontier',
    input: '$2.50',
    output: '$10.00',
    inputNum: 2.5,
    outputNum: 10.0,
    strengths: 'Best general-purpose reasoning, strong code generation, multimodal',
    when: 'Complex reasoning, system design, multi-step analysis',
  },
  {
    model: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    tier: 'Frontier',
    input: '$3.00',
    output: '$15.00',
    inputNum: 3.0,
    outputNum: 15.0,
    strengths: 'Exceptional writing quality, nuanced analysis, long context',
    when: 'Writing, analysis, tasks requiring careful reasoning',
  },
  {
    model: 'Gemini 1.5 Pro',
    provider: 'Google',
    tier: 'Frontier',
    input: '$1.25',
    output: '$5.00',
    inputNum: 1.25,
    outputNum: 5.0,
    strengths: 'Large context window (1M tokens), competitive reasoning, good value frontier',
    when: 'Long document analysis, multimodal tasks, cost-conscious frontier use',
  },
  {
    model: 'GPT-4.1-mini',
    provider: 'OpenAI',
    tier: 'Mid-tier',
    input: '$0.40',
    output: '$1.60',
    inputNum: 0.4,
    outputNum: 1.6,
    strengths: 'Strong coding, good reasoning at fraction of frontier cost',
    when: 'Medium-complexity coding, structured output, API integration',
  },
  {
    model: 'Claude 3.5 Haiku',
    provider: 'Anthropic',
    tier: 'Mid-tier',
    input: '$0.80',
    output: '$4.00',
    inputNum: 0.8,
    outputNum: 4.0,
    strengths: 'Fast, capable writing, good instruction following',
    when: 'Quick analysis, drafting, moderate complexity tasks',
  },
  {
    model: 'Gemini 2.0 Flash',
    provider: 'Google',
    tier: 'Budget',
    input: '$0.10',
    output: '$0.40',
    inputNum: 0.1,
    outputNum: 0.4,
    strengths: 'Extremely fast, very cheap, surprisingly capable for simple tasks',
    when: 'Classification, extraction, simple Q&A, high-volume pipelines',
  },
  {
    model: 'DeepSeek V3',
    provider: 'DeepSeek',
    tier: 'Budget',
    input: '$0.27',
    output: '$1.10',
    inputNum: 0.27,
    outputNum: 1.1,
    strengths: 'Strong math and code at budget pricing, open-weight',
    when: 'Math, coding tasks, batch processing where latency is flexible',
  },
  {
    model: 'Llama 3.1 70B',
    provider: 'Meta (via providers)',
    tier: 'Budget',
    input: '$0.20',
    output: '$0.20',
    inputNum: 0.2,
    outputNum: 0.2,
    strengths: 'Open-source, self-hostable, good general capability',
    when: 'Self-hosted deployments, privacy-sensitive workloads, batch tasks',
  },
];

const WORKLOAD_SCENARIOS = [
  {
    name: 'Balanced Developer',
    description: '40% coding, 30% analysis, 20% chat, 10% math',
    frontierCost: '$420/month',
    routedCost: '$47/month',
    savings: '89%',
  },
  {
    name: 'Heavy Coder',
    description: '70% coding, 15% analysis, 10% chat, 5% math',
    frontierCost: '$580/month',
    routedCost: '$116/month',
    savings: '80%',
  },
  {
    name: 'Early Startup',
    description: '25% coding, 25% chat, 25% analysis, 25% creative',
    frontierCost: '$310/month',
    routedCost: '$28/month',
    savings: '91%',
  },
  {
    name: 'Generalist',
    description: '50% chat, 20% analysis, 15% creative, 15% factual',
    frontierCost: '$250/month',
    routedCost: '$20/month',
    savings: '92%',
  },
];

const LLMPricingComparison = () => {
  useEffect(() => {
    setPageMeta(
      'LLM API Pricing Comparison 2026: What Every Model Actually Costs',
      'Side-by-side LLM API pricing for GPT-4o, Claude 3.5, Gemini, DeepSeek, and Llama. Per-million-token costs, workload estimates, and how intelligent routing cuts your bill by 60-90%.',
      { type: 'article' }
    );
    setStructuredData('ld-article-pricing', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'LLM API Pricing Comparison 2026: What Every Model Actually Costs',
      description: 'Side-by-side LLM API pricing for GPT-4o, Claude 3.5, Gemini, DeepSeek, and Llama. Per-million-token costs and how routing cuts your bill.',
      author: { '@type': 'Organization', name: 'Herma AI' },
      publisher: { '@type': 'Organization', name: 'Herma AI' },
      datePublished: '2026-03-25',
    });
    return () => {
      resetPageMeta();
      removeStructuredData('ld-article-pricing');
    };
  }, []);

  const [heroRef, heroVisible] = useScrollAnimation(0.1);
  const [introRef, introVisible] = useScrollAnimation(0.1);
  const [tableRef, tableVisible] = useScrollAnimation(0.1);
  const [insightsRef, insightsVisible] = useScrollAnimation(0.1);
  const [scenariosRef, scenariosVisible] = useScrollAnimation(0.1);
  const [hiddenRef, hiddenVisible] = useScrollAnimation(0.1);
  const [routingRef, routingVisible] = useScrollAnimation(0.1);
  const [ctaRef, ctaVisible] = useScrollAnimation(0.1);

  const tierColor = (tier) => {
    switch (tier) {
      case 'Frontier':
        return 'bg-red-500/15 text-red-400 border-red-500/30';
      case 'Mid-tier':
        return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30';
      case 'Budget':
        return 'bg-green-500/15 text-green-400 border-green-500/30';
      default:
        return '';
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-16">
      <article className="max-w-[750px] mx-auto px-4 sm:px-6">

        {/* Hero */}
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
            LLM API Pricing Comparison 2026: What Every Model Actually Costs
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-hover)]"></div>
        </header>

        {/* Intro */}
        <section
          ref={introRef}
          className={`animate-on-scroll animate-fade-up ${introVisible ? 'is-visible' : ''} mb-12`}
        >
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              LLM API pricing changes fast. New models drop every few weeks, providers adjust pricing
              tiers, and the gap between "best" and "good enough" keeps shrinking. If you haven't
              re-evaluated your model choices recently, you're probably overpaying.
            </p>
            <p>
              This guide compares the actual per-token costs of the major LLM APIs as of early 2026,
              explains when each model makes sense, and shows how much different workloads actually
              cost in practice — not in theory.
            </p>
            <p>
              The short version: <strong className="text-[var(--text-primary)]">frontier models cost 10-75x more than
              budget alternatives</strong>, and for 60-80% of typical API calls, the cheaper model
              produces identical results.
            </p>
          </div>
        </section>

        {/* Pricing Table */}
        <section
          ref={tableRef}
          className={`animate-on-scroll animate-fade-up ${tableVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            The Pricing Landscape
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-8"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              All prices are per million tokens. Input tokens are what you send; output tokens are what
              the model generates. Most workloads are input-heavy (system prompts, context, documents),
              so input pricing often matters more than output pricing.
            </p>
          </div>

          {/* Model Cards */}
          <div className="space-y-4">
            {PRICING_DATA.map((model) => (
              <div
                key={model.model}
                className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-5"
              >
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <h3
                    className="text-base font-bold text-[var(--text-primary)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {model.model}
                  </h3>
                  <span
                    className="text-xs text-[var(--text-tertiary)]"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {model.provider}
                  </span>
                  <span
                    className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full border ${tierColor(model.tier)}`}
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {model.tier}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div
                      className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-1"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      Input / 1M
                    </div>
                    <p className="text-[var(--text-primary)] font-semibold" style={{ fontFamily: 'var(--font-body)' }}>
                      {model.input}
                    </p>
                  </div>
                  <div>
                    <div
                      className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-1"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      Output / 1M
                    </div>
                    <p className="text-[var(--text-primary)] font-semibold" style={{ fontFamily: 'var(--font-body)' }}>
                      {model.output}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <div
                      className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-1"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      Best For
                    </div>
                    <p className="text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>
                      {model.when}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            className="mt-6 text-sm text-[var(--text-tertiary)] italic"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Prices as of March 2026. Providers change pricing frequently — verify against official
            docs before making infrastructure decisions.
          </div>
        </section>

        {/* Key Insights */}
        <section
          ref={insightsRef}
          className={`animate-on-scroll animate-fade-up ${insightsVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            What the Pricing Table Doesn't Tell You
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              Per-token pricing looks straightforward. It isn't. The real cost of an LLM API depends
              on factors that don't show up in a pricing table.
            </p>
          </div>

          <div className="my-8 space-y-4">
            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
              <h3
                className="text-base font-semibold text-[var(--text-primary)] mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                1. Output tokens cost 2-5x more than input tokens
              </h3>
              <p
                className="text-sm text-[var(--text-secondary)] leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                A query with a 500-token prompt that generates a 2,000-token response is dominated by
                output cost. Models that do chain-of-thought reasoning generate significantly more
                output tokens — sometimes 5-10x the useful content. This makes "thinking" models
                substantially more expensive per useful answer than their pricing suggests.
              </p>
            </div>

            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
              <h3
                className="text-base font-semibold text-[var(--text-primary)] mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                2. System prompts are repeat charges
              </h3>
              <p
                className="text-sm text-[var(--text-secondary)] leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                A 1,000-token system prompt costs you input tokens on every single API call. At 10,000
                calls/day on GPT-4o, that's 10B input tokens/month on system prompts alone — $25,000.
                The same workload on Gemini 2.0 Flash costs $1,000. Same system prompt, same results
                for simple queries, 96% less.
              </p>
            </div>

            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
              <h3
                className="text-base font-semibold text-[var(--text-primary)] mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                3. Multi-turn conversations compound costs
              </h3>
              <p
                className="text-sm text-[var(--text-secondary)] leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Each turn in a conversation resends all previous messages as input. A 10-turn conversation
                doesn't cost 10x a single turn — it costs roughly 55x (1+2+3+...+10) because of the
                growing context window. Agent workflows with 20-30 tool-use turns become extremely
                expensive on frontier models.
              </p>
            </div>

            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
              <h3
                className="text-base font-semibold text-[var(--text-primary)] mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                4. The cheapest model isn't always the cheapest option
              </h3>
              <p
                className="text-sm text-[var(--text-secondary)] leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                If a budget model fails 20% of the time and you have to retry with a frontier model,
                your effective cost is higher than just using the frontier model in the first place.
                Reliability matters. The true cost equation is: <em className="text-[var(--text-primary)]">price per
                token x tokens generated x (1 / success rate)</em>.
              </p>
            </div>
          </div>
        </section>

        {/* Real Workload Costs */}
        <section
          ref={scenariosRef}
          className={`animate-on-scroll animate-fade-up ${scenariosVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            What Real Workloads Actually Cost
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-8"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              We modeled four common workload profiles at 100,000 API calls per month. The "frontier"
              column sends everything to the best model. The "routed" column uses intelligent routing —
              cheap models for easy queries, frontier only when it's genuinely needed.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {WORKLOAD_SCENARIOS.map((scenario) => (
              <div
                key={scenario.name}
                className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6"
              >
                <h3
                  className="text-base font-bold text-[var(--text-primary)] mb-1"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {scenario.name}
                </h3>
                <p
                  className="text-xs text-[var(--text-tertiary)] mb-4"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  {scenario.description}
                </p>

                <div className="flex items-end gap-4">
                  <div>
                    <div
                      className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-1"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      Frontier Only
                    </div>
                    <p
                      className="text-lg font-bold text-red-400 line-through"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {scenario.frontierCost}
                    </p>
                  </div>
                  <div>
                    <div
                      className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-1"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      With Routing
                    </div>
                    <p
                      className="text-lg font-bold text-[var(--accent-primary)]"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {scenario.routedCost}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span
                      className="inline-block px-3 py-1 text-sm font-bold rounded-full bg-green-500/15 text-green-400 border border-green-500/30"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      -{scenario.savings}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            className="mt-6 text-sm text-[var(--text-tertiary)]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Based on{' '}
            <Link to="/blog/cost-quality-matrix" className="text-[var(--accent-primary)] hover:underline">
              our benchmark data
            </Link>{' '}
            from 805 scored responses across 9 models. Quality retention stays above 95% in all
            scenarios.
          </div>
        </section>

        {/* Hidden Costs */}
        <section
          ref={hiddenRef}
          className={`animate-on-scroll animate-fade-up ${hiddenVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            The Hidden Cost: Engineering Time
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              The real expense isn't the API bill — it's what you spend managing models. Every team
              that manually switches between models ends up maintaining:
            </p>
          </div>

          <div className="my-8 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
            <ul
              className="space-y-3 text-[var(--text-secondary)] text-sm"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <li className="flex items-start gap-3">
                <span className="text-red-400 mt-0.5 flex-shrink-0">&bull;</span>
                <span>Routing logic that breaks when query patterns shift</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 mt-0.5 flex-shrink-0">&bull;</span>
                <span>Fallback chains that silently degrade quality</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 mt-0.5 flex-shrink-0">&bull;</span>
                <span>Model-specific prompt templates (what works for GPT-4 doesn't always work for Gemini)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 mt-0.5 flex-shrink-0">&bull;</span>
                <span>Quality monitoring to catch when a cheaper model starts failing on new query types</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 mt-0.5 flex-shrink-0">&bull;</span>
                <span>Re-evaluation every time a new model launches (which is every few weeks now)</span>
              </li>
            </ul>
          </div>

          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              If a senior engineer spends 4 hours/week managing model selection — that's roughly
              $800/week in engineering time. For most teams, <strong className="text-[var(--text-primary)]">the
              engineering cost of manual model management exceeds the API savings</strong>.
            </p>
            <p>
              This is why automated routing exists. Not just to save on API costs, but to eliminate the
              ongoing engineering overhead of model selection entirely.
            </p>
          </div>
        </section>

        {/* Routing Approach */}
        <section
          ref={routingRef}
          className={`animate-on-scroll animate-fade-up ${routingVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            The Routing Alternative
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              Instead of picking one model and accepting the cost, or manually routing and accepting
              the engineering overhead, intelligent routing handles model selection per-query. Each API
              call gets analyzed and sent to the cheapest model that will produce a quality result.
            </p>
            <p>
              The economics are straightforward: if 70% of your queries can be handled by a model
              that costs 10x less, and you can identify those queries accurately, your blended cost
              drops by 60-70% with no quality impact on any individual response.
            </p>
            <p>
              The hard part is the "identify those queries accurately" step. Get it wrong and you
              save money but lose quality. That's why the router needs to be conservative —
              it should only route to a cheaper model when it has high confidence the result will
              match frontier quality. We wrote about the math behind this in our{' '}
              <Link to="/blog/ev-routing" className="text-[var(--accent-primary)] hover:underline">
                expected value routing
              </Link>{' '}
              deep dive.
            </p>
          </div>

          <div className="my-8 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] rounded-xl border border-[var(--border-accent)] p-6">
            <h3
              className="text-base font-semibold text-[var(--text-primary)] mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              How routing changes the pricing equation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <div
                  className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-2"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Without Routing
                </div>
                <p className="text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>
                  Pick one model. Pay its price for everything. Overpay on easy queries, or underperform
                  on hard ones.
                </p>
              </div>
              <div>
                <div
                  className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-2"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Manual Routing
                </div>
                <p className="text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>
                  Write rules to switch models. Save money, but spend engineering time maintaining rules
                  that break as workloads evolve.
                </p>
              </div>
              <div>
                <div
                  className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-2"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Intelligent Routing
                </div>
                <p className="text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>
                  Per-query model selection with quality validation. 60-90% savings, no engineering
                  overhead, quality verified against frontier baselines.
                </p>
              </div>
            </div>
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
              Stop overpaying for every query
            </h2>
            <p
              className="text-[var(--text-secondary)] mb-8 max-w-lg mx-auto"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Herma routes each API call to the cheapest model that matches frontier quality. OpenAI-compatible — change two lines of code.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
              <Link
                to="/blog/cost-quality-matrix"
                className="inline-flex items-center gap-2 px-6 py-3 text-[var(--accent-primary)] font-medium rounded-full border border-[var(--border-accent)] hover:bg-[var(--accent-muted)] transition-all duration-200"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                See the benchmark data
              </Link>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
};

export default LLMPricingComparison;

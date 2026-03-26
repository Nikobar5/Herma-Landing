import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { setPageMeta, resetPageMeta, setStructuredData, removeStructuredData } from '../../utils/seo';

const DECISION_FACTORS = [
  {
    factor: 'Task Complexity',
    description: 'How much reasoning, multi-step logic, or nuance does the task require?',
    frontier: 'Multi-step reasoning, system design, novel code architecture, ambiguous analysis',
    midTier: 'Moderate coding, structured summarization, standard analysis',
    budget: 'Classification, extraction, simple Q&A, format conversion',
  },
  {
    factor: 'Quality Sensitivity',
    description: 'What happens if the answer is slightly wrong or suboptimal?',
    frontier: 'User-facing output, financial decisions, medical/legal advice, production-critical code',
    midTier: 'Internal tools, draft content, code that gets reviewed before shipping',
    budget: 'Batch processing, internal logs, data labeling, throwaway prototypes',
  },
  {
    factor: 'Volume',
    description: 'How many API calls per day/month? Cost scales linearly but quality needs don\'t.',
    frontier: '<1K calls/day where each call matters',
    midTier: '1K-50K calls/day with mixed complexity',
    budget: '50K+ calls/day, high-volume pipelines, pre-processing stages',
  },
  {
    factor: 'Latency',
    description: 'How fast does the response need to arrive?',
    frontier: 'Acceptable for complex tasks where users expect a pause (3-15s)',
    midTier: 'Good balance of speed and capability (1-5s)',
    budget: 'Fastest option for real-time apps, autocomplete, streaming UIs (<1s)',
  },
];

const MODEL_PROFILES = [
  {
    name: 'GPT-4o',
    category: 'Best all-rounder',
    strengths: ['Strongest general reasoning', 'Excellent code generation', 'Multimodal (images, audio)', 'Largest ecosystem and tooling'],
    weaknesses: ['Expensive at scale', 'Occasionally verbose', 'Not always best at creative writing'],
    bestFor: 'Production apps that need reliable, general-purpose intelligence across diverse tasks.',
  },
  {
    name: 'Claude 3.5 Sonnet',
    category: 'Best for writing and analysis',
    strengths: ['Exceptional prose quality', 'Nuanced, careful reasoning', '200K context window', 'Strong instruction following'],
    weaknesses: ['Higher output pricing', 'Slower for simple tasks', 'Smaller tool ecosystem'],
    bestFor: 'Content generation, long document analysis, tasks requiring careful and nuanced reasoning.',
  },
  {
    name: 'Gemini 1.5 Pro',
    category: 'Best for long context',
    strengths: ['1M token context window', 'Competitive reasoning at lower price', 'Native multimodal', 'Good value among frontier models'],
    weaknesses: ['Less consistent on edge cases', 'Smaller developer ecosystem', 'Instruction following can be looser'],
    bestFor: 'Processing entire codebases, long documents, or video/audio. Cost-conscious frontier use.',
  },
  {
    name: 'GPT-4.1-mini',
    category: 'Best mid-tier value',
    strengths: ['Strong coding at 6x less than GPT-4o', 'Good structured output', 'Fast response times', 'Compatible with GPT-4o tooling'],
    weaknesses: ['Struggles with ambiguous prompts', 'Weaker on creative tasks', 'Less reliable for complex multi-step chains'],
    bestFor: 'Medium-complexity coding, API integrations, structured data extraction, internal tools.',
  },
  {
    name: 'Gemini 2.0 Flash',
    category: 'Best budget option',
    strengths: ['Extremely fast (<500ms)', '25x cheaper than GPT-4o', 'Surprisingly good for simple tasks', 'Handles classification and extraction well'],
    weaknesses: ['Falls apart on complex reasoning', 'Inconsistent on nuanced instructions', 'Not suitable for multi-step chains'],
    bestFor: 'High-volume pipelines, classification, extraction, pre-processing, anything where speed and cost dominate.',
  },
  {
    name: 'DeepSeek V3',
    category: 'Best open-weight for math/code',
    strengths: ['Excellent math reasoning', 'Strong coding at budget pricing', 'Open-weight (self-hostable)', 'Competitive with mid-tier on technical tasks'],
    weaknesses: ['Weaker on creative/writing tasks', 'Less polished conversational ability', 'Higher latency via API providers'],
    bestFor: 'Math-heavy applications, code generation in batch, self-hosted deployments where data privacy is critical.',
  },
];

const COMMON_MISTAKES = [
  {
    mistake: 'Using one model for everything',
    why: 'Different tasks have different quality thresholds. Sending a simple "extract the email from this text" query to GPT-4o is like hiring a surgeon to apply a band-aid.',
    fix: 'Match model tier to task complexity. Or use a router to do it automatically.',
  },
  {
    mistake: 'Choosing based on benchmarks alone',
    why: 'Benchmarks test specific academic tasks. Your production queries are different. A model that scores 92% on MMLU might underperform on your specific use case because your prompts, formats, and edge cases don\'t match benchmark conditions.',
    fix: 'Run your own eval on a sample of real production queries. 50-100 examples is enough to spot major gaps.',
  },
  {
    mistake: 'Ignoring the output token multiplier',
    why: 'Models that "think" (chain-of-thought, reasoning traces) generate 5-10x more output tokens than the final useful answer. Your actual cost per useful answer can be 3-5x the listed price.',
    fix: 'Calculate cost per useful answer, not cost per token. Factor in retries and failures.',
  },
  {
    mistake: 'Optimizing too early',
    why: 'At low volume (<1K calls/day), the difference between frontier and budget models is $50-200/month. That\'s less than one hour of engineering time spent optimizing.',
    fix: 'Start with the best model. Optimize when your monthly bill exceeds what you\'d spend on engineering time to reduce it.',
  },
  {
    mistake: 'Not testing the switch',
    why: 'Teams switch models to save money, don\'t measure quality impact, and discover weeks later that output quality degraded. By then, the damage is done.',
    fix: 'Always shadow-test before switching. Run the new model in parallel, compare outputs, only switch when you have data proving quality holds.',
  },
];

const ChooseRightLLM = () => {
  useEffect(() => {
    setPageMeta(
      'How to Choose the Right LLM for Your Use Case (2026 Guide)',
      'A practical framework for choosing the right LLM. Compare GPT-4o, Claude, Gemini, DeepSeek by task type, quality needs, volume, and budget. Stop guessing — use data.',
      { type: 'article' }
    );
    setStructuredData('ld-article-choose-llm', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'How to Choose the Right LLM for Your Use Case (2026 Guide)',
      description: 'A practical framework for choosing the right LLM. Compare GPT-4o, Claude, Gemini, DeepSeek by task type, quality needs, volume, and budget.',
      author: { '@type': 'Organization', name: 'Herma AI' },
      publisher: { '@type': 'Organization', name: 'Herma AI' },
      datePublished: '2026-03-25',
    });
    return () => {
      resetPageMeta();
      removeStructuredData('ld-article-choose-llm');
    };
  }, []);

  const [heroRef, heroVisible] = useScrollAnimation(0.1);
  const [introRef, introVisible] = useScrollAnimation(0.1);
  const [frameworkRef, frameworkVisible] = useScrollAnimation(0.1);
  const [profilesRef, profilesVisible] = useScrollAnimation(0.1);
  const [decisionRef, decisionVisible] = useScrollAnimation(0.1);
  const [mistakesRef, mistakesVisible] = useScrollAnimation(0.1);
  const [realAnswerRef, realAnswerVisible] = useScrollAnimation(0.1);
  const [ctaRef, ctaVisible] = useScrollAnimation(0.1);

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
            How to Choose the Right LLM for Your Use Case
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
              There are more production-ready LLMs available today than at any point in history. GPT-4o, Claude 3.5 Sonnet,
              Gemini 1.5 Pro, DeepSeek V3, Llama 3.1 -- each with different strengths, pricing, and failure modes.
              Picking the wrong one costs you either money (overpaying for capability you don't need) or quality
              (underpaying and getting subpar results).
            </p>
            <p>
              Most "which LLM should I use" guides give you a comparison table and wish you luck. This guide gives
              you a <strong className="text-[var(--text-primary)]">decision framework</strong> -- a systematic way
              to match your specific workload to the right model tier, then the right model within that tier.
            </p>
            <p>
              The short version: <strong className="text-[var(--text-primary)]">the right LLM depends on your task,
              not the model's benchmark scores</strong>. And for most teams, the right answer isn't one model -- it's
              different models for different queries.
            </p>
          </div>
        </section>

        {/* The Framework */}
        <section
          ref={frameworkRef}
          className={`animate-on-scroll animate-fade-up ${frameworkVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            The Four-Factor Decision Framework
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-8"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              Every LLM decision comes down to four variables. Score each one for your use case,
              and the right model tier becomes obvious.
            </p>
          </div>

          <div className="space-y-4">
            {DECISION_FACTORS.map((item, idx) => (
              <div
                key={item.factor}
                className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--accent-muted)] text-[var(--accent-primary)] text-sm font-bold border border-[var(--border-accent)]"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {idx + 1}
                  </span>
                  <h3
                    className="text-base font-bold text-[var(--text-primary)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {item.factor}
                  </h3>
                </div>
                <p
                  className="text-sm text-[var(--text-secondary)] mb-4"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {item.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div className="bg-[var(--bg-tertiary)] rounded-lg p-3">
                    <div
                      className="text-xs font-medium text-red-400 uppercase tracking-wider mb-1"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      Frontier
                    </div>
                    <p className="text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>
                      {item.frontier}
                    </p>
                  </div>
                  <div className="bg-[var(--bg-tertiary)] rounded-lg p-3">
                    <div
                      className="text-xs font-medium text-yellow-400 uppercase tracking-wider mb-1"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      Mid-Tier
                    </div>
                    <p className="text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>
                      {item.midTier}
                    </p>
                  </div>
                  <div className="bg-[var(--bg-tertiary)] rounded-lg p-3">
                    <div
                      className="text-xs font-medium text-green-400 uppercase tracking-wider mb-1"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      Budget
                    </div>
                    <p className="text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>
                      {item.budget}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            className="mt-8 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] rounded-xl border border-[var(--border-accent)] p-6"
          >
            <h3
              className="text-base font-semibold text-[var(--text-primary)] mb-3"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              How to use the framework
            </h3>
            <div
              className="space-y-2 text-sm text-[var(--text-secondary)]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <p>
                Rate each factor as <strong className="text-red-400">High</strong>,{' '}
                <strong className="text-yellow-400">Medium</strong>, or{' '}
                <strong className="text-green-400">Low</strong> for your use case.
              </p>
              <p>
                <strong className="text-[var(--text-primary)]">If any factor rates High</strong> -- use a frontier model for that task.
                One "High" overrides everything else. You can't compensate for quality sensitivity with lower latency.
              </p>
              <p>
                <strong className="text-[var(--text-primary)]">If all factors rate Medium or below</strong> -- a mid-tier model is likely sufficient.
                Test with 50 real examples to confirm.
              </p>
              <p>
                <strong className="text-[var(--text-primary)]">If all factors rate Low</strong> -- use a budget model.
                You're overpaying if you send these queries to anything more expensive.
              </p>
            </div>
          </div>
        </section>

        {/* Model Profiles */}
        <section
          ref={profilesRef}
          className={`animate-on-scroll animate-fade-up ${profilesVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Model-by-Model Breakdown
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-8"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              Once you know which tier you need, here's how the individual models compare.
              We've tested each of these across{' '}
              <Link to="/blog/cost-quality-matrix" className="text-[var(--accent-primary)] hover:underline">
                800+ scored queries
              </Link>{' '}
              -- these assessments come from data, not marketing materials.
            </p>
          </div>

          <div className="space-y-4">
            {MODEL_PROFILES.map((model) => (
              <div
                key={model.name}
                className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6"
              >
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <h3
                    className="text-base font-bold text-[var(--text-primary)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {model.name}
                  </h3>
                  <span
                    className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-[var(--accent-muted)] text-[var(--accent-primary)] border border-[var(--border-accent)]"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {model.category}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <div
                      className="text-xs font-medium text-green-400 uppercase tracking-wider mb-2"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      Strengths
                    </div>
                    <ul className="space-y-1">
                      {model.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-[var(--text-secondary)]">
                          <span className="text-green-400 mt-0.5 flex-shrink-0">+</span>
                          <span style={{ fontFamily: 'var(--font-body)' }}>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div
                      className="text-xs font-medium text-red-400 uppercase tracking-wider mb-2"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      Weaknesses
                    </div>
                    <ul className="space-y-1">
                      {model.weaknesses.map((w, i) => (
                        <li key={i} className="flex items-start gap-2 text-[var(--text-secondary)]">
                          <span className="text-red-400 mt-0.5 flex-shrink-0">-</span>
                          <span style={{ fontFamily: 'var(--font-body)' }}>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-[var(--bg-tertiary)] rounded-lg p-3">
                  <div
                    className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-1"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    Best For
                  </div>
                  <p
                    className="text-sm text-[var(--text-secondary)]"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {model.bestFor}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div
            className="mt-6 text-sm text-[var(--text-tertiary)]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            For current pricing on each model, see our{' '}
            <Link to="/blog/llm-api-pricing-comparison" className="text-[var(--accent-primary)] hover:underline">
              LLM API pricing comparison
            </Link>.
          </div>
        </section>

        {/* Quick Decision Tree */}
        <section
          ref={decisionRef}
          className={`animate-on-scroll animate-fade-up ${decisionVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            The Quick Decision Tree
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-8"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              If you want a fast answer without working through the full framework, here's the simplified version.
            </p>
          </div>

          <div className="space-y-3">
            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-5 flex items-start gap-4">
              <span className="text-2xl flex-shrink-0">Q</span>
              <div>
                <p
                  className="text-sm font-semibold text-[var(--text-primary)] mb-1"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Does the task require multi-step reasoning or novel problem solving?
                </p>
                <p className="text-sm text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>
                  Yes: <strong className="text-red-400">GPT-4o</strong> or <strong className="text-red-400">Claude 3.5 Sonnet</strong>.
                  No: continue.
                </p>
              </div>
            </div>

            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-5 flex items-start gap-4">
              <span className="text-2xl flex-shrink-0">Q</span>
              <div>
                <p
                  className="text-sm font-semibold text-[var(--text-primary)] mb-1"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Does it involve writing, analysis, or processing a long document?
                </p>
                <p className="text-sm text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>
                  Long doc (&gt;100K tokens): <strong className="text-red-400">Gemini 1.5 Pro</strong>.
                  Writing/analysis: <strong className="text-red-400">Claude 3.5 Sonnet</strong>.
                  Neither: continue.
                </p>
              </div>
            </div>

            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-5 flex items-start gap-4">
              <span className="text-2xl flex-shrink-0">Q</span>
              <div>
                <p
                  className="text-sm font-semibold text-[var(--text-primary)] mb-1"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Is it coding or math-focused?
                </p>
                <p className="text-sm text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>
                  Medium complexity: <strong className="text-yellow-400">GPT-4.1-mini</strong>.
                  Budget/batch: <strong className="text-green-400">DeepSeek V3</strong>.
                  Not code/math: continue.
                </p>
              </div>
            </div>

            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-5 flex items-start gap-4">
              <span className="text-2xl flex-shrink-0">Q</span>
              <div>
                <p
                  className="text-sm font-semibold text-[var(--text-primary)] mb-1"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Is it simple and high-volume? (classification, extraction, formatting)
                </p>
                <p className="text-sm text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>
                  Yes: <strong className="text-green-400">Gemini 2.0 Flash</strong>.
                  Everything else: <strong className="text-yellow-400">GPT-4.1-mini</strong> is a safe default.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Common Mistakes */}
        <section
          ref={mistakesRef}
          className={`animate-on-scroll animate-fade-up ${mistakesVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            5 Common Mistakes When Choosing an LLM
          </h2>

          <div className="space-y-4">
            {COMMON_MISTAKES.map((item, idx) => (
              <div
                key={idx}
                className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6"
              >
                <h3
                  className="text-base font-semibold text-[var(--text-primary)] mb-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {idx + 1}. {item.mistake}
                </h3>
                <p
                  className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {item.why}
                </p>
                <div className="bg-[var(--bg-tertiary)] rounded-lg p-3">
                  <p className="text-sm text-[var(--accent-primary)]" style={{ fontFamily: 'var(--font-body)' }}>
                    <strong>Fix:</strong> {item.fix}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* The Real Answer */}
        <section
          ref={realAnswerRef}
          className={`animate-on-scroll animate-fade-up ${realAnswerVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            The Real Answer: You Shouldn't Have to Choose
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              Here's the truth that makes this entire guide somewhat obsolete: the right answer for most
              production workloads isn't "use Model X." It's "use different models for different queries."
            </p>
            <p>
              A typical production workload contains a mix of easy, medium, and hard queries. If 60-70% of your
              queries are simple enough for a budget model, and only 10-20% genuinely need frontier intelligence,
              you're wasting money on every query in between.
            </p>
            <p>
              This is the core idea behind{' '}
              <Link to="/blog/how-llm-routers-work" className="text-[var(--accent-primary)] hover:underline">
                intelligent model routing
              </Link>
              . Instead of picking one model and accepting the tradeoffs, a router analyzes each query and sends it
              to the cheapest model that will produce a quality result. You get frontier quality when you need it and
              budget pricing when you don't.
            </p>
            <p>
              The decision framework above is still useful -- it helps you understand <em>why</em> different queries
              need different models. But executing that logic per-query, at scale, in real-time? That's what routing
              does. Our{' '}
              <Link to="/blog/cost-quality-matrix" className="text-[var(--accent-primary)] hover:underline">
                benchmark data
              </Link>{' '}
              shows this approach retains 95%+ quality while cutting costs by 60-90%.
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
              Let the router choose for you
            </h2>
            <p
              className="text-[var(--text-secondary)] mb-8 max-w-lg mx-auto"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Herma analyzes each query and routes it to the cheapest model that matches frontier quality.
              OpenAI-compatible API -- change two lines of code.
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
                to="/blog/llm-api-pricing-comparison"
                className="inline-flex items-center gap-2 px-6 py-3 text-[var(--accent-primary)] font-medium rounded-full border border-[var(--border-accent)] hover:bg-[var(--accent-muted)] transition-all duration-200"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Compare model pricing
              </Link>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
};

export default ChooseRightLLM;

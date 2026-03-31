import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { setPageMeta, resetPageMeta, setStructuredData, removeStructuredData } from '../../utils/seo';

const ALTERNATIVES = [
  {
    name: 'Claude 3.5 Sonnet (Anthropic)',
    category: 'Best for writing, analysis & long context',
    why: 'Claude consistently matches or beats GPT-4o on writing quality, nuanced reasoning, and instruction following. The 200K context window makes it the go-to for document analysis, and Anthropic\'s focus on safety means fewer refusal edge cases in production.',
    strengths: ['Superior prose and analysis quality', '200K context window (vs 128K for GPT-4o)', 'Better instruction adherence on complex prompts', 'Fewer hallucinations on factual tasks'],
    tradeoffs: ['Smaller ecosystem — fewer third-party integrations', 'Higher output token pricing', 'No native image generation'],
    pricing: 'Input: $3/M tokens. Output: $15/M tokens.',
    bestFor: 'Long document processing, content generation, legal/medical analysis, tasks where nuance matters more than speed.',
    verdict: 'If you\'re using GPT-4o primarily for writing or analysis, Claude is likely better. If you need broad ecosystem support, GPT-4o still has the edge.',
  },
  {
    name: 'Gemini 1.5 Pro (Google)',
    category: 'Best for massive context & multimodal',
    why: 'The 1M token context window is a genuine differentiator — no other frontier model comes close. If your use case involves processing entire codebases, long transcripts, or video, Gemini is the only option that doesn\'t require chunking.',
    strengths: ['1M token context window — 8x larger than GPT-4o', 'Native multimodal (text, images, video, audio)', 'Competitive pricing among frontier models', 'Strong on code and reasoning tasks'],
    tradeoffs: ['Less consistent on edge cases', 'Instruction following can be looser than GPT-4o or Claude', 'Smaller developer ecosystem and tooling', 'Rate limits can be restrictive on free tier'],
    pricing: 'Input: $1.25/M tokens (under 128K). Output: $5/M tokens.',
    bestFor: 'Processing entire repositories, long video/audio transcription + analysis, any workload where context length is the bottleneck.',
    verdict: 'If context length is your constraint, Gemini wins by a wide margin. For general-purpose use, GPT-4o or Claude are more predictable.',
  },
  {
    name: 'DeepSeek V3',
    category: 'Best open-weight model for math & code',
    why: 'DeepSeek V3 punches way above its price class on technical tasks. It matches mid-tier proprietary models on math and coding benchmarks at a fraction of the cost, and being open-weight means you can self-host for complete data control.',
    strengths: ['Excellent math reasoning — competitive with frontier models', 'Strong code generation at budget pricing', 'Open-weight: self-host for data sovereignty', 'MoE architecture keeps inference costs low'],
    tradeoffs: ['Weaker on creative and conversational tasks', 'Higher latency through third-party API providers', 'Less polished instruction following', 'Community support, not enterprise SLAs'],
    pricing: 'Input: $0.27/M tokens. Output: $1.10/M tokens (via API providers). Free to self-host.',
    bestFor: 'Math-heavy applications, batch code generation, self-hosted deployments where data can\'t leave your infrastructure.',
    verdict: 'For technical workloads on a budget, DeepSeek is hard to beat. For production apps needing reliability and polish, stick with proprietary models.',
  },
  {
    name: 'Llama 3.1 405B (Meta)',
    category: 'Best for self-hosted production',
    why: 'Meta\'s largest open model is genuinely competitive with GPT-4o on many tasks. The open license means no per-token costs if you self-host, and the strong community ecosystem provides fine-tuning recipes, quantized variants, and production tooling.',
    strengths: ['Near-frontier quality on reasoning and code', 'Fully open — no per-token API costs when self-hosted', 'Massive community: fine-tuning guides, quantized versions, tooling', 'Multilingual support across 8 languages'],
    tradeoffs: ['Requires significant GPU infrastructure to self-host the full model', 'Quantized versions trade quality for feasibility', 'Slower iteration than proprietary models (quarterly releases)', 'Via API providers, often more expensive than proprietary alternatives'],
    pricing: 'Free to self-host (GPU costs apply). Via API: ~$3/M input, ~$3/M output.',
    bestFor: 'Teams with GPU infrastructure who want to eliminate per-token costs, privacy-sensitive deployments, fine-tuning for domain-specific tasks.',
    verdict: 'If you have the infrastructure, Llama 405B is a strong GPT-4o alternative at zero marginal cost. If you\'re using API providers, the cost advantage evaporates.',
  },
  {
    name: 'GPT-4.1-mini (OpenAI)',
    category: 'Best mid-tier value within OpenAI\'s ecosystem',
    why: 'You don\'t always need to leave OpenAI. GPT-4.1-mini delivers 80-90% of GPT-4o\'s capability at roughly 6x lower cost. If your issue is cost, not vendor, downgrading within OpenAI\'s lineup is the lowest-friction path.',
    strengths: ['Drop-in replacement — same API, same tooling, same SDKs', 'Strong structured output and code generation', 'Fast response times (under 2s for most queries)', '6x cheaper than GPT-4o for mid-complexity tasks'],
    tradeoffs: ['Struggles with ambiguous or highly nuanced prompts', 'Weaker creative writing quality', 'Less reliable in complex multi-step tool-use chains', 'Not suitable for tasks where GPT-4o\'s full reasoning is needed'],
    pricing: 'Input: $0.40/M tokens. Output: $1.60/M tokens.',
    bestFor: 'Internal tools, structured data extraction, medium-complexity coding, any task where GPT-4o is overkill but you want OpenAI compatibility.',
    verdict: 'The easiest "alternative" — no migration, no SDK changes. If 70% of your queries don\'t need frontier reasoning, this alone can cut your bill significantly.',
  },
  {
    name: 'Mistral Large (Mistral AI)',
    category: 'Best European alternative with strong multilingual',
    why: 'Mistral Large is a serious frontier competitor built in Europe. It excels at multilingual tasks and code, has competitive pricing, and for companies with EU data residency requirements, Mistral offers hosting within the European Economic Area.',
    strengths: ['Strong multilingual performance across European languages', 'EU data residency options', 'Competitive coding and reasoning quality', 'Function calling and JSON mode support'],
    tradeoffs: ['Smaller ecosystem than OpenAI or Anthropic', 'Less battle-tested in production at scale', 'Documentation and developer experience still maturing', 'Model versioning can be confusing'],
    pricing: 'Input: $2/M tokens. Output: $6/M tokens.',
    bestFor: 'European companies with data sovereignty requirements, multilingual applications, teams looking for a non-US AI provider.',
    verdict: 'A genuine frontier alternative if you need EU hosting or multilingual strength. For English-only, general-purpose use, GPT-4o and Claude still have the edge.',
  },
  {
    name: 'Gemini 2.0 Flash (Google)',
    category: 'Best ultra-budget option for high volume',
    why: 'If your primary concern is cost and you\'re processing thousands of simple queries, Flash models are in a different price bracket entirely. Gemini 2.0 Flash handles classification, extraction, and formatting at 25x less than GPT-4o.',
    strengths: ['Extremely fast — sub-500ms responses', '25x cheaper than GPT-4o', 'Handles classification, extraction, and simple Q&A well', 'Good enough for pre-processing and data labeling pipelines'],
    tradeoffs: ['Falls apart on complex reasoning', 'Inconsistent on nuanced instructions', 'Not suitable for user-facing applications requiring quality', 'Multi-step chains are unreliable'],
    pricing: 'Input: $0.10/M tokens. Output: $0.40/M tokens.',
    bestFor: 'High-volume pipelines, data labeling, content classification, any task where speed and cost matter more than depth.',
    verdict: 'Not a GPT-4o replacement — it\'s a GPT-4o cost eliminator for the 60-70% of queries that never needed frontier intelligence.',
  },
];

const MIGRATION_CHECKLIST = [
  {
    step: 'Audit your query distribution',
    detail: 'Sample 100 production queries. Categorize each as simple (classification, extraction), medium (standard coding, summarization), or hard (novel reasoning, creative). Most teams discover 60-70% of queries are simple or medium.',
  },
  {
    step: 'Pick 2-3 alternatives based on your mix',
    detail: 'Don\'t switch wholesale. Choose one model for each complexity tier. Example: Gemini Flash for simple, GPT-4.1-mini for medium, Claude for hard.',
  },
  {
    step: 'Shadow test before switching',
    detail: 'Run the alternative model in parallel on real queries. Compare outputs. Only switch when you have data showing quality holds — not benchmarks, your actual use case.',
  },
  {
    step: 'Check API compatibility',
    detail: 'Most alternatives support OpenAI-compatible endpoints. Test tool calling, function schemas, streaming, and structured output. Subtle differences here break production apps.',
  },
  {
    step: 'Monitor after migration',
    detail: 'Quality degradation is often invisible until users complain. Set up automated quality monitoring from day one — even a simple LLM-as-judge pipeline catches regressions early.',
  },
];

const OpenAIAlternatives = () => {
  useEffect(() => {
    setPageMeta(
      '7 Best OpenAI Alternatives for Developers in 2026',
      'A developer\'s guide to the best OpenAI API alternatives. Compare Claude, Gemini, DeepSeek, Llama, Mistral, and more | pricing, tradeoffs, and migration advice.',
      { type: 'article' }
    );
    setStructuredData('ld-article-openai-alternatives', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: '7 Best OpenAI Alternatives for Developers in 2026',
      description: 'A developer\'s guide to the best OpenAI API alternatives. Compare Claude, Gemini, DeepSeek, Llama, Mistral, and more | pricing, tradeoffs, and migration advice.',
      author: { '@type': 'Organization', name: 'Herma AI' },
      publisher: { '@type': 'Organization', name: 'Herma AI' },
      datePublished: '2026-03-25',
    });
    return () => {
      resetPageMeta();
      removeStructuredData('ld-article-openai-alternatives');
    };
  }, []);

  const [heroRef, heroVisible] = useScrollAnimation(0.1);
  const [introRef, introVisible] = useScrollAnimation(0.1);
  const [alternativesRef, alternativesVisible] = useScrollAnimation(0.1);
  const [comparisonRef, comparisonVisible] = useScrollAnimation(0.1);
  const [migrationRef, migrationVisible] = useScrollAnimation(0.1);
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
            7 Best OpenAI Alternatives for Developers in 2026
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
              OpenAI built the best-known LLM API. It's also one of the most expensive. If you're building
              a production application and sending every query to GPT-4o, you're likely overpaying by 60-80%
              for workloads that don't require frontier intelligence.
            </p>
            <p>
              But "switch to a cheaper model" is bad advice without context. Every alternative has
              tradeoffs — in quality, ecosystem, latency, and edge case behavior. This guide breaks down
              the <strong className="text-[var(--text-primary)]">7 best OpenAI alternatives</strong> with
              honest assessments of where each one wins and where it falls short.
            </p>
            <p>
              We've tested these models across{' '}
              <Link to="/blog/cost-quality-matrix" className="text-[var(--accent-primary)] hover:underline">
                800+ scored queries
              </Link>{' '}
              in our benchmark suite. What follows is informed by data, not vendor marketing.
            </p>
          </div>
        </section>

        {/* Alternatives */}
        <section
          ref={alternativesRef}
          className={`animate-on-scroll animate-fade-up ${alternativesVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-8"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            The 7 Best Alternatives, Ranked by Use Case
          </h2>

          <div className="space-y-6">
            {ALTERNATIVES.map((alt, idx) => (
              <div
                key={alt.name}
                className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6"
              >
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--accent-muted)] text-[var(--accent-primary)] text-sm font-bold border border-[var(--border-accent)]"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {idx + 1}
                  </span>
                  <h3
                    className="text-base sm:text-lg font-bold text-[var(--text-primary)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {alt.name}
                  </h3>
                </div>
                <p
                  className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-[var(--accent-muted)] text-[var(--accent-primary)] border border-[var(--border-accent)] mb-4"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  {alt.category}
                </p>

                <p
                  className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed mb-5"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {alt.why}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <div
                      className="text-xs font-medium text-green-400 uppercase tracking-wider mb-2"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      Strengths
                    </div>
                    <ul className="space-y-1">
                      {alt.strengths.map((s, i) => (
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
                      Tradeoffs
                    </div>
                    <ul className="space-y-1">
                      {alt.tradeoffs.map((t, i) => (
                        <li key={i} className="flex items-start gap-2 text-[var(--text-secondary)]">
                          <span className="text-red-400 mt-0.5 flex-shrink-0">-</span>
                          <span style={{ fontFamily: 'var(--font-body)' }}>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="bg-[var(--bg-tertiary)] rounded-lg p-3">
                    <div
                      className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-1"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      Pricing
                    </div>
                    <p
                      className="text-sm text-[var(--text-secondary)]"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {alt.pricing}
                    </p>
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
                      {alt.bestFor}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-secondary)] rounded-lg p-3 border border-[var(--border-secondary)]">
                  <p className="text-sm text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>
                    <strong className="text-[var(--text-primary)]">Verdict:</strong> {alt.verdict}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Comparison Table */}
        <section
          ref={comparisonRef}
          className={`animate-on-scroll animate-fade-up ${comparisonVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Quick Comparison Table
          </h2>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full text-sm border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-[var(--border-secondary)]">
                  <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider" style={{ fontFamily: 'var(--font-ui)' }}>Model</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider" style={{ fontFamily: 'var(--font-ui)' }}>Input $/M</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider" style={{ fontFamily: 'var(--font-ui)' }}>Output $/M</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider" style={{ fontFamily: 'var(--font-ui)' }}>Context</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider" style={{ fontFamily: 'var(--font-ui)' }}>Best Use</th>
                </tr>
              </thead>
              <tbody style={{ fontFamily: 'var(--font-body)' }}>
                <tr className="border-b border-[var(--border-secondary)] bg-[var(--bg-secondary)]">
                  <td className="py-3 px-4 text-[var(--text-primary)] font-medium">GPT-4o (baseline)</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">$2.50</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">$10.00</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">128K</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">General purpose</td>
                </tr>
                <tr className="border-b border-[var(--border-secondary)]">
                  <td className="py-3 px-4 text-[var(--text-primary)] font-medium">Claude 3.5 Sonnet</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">$3.00</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">$15.00</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">200K</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">Writing & analysis</td>
                </tr>
                <tr className="border-b border-[var(--border-secondary)] bg-[var(--bg-secondary)]">
                  <td className="py-3 px-4 text-[var(--text-primary)] font-medium">Gemini 1.5 Pro</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">$1.25</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">$5.00</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">1M</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">Long context</td>
                </tr>
                <tr className="border-b border-[var(--border-secondary)]">
                  <td className="py-3 px-4 text-[var(--text-primary)] font-medium">DeepSeek V3</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">$0.27</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">$1.10</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">128K</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">Math & code</td>
                </tr>
                <tr className="border-b border-[var(--border-secondary)] bg-[var(--bg-secondary)]">
                  <td className="py-3 px-4 text-[var(--text-primary)] font-medium">Llama 3.1 405B</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">~$3.00</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">~$3.00</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">128K</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">Self-hosted</td>
                </tr>
                <tr className="border-b border-[var(--border-secondary)]">
                  <td className="py-3 px-4 text-[var(--text-primary)] font-medium">GPT-4.1-mini</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">$0.40</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">$1.60</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">128K</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">Mid-tier value</td>
                </tr>
                <tr className="border-b border-[var(--border-secondary)] bg-[var(--bg-secondary)]">
                  <td className="py-3 px-4 text-[var(--text-primary)] font-medium">Mistral Large</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">$2.00</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">$6.00</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">128K</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">EU & multilingual</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-[var(--text-primary)] font-medium">Gemini 2.0 Flash</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">$0.10</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">$0.40</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">1M</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">High-volume budget</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p
            className="mt-4 text-sm text-[var(--text-tertiary)]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Pricing as of March 2026. For detailed cost breakdowns with real workload estimates, see our{' '}
            <Link to="/blog/llm-api-pricing-comparison" className="text-[var(--accent-primary)] hover:underline">
              LLM API pricing comparison
            </Link>.
          </p>
        </section>

        {/* Migration Checklist */}
        <section
          ref={migrationRef}
          className={`animate-on-scroll animate-fade-up ${migrationVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            How to Actually Migrate Off OpenAI
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-8"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              Knowing the alternatives is step one. Actually switching without breaking your application
              is step two. Here's the migration checklist we recommend.
            </p>
          </div>

          <div className="space-y-4">
            {MIGRATION_CHECKLIST.map((item, idx) => (
              <div
                key={idx}
                className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6"
              >
                <div className="flex items-start gap-3">
                  <span
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--accent-muted)] text-[var(--accent-primary)] text-sm font-bold border border-[var(--border-accent)] flex-shrink-0 mt-0.5"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <h3
                      className="text-base font-semibold text-[var(--text-primary)] mb-2"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {item.step}
                    </h3>
                    <p
                      className="text-sm text-[var(--text-secondary)] leading-relaxed"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {item.detail}
                    </p>
                  </div>
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
            The Real Answer: Use All of Them
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              Here's what most "OpenAI alternatives" articles won't tell you: picking one alternative
              and switching everything to it is just trading one set of limitations for another.
            </p>
            <p>
              The actual optimal strategy is <strong className="text-[var(--text-primary)]">using different
              models for different queries</strong>. Your production traffic contains a mix of simple,
              medium, and hard queries. Simple classification doesn't need GPT-4o. Complex reasoning
              doesn't work on Gemini Flash. Sending everything to one model means you're either overpaying
              or underperforming on every query that doesn't match that model's sweet spot.
            </p>
            <p>
              This is what{' '}
              <Link to="/blog/how-llm-routers-work" className="text-[var(--accent-primary)] hover:underline">
                intelligent model routing
              </Link>{' '}
              solves. Instead of migrating from OpenAI to one alternative, a router analyzes each query
              and sends it to the cheapest model that will produce a quality result. You get Claude's
              writing quality when the query needs it, Gemini Flash's speed when it doesn't, and GPT-4o's
              reasoning for the hard stuff — all through a single API.
            </p>
            <p>
              Our{' '}
              <Link to="/blog/cost-quality-matrix" className="text-[var(--accent-primary)] hover:underline">
                benchmark data
              </Link>{' '}
              shows this approach retains 95%+ of frontier quality while cutting costs by 60-90%.
              No migration headaches, no vendor lock-in, no quality compromise.
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
              Stop choosing. Start routing.
            </h2>
            <p
              className="text-[var(--text-secondary)] mb-8 max-w-lg mx-auto"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Herma routes each query to the best model for the job — frontier quality when you need it,
              budget pricing when you don't. OpenAI-compatible API, two lines to integrate.
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
                to="/blog/choose-right-llm"
                className="inline-flex items-center gap-2 px-6 py-3 text-[var(--accent-primary)] font-medium rounded-full border border-[var(--border-accent)] hover:bg-[var(--accent-muted)] transition-all duration-200"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                How to choose an LLM
              </Link>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
};

export default OpenAIAlternatives;

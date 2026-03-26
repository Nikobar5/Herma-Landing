import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { setPageMeta, resetPageMeta, setStructuredData, removeStructuredData } from '../../utils/seo';

const COMPARISON_DIMENSIONS = [
  {
    dimension: 'Reasoning & Complex Problem Solving',
    gemini: 'Gemini 2.5 Pro introduced "deep think" mode with native chain-of-thought, producing strong results on graduate-level math, science olympiad problems, and multi-constraint logic. Particularly good at decomposing quantitative problems into steps and showing work.',
    gpt5: 'GPT-5.2 delivers a meaningful leap in multi-step reasoning over GPT-4o. Handles long inferential chains with fewer errors and maintains coherence across extended problem-solving. The o3 reasoning family offers even deeper performance for specialized tasks at higher latency.',
    winner: 'Tie',
    winnerNote: 'Both are frontier-tier reasoners. Gemini 2.5 Pro edges ahead on math and science; GPT-5.2 is more consistent on open-ended logic. Different strengths, comparable ceiling.',
  },
  {
    dimension: 'Code Generation & Editing',
    gemini: 'Gemini 2.5 Pro improved substantially over 1.5 Pro for code. Handles complex implementations well, particularly in Python, JavaScript, and Go. Weaker on targeted edits to existing codebases — tends to regenerate more context than necessary rather than making surgical changes.',
    gpt5: 'GPT-5.2 is a major step up from GPT-4o for code. Better at complete implementations and complex type systems. Improved at understanding existing code context, though still behind Claude on edit precision. Stronger on less common languages and frameworks.',
    winner: 'GPT-5',
    winnerNote: 'GPT-5.2 has a slight edge in code generation breadth and framework support. Gemini 2.5 Pro is competitive but less reliable on targeted edits and niche languages.',
  },
  {
    dimension: 'Writing & Content Quality',
    gemini: 'Gemini 2.5 Pro produces competent, clear prose but tends toward a more neutral, informational tone. Good at technical writing and structured content. Less natural than Claude on creative or brand-voice work — occasionally reads as "textbook-ish" on longer pieces.',
    gpt5: 'GPT-5.2 narrowed the writing gap with Claude significantly. Better paragraph flow, more varied structure, fewer bullet-point defaults than GPT-4o. Still occasionally formulaic on long-form content, but much improved for business and marketing writing.',
    winner: 'GPT-5',
    winnerNote: 'GPT-5.2 has better voice flexibility and handles a wider range of tones. Gemini is solid for technical docs but less polished for customer-facing content.',
  },
  {
    dimension: 'Instruction Following',
    gemini: 'Gemini 2.5 Pro is improved but still the weakest of the three frontier models at strict instruction adherence. More likely to add unsolicited context, reformat output, or miss negative constraints ("don\'t include X"). Adequate for simple-to-moderate prompt complexity.',
    gpt5: 'GPT-5.2 is solid at following structured prompts. Better than Gemini at honoring formatting constraints and multi-requirement prompts. Occasionally adds helpful extras that weren\'t requested, but generally disciplined on well-structured system prompts.',
    winner: 'GPT-5',
    winnerNote: 'GPT-5.2 follows complex multi-constraint prompts more reliably. Gemini 2.5 Pro struggles with strict output control, especially on prompts with 5+ requirements.',
  },
  {
    dimension: 'Multimodal Capabilities',
    gemini: 'This is Gemini\'s strongest differentiator. Native multimodal from the ground up — text, images, video, audio, and code all in one model. Best-in-class video understanding, strong document/chart analysis, and native audio processing. The only frontier model with real video comprehension.',
    gpt5: 'GPT-5.2 has strong multimodal support — image understanding, DALL-E generation, audio input/output, and solid vision. Mature and well-integrated, but treats each modality more as an add-on than a native capability. No real video understanding beyond frame extraction.',
    winner: 'Gemini',
    winnerNote: 'Gemini\'s native multimodal architecture is genuinely better. Video understanding, audio processing, and cross-modal reasoning are clear advantages Google has earned.',
  },
  {
    dimension: 'Tool Use & Agentic Workflows',
    gemini: 'Gemini 2.5 Pro added improved function calling with parallel execution support. Decent at simple tool-use chains but still less reliable than competitors on complex multi-step agent workflows. More prone to hallucinating tool parameters on unfamiliar schemas.',
    gpt5: 'GPT-5.2 improved function calling with better parallel execution and more reliable parameter extraction. Good at moderate tool-use workflows. Still more eager to call tools than necessary, but handles standard agentic patterns well.',
    winner: 'GPT-5',
    winnerNote: 'GPT-5.2 is more reliable on multi-step tool use. Gemini 2.5 Pro is adequate for simple chains but falls behind on complex agentic workflows with 4+ sequential tool calls.',
  },
  {
    dimension: 'Context Window',
    gemini: 'Gemini 2.5 Pro offers up to 1M tokens — the largest context window of any frontier model by a wide margin. Handles entire codebases, book-length documents, and hour-long video transcripts in a single pass. Quality degrades at extreme lengths but remains usable past 500K.',
    gpt5: 'GPT-5.2 offers 128K tokens with improved attention at long context. Adequate for most use cases, but the dramatically smaller window becomes a hard limitation for very long document analysis, large codebases, or any workflow involving hundreds of pages.',
    winner: 'Gemini',
    winnerNote: '1M vs 128K is not close. If your use case involves large documents, full repositories, or long media, Gemini\'s context window is a decisive advantage.',
  },
  {
    dimension: 'Speed & Latency',
    gemini: 'Gemini 2.5 Pro is competitive on speed. Time-to-first-token is fast, and Google\'s infrastructure keeps throughput high. The "Flash" variant (2.5 Flash) is exceptionally fast for a capable model — often the best speed/quality tradeoff available.',
    gpt5: 'GPT-5.2 is fast for a frontier model. Noticeably quicker time-to-first-token than Claude Opus, and streaming feels responsive. Strong infrastructure keeps latency consistent under load.',
    winner: 'Gemini',
    winnerNote: 'Gemini\'s Flash variant is the fastest capable model available. Even the full 2.5 Pro is slightly faster than GPT-5.2 in most regions thanks to Google\'s infrastructure.',
  },
  {
    dimension: 'Hallucination & Factual Accuracy',
    gemini: 'Gemini 2.5 Pro benefits from Google Search grounding — when enabled, it can verify claims against live search results. Without grounding, hallucination rates are comparable to GPT-5.2. With grounding, factual accuracy improves meaningfully, especially on current events.',
    gpt5: 'GPT-5.2 improved factual grounding over GPT-4o but still defaults to confident assertions even on uncertain topics. Better at hedging when prompted, but the default mode is assertive. No native search grounding without explicit tool integration.',
    winner: 'Gemini',
    winnerNote: 'Gemini\'s native search grounding is a real advantage for factual accuracy. Without it, they\'re comparable. With it, Gemini is measurably better on current information.',
  },
  {
    dimension: 'Ecosystem & Integrations',
    gemini: 'Growing ecosystem tied to Google Cloud, Android, and Workspace. Strong Vertex AI integration for enterprise. Native integration with Google\'s search, maps, and productivity tools. Smaller third-party ecosystem than OpenAI, but the Google Cloud tie-in matters for GCP shops.',
    gpt5: 'The largest ecosystem by far. Azure OpenAI, thousands of third-party integrations, ChatGPT plugins, GitHub Copilot. If you need something that plugs into existing enterprise infrastructure with zero friction, OpenAI is still the path of least resistance.',
    winner: 'GPT-5',
    winnerNote: 'OpenAI\'s ecosystem lead is real. Gemini is the better choice if you\'re already in the Google Cloud ecosystem, but OpenAI has broader third-party support.',
  },
];

const PRICING_COMPARISON = [
  { metric: 'Input tokens', gemini: '$1.25/M (2.5 Pro)', gpt5: '$10.00/M', note: 'Gemini is 87.5% cheaper on input' },
  { metric: 'Output tokens', gemini: '$10.00/M (2.5 Pro)', gpt5: '$30.00/M', note: 'Gemini is 67% cheaper on output' },
  { metric: 'Context window', gemini: '1M tokens', gpt5: '128K tokens', note: 'Gemini offers 8x more context' },
  { metric: 'Faster variant', gemini: '2.5 Flash ($0.15/$0.60)', gpt5: 'GPT-4.1-mini ($0.40/$1.60)', note: 'Flash is 63% cheaper' },
  { metric: 'Free tier', gemini: 'Yes (Gemini API)', gpt5: 'No', note: 'Gemini offers free tier with rate limits' },
];

const USE_CASE_VERDICTS = [
  { useCase: 'Video & audio analysis', pick: 'Gemini', why: 'Gemini\'s native video understanding and audio processing are unmatched. The only frontier model that can actually comprehend video content rather than just extracting frames.' },
  { useCase: 'Long document analysis', pick: 'Gemini', why: '1M token context window handles entire books, legal corpora, and large codebases without chunking. GPT-5.2\'s 128K limit forces splitting strategies that lose cross-reference context.' },
  { useCase: 'AI coding assistant', pick: 'GPT-5', why: 'Slightly better code generation breadth across languages and frameworks. Better at understanding complex type systems and producing complete, tested implementations.' },
  { useCase: 'Customer support chatbot', pick: 'Gemini', why: 'Dramatically lower per-token cost means high-volume conversational workloads cost a fraction of GPT-5.2. Flash variant offers excellent speed at even lower prices.' },
  { useCase: 'Autonomous agents', pick: 'GPT-5', why: 'More reliable multi-step tool use and function calling. Better at planning complex action sequences and recovering from errors in agentic workflows.' },
  { useCase: 'Content generation at scale', pick: 'GPT-5', why: 'Better voice flexibility and more natural long-form writing. Handles a wider range of tones and styles. Gemini tends toward a more neutral, informational register.' },
  { useCase: 'Real-time applications', pick: 'Gemini', why: 'Flash variant is the fastest capable model available. For latency-sensitive chat, autocomplete, or streaming use cases, Gemini Flash offers the best speed/quality tradeoff.' },
  { useCase: 'Cost-sensitive production', pick: 'Both', why: 'Route each query to the cheapest model that handles it well. Gemini for context-heavy and cost-sensitive queries, GPT-5 for tool use and content, budget models for simple tasks. Save 60-90%.' },
];

const Gemini25VsGPT5 = () => {
  useEffect(() => {
    setPageMeta(
      'Gemini 2.5 Pro vs GPT-5: Head-to-Head Comparison (2026)',
      'An honest comparison of Google Gemini 2.5 Pro and GPT-5.2 across 10 dimensions. Context window, multimodal, pricing, code, reasoning, and when to use each — with real production data.',
      { type: 'article' }
    );
    setStructuredData('ld-article-gemini-vs-gpt5', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Gemini 2.5 Pro vs GPT-5: Head-to-Head Comparison (2026)',
      description: 'An honest comparison of Google Gemini 2.5 Pro and GPT-5.2 across 10 dimensions. Based on real production routing data.',
      author: { '@type': 'Organization', name: 'Herma AI' },
      publisher: { '@type': 'Organization', name: 'Herma AI' },
      datePublished: '2026-03-25',
    });
    return () => {
      resetPageMeta();
      removeStructuredData('ld-article-gemini-vs-gpt5');
    };
  }, []);

  const [heroRef, heroVisible] = useScrollAnimation(0.1);
  const [introRef, introVisible] = useScrollAnimation(0.1);
  const [comparisonRef, comparisonVisible] = useScrollAnimation(0.1);
  const [pricingRef, pricingVisible] = useScrollAnimation(0.1);
  const [verdictsRef, verdictsVisible] = useScrollAnimation(0.1);
  const [realAnswerRef, realAnswerVisible] = useScrollAnimation(0.1);
  const [ctaRef, ctaVisible] = useScrollAnimation(0.1);

  const winnerColor = (winner) => {
    if (winner.includes('Gemini')) return 'text-blue-400';
    if (winner.includes('GPT')) return 'text-green-400';
    if (winner === 'Both') return 'text-[var(--accent-primary)]';
    return 'text-yellow-400';
  };

  const geminiWins = COMPARISON_DIMENSIONS.filter(d => d.winner.includes('Gemini')).length;
  const gptWins = COMPARISON_DIMENSIONS.filter(d => d.winner.includes('GPT')).length;
  const ties = COMPARISON_DIMENSIONS.filter(d => d.winner === 'Tie').length;

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
              Comparison
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
            Gemini 2.5 Pro vs GPT-5: Head-to-Head Comparison (2026)
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
              Google's Gemini 2.5 Pro and OpenAI's GPT-5.2 represent two fundamentally different bets on
              what makes a great AI model. Google built natively multimodal with the largest context window
              available. OpenAI optimized for ecosystem breadth and developer experience. Both are significantly
              more capable than their predecessors — but they excel at very different things.
            </p>
            <p>
              We've routed production traffic through both models as part of our{' '}
              <Link to="/blog/cost-quality-matrix" className="text-[var(--accent-primary)] hover:underline">
                benchmark suite
              </Link>{' '}
              and intelligent routing system. This comparison is based on real usage patterns across thousands
              of queries, not cherry-picked prompts or synthetic leaderboards.
            </p>
            <p>
              <strong className="text-[var(--text-primary)]">TL;DR:</strong> Gemini 2.5 Pro wins on multimodal,
              context window, speed, price, and factual grounding. GPT-5.2 wins on code, writing, instruction
              following, tool use, and ecosystem. Gemini is the value play — dramatically cheaper with a massive
              context window. GPT-5.2 is the reliability play — more polished for developer workflows and agentic use cases.
            </p>
          </div>
        </section>

        {/* Head-to-Head Comparison */}
        <section
          ref={comparisonRef}
          className={`animate-on-scroll animate-fade-up ${comparisonVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-8"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            10-Dimension Head-to-Head
          </h2>

          <div className="space-y-6">
            {COMPARISON_DIMENSIONS.map((item, idx) => (
              <div
                key={item.dimension}
                className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-3">
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
                      {item.dimension}
                    </h3>
                  </div>
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full border ${
                      item.winner.includes('Gemini')
                        ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                        : item.winner.includes('GPT')
                        ? 'bg-green-500/10 border-green-500/30 text-green-400'
                        : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                    }`}
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {item.winner === 'Tie' ? 'Tie' : `${item.winner} wins`}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div
                      className="text-xs font-medium text-blue-400 uppercase tracking-wider mb-2"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      Gemini 2.5 Pro
                    </div>
                    <p
                      className="text-sm text-[var(--text-secondary)] leading-relaxed"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {item.gemini}
                    </p>
                  </div>
                  <div>
                    <div
                      className="text-xs font-medium text-green-400 uppercase tracking-wider mb-2"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      GPT-5.2
                    </div>
                    <p
                      className="text-sm text-[var(--text-secondary)] leading-relaxed"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {item.gpt5}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-secondary)] rounded-lg p-3 border border-[var(--border-secondary)]">
                  <p className="text-sm text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>
                    <strong className={winnerColor(item.winner)}>Verdict:</strong>{' '}
                    {item.winnerNote}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Scorecard Summary */}
        <section className="mb-12">
          <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
            <h3
              className="text-lg font-bold text-[var(--text-primary)] mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Scorecard
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div
                  className="text-2xl font-bold text-blue-400"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {geminiWins}
                </div>
                <div
                  className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mt-1"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Gemini wins
                </div>
              </div>
              <div>
                <div
                  className="text-2xl font-bold text-yellow-400"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {ties}
                </div>
                <div
                  className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mt-1"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Ties
                </div>
              </div>
              <div>
                <div
                  className="text-2xl font-bold text-green-400"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {gptWins}
                </div>
                <div
                  className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mt-1"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  GPT-5 wins
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Comparison */}
        <section
          ref={pricingRef}
          className={`animate-on-scroll animate-fade-up ${pricingVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Pricing Comparison
          </h2>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full text-sm border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-[var(--border-secondary)]">
                  <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider" style={{ fontFamily: 'var(--font-ui)' }}>Metric</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-blue-400 uppercase tracking-wider" style={{ fontFamily: 'var(--font-ui)' }}>Gemini 2.5 Pro</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-green-400 uppercase tracking-wider" style={{ fontFamily: 'var(--font-ui)' }}>GPT-5.2</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider" style={{ fontFamily: 'var(--font-ui)' }}>Note</th>
                </tr>
              </thead>
              <tbody style={{ fontFamily: 'var(--font-body)' }}>
                {PRICING_COMPARISON.map((row, idx) => (
                  <tr key={row.metric} className={`border-b border-[var(--border-secondary)] ${idx % 2 === 0 ? 'bg-[var(--bg-secondary)]' : ''}`}>
                    <td className="py-3 px-4 text-[var(--text-primary)] font-medium">{row.metric}</td>
                    <td className="py-3 px-4 text-[var(--text-secondary)]">{row.gemini}</td>
                    <td className="py-3 px-4 text-[var(--text-secondary)]">{row.gpt5}</td>
                    <td className="py-3 px-4 text-[var(--text-tertiary)] text-xs">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            className="mt-6 space-y-4 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              The pricing gap is dramatic. For a production workload processing 1M tokens per day
              (50/50 input/output), you're looking at{' '}
              <strong className="text-[var(--text-primary)]">$5.63/day for Gemini 2.5 Pro vs $20/day for GPT-5.2</strong>.
              Over a month, that's a $430 difference — enough to fund an entire additional service.
            </p>
            <p>
              Google has been aggressively pricing Gemini to gain market share, and it shows. The
              Flash variant at $0.15/M input makes high-volume use cases that would be cost-prohibitive
              on GPT-5.2 suddenly viable. For context-heavy workloads that need the 1M token window,
              the math isn't even close.
            </p>
            <p>
              For a detailed breakdown across more models, see our{' '}
              <Link to="/blog/llm-api-pricing-comparison" className="text-[var(--accent-primary)] hover:underline">
                full LLM pricing comparison
              </Link>.
            </p>
          </div>
        </section>

        {/* Use Case Verdicts */}
        <section
          ref={verdictsRef}
          className={`animate-on-scroll animate-fade-up ${verdictsVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Which Should You Pick? Use Case Verdicts
          </h2>

          <div className="space-y-3">
            {USE_CASE_VERDICTS.map((item) => (
              <div
                key={item.useCase}
                className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h3
                    className="text-sm sm:text-base font-bold text-[var(--text-primary)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {item.useCase}
                  </h3>
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full border ${
                      item.pick === 'Gemini'
                        ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                        : item.pick.includes('GPT')
                        ? 'bg-green-500/10 border-green-500/30 text-green-400'
                        : 'bg-[var(--accent-muted)] border-[var(--border-accent)] text-[var(--accent-primary)]'
                    }`}
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {item.pick}
                  </span>
                </div>
                <p
                  className="text-sm text-[var(--text-secondary)] leading-relaxed"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {item.why}
                </p>
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
            The Real Answer: Use Both (Plus Cheaper Models)
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              Here's what every "Gemini vs GPT" article gets wrong: they frame it as a binary choice.
              In practice, the optimal architecture uses multiple models — Gemini for context-heavy
              and multimodal queries, GPT-5 for complex tool use and content generation, and budget
              models for the 60-70% of queries that don't need a frontier model at all.
            </p>
            <p>
              A "summarize this document" query doesn't need GPT-5.2 at $30/M output. A quick
              classification task doesn't need Gemini 2.5 Pro's 1M context window. You're burning
              money every time you send a simple query to a frontier model —{' '}
              <strong className="text-[var(--text-primary)]">and the savings from intelligent routing are 60-90%</strong>.
            </p>
            <p>
              This is what{' '}
              <Link to="/blog/how-llm-routers-work" className="text-[var(--accent-primary)] hover:underline">
                intelligent model routing
              </Link>{' '}
              does automatically. Each query is classified by complexity and type, matched to the
              cheapest model that can handle it, and quality-validated through{' '}
              <Link to="/blog/shadow-routing" className="text-[var(--accent-primary)] hover:underline">
                shadow comparisons
              </Link>{' '}
              to catch misroutes. You get Gemini when you need multimodal or massive context, GPT-5
              when you need precise tool use, and budget models for everything else — without writing
              routing logic or worrying about quality.
            </p>
            <p>
              Our{' '}
              <Link to="/blog/cost-quality-matrix" className="text-[var(--accent-primary)] hover:underline">
                benchmark data
              </Link>{' '}
              shows this approach retains 95%+ of frontier quality while cutting costs by 60-90%.
              Instead of picking one model, use all of them — routed intelligently.
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
              Stop choosing between Gemini and GPT — use both
            </h2>
            <p
              className="text-[var(--text-secondary)] mb-8 max-w-lg mx-auto"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Herma routes each query to the best model for the job. Gemini for multimodal and long context,
              GPT-5 for tool use and content, budget models for simple tasks. OpenAI-compatible API, two lines to integrate.
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
                to="/blog/gpt-5-vs-claude-opus"
                className="inline-flex items-center gap-2 px-6 py-3 text-[var(--accent-primary)] font-medium rounded-full border border-[var(--border-accent)] hover:bg-[var(--accent-muted)] transition-all duration-200"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Compare GPT-5 vs Claude Opus
              </Link>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
};

export default Gemini25VsGPT5;

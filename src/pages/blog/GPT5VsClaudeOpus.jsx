import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { setPageMeta, resetPageMeta, setStructuredData, removeStructuredData } from '../../utils/seo';

const COMPARISON_DIMENSIONS = [
  {
    dimension: 'Reasoning & Complex Problem Solving',
    claude: 'Opus 4 is Anthropic\'s strongest reasoning model. Extended thinking mode lets it spend extra tokens on chain-of-thought before answering, producing notably better results on math proofs, multi-constraint logic, and scientific analysis. Particularly strong when problems require decomposition into subproblems.',
    gpt5: 'GPT-5.2 brings a significant leap in multi-step reasoning over GPT-4o. Handles long inferential chains with fewer errors and maintains coherence across extended problem-solving sessions. The o3 family offers even deeper reasoning for specialized tasks at higher latency.',
    winner: 'Tie',
    winnerNote: 'Both are frontier-tier. Opus 4 has extended thinking; GPT-5.2 has raw speed on reasoning tasks. Different strengths, comparable ceiling.',
  },
  {
    dimension: 'Code Generation & Editing',
    claude: 'The Claude family dominates developer tooling. Sonnet 4.6 powers most AI coding assistants, and Opus 4 handles the hardest refactoring and architecture tasks. Exceptional at understanding existing codebases, making targeted edits, and producing clean, well-tested code.',
    gpt5: 'GPT-5.2 is a major improvement over GPT-4o for code. Better at generating complete implementations and handling complex type systems. Still trails Claude on edit precision — more likely to rewrite entire files when a targeted change would suffice.',
    winner: 'Claude Opus',
    winnerNote: 'Claude\'s lead in code quality and edit precision has widened. Sonnet 4.6 for daily coding, Opus 4 for architecture-level work.',
  },
  {
    dimension: 'Writing & Content Quality',
    claude: 'Opus 4 produces the most natural, human-sounding prose of any model. Excellent at maintaining voice consistency, varying sentence structure, and avoiding the telltale "AI voice." Particularly strong on long-form content, creative writing, and brand-specific tone.',
    gpt5: 'GPT-5.2 narrowed the writing gap significantly. Less formulaic than GPT-4o, with better paragraph flow and fewer bullet-point defaults. Still occasionally falls into recognizable AI patterns on longer pieces, but much improved for business and technical writing.',
    winner: 'Claude Opus',
    winnerNote: 'Claude\'s writing advantage is smaller than it was against GPT-4o, but still clear. For content that needs to sound human, Opus 4 is the better choice.',
  },
  {
    dimension: 'Instruction Following',
    claude: 'Best-in-class at following complex, multi-constraint prompts. Opus 4 rarely drops requirements, even with 10+ constraints in a single prompt. Exceptional at honoring negative constraints ("don\'t do X") and format specifications. System prompts are followed precisely.',
    gpt5: 'Improved over GPT-4o but still more likely to add unsolicited extras or deviate from strict formatting on complex prompts. Better at simple-to-moderate instruction complexity. More prone to "helpfully" including things you didn\'t ask for.',
    winner: 'Claude Opus',
    winnerNote: 'Claude\'s instruction discipline is its clearest competitive advantage. If your use case requires precise output control, this matters.',
  },
  {
    dimension: 'Multimodal Capabilities',
    claude: 'Opus 4 supports image and PDF input with strong document understanding and chart interpretation. No native image generation. Vision is solid but not the primary differentiator.',
    gpt5: 'GPT-5.2 has the most mature multimodal stack — native image understanding, DALL-E integration, audio input/output, and strong visual reasoning. Better at complex visual tasks and offers more modality options out of the box.',
    winner: 'GPT-5',
    winnerNote: 'OpenAI\'s multimodal breadth is unmatched. If your application involves image generation or audio, GPT-5.2 wins clearly.',
  },
  {
    dimension: 'Tool Use & Agentic Workflows',
    claude: 'The clear leader for agentic AI. Opus 4 excels at multi-step tool-use chains, knows when NOT to call a tool, and rarely hallucinates parameters. The extended thinking mode helps it plan complex tool-use sequences. Best model for autonomous agent tasks.',
    gpt5: 'GPT-5.2 improved function calling with better parallel execution and more reliable parameter extraction. Still more likely to call tools eagerly when a direct answer would work. Less reliable than Claude in long agentic chains with 5+ tool calls.',
    winner: 'Claude Opus',
    winnerNote: 'For multi-step agentic workflows, Claude is the production standard. GPT-5.2 is fine for simple tool use but falls behind on complex chains.',
  },
  {
    dimension: 'Context Window',
    claude: 'Opus 4 offers 200K tokens — enough for entire codebases, book-length documents, or hundreds of pages of legal text in a single pass. Maintains quality even at high context utilization.',
    gpt5: 'GPT-5.2 offers 128K tokens with improved attention at long context lengths. Adequate for most use cases, but the 36% smaller window becomes a limitation for very long document analysis.',
    winner: 'Claude Opus',
    winnerNote: '200K vs 128K. Matters most for code review, legal analysis, and research synthesis where truncation loses critical context.',
  },
  {
    dimension: 'Speed & Latency',
    claude: 'Opus 4 is slower — the cost of deeper reasoning. Expect 2-4x the latency of GPT-5.2 on complex queries. Sonnet 4.6 is competitive on speed, but Opus itself is not a speed model. Extended thinking adds even more latency.',
    gpt5: 'GPT-5.2 is meaningfully faster for interactive use cases. Time-to-first-token is noticeably quicker, and streaming feels more responsive. The speed advantage is most pronounced on medium-complexity queries.',
    winner: 'GPT-5',
    winnerNote: 'GPT-5.2 wins on speed by a significant margin. For real-time chat and latency-sensitive applications, this matters a lot.',
  },
  {
    dimension: 'Hallucination & Factual Accuracy',
    claude: 'Opus 4 has the lowest hallucination rate of any frontier model. More likely to say "I\'m not confident" than fabricate an answer. Anthropic\'s focus on honesty and calibrated uncertainty is measurable in production.',
    gpt5: 'GPT-5.2 improved factual grounding substantially over GPT-4o but still tends toward confident-sounding assertions, even on uncertain topics. Better at hedging when prompted to, but the default mode is more assertive than Claude.',
    winner: 'Claude Opus',
    winnerNote: 'Claude is measurably better calibrated — it knows what it doesn\'t know. For applications where false confidence is dangerous, this is the deciding factor.',
  },
  {
    dimension: 'Ecosystem & Integrations',
    claude: 'Growing rapidly with strong developer adoption. Clean API, good documentation, native MCP (Model Context Protocol) support for tool integrations. Smaller ecosystem than OpenAI but closing the gap in developer tooling.',
    gpt5: 'Still the largest ecosystem. Azure OpenAI, thousands of third-party integrations, ChatGPT plugins, GitHub Copilot. If you need something that plugs into existing enterprise infrastructure with zero friction, OpenAI is the path of least resistance.',
    winner: 'GPT-5',
    winnerNote: 'OpenAI\'s ecosystem lead is real but narrowing. For enterprise environments with existing OpenAI contracts, GPT-5.2 has lower switching costs.',
  },
];

const PRICING_COMPARISON = [
  { metric: 'Input tokens', claude: '$15.00/M (Opus)', gpt5: '$10.00/M', note: 'GPT-5.2 is 33% cheaper on input' },
  { metric: 'Output tokens', claude: '$75.00/M (Opus)', gpt5: '$30.00/M', note: 'GPT-5.2 is 60% cheaper on output' },
  { metric: 'Context window', claude: '200K', gpt5: '128K', note: 'Claude offers 56% more context' },
  { metric: 'Faster variant', claude: 'Sonnet 4.6 ($3/$15)', gpt5: 'GPT-5.2 ($10/$30)', note: 'Sonnet is 70% cheaper' },
  { metric: 'Budget variant', claude: 'Haiku 4.5 ($0.80/$4)', gpt5: 'GPT-4.1-mini ($0.40/$1.60)', note: 'Mini wins on price; Haiku wins on quality' },
];

const USE_CASE_VERDICTS = [
  { useCase: 'AI coding assistant', pick: 'Claude', why: 'Opus 4 for architecture decisions, Sonnet 4.6 for daily coding. Edit precision and code quality are consistently better across benchmarks.' },
  { useCase: 'Customer support chatbot', pick: 'GPT-5', why: 'Faster response times, larger integration ecosystem, lower per-token cost for high-volume conversational workloads.' },
  { useCase: 'Content generation at scale', pick: 'Claude', why: 'Writing quality is noticeably more natural. Fewer "AI tells" in output, better voice consistency across long documents.' },
  { useCase: 'Document analysis', pick: 'Claude', why: '200K context window handles full documents without chunking. Stronger instruction following for structured extraction tasks.' },
  { useCase: 'Autonomous agents', pick: 'Claude', why: 'Opus 4 is the production standard for multi-step agentic workflows. More reliable tool use, better planning, fewer hallucinated actions.' },
  { useCase: 'Multimodal applications', pick: 'GPT-5', why: 'Native image generation, audio support, and the most mature vision pipeline. More modalities, more flexibility.' },
  { useCase: 'Enterprise deployment', pick: 'GPT-5', why: 'Azure OpenAI integration, enterprise compliance certifications, established procurement relationships. Lower organizational friction.' },
  { useCase: 'Cost-sensitive production', pick: 'Both', why: 'Route each query to the cheapest model that handles it well. Budget models for 60-70% of queries, frontier for the rest. Save 60-90% without quality loss.' },
];

const GPT5VsClaudeOpus = () => {
  useEffect(() => {
    setPageMeta(
      'GPT-5 vs Claude Opus 4: Which Frontier Model Wins in 2026?',
      'An honest comparison of GPT-5.2 and Claude Opus 4 across 10 dimensions. Reasoning, code, writing, speed, pricing, and when to use each. Based on real production routing data.',
      { type: 'article' }
    );
    setStructuredData('ld-article-gpt5-vs-claude-opus', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'GPT-5 vs Claude Opus 4: Which Frontier Model Wins in 2026?',
      description: 'An honest comparison of GPT-5.2 and Claude Opus 4 across 10 dimensions. Based on real production routing data.',
      author: { '@type': 'Organization', name: 'Herma AI' },
      publisher: { '@type': 'Organization', name: 'Herma AI' },
      datePublished: '2026-03-25',
    });
    return () => {
      resetPageMeta();
      removeStructuredData('ld-article-gpt5-vs-claude-opus');
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
    if (winner.includes('Claude')) return 'text-purple-400';
    if (winner.includes('GPT')) return 'text-green-400';
    if (winner === 'Both') return 'text-[var(--accent-primary)]';
    return 'text-yellow-400';
  };

  const claudeWins = COMPARISON_DIMENSIONS.filter(d => d.winner.includes('Claude')).length;
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
            GPT-5 vs Claude Opus 4: Which Frontier Model Wins in 2026?
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
              GPT-5.2 and Claude Opus 4 represent the current ceiling of what language models can do. Both
              are significantly more capable than their predecessors, and both come with significantly higher
              price tags. The question developers are asking isn't "are these good" — it's "which one do I
              put in production, and is it worth the premium?"
            </p>
            <p>
              We've routed thousands of queries through both models as part of our{' '}
              <Link to="/blog/cost-quality-matrix" className="text-[var(--accent-primary)] hover:underline">
                benchmark suite
              </Link>{' '}
              and production routing system. This comparison is based on real usage patterns, not cherry-picked
              prompts or synthetic benchmarks.
            </p>
            <p>
              <strong className="text-[var(--text-primary)]">TL;DR:</strong> Claude Opus 4 wins on code,
              writing, instruction following, tool use, and factual accuracy. GPT-5.2 wins on speed, multimodal
              capabilities, and ecosystem. Claude is the better model for most developer tasks; GPT-5.2 is the
              better model for latency-sensitive and enterprise deployments.
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
                      item.winner.includes('Claude')
                        ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
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
                      className="text-xs font-medium text-purple-400 uppercase tracking-wider mb-2"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      Claude Opus 4
                    </div>
                    <p
                      className="text-sm text-[var(--text-secondary)] leading-relaxed"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {item.claude}
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
                  className="text-2xl font-bold text-purple-400"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {claudeWins}
                </div>
                <div
                  className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mt-1"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Claude wins
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
                  <th className="text-left py-3 px-4 text-xs font-medium text-purple-400 uppercase tracking-wider" style={{ fontFamily: 'var(--font-ui)' }}>Claude Opus 4</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-green-400 uppercase tracking-wider" style={{ fontFamily: 'var(--font-ui)' }}>GPT-5.2</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider" style={{ fontFamily: 'var(--font-ui)' }}>Note</th>
                </tr>
              </thead>
              <tbody style={{ fontFamily: 'var(--font-body)' }}>
                {PRICING_COMPARISON.map((row, idx) => (
                  <tr key={row.metric} className={`border-b border-[var(--border-secondary)] ${idx % 2 === 0 ? 'bg-[var(--bg-secondary)]' : ''}`}>
                    <td className="py-3 px-4 text-[var(--text-primary)] font-medium">{row.metric}</td>
                    <td className="py-3 px-4 text-[var(--text-secondary)]">{row.claude}</td>
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
              The pricing gap is substantial. For a production workload processing 1M tokens per day
              (50/50 input/output), you're looking at{' '}
              <strong className="text-[var(--text-primary)]">$45/day for Claude Opus vs $20/day for GPT-5.2</strong>.
              Over a month, that's a $750 difference — real money for a startup.
            </p>
            <p>
              But most of your traffic doesn't need a frontier model at all. The harder question is whether
              you need Opus or GPT-5.2 for more than 10-20% of your queries. For the rest, models like
              Claude Sonnet or GPT-4.1-mini can handle the work at a fraction of the cost.
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
                      item.pick === 'Claude'
                        ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
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
            The Real Answer: You Don't Need Frontier for Everything
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              Here's the insight that every "GPT-5 vs Claude" article misses: for 60-70% of production
              queries, neither model is the right choice. A "summarize this email" query doesn't need a
              $75/M-output model. A quick factual lookup doesn't need Opus-level reasoning. You're burning
              money on every query that could be handled by a model costing 10-50x less.
            </p>
            <p>
              The optimal strategy isn't picking one frontier model — it's{' '}
              <strong className="text-[var(--text-primary)]">using the right model for each query</strong>.
              Route simple tasks to budget models, medium complexity to Sonnet or GPT-4.1-mini, and reserve
              Opus or GPT-5.2 for the genuinely hard problems. The cost difference between this approach and
              sending everything to a single frontier model is 60-90%.
            </p>
            <p>
              This is what{' '}
              <Link to="/blog/how-llm-routers-work" className="text-[var(--accent-primary)] hover:underline">
                intelligent model routing
              </Link>{' '}
              does automatically. Each query is classified by complexity, matched to the cheapest model that
              can handle it, and quality-validated through{' '}
              <Link to="/blog/shadow-routing" className="text-[var(--accent-primary)] hover:underline">
                shadow comparisons
              </Link>{' '}
              to catch misroutes. You get Opus when you need it, GPT-5.2 when speed matters, and budget
              models for everything else — without manual routing logic or quality degradation.
            </p>
            <p>
              Our{' '}
              <Link to="/blog/cost-quality-matrix" className="text-[var(--accent-primary)] hover:underline">
                benchmark data
              </Link>{' '}
              shows this approach retains 95%+ of frontier quality while cutting costs by 60-90%. Instead
              of choosing between GPT-5 and Claude, use both — plus cheaper models — routed intelligently.
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
              Stop overpaying for frontier on every query
            </h2>
            <p
              className="text-[var(--text-secondary)] mb-8 max-w-lg mx-auto"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Herma routes each query to the best model for the job. Opus for hard reasoning, GPT-5 for speed,
              budget models for simple tasks. OpenAI-compatible API, two lines to integrate.
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
                to="/blog/claude-vs-gpt-4o"
                className="inline-flex items-center gap-2 px-6 py-3 text-[var(--accent-primary)] font-medium rounded-full border border-[var(--border-accent)] hover:bg-[var(--accent-muted)] transition-all duration-200"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Compare Claude vs GPT-4o
              </Link>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
};

export default GPT5VsClaudeOpus;

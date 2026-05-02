import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { setPageMeta, resetPageMeta, setStructuredData, removeStructuredData } from '../../utils/seo';

const COMPARISON_DIMENSIONS = [
  {
    dimension: 'Reasoning & Problem Solving',
    claude: 'Excels at multi-step reasoning with transparent chains of thought. Tends to break complex problems into sub-parts naturally. Particularly strong on tasks requiring careful analysis of constraints or edge cases.',
    gpt4o: 'Strong general reasoning with broad coverage. Better at rapid pattern matching and analogical reasoning. GPT-4o tends to give direct answers faster, sometimes at the expense of showing its work.',
    winner: 'Tie',
    winnerNote: 'Different styles, comparable depth. Claude is more methodical; GPT-4o is more direct.',
  },
  {
    dimension: 'Code Generation',
    claude: 'Produces clean, well-documented code with strong error handling. Particularly good at understanding existing codebases and making targeted edits. Sonnet 3.5 is the model of choice for many coding assistants.',
    gpt4o: 'Broad language coverage and strong on boilerplate generation. Better ecosystem integration with GitHub Copilot. Tends to generate more code per turn, sometimes including unnecessary additions.',
    winner: 'Claude',
    winnerNote: 'Sonnet 3.5 has become the default for most AI coding tools for a reason — code quality and edit precision are consistently stronger.',
  },
  {
    dimension: 'Writing Quality',
    claude: 'This is Claude\'s strongest domain. Produces natural, nuanced prose with good variety in sentence structure. Better at maintaining a specific voice or tone across long outputs. Less likely to fall into robotic patterns.',
    gpt4o: 'Competent but more formulaic. Tends toward a recognizable "AI voice" — bullet points, em dashes, and hedging qualifiers. Adequate for business writing, weaker on creative or brand-specific content.',
    winner: 'Claude',
    winnerNote: 'Not close. Claude\'s writing quality is noticeably more human, with less of the telltale AI style.',
  },
  {
    dimension: 'Instruction Following',
    claude: 'Excellent at following complex, multi-constraint instructions. Rarely ignores parts of a prompt. Better at honoring negative constraints ("don\'t do X") and format specifications.',
    gpt4o: 'Good at simple instructions but occasionally drops constraints on complex prompts. More likely to add unsolicited information or deviate from format requirements. Stronger when instructions are concise.',
    winner: 'Claude',
    winnerNote: 'Claude is more disciplined about following exactly what was asked. GPT-4o is more likely to "helpfully" add things you didn\'t request.',
  },
  {
    dimension: 'Multimodal (Vision)',
    claude: 'Supports image input with solid understanding of charts, screenshots, and documents. No image generation capability. Vision is competent but not a primary focus.',
    gpt4o: 'Native multimodal from the ground up — image input, DALL-E integration for generation, and strong visual reasoning. Better at complex visual tasks like diagram interpretation.',
    winner: 'GPT-4o',
    winnerNote: 'GPT-4o\'s multimodal capabilities are more mature and versatile, especially with image generation.',
  },
  {
    dimension: 'Tool Use & Function Calling',
    claude: 'Reliable function calling with good parameter extraction. Better at deciding when NOT to call a tool. Less likely to hallucinate parameters. Particularly strong in agentic multi-step tool-use chains.',
    gpt4o: 'Broader tool ecosystem and faster iteration on function calling features. Parallel function calling support. Can be overeager — sometimes calls tools when a direct answer would suffice.',
    winner: 'Tie',
    winnerNote: 'Both are production-ready. Claude is more conservative (fewer false positives). GPT-4o has more features (parallel calls).',
  },
  {
    dimension: 'Context Window',
    claude: '200K tokens — enough to process entire codebases, long legal documents, or book-length content in a single pass.',
    gpt4o: '128K tokens — large but 36% smaller than Claude. For most use cases this is sufficient, but it becomes a real limitation with very long documents.',
    winner: 'Claude',
    winnerNote: '200K vs 128K. Matters most for long-document analysis, code review, and research synthesis.',
  },
  {
    dimension: 'Speed & Latency',
    claude: 'Sonnet is competitive on speed. Opus (the more powerful variant) is significantly slower — often 2-3x GPT-4o\'s response time for complex queries.',
    gpt4o: 'Generally faster, especially on shorter queries. Streaming feels more responsive. The speed gap narrows on complex, long-output tasks.',
    winner: 'GPT-4o',
    winnerNote: 'GPT-4o is meaningfully faster for interactive use cases. The gap matters most in chat and real-time applications.',
  },
  {
    dimension: 'Hallucination Rate',
    claude: 'Lower hallucination rate on factual queries. More likely to say "I\'m not sure" rather than fabricate. Anthropic\'s focus on honesty is measurable here.',
    gpt4o: 'Slightly more prone to confident-sounding hallucinations, especially on niche topics. Better at hedging when prompted to, but the default behavior is more assertive.',
    winner: 'Claude',
    winnerNote: 'Claude is measurably more calibrated — it\'s more honest about uncertainty.',
  },
  {
    dimension: 'Ecosystem & Integrations',
    claude: 'Growing but smaller ecosystem. API is clean and well-documented. Fewer third-party integrations. No native browser or plugin system.',
    gpt4o: 'Largest ecosystem in the industry. ChatGPT plugins, Copilot integration, Azure OpenAI, thousands of third-party tools. If you need something that "just works" with existing infrastructure, OpenAI is the safe bet.',
    winner: 'GPT-4o',
    winnerNote: 'Not even close on ecosystem size. OpenAI\'s first-mover advantage in integrations is still commanding.',
  },
];

const PRICING_COMPARISON = [
  { metric: 'Input tokens', claude: '$3.00/M', gpt4o: '$2.50/M', note: 'GPT-4o is 17% cheaper on input' },
  { metric: 'Output tokens', claude: '$15.00/M', gpt4o: '$10.00/M', note: 'GPT-4o is 33% cheaper on output' },
  { metric: 'Context window', claude: '200K', gpt4o: '128K', note: 'Claude offers 56% more context' },
  { metric: 'Cheaper variant', claude: 'Haiku ($0.80/$4)', gpt4o: 'GPT-4.1-mini ($0.40/$1.60)', note: 'Mini is ~2x cheaper than Haiku' },
];

const USE_CASE_VERDICTS = [
  { useCase: 'Production coding assistant', pick: 'Claude Sonnet', why: 'Better code quality, edit precision, and instruction following for development workflows.' },
  { useCase: 'Content generation at scale', pick: 'Claude Sonnet', why: 'Writing quality is noticeably more natural. Less "AI voice" in outputs.' },
  { useCase: 'Customer-facing chatbot', pick: 'GPT-4o', why: 'Faster response times, better ecosystem support, more mature function calling for integrations.' },
  { useCase: 'Document analysis (long)', pick: 'Claude Sonnet', why: '200K context window handles full documents without chunking. Better at following extraction instructions.' },
  { useCase: 'Multimodal application', pick: 'GPT-4o', why: 'Native vision + generation. More versatile for image-heavy workflows.' },
  { useCase: 'Agentic workflows', pick: 'Claude Sonnet', why: 'More reliable tool use, better at multi-step chains, less hallucination on tool parameters.' },
  { useCase: 'Quick prototyping', pick: 'GPT-4o', why: 'Faster responses, larger ecosystem, more examples and tutorials available.' },
  { useCase: 'Cost-sensitive production', pick: 'Neither', why: 'Use both. Route simple queries to a budget model and reserve frontier models for hard tasks. Save 60-90%.' },
];

const ClaudeVsGPT4o = () => {
  useEffect(() => {
    setPageMeta(
      'Claude vs GPT-4o: Head-to-Head Comparison (2026)',
      'An honest comparison of Claude 3.5 Sonnet and GPT-4o across 10 dimensions. Coding, writing, reasoning, pricing, speed, and when to use each — backed by real testing.',
      { type: 'article' }
    );
    setStructuredData('ld-article-claude-vs-gpt4o', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Claude vs GPT-4o: Head-to-Head Comparison (2026)',
      description: 'An honest comparison of Claude 3.5 Sonnet and GPT-4o across 10 dimensions. Coding, writing, reasoning, pricing, speed, and when to use each.',
      author: { '@type': 'Organization', name: 'Herma AI' },
      publisher: { '@type': 'Organization', name: 'Herma AI' },
      datePublished: '2026-03-25',
    });
    return () => {
      resetPageMeta();
      removeStructuredData('ld-article-claude-vs-gpt4o');
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
    if (winner === 'Claude') return 'text-purple-400';
    if (winner === 'GPT-4o') return 'text-green-400';
    return 'text-yellow-400';
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
            Claude vs GPT-4o: Head-to-Head Comparison (2026)
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
              Claude and GPT-4o are the two models most developers are actually choosing between in 2026.
              Not in the abstract "which AI is best" sense, but in the practical "which one do I put in
              production" sense.
            </p>
            <p>
              Most comparison articles recite benchmark scores that don't reflect real usage. This one
              doesn't. We've tested both models extensively across our{' '}
              <Link to="/blog/cost-quality-matrix" className="text-[var(--accent-primary)] hover:underline">
                800+ query benchmark suite
              </Link>{' '}
              and seen how they perform in production routing across thousands of queries. Here's what
              actually matters.
            </p>
            <p>
              <strong className="text-[var(--text-primary)]">TL;DR:</strong> Claude is better at writing,
              coding, and instruction following. GPT-4o is faster, cheaper, and has a bigger ecosystem.
              Neither is universally better — the right choice depends on your specific use case.
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
                      item.winner === 'Claude'
                        ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                        : item.winner === 'GPT-4o'
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
                      Claude 3.5 Sonnet
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
                      GPT-4o
                    </div>
                    <p
                      className="text-sm text-[var(--text-secondary)] leading-relaxed"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {item.gpt4o}
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
                  5
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
                  2
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
                  3
                </div>
                <div
                  className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mt-1"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  GPT-4o wins
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
                  <th className="text-left py-3 px-4 text-xs font-medium text-purple-400 uppercase tracking-wider" style={{ fontFamily: 'var(--font-ui)' }}>Claude 3.5 Sonnet</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-green-400 uppercase tracking-wider" style={{ fontFamily: 'var(--font-ui)' }}>GPT-4o</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider" style={{ fontFamily: 'var(--font-ui)' }}>Note</th>
                </tr>
              </thead>
              <tbody style={{ fontFamily: 'var(--font-body)' }}>
                {PRICING_COMPARISON.map((row, idx) => (
                  <tr key={row.metric} className={`border-b border-[var(--border-secondary)] ${idx % 2 === 0 ? 'bg-[var(--bg-secondary)]' : ''}`}>
                    <td className="py-3 px-4 text-[var(--text-primary)] font-medium">{row.metric}</td>
                    <td className="py-3 px-4 text-[var(--text-secondary)]">{row.claude}</td>
                    <td className="py-3 px-4 text-[var(--text-secondary)]">{row.gpt4o}</td>
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
              GPT-4o is cheaper on both input and output tokens. For a balanced workload processing 1M
              tokens per day (50/50 input/output), that's roughly{' '}
              <strong className="text-[var(--text-primary)]">$3.75/day for GPT-4o vs $5.40/day for Claude</strong>{' '}
              — a 30% difference.
            </p>
            <p>
              But pricing alone doesn't determine cost. If Claude's stronger instruction following means
              fewer retries, or if its writing quality eliminates a human editing step, the per-token
              premium can pay for itself. The question isn't "which is cheaper per token" but "which is
              cheaper per successful output."
            </p>
            <p>
              For a detailed breakdown across more models and workload types, see our{' '}
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
                      item.pick.includes('Claude')
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
            The Real Answer: Stop Picking One
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              Here's the insight that most "Claude vs GPT-4o" articles miss: the question itself is wrong.
              Your production traffic is a mix of easy, medium, and hard queries. Sending everything to one
              frontier model means you're either overpaying on the easy stuff or underperforming on the
              hard stuff.
            </p>
            <p>
              The optimal strategy is{' '}
              <strong className="text-[var(--text-primary)]">using both, plus cheaper models, routed
              intelligently</strong>. A "what's the capital of France" query doesn't need a $10/M-output
              model. A complex code refactoring task does. The difference in cost between routing these
              correctly versus sending everything to GPT-4o is 60-90%.
            </p>
            <p>
              This is what{' '}
              <Link to="/blog/how-llm-routers-work" className="text-[var(--accent-primary)] hover:underline">
                intelligent model routing
              </Link>{' '}
              does. Instead of committing to one model, a router analyzes each query's complexity and
              routes it to the cheapest model that will produce a quality result. You get Claude's writing
              when the query needs nuance, GPT-4o's speed when responsiveness matters, and a budget model
              for the 60-70% of queries that don't need frontier intelligence at all.
            </p>
            <p>
              Our{' '}
              <Link to="/blog/cost-quality-matrix" className="text-[var(--accent-primary)] hover:underline">
                benchmark data
              </Link>{' '}
              shows this approach retains 95%+ of frontier quality while cutting costs by 60-90%. No vendor
              lock-in, no quality compromise, and you get the best of both Claude and GPT-4o without paying
              frontier prices for everything.
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
              Why pick one when you can use both?
            </h2>
            <p
              className="text-[var(--text-secondary)] mb-8 max-w-lg mx-auto"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Herma routes each query to the best model for the job — Claude for writing, GPT-4o for speed,
              budget models for simple tasks. OpenAI-compatible API, two lines to integrate.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
              <Link
                to="/blog/openai-alternatives"
                className="inline-flex items-center gap-2 px-6 py-3 text-[var(--accent-primary)] font-medium rounded-full border border-[var(--border-accent)] hover:bg-[var(--accent-muted)] transition-all duration-200"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Explore all alternatives
              </Link>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
};

export default ClaudeVsGPT4o;

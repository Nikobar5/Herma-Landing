import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { setPageMeta, resetPageMeta, setStructuredData, removeStructuredData } from '../../utils/seo';

const AgenticRouting = () => {
  useEffect(() => {
    setPageMeta(
      'LLM Routing for Agentic AI: Why Single-Turn Routers Fail',
      'Agentic AI workflows break traditional LLM routers. Multi-turn tool use, context persistence, and error recovery demand a different routing strategy.',
      { type: 'article' }
    );
    setStructuredData('ld-article-agentic-routing', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'LLM Routing for Agentic AI: Why Single-Turn Routers Fail',
      description: 'Agentic AI workflows break traditional LLM routers. Multi-turn tool use, context persistence, and error recovery demand a different routing strategy.',
      author: { '@type': 'Organization', name: 'Herma AI' },
      publisher: { '@type': 'Organization', name: 'Herma AI' },
      datePublished: '2026-03-24',
    });
    return () => {
      resetPageMeta();
      removeStructuredData('ld-article-agentic-routing');
    };
  }, []);

  const [heroRef, heroVisible] = useScrollAnimation(0.1);
  const [problemRef, problemVisible] = useScrollAnimation(0.1);
  const [whyRef, whyVisible] = useScrollAnimation(0.1);
  const [patternsRef, patternsVisible] = useScrollAnimation(0.1);
  const [approachRef, approachVisible] = useScrollAnimation(0.1);
  const [lessonsRef, lessonsVisible] = useScrollAnimation(0.1);
  const [ctaRef, ctaVisible] = useScrollAnimation(0.1);

  const CheckIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );

  const XIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
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
            LLM Routing for Agentic AI: Why Single-Turn Routers Fail
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-hover)]"></div>
        </header>

        {/* The Problem */}
        <section
          ref={problemRef}
          className={`animate-on-scroll animate-fade-up ${problemVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            The Routing Gap Nobody Talks About
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              Every LLM router on the market treats routing as a single-turn classification problem:
              a query comes in, the router picks a model, the model responds. Done.
            </p>
            <p>
              This works fine for chatbots and one-shot API calls. But the fastest-growing segment of
              LLM usage isn't single-turn — it's <strong className="text-[var(--text-primary)]">agentic
              workflows</strong>. AI agents that use tools, maintain context across dozens of turns, and
              recover from errors autonomously.
            </p>
            <p>
              When you route an agentic workflow the same way you route a chat message, things break
              in ways that are hard to debug and expensive to fix.
            </p>
          </div>
        </section>

        {/* Why Single-Turn Fails */}
        <section
          ref={whyRef}
          className={`animate-on-scroll animate-fade-up ${whyVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Why Single-Turn Routing Breaks in Agentic Contexts
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-8"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              We discovered these failure modes the hard way — by routing agentic workloads through
              our standard classifier and watching the results.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
              <h3
                className="text-lg font-semibold text-[var(--text-primary)] mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                1. Tool-use requires structured output reliability
              </h3>
              <p
                className="text-[var(--text-secondary)] leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                When a model calls a tool, it must produce correctly formatted JSON function calls.
                Budget models that score well on general benchmarks often fail silently on tool use —
                they generate malformed arguments, hallucinate tool names, or wrap the call in markdown
                instead of producing valid JSON. A single malformed tool call can crash an entire
                agent loop.
              </p>
            </div>

            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
              <h3
                className="text-lg font-semibold text-[var(--text-primary)] mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                2. Context accumulates across turns
              </h3>
              <p
                className="text-[var(--text-secondary)] leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                In a 20-turn agent session, each turn builds on the last. The model needs to
                remember what tools it called, what results came back, what it decided, and what it's
                planning next. Switching to a cheaper model mid-session means that model needs to
                reconstruct the entire reasoning chain from the conversation history — and smaller
                models are worse at this kind of long-context reasoning.
              </p>
            </div>

            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
              <h3
                className="text-lg font-semibold text-[var(--text-primary)] mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                3. Error recovery demands reasoning depth
              </h3>
              <p
                className="text-[var(--text-secondary)] leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Agents hit errors. API calls fail, files don't exist, permissions are denied. Frontier
                models recover gracefully — they try alternative approaches, decompose the problem
                differently, or ask clarifying questions. Budget models tend to retry the same failing
                approach or hallucinate a workaround that makes things worse.
              </p>
            </div>

            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
              <h3
                className="text-lg font-semibold text-[var(--text-primary)] mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                4. The first turn sets the trajectory
              </h3>
              <p
                className="text-[var(--text-secondary)] leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                An agent's first response typically sets the plan — which tools to use, in what order,
                and what the success criteria are. If a budget model creates a bad plan on turn 1,
                every subsequent turn executes that bad plan. The cost of a wrong first turn compounds
                across the entire session.
              </p>
            </div>
          </div>
        </section>

        {/* Routing Patterns */}
        <section
          ref={patternsRef}
          className={`animate-on-scroll animate-fade-up ${patternsVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Routing Patterns That Actually Work
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-8"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              After running agentic benchmarks (including <Link to="/blog/how-we-benchmark" className="text-[var(--accent-primary)] hover:underline">our
              own evaluation suite</Link>), we identified three routing patterns that preserve quality
              in multi-turn agent workflows:
            </p>
          </div>

          <div className="my-8 grid grid-cols-1 gap-4">
            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-accent)] p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[var(--accent-primary)] flex-shrink-0">
                  <CheckIcon />
                </span>
                <h3
                  className="text-lg font-bold text-[var(--text-primary)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Frontier-first, then downgrade
                </h3>
              </div>
              <p
                className="text-sm text-[var(--text-secondary)] leading-relaxed ml-7"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Use the strongest model for the first turn (planning + tool selection), then route
                subsequent turns to cheaper models once the plan is established and the agent
                is executing known steps. This captures 80%+ of the savings while protecting the
                critical planning phase.
              </p>
            </div>

            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-accent)] p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[var(--accent-primary)] flex-shrink-0">
                  <CheckIcon />
                </span>
                <h3
                  className="text-lg font-bold text-[var(--text-primary)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Tool-use floor
                </h3>
              </div>
              <p
                className="text-sm text-[var(--text-secondary)] leading-relaxed ml-7"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Set a minimum model capability tier for any turn that involves tool calls. In our
                testing, mid-tier models handle tool execution well, but budget models
                don't. The floor prevents the router from sending tool-use turns to models that
                will produce malformed calls.
              </p>
            </div>

            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-accent)] p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[var(--accent-primary)] flex-shrink-0">
                  <CheckIcon />
                </span>
                <h3
                  className="text-lg font-bold text-[var(--text-primary)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Session-aware routing
                </h3>
              </div>
              <p
                className="text-sm text-[var(--text-secondary)] leading-relaxed ml-7"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Don't classify each turn independently. Track the session state — turn number,
                tools available, error count, context length. A turn that follows a failed tool call
                should be routed to a stronger model than a turn that follows a successful one.
              </p>
            </div>
          </div>

          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              And here's what <em className="text-[var(--text-primary)]">doesn't</em> work:
            </p>
          </div>

          <div className="my-8 grid grid-cols-1 gap-4">
            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[var(--error)] flex-shrink-0">
                  <XIcon />
                </span>
                <h3
                  className="text-base font-semibold text-[var(--text-primary)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Per-turn independent classification
                </h3>
              </div>
              <p
                className="text-sm text-[var(--text-secondary)] leading-relaxed ml-7"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Treating each turn as a standalone query ignores the session context. A follow-up
                question like "now run the tests" looks simple in isolation, but in context it might
                require complex multi-file reasoning.
              </p>
            </div>

            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[var(--error)] flex-shrink-0">
                  <XIcon />
                </span>
                <h3
                  className="text-base font-semibold text-[var(--text-primary)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Routing by token count alone
                </h3>
              </div>
              <p
                className="text-sm text-[var(--text-secondary)] leading-relaxed ml-7"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Long contexts don't always mean hard problems. An agent session might have 50K tokens
                of context but the current turn is a simple "write this to a file." Conversely, a
                short prompt with tool definitions can be the hardest reasoning challenge in the session.
              </p>
            </div>
          </div>
        </section>

        {/* Our Approach */}
        <section
          ref={approachRef}
          className={`animate-on-scroll animate-fade-up ${approachVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            How Herma Routes Agentic Workloads
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              Our router applies all three patterns automatically. When it detects an agentic
              context — tool definitions in the request, multi-turn conversation history, or system
              prompts that indicate agent behavior — it switches from standard query classification
              to agentic routing:
            </p>
          </div>

          <div className="my-8 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-secondary)] p-6">
            <div
              className="text-sm text-[var(--text-tertiary)] mb-3"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Agentic routing logic (simplified)
            </div>
            <div className="bg-[var(--bg-primary)] rounded-lg p-4 overflow-x-auto">
              <pre
                className="text-sm text-[var(--text-secondary)]"
                style={{ fontFamily: 'var(--font-code)' }}
              >
                <code>{`if request.has_tools:
    if turn == 1:
        # Planning turn — use frontier
        route_to(frontier_model)
    elif previous_turn.had_error:
        # Error recovery — use frontier
        route_to(frontier_model)
    else:
        # Execution turn — use mid-tier (floor)
        route_to(mid_tier_model)
else:
    # Standard routing
    route_by_query_complexity(request)`}</code>
              </pre>
            </div>
          </div>

          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              The result: agentic workloads maintain frontier-level reliability on the turns that
              matter, while execution turns — which make up the majority of an agent session — route
              to models that cost a fraction of the price.
            </p>
            <p>
              In our benchmarks, this approach achieves <strong className="text-[var(--text-primary)]">80%
              cost savings on agentic workflows</strong> while preserving the error recovery and tool-use
              reliability that makes agents actually useful.
            </p>
          </div>
        </section>

        {/* Lessons */}
        <section
          ref={lessonsRef}
          className={`animate-on-scroll animate-fade-up ${lessonsVisible ? 'is-visible' : ''} mb-12`}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            What This Means for the Router Market
          </h2>
          <div
            className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p>
              The <a href="https://arxiv.org/abs/2510.00202" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-primary)] hover:underline">RouterArena
              benchmark</a> (2025) evaluated 12 routers across 8,400 queries and found that no existing
              router consistently recognizes when cheaper models are sufficient. That finding was based
              on single-turn evaluation.
            </p>
            <p>
              In agentic contexts, the problem is worse. Not only do routers need to assess query
              complexity — they need to assess <em className="text-[var(--text-primary)]">session
              state</em>. The same query ("write the function") has completely different routing
              requirements depending on whether it's turn 1 (planning) or turn 15 (executing a
              known plan).
            </p>
            <p>
              As more production workloads shift to agentic patterns — coding agents, research
              assistants, workflow automation — routers that can't handle multi-turn context will
              become a bottleneck. The cost savings from single-turn routing are real, but they don't
              transfer to the workloads that are growing fastest.
            </p>
            <p>
              The routers that win this market will be the ones that treat agentic workflows as a
              first-class routing problem, not an afterthought.
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
              Test routing on your own prompts
            </h2>
            <p
              className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Try the demo with tool-use prompts and see how the router classifies them differently
              from standard queries.
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

export default AgenticRouting;

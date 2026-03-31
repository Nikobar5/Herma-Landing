import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { setPageMeta, resetPageMeta } from '../../utils/seo';

const blogPosts = [
  {
    slug: 'deepseek-r1-vs-gpt-5',
    title: 'DeepSeek R1 vs GPT-5: Developer\'s Comparison Guide (2026)',
    description:
      'An honest comparison of DeepSeek R1 and GPT-5.2 across 10 dimensions. Reasoning, code, price, speed, and when to use each — based on real production routing data.',
    tag: 'Comparison',
    date: 'March 2026',
  },
  {
    slug: 'best-ai-for-coding',
    title: 'Best AI for Coding in 2026: 6 Models Compared for Developers',
    description:
      'A developer\'s guide to the best AI models for coding. Claude, GPT-4o, DeepSeek, Gemini compared across 12 real development tasks — with honest tradeoffs, pricing, and when to use each.',
    tag: 'Guide',
    date: 'March 2026',
  },
  {
    slug: 'gemini-2-5-pro-vs-gpt-5',
    title: 'Gemini 2.5 Pro vs GPT-5: Head-to-Head Comparison (2026)',
    description:
      'An honest comparison of Google Gemini 2.5 Pro and GPT-5.2 across 10 dimensions. Context window, multimodal, pricing, code, reasoning, and when to use each — with real production data.',
    tag: 'Comparison',
    date: 'March 2026',
  },
  {
    slug: 'gpt-5-vs-claude-opus',
    title: 'GPT-5 vs Claude Opus 4: Which Frontier Model Wins in 2026?',
    description:
      'An honest comparison of GPT-5.2 and Claude Opus 4 across 10 dimensions. Reasoning, code, writing, speed, pricing, and use case verdicts — based on real production routing data.',
    tag: 'Comparison',
    date: 'March 2026',
  },
  {
    slug: 'claude-vs-gpt-4o',
    title: 'Claude vs GPT-4o: Head-to-Head Comparison (2026)',
    description:
      'An honest comparison of Claude 3.5 Sonnet and GPT-4o across 10 dimensions — coding, writing, reasoning, pricing, speed, and more. Use case verdicts and the real answer most articles miss.',
    tag: 'Comparison',
    date: 'March 2026',
  },
  {
    slug: 'openai-alternatives',
    title: '7 Best OpenAI Alternatives for Developers in 2026',
    description:
      'A developer\'s guide to the best OpenAI API alternatives. Compare Claude, Gemini, DeepSeek, Llama, Mistral, and more — with pricing, tradeoffs, and a migration checklist.',
    tag: 'Guide',
    date: 'March 2026',
  },
  {
    slug: 'choose-right-llm',
    title: 'How to Choose the Right LLM for Your Use Case (2026 Guide)',
    description:
      'A practical decision framework for picking the right LLM. Compare GPT-4o, Claude, Gemini, and DeepSeek by task type, quality needs, volume, and budget — with a quick decision tree.',
    tag: 'Guide',
    date: 'March 2026',
  },
  {
    slug: 'llm-api-pricing-comparison',
    title: 'LLM API Pricing Comparison 2026: What Every Model Actually Costs',
    description:
      'Side-by-side pricing for GPT-4o, Claude 3.5, Gemini, DeepSeek, and Llama. Real workload cost estimates and how intelligent routing cuts your bill by 60-90%.',
    tag: 'Guide',
    date: 'March 2026',
  },
  {
    slug: 'how-llm-routers-work',
    title: 'How LLM Routers Work: A Technical Deep Dive',
    description:
      'Inside the routing pipeline: query classification, model selection, shadow validation, and expected value optimization. A technical guide for AI engineers.',
    tag: 'Engineering',
    date: 'March 2026',
  },
  {
    slug: 'llm-api-gateway-vs-router',
    title: 'LLM API Gateway vs Model Router: What\'s the Difference?',
    description:
      'API gateways handle plumbing. Model routers handle intelligence. Learn the difference and why modern AI apps need both — and how to get them in one integration.',
    tag: 'Guide',
    date: 'March 2026',
  },
  {
    slug: 'save-on-ai-costs',
    title: 'How to Save 65% on AI API Costs Without Losing Quality',
    description:
      'Most AI apps overpay by sending every query to frontier models. Learn how intelligent model routing cuts costs by 65% while maintaining quality — with benchmark data to prove it.',
    tag: 'Guide',
    date: 'March 2026',
  },
  {
    slug: 'agentic-routing',
    title: 'LLM Routing for Agentic AI: Why Single-Turn Routers Fail',
    description:
      'Agentic AI workflows break traditional LLM routers. Multi-turn tool use, context persistence, and error recovery demand a different routing strategy.',
    tag: 'Engineering',
    date: 'March 2026',
  },
  {
    slug: 'best-llm-routers',
    title: 'Best LLM Routers in 2026: A Technical Comparison',
    description:
      'Compare the top LLM routers — RouteLLM, Martian, Unify, OpenRouter, and Herma. Evaluation criteria, architecture differences, and which router fits your use case.',
    tag: 'Guide',
    date: 'March 2026',
  },
  {
    slug: 'ev-routing',
    title: 'Why AI Routers Fail -- And How Expected Value Fixes Them',
    description:
      'Most AI routers treat quality as a linear tradeoff. It isn\'t. Here\'s the expected value framework that makes routing safe enough to actually use in production.',
    tag: 'Engineering',
    date: 'March 2026',
  },
  {
    slug: 'how-we-benchmark',
    title: 'How We Benchmark AI Routers: Methodology, Pitfalls, and What We Learned',
    description:
      'The real challenges of benchmarking a model routing system \u2014 broken datasets, answer extraction bugs, and what we learned about classifier design.',
    tag: 'Engineering',
    date: 'March 2026',
  },
  {
    slug: 'cost-quality-matrix',
    title: 'We Benchmarked 9 Models Across 800+ Queries: The LLM Cost-Quality Matrix',
    description:
      'Original benchmark data from 805 scored responses across 9 models. Find out which models match frontier quality at a fraction of the cost.',
    tag: 'Research',
    date: 'March 2026',
  },
  {
    slug: 'shadow-routing',
    title: 'Shadow Routing: How to Test LLM Cost Optimization Without Risk',
    description:
      'How to validate an LLM routing system in production without affecting users. Shadow mode, quality judging, and when to graduate to active routing.',
    tag: 'Engineering',
    date: 'March 2026',
  },
];

const BlogIndex = () => {
  useEffect(() => {
    // SEO: keyword-targeted title for blog index (was too generic "Blog")
    setPageMeta(
      'LLM Router Blog | AI Cost Optimization Guides',
      'Technical guides on LLM routing, AI cost optimization, and model benchmarking. Real data, production insights, and comparisons from the Herma engineering team.',
      { url: 'https://hermaai.com/blog' }
    );
    return () => resetPageMeta();
  }, []);

  const [headerRef, headerVisible] = useScrollAnimation(0.1);
  const [listRef, listVisible] = useScrollAnimation(0.1);

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-16">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6">

        {/* Header */}
        <header
          ref={headerRef}
          className={`animate-on-scroll animate-fade-up ${headerVisible ? 'is-visible' : ''} mb-12`}
        >
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Blog
          </h1>
          <p
            className="text-lg text-[var(--text-secondary)]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Technical deep-dives on intelligent model routing
          </p>
          <div className="w-20 h-1 mt-6 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-hover)]"></div>
        </header>

        {/* Post list */}
        <section
          ref={listRef}
          className={`animate-on-scroll animate-fade-up ${listVisible ? 'is-visible' : ''} space-y-6`}
        >
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="block group rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] hover:border-[var(--border-accent)] transition-all duration-200 p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-[var(--accent-muted)] text-[var(--accent-primary)] border border-[var(--border-accent)]"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  {post.tag}
                </span>
                <span
                  className="text-sm text-[var(--text-tertiary)]"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  {post.date}
                </span>
              </div>
              <h2
                className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-3 group-hover:text-[var(--accent-primary)] transition-colors"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {post.title}
              </h2>
              <p
                className="text-[var(--text-secondary)] mb-4 leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {post.description}
              </p>
              <span
                className="text-sm font-medium text-[var(--accent-primary)] group-hover:translate-x-1 inline-block transition-transform"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Read &rarr;
              </span>
            </Link>
          ))}
        </section>

      </div>
    </main>
  );
};

export default BlogIndex;

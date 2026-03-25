#!/usr/bin/env node
/**
 * Post-build script: generates per-route HTML files with correct <title> and meta tags.
 * Each file is a copy of index.html with route-specific SEO metadata.
 * Nginx serves these when the exact path is requested.
 */

const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(__dirname, '..', 'build');
const INDEX_HTML = fs.readFileSync(path.join(BUILD_DIR, 'index.html'), 'utf-8');

const PAGES = [
  {
    route: 'blog/how-llm-routers-work',
    title: 'How LLM Routers Work: A Technical Deep Dive | Herma AI',
    description: 'Inside the routing pipeline: query classification, model selection, shadow validation, and expected value optimization. A technical guide for AI engineers.',
    ogImage: 'og-blog-how-llm-routers-work.png',
  },
  {
    route: 'blog/llm-api-gateway-vs-router',
    title: 'LLM API Gateway vs Model Router: What\'s the Difference? | Herma AI',
    description: 'API gateways handle plumbing. Model routers handle intelligence. Learn the difference and why modern AI apps need both.',
    ogImage: 'og-blog-llm-api-gateway-vs-router.png',
  },
  {
    route: 'blog/cost-quality-matrix',
    title: 'We Benchmarked 9 Models: The LLM Cost-Quality Matrix | Herma',
    description: 'Original benchmark data from 805 scored responses across 9 models. Find which models match frontier quality at a fraction of the cost.',
    ogImage: 'og-blog-cost-quality-matrix.png',
  },
  {
    route: 'blog/shadow-routing',
    title: 'Shadow Routing: Test LLM Cost Optimization Without Risk | Herma',
    description: 'How to validate an LLM routing system in production without affecting users. Shadow mode, quality judging, and graduation criteria.',
    ogImage: 'og-blog-shadow-routing.png',
  },
  {
    route: 'blog/ev-routing',
    title: 'Why AI Routers Fail — And How Expected Value Fixes Them | Herma',
    description: 'Most AI routers treat quality as a linear tradeoff. Here is the expected value framework that makes routing safe enough for production.',
    ogImage: 'og-blog-ev-routing.png',
  },
  {
    route: 'blog/how-we-benchmark',
    title: 'How We Benchmark AI Routers: Methodology, Pitfalls, and What We Learned | Herma',
    description: 'The real challenges of benchmarking a model routing system — broken datasets, answer extraction bugs, and classifier design lessons.',
    ogImage: 'og-blog-how-we-benchmark.png',
  },
  {
    route: 'blog/best-llm-routers',
    title: 'Best LLM Routers in 2026: A Technical Comparison | Herma',
    description: 'Compare the top LLM routers of 2026 — RouteLLM, Martian, Unify, OpenRouter, and Herma. Evaluation criteria, architecture differences, and which router fits your use case.',
    ogImage: 'og-blog-best-llm-routers.png',
  },
  {
    route: 'blog/agentic-routing',
    title: 'LLM Routing for Agentic AI: Why Single-Turn Routers Fail | Herma',
    description: 'Agentic AI workflows break traditional LLM routers. Multi-turn tool use, context persistence, and error recovery demand a different routing strategy.',
    ogImage: 'og-blog-agentic-routing.png',
  },
  {
    route: 'blog/save-on-ai-costs',
    title: 'How to Save 65% on AI API Costs Without Losing Quality | Herma',
    description: 'Most AI apps overpay by sending every query to frontier models. Learn how intelligent model routing cuts costs by 65% while maintaining quality — with real numbers and benchmark data.',
    ogImage: 'og-blog-save-on-ai-costs.png',
  },
  {
    route: 'blog',
    title: 'Blog | Herma',
    description: 'Technical deep-dives on intelligent model routing from the Herma engineering team.',
  },
  {
    route: 'demo',
    title: 'Try Herma — Free AI Router Demo',
    description: 'Try Herma\'s intelligent model router for free. Same quality, fraction of the price. No signup required.',
  },
  {
    route: 'docs',
    title: 'API Documentation | Herma',
    description: 'Herma API documentation. OpenAI-compatible, change two lines of code. $2/M input, $8/M output tokens.',
  },
  {
    route: 'about',
    title: 'About | Herma',
    description: 'About Herma AI — intelligent model routing for every workload.',
  },
  {
    route: 'faq',
    title: 'FAQ | Herma',
    description: 'Frequently asked questions about Herma AI, pricing, model routing, and API compatibility.',
  },
];

let created = 0;

for (const page of PAGES) {
  const dir = path.join(BUILD_DIR, page.route);
  fs.mkdirSync(dir, { recursive: true });

  let html = INDEX_HTML;
  // Replace title
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${page.title}</title>`
  );
  // Replace meta description
  html = html.replace(
    /<meta name="description" content="[^"]*"\/>/,
    `<meta name="description" content="${page.description}"/>`
  );
  // Replace OG title and description
  html = html.replace(
    /<meta property="og:title" content="[^"]*"/,
    `<meta property="og:title" content="${page.title}"`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"/,
    `<meta property="og:description" content="${page.description}"`
  );
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"/,
    `<meta name="twitter:title" content="${page.title}"`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"/,
    `<meta name="twitter:description" content="${page.description}"`
  );
  // Replace OG image if page has a custom one
  if (page.ogImage) {
    const ogUrl = `https://hermaai.com/${page.ogImage}`;
    html = html.replace(
      /<meta property="og:image" content="[^"]*"/,
      `<meta property="og:image" content="${ogUrl}"`
    );
    html = html.replace(
      /<meta name="twitter:image" content="[^"]*"/,
      `<meta name="twitter:image" content="${ogUrl}"`
    );
  }
  // Replace OG URL for the page
  html = html.replace(
    /<meta property="og:url" content="[^"]*"/,
    `<meta property="og:url" content="https://hermaai.com/${page.route}"`
  );

  fs.writeFileSync(path.join(dir, 'index.html'), html);
  created++;
}

console.log(`Generated ${created} per-route HTML files with SEO metadata.`);

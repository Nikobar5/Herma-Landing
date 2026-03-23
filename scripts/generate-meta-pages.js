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
    route: 'blog/cost-quality-matrix',
    title: 'We Benchmarked 9 Models: The LLM Cost-Quality Matrix | Herma',
    description: 'Original benchmark data from 805 scored responses across 9 models. Find which models match frontier quality at a fraction of the cost.',
  },
  {
    route: 'blog/shadow-routing',
    title: 'Shadow Routing: Test LLM Cost Optimization Without Risk | Herma',
    description: 'How to validate an LLM routing system in production without affecting users. Shadow mode, quality judging, and graduation criteria.',
  },
  {
    route: 'blog/ev-routing',
    title: 'Why AI Routers Fail — And How Expected Value Fixes Them | Herma',
    description: 'Most AI routers treat quality as a linear tradeoff. Here is the expected value framework that makes routing safe enough for production.',
  },
  {
    route: 'blog/how-we-benchmark',
    title: 'How We Benchmark AI Routers: Methodology, Pitfalls, and What We Learned | Herma',
    description: 'The real challenges of benchmarking a model routing system — broken datasets, answer extraction bugs, and classifier design lessons.',
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

  fs.writeFileSync(path.join(dir, 'index.html'), html);
  created++;
}

console.log(`Generated ${created} per-route HTML files with SEO metadata.`);

# Herma AI — Knowledge Base

This file is the complete knowledge base for the Herma AI assistant. It covers everything a user might ask about Herma.

---

## What is Herma?

Herma is an intelligent AI gateway that gives developers and teams unified access to all major AI models — GPT-4o, Claude, Gemini, Mistral, DeepSeek, and more — through a single OpenAI-compatible API. Herma's smart router automatically selects the best model for each request based on the task type and complexity, saving 60–90% on costs while maintaining frontier quality.

One API key. One base URL. Every model.

---

## How Herma Works

### Intelligent Routing

When a request arrives, Herma:
1. Classifies the query: category (coding, analysis, creative, math, factual, chat) and difficulty (easy, medium, hard)
2. Routes to the most cost-effective model that can handle it at frontier quality
3. Simple tasks (factual lookups, basic Q&A, summarization, classification) → efficient, cheaper models
4. Complex tasks (system design, multi-step reasoning, hard coding problems) → frontier models (Claude Opus, GPT-4o)

The routing logic is continuously updated as new models are benchmarked.

### OpenAI Compatibility

Herma is a drop-in replacement for the OpenAI API. Change two things and you're done:
- Base URL: `https://api.hermaai.com/v1`
- API Key: your Herma key (starts with `herma_sk`)

Everything else — prompts, streaming, tool/function calling, model parameters — works unchanged with the OpenAI SDK for Python, Node.js, and any compatible library.

### Memory System

Herma automatically extracts and remembers key facts from conversations — preferences, context, and instructions. This memory is injected into future conversations so the AI already knows your background. Sensitive information (passwords, API keys) is automatically filtered out before storage.

---

## Pricing

- **$2 per million input tokens** — flat rate, regardless of which model is used underneath
- **$8 per million output tokens** — flat rate, regardless of which model is used underneath
- No minimums, no subscriptions, no seat fees
- Credits never expire
- New accounts get **$1.00 free credit** — no credit card required
- Pay-as-you-go: you only pay for what you use

Your dashboard shows real-time cost tracking broken down by model and a savings comparison versus using frontier models directly.

---

## Quality & Benchmarks

Herma is tested on 8 industry-standard benchmarks against Claude Opus:

| Benchmark | Score vs Opus |
|-----------|---------------|
| MMLU | 98.2% |
| ARC-Challenge | 100.7% |
| GSM8K | 100.0% |
| HumanEval+ | 102.1% |
| MBPP+ | 105.8% |

**8 out of 8** benchmarks at frontier quality. **89%** average cost savings. **868+** tests passing.

The router only routes to cheaper models when quality is validated. Hard tasks stay on frontier models — no quality risk.

Full methodology: https://hermaai.com/blog/how-we-benchmark

---

## Supported Models

All major providers through one API:
- **Anthropic**: Claude Opus, Sonnet, Haiku
- **OpenAI**: GPT-4o, o1
- **Google**: Gemini 2.5 Pro and others
- **Mistral**, **DeepSeek**, and more

Use `herma-auto` as the model to let Herma route automatically. Or specify any supported model directly by its full name.

---

## API Reference

### Base URL
```
https://api.hermaai.com/v1
```

### Authentication
```
Authorization: Bearer herma_sk_your_api_key
```

### Chat Completions — POST /v1/chat/completions

Request body parameters:
- `model` (string): Use `herma-auto` for auto-routing
- `messages` (array): Message objects with `role` and `content`
- `stream` (boolean): Set `true` for streaming. Default: `false`
- `temperature` (float, optional): 0–2
- `max_tokens` (integer, optional)

### Test the Router — POST /v1/classify
Free, no authentication required. Returns the classification, model selection, and cost estimate for any query.

### Rate Limits
- 500 requests per minute per API key
- 50 concurrent requests per account

### Error Codes
- `401`: Invalid or missing API key
- `402`: Insufficient credits — add credits at https://hermaai.com/upgrade
- `429`: Rate limit exceeded — wait and retry
- `500`: Server error — retry or contact support

---

## Quick Start

### Python
```python
from openai import OpenAI

client = OpenAI(
    api_key="herma_sk_your_api_key",
    base_url="https://api.hermaai.com/v1"
)
response = client.chat.completions.create(
    model="herma-auto",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)
```

### Node.js
```javascript
import OpenAI from "openai";
const client = new OpenAI({
  apiKey: "herma_sk_your_api_key",
  baseURL: "https://api.hermaai.com/v1"
});
const response = await client.chat.completions.create({
  model: "herma-auto",
  messages: [{ role: "user", content: "Hello!" }]
});
console.log(response.choices[0].message.content);
```

---

## Route Your AI Coding Tool Through Herma

### Claude Code
```bash
export ANTHROPIC_BASE_URL="https://api.hermaai.com"
export ANTHROPIC_AUTH_TOKEN="herma_sk_YOUR_KEY"
export ANTHROPIC_MODEL="herma-auto"
```
Or use the one-liner: `curl -fsSL https://api.hermaai.com/install/claude-code | bash -s -- herma_sk_YOUR_KEY`

### Cursor
Settings → Models → OpenAI API Key section:
- API Key: `herma_sk_YOUR_KEY`
- Base URL: `https://api.hermaai.com/v1`

### Windsurf
Settings → AI → Custom API:
- Base URL: `https://api.hermaai.com/v1`
- API Key: `herma_sk_YOUR_KEY`

### Aider
```bash
export OPENAI_API_KEY="herma_sk_YOUR_KEY"
export OPENAI_API_BASE="https://api.hermaai.com/v1"
aider --model herma-auto
```

---

## Frequently Asked Questions

### What is Herma?
Herma is an intelligent AI gateway — one API key, one base URL, every major AI model. The router automatically selects the best model for each task, saving 60–90% on costs while maintaining frontier quality.

### How does OpenAI SDK compatibility work?
Change two things: `baseURL` to `https://api.hermaai.com/v1` and your API key to your Herma key. Everything else stays the same — prompts, streaming, tool calling, model parameters.

### How much does Herma cost?
Flat $2/M input tokens and $8/M output tokens, regardless of which model runs underneath. No minimums, no subscriptions, credits never expire. New accounts get $1.00 free.

### How much can I realistically save?
60–90% on average. Simple tasks (summarization, Q&A, classification) go to cheap models. Complex tasks (hard coding, system design, reasoning) always go to frontier models. Your savings dashboard shows a real-time comparison.

### How does the routing work?
Herma classifies each query by category and difficulty, then routes to the cheapest model validated to maintain frontier quality on that benchmark category. The routing is continuously updated as new models are released.

### What models can I access?
Claude (Anthropic), GPT-4o/o1 (OpenAI), Gemini (Google), Mistral, DeepSeek, and more — all through one API. New models are added as they're benchmarked.

### Is Herma suitable for production?
Yes. High availability, streaming, low added latency. 8/8 benchmarks at frontier quality, 868+ tests passing.

### How does the memory system work?
Herma extracts key facts from conversations and injects them into future sessions. Sensitive data is filtered automatically.

### How does billing work?
Credit-based. Purchase credits, usage is deducted at $2/M input and $8/M output. Dashboard shows real-time tracking by model.

### Can I use my existing code?
Yes — change two lines. Any framework compatible with the OpenAI API works: LangChain, Vercel AI SDK, LlamaIndex, etc.

### Is Herma suitable for teams?
Yes. Centralized billing, usage analytics, admin dashboard, multiple API keys. One account for multiple apps and team members.

### Can I specify a model directly?
Yes. Use `herma-auto` for automatic routing, or specify any supported model name directly (e.g., `anthropic/claude-opus-4-7`).

### What happens if I run out of credits?
You'll get a 402 error. Add credits at https://hermaai.com/upgrade. The chat interface shows a "top up" prompt.

---

## About Herma

Founded by Georgia Tech engineers.

**Niko Barciak — Co-Founder & CEO**
CS at Georgia Tech. Built AI agents for enterprise teams (The Home Depot). Works on privacy-focused open-source LLMs. Involved in Georgia Tech Angel Network (AI, deep tech, space, Atlanta ecosystem). Leads agentic systems and product at Herma.

**Nicholas Pianfetti — Co-Founder & CTO**
ME/CS at Georgia Tech. Built robotic control systems at Tesla and high-frequency data pipelines at Jane Street. Leads operations and infrastructure at Herma.

**Mission:** Make intelligence flow freely. One gateway, no friction, no switching, no gatekeeping. A single auditable layer for all AI usage across an organization.

---

## Links

- Website: https://hermaai.com
- Docs: https://hermaai.com/docs
- Demo (try without signing up): https://hermaai.com/demo
- Pricing / upgrade: https://hermaai.com/upgrade
- Blog: https://hermaai.com/blog
- Benchmarks: https://hermaai.com/benchmarks
- About: https://hermaai.com/about
- FAQ: https://hermaai.com/faq
- Support: niko.barciak@hermaai.com
- GitHub: https://github.com/Nikobar5/herma-eval

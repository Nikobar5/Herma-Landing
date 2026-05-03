# Quality & Benchmarks

## Built for quality, not just speed

Herma is tested against frontier models on industry-standard benchmarks — so cheaper never means worse.

| Metric | Result |
|--------|--------|
| Benchmarks at frontier quality | **8 / 8** |
| Average cost savings | **89%** |
| Tests passing | **868+** |

### Benchmark Results vs Claude Opus

| Benchmark | Herma Score |
|-----------|-------------|
| MMLU | 98.2% of Opus quality |
| ARC-Challenge | 100.7% of Opus quality |
| GSM8K | 100.0% of Opus quality |
| HumanEval+ | 102.1% of Opus quality |
| MBPP+ | 105.8% of Opus quality |

The router only sends requests to cheaper models when their quality has been validated against frontier models on that benchmark category. Hard tasks (system design, formal verification, complex reasoning) always stay on frontier models — no quality risk, no surprise degradation.

[Read the full methodology →](/blog/how-we-benchmark)

---

## Common Questions

### How does OpenAI SDK compatibility work?

Herma is fully compatible with the OpenAI SDK. You only need to change two things: set the `baseURL` to `https://api.hermaai.com/v1` and replace your API key with your Herma key. Everything else — your prompts, model names, streaming logic — stays exactly the same. We support the chat completions endpoint that virtually every AI library and framework uses.

### How much does Herma cost?

Herma charges a flat **$2 per million input tokens** and **$8 per million output tokens** — regardless of which model processes your request. There are no minimums, no seat fees, and credits never expire. Pay-as-you-go: you only pay for what you use.

### How much can I realistically save?

Most customers save **60–90%** compared to going directly to frontier model APIs. The savings depend on your use case: simpler tasks like summarization, classification, and Q&A are routed to cheaper models while maintaining the same quality. Complex reasoning and coding tasks that genuinely need frontier models are routed there automatically.

### How does Herma decide which model to use?

Herma analyzes each incoming request — the prompt length, complexity, required capabilities, and your cost settings — and routes it to the most cost-effective model that can handle it at frontier quality. The routing logic is continuously updated as new models are released and benchmarked.

### Is Herma suitable for production workloads?

Yes. Herma is designed for production use: high availability, streaming responses, and low added latency. Benchmark results show that quality is maintained across 8 industry-standard benchmarks. See the [full methodology](/blog/how-we-benchmark) for details.

---

More questions? [See our full FAQ →](/faq)

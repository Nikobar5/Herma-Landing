# API Documentation

Herma provides an OpenAI-compatible API. Change two lines of code and you're up and running.

**Pricing:** $2/M input tokens · $8/M output tokens · no minimums

## Quick Start

**1. Create an account**

Sign up at [hermaai.com](https://hermaai.com) and add credits from the Billing page.

**2. Generate an API key**

Go to [Dashboard → API Keys](https://hermaai.com/dashboard/api-keys) and create a key. It starts with `herma_sk`. Copy it immediately — you won't see it again.

**3. Make your first request**

Use the endpoint below with your API key. That's it.

---

## Quick Start with Coding Tools

Drop one of these files into your project root and your AI coding assistant will automatically use Herma for all LLM API calls — no manual configuration needed each time.

### Claude Code (CLAUDE.md)

Save as `CLAUDE.md` in your project root. [Download](https://hermaai.com/integration/CLAUDE.md)

```markdown
# Herma AI — API Setup Guide

Herma is an OpenAI-compatible intelligent model router. Drop this file in your project
root and Claude Code will know how to set up and use the Herma API.

## How to Get an API Key

When the user asks to set up Herma or use the Herma API, print these steps for them:

1. Sign up at https://hermaai.com (free — includes $1 in credits to start)
2. Go to Dashboard → API Keys and click "Create Key"
3. Copy the key immediately — it starts with herma_sk and won't be shown again
4. Add it to your project's .env file:
   HERMA_API_KEY=herma_sk_your_key_here
5. Install the OpenAI SDK: pip install openai (Python) or npm install openai (Node.js)

## Configuration

| Setting  | Value                                  |
|----------|----------------------------------------|
| Base URL | https://api.hermaai.com/v1             |
| Model    | herma-auto                             |
| API Key  | $HERMA_API_KEY (starts with herma_sk)  |

## Python

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["HERMA_API_KEY"],
    base_url="https://api.hermaai.com/v1"
)
response = client.chat.completions.create(
    model="herma-auto",
    messages=[{"role": "user", "content": "..."}]
)
print(response.choices[0].message.content)
```

## Node.js

```javascript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.HERMA_API_KEY,
  baseURL: "https://api.hermaai.com/v1"
});
const response = await client.chat.completions.create({
  model: "herma-auto",
  messages: [{ role: "user", content: "..." }]
});
console.log(response.choices[0].message.content);
```

## Rules

- Always use `herma-auto` as the model — Herma picks the best model automatically.
- Never call api.openai.com endpoints directly.
- Never hardcode API keys — always read from the HERMA_API_KEY environment variable.
- Streaming and tool/function calling are fully supported.

## Reference

- Docs: https://hermaai.com/docs
- Pricing: $2/M input tokens, $8/M output tokens
```

### Cursor (.cursorrules)

Save as `.cursorrules` in your project root. [Download](https://hermaai.com/integration/cursor-rules.txt)

```
# Herma AI — LLM Provider Rules

This project uses Herma as the LLM provider. Herma is fully OpenAI-compatible.

## Rules

- For ALL LLM API calls: use base URL https://api.hermaai.com/v1 and model herma-auto
- Never call api.openai.com endpoints directly
- Never hardcode API keys — always read from HERMA_API_KEY environment variable
- All standard OpenAI SDK parameters (stream, temperature, max_tokens, tools) work unchanged

## Client Setup — Python

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["HERMA_API_KEY"],
    base_url="https://api.hermaai.com/v1"
)
response = client.chat.completions.create(
    model="herma-auto",
    messages=[{"role": "user", "content": "..."}]
)
```

## Client Setup — Node.js

```javascript
import OpenAI from "openai";
const client = new OpenAI({
  apiKey: process.env.HERMA_API_KEY,
  baseURL: "https://api.hermaai.com/v1"
});
```

Model: always herma-auto
Docs: https://hermaai.com/docs
```

### Windsurf (.windsurfrules)

Same as `.cursorrules` above. Save as `.windsurfrules`. [Download](https://hermaai.com/integration/windsurf-rules.txt)

### Codex / Devin / Other Agents (AGENTS.md)

Save as `AGENTS.md` in your project root. [Download](https://hermaai.com/integration/AGENTS.md)

```markdown
# Herma AI — Agent Integration

Herma is an OpenAI-compatible intelligent model router.
Use it as the LLM provider for all AI calls in this project.

## Configuration

| Setting  | Value                                |
|----------|--------------------------------------|
| Base URL | https://api.hermaai.com/v1           |
| Model    | herma-auto                           |
| API Key  | $HERMA_API_KEY                       |

## Python

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["HERMA_API_KEY"],
    base_url="https://api.hermaai.com/v1"
)
```

## Node.js

```javascript
import OpenAI from "openai";
const client = new OpenAI({
  apiKey: process.env.HERMA_API_KEY,
  baseURL: "https://api.hermaai.com/v1"
});
```

## Agent Notes

- Streaming: fully supported (stream: true)
- Tool/function calling: fully supported
- Complex tasks auto-route to frontier models (Claude Opus, GPT-4o)
- Rate limits: 500 req/min, 50 concurrent per account
- Error 402 = insufficient credits (https://hermaai.com/upgrade)

## Rules

- Always use herma-auto as the model.
- Never call api.openai.com directly.
- Never hardcode API keys.

Docs: https://hermaai.com/docs
```

### Environment Variables

Add to your `.env` file. Get your key at [Dashboard → API Keys](https://hermaai.com/dashboard/api-keys).

```bash
# Herma AI
# Get your key at https://hermaai.com/dashboard/api-keys
HERMA_API_KEY=herma_sk_your_api_key_here
```

[Download .env.example](https://hermaai.com/integration/.env.example)

> **Auto-discovery via llms.txt** — Herma publishes a [llms.txt](https://hermaai.com/llms.txt) file following the open standard for AI tool discovery. AI assistants that support llms.txt can automatically find Herma's API details, base URL, and integration examples without needing a configuration file in your project.

---

## Route Your AI Tool Through Herma

Instead of just using Herma in your code, you can route Claude Code, Cursor, or Windsurf itself through Herma — every request your AI tool makes gets intelligently routed, saving 60–90% automatically.

### Claude Code

```bash
# One-liner installer (recommended)
curl -fsSL https://api.hermaai.com/install/claude-code | bash -s -- herma_sk_YOUR_KEY

# Or add manually to ~/.zshrc or ~/.bashrc:
export ANTHROPIC_BASE_URL="https://api.hermaai.com"
export ANTHROPIC_AUTH_TOKEN="herma_sk_YOUR_KEY"
export ANTHROPIC_MODEL="herma-auto"

# Then open a new terminal and run: claude

# Note: use ANTHROPIC_AUTH_TOKEN (not ANTHROPIC_API_KEY) — this sends your key
# directly as a Bearer token and bypasses Anthropic's OAuth login flow.
# Already logged into Claude? No need to log out — AUTH_TOKEN takes priority.
# To revert: remove the three export lines and open a new terminal.
```

### Cursor

```bash
# Cursor Settings → Models → OpenAI API Key section:
#
#   API Key:  herma_sk_YOUR_KEY
#   Base URL: https://api.hermaai.com/v1
#
# Or via environment (if Cursor respects shell env):
export OPENAI_API_KEY="herma_sk_YOUR_KEY"
export OPENAI_BASE_URL="https://api.hermaai.com/v1"
```

### Windsurf

```
# Windsurf Settings → AI → Custom API:
#
#   Base URL: https://api.hermaai.com/v1
#   API Key:  herma_sk_YOUR_KEY
```

### Aider / Continue.dev

```bash
# Aider
export OPENAI_API_KEY="herma_sk_YOUR_KEY"
export OPENAI_API_BASE="https://api.hermaai.com/v1"
aider --model herma-auto

# Continue.dev — add to ~/.continue/config.json:
# {
#   "models": [{
#     "title": "Herma Auto",
#     "provider": "openai",
#     "model": "herma-auto",
#     "apiKey": "herma_sk_YOUR_KEY",
#     "apiBase": "https://api.hermaai.com/v1"
#   }]
# }
```

Replace `herma_sk_YOUR_KEY` with your key from [Dashboard → API Keys](https://hermaai.com/dashboard/api-keys).

[View full setup guide →](https://hermaai.com/setup.md)

---

## Base URL

```
https://api.hermaai.com/v1
```

## Authentication

Include your API key as a Bearer token in the `Authorization` header:

```
Authorization: Bearer herma_sk_your_api_key
```

---

## Chat Completions

```
POST /v1/chat/completions
```

OpenAI-compatible chat completions endpoint. Supports streaming.

### Request Body

| Parameter     | Type    | Description |
|---------------|---------|-------------|
| `model`       | string  | Use `herma-auto` for automatic model selection |
| `messages`    | array   | Array of message objects with `role` and `content` |
| `stream`      | boolean | Set to `true` for streaming responses. Default: `false` |
| `temperature` | float   | Sampling temperature (0–2). Optional |
| `max_tokens`  | integer | Maximum tokens to generate. Optional |

---

## Models

Use `herma-auto` and Herma will route each request to the best model for the task — same quality, lower cost.

| Model       | Description |
|-------------|-------------|
| `herma-auto` | Automatic routing — Herma picks the best model for each request |

**How auto-routing works:** Herma analyzes each request and routes it to the model that delivers the best quality for that specific task. Simple questions go to efficient models. Complex reasoning, code generation, and multi-step tasks go to frontier models. You get top-tier quality at a fraction of the cost.

---

## Response Format

Responses follow the standard OpenAI chat completion format:

```json
{
  "id": "gen-abc123",
  "object": "chat.completion",
  "created": 1707350400,
  "model": "herma-auto",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Machine learning is a subset of artificial intelligence..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 12,
    "completion_tokens": 85,
    "total_tokens": 97
  }
}
```

---

## Error Codes

| Code  | Meaning |
|-------|---------|
| `401` | Invalid or missing API key |
| `402` | Insufficient credits — add more from the Billing page |
| `429` | Rate limit exceeded — wait and retry |
| `500` | Server error — retry or contact support |

---

## Test the Router

See exactly what the router would do with your queries before committing. The classify endpoint is **free and requires no authentication**.

```bash
curl -X POST https://api.hermaai.com/v1/classify \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Implement a distributed cache with LRU eviction"}
    ]
  }'
```

Response:

```json
{
  "classification": {
    "category": "coding",
    "difficulty": "hard",
    "is_agentic": false
  },
  "routing": {
    "model": "anthropic/claude-opus-4.6",
    "cell": "coding:hard",
    "confidence": "opus_required",
    "pass_rate": 1.0
  },
  "cost_estimate": {
    "frontier_cost_usd": 0.0675,
    "routed_cost_usd": 0.0675,
    "savings_pct": 0.0
  }
}
```

Hard queries stay on frontier models (no savings, no quality risk). Try a simpler query to see the savings.

---

## List Available Models

The standard OpenAI `/v1/models` endpoint lets tools like Cursor, Continue, and Cody auto-discover available models.

```bash
curl https://api.hermaai.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

Returns `herma-auto` (the intelligent router) plus all supported upstream models.

---

## Examples

### Basic Request

**cURL**

```bash
curl https://api.hermaai.com/v1/chat/completions \
  -H "Authorization: Bearer herma_sk_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "herma-auto",
    "messages": [
      {"role": "user", "content": "What is machine learning?"}
    ]
  }'
```

**Python**

```python
from openai import OpenAI

client = OpenAI(
    api_key="herma_sk_your_api_key",
    base_url="https://api.hermaai.com/v1"
)

response = client.chat.completions.create(
    model="herma-auto",
    messages=[
        {"role": "user", "content": "What is machine learning?"}
    ]
)

print(response.choices[0].message.content)
```

**Node.js**

```javascript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "herma_sk_your_api_key",
  baseURL: "https://api.hermaai.com/v1"
});

const response = await client.chat.completions.create({
  model: "herma-auto",
  messages: [
    { role: "user", content: "What is machine learning?" }
  ]
});

console.log(response.choices[0].message.content);
```

**fetch**

```javascript
const response = await fetch("https://api.hermaai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": "Bearer herma_sk_your_api_key",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "herma-auto",
    messages: [
      { role: "user", content: "What is machine learning?" }
    ]
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

### Streaming

**Python**

```python
from openai import OpenAI

client = OpenAI(
    api_key="herma_sk_your_api_key",
    base_url="https://api.hermaai.com/v1"
)

stream = client.chat.completions.create(
    model="herma-auto",
    messages=[
        {"role": "user", "content": "Write a haiku about coding"}
    ],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")
```

**Node.js**

```javascript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "herma_sk_your_api_key",
  baseURL: "https://api.hermaai.com/v1"
});

const stream = await client.chat.completions.create({
  model: "herma-auto",
  messages: [
    { role: "user", content: "Write a haiku about coding" }
  ],
  stream: true
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content;
  if (content) process.stdout.write(content);
}
```

**fetch (SSE)**

```javascript
const response = await fetch("https://api.hermaai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": "Bearer herma_sk_your_api_key",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "herma-auto",
    messages: [
      { role: "user", content: "Write a haiku about coding" }
    ],
    stream: true
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const text = decoder.decode(value);
  for (const line of text.split("\n")) {
    if (line.startsWith("data: ") && line.slice(6) !== "[DONE]") {
      const chunk = JSON.parse(line.slice(6));
      const content = chunk.choices?.[0]?.delta?.content;
      if (content) process.stdout.write(content);
    }
  }
}
```

---

## Rate Limits

- **500 requests per minute** per API key
- **50 concurrent requests** per account

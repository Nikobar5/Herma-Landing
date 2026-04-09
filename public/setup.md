# Connect Any AI Tool to Herma

Route AI requests through Herma's intelligent router. Same quality, lower cost.

Herma is API-compatible with Anthropic and OpenAI. Any tool that lets you set a custom base URL works.

---

## Claude Code

**One-liner (recommended):**
```bash
curl -fsSL https://api.hermaai.com/install/claude-code | bash -s -- herma_sk_YOUR_KEY
```

**Manual setup** — add to `~/.zshrc` or `~/.bashrc`:
```bash
export ANTHROPIC_BASE_URL="https://api.hermaai.com"
export ANTHROPIC_AUTH_TOKEN="herma_sk_YOUR_KEY"
export ANTHROPIC_MODEL="herma-auto"
```

Open a new terminal, run `claude`.

> **Why `ANTHROPIC_AUTH_TOKEN` and not `ANTHROPIC_API_KEY`?** Claude Code treats these differently: `ANTHROPIC_API_KEY` triggers Anthropic's OAuth browser login flow. `ANTHROPIC_AUTH_TOKEN` sends the value directly as a Bearer token and bypasses OAuth entirely, so Herma's key works without conflict.

> **Already logged into Claude?** No need to log out. `ANTHROPIC_AUTH_TOKEN` takes priority over your existing session automatically. To revert to your Claude subscription later, remove the three export lines and open a new terminal — your existing login session will resume.

---

## Cursor

In Cursor settings → Models → OpenAI API Key section:

- **API Key:** `herma_sk_YOUR_KEY`
- **Base URL:** `https://api.hermaai.com/v1`

Or via environment (if Cursor respects shell env):
```bash
export OPENAI_API_KEY="herma_sk_YOUR_KEY"
export OPENAI_BASE_URL="https://api.hermaai.com/v1"
```

---

## Windsurf

Settings → AI → Custom API:

- **Base URL:** `https://api.hermaai.com/v1`
- **API Key:** `herma_sk_YOUR_KEY`

---

## Aider

```bash
export OPENAI_API_KEY="herma_sk_YOUR_KEY"
export OPENAI_API_BASE="https://api.hermaai.com/v1"
aider --model herma-auto
```

Or pass inline:
```bash
aider \
  --openai-api-key herma_sk_YOUR_KEY \
  --openai-api-base https://api.hermaai.com/v1 \
  --model herma-auto
```

---

## Continue.dev (VS Code / JetBrains)

In `~/.continue/config.json`:
```json
{
  "models": [
    {
      "title": "Herma Auto",
      "provider": "openai",
      "model": "herma-auto",
      "apiKey": "herma_sk_YOUR_KEY",
      "apiBase": "https://api.hermaai.com/v1"
    }
  ]
}
```

---

## Python (Anthropic SDK)

```python
import anthropic

client = anthropic.Anthropic(
    api_key="herma_sk_YOUR_KEY",
    base_url="https://api.hermaai.com",
)

message = client.messages.create(
    model="herma-auto",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello"}],
)
```

---

## Python (OpenAI SDK)

```python
from openai import OpenAI

client = OpenAI(
    api_key="herma_sk_YOUR_KEY",
    base_url="https://api.hermaai.com/v1",
)

response = client.chat.completions.create(
    model="herma-auto",
    messages=[{"role": "user", "content": "Hello"}],
)
```

---

## Node.js (Anthropic SDK)

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: "herma_sk_YOUR_KEY",
  baseURL: "https://api.hermaai.com",
});
```

---

## Node.js (OpenAI SDK)

```typescript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "herma_sk_YOUR_KEY",
  baseURL: "https://api.hermaai.com/v1",
});
```

---

## curl (Anthropic format)

```bash
curl https://api.hermaai.com/v1/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer herma_sk_YOUR_KEY" \
  -d '{
    "model": "herma-auto",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

---

## curl (OpenAI format)

```bash
curl https://api.hermaai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer herma_sk_YOUR_KEY" \
  -d '{
    "model": "herma-auto",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

---

## Available Models

| Model | Description |
|-------|-------------|
| `herma-auto` | Smart routing — picks the best model for each request |

All requests use `herma-auto`. Herma's router selects the optimal underlying model per request — you don't choose the model directly.

---

## Verify It's Working

Check your usage dashboard at [hermaai.com](https://hermaai.com) — requests appear in real time.

Or ask in your tool: *"What model are you running on?"* — you'll see `herma-auto` or the routed model name.

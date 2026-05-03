# Herma AI

Herma is an OpenAI-compatible intelligent model router that automatically routes each request to the optimal model, saving 60–90% on LLM costs while maintaining frontier quality.

## Configuration

All LLM API calls in this project use Herma. Use the following client configuration:

| Setting   | Value                              |
|-----------|------------------------------------|
| Base URL  | `https://api.hermaai.com/v1`       |
| Model     | `herma-auto`                       |
| API Key   | `$HERMA_API_KEY` (starts with `herma_sk`) |

Get your API key: https://hermaai.com/dashboard/api-keys

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

## JavaScript / Node.js

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

## Setting Up Claude Code to Route Through Herma

If the user wants Claude Code itself (this tool) to route through Herma, add these to `~/.zshrc` or `~/.bashrc`:

```bash
export ANTHROPIC_BASE_URL="https://api.hermaai.com"
export ANTHROPIC_AUTH_TOKEN="herma_sk_YOUR_KEY"
export ANTHROPIC_MODEL="herma-auto"
```

Then open a new terminal and run `claude`.

Or use the one-liner installer:
```bash
curl -fsSL https://api.hermaai.com/install/claude-code | bash -s -- herma_sk_YOUR_KEY
```

> **Why `ANTHROPIC_AUTH_TOKEN` and not `ANTHROPIC_API_KEY`?** Claude Code treats these differently: `ANTHROPIC_API_KEY` triggers Anthropic's OAuth browser login flow. `ANTHROPIC_AUTH_TOKEN` sends the value directly as a Bearer token and bypasses OAuth entirely, so Herma's key works without conflict.

> **Already logged into Claude?** No need to log out. `ANTHROPIC_AUTH_TOKEN` takes priority over your existing session automatically. To revert to your Claude subscription later, remove the three export lines and open a new terminal.

## Rules

- Always use `herma-auto` as the model. Herma selects the optimal underlying model per request.
- Never call `api.openai.com` endpoints directly — always use `https://api.hermaai.com/v1`.
- Never hardcode API keys. Always read from the `HERMA_API_KEY` environment variable.
- Streaming (`stream: true`) and tool/function calling are fully supported.
- The API is fully OpenAI-compatible — all standard SDK parameters work unchanged.

## Reference

- Full setup guide (all tools): https://hermaai.com/setup.md
- API Documentation: https://hermaai.com/docs
- Pricing: $2/M input tokens, $8/M output tokens
- Test the router free (no auth required): `POST https://api.hermaai.com/v1/classify`

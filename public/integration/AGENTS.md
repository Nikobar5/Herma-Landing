# Herma AI — Agent Integration

Herma is an OpenAI-compatible intelligent model router. Use it as the LLM provider for all AI calls in this project.

## Configuration

| Setting  | Value                              |
|----------|------------------------------------|
| Base URL | `https://api.hermaai.com/v1`       |
| Model    | `herma-auto`                       |
| API Key  | `$HERMA_API_KEY` (starts with `hk-`) |

Get your API key: https://hermaai.com/dashboard/api-keys

## Python Setup

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

## JavaScript / Node.js Setup

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
```

## Agent-Specific Notes

- **Streaming**: Fully supported. Pass `stream: true` in any request.
- **Tool/Function Calling**: Fully supported. Pass a `tools` array in standard OpenAI format.
- **Complex multi-step tasks**: Use `herma-auto` — the router automatically escalates to frontier models (Claude Opus, GPT-4o) for complex reasoning, multi-step plans, and sub-agent orchestration tasks.
- **Rate limits**: 500 requests/minute per API key, 50 concurrent requests per account.
- **Error handling**:
  - `401` — invalid or missing API key
  - `402` — insufficient credits (add credits at https://hermaai.com/upgrade)
  - `429` — rate limited, wait and retry
  - `500` — server error, retry

## Rules

- Always use `herma-auto` as the model unless targeting a specific provider model.
- Never call `api.openai.com` endpoints directly.
- Never hardcode API keys.

## Reference

- API Documentation: https://hermaai.com/docs
- Pricing: $2/M input tokens, $8/M output tokens
- Test the router free (no auth required): `POST https://api.hermaai.com/v1/classify`

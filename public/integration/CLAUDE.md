# Herma AI

Herma is an OpenAI-compatible intelligent model router that automatically routes each request to the optimal model, saving 60–90% on LLM costs while maintaining frontier quality.

## Configuration

All LLM API calls in this project use Herma. Use the following client configuration:

| Setting   | Value                              |
|-----------|------------------------------------|
| Base URL  | `https://api.hermaai.com/v1`       |
| Model     | `herma-auto`                       |
| API Key   | `$HERMA_API_KEY` (starts with `hk-`) |

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

## Rules

- Always use `herma-auto` as the model. Herma selects the optimal underlying model per request.
- Never call `api.openai.com` endpoints directly — always use `https://api.hermaai.com/v1`.
- Never hardcode API keys. Always read from the `HERMA_API_KEY` environment variable.
- Streaming (`stream: true`) and tool/function calling are fully supported.
- The API is fully OpenAI-compatible — all standard SDK parameters work unchanged.

## Reference

- API Documentation: https://hermaai.com/docs
- Pricing: $2/M input tokens, $8/M output tokens
- Test the router free (no auth required): `POST https://api.hermaai.com/v1/classify`

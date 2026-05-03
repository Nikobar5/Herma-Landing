import React, { useState, useEffect } from 'react';
import { setPageMeta, resetPageMeta } from '../utils/seo';

const CodeBlock = ({ children, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 px-2 py-1 text-xs rounded bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <pre
        className="bg-[#1e1e2e] text-gray-100 rounded-lg p-4 sm:p-5 overflow-x-auto text-sm leading-relaxed"
        style={{ fontFamily: 'var(--font-code)' }}
      >
        <code>{children}</code>
      </pre>
    </div>
  );
};

const IntegrationTabGroup = ({ tabs }) => {
  const [active, setActive] = useState(null);
  const current = active !== null ? tabs[active] : null;
  return (
    <div>
      <div className="flex gap-0 border-b border-[var(--border-primary)]">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActive(active === i ? null : i)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
              active === i
                ? 'text-[var(--accent-primary)]'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
            }`}
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            {tab.label}
            {active === i && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-primary)]" />
            )}
          </button>
        ))}
      </div>
      {current && (
        <>
          <CodeBlock>{current.code}</CodeBlock>
          <div className="flex items-center justify-between mt-3 px-1">
            <span className="text-xs text-[var(--text-tertiary)]" style={{ fontFamily: 'var(--font-body)' }}>
              Save as{' '}
              <code
                className="bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded text-[var(--accent-primary)]"
                style={{ fontFamily: 'var(--font-code)' }}
              >
                {current.filename}
              </code>
              {' '}in your project root
            </span>
            <a
              href={current.download}
              download
              className="text-xs text-[var(--accent-primary)] hover:text-[var(--accent-hover)] transition-colors flex items-center gap-1.5 font-medium"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </a>
          </div>
        </>
      )}
    </div>
  );
};

const TabGroup = ({ tabs }) => {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="flex gap-0 border-b border-[var(--border-primary)] mb-0">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActive(i)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
              active === i
                ? 'text-[var(--accent-primary)]'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
            }`}
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            {tab.label}
            {active === i && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-primary)]" />
            )}
          </button>
        ))}
      </div>
      <CodeBlock>{tabs[active].code}</CodeBlock>
    </div>
  );
};

const Documentation = () => {
  const API_URL = 'https://api.hermaai.com';

  useEffect(() => {
    // SEO: per-page title for docs — currently shows as bare "Herma" in search results
    setPageMeta(
      'API Documentation',
      'Herma is OpenAI-compatible — change two lines of code to start routing AI calls intelligently. Python, Node.js, and curl examples. Free $1 to start.',
      { url: 'https://hermaai.com/docs' }
    );
    return () => resetPageMeta();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-16">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4 tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            API Documentation
          </h1>
          <p
            className="text-lg text-[var(--text-secondary)] max-w-2xl"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Herma provides an OpenAI-compatible API. Change two lines of code and you're up and running.
          </p>
          <div
            className="mt-4 inline-flex items-center gap-3 px-4 py-2 bg-[var(--success)]/10 border border-[var(--success)]/20 rounded-lg"
          >
            <span className="text-[var(--success)] text-sm font-medium" style={{ fontFamily: 'var(--font-ui)' }}>
              Pricing: $2/M input tokens, $8/M output tokens | no minimums
            </span>
          </div>
        </div>

        {/* Quick Start */}
        <section className="mb-12">
          <h2
            className="text-2xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Quick Start
          </h2>

          <div className="space-y-4">
            <div
              className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-5 sm:p-6"
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              <h3
                className="text-lg font-semibold text-[var(--text-primary)] mb-2"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                1. Create an account
              </h3>
              <p className="text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>
                Sign up at{' '}
                <a href="/login" className="text-[var(--accent-primary)] underline font-medium">hermaai.com</a>{' '}
                and add credits from the Billing page.
              </p>
            </div>

            <div
              className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-5 sm:p-6"
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              <h3
                className="text-lg font-semibold text-[var(--text-primary)] mb-2"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                2. Generate an API key
              </h3>
              <p className="text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>
                Go to{' '}
                <a href="/dashboard/api-keys" className="text-[var(--accent-primary)] underline font-medium">Dashboard &rarr; API Keys</a>{' '}
                and create a key. It starts with <code className="bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded text-sm text-[var(--accent-primary)]" style={{ fontFamily: 'var(--font-code)' }}>herma_sk</code>.
                Copy it immediately — you won't see it again.
              </p>
            </div>

            <div
              className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-5 sm:p-6"
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              <h3
                className="text-lg font-semibold text-[var(--text-primary)] mb-2"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                3. Make your first request
              </h3>
              <p className="text-[var(--text-secondary)] mb-4" style={{ fontFamily: 'var(--font-body)' }}>
                Use the endpoint below with your API key. That's it.
              </p>
            </div>
          </div>
        </section>

        {/* Integrate with Coding Tools */}
        <section className="mb-12" id="ai-coding-tools">
          <h2
            className="text-2xl font-bold text-[var(--text-primary)] mb-3"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Quick Start with Coding Tools
          </h2>
          <p
            className="text-[var(--text-secondary)] mb-6"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Drop one of these files into your project root and your AI coding assistant will automatically
            use Herma for all LLM API calls — no manual configuration needed each time.
          </p>

          <IntegrationTabGroup tabs={[
            {
              label: 'Claude Code',
              filename: 'CLAUDE.md',
              download: '/integration/CLAUDE.md',
              code: `# Herma AI — API Setup Guide

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

\`\`\`python
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
\`\`\`

## Node.js

\`\`\`javascript
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
\`\`\`

## Rules

- Always use \`herma-auto\` as the model — Herma picks the best model automatically.
- Never call api.openai.com endpoints directly.
- Never hardcode API keys — always read from the HERMA_API_KEY environment variable.
- Streaming and tool/function calling are fully supported.

## Reference

- Docs: https://hermaai.com/docs
- Pricing: $2/M input tokens, $8/M output tokens`,
            },
            {
              label: 'Cursor',
              filename: '.cursorrules',
              download: '/integration/cursor-rules.txt',
              code: `# Herma AI — LLM Provider Rules

This project uses Herma as the LLM provider. Herma is fully OpenAI-compatible.

## Rules

- For ALL LLM API calls: use base URL https://api.hermaai.com/v1 and model herma-auto
- Never call api.openai.com endpoints directly
- Never hardcode API keys — always read from HERMA_API_KEY environment variable
- All standard OpenAI SDK parameters (stream, temperature, max_tokens, tools) work unchanged

## Client Setup — Python

\`\`\`python
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
\`\`\`

## Client Setup — Node.js

\`\`\`javascript
import OpenAI from "openai";
const client = new OpenAI({
  apiKey: process.env.HERMA_API_KEY,
  baseURL: "https://api.hermaai.com/v1"
});
\`\`\`

Model: always herma-auto
Docs: https://hermaai.com/docs`,
            },
            {
              label: 'Windsurf',
              filename: '.windsurfrules',
              download: '/integration/windsurf-rules.txt',
              code: `# Herma AI — LLM Provider Rules

This project uses Herma as the LLM provider. Herma is fully OpenAI-compatible.

## Rules

- For ALL LLM API calls: use base URL https://api.hermaai.com/v1 and model herma-auto
- Never call api.openai.com endpoints directly
- Never hardcode API keys — always read from HERMA_API_KEY environment variable
- All standard OpenAI SDK parameters (stream, temperature, max_tokens, tools) work unchanged

## Client Setup — Python

\`\`\`python
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
\`\`\`

## Client Setup — Node.js

\`\`\`javascript
import OpenAI from "openai";
const client = new OpenAI({
  apiKey: process.env.HERMA_API_KEY,
  baseURL: "https://api.hermaai.com/v1"
});
\`\`\`

Model: always herma-auto
Docs: https://hermaai.com/docs`,
            },
            {
              label: 'Codex / Devin / Other',
              filename: 'AGENTS.md',
              download: '/integration/AGENTS.md',
              code: `# Herma AI — Agent Integration

Herma is an OpenAI-compatible intelligent model router.
Use it as the LLM provider for all AI calls in this project.

## Configuration

| Setting  | Value                                |
|----------|--------------------------------------|
| Base URL | https://api.hermaai.com/v1           |
| Model    | herma-auto                           |
| API Key  | $HERMA_API_KEY                       |

## Python

\`\`\`python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["HERMA_API_KEY"],
    base_url="https://api.hermaai.com/v1"
)
\`\`\`

## Node.js

\`\`\`javascript
import OpenAI from "openai";
const client = new OpenAI({
  apiKey: process.env.HERMA_API_KEY,
  baseURL: "https://api.hermaai.com/v1"
});
\`\`\`

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

Docs: https://hermaai.com/docs`,
            },
          ]} />

          {/* .env.example */}
          <div className="mt-8">
            <h3
              className="text-lg font-semibold text-[var(--text-primary)] mb-3"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Environment Variables
            </h3>
            <p className="text-[var(--text-secondary)] mb-3 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
              Add this to your <code className="bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded text-[var(--accent-primary)] text-xs" style={{ fontFamily: 'var(--font-code)' }}>.env</code> file.
              Your API key is in{' '}
              <a href="/dashboard/api-keys" className="text-[var(--accent-primary)] underline">Dashboard → API Keys</a>.
            </p>
            <div className="relative">
              <CodeBlock>{`# Herma AI
# Get your key at https://hermaai.com/dashboard/api-keys
HERMA_API_KEY=herma_sk_your_api_key_here`}</CodeBlock>
              <div className="flex justify-end mt-2">
                <a
                  href="/integration/.env.example"
                  download=".env.example"
                  className="text-xs text-[var(--accent-primary)] hover:text-[var(--accent-hover)] transition-colors flex items-center gap-1.5 font-medium"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download .env.example
                </a>
              </div>
            </div>
          </div>

          {/* llms.txt note */}
          <div
            className="mt-8 bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-5"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <p className="text-sm text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>
              <strong className="text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-ui)' }}>Auto-discovery via llms.txt —</strong>{' '}
              Herma publishes a{' '}
              <a href="/llms.txt" className="text-[var(--accent-primary)] underline" target="_blank" rel="noopener noreferrer">llms.txt</a>{' '}
              file following the open standard for AI tool discovery. AI assistants that support llms.txt
              can automatically find Herma's API details, base URL, and integration examples without
              needing a configuration file in your project.
            </p>
          </div>
        </section>

        {/* Route Your AI Tool Through Herma */}
        <section className="mb-12" id="route-your-tool">
          <h2
            className="text-2xl font-bold text-[var(--text-primary)] mb-3"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Route Your AI Tool Through Herma
          </h2>
          <p
            className="text-[var(--text-secondary)] mb-6"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Instead of just using Herma in your code, you can route Claude Code, Cursor, or Windsurf
            itself through Herma — every request your AI tool makes gets intelligently routed,
            saving 60–90% automatically.
          </p>

          <TabGroup tabs={[
            {
              label: 'Claude Code',
              code: `# One-liner installer (recommended)
curl -fsSL https://api.hermaai.com/install/claude-code | bash -s -- herma_sk_YOUR_KEY

# Or add manually to ~/.zshrc or ~/.bashrc:
export ANTHROPIC_BASE_URL="https://api.hermaai.com"
export ANTHROPIC_AUTH_TOKEN="herma_sk_YOUR_KEY"
export ANTHROPIC_MODEL="herma-auto"

# Then open a new terminal and run: claude

# Note: use ANTHROPIC_AUTH_TOKEN (not ANTHROPIC_API_KEY) — this sends your key
# directly as a Bearer token and bypasses Anthropic's OAuth login flow.
# Already logged into Claude? No need to log out — AUTH_TOKEN takes priority.
# To revert: remove the three export lines and open a new terminal.`,
            },
            {
              label: 'Cursor',
              code: `# Cursor Settings → Models → OpenAI API Key section:
#
#   API Key:  herma_sk_YOUR_KEY
#   Base URL: https://api.hermaai.com/v1
#
# Or via environment (if Cursor respects shell env):
export OPENAI_API_KEY="herma_sk_YOUR_KEY"
export OPENAI_BASE_URL="https://api.hermaai.com/v1"`,
            },
            {
              label: 'Windsurf',
              code: `# Windsurf Settings → AI → Custom API:
#
#   Base URL: https://api.hermaai.com/v1
#   API Key:  herma_sk_YOUR_KEY`,
            },
            {
              label: 'Aider / Continue.dev',
              code: `# Aider
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
# }`,
            },
          ]} />

          <div className="mt-4 flex items-center justify-between px-1">
            <p className="text-xs text-[var(--text-tertiary)]" style={{ fontFamily: 'var(--font-body)' }}>
              Replace <code className="bg-[var(--bg-tertiary)] px-1 py-0.5 rounded text-[var(--accent-primary)]" style={{ fontFamily: 'var(--font-code)' }}>herma_sk_YOUR_KEY</code> with your key from{' '}
              <a href="/dashboard/api-keys" className="text-[var(--accent-primary)] underline">Dashboard → API Keys</a>.
            </p>
            <a
              href="/setup.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--accent-primary)] hover:text-[var(--accent-hover)] transition-colors flex items-center gap-1 font-medium whitespace-nowrap ml-4"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              View full setup guide →
            </a>
          </div>
        </section>

        {/* Base URL */}
        <section className="mb-12">
          <h2
            className="text-2xl font-bold text-[var(--text-primary)] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Base URL
          </h2>
          <CodeBlock>{`${API_URL}/v1`}</CodeBlock>
        </section>

        {/* Authentication */}
        <section className="mb-12">
          <h2
            className="text-2xl font-bold text-[var(--text-primary)] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Authentication
          </h2>
          <p
            className="text-[var(--text-secondary)] mb-4"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Include your API key as a Bearer token in the <code className="bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded text-sm text-[var(--accent-primary)]" style={{ fontFamily: 'var(--font-code)' }}>Authorization</code> header:
          </p>
          <CodeBlock>Authorization: Bearer herma_sk_your_api_key</CodeBlock>
        </section>

        {/* Endpoint */}
        <section className="mb-12">
          <h2
            className="text-2xl font-bold text-[var(--text-primary)] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Chat Completions
          </h2>

          <div
            className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-5 sm:p-6 mb-6"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span
                className="px-2.5 py-1 bg-[var(--success)]/10 text-[var(--success)] text-xs font-bold rounded"
                style={{ fontFamily: 'var(--font-code)' }}
              >
                POST
              </span>
              <code className="text-sm text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-code)' }}>
                /v1/chat/completions
              </code>
            </div>
            <p className="text-[var(--text-secondary)] text-sm" style={{ fontFamily: 'var(--font-body)' }}>
              OpenAI-compatible chat completions endpoint. Supports streaming.
            </p>
          </div>

          {/* Request Body */}
          <h3
            className="text-lg font-semibold text-[var(--text-primary)] mb-3"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Request Body
          </h3>

          <div
            className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] overflow-hidden mb-6"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <table className="w-full text-sm" style={{ fontFamily: 'var(--font-ui)' }}>
              <thead>
                <tr className="bg-[var(--bg-tertiary)] border-b border-[var(--border-primary)]">
                  <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Parameter</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-primary)]">
                <tr>
                  <td className="px-4 py-3"><code className="text-sm text-[var(--accent-primary)]" style={{ fontFamily: 'var(--font-code)' }}>model</code></td>
                  <td className="px-4 py-3 text-[var(--text-tertiary)]">string</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">Use <code className="bg-[var(--bg-tertiary)] px-1 rounded text-xs text-[var(--accent-primary)]" style={{ fontFamily: 'var(--font-code)' }}>herma-auto</code> for automatic model selection</td>
                </tr>
                <tr>
                  <td className="px-4 py-3"><code className="text-sm text-[var(--accent-primary)]" style={{ fontFamily: 'var(--font-code)' }}>messages</code></td>
                  <td className="px-4 py-3 text-[var(--text-tertiary)]">array</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">Array of message objects with <code className="bg-[var(--bg-tertiary)] px-1 rounded text-xs text-[var(--accent-primary)]" style={{ fontFamily: 'var(--font-code)' }}>role</code> and <code className="bg-[var(--bg-tertiary)] px-1 rounded text-xs text-[var(--accent-primary)]" style={{ fontFamily: 'var(--font-code)' }}>content</code></td>
                </tr>
                <tr>
                  <td className="px-4 py-3"><code className="text-sm text-[var(--accent-primary)]" style={{ fontFamily: 'var(--font-code)' }}>stream</code></td>
                  <td className="px-4 py-3 text-[var(--text-tertiary)]">boolean</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">Set to <code className="bg-[var(--bg-tertiary)] px-1 rounded text-xs text-[var(--accent-primary)]" style={{ fontFamily: 'var(--font-code)' }}>true</code> for streaming responses. Default: <code className="bg-[var(--bg-tertiary)] px-1 rounded text-xs text-[var(--accent-primary)]" style={{ fontFamily: 'var(--font-code)' }}>false</code></td>
                </tr>
                <tr>
                  <td className="px-4 py-3"><code className="text-sm text-[var(--accent-primary)]" style={{ fontFamily: 'var(--font-code)' }}>temperature</code></td>
                  <td className="px-4 py-3 text-[var(--text-tertiary)]">float</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">Sampling temperature (0-2). Optional</td>
                </tr>
                <tr>
                  <td className="px-4 py-3"><code className="text-sm text-[var(--accent-primary)]" style={{ fontFamily: 'var(--font-code)' }}>max_tokens</code></td>
                  <td className="px-4 py-3 text-[var(--text-tertiary)]">integer</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">Maximum tokens to generate. Optional</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Models */}
        <section className="mb-12">
          <h2
            className="text-2xl font-bold text-[var(--text-primary)] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Models
          </h2>
          <p
            className="text-[var(--text-secondary)] mb-6"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Use <code className="bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded text-sm text-[var(--accent-primary)]" style={{ fontFamily: 'var(--font-code)' }}>herma-auto</code> and
            Herma will route each request to the best model for the task — same quality, lower cost.
          </p>

          <div
            className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] overflow-hidden mb-6"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <table className="w-full text-sm" style={{ fontFamily: 'var(--font-ui)' }}>
              <thead>
                <tr className="bg-[var(--bg-tertiary)] border-b border-[var(--border-primary)]">
                  <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Model</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-primary)]">
                <tr>
                  <td className="px-4 py-3">
                    <code className="text-sm text-[var(--accent-primary)]" style={{ fontFamily: 'var(--font-code)' }}>herma-auto</code>
                  </td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">Automatic routing — Herma picks the best model for each request</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            className="bg-[var(--accent-muted)] border border-[var(--border-accent)] p-5 sm:p-6"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <p className="text-sm text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>
              <strong className="text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-ui)' }}>How auto-routing works:</strong>{' '}
              Herma analyzes each request and routes it to the model that delivers the best quality for that specific task.
              Simple questions go to efficient models. Complex reasoning, code generation, and multi-step tasks go to frontier models.
              You get top-tier quality at a fraction of the cost.
            </p>
          </div>
        </section>

        {/* Response Format */}
        <section className="mb-12">
          <h2
            className="text-2xl font-bold text-[var(--text-primary)] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Response Format
          </h2>
          <p
            className="text-[var(--text-secondary)] mb-4"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Responses follow the standard OpenAI chat completion format:
          </p>
          <CodeBlock>{`{
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
}`}</CodeBlock>
        </section>

        {/* Error Handling */}
        <section className="mb-12">
          <h2
            className="text-2xl font-bold text-[var(--text-primary)] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Error Codes
          </h2>
          <div
            className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] overflow-hidden"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <table className="w-full text-sm" style={{ fontFamily: 'var(--font-ui)' }}>
              <thead>
                <tr className="bg-[var(--bg-tertiary)] border-b border-[var(--border-primary)]">
                  <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Code</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-primary)]">
                <tr>
                  <td className="px-4 py-3"><code className="text-sm font-bold text-[var(--accent-primary)]" style={{ fontFamily: 'var(--font-code)' }}>401</code></td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">Invalid or missing API key</td>
                </tr>
                <tr>
                  <td className="px-4 py-3"><code className="text-sm font-bold text-[var(--accent-primary)]" style={{ fontFamily: 'var(--font-code)' }}>402</code></td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">Insufficient credits — add more from the Billing page</td>
                </tr>
                <tr>
                  <td className="px-4 py-3"><code className="text-sm font-bold text-[var(--accent-primary)]" style={{ fontFamily: 'var(--font-code)' }}>429</code></td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">Rate limit exceeded — wait and retry</td>
                </tr>
                <tr>
                  <td className="px-4 py-3"><code className="text-sm font-bold text-[var(--accent-primary)]" style={{ fontFamily: 'var(--font-code)' }}>500</code></td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">Server error — retry or <a href="mailto:niko.barciak@hermaai.com" className="text-[var(--accent-primary)] hover:underline">contact support</a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Classify Endpoint */}
        <section className="mb-12">
          <h2
            className="text-2xl font-bold text-[var(--text-primary)] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Test the Router
          </h2>
          <p className="text-[var(--text-secondary)] mb-4" style={{ fontFamily: 'var(--font-body)' }}>
            See exactly what the router would do with your queries before committing.
            The classify endpoint is free and requires no authentication.
          </p>
          <CodeBlock language="bash">{`curl -X POST https://api.hermaai.com/v1/classify \\
  -H "Content-Type: application/json" \\
  -d '{
    "messages": [
      {"role": "user", "content": "Implement a distributed cache with LRU eviction"}
    ]
  }'`}</CodeBlock>
          <p className="text-[var(--text-tertiary)] mt-3 mb-4 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
            Response:
          </p>
          <CodeBlock language="json">{`{
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
}`}</CodeBlock>
          <p className="text-[var(--text-secondary)] mt-4 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
            Hard queries stay on frontier models (no savings, no quality risk).
            Try a simpler query to see the savings.
          </p>
        </section>

        {/* List Models */}
        <section className="mb-12">
          <h2
            className="text-2xl font-bold text-[var(--text-primary)] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            List Available Models
          </h2>
          <p className="text-[var(--text-secondary)] mb-4" style={{ fontFamily: 'var(--font-body)' }}>
            The standard OpenAI <code className="bg-[var(--bg-secondary)] px-1.5 py-0.5 rounded text-[var(--accent-primary)] text-sm">/v1/models</code> endpoint
            lets tools like Cursor, Continue, and Cody auto-discover available models.
          </p>
          <CodeBlock language="bash">{`curl https://api.hermaai.com/v1/models \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</CodeBlock>
          <p className="text-[var(--text-secondary)] mt-3 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
            Returns <code className="bg-[var(--bg-secondary)] px-1 py-0.5 rounded text-[var(--accent-primary)] text-sm">herma-auto</code> (the
            intelligent router) plus all supported upstream models.
          </p>
        </section>

        {/* Examples */}
        <section className="mb-12">
          <h2
            className="text-2xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Examples
          </h2>

          <h3
            className="text-lg font-semibold text-[var(--text-primary)] mb-3"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Basic Request
          </h3>
          <div className="mb-8">
            <TabGroup tabs={[
              { label: 'cURL', code: `curl ${API_URL}/v1/chat/completions \\
  -H "Authorization: Bearer herma_sk_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "herma-auto",
    "messages": [
      {"role": "user", "content": "What is machine learning?"}
    ]
  }'` },
              { label: 'Python', code: `from openai import OpenAI

client = OpenAI(
    api_key="herma_sk_your_api_key",
    base_url="${API_URL}/v1"
)

response = client.chat.completions.create(
    model="herma-auto",
    messages=[
        {"role": "user", "content": "What is machine learning?"}
    ]
)

print(response.choices[0].message.content)` },
              { label: 'Node.js', code: `import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "herma_sk_your_api_key",
  baseURL: "${API_URL}/v1"
});

const response = await client.chat.completions.create({
  model: "herma-auto",
  messages: [
    { role: "user", content: "What is machine learning?" }
  ]
});

console.log(response.choices[0].message.content);` },
              { label: 'fetch', code: `const response = await fetch("${API_URL}/v1/chat/completions", {
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
console.log(data.choices[0].message.content);` },
            ]} />
          </div>

          <h3
            className="text-lg font-semibold text-[var(--text-primary)] mb-3"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Streaming
          </h3>
          <div className="mb-8">
            <TabGroup tabs={[
              { label: 'Python', code: `from openai import OpenAI

client = OpenAI(
    api_key="herma_sk_your_api_key",
    base_url="${API_URL}/v1"
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
        print(chunk.choices[0].delta.content, end="")` },
              { label: 'Node.js', code: `import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "herma_sk_your_api_key",
  baseURL: "${API_URL}/v1"
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
}` },
              { label: 'fetch (SSE)', code: `const response = await fetch("${API_URL}/v1/chat/completions", {
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
  // Parse SSE lines: "data: {...}"
  for (const line of text.split("\\n")) {
    if (line.startsWith("data: ") && line.slice(6) !== "[DONE]") {
      const chunk = JSON.parse(line.slice(6));
      const content = chunk.choices?.[0]?.delta?.content;
      if (content) process.stdout.write(content);
    }
  }
}` },
            ]} />
          </div>
        </section>

        {/* Rate Limits */}
        <section className="mb-12">
          <h2
            className="text-2xl font-bold text-[var(--text-primary)] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Rate Limits
          </h2>
          <div
            className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-5 sm:p-6"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <ul className="space-y-2 text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent-primary)] mt-1">&#8226;</span>
                <span><strong className="text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-ui)' }}>500 requests per minute</strong> per API key</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent-primary)] mt-1">&#8226;</span>
                <span><strong className="text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-ui)' }}>50 concurrent requests</strong> per account</span>
              </li>
            </ul>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Documentation;

import React, { useState } from 'react';

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

const Documentation = () => {
  const API_URL = 'https://routingtesting-production.up.railway.app';

  return (
    <div className="min-h-screen bg-[var(--primary-bg)] pt-24 pb-16">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--highlight-color)] mb-4 tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            API Documentation
          </h1>
          <p
            className="text-lg text-[var(--highlight-color)]/70 max-w-2xl"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Herma provides an OpenAI-compatible API. Change two lines of code and you're up and running.
          </p>
        </div>

        {/* Quick Start */}
        <section className="mb-12">
          <h2
            className="text-2xl font-bold text-[var(--highlight-color)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Quick Start
          </h2>

          <div className="space-y-4">
            <div
              className="bg-white/90 backdrop-blur-sm border border-[var(--secondary-bg)]/20 p-5 sm:p-6"
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              <h3
                className="text-lg font-semibold text-[var(--highlight-color)] mb-2"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                1. Create an account
              </h3>
              <p className="text-[var(--highlight-color)]/70" style={{ fontFamily: 'var(--font-body)' }}>
                Sign up at{' '}
                <a href="/#/login" className="text-[var(--highlight-color)] underline font-medium">hermaai.com</a>{' '}
                and add credits from the Billing page.
              </p>
            </div>

            <div
              className="bg-white/90 backdrop-blur-sm border border-[var(--secondary-bg)]/20 p-5 sm:p-6"
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              <h3
                className="text-lg font-semibold text-[var(--highlight-color)] mb-2"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                2. Generate an API key
              </h3>
              <p className="text-[var(--highlight-color)]/70" style={{ fontFamily: 'var(--font-body)' }}>
                Go to{' '}
                <a href="/#/dashboard/api-keys" className="text-[var(--highlight-color)] underline font-medium">Dashboard &rarr; API Keys</a>{' '}
                and create a key. It starts with <code className="bg-[var(--secondary-bg)]/20 px-1.5 py-0.5 rounded text-sm" style={{ fontFamily: 'var(--font-code)' }}>hk-</code>.
                Copy it immediately — you won't see it again.
              </p>
            </div>

            <div
              className="bg-white/90 backdrop-blur-sm border border-[var(--secondary-bg)]/20 p-5 sm:p-6"
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              <h3
                className="text-lg font-semibold text-[var(--highlight-color)] mb-2"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                3. Make your first request
              </h3>
              <p className="text-[var(--highlight-color)]/70 mb-4" style={{ fontFamily: 'var(--font-body)' }}>
                Use the endpoint below with your API key. That's it.
              </p>
            </div>
          </div>
        </section>

        {/* Base URL */}
        <section className="mb-12">
          <h2
            className="text-2xl font-bold text-[var(--highlight-color)] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Base URL
          </h2>
          <CodeBlock>{API_URL}/v1</CodeBlock>
        </section>

        {/* Authentication */}
        <section className="mb-12">
          <h2
            className="text-2xl font-bold text-[var(--highlight-color)] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Authentication
          </h2>
          <p
            className="text-[var(--highlight-color)]/70 mb-4"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Include your API key as a Bearer token in the <code className="bg-[var(--secondary-bg)]/20 px-1.5 py-0.5 rounded text-sm" style={{ fontFamily: 'var(--font-code)' }}>Authorization</code> header:
          </p>
          <CodeBlock>Authorization: Bearer hk-your-api-key</CodeBlock>
        </section>

        {/* Endpoint */}
        <section className="mb-12">
          <h2
            className="text-2xl font-bold text-[var(--highlight-color)] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Chat Completions
          </h2>

          <div
            className="bg-white/90 backdrop-blur-sm border border-[var(--secondary-bg)]/20 p-5 sm:p-6 mb-6"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span
                className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded"
                style={{ fontFamily: 'var(--font-code)' }}
              >
                POST
              </span>
              <code className="text-sm text-[var(--highlight-color)]" style={{ fontFamily: 'var(--font-code)' }}>
                /v1/chat/completions
              </code>
            </div>
            <p className="text-[var(--highlight-color)]/70 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
              OpenAI-compatible chat completions endpoint. Supports streaming.
            </p>
          </div>

          {/* Request Body */}
          <h3
            className="text-lg font-semibold text-[var(--highlight-color)] mb-3"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Request Body
          </h3>

          <div
            className="bg-white/90 backdrop-blur-sm border border-[var(--secondary-bg)]/20 overflow-hidden mb-6"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <table className="w-full text-sm" style={{ fontFamily: 'var(--font-ui)' }}>
              <thead>
                <tr className="bg-[var(--secondary-bg)]/10 border-b border-[var(--secondary-bg)]/20">
                  <th className="text-left px-4 py-3 text-xs font-medium text-[var(--highlight-color)]/60 uppercase tracking-wider">Parameter</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[var(--highlight-color)]/60 uppercase tracking-wider">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[var(--highlight-color)]/60 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--secondary-bg)]/10">
                <tr>
                  <td className="px-4 py-3"><code className="text-sm" style={{ fontFamily: 'var(--font-code)' }}>model</code></td>
                  <td className="px-4 py-3 text-[var(--highlight-color)]/60">string</td>
                  <td className="px-4 py-3 text-[var(--highlight-color)]/70">Use <code className="bg-[var(--secondary-bg)]/20 px-1 rounded text-xs" style={{ fontFamily: 'var(--font-code)' }}>herma-auto</code> for automatic model selection</td>
                </tr>
                <tr>
                  <td className="px-4 py-3"><code className="text-sm" style={{ fontFamily: 'var(--font-code)' }}>messages</code></td>
                  <td className="px-4 py-3 text-[var(--highlight-color)]/60">array</td>
                  <td className="px-4 py-3 text-[var(--highlight-color)]/70">Array of message objects with <code className="bg-[var(--secondary-bg)]/20 px-1 rounded text-xs" style={{ fontFamily: 'var(--font-code)' }}>role</code> and <code className="bg-[var(--secondary-bg)]/20 px-1 rounded text-xs" style={{ fontFamily: 'var(--font-code)' }}>content</code></td>
                </tr>
                <tr>
                  <td className="px-4 py-3"><code className="text-sm" style={{ fontFamily: 'var(--font-code)' }}>stream</code></td>
                  <td className="px-4 py-3 text-[var(--highlight-color)]/60">boolean</td>
                  <td className="px-4 py-3 text-[var(--highlight-color)]/70">Set to <code className="bg-[var(--secondary-bg)]/20 px-1 rounded text-xs" style={{ fontFamily: 'var(--font-code)' }}>true</code> for streaming responses. Default: <code className="bg-[var(--secondary-bg)]/20 px-1 rounded text-xs" style={{ fontFamily: 'var(--font-code)' }}>false</code></td>
                </tr>
                <tr>
                  <td className="px-4 py-3"><code className="text-sm" style={{ fontFamily: 'var(--font-code)' }}>temperature</code></td>
                  <td className="px-4 py-3 text-[var(--highlight-color)]/60">float</td>
                  <td className="px-4 py-3 text-[var(--highlight-color)]/70">Sampling temperature (0-2). Optional</td>
                </tr>
                <tr>
                  <td className="px-4 py-3"><code className="text-sm" style={{ fontFamily: 'var(--font-code)' }}>max_tokens</code></td>
                  <td className="px-4 py-3 text-[var(--highlight-color)]/60">integer</td>
                  <td className="px-4 py-3 text-[var(--highlight-color)]/70">Maximum tokens to generate. Optional</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Examples */}
        <section className="mb-12">
          <h2
            className="text-2xl font-bold text-[var(--highlight-color)] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Examples
          </h2>

          {/* cURL */}
          <h3
            className="text-lg font-semibold text-[var(--highlight-color)] mb-3"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            cURL
          </h3>
          <div className="mb-8">
            <CodeBlock>{`curl ${API_URL}/v1/chat/completions \\
  -H "Authorization: Bearer hk-your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "herma-auto",
    "messages": [
      {"role": "user", "content": "What is machine learning?"}
    ]
  }'`}</CodeBlock>
          </div>

          {/* Python */}
          <h3
            className="text-lg font-semibold text-[var(--highlight-color)] mb-3"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Python (OpenAI SDK)
          </h3>
          <div className="mb-8">
            <CodeBlock>{`from openai import OpenAI

client = OpenAI(
    api_key="hk-your-api-key",
    base_url="${API_URL}/v1"
)

response = client.chat.completions.create(
    model="herma-auto",
    messages=[
        {"role": "user", "content": "What is machine learning?"}
    ]
)

print(response.choices[0].message.content)`}</CodeBlock>
          </div>

          {/* Python Streaming */}
          <h3
            className="text-lg font-semibold text-[var(--highlight-color)] mb-3"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Python (Streaming)
          </h3>
          <div className="mb-8">
            <CodeBlock>{`from openai import OpenAI

client = OpenAI(
    api_key="hk-your-api-key",
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
        print(chunk.choices[0].delta.content, end="")`}</CodeBlock>
          </div>

          {/* JavaScript */}
          <h3
            className="text-lg font-semibold text-[var(--highlight-color)] mb-3"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            JavaScript (Node.js)
          </h3>
          <div className="mb-8">
            <CodeBlock>{`import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "hk-your-api-key",
  baseURL: "${API_URL}/v1"
});

const response = await client.chat.completions.create({
  model: "herma-auto",
  messages: [
    { role: "user", content: "What is machine learning?" }
  ]
});

console.log(response.choices[0].message.content);`}</CodeBlock>
          </div>

          {/* JavaScript fetch */}
          <h3
            className="text-lg font-semibold text-[var(--highlight-color)] mb-3"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            JavaScript (fetch)
          </h3>
          <div className="mb-8">
            <CodeBlock>{`const response = await fetch("${API_URL}/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": "Bearer hk-your-api-key",
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
console.log(data.choices[0].message.content);`}</CodeBlock>
          </div>
        </section>

        {/* Response Format */}
        <section className="mb-12">
          <h2
            className="text-2xl font-bold text-[var(--highlight-color)] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Response Format
          </h2>
          <p
            className="text-[var(--highlight-color)]/70 mb-4"
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
            className="text-2xl font-bold text-[var(--highlight-color)] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Error Codes
          </h2>
          <div
            className="bg-white/90 backdrop-blur-sm border border-[var(--secondary-bg)]/20 overflow-hidden"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <table className="w-full text-sm" style={{ fontFamily: 'var(--font-ui)' }}>
              <thead>
                <tr className="bg-[var(--secondary-bg)]/10 border-b border-[var(--secondary-bg)]/20">
                  <th className="text-left px-4 py-3 text-xs font-medium text-[var(--highlight-color)]/60 uppercase tracking-wider">Code</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[var(--highlight-color)]/60 uppercase tracking-wider">Meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--secondary-bg)]/10">
                <tr>
                  <td className="px-4 py-3"><code className="text-sm font-bold" style={{ fontFamily: 'var(--font-code)' }}>401</code></td>
                  <td className="px-4 py-3 text-[var(--highlight-color)]/70">Invalid or missing API key</td>
                </tr>
                <tr>
                  <td className="px-4 py-3"><code className="text-sm font-bold" style={{ fontFamily: 'var(--font-code)' }}>402</code></td>
                  <td className="px-4 py-3 text-[var(--highlight-color)]/70">Insufficient credits — add more from the Billing page</td>
                </tr>
                <tr>
                  <td className="px-4 py-3"><code className="text-sm font-bold" style={{ fontFamily: 'var(--font-code)' }}>429</code></td>
                  <td className="px-4 py-3 text-[var(--highlight-color)]/70">Rate limit exceeded — wait and retry</td>
                </tr>
                <tr>
                  <td className="px-4 py-3"><code className="text-sm font-bold" style={{ fontFamily: 'var(--font-code)' }}>500</code></td>
                  <td className="px-4 py-3 text-[var(--highlight-color)]/70">Server error — retry or contact support</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Rate Limits */}
        <section className="mb-12">
          <h2
            className="text-2xl font-bold text-[var(--highlight-color)] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Rate Limits
          </h2>
          <div
            className="bg-white/90 backdrop-blur-sm border border-[var(--secondary-bg)]/20 p-5 sm:p-6"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <ul className="space-y-2 text-[var(--highlight-color)]/70" style={{ fontFamily: 'var(--font-body)' }}>
              <li className="flex items-start gap-2">
                <span className="text-[var(--highlight-color)] mt-1">&#8226;</span>
                <span><strong style={{ fontFamily: 'var(--font-ui)' }}>60 requests per minute</strong> per API key</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--highlight-color)] mt-1">&#8226;</span>
                <span><strong style={{ fontFamily: 'var(--font-ui)' }}>5 concurrent requests</strong> per account</span>
              </li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div
            className="bg-gradient-to-br from-[var(--highlight-color)] to-indigo-700 p-8 sm:p-10"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <h2
              className="text-2xl font-bold text-white mb-3"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Ready to get started?
            </h2>
            <p
              className="text-blue-100 mb-6"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Create an account, add credits, and start making API calls in minutes.
            </p>
            <a
              href="/#/login"
              className="inline-block px-8 py-3 bg-white text-[var(--highlight-color)] font-semibold rounded-full hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Get Started
            </a>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Documentation;

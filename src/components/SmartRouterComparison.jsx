import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './chat/CodeBlock';
import { streamChat, streamDemoChat } from '../services/hermaApi';
import { useHermaAuth } from '../context/HermaAuthContext';

const ComparisonMarkdown = ({ content }) => (
  <div className="prose prose-sm prose-invert max-w-none text-[var(--text-primary)]">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          if (!inline && (match || String(children).includes('\n'))) {
            return (
              <div className="not-prose my-3 rounded-xl overflow-hidden border border-[var(--border-secondary)]">
                <CodeBlock language={match ? match[1] : ''}>
                  {String(children).replace(/\n$/, '')}
                </CodeBlock>
              </div>
            );
          }
          return (
            <code
              className="px-1 py-0.5 bg-[var(--bg-tertiary)] text-[var(--accent-primary)] rounded text-xs border border-[var(--border-secondary)]"
              style={{ fontFamily: 'var(--font-code)' }}
              {...props}
            >
              {children}
            </code>
          );
        },
        p({ children }) {
          return <p className="mb-3 last:mb-0 leading-relaxed text-[var(--text-primary)]">{children}</p>;
        },
        ul({ children }) {
          return <ul className="list-disc pl-4 mb-3 space-y-1 marker:text-[var(--accent-primary)]">{children}</ul>;
        },
        ol({ children }) {
          return <ol className="list-decimal pl-4 mb-3 space-y-1">{children}</ol>;
        },
        li({ children }) {
          return <li className="pl-0.5">{children}</li>;
        },
        a({ href, children }) {
          return (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-[var(--accent-primary)] underline decoration-[var(--accent-primary)]/30 hover:decoration-[var(--accent-primary)]">
              {children}
            </a>
          );
        },
        blockquote({ children }) {
          return <blockquote className="border-l-3 border-[var(--accent-primary)] pl-3 my-3 italic text-[var(--text-secondary)]">{children}</blockquote>;
        },
        h1({ children }) { return <h1 className="text-lg font-bold mt-4 mb-2 text-[var(--text-primary)]">{children}</h1>; },
        h2({ children }) { return <h2 className="text-base font-bold mt-3 mb-2 text-[var(--text-primary)]">{children}</h2>; },
        h3({ children }) { return <h3 className="text-sm font-bold mt-3 mb-1 text-[var(--text-primary)]">{children}</h3>; },
        table({ children }) {
          return (
            <div className="overflow-x-auto my-3 rounded-lg border border-[var(--border-secondary)]">
              <table className="min-w-full divide-y divide-[var(--border-secondary)] text-xs">{children}</table>
            </div>
          );
        },
        thead({ children }) { return <thead className="bg-[var(--bg-tertiary)]">{children}</thead>; },
        tbody({ children }) { return <tbody className="divide-y divide-[var(--border-secondary)]">{children}</tbody>; },
        th({ children }) { return <th className="px-3 py-2 text-left text-xs font-bold text-[var(--text-secondary)]">{children}</th>; },
        td({ children }) { return <td className="px-3 py-2 text-xs text-[var(--text-tertiary)]">{children}</td>; },
        hr() { return <hr className="my-4 border-[var(--border-secondary)]" />; },
      }}
    >
      {content}
    </ReactMarkdown>
  </div>
);

// Herma pricing: $2/1M input, $8/1M output
const HERMA_INPUT_PRICE = 2.0;   // per 1M tokens
const HERMA_OUTPUT_PRICE = 8.0;  // per 1M tokens

const MAX_DEMO_QUERIES = 2;
const DEMO_STORAGE_KEY = 'herma_demo_queries';

// Fallback models if OpenRouter API is unavailable
const FALLBACK_MODELS = [
  { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'OpenAI', promptPrice: 2.5, completionPrice: 10 },
  { id: 'anthropic/claude-sonnet-4', name: 'Claude Sonnet 4', provider: 'Anthropic', promptPrice: 3, completionPrice: 15 },
  { id: 'google/gemini-2.5-pro-preview-05-06', name: 'Gemini 2.5 Pro', provider: 'Google', promptPrice: 2.5, completionPrice: 15 },
  { id: 'openai/o3', name: 'o3', provider: 'OpenAI', promptPrice: 2, completionPrice: 8 },
];

function formatCost(promptTokens, completionTokens, promptPricePerM, completionPricePerM) {
  const cost = (promptTokens / 1_000_000) * promptPricePerM + (completionTokens / 1_000_000) * completionPricePerM;
  return cost < 0.01 ? `$${cost.toFixed(5)}` : `$${cost.toFixed(4)}`;
}

const SmartRouterComparison = () => {
  const [models, setModels] = useState(FALLBACK_MODELS);
  const [query, setQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState(FALLBACK_MODELS[0].id);
  const [isProcessing, setIsProcessing] = useState(false);
  const { isAuthenticated } = useHermaAuth();

  const [demoQueriesUsed, setDemoQueriesUsed] = useState(() => {
    return parseInt(sessionStorage.getItem(DEMO_STORAGE_KEY) || '0', 10);
  });
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const [hermaResult, setHermaResult] = useState({ content: '', cost: null, model: 'Herma Router', time: 0, loading: false, error: null, thinking: false });
  const [stdResult, setStdResult] = useState({ content: '', cost: null, model: FALLBACK_MODELS[0].name, time: 0, loading: false, error: null, thinking: false });

  // Clear demo counter when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      setDemoQueriesUsed(0);
      sessionStorage.removeItem(DEMO_STORAGE_KEY);
      setShowLoginPrompt(false);
    }
  }, [isAuthenticated]);

  // Fetch models from OpenRouter and filter to premium models where Herma is cheaper
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('https://openrouter.ai/api/v1/models');
        if (!res.ok) return;
        const data = await res.json();
        const filtered = (data.data || [])
          .filter(m => {
            const prompt = parseFloat(m.pricing?.prompt || '0') * 1_000_000; // per 1M tokens
            const completion = parseFloat(m.pricing?.completion || '0') * 1_000_000;
            // Only show models where Herma saves on both input AND output
            return prompt > HERMA_INPUT_PRICE && completion > HERMA_OUTPUT_PRICE;
          })
          .filter(m => {
            // Only include models from our allowed provider families
            return /^(openai|anthropic|google|deepseek|mistralai|meta-llama)\//.test(m.id);
          })
          .filter(m => {
            // Exclude free tiers, beta, and niche variants
            return !m.id.includes(':free') && !m.id.includes(':beta');
          })
          .map(m => ({
            id: m.id,
            name: m.name.replace(/^[^:]+:\s*/, ''), // Strip "Provider: " prefix
            provider: m.id.split('/')[0],
            promptPrice: parseFloat(m.pricing.prompt) * 1_000_000,
            completionPrice: parseFloat(m.pricing.completion) * 1_000_000,
          }))
          .sort((a, b) => b.completionPrice - a.completionPrice); // Most expensive first

        if (!cancelled && filtered.length > 0) {
          setModels(filtered);
          setSelectedModel(filtered[0].id);
          setStdResult(prev => ({ ...prev, model: filtered[0].name }));
        }
      } catch {
        // Keep fallback models
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const examples = [
    "Summarize this quarterly report",
    "Generate a Python script for data analysis",
    "Draft a cold email to a potential client"
  ];

  const selectedModelObj = models.find(m => m.id === selectedModel) || models[0];

  const handleCompare = async () => {
    if (!query) return;

    // Gate unauthenticated users after free comparisons
    if (!isAuthenticated && demoQueriesUsed >= MAX_DEMO_QUERIES) {
      setShowLoginPrompt(true);
      return;
    }

    setIsProcessing(true);

    setHermaResult({ content: '', cost: null, model: 'Herma Router', time: 0, loading: true, error: null, thinking: false });
    setStdResult({ content: '', cost: null, model: selectedModelObj.name, time: 0, loading: true, error: null, thinking: false });

    const startTime = Date.now();

    // Choose stream function based on auth state
    const chatFn = isAuthenticated ? streamChat : streamDemoChat;
    const chatOpts = isAuthenticated ? { skipMemory: true } : {};

    // 1. Herma Router (auto-routed)
    const hermaPromise = (async () => {
      try {
        let content = '';
        await chatFn([{ role: 'user', content: query }], {
          model: 'openrouter/auto',
          ...chatOpts,
          onChunk: (delta) => {
            if (delta.type === 'reasoning') {
              setHermaResult(prev => ({ ...prev, thinking: true }));
            } else if (delta.type === 'content') {
              content += delta.content;
              setHermaResult(prev => ({ ...prev, content, thinking: false }));
            }
          },
          onDone: (usage) => {
            const promptTokens = usage?.prompt_tokens || 0;
            const completionTokens = usage?.completion_tokens || 0;
            const cost = formatCost(promptTokens, completionTokens, HERMA_INPUT_PRICE, HERMA_OUTPUT_PRICE);
            setHermaResult(prev => ({
              ...prev,
              loading: false,
              time: ((Date.now() - startTime) / 1000).toFixed(2),
              cost
            }));
          },
          onError: (err) => {
            setHermaResult(prev => ({ ...prev, loading: false, error: err.message }));
          }
        });
      } catch (err) {
        setHermaResult(prev => ({ ...prev, loading: false, error: err.message }));
      }
    })();

    // 2. Selected model (specific model)
    const stdPromise = (async () => {
      try {
        let content = '';
        await chatFn([{ role: 'user', content: query }], {
          model: selectedModel,
          ...chatOpts,
          onChunk: (delta) => {
            if (delta.type === 'reasoning') {
              setStdResult(prev => ({ ...prev, thinking: true }));
            } else if (delta.type === 'content') {
              content += delta.content;
              setStdResult(prev => ({ ...prev, content, thinking: false }));
            }
          },
          onDone: (usage) => {
            // Show what the user would pay at the model's direct pricing
            const promptTokens = usage?.prompt_tokens || 0;
            const completionTokens = usage?.completion_tokens || 0;
            const cost = formatCost(promptTokens, completionTokens, selectedModelObj.promptPrice, selectedModelObj.completionPrice);
            setStdResult(prev => ({
              ...prev,
              loading: false,
              time: ((Date.now() - startTime) / 1000).toFixed(2),
              cost
            }));
          },
          onError: (err) => {
            setStdResult(prev => ({ ...prev, loading: false, error: err.message }));
          }
        });
      } catch (err) {
        setStdResult(prev => ({ ...prev, loading: false, error: err.message }));
      }
    })();

    await Promise.all([hermaPromise, stdPromise]);
    setIsProcessing(false);

    // Increment demo counter for unauthenticated users
    if (!isAuthenticated) {
      const newCount = demoQueriesUsed + 1;
      setDemoQueriesUsed(newCount);
      sessionStorage.setItem(DEMO_STORAGE_KEY, String(newCount));
    }
  };

  const providerLabel = (provider) => {
    const labels = { openai: 'OpenAI', anthropic: 'Anthropic', google: 'Google', deepseek: 'DeepSeek', mistralai: 'Mistral', 'meta-llama': 'Meta' };
    return labels[provider] || provider;
  };

  const demoRemaining = MAX_DEMO_QUERIES - demoQueriesUsed;

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 mb-20 animate-fade-up relative">
      <div className="bg-[var(--bg-secondary)] rounded-2xl shadow-xl border border-[var(--border-secondary)] overflow-hidden">
        {/* Header / Input Area */}
        <div className="p-6 sm:p-8 border-b border-[var(--border-secondary)] bg-[var(--bg-tertiary)]/50">
          <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] text-center mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            See the Difference
          </h3>

          {/* Model Selector */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-5 px-2">
            <span className="text-sm font-medium text-[var(--text-secondary)] whitespace-nowrap">Compare against:</span>
            <select
              value={selectedModel}
              onChange={(e) => {
                setSelectedModel(e.target.value);
                const m = models.find(m => m.id === e.target.value);
                setStdResult(prev => ({ ...prev, model: m?.name || e.target.value }));
              }}
              className="w-full sm:w-auto px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] cursor-pointer"
            >
              {models.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({providerLabel(m.provider)})</option>
              ))}
            </select>
          </div>

          <div className="relative max-w-3xl mx-auto">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question..."
              className="w-full px-5 py-4 pr-32 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] shadow-sm text-lg"
              onKeyDown={(e) => e.key === 'Enter' && handleCompare()}
            />
            <button
              onClick={handleCompare}
              disabled={isProcessing || !query}
              className="absolute right-2 top-2 bottom-2 px-6 bg-[var(--accent-primary)] text-white font-semibold rounded-lg hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Routing...' : 'Compare'}
            </button>
          </div>

          {/* Examples */}
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {examples.map((ex, i) => (
              <button
                key={i}
                onClick={() => setQuery(ex)}
                className="text-xs sm:text-sm px-3 py-1.5 rounded-full bg-[var(--bg-primary)] border border-[var(--border-secondary)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors"
              >
                "{ex}"
              </button>
            ))}
          </div>

          {/* Free comparisons remaining indicator */}
          {!isAuthenticated && (
            <p className="text-center text-xs text-[var(--text-tertiary)] mt-3">
              {demoRemaining > 0
                ? `${demoRemaining} free comparison${demoRemaining !== 1 ? 's' : ''} remaining`
                : 'Sign up for unlimited comparisons'}
            </p>
          )}
        </div>

        {/* Results Comparison Area */}
        <div className="grid md:grid-cols-2 gap-0 relative">
          {/* Vertical Divider for Desktop */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-[var(--border-secondary)] -ml-px z-10"></div>

          {/* Selected Model Side */}
          <div className="p-6 sm:p-8 bg-[var(--bg-secondary)] relative group min-h-[300px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs">AI</div>
                <span className="font-semibold text-[var(--text-secondary)]">{selectedModelObj.name}</span>
              </div>
              <span className="text-xs font-mono text-[var(--text-tertiary)]">Direct Pricing</span>
            </div>

            <div className="flex-grow text-[var(--text-primary)] leading-relaxed mb-6 text-sm sm:text-base overflow-y-auto max-h-[500px]">
              {stdResult.loading && !stdResult.content ? (
                stdResult.thinking ? (
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                    <span className="text-sm italic">Thinking...</span>
                  </div>
                ) : (
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-gray-200/50 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200/50 rounded w-full"></div>
                    <div className="h-4 bg-gray-200/50 rounded w-5/6"></div>
                  </div>
                )
              ) : stdResult.loading && stdResult.content ? (
                <ComparisonMarkdown content={stdResult.content} />
              ) : stdResult.error ? (
                <div className="text-[var(--error)] bg-[var(--error)]/5 p-4 rounded-lg text-center text-sm">
                  {stdResult.error}
                </div>
              ) : stdResult.content ? (
                <ComparisonMarkdown content={stdResult.content} />
              ) : (
                <p className="text-[var(--text-tertiary)] italic">Waiting for input...</p>
              )}
            </div>

            {/* Stats Card - Standard */}
            <div className={`transition-opacity duration-300 ${stdResult.cost ? 'opacity-100' : 'opacity-0'}`}>
              <div className="bg-[var(--bg-primary)] rounded-xl p-4 border border-[var(--border-secondary)]">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-sm text-[var(--text-tertiary)]">Direct Cost</span>
                  <span className="text-xl font-bold text-gray-500">{stdResult.cost}</span>
                </div>
                <div className="flex justify-between text-xs text-[var(--text-tertiary)] mt-2">
                  <span>Time: {stdResult.time}s</span>
                  <span>Model: {selectedModelObj.name}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Herma Router Side */}
          <div className="p-6 sm:p-8 bg-[var(--bg-secondary)]/50 relative overflow-hidden min-h-[300px] flex flex-col">
            {/* Highlight Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-primary)]/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[var(--accent-primary)] flex items-center justify-center text-white font-bold text-xs">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <span className="font-semibold text-[var(--accent-primary)]">Herma Router</span>
              </div>
              <span className="text-xs font-mono text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 px-2 py-0.5 rounded-full">Herma Pricing</span>
            </div>

            <div className="flex-grow text-[var(--text-primary)] leading-relaxed mb-6 relative z-10 text-sm sm:text-base overflow-y-auto max-h-[500px]">
              {hermaResult.loading && !hermaResult.content ? (
                hermaResult.thinking ? (
                  <div className="flex items-center gap-2 text-[var(--accent-primary)]">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-[var(--accent-primary)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-[var(--accent-primary)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-[var(--accent-primary)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                    <span className="text-sm italic">Thinking...</span>
                  </div>
                ) : (
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-gray-200/50 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200/50 rounded w-full"></div>
                    <div className="h-4 bg-gray-200/50 rounded w-5/6"></div>
                  </div>
                )
              ) : hermaResult.loading && hermaResult.content ? (
                <ComparisonMarkdown content={hermaResult.content} />
              ) : hermaResult.error ? (
                <div className="text-[var(--error)] bg-[var(--error)]/5 p-4 rounded-lg text-center text-sm">
                  {hermaResult.error}
                </div>
              ) : hermaResult.content ? (
                <ComparisonMarkdown content={hermaResult.content} />
              ) : (
                <p className="text-[var(--text-tertiary)] italic">Waiting for input...</p>
              )}
            </div>

            {/* Stats Card - Herma */}
            <div className={`transition-opacity duration-300 ${hermaResult.cost ? 'opacity-100' : 'opacity-0'} relative z-10`}>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-[var(--accent-primary)] shadow-[0_0_20px_rgba(255,255,255,0.5)] dark:shadow-none">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-sm text-[var(--text-primary)] font-medium">Herma Cost</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-green-500 bg-green-100 px-1.5 py-0.5 rounded uppercase tracking-wider">SAVINGS</span>
                    <span className="text-2xl font-bold text-[var(--accent-primary)]">{hermaResult.cost}</span>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-[var(--text-tertiary)] mt-2">
                  <span>Time: {hermaResult.time}s</span>
                  <span>$2/M input, $8/M output</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-[var(--bg-tertiary)] p-4 text-center border-t border-[var(--border-secondary)]">
          <p className="text-xs text-[var(--text-tertiary)]">
            * Real-time comparison. Left shows the model's retail pricing. Right shows what you pay through Herma ($2/M input, $8/M output).
          </p>
        </div>
      </div>

      {/* Login Prompt Overlay */}
      {showLoginPrompt && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center z-20">
          <div className="bg-[var(--bg-secondary)] rounded-xl p-8 max-w-sm mx-4 text-center border border-[var(--border-secondary)] shadow-2xl">
            <h4 className="text-lg font-bold text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              You've used your free comparisons
            </h4>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              Sign up for free to get unlimited access to the comparison tool and start saving on AI costs.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="#/login?redirect=comparison"
                className="px-6 py-3 bg-[var(--accent-primary)] text-white font-semibold rounded-lg hover:bg-[var(--accent-hover)] transition-colors text-sm"
              >
                Sign Up Free
              </a>
              <a
                href="#/login?redirect=comparison"
                className="px-6 py-2 text-[var(--accent-primary)] hover:underline text-sm"
              >
                Already have an account? Log In
              </a>
            </div>
            <button
              onClick={() => setShowLoginPrompt(false)}
              className="mt-4 text-xs text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartRouterComparison;

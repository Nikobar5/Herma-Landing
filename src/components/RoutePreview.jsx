import React, { useState, useCallback } from 'react';

const API_URL = process.env.REACT_APP_HERMA_API_URL || 'http://localhost:8000';

const EXAMPLES = [
  'What is Python?',
  'Build a REST API with JWT auth',
  'Design a distributed cache for 1M req/s',
];

// Map model path to friendly display name
function friendlyModelName(modelPath) {
  if (!modelPath) return 'Unknown';
  const map = {
    'anthropic/claude-opus-4.6': 'Claude Opus 4.6',
    'anthropic/claude-sonnet-4.6': 'Claude Sonnet 4.6',
    'anthropic/claude-haiku-3.5': 'Claude Haiku 3.5',
    'openai/gpt-4o': 'GPT-4o',
    'openai/gpt-4o-mini': 'GPT-4o mini',
    'openai/gpt-4.1': 'GPT-4.1',
    'openai/gpt-4.1-mini': 'GPT-4.1 mini',
    'openai/o3': 'o3',
    'openai/o4-mini': 'o4-mini',
    'google/gemini-2.5-pro': 'Gemini 2.5 Pro',
    'google/gemini-2.5-flash': 'Gemini 2.5 Flash',
    'deepseek/deepseek-r1': 'DeepSeek R1',
    'deepseek/deepseek-chat': 'DeepSeek V3',
    'meta-llama/llama-3.1-70b-instruct': 'Llama 3.1 70B',
    'meta-llama/llama-3.3-70b-instruct': 'Llama 3.3 70B',
  };
  if (map[modelPath]) return map[modelPath];
  // Fallback: extract the last segment and clean it up
  const parts = modelPath.split('/');
  const raw = parts[parts.length - 1] || modelPath;
  return raw
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Category + difficulty label formatting
function formatCategory(category) {
  if (!category) return '';
  return category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, ' ');
}

function formatDifficulty(difficulty) {
  if (!difficulty) return '';
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
}

async function classifyPrompt(text) {
  const res = await fetch(`${API_URL}/v1/classify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', content: text }] }),
  });

  if (res.status === 429) {
    throw new Error('Rate limit reached. Please wait a moment and try again.');
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(body.detail || `Request failed (${res.status})`);
  }
  return res.json();
}

const RoutePreview = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = useCallback(async (text) => {
    const value = (text || prompt).trim();
    if (!value) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const data = await classifyPrompt(value);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [prompt]);

  const handleExampleClick = (example) => {
    setPrompt(example);
    handleAnalyze(example);
  };

  const savingsPct = result?.cost_estimate?.savings_pct ?? 0;
  const hasSavings = savingsPct > 0.005;
  const savingsDisplay = Math.round(savingsPct * 100);

  return (
    <section className="py-24 bg-[var(--bg-secondary)]" id="route-preview">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-4 tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            See the Router in Action
          </h2>
          <p
            className="text-base sm:text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Paste any prompt and see which model Herma would route it to — and how much you'd save.
          </p>
        </div>

        {/* Widget Card */}
        <div className="bg-[var(--bg-primary)] rounded-2xl sm:rounded-3xl border border-[var(--border-secondary)] shadow-xl overflow-hidden">
          {/* Input Area */}
          <div className="p-6 sm:p-8">
            <label
              className="block text-sm font-semibold text-[var(--text-secondary)] mb-2"
              style={{ fontFamily: 'var(--font-ui)' }}
              htmlFor="route-preview-input"
            >
              Your prompt
            </label>
            <textarea
              id="route-preview-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleAnalyze();
                }
              }}
              placeholder="Type or paste a prompt to see how the router classifies it..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] text-sm sm:text-base placeholder-[var(--text-tertiary)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] transition-colors"
              style={{ fontFamily: 'var(--font-body)' }}
            />

            {/* Example chips */}
            <div className="flex flex-wrap gap-2 mt-3 mb-5">
              <span
                className="text-xs text-[var(--text-tertiary)] self-center mr-1"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Try:
              </span>
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => handleExampleClick(ex)}
                  className="px-3 py-1.5 text-xs rounded-full border border-[var(--border-secondary)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all duration-200"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  {ex}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleAnalyze()}
              disabled={loading || !prompt.trim()}
              className="w-full sm:w-auto px-8 py-3 bg-[var(--accent-primary)] text-[var(--text-inverse)] font-semibold rounded-lg shadow hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/30 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)]"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analyzing...
                </span>
              ) : (
                'Analyze'
              )}
            </button>
          </div>

          {/* Error state */}
          {error && (
            <div className="px-6 sm:px-8 pb-6 sm:pb-8">
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400" style={{ fontFamily: 'var(--font-ui)' }}>
                {error}
              </div>
            </div>
          )}

          {/* Results */}
          {result && !loading && (
            <div className="border-t border-[var(--border-secondary)] px-6 sm:px-8 py-6 sm:py-8 space-y-5">
              {/* Row 1: Category + Model */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Classification */}
                <div className="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border-primary)]">
                  <p
                    className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    Query type
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {result.classification?.category && (
                      <span
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20"
                        style={{ fontFamily: 'var(--font-ui)' }}
                      >
                        {formatCategory(result.classification.category)}
                      </span>
                    )}
                    {result.classification?.difficulty && (
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          result.classification.difficulty === 'hard'
                            ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                            : result.classification.difficulty === 'medium'
                            ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}
                        style={{ fontFamily: 'var(--font-ui)' }}
                      >
                        {formatDifficulty(result.classification.difficulty)}
                      </span>
                    )}
                    {result.classification?.is_agentic && (
                      <span
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        style={{ fontFamily: 'var(--font-ui)' }}
                      >
                        Agentic
                      </span>
                    )}
                  </div>
                </div>

                {/* Selected Model */}
                <div className="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border-primary)]">
                  <p
                    className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    Routed to
                  </p>
                  <p
                    className="text-base sm:text-lg font-bold text-[var(--text-primary)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {friendlyModelName(result.routing?.model)}
                  </p>
                  {result.routing?.cell && (
                    <p
                      className="text-xs text-[var(--text-tertiary)] mt-0.5"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      cell: {result.routing.cell}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: Savings banner */}
              {hasSavings ? (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/8 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
                  {/* Big savings number */}
                  <div className="flex items-baseline gap-1.5 shrink-0">
                    <span
                      className="text-4xl sm:text-5xl font-bold text-emerald-400"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {savingsDisplay}%
                    </span>
                    <span
                      className="text-sm text-emerald-500 font-medium"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      saved
                    </span>
                  </div>

                  {/* Bar */}
                  <div className="flex-1 w-full">
                    <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)] mb-1.5" style={{ fontFamily: 'var(--font-ui)' }}>
                      <span>Frontier cost</span>
                      <span>Herma cost</span>
                    </div>
                    <div className="relative h-3 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                      {/* Full bar (frontier) */}
                      <div className="absolute inset-0 bg-gray-600/40 rounded-full" />
                      {/* Herma bar */}
                      <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-700"
                        style={{ width: `${Math.max((1 - savingsPct) * 100, 3)}%` }}
                      />
                    </div>
                    <p
                      className="text-xs text-[var(--text-tertiary)] mt-2"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      You'd save {savingsDisplay}% on this query compared to calling frontier directly.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-[var(--border-secondary)] bg-[var(--bg-secondary)] p-5 flex items-start gap-3">
                  <svg className="w-5 h-5 text-[var(--text-tertiary)] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p
                    className="text-sm text-[var(--text-secondary)]"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    This query needs frontier — no shortcuts. Herma routes it directly to the best model without compromise.
                  </p>
                </div>
              )}

              {/* CTA */}
              <div className="text-center pt-1">
                <a
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent-primary)] text-[var(--text-inverse)] font-semibold rounded-lg shadow hover:bg-[var(--accent-hover)] transition-all duration-200 text-sm sm:text-base"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Start saving with Herma
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RoutePreview;

import React, { useState } from 'react';
import { streamChat } from '../services/hermaApi';
import { useHermaAuth } from '../context/HermaAuthContext';

const MODELS = [
  { id: 'openai/gpt-4o', label: 'GPT-4o', provider: 'OpenAI' },
  { id: 'openai/gpt-4o-mini', label: 'GPT-4o Mini', provider: 'OpenAI' },
  { id: 'anthropic/claude-sonnet-4', label: 'Claude Sonnet 4', provider: 'Anthropic' },
  { id: 'anthropic/claude-3.5-haiku', label: 'Claude 3.5 Haiku', provider: 'Anthropic' },
  { id: 'google/gemini-2.0-flash-001', label: 'Gemini 2.0 Flash', provider: 'Google' },
  { id: 'meta-llama/llama-3.1-70b-instruct', label: 'Llama 3.1 70B', provider: 'Meta' },
  { id: 'meta-llama/llama-3.1-8b-instruct', label: 'Llama 3.1 8B', provider: 'Meta' },
];

const SmartRouterComparison = () => {
  const [query, setQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [isProcessing, setIsProcessing] = useState(false);
  const { isAuthenticated } = useHermaAuth();

  const [hermaResult, setHermaResult] = useState({ content: '', cost: null, model: 'Smart Router', time: 0, loading: false, error: null, thinking: false });
  const [stdResult, setStdResult] = useState({ content: '', cost: null, model: MODELS[0].label, time: 0, loading: false, error: null, thinking: false });

  const examples = [
    "Summarize this quarterly report",
    "Generate a Python script for data analysis",
    "Draft a cold email to a potential client"
  ];

  const selectedModelLabel = MODELS.find(m => m.id === selectedModel)?.label || selectedModel;

  const handleCompare = async () => {
    if (!query) return;

    setIsProcessing(true);

    setHermaResult({ content: '', cost: null, model: 'Smart Router', time: 0, loading: true, error: null, thinking: false });
    setStdResult({ content: '', cost: null, model: selectedModelLabel, time: 0, loading: true, error: null, thinking: false });

    const startTime = Date.now();

    // 1. Herma Smart Router (auto-routed)
    const hermaPromise = (async () => {
      if (!isAuthenticated) {
        setHermaResult(prev => ({ ...prev, loading: false, error: "Please log in to use the comparison." }));
        return;
      }
      try {
        let content = '';
        await streamChat([{ role: 'user', content: query }], {
          model: 'openrouter/auto',
          onChunk: (delta) => {
            if (delta.type === 'reasoning') {
              setHermaResult(prev => ({ ...prev, thinking: true }));
            } else if (delta.type === 'content') {
              content += delta.content;
              setHermaResult(prev => ({ ...prev, content, thinking: false }));
            }
          },
          onDone: (usage) => {
            const cost = usage ? (usage.total_tokens * 0.000002).toFixed(5) : '0.00005';
            setHermaResult(prev => ({
              ...prev,
              loading: false,
              time: ((Date.now() - startTime) / 1000).toFixed(2),
              cost: `$${cost}`
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

    // 2. Selected model (specific model via OpenRouter)
    const stdPromise = (async () => {
      if (!isAuthenticated) {
        setStdResult(prev => ({ ...prev, loading: false, error: "Please log in to use the comparison." }));
        return;
      }
      try {
        let content = '';
        await streamChat([{ role: 'user', content: query }], {
          model: selectedModel,
          onChunk: (delta) => {
            if (delta.type === 'reasoning') {
              setStdResult(prev => ({ ...prev, thinking: true }));
            } else if (delta.type === 'content') {
              content += delta.content;
              setStdResult(prev => ({ ...prev, content, thinking: false }));
            }
          },
          onDone: (usage) => {
            const cost = usage ? (usage.total_tokens * 0.000003).toFixed(5) : '0.00010';
            setStdResult(prev => ({
              ...prev,
              loading: false,
              time: ((Date.now() - startTime) / 1000).toFixed(2),
              cost: `$${cost}`
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
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 mb-20 animate-fade-up">
      <div className="bg-[var(--bg-secondary)] rounded-2xl shadow-xl border border-[var(--border-secondary)] overflow-hidden">
        {/* Header / Input Area */}
        <div className="p-6 sm:p-8 border-b border-[var(--border-secondary)] bg-[var(--bg-tertiary)]/50">
          <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] text-center mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            See the Difference
          </h3>

          {/* Model Selector */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="text-sm font-medium text-[var(--text-secondary)]">Compare against:</span>
            <select
              value={selectedModel}
              onChange={(e) => {
                setSelectedModel(e.target.value);
                setStdResult(prev => ({ ...prev, model: MODELS.find(m => m.id === e.target.value)?.label || e.target.value }));
              }}
              className="px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] cursor-pointer"
            >
              {MODELS.map(m => (
                <option key={m.id} value={m.id}>{m.label} ({m.provider})</option>
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
                <span className="font-semibold text-[var(--text-secondary)]">{selectedModelLabel}</span>
              </div>
              <span className="text-xs font-mono text-[var(--text-tertiary)]">Direct Model</span>
            </div>

            <div className="flex-grow text-[var(--text-primary)] leading-relaxed mb-6 text-sm sm:text-base">
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
                <p className="whitespace-pre-wrap">{stdResult.content}</p>
              ) : stdResult.error ? (
                <div className="text-[var(--error)] bg-[var(--error)]/5 p-4 rounded-lg text-center text-sm">
                  {stdResult.error}
                  {!isAuthenticated && (
                    <button
                      onClick={() => window.location.hash = '#/login'}
                      className="block mt-2 mx-auto px-4 py-2 bg-[var(--accent-primary)] text-white rounded text-xs hover:bg-[var(--accent-hover)]"
                    >
                      Log In
                    </button>
                  )}
                </div>
              ) : stdResult.content ? (
                <p className="whitespace-pre-wrap">{stdResult.content}</p>
              ) : (
                <p className="text-[var(--text-tertiary)] italic">Waiting for input...</p>
              )}
            </div>

            {/* Stats Card - Standard */}
            <div className={`transition-opacity duration-300 ${stdResult.cost ? 'opacity-100' : 'opacity-0'}`}>
              <div className="bg-[var(--bg-primary)] rounded-xl p-4 border border-[var(--border-secondary)]">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-sm text-[var(--text-tertiary)]">Cost</span>
                  <span className="text-xl font-bold text-gray-500">{stdResult.cost}</span>
                </div>
                <div className="flex justify-between text-xs text-[var(--text-tertiary)] mt-2">
                  <span>Time: {stdResult.time}s</span>
                  <span>Model: {selectedModelLabel}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Herma Smart Router Side */}
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
              <span className="text-xs font-mono text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 px-2 py-0.5 rounded-full">Smart Router</span>
            </div>

            <div className="flex-grow text-[var(--text-primary)] leading-relaxed mb-6 relative z-10 text-sm sm:text-base">
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
                <p className="whitespace-pre-wrap">{hermaResult.content}</p>
              ) : hermaResult.error ? (
                <div className="text-[var(--error)] bg-[var(--error)]/5 p-4 rounded-lg text-center text-sm">
                  {hermaResult.error}
                  {!isAuthenticated && (
                    <button
                      onClick={() => window.location.hash = '#/login'}
                      className="block mt-2 mx-auto px-4 py-2 bg-[var(--accent-primary)] text-white rounded text-xs hover:bg-[var(--accent-hover)]"
                    >
                      Log In
                    </button>
                  )}
                </div>
              ) : hermaResult.content ? (
                <p className="whitespace-pre-wrap">{hermaResult.content}</p>
              ) : (
                <p className="text-[var(--text-tertiary)] italic">Waiting for input...</p>
              )}
            </div>

            {/* Stats Card - Optimized */}
            <div className={`transition-opacity duration-300 ${hermaResult.cost ? 'opacity-100' : 'opacity-0'} relative z-10`}>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-[var(--accent-primary)] shadow-[0_0_20px_rgba(255,255,255,0.5)] dark:shadow-none">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-sm text-[var(--text-primary)] font-medium">Smart Cost</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-green-500 bg-green-100 px-1.5 py-0.5 rounded uppercase tracking-wider">SAVINGS</span>
                    <span className="text-2xl font-bold text-[var(--accent-primary)]">{hermaResult.cost}</span>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-[var(--text-tertiary)] mt-2">
                  <span>Time: {hermaResult.time}s</span>
                  <span>Model: Auto-routed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-[var(--bg-tertiary)] p-4 text-center border-t border-[var(--border-secondary)]">
          <p className="text-xs text-[var(--text-tertiary)]">
            * Real-time comparison. Both requests route through Herma — one to the model you selected, one through our smart router.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SmartRouterComparison;

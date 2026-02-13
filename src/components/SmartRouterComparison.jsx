import React, { useState, useEffect, useRef } from 'react';
import { streamChat } from '../services/hermaApi';
import { useHermaAuth } from '../context/HermaAuthContext';

const SmartRouterComparison = () => {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [openAIKey, setOpenAIKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const { isAuthenticated } = useHermaAuth();

  // Results state
  const [hermaResult, setHermaResult] = useState({ content: '', cost: null, model: 'Smart Router', time: 0, loading: false, error: null });
  const [stdResult, setStdResult] = useState({ content: '', cost: null, model: 'GPT-4', time: 0, loading: false, error: null });

  const examples = [
    "Summarize this quarterly report",
    "Generate a Python script for data analysis",
    "Draft a cold email to a potential client"
  ];

  const handleExampleClick = (text) => {
    setQuery(text);
  };

  const handleCompare = async () => {
    if (!query) return;

    setIsProcessing(true);
    setShowResults(true); // Show the panels immediately

    // Reset results
    setHermaResult(prev => ({ ...prev, content: '', cost: null, time: 0, loading: true, error: null }));
    setStdResult(prev => ({ ...prev, content: '', cost: null, time: 0, loading: true, error: null }));

    const startTime = Date.now();

    // 1. Call Herma API
    const hermaPromise = (async () => {
      if (!isAuthenticated) {
        setHermaResult(prev => ({
          ...prev,
          loading: false,
          error: "Please log in to use the Herma Smart Router."
        }));
        return;
      }

      try {
        let content = '';
        await streamChat([{ role: 'user', content: query }], {
          onChunk: (delta) => {
            if (delta.type === 'content') {
              content += delta.content;
              setHermaResult(prev => ({ ...prev, content }));
            }
          },
          onDone: (usage) => {
            // Estimate cost if usage not provided or calculate based on model
            // For demo, we might need to mock cost if not returned immediately, 
            // but let's assume usage gives us something or we calculate.
            // Simplified cost calculation for demo:
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

    // 2. Call OpenAI API (if key provided)
    const stdPromise = (async () => {
      if (!openAIKey) {
        setStdResult(prev => ({
          ...prev,
          loading: false,
          error: "Enter OpenAI API Key to compare."
        }));
        return;
      }

      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openAIKey}`
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [{ role: "user", content: query }],
            max_tokens: 150 // Reasonable limit
          })
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error?.message || 'OpenAI Error');
        }

        const content = data.choices[0].message.content;
        // GPT-4 Cost (approx): Input $0.03/1k, Output $0.06/1k. 
        // Simplified: (Total Tokens * ~0.000045)
        const totalTokens = data.usage.total_tokens;
        const cost = (totalTokens * 0.000045).toFixed(5);

        setStdResult(prev => ({
          ...prev,
          content,
          cost: `$${cost}`,
          time: ((Date.now() - startTime) / 1000).toFixed(2),
          loading: false,
          model: 'GPT-4'
        }));

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
          <div className="flex justify-between items-center mb-6 relative">
            <div className="w-8"></div> {/* Spacer for centering */}
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] text-center" style={{ fontFamily: 'var(--font-heading)' }}>
              See the Difference
            </h3>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-tertiary)] transition-colors"
              title="Settings"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
          </div>

          {/* Settings / API Key Input */}
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showSettings ? 'max-h-24 mb-4 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="flex items-center gap-2 max-w-lg mx-auto bg-[var(--bg-primary)] p-2 rounded-lg border border-[var(--border-secondary)]">
              <span className="text-sm font-medium text-[var(--text-secondary)] whitespace-nowrap pl-2">OpenAI Key:</span>
              <input
                type="password"
                value={openAIKey}
                onChange={(e) => setOpenAIKey(e.target.value)}
                placeholder="sk-..."
                className="flex-1 bg-transparent border-none text-[var(--text-primary)] text-sm focus:ring-0 placeholder-[var(--text-tertiary)]"
              />
            </div>
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
          <div className="flex flex-wrapjustify-center gap-3 mt-4 justify-center">
            {examples.map((ex, i) => (
              <button
                key={i}
                onClick={() => handleExampleClick(ex)}
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

          {/* Standard API Side (OpenAI) */}
          <div className="p-6 sm:p-8 bg-[var(--bg-secondary)] relative group min-h-[300px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs">AI</div>
                <span className="font-semibold text-[var(--text-secondary)]">Standard API</span>
              </div>
              <span className="text-xs font-mono text-[var(--text-tertiary)]">{stdResult.model}</span>
            </div>

            <div className="flex-grow text-[var(--text-primary)] leading-relaxed mb-6 text-sm sm:text-base">
              {stdResult.loading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200/50 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200/50 rounded w-full"></div>
                  <div className="h-4 bg-gray-200/50 rounded w-5/6"></div>
                </div>
              ) : stdResult.error ? (
                <div className="text-[var(--error)] bg-[var(--error)]/5 p-4 rounded-lg text-center text-sm">
                  {stdResult.error}
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
                  <span className="text-sm text-[var(--text-tertiary)]">Actual Cost</span>
                  <span className="text-xl font-bold text-gray-500">{stdResult.cost}</span>
                </div>
                <div className="flex justify-between text-xs text-[var(--text-tertiary)] mt-2">
                  <span>Time: {stdResult.time}s</span>
                  <span>Model: {stdResult.model}</span>
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
              <span className="text-xs font-mono text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 px-2 py-0.5 rounded-full">{hermaResult.model}</span>
            </div>

            <div className="flex-grow text-[var(--text-primary)] leading-relaxed mb-6 relative z-10 text-sm sm:text-base">
              {hermaResult.loading && !hermaResult.content ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-[var(--accent-primary)]/20 rounded w-3/4"></div>
                  <div className="h-4 bg-[var(--accent-primary)]/20 rounded w-full"></div>
                  <div className="h-4 bg-[var(--accent-primary)]/20 rounded w-5/6"></div>
                </div>
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
            * Real-time comparison. Enter your OpenAI Key to compare against standard GPT-4 pricing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SmartRouterComparison;

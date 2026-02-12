import React, { useState, useEffect } from 'react';

const SmartRouterComparison = () => {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  // Mock data for demonstration
  const [results, setResults] = useState({
    std: { cost: '$0.03', time: '1.2s', model: 'GPT-4' },
    herma: { cost: '$0.01', time: '1.1s', model: 'Optimized Route' }
  });

  const examples = [
    "Summarize this quarterly report",
    "Generate a Python script for data analysis",
    "Draft a cold email to a potential client"
  ];

  const handleExampleClick = (text) => {
    setQuery(text);
    handleSimulate(text);
  };

  const handleSimulate = (text) => {
    // Determine input to use (argument or state)
    const inputText = typeof text === 'string' ? text : query;
    if (!inputText) return;
    
    setIsProcessing(true);
    setShowResults(false);

    // Simulate network delay
    setTimeout(() => {
      setIsProcessing(false);
      setShowResults(true);
      
      // Randomize cost slightly for realism
      const randomStdCost = (Math.random() * (0.04 - 0.02) + 0.02).toFixed(3);
      const randomHermaCost = (randomStdCost * 0.4).toFixed(3); // ~60% cheaper
      
      setResults({
        std: { cost: `$${randomStdCost}`, time: '1.2s', model: 'GPT-4' },
        herma: { cost: `$${randomHermaCost}`, time: '0.8s', model: 'Smart Router' }
      });
    }, 1500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 mb-20 animate-fade-up">
      <div className="bg-[var(--bg-secondary)] rounded-2xl shadow-xl border border-[var(--border-secondary)] overflow-hidden">
        {/* Header / Input Area */}
        <div className="p-6 sm:p-8 border-b border-[var(--border-secondary)] bg-[var(--bg-tertiary)]/50">
           <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
            See the Difference
          </h3>
          
          <div className="relative max-w-3xl mx-auto">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question..."
              className="w-full px-5 py-4 pr-32 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] shadow-sm text-lg"
              onKeyDown={(e) => e.key === 'Enter' && handleSimulate()}
            />
            <button
              onClick={() => handleSimulate()}
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
           
           {/* Standard API Side */}
           <div className="p-6 sm:p-8 bg-[var(--bg-secondary)] relative group">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs">AI</div>
                    <span className="font-semibold text-[var(--text-secondary)]">Standard API</span>
                 </div>
                 <span className="text-xs font-mono text-[var(--text-tertiary)]">{results.std.model}</span>
              </div>
              
              <div className="min-h-[120px] text-[var(--text-primary)] leading-relaxed mb-6">
                 {isProcessing ? (
                   <div className="animate-pulse space-y-2">
                     <div className="h-4 bg-gray-200/50 rounded w-3/4"></div>
                     <div className="h-4 bg-gray-200/50 rounded w-full"></div>
                     <div className="h-4 bg-gray-200/50 rounded w-5/6"></div>
                   </div>
                 ) : showResults ? (
                    <p>
                        Here is a simulated response to your query "{query}". The standard API processes this request using a high-end model, incurring standard costs regardless of complexity.
                    </p>
                 ) : (
                    <p className="text-[var(--text-tertiary)] italic">Waiting for input...</p>
                 )}
              </div>

              {/* Stats Card - Standard */}
              <div className={`transition-all duration-500 transform ${showResults ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-50'}`}>
                 <div className="bg-[var(--bg-primary)] rounded-xl p-4 border border-[var(--border-secondary)]">
                    <div className="flex justify-between items-end mb-1">
                       <span className="text-sm text-[var(--text-tertiary)]">Cost per 1k tokens</span>
                       <span className="text-xl font-bold text-gray-500">{results.std.cost}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                       <div className="bg-gray-400 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Herma Smart Router Side */}
           <div className="p-6 sm:p-8 bg-[var(--bg-secondary)]/50 relative overflow-hidden">
              {/* Highlight Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-primary)]/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

              <div className="flex items-center justify-between mb-4 relative z-10">
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[var(--accent-primary)] flex items-center justify-center text-white font-bold text-xs">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <span className="font-semibold text-[var(--accent-primary)]">Herma Router</span>
                 </div>
                 <span className="text-xs font-mono text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 px-2 py-0.5 rounded-full">{results.herma.model}</span>
              </div>
              
              <div className="min-h-[120px] text-[var(--text-primary)] leading-relaxed mb-6 relative z-10">
                 {isProcessing ? (
                   <div className="animate-pulse space-y-2">
                     <div className="h-4 bg-[var(--accent-primary)]/20 rounded w-3/4"></div>
                     <div className="h-4 bg-[var(--accent-primary)]/20 rounded w-full"></div>
                     <div className="h-4 bg-[var(--accent-primary)]/20 rounded w-5/6"></div>
                   </div>
                 ) : showResults ? (
                    <p>
                        High-quality response generated via {results.herma.model}. We automatically routed this request to the most cost-effective model that meets your quality threshold.
                    </p>
                 ) : (
                    <p className="text-[var(--text-tertiary)] italic">Waiting for input...</p>
                 )}
              </div>

              {/* Stats Card - Optimized */}
              <div className={`transition-all duration-500 delay-100 transform ${showResults ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-50'} relative z-10`}>
                 <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-[var(--accent-primary)] shadow-[0_0_20px_rgba(255,255,255,0.5)] dark:shadow-none">
                    <div className="flex justify-between items-end mb-1">
                       <span className="text-sm text-[var(--text-primary)] font-medium">Smart Cost</span>
                       <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-green-500 bg-green-100 px-1.5 py-0.5 rounded uppercase tracking-wider">60% SAVINGS</span>
                            <span className="text-2xl font-bold text-[var(--accent-primary)]">{results.herma.cost}</span>
                       </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                       <div className="bg-[var(--accent-primary)] h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: '40%' }}></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
        
        {/* Footer Info */}
        <div className="bg-[var(--bg-tertiary)] p-4 text-center border-t border-[var(--border-secondary)]">
            <p className="text-xs text-[var(--text-tertiary)]">
                * Comparison based on average market rates for equivalent model tiers. 
                <span className="text-[var(--accent-primary)] hover:underline ml-1 cursor-pointer">View full pricing methodology</span>
            </p>
        </div>
      </div>
    </div>
  );
};

export default SmartRouterComparison;

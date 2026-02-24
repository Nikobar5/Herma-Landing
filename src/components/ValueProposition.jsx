import React, { useState, useEffect, useMemo } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

// Herma pricing: $2/1M input, $8/1M output
const HERMA_INPUT_PRICE = 2.0;
const HERMA_OUTPUT_PRICE = 8.0;

const FALLBACK_MODELS = [
  { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'OpenAI', promptPrice: 2.5, completionPrice: 10 },
  { id: 'anthropic/claude-sonnet-4', name: 'Claude Sonnet 4', provider: 'Anthropic', promptPrice: 3, completionPrice: 15 },
  { id: 'google/gemini-2.5-pro-preview-05-06', name: 'Gemini 2.5 Pro', provider: 'Google', promptPrice: 2.5, completionPrice: 15 },
  { id: 'openai/o3', name: 'o3', provider: 'OpenAI', promptPrice: 2, completionPrice: 8 },
];

// Volume presets (total tokens/month, displayed in M)
const VOLUME_PRESETS = [
  { label: '1M', tokens: 1_000_000 },
  { label: '10M', tokens: 10_000_000 },
  { label: '50M', tokens: 50_000_000 },
  { label: '100M', tokens: 100_000_000 },
  { label: '500M', tokens: 500_000_000 },
];

// Assume a 3:1 input:output token ratio (typical for chat applications)
const INPUT_RATIO = 0.75;
const OUTPUT_RATIO = 0.25;

function formatDollars(amount) {
  if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}k`;
  if (amount >= 1) return `$${amount.toFixed(2)}`;
  return `$${amount.toFixed(4)}`;
}

const ValueProposition = () => {
  const [headerRef, headerVisible] = useScrollAnimation(0.1);
  const [calcRef, calcVisible] = useScrollAnimation(0.1);
  const [models, setModels] = useState(FALLBACK_MODELS);
  const [selectedModel, setSelectedModel] = useState(FALLBACK_MODELS[0].id);
  const [totalTokens, setTotalTokens] = useState(10_000_000);
  const [customInput, setCustomInput] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('https://openrouter.ai/api/v1/models');
        if (!res.ok) return;
        const data = await res.json();
        const filtered = (data.data || [])
          .filter(m => {
            const prompt = parseFloat(m.pricing?.prompt || '0') * 1_000_000;
            const completion = parseFloat(m.pricing?.completion || '0') * 1_000_000;
            return prompt > HERMA_INPUT_PRICE && completion > HERMA_OUTPUT_PRICE;
          })
          .filter(m => /^(openai|anthropic|google|deepseek|mistralai|meta-llama)\//.test(m.id))
          .filter(m => !m.id.includes(':free') && !m.id.includes(':beta'))
          .map(m => ({
            id: m.id,
            name: m.name.replace(/^[^:]+:\s*/, ''),
            provider: m.id.split('/')[0],
            promptPrice: parseFloat(m.pricing.prompt) * 1_000_000,
            completionPrice: parseFloat(m.pricing.completion) * 1_000_000,
          }))
          .sort((a, b) => b.completionPrice - a.completionPrice);

        if (!cancelled && filtered.length > 0) {
          setModels(filtered);
          setSelectedModel(filtered[0].id);
        }
      } catch {
        // Keep fallback models
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const selectedModelObj = models.find(m => m.id === selectedModel) || models[0];

  const costs = useMemo(() => {
    const inputTokens = totalTokens * INPUT_RATIO;
    const outputTokens = totalTokens * OUTPUT_RATIO;

    const directCost =
      (inputTokens / 1_000_000) * selectedModelObj.promptPrice +
      (outputTokens / 1_000_000) * selectedModelObj.completionPrice;

    const hermaCost =
      (inputTokens / 1_000_000) * HERMA_INPUT_PRICE +
      (outputTokens / 1_000_000) * HERMA_OUTPUT_PRICE;

    const savings = directCost - hermaCost;
    const savingsPercent = directCost > 0 ? (savings / directCost) * 100 : 0;

    return { directCost, hermaCost, savings, savingsPercent };
  }, [totalTokens, selectedModelObj]);

  const providerLabel = (provider) => {
    const labels = { openai: 'OpenAI', anthropic: 'Anthropic', google: 'Google', deepseek: 'DeepSeek', mistralai: 'Mistral', 'meta-llama': 'Meta' };
    return labels[provider] || provider;
  };

  const handleCustomVolume = (value) => {
    setCustomInput(value);
    const num = parseFloat(value);
    if (!isNaN(num) && num > 0) {
      setTotalTokens(num * 1_000_000);
    }
  };

  const activePreset = VOLUME_PRESETS.find(p => p.tokens === totalTokens);
  const barMaxWidth = costs.directCost > 0 ? 100 : 0;
  const hermaBarWidth = costs.directCost > 0 ? (costs.hermaCost / costs.directCost) * 100 : 0;

  return (
    <section className="pt-24 pb-12 sm:pb-16 bg-[var(--bg-primary)]" id="savings-calculator">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={`text-center mb-12 sm:mb-16 md:mb-20 animate-on-scroll animate-fade-up ${headerVisible ? 'is-visible' : ''}`}
        >
          <h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-4 tracking-tight px-2 sm:px-0"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Calculate Your Savings
          </h2>
          <p
            className="text-base sm:text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto px-2 sm:px-0"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Select your current model and monthly volume to see how much you could save with Herma.
          </p>
        </div>

        {/* Calculator Card */}
        <div
          ref={calcRef}
          className={`max-w-4xl mx-auto animate-on-scroll animate-fade-up ${calcVisible ? 'is-visible' : ''}`}
        >
          <div className="bg-[var(--bg-secondary)] rounded-2xl sm:rounded-3xl shadow-xl border border-[var(--border-secondary)] overflow-hidden">
            {/* Controls */}
            <div className="p-6 sm:p-8 border-b border-[var(--border-secondary)]">
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Model Selector */}
                <div>
                  <label
                    className="block text-sm font-semibold text-[var(--text-secondary)] mb-2"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    Current Model
                  </label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] cursor-pointer"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {models.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({providerLabel(m.provider)}) — ${m.promptPrice}/${m.completionPrice} per 1M
                      </option>
                    ))}
                  </select>
                </div>

                {/* Volume Input */}
                <div>
                  <label
                    className="block text-sm font-semibold text-[var(--text-secondary)] mb-2"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    Monthly Volume (tokens)
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {VOLUME_PRESETS.map(preset => (
                      <button
                        key={preset.label}
                        onClick={() => { setTotalTokens(preset.tokens); setCustomInput(''); }}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          activePreset?.tokens === preset.tokens
                            ? 'bg-[var(--accent-primary)] text-white shadow-md'
                            : 'bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]'
                        }`}
                        style={{ fontFamily: 'var(--font-ui)' }}
                      >
                        {preset.label}
                      </button>
                    ))}
                    <input
                      type="text"
                      value={customInput}
                      onChange={(e) => handleCustomVolume(e.target.value)}
                      placeholder="Custom (M)"
                      className="w-28 px-3 py-2 rounded-lg bg-[var(--bg-primary)] border-2 border-[var(--border-secondary)] text-[var(--text-primary)] text-sm placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)]"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="p-6 sm:p-8">
              {/* Cost Bars */}
              <div className="space-y-6 mb-8">
                {/* Direct Cost Bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-sm font-medium text-[var(--text-secondary)]"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      {selectedModelObj.name} (Direct)
                    </span>
                    <span
                      className="text-lg font-bold text-[var(--text-primary)]"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {formatDollars(costs.directCost)}/mo
                    </span>
                  </div>
                  <div className="h-8 sm:h-10 bg-[var(--bg-tertiary)] rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-lg transition-all duration-700 ease-out flex items-center justify-end pr-3"
                      style={{ width: `${barMaxWidth}%` }}
                    >
                      <span className="text-xs font-semibold text-white whitespace-nowrap">
                        ${selectedModelObj.promptPrice} / ${selectedModelObj.completionPrice} per 1M
                      </span>
                    </div>
                  </div>
                </div>

                {/* Herma Cost Bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-sm font-medium text-[var(--accent-primary)]"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      With Herma
                    </span>
                    <span
                      className="text-lg font-bold text-[var(--accent-primary)]"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {formatDollars(costs.hermaCost)}/mo
                    </span>
                  </div>
                  <div className="relative h-8 sm:h-10 bg-[var(--bg-tertiary)] rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-hover)] rounded-lg transition-all duration-700 ease-out"
                      style={{ width: `${Math.max(hermaBarWidth, 5)}%` }}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--accent-primary)] whitespace-nowrap bg-[var(--bg-tertiary)]/80 px-1.5 py-0.5 rounded">
                      $2 / $8 per 1M
                    </span>
                  </div>
                </div>
              </div>

              {/* Savings Summary */}
              <div className="bg-[var(--bg-tertiary)] rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-emerald-500/20">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <p
                      className="text-sm text-[var(--text-secondary)] mb-1"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      Your Monthly Savings
                    </p>
                    <p
                      className="text-3xl sm:text-4xl font-bold text-emerald-400"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {formatDollars(costs.savings)}/mo
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className="text-4xl sm:text-5xl font-bold text-emerald-400"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {costs.savingsPercent.toFixed(0)}%
                    </div>
                    <div
                      className="text-sm text-[var(--text-secondary)] leading-tight"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      cost<br />reduction
                    </div>
                  </div>
                </div>
              </div>

              {/* Footnote */}
              <p
                className="text-xs text-[var(--text-tertiary)] text-center mt-4"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                * Based on a 75/25 input/output token ratio. Herma flat pricing: $2/1M input tokens, $8/1M output tokens. Model prices from OpenRouter.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;

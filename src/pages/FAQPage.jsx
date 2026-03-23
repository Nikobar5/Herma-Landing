import React, { useState, useEffect } from 'react';
import { setStructuredData, removeStructuredData } from '../utils/seo';

const faqItems = [
  {
    id: 1,
    question: "What is Herma?",
    answer: "Herma is an intelligent AI gateway that gives you unified access to all major AI models — GPT-4o, Claude, Gemini, Mistral, DeepSeek, and more — through a single API and chat interface. Instead of managing separate accounts and APIs for each provider, Herma routes your requests to the best model for the job, tracks your usage and costs, and remembers context across conversations."
  },
  {
    id: 2,
    question: "What makes Herma different from using AI providers directly?",
    answer: "With Herma, you get one API key, one billing system, and one interface for every model. Herma's smart router analyzes your query and selects the optimal model based on the task — whether that's coding, creative writing, analysis, or general chat. You also get built-in memory that persists across sessions, real-time web search, and a unified dashboard to monitor usage and spending across all models."
  },
  {
    id: 3,
    question: "How does smart model routing work?",
    answer: "When you send a message, Herma's routing system classifies your query and recommends the best model for the task. You can also choose a specific model if you prefer. The router considers factors like query complexity, task type, and cost efficiency to make its recommendation. Over time, the system learns from usage patterns to improve its routing decisions."
  },
  {
    id: 4,
    question: "What models can I access through Herma?",
    answer: "Herma supports models from Anthropic (Claude), OpenAI (GPT-4o, o1), Google (Gemini), Mistral, DeepSeek, and many more — all through a single OpenAI-compatible API. New models are added as they become available. You can use the auto-router to let Herma choose, or specify any supported model directly."
  },
  {
    id: 5,
    question: "How does the memory system work?",
    answer: "Herma automatically extracts and remembers key facts from your conversations — your preferences, context, and instructions. This memory is injected into future conversations so the AI already knows your background without you repeating yourself. Memories are stored securely, and sensitive information like passwords or API keys is automatically filtered out before storage."
  },
  {
    id: 6,
    question: "How does billing work?",
    answer: "Herma uses a simple credit-based system. You purchase credits and they're deducted based on actual token usage at transparent per-model rates. There are no monthly subscriptions or hidden fees — you only pay for what you use. Your dashboard shows real-time cost tracking broken down by model, so you always know exactly where your credits are going."
  },
  {
    id: 7,
    question: "Can I use Herma with my existing code?",
    answer: "Yes. Herma provides an OpenAI-compatible API, so you can switch by changing just two lines of code — the base URL and your API key. Any application, library, or framework that works with the OpenAI API works with Herma out of the box. SDKs for Python, JavaScript, Go, and more are all compatible."
  },
  {
    id: 8,
    question: "Is Herma suitable for businesses and teams?",
    answer: "Yes. Herma provides centralized billing, usage analytics, and cost controls that make it easy to manage AI spending across a team or organization. The admin dashboard gives full visibility into usage patterns, model performance, and costs. One account can power multiple applications and team members through API keys."
  },
  {
    id: 9,
    question: "How much does Herma cost?",
    answer: "Herma charges $2 per million input tokens and $8 per million output tokens. There are no subscriptions, no minimums, and no hidden fees. You buy credits and they're deducted based on actual usage. New accounts start with $1.00 in free credits so you can try it before adding funds. Your dashboard shows exactly how much each request costs and how much you're saving compared to using frontier models directly."
  },
  {
    id: 10,
    question: "How much can I save with intelligent routing?",
    answer: "On average, Herma's router saves 60-90% compared to always using the most expensive model. For simple questions, factual lookups, and routine coding tasks, the router selects models that cost a fraction of frontier pricing while maintaining the same quality. For complex tasks like system design or multi-step reasoning, it automatically routes to the best available model. Your savings dashboard shows a real-time comparison of what you're paying versus what it would have cost with a frontier model."
  }
];

const FAQPage = () => {
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    };
    setStructuredData('ld-faq', faqSchema);
    return () => removeStructuredData('ld-faq');
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-16">
      <section className="py-16 sm:py-20">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Frequently Asked Questions
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-hover)] mx-auto mt-6"></div>
          </div>

          <div className="space-y-3">
            {faqItems.map((item) => (
              <div
                key={item.id}
                className="rounded-xl overflow-hidden border border-[var(--border-secondary)] transition-colors hover:border-[var(--border-hover)]"
              >
                <button
                  className={`w-full text-left p-5 flex justify-between items-center transition-colors ${
                    expandedId === item.id
                      ? 'bg-[var(--bg-tertiary)]'
                      : 'bg-[var(--bg-secondary)]'
                  }`}
                  onClick={() => toggleExpand(item.id)}
                  aria-expanded={expandedId === item.id}
                >
                  <h3
                    className="text-base sm:text-lg font-semibold text-[var(--text-primary)] pr-4"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {item.question}
                  </h3>
                  <span className={`flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 ${
                    expandedId === item.id
                      ? 'bg-[var(--accent-primary)] text-[var(--text-inverse)] rotate-180'
                      : 'bg-[var(--bg-hover)] text-[var(--text-tertiary)] rotate-0'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    expandedId === item.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-5 pt-0 bg-[var(--bg-tertiary)]">
                    <p
                      className="text-[var(--text-secondary)] leading-relaxed"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default FAQPage;

import React, { useState } from 'react';

const FAQ = () => {
  // FAQ data with question and answer pairs
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
    }
  ];

  // State to track which FAQ item is expanded
  const [expandedId, setExpandedId] = useState(null);

  // Toggle expansion state
  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-blue-50 to-white" id="faq">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">Frequently Asked Questions</h2>
          <div className="w-32 h-1 bg-gradient-to-r from-[var(--highlight-color)] to-indigo-600 mx-auto mt-6"></div>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4 bg-white rounded-2xl p-8 shadow-xl border border-blue-100">
          {faqItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-xl overflow-hidden transition-all duration-300 border border-blue-100 hover:border-blue-300"
            >
              <button 
                className={`w-full text-left p-5 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 flex justify-between items-center transition-colors ${
                  expandedId === item.id ? 'bg-gradient-to-r from-blue-50 to-indigo-50' : 'bg-white'
                }`}
                onClick={() => toggleExpand(item.id)}
                aria-expanded={expandedId === item.id}
              >
                <h3 className="text-lg font-semibold text-blue-900">{item.question}</h3>
                <span className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                  expandedId === item.id 
                    ? 'bg-[var(--highlight-color)] text-white rotate-180' 
                    : 'bg-blue-100 text-blue-700 rotate-0'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  expandedId === item.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-6 bg-blue-50/50 border-t border-blue-100">
                  <p className="text-blue-700 leading-relaxed">{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        {/* <div className="mt-20">
          <div className="bg-gradient-to-r from-[var(--highlight-color)] to-indigo-600 rounded-2xl p-10 shadow-xl text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Have more questions?</h3>
            <p className="text-white text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              We're here to help! Contact us directly for personalized assistance.
            </p>
            <a 
              href="mailto:hermalocal@gmail.com" 
              className="px-8 py-4 bg-white text-[var(--highlight-color)] font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 inline-flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Support
            </a>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default FAQ;
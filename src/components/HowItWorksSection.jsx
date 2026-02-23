import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const HowItWorksSection = () => {
  const [headerRef, headerVisible] = useScrollAnimation(0.1);
  const [codeRef, codeVisible] = useScrollAnimation(0.05);

  const codeString = `import OpenAI from 'openai';

// 1. Initialize with Herma Base URL
const client = new OpenAI({
  baseURL: 'https://api.herma.ai/v1',
  apiKey: 'herma-sk-...' 
});

// 2. Use exactly like OpenAI
const response = await client.chat.completions.create({
  model: 'herma-auto', // Routes to the best model for the job
  messages: [{ role: 'user', content: 'Hello!' }],
});`;

  return (
    <section className="pt-12 sm:pt-16 pb-24 bg-[var(--bg-primary)]" id="how-it-works">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div
            ref={headerRef}
            className={`animate-on-scroll animate-fade-right ${headerVisible ? 'is-visible' : ''}`}
          >
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-6 tracking-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Drop-in Replacement
            </h2>
            <p
              className="text-lg text-[var(--text-secondary)] mb-8 leading-relaxed"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Switching to Herma is as simple as changing two lines of code. We are fully compatible with the standard OpenAI SDK, so you don't need to rewrite your application.
            </p>

            <ul className="space-y-4">
              {[
                "No new libraries to install",
                "Compatible with LangChain, Vercel AI SDK, etc.",
                "Instant API key provisioning",
                " Zero downtime migration"
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[var(--accent-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[var(--text-primary)] font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Code Snippet */}
          <div
            ref={codeRef}
            className={`relative animate-on-scroll animate-fade-left ${codeVisible ? 'is-visible' : ''}`}
          >
            {/* Background Decoration */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[var(--accent-primary)] to-purple-600 rounded-3xl opacity-20 blur-xl"></div>

            <div className="relative bg-[#1e1e1e] rounded-2xl shadow-2xl overflow-hidden border border-[var(--border-secondary)]">
              {/* Window Controls */}
              <div className="flex items-center px-4 py-3 bg-[#2d2d2d] border-b border-[#3d3d3d]">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-[#ff5f56] rounded-full"></div>
                  <div className="w-3 h-3 bg-[#ffbd2e] rounded-full"></div>
                  <div className="w-3 h-3 bg-[#27c93f] rounded-full"></div>
                </div>
                <div className="ml-4 text-xs text-gray-400 font-mono">integration.js</div>
              </div>

              {/* Syntax Highlighter */}
              <div className="p-4 overflow-x-auto">
                <SyntaxHighlighter
                  language="javascript"
                  style={atomDark}
                  customStyle={{ background: 'transparent', padding: 0, margin: 0, fontSize: '0.9rem' }}
                  wrapLongLines={true}
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorksSection;

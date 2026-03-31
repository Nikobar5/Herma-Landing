import React, { useEffect } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { setPageMeta, resetPageMeta } from '../utils/seo';

const About = () => {
  const [philRef, philVisible] = useScrollAnimation(0.1);
  const [teamRef, teamVisible] = useScrollAnimation(0.1);

  useEffect(() => {
    // SEO: per-page title for about page
    setPageMeta(
      'About',
      'Herma is built by Georgia Tech engineers to give developers and teams unified, intelligent access to every major AI model through a single OpenAI-compatible API.',
      { url: 'https://hermaai.com/about' }
    );
    return () => resetPageMeta();
  }, []);

  const founders = [
    {
      name: 'Niko Barciak',
      role: 'Co-Founder & CEO',
      photo: '/niko-barciak.jpg',
      bio: 'Computer Science at Georgia Tech. Built an AI agent for The Home Depot\'s enterprise AI team and has previously worked on making privacy-focused open-source LLMs economically feasible. Also involved in the Georgia Tech Angel Network, helping cultivate the Georgia Tech and Atlanta startup ecosystem across AI, deep tech, space, and other areas. At Herma, Niko leads the development of agentic systems and product.',
      linkedin: 'https://www.linkedin.com/in/niko-barciak-6a4302248/',
    },
    {
      name: 'Nicholas Pianfetti',
      role: 'Co-Founder & CTO',
      photo: '/nick-pianfetti.jpeg',
      bio: 'Mechanical Engineering/Computer Science at Georgia Tech. Built robotic control systems and high-frequency data pipelines at Tesla and has previous experience building agentic enterprise solutions. At Herma, Nick leads operations and infrastructure.',
      linkedin: 'https://www.linkedin.com/in/nicholas-pianfetti/',
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-16">
      {/* Philosophy Section */}
      <section className="py-16 sm:py-20">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={philRef}
            className={`animate-on-scroll animate-fade-up ${philVisible ? 'is-visible' : ''}`}
          >
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6 text-center"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Herma Philosophy
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-hover)] mx-auto mb-10"></div>

            <div className="space-y-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
              <p>
                AI is developing faster than any single provider can keep up with. Every week brings new models, new agents, and new breakthroughs scattered across dozens of platforms with separate APIs, billing systems, and interfaces.
              </p>
              <p>
                Herma exists because we believe all intelligence should flow through one gateway. When developers and teams can seamlessly access the best AI for every task without managing fragmented infrastructure, they build better, faster, and more creatively.
              </p>
              <p>
                Today, most people are locked into whichever AI provider they started with. Switching is painful, so they stay even when better options exist. Herma changes that. By giving you a single interface to every major AI provider, you're always free to use whoever is actually best right now. No rewiring your code, no migrating your data, no starting over. The AI ecosystem becomes competitive on quality, not on how hard it is to leave.
              </p>
              <p>
                Unification also makes AI safer. A single gateway means one place to enforce guardrails, monitor usage, control costs, and maintain accountability. Instead of security policies spread across a dozen providers, everything flows through one auditable layer.
              </p>
              <p>
                We're building Herma to be the intelligent layer between people and AI to connect every request to the right intelligence, remember context, and give teams full visibility into how AI is being used. One API, one interface, every model and agent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 sm:py-20">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={teamRef}
            className={`animate-on-scroll animate-fade-up ${teamVisible ? 'is-visible' : ''}`}
          >
            <h2
              className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-12 text-center"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Our Team
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {founders.map((founder) => (
                <div
                  key={founder.name}
                  className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-secondary)] p-6 sm:p-8 flex flex-col items-center text-center"
                >
                  <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden mb-6 border-2 border-[var(--border-secondary)]">
                    <img
                      src={founder.photo}
                      alt={founder.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3
                    className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-1"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {founder.name}
                  </h3>

                  <p
                    className="text-sm font-medium text-[var(--accent-primary)] mb-4"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {founder.role}
                  </p>

                  <p
                    className="text-[var(--text-secondary)] leading-relaxed mb-5"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {founder.bio}
                  </p>

                  <a
                    href={founder.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] transition-colors"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;

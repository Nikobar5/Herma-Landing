import React from 'react';
import MarkdownPage from '../components/MarkdownPage';

export default function FAQPage() {
  return (
    <MarkdownPage
      src="/content/faq.md"
      meta={{
        title: 'Frequently Asked Questions',
        description: 'Answers to common questions about Herma | AI model routing, pricing, API compatibility, memory, and getting started.',
        url: 'https://hermaai.com/faq',
      }}
    />
  );
}

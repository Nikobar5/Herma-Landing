import React from 'react';
import MarkdownPage from '../components/MarkdownPage';

export default function Documentation() {
  return (
    <MarkdownPage
      src="/content/docs.md"
      meta={{
        title: 'API Documentation',
        description: 'Herma is OpenAI-compatible — change two lines of code to start routing AI calls intelligently. Python, Node.js, and curl examples. Free $1 to start.',
        url: 'https://hermaai.com/docs',
      }}
    />
  );
}

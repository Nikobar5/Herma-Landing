import React from 'react';
import MarkdownPage from '../components/MarkdownPage';

export default function About() {
  return (
    <MarkdownPage
      src="/content/about.md"
      meta={{
        title: 'About',
        description: 'Herma is built by Georgia Tech engineers to give developers and teams unified, intelligent access to every major AI model through a single OpenAI-compatible API.',
        url: 'https://hermaai.com/about',
      }}
    />
  );
}

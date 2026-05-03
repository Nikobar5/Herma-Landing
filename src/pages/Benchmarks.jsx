import React from 'react';
import MarkdownPage from '../components/MarkdownPage';

export default function Benchmarks() {
  return (
    <MarkdownPage
      src="/content/benchmarks.md"
      meta={{
        title: 'Quality & Benchmarks',
        description: 'Herma quality benchmarks — 8/8 industry-standard benchmarks at frontier quality, 89% average cost savings. Common questions answered.',
        url: 'https://hermaai.com/benchmarks',
      }}
    />
  );
}

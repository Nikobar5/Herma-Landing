import React from 'react';
import MarkdownPage from '../components/MarkdownPage';

export default function TermsOfService() {
  return (
    <MarkdownPage
      src="/content/terms-of-service.md"
      meta={{
        title: 'Terms of Service',
        description: 'Herma Terms of Service — the terms governing use of the Herma AI model routing service.',
        url: 'https://hermaai.com/terms-of-service',
      }}
    />
  );
}

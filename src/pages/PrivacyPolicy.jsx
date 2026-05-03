import React from 'react';
import MarkdownPage from '../components/MarkdownPage';

export default function PrivacyPolicy() {
  return (
    <MarkdownPage
      src="/content/privacy-policy.md"
      meta={{
        title: 'Privacy Policy',
        description: 'Herma Privacy Policy — how we collect, use, and handle your information.',
        url: 'https://hermaai.com/privacy-policy',
      }}
    />
  );
}

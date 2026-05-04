import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { setPageMeta, resetPageMeta } from '../utils/seo';
import './MarkdownPage.css';

function extractText(node) {
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (node?.props?.children) return extractText(node.props.children);
  return '';
}

function PreBlock({ children }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const text = extractText(children).replace(/\n$/, '');
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* noop */ }
  };

  return (
    <div className="markdown-pre-wrapper">
      <button
        onClick={handleCopy}
        className={`markdown-copy-btn${copied ? ' copied' : ''}`}
        aria-label="Copy code"
      >
        {copied ? '✓ Copied' : 'Copy'}
      </button>
      <pre>{children}</pre>
    </div>
  );
}

export default function MarkdownPage({ src, meta }) {
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const isRaw = searchParams.has('raw');

  useEffect(() => {
    if (meta) {
      setPageMeta(meta.title, meta.description, { url: meta.url });
    }
    return () => resetPageMeta();
  }, [meta]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(src)
      .then(r => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.text();
      })
      .then(text => {
        setMarkdown(text);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [src]);

  const toggleRaw = () => {
    const next = new URLSearchParams(searchParams);
    if (isRaw) {
      next.delete('raw');
    } else {
      next.set('raw', '');
    }
    setSearchParams(next);
  };

  if (loading) {
    return (
      <main className="markdown-page-container">
        <div className="markdown-loading">Loading…</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="markdown-page-container">
        <div className="markdown-error">Could not load content ({error})</div>
      </main>
    );
  }

  return (
    <main className="markdown-page-container">
      <div className="markdown-mode-toggle">
        {!isRaw && (
          <a href={src} className="markdown-source-link">
            source .md ↗
          </a>
        )}
        <button onClick={toggleRaw} className="markdown-toggle-btn">
          {isRaw ? '[ Rendered ]' : '[ Raw ]'}
        </button>
      </div>

      {isRaw ? (
        <pre className="markdown-raw-pre">{markdown}</pre>
      ) : (
        <div className="markdown-prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ pre: PreBlock }}>{markdown}</ReactMarkdown>
        </div>
      )}
    </main>
  );
}

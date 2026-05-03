import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { streamDemoChat } from '../services/hermaApi';

const BASE_SYSTEM_CONTENT = `You are Herma's AI assistant on hermaai.com. Your sole purpose is to answer questions about Herma.

If a user asks anything not related to Herma, do not answer it. Say you can only help with Herma questions and ask what they'd like to know about Herma.

At the end of every response, add a brief natural CTA encouraging the user to sign up — e.g. "Sign up free at hermaai.com to try it with your own API calls" or "Create a free account to get your API key — no credit card needed." Keep it one sentence, conversational, not salesy.`;

const AskHermaContext = createContext(null);

export function AskHermaProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);
  const knowledgeRef = useRef('');

  useEffect(() => {
    fetch('/content/knowledge-base.md')
      .then(r => r.ok ? r.text() : '')
      .then(text => { knowledgeRef.current = text; })
      .catch(() => {});
  }, []);

  const submit = useCallback(async (text) => {
    const trimmed = (text || '').trim();
    if (!trimmed || isStreaming) return;

    setError(null);
    setInputValue('');

    const userMsg = { id: Date.now(), role: 'user', content: trimmed };
    const assistantMsg = { id: Date.now() + 1, role: 'assistant', content: '', streaming: true };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    const systemContent = knowledgeRef.current
      ? `${BASE_SYSTEM_CONTENT}\n\n---\n\n${knowledgeRef.current}`
      : BASE_SYSTEM_CONTENT;

    // Build API messages: system + prior turns (skip empty assistant messages) + new user msg
    const apiMessages = [
      { role: 'system', content: systemContent },
      ...messages
        .filter((m) => !(m.role === 'assistant' && !m.content))
        .map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: trimmed },
    ];

    try {
      await streamDemoChat(apiMessages, {
        signal: controller.signal,
        onChunk: ({ type, content }) => {
          if (type === 'content') {
            setMessages((prev) => {
              const updated = [...prev];
              const last = { ...updated[updated.length - 1] };
              last.content += content;
              updated[updated.length - 1] = last;
              return updated;
            });
          }
        },
        onDone: () => {
          setMessages((prev) => {
            const updated = [...prev];
            const last = { ...updated[updated.length - 1] };
            last.streaming = false;
            updated[updated.length - 1] = last;
            return updated;
          });
          setIsStreaming(false);
        },
        onError: (err) => {
          setIsStreaming(false);
          setMessages((prev) => {
            const updated = [...prev];
            if (updated.length > 0) {
              const last = { ...updated[updated.length - 1] };
              last.streaming = false;
              updated[updated.length - 1] = last;
            }
            return updated;
          });
          if (err.message?.includes('rate limit') || err.message?.includes('429')) {
            setError('rate_limit');
          } else {
            setError(err.message || 'Something went wrong. Please try again.');
          }
        },
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        setIsStreaming(false);
        setMessages((prev) => {
          if (prev.length === 0) return prev;
          const updated = [...prev];
          const last = { ...updated[updated.length - 1] };
          last.streaming = false;
          updated[updated.length - 1] = last;
          return updated;
        });
        if (err.message?.includes('rate limit') || err.message?.includes('429')) {
          setError('rate_limit');
        } else {
          setError(err.message || 'Something went wrong. Please try again.');
        }
      }
    }
  }, [isStreaming, messages]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
    setMessages((prev) => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
      const last = { ...updated[updated.length - 1] };
      last.streaming = false;
      updated[updated.length - 1] = last;
      return updated;
    });
  }, []);

  const clear = useCallback(() => {
    stop();
    setMessages([]);
    setError(null);
  }, [stop]);

  return (
    <AskHermaContext.Provider
      value={{ messages, inputValue, setInputValue, isStreaming, error, setError, submit, stop, clear }}
    >
      {children}
    </AskHermaContext.Provider>
  );
}

export function useAskHerma() {
  return useContext(AskHermaContext);
}

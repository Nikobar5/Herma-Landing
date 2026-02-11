import { useState, useRef, useCallback } from 'react';
import { streamChat } from '../services/hermaApi';

export function useChat({ activeId, addMessage, updateLastMessage, removeLastMessage, activeConversation, createConversation }) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const abortRef = useRef(null);

  const dismissPaywall = useCallback(() => setShowPaywall(false), []);

  const sendMessage = useCallback(
    async (content) => {
      if (!content.trim() || isStreaming) return;

      let convId = activeId;
      if (!convId) {
        const conv = createConversation();
        convId = conv.id;
      }

      const userMsg = { role: 'user', content: content.trim() };
      addMessage(convId, userMsg);

      const assistantMsg = { role: 'assistant', content: '' };
      addMessage(convId, assistantMsg);

      setIsStreaming(true);
      const controller = new AbortController();
      abortRef.current = controller;

      // Build messages array from current conversation + new user message
      const currentConv = activeId
        ? activeConversation
        : null;
      const allMessages = [
        ...(currentConv?.messages || []).map((m) => ({
          role: m.role,
          content: m.content,
        })),
        { role: 'user', content: content.trim() },
      ];

      try {
        await streamChat(allMessages, {
          signal: controller.signal,
          onChunk: (delta) => {
            if (delta.type === 'reasoning') {
              updateLastMessage(convId, (prev) => ({
                reasoning: (prev.reasoning || '') + delta.content,
              }));
            } else {
              updateLastMessage(convId, (prev) => ({
                content: prev.content + delta.content,
              }));
            }
          },
          onDone: (usage) => {
            if (usage) {
              updateLastMessage(convId, { usage });
            }
          },
          onError: () => {},
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          if (err.message && err.message.includes('Insufficient credits')) {
            setShowPaywall(true);
          }
          updateLastMessage(convId, (prev) => ({
            content: prev.content || `Error: ${err.message}`,
            error: true,
          }));
        }
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [isStreaming, activeId, activeConversation, addMessage, updateLastMessage, createConversation]
  );

  const stopGeneration = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, []);

  const regenerateLastResponse = useCallback(async () => {
    if (!activeConversation || activeConversation.messages.length < 2) return;

    const messages = activeConversation.messages;
    const lastUserIdx = messages.length - 2;
    if (messages[lastUserIdx]?.role !== 'user') return;

    removeLastMessage(activeId);

    // Now re-send: the last message should be the user message
    // Build messages from the conversation minus the last assistant message
    const convMessages = messages.slice(0, -1).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const assistantMsg = { role: 'assistant', content: '' };
    addMessage(activeId, assistantMsg);

    setIsStreaming(true);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await streamChat(convMessages, {
        signal: controller.signal,
        onChunk: (delta) => {
          if (delta.type === 'reasoning') {
            updateLastMessage(activeId, (prev) => ({
              reasoning: (prev.reasoning || '') + delta.content,
            }));
          } else {
            updateLastMessage(activeId, (prev) => ({
              content: prev.content + delta.content,
            }));
          }
        },
        onDone: (usage) => {
          if (usage) {
            updateLastMessage(activeId, { usage });
          }
        },
        onError: () => {},
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        if (err.message && err.message.includes('Insufficient credits')) {
          setShowPaywall(true);
        }
        updateLastMessage(activeId, (prev) => ({
          content: prev.content || `Error: ${err.message}`,
          error: true,
        }));
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [activeConversation, activeId, addMessage, updateLastMessage, removeLastMessage]);

  return { isStreaming, sendMessage, stopGeneration, regenerateLastResponse, showPaywall, dismissPaywall };
}

import { useState, useCallback } from 'react';

const STORAGE_KEY = 'herma_conversations';
const MAX_CONVERSATIONS = 50;

function loadConversations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveConversations(conversations) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function titleFromContent(content) {
  const trimmed = content.trim().slice(0, 60);
  return trimmed.length < content.trim().length ? trimmed + '…' : trimmed;
}

export function useConversations() {
  const [conversations, setConversations] = useState(loadConversations);
  const [activeId, setActiveId] = useState(null);

  const activeConversation = conversations.find((c) => c.id === activeId) || null;

  const update = useCallback((fn) => {
    setConversations((prev) => {
      const next = fn(prev);
      saveConversations(next);
      return next;
    });
  }, []);

  const createConversation = useCallback(() => {
    const conv = {
      id: generateId(),
      title: 'New chat',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    update((prev) => [conv, ...prev].slice(0, MAX_CONVERSATIONS));
    setActiveId(conv.id);
    return conv;
  }, [update]);

  const deleteConversation = useCallback(
    (id) => {
      update((prev) => prev.filter((c) => c.id !== id));
      setActiveId((prevId) => {
        if (prevId !== id) return prevId;
        const remaining = conversations.filter((c) => c.id !== id);
        return remaining.length > 0 ? remaining[0].id : null;
      });
    },
    [conversations, update]
  );

  const renameConversation = useCallback(
    (id, title) => {
      update((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, title, updatedAt: new Date().toISOString() } : c
        )
      );
    },
    [update]
  );

  const addMessage = useCallback(
    (conversationId, message) => {
      update((prev) =>
        prev.map((c) => {
          if (c.id !== conversationId) return c;
          const messages = [...c.messages, message];
          const title =
            c.messages.length === 0 && message.role === 'user'
              ? titleFromContent(message.content)
              : c.title;
          return { ...c, messages, title, updatedAt: new Date().toISOString() };
        })
      );
    },
    [update]
  );

  const updateLastMessage = useCallback(
    (conversationId, updater) => {
      update((prev) =>
        prev.map((c) => {
          if (c.id !== conversationId || c.messages.length === 0) return c;
          const messages = [...c.messages];
          const last = { ...messages[messages.length - 1] };
          if (typeof updater === 'function') {
            Object.assign(last, updater(last));
          } else {
            Object.assign(last, updater);
          }
          messages[messages.length - 1] = last;
          return { ...c, messages, updatedAt: new Date().toISOString() };
        })
      );
    },
    [update]
  );

  const removeLastMessage = useCallback(
    (conversationId) => {
      update((prev) =>
        prev.map((c) => {
          if (c.id !== conversationId || c.messages.length === 0) return c;
          return {
            ...c,
            messages: c.messages.slice(0, -1),
            updatedAt: new Date().toISOString(),
          };
        })
      );
    },
    [update]
  );

  return {
    conversations,
    activeConversation,
    activeId,
    setActiveId,
    createConversation,
    deleteConversation,
    renameConversation,
    addMessage,
    updateLastMessage,
    removeLastMessage,
  };
}

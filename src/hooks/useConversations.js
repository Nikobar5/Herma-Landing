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

  const persist = useCallback((updated) => {
    setConversations(updated);
    saveConversations(updated);
  }, []);

  const createConversation = useCallback(() => {
    const conv = {
      id: generateId(),
      title: 'New chat',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [conv, ...conversations].slice(0, MAX_CONVERSATIONS);
    persist(updated);
    setActiveId(conv.id);
    return conv;
  }, [conversations, persist]);

  const deleteConversation = useCallback(
    (id) => {
      const updated = conversations.filter((c) => c.id !== id);
      persist(updated);
      if (activeId === id) {
        setActiveId(updated.length > 0 ? updated[0].id : null);
      }
    },
    [conversations, activeId, persist]
  );

  const renameConversation = useCallback(
    (id, title) => {
      const updated = conversations.map((c) =>
        c.id === id ? { ...c, title, updatedAt: new Date().toISOString() } : c
      );
      persist(updated);
    },
    [conversations, persist]
  );

  const addMessage = useCallback(
    (conversationId, message) => {
      const updated = conversations.map((c) => {
        if (c.id !== conversationId) return c;
        const messages = [...c.messages, message];
        const title =
          c.messages.length === 0 && message.role === 'user'
            ? titleFromContent(message.content)
            : c.title;
        return { ...c, messages, title, updatedAt: new Date().toISOString() };
      });
      persist(updated);
    },
    [conversations, persist]
  );

  const updateLastMessage = useCallback(
    (conversationId, updater) => {
      const updated = conversations.map((c) => {
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
      });
      persist(updated);
    },
    [conversations, persist]
  );

  const removeLastMessage = useCallback(
    (conversationId) => {
      const updated = conversations.map((c) => {
        if (c.id !== conversationId || c.messages.length === 0) return c;
        return {
          ...c,
          messages: c.messages.slice(0, -1),
          updatedAt: new Date().toISOString(),
        };
      });
      persist(updated);
    },
    [conversations, persist]
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

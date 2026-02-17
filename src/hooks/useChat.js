import { useState, useRef, useCallback, useEffect } from 'react';
import { streamChat } from '../services/hermaApi';

const STREAM_TIMEOUT_MS = 120_000; // 120 seconds

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function fileToText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

const TEXT_EXTENSIONS = new Set([
  'txt', 'md', 'markdown', 'csv', 'tsv', 'log', 'rtf',
  'py', 'js', 'ts', 'jsx', 'tsx', 'html', 'htm', 'css', 'scss', 'less', 'sass',
  'java', 'c', 'cpp', 'cc', 'h', 'hpp', 'cs', 'go', 'rs', 'rb', 'php',
  'swift', 'kt', 'kts', 'scala', 'r', 'sh', 'bash', 'zsh', 'bat', 'ps1',
  'sql', 'lua', 'pl', 'ex', 'exs', 'hs', 'clj', 'erl', 'zig', 'dart', 'groovy',
  'json', 'xml', 'yaml', 'yml', 'toml', 'ini', 'cfg', 'conf', 'env',
  'svg', 'tex', 'bib', 'tf', 'hcl',
]);

const EXT_TO_LANG = {
  py: 'python', js: 'javascript', ts: 'typescript', jsx: 'jsx', tsx: 'tsx',
  html: 'html', htm: 'html', css: 'css', scss: 'scss', less: 'less',
  java: 'java', c: 'c', cpp: 'cpp', h: 'c', hpp: 'cpp', cs: 'csharp',
  go: 'go', rs: 'rust', rb: 'ruby', php: 'php', swift: 'swift',
  kt: 'kotlin', scala: 'scala', r: 'r', sh: 'bash', bash: 'bash', zsh: 'zsh',
  sql: 'sql', lua: 'lua', ex: 'elixir', hs: 'haskell', dart: 'dart',
  json: 'json', xml: 'xml', yaml: 'yaml', yml: 'yaml', toml: 'toml',
  md: 'markdown', svg: 'xml', tex: 'latex', tf: 'hcl', groovy: 'groovy',
};

function getFileExt(name) {
  const dot = name.lastIndexOf('.');
  return dot >= 0 ? name.slice(dot + 1).toLowerCase() : '';
}

function isTextFile(file) {
  return TEXT_EXTENSIONS.has(getFileExt(file.name));
}

async function buildMultimodalContent(text, files) {
  const parts = [];
  if (text.trim()) {
    parts.push({ type: 'text', text: text.trim() });
  }
  for (const f of files) {
    if (f.type.startsWith('image/')) {
      const dataUri = await fileToBase64(f);
      parts.push({ type: 'image_url', image_url: { url: dataUri } });
    } else if (f.type === 'application/pdf') {
      const dataUri = await fileToBase64(f);
      parts.push({ type: 'file', file: { filename: f.name, file_data: dataUri } });
    } else if (isTextFile(f)) {
      const content = await fileToText(f);
      const ext = getFileExt(f.name);
      const lang = EXT_TO_LANG[ext] || '';
      parts.push({ type: 'text', text: `Content of ${f.name}:\n\`\`\`${lang}\n${content}\n\`\`\`` });
    }
  }
  return parts;
}

export function useChat({ activeId, addMessage, updateLastMessage, removeLastMessage, activeConversation, createConversation }) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const abortRef = useRef(null);
  const timeoutRef = useRef(null);

  // Abort stream when switching conversations
  useEffect(() => {
    if (isStreaming && abortRef.current) {
      abortRef.current.abort();
      setIsStreaming(false);
      abortRef.current = null;
      clearTimeout(timeoutRef.current);
    }
  }, [activeId]); // eslint-disable-line react-hooks/exhaustive-deps

  const clearStreamTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const dismissPaywall = useCallback(() => setShowPaywall(false), []);

  const sendMessage = useCallback(
    async (content, files = []) => {
      if (!content.trim() && files.length === 0) return;
      if (isStreaming) return;

      let convId = activeId;
      if (!convId) {
        const conv = createConversation();
        convId = conv.id;
      }

      // Build content: multimodal array if files present, plain string otherwise
      let msgContent;
      if (files.length > 0) {
        msgContent = await buildMultimodalContent(content, files);
      } else {
        msgContent = content.trim();
      }

      // For display/title purposes, store plain text + file metadata
      const userMsg = {
        role: 'user',
        content: msgContent,
        ...(files.length > 0 && {
          displayText: content.trim(),
          attachments: files.map((f) => ({
            name: f.name,
            type: f.type,
            isText: isTextFile(f),
          })),
        }),
      };
      addMessage(convId, userMsg);

      const assistantMsg = { role: 'assistant', content: '' };
      addMessage(convId, assistantMsg);

      setIsStreaming(true);
      const controller = new AbortController();
      abortRef.current = controller;
      let receivedContent = false;

      // Build messages array from current conversation + new user message
      const currentConv = activeId
        ? activeConversation
        : null;
      const allMessages = [
        ...(currentConv?.messages || []).map((m) => ({
          role: m.role,
          content: m.content,
        })),
        { role: 'user', content: msgContent },
      ];

      // Start streaming timeout
      const resetTimeout = () => {
        clearStreamTimeout();
        timeoutRef.current = setTimeout(() => {
          controller.abort();
          updateLastMessage(convId, (prev) => ({
            content: prev.content || 'Response timed out. Please try again.',
            error: true,
          }));
          setIsStreaming(false);
          abortRef.current = null;
        }, STREAM_TIMEOUT_MS);
      };
      resetTimeout();

      try {
        await streamChat(allMessages, {
          signal: controller.signal,
          onChunk: (delta) => {
            receivedContent = true;
            resetTimeout(); // Reset timeout on each chunk
            if (delta.type === 'annotations') {
              updateLastMessage(convId, (prev) => ({
                annotations: [...(prev.annotations || []), ...delta.annotations],
              }));
            } else if (delta.type === 'reasoning') {
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
            // Detect empty response — stream completed but no content was received
            if (!receivedContent) {
              updateLastMessage(convId, (prev) => ({
                content: prev.content || 'No response received. Please try again.',
                error: !prev.content,
              }));
            }
          },
          onError: () => {},
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          if (err.status === 402 || (err.message && err.message.includes('Insufficient credits'))) {
            setShowPaywall(true);
          }
          updateLastMessage(convId, (prev) => ({
            content: prev.content || `Error: ${err.message}`,
            error: true,
          }));
        }
      } finally {
        clearStreamTimeout();
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [isStreaming, activeId, activeConversation, addMessage, updateLastMessage, createConversation, clearStreamTimeout]
  );

  const stopGeneration = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      setIsStreaming(false);
      abortRef.current = null;
      clearStreamTimeout();
    }
  }, [clearStreamTimeout]);

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
    let receivedContent = false;

    // Start streaming timeout
    const resetTimeout = () => {
      clearStreamTimeout();
      timeoutRef.current = setTimeout(() => {
        controller.abort();
        updateLastMessage(activeId, (prev) => ({
          content: prev.content || 'Response timed out. Please try again.',
          error: true,
        }));
        setIsStreaming(false);
        abortRef.current = null;
      }, STREAM_TIMEOUT_MS);
    };
    resetTimeout();

    try {
      await streamChat(convMessages, {
        signal: controller.signal,
        onChunk: (delta) => {
          receivedContent = true;
          resetTimeout(); // Reset timeout on each chunk
          if (delta.type === 'annotations') {
            updateLastMessage(activeId, (prev) => ({
              annotations: [...(prev.annotations || []), ...delta.annotations],
            }));
          } else if (delta.type === 'reasoning') {
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
          if (!receivedContent) {
            updateLastMessage(activeId, (prev) => ({
              content: prev.content || 'No response received. Please try again.',
              error: !prev.content,
            }));
          }
        },
        onError: () => {},
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        if (err.status === 402 || (err.message && err.message.includes('Insufficient credits'))) {
          setShowPaywall(true);
        }
        updateLastMessage(activeId, (prev) => ({
          content: prev.content || `Error: ${err.message}`,
          error: true,
        }));
      }
    } finally {
      clearStreamTimeout();
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [activeConversation, activeId, addMessage, updateLastMessage, removeLastMessage, clearStreamTimeout]);

  return { isStreaming, sendMessage, stopGeneration, regenerateLastResponse, showPaywall, dismissPaywall };
}

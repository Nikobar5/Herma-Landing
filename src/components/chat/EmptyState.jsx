import React, { useState, useRef, useEffect, useCallback } from 'react';

const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
const TEXT_EXTENSIONS = new Set([
  'txt', 'md', 'markdown', 'csv', 'tsv', 'log', 'rtf',
  'py', 'js', 'ts', 'jsx', 'tsx', 'html', 'htm', 'css', 'scss', 'less', 'sass',
  'java', 'c', 'cpp', 'cc', 'h', 'hpp', 'cs', 'go', 'rs', 'rb', 'php',
  'swift', 'kt', 'kts', 'scala', 'r', 'sh', 'bash', 'zsh', 'bat', 'ps1',
  'sql', 'lua', 'pl', 'ex', 'exs', 'hs', 'clj', 'erl', 'zig', 'dart', 'groovy',
  'json', 'xml', 'yaml', 'yml', 'toml', 'ini', 'cfg', 'conf', 'env',
  'svg', 'tex', 'bib', 'tf', 'hcl',
]);
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ACCEPT_STRING = 'image/jpeg,image/png,image/gif,image/webp,.pdf,.txt,.md,.csv,.tsv,.log,.py,.js,.ts,.jsx,.tsx,.html,.htm,.css,.scss,.java,.c,.cpp,.h,.hpp,.go,.rs,.rb,.php,.swift,.kt,.scala,.r,.sh,.sql,.lua,.ex,.hs,.dart,.json,.xml,.yaml,.yml,.toml,.ini,.cfg,.conf,.env,.svg,.tex,.groovy,.tf';

function getFileExt(name) {
  const dot = name.lastIndexOf('.');
  return dot >= 0 ? name.slice(dot + 1).toLowerCase() : '';
}

function isAcceptedFile(file) {
  if (IMAGE_TYPES.has(file.type)) return true;
  if (file.type === 'application/pdf') return true;
  if (TEXT_EXTENSIONS.has(getFileExt(file.name))) return true;
  return false;
}

const capabilities = [
  {
    label: 'Privacy routing',
    text: 'How does Herma route sensitive data to private models?',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    label: 'Cost savings',
    text: 'How much can I save by routing non-sensitive requests to public models?',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'Compare models',
    text: 'What are the differences between GPT-4, Claude, and Gemini?',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    label: 'Write code',
    text: 'Write a Python script that calls the Herma API with streaming',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
  },
];

const EmptyState = ({ onSend, isStreaming, onStop }) => {
  const [value, setValue] = useState('');
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [sizeWarning, setSizeWarning] = useState(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 200) + 'px';
    }
  }, [value]);

  useEffect(() => {
    if (sizeWarning) {
      const t = setTimeout(() => setSizeWarning(null), 3000);
      return () => clearTimeout(t);
    }
  }, [sizeWarning]);

  const addFiles = useCallback((incoming) => {
    const valid = [];
    for (const f of incoming) {
      if (!isAcceptedFile(f)) continue;
      if (f.size > MAX_FILE_SIZE) {
        setSizeWarning(`${f.name} exceeds 20 MB limit`);
        continue;
      }
      const isImage = f.type.startsWith('image/');
      const isText = !isImage && f.type !== 'application/pdf' && TEXT_EXTENSIONS.has(getFileExt(f.name));
      valid.push({ file: f, preview: isImage ? URL.createObjectURL(f) : null, type: f.type, isText });
    }
    setFiles((prev) => [...prev, ...valid]);
  }, []);

  const removeFile = useCallback((index) => {
    setFiles((prev) => {
      const removed = prev[index];
      if (removed?.preview) URL.revokeObjectURL(removed.preview);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const handleSubmit = () => {
    if ((!value.trim() && files.length === 0) || isStreaming) return;
    onSend(value, files.map((f) => f.file));
    setValue('');
    setFiles((prev) => {
      prev.forEach((f) => f.preview && URL.revokeObjectURL(f.preview));
      return [];
    });
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handlePaste = (e) => {
    const pastedFiles = Array.from(e.clipboardData.files);
    if (pastedFiles.length > 0) addFiles(pastedFiles);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 bg-[var(--bg-primary)] overflow-auto">
      <div className="w-full max-w-2xl flex flex-col items-center">
        {/* Big Greeting */}
        <h1
          className="text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-8 text-center"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          What can I help you with?
        </h1>

        {sizeWarning && (
          <div className="text-xs text-[var(--error)] mb-2 px-1 self-start" style={{ fontFamily: 'var(--font-ui)' }}>
            {sizeWarning}
          </div>
        )}

        {/* Large Input Area */}
        <div
          className={`w-full rounded-2xl border bg-[var(--bg-tertiary)]/80 backdrop-blur-sm shadow-lg focus-within:border-[var(--accent-primary)] focus-within:ring-2 focus-within:ring-[var(--accent-primary)]/10 transition-all ${
            dragging ? 'border-dashed border-[var(--accent-primary)]' : 'border-[var(--border-secondary)]'
          }`}
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* File preview row */}
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 px-4 pt-3">
              {files.map((f, i) =>
                f.preview ? (
                  <div key={i} className="relative group/thumb">
                    <img src={f.preview} alt="" className="w-10 h-10 rounded-lg object-cover border border-[var(--border-secondary)]" />
                    <button
                      onClick={() => removeFile(i)}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[var(--error)] text-white text-[10px] flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  <div key={i} className="relative group/chip flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-secondary)] text-xs text-[var(--text-secondary)]">
                    {f.isText ? (
                      <svg className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 3.5L18.5 8H14V3.5zM6 20V4h7v5h5v11H6z" />
                      </svg>
                    )}
                    <span className="truncate max-w-[100px]">{f.file.name}</span>
                    <button
                      onClick={() => removeFile(i)}
                      className="ml-0.5 text-[var(--text-tertiary)] hover:text-[var(--error)] transition-colors"
                    >
                      &times;
                    </button>
                  </div>
                )
              )}
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder="How can I help you today?"
            rows={3}
            className="w-full resize-none bg-transparent outline-none text-base text-[var(--text-primary)] placeholder-[var(--text-tertiary)] p-4 pb-2"
            style={{ fontFamily: 'var(--font-ui)', maxHeight: '200px' }}
            autoFocus
          />
          <div className="flex items-center justify-between px-3 pb-3">
            {/* "+" button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-8 h-8 rounded-full border border-[var(--border-secondary)] text-[var(--text-tertiary)] flex items-center justify-center hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors"
              aria-label="Attach file"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={ACCEPT_STRING}
              className="hidden"
              onChange={(e) => {
                addFiles(Array.from(e.target.files));
                e.target.value = '';
              }}
            />

            {isStreaming ? (
              <button
                onClick={onStop}
                className="w-9 h-9 rounded-xl bg-[var(--error)] text-white flex items-center justify-center hover:bg-opacity-90 transition-colors shadow-md"
                aria-label="Stop generating"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" rx="1" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!value.trim() && files.length === 0}
                className="w-9 h-9 rounded-xl bg-[var(--accent-primary)] text-white flex items-center justify-center hover:bg-[var(--accent-hover)] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-md"
                aria-label="Send message"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Capability chips */}
        <div className="flex flex-wrap gap-2 mt-5 justify-center">
          {capabilities.map((cap) => (
            <button
              key={cap.label}
              onClick={() => onSend(cap.text)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[var(--border-secondary)] bg-[var(--bg-secondary)] text-sm text-[var(--text-secondary)] hover:border-[var(--border-accent)] hover:text-[var(--text-primary)] hover:shadow-sm transition-all"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              <span className="text-[var(--accent-primary)]">{cap.icon}</span>
              {cap.label}
            </button>
          ))}
        </div>

        {/* Disclaimer */}
        <p
          className="text-[11px] text-[var(--text-tertiary)] text-center mt-8 opacity-70"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          Herma can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
};

export default EmptyState;

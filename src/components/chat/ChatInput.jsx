import React, { useState, useRef, useEffect, useCallback } from 'react';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

const ChatInput = ({ onSend, onStop, isStreaming }) => {
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
      if (!ACCEPTED_TYPES.includes(f.type)) continue;
      if (f.size > MAX_FILE_SIZE) {
        setSizeWarning(`${f.name} exceeds 20 MB limit`);
        continue;
      }
      valid.push({ file: f, preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : null, type: f.type });
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
    <div className="border-t border-[var(--border-primary)] bg-[var(--bg-secondary)]/60 backdrop-blur-md pt-4 pb-6 absolute bottom-0 left-0 right-0 z-10">
      <div className="max-w-4xl mx-auto px-4">
        {sizeWarning && (
          <div className="text-xs text-[var(--error)] mb-2 px-1" style={{ fontFamily: 'var(--font-ui)' }}>
            {sizeWarning}
          </div>
        )}
        <div
          className={`relative flex flex-col bg-[var(--bg-tertiary)]/80 backdrop-blur-sm rounded-2xl border shadow-lg px-4 py-3 focus-within:border-[var(--accent-primary)] focus-within:ring-2 focus-within:ring-[var(--accent-primary)]/10 transition-all ${
            dragging ? 'border-dashed border-[var(--accent-primary)]' : 'border-[var(--border-secondary)]'
          }`}
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* File preview row */}
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
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
                    <svg className="w-3.5 h-3.5 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 3.5L18.5 8H14V3.5zM6 20V4h7v5h5v11H6z" />
                    </svg>
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

          <div className="flex items-end gap-2">
            {/* "+" button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-shrink-0 w-9 h-9 rounded-full border border-[var(--border-secondary)] text-[var(--text-tertiary)] flex items-center justify-center hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors"
              aria-label="Attach file"
            >
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/gif,image/webp,.pdf"
              className="hidden"
              onChange={(e) => {
                addFiles(Array.from(e.target.files));
                e.target.value = '';
              }}
            />

            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder="Send a message..."
              rows={1}
              className="flex-1 resize-none bg-transparent outline-none text-base text-[var(--text-primary)] placeholder-[var(--text-tertiary)] py-1"
              style={{ fontFamily: 'var(--font-ui)', maxHeight: '200px' }}
            />
            {isStreaming ? (
              <button
                onClick={onStop}
                className="flex-shrink-0 w-10 h-10 rounded-xl bg-[var(--error)] text-white flex items-center justify-center hover:bg-opacity-90 transition-colors shadow-md hover:shadow-lg transform active:scale-95"
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
                className="flex-shrink-0 w-10 h-10 rounded-xl bg-[var(--accent-primary)] text-white flex items-center justify-center hover:bg-[var(--accent-hover)] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform active:scale-95"
                aria-label="Send message"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
        <p className="text-[11px] text-[var(--text-tertiary)] text-center mt-3 font-medium opacity-70" style={{ fontFamily: 'var(--font-ui)' }}>
          Herma can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
};

export default ChatInput;

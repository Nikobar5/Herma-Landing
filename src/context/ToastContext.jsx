import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const timersRef = useRef({});

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        if (timersRef.current[id]) {
            clearTimeout(timersRef.current[id]);
            delete timersRef.current[id];
        }
    }, []);

    const addToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = ++idCounter;
        setToasts((prev) => [...prev, { id, message, type }]);
        timersRef.current[id] = setTimeout(() => removeToast(id), duration);
        return id;
    }, [removeToast]);

    const toast = useCallback({
        success: (msg) => addToast(msg, 'success'),
        error: (msg) => addToast(msg, 'error'),
        warning: (msg) => addToast(msg, 'warning'),
        info: (msg) => addToast(msg, 'info'),
    }, [addToast]);

    // Fix: toast needs to be a plain object, not useCallback
    const value = { toast: { success: (msg) => addToast(msg, 'success'), error: (msg) => addToast(msg, 'error'), warning: (msg) => addToast(msg, 'warning'), info: (msg) => addToast(msg, 'info') } };

    return (
        <ToastContext.Provider value={value}>
            {children}
            {/* Toast container */}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col-reverse gap-2 pointer-events-none" style={{ maxWidth: 380 }}>
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className="pointer-events-auto animate-toast-in"
                        style={{ animation: 'toastSlideIn 0.3s ease-out' }}
                    >
                        <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm text-sm ${t.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                t.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                    t.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                                        'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/20 text-[var(--accent-primary)]'
                            }`}>
                            <span className="mt-0.5">
                                {t.type === 'success' && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                                {t.type === 'error' && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>}
                                {t.type === 'warning' && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>}
                                {t.type === 'info' && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                            </span>
                            <span className="flex-1">{t.message}</span>
                            <button onClick={() => removeToast(t.id)} className="text-current opacity-50 hover:opacity-100 transition-opacity ml-2">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx.toast;
}

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 4500) => {
        const id = Date.now() + Math.random().toString(36).substring(2, 5);
        setToasts(prev => [...prev, { id, message, type }]);

        if (duration > 0) {
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const toast = {
        success: (msg) => addToast(msg, 'success'),
        error: (msg) => addToast(msg, 'error', 6500),
        warning: (msg) => addToast(msg, 'warning'),
        info: (msg) => addToast(msg, 'info')
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            {/* Fixed Toast Container */}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 max-w-md w-full px-4 pointer-events-none">
                {toasts.map(t => (
                    <div
                        key={t.id}
                        className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg shadow-lg border text-sm font-medium transition-all transform animate-in slide-in-from-bottom-2 ${
                            t.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' :
                            t.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-900' :
                            t.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-900' :
                            'bg-blue-50 border-blue-200 text-blue-900'
                        }`}
                    >
                        <span className="shrink-0 mt-0.5">
                            {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                            {t.type === 'error' && <XCircle className="w-5 h-5 text-rose-600" />}
                            {t.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                            {t.type === 'info' && <Info className="w-5 h-5 text-blue-600" />}
                        </span>
                        <div className="flex-1 leading-snug">{t.message}</div>
                        <button
                            onClick={() => removeToast(t.id)}
                            className="shrink-0 text-slate-400 hover:text-slate-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

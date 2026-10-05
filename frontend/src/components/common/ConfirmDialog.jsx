import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Delete',
    confirmVariant = 'danger',
    loading = false
}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
            <div className="flex items-start gap-3 mb-5">
                <div className={`p-2.5 rounded-full shrink-0 ${
                    confirmVariant === 'danger' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                }`}>
                    <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="text-xs text-slate-600 leading-relaxed pt-1">
                    {message}
                </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={onConfirm}
                    disabled={loading}
                    className={`px-4 py-2 text-xs font-semibold text-white rounded-lg transition-colors shadow-sm ${
                        confirmVariant === 'danger'
                            ? 'bg-rose-600 hover:bg-rose-700'
                            : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    {loading ? 'Processing...' : confirmText}
                </button>
            </div>
        </Modal>
    );
}

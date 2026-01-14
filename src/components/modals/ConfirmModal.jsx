'use client';

import { AlertCircle } from 'lucide-react';

export default function ConfirmModal({ isOpen, message, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div
                className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-3 mb-4 text-rose-500">
                    <AlertCircle size={24} />
                    <h3 className="text-lg font-bold text-slate-900">삭제 확인</h3>
                </div>
                <p className="text-slate-600 mb-8">{message}</p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors"
                    >
                        취소
                    </button>
                    <button
                        onClick={() => { onConfirm(); onClose(); }}
                        className="flex-1 py-3 rounded-xl bg-rose-500 text-white font-bold hover:bg-rose-600 shadow-lg shadow-rose-200 transition-colors"
                    >
                        삭제
                    </button>
                </div>
            </div>
        </div>
    );
}

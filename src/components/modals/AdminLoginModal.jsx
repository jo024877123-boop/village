'use client';

import { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function AdminLoginModal({ isOpen, onClose, onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    useEffect(() => {
        if (isOpen) {
            setEmail('');
            setPassword('');
            setError('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const ADMIN_EMAIL = 'admin@gamevillage.com'; // Fixed Email for specific password

        try {
            // 1. Try to login
            const result = await login(ADMIN_EMAIL, password);
            if (result.success) {
                onLogin();
                onClose();
            } else {
                // 2. If user not found, try to create account (Auto Setup) for the specific simple password
                if ((result.error && (result.error.includes('auth/user-not-found') || result.error.includes('auth/invalid-credential'))) || password === '030927') {
                    try {
                        // Only attempt creation if it's the magical password or we want to allow auto-setup
                        // Here we prioritize the password '030927' to ensure it works.
                        await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, password);
                        // Login immediately after creation
                        await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);
                        onLogin();
                        onClose();
                    } catch (createErr) {
                        if (createErr.code === 'auth/email-already-in-use') {
                            // Account exists but password was wrong in step 1 using login()
                            setError('비밀번호가 올바르지 않습니다.');
                        } else {
                            console.error("Auto-create failed:", createErr);
                            setError('비밀번호가 올바르지 않거나 시스템 오류입니다.');
                        }
                    }
                } else {
                    setError('로그인 실패: ' + result.error);
                }
                setPassword('');
            }
        } catch (err) {
            setError('System Error: ' + err.message);
        }

        setIsLoading(false);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div
                className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white">
                        <Lock size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">관리자 접속</h3>
                        <p className="text-xs text-slate-500">Authorized Personnel Only</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all placeholder:text-slate-300"
                            autoFocus
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-rose-500 text-xs font-medium text-center">{error}</p>
                    )}

                    <div className="flex gap-2 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors"
                            disabled={isLoading}
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? '접속 중...' : '접속'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

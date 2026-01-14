'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import AdminPanel from '@/components/AdminPanel';
import AdminLoginModal from '@/components/modals/AdminLoginModal';

export default function AdminPage() {
    const { user, loading, logout } = useAuth();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            setIsLoginOpen(true);
        }
    }, [user, loading]);

    const handleLoginSuccess = () => {
        setIsLoginOpen(false);
    };

    const handleClose = () => {
        // 로그인 취소 시 홈으로
        if (!user) {
            router.push('/');
        } else {
            setIsLoginOpen(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    if (loading) return null;

    if (user) {
        return <AdminPanel onLogout={handleLogout} />;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <AdminLoginModal isOpen={isLoginOpen} onClose={handleClose} onLogin={handleLoginSuccess} />
        </div>
    );
}

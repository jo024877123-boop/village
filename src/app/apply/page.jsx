'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SurveyForm from '@/components/SurveyForm';
import { useSiteData } from '@/hooks/useSiteData';

export default function ApplyPage() {
    const { siteData, loading } = useSiteData();

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center py-20 px-6 font-sans">
            <div className="w-full max-w-3xl">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-12 font-medium">
                    <ArrowLeft size={20} /> 홈으로 돌아가기
                </Link>

                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">입주 신청</h1>
                    <p className="text-slate-500 text-lg">새로운 주민이 되신 것을 환영합니다.</p>
                </div>

                {loading ? (
                    <div className="h-64 animate-pulse bg-slate-200 rounded-3xl"></div>
                ) : (
                    <SurveyForm />
                )}
            </div>
        </div>
    );
}

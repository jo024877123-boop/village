'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApplications } from '@/hooks/useSiteData';
import { Gamepad2, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { getIcon } from '@/lib/icons';

export default function ApplyForm({ games }) {
    const router = useRouter();
    const { submitApplication } = useApplications();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        contact: '', // 연락처 (전화번호 또는 카톡ID 등)
        selectedGames: [],
        introduction: '',
    });

    const handleGameToggle = (gameName) => {
        setFormData(prev => {
            const isSelected = prev.selectedGames.includes(gameName);
            if (isSelected) {
                return { ...prev, selectedGames: prev.selectedGames.filter(g => g !== gameName) };
            } else {
                return { ...prev, selectedGames: [...prev.selectedGames, gameName] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.selectedGames.length === 0) {
            alert('최소 하나 이상의 관심 게임을 선택해주세요.');
            return;
        }

        setLoading(true);
        const result = await submitApplication({
            ...formData,
            status: 'pending'
        });

        if (result.success) {
            setSuccess(true);
        } else {
            alert('신청 제출 중 오류가 발생했습니다: ' + result.error);
        }
        setLoading(false);
    };

    if (success) {
        return (
            <div className="text-center py-16 animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">신청이 완료되었습니다!</h2>
                <p className="text-slate-500 mb-8 text-lg">
                    담당자가 확인 후 기재해주신 연락처로<br />입주 안내 메시지를 보내드릴 예정입니다.
                </p>
                <button
                    onClick={() => router.push('/')}
                    className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
                >
                    메인으로 돌아가기
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* 기본 정보 */}
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">닉네임 / 이름</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="마을에서 사용할 닉네임을 입력하세요"
                        className="w-full px-5 py-4 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-lg bg-slate-50 focus:bg-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">연락처 (카카오톡 ID 또는 전화번호)</label>
                    <input
                        type="text"
                        required
                        value={formData.contact}
                        onChange={e => setFormData({ ...formData, contact: e.target.value })}
                        placeholder="입주 안내를 받으실 연락처를 남겨주세요"
                        className="w-full px-5 py-4 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-lg bg-slate-50 focus:bg-white"
                    />
                </div>
            </div>

            <div className="h-px bg-slate-100 w-full" />

            {/* 게임 선택 */}
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-4">플레이하는 게임 (다중 선택 가능)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {games && games.map(game => {
                        const Icon = getIcon(game.icon);
                        const isSelected = formData.selectedGames.includes(game.name);
                        return (
                            <button
                                key={game.id}
                                type="button"
                                onClick={() => handleGameToggle(game.name)}
                                className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${isSelected
                                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-500'
                                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                    }`}
                            >
                                <Icon size={20} className={isSelected ? 'text-indigo-600' : 'text-slate-400'} />
                                <span className="font-bold text-sm">{game.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="h-px bg-slate-100 w-full" />

            {/* 자기소개 */}
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">자기소개 / 가입 인사</label>
                <textarea
                    required
                    rows={5}
                    value={formData.introduction}
                    onChange={e => setFormData({ ...formData, introduction: e.target.value })}
                    placeholder="간단한 자기소개와 함께 평화로운 게임마을에 오시게 된 계기를 들려주세요."
                    className="w-full px-5 py-4 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-lg bg-slate-50 focus:bg-white resize-none"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-5 rounded-2xl bg-slate-900 text-white font-bold text-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <Loader2 className="animate-spin" /> 제출 중...
                    </>
                ) : (
                    <>
                        가입 신청하기 <ArrowRight />
                    </>
                )}
            </button>
        </form>
    );
}

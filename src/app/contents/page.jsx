'use client';

import { useContents } from '@/hooks/useContents';
import Link from 'next/link';
import { ArrowLeft, Loader2, ArrowRight } from 'lucide-react';
import { getIcon } from '@/lib/icons';
import FadeIn from '@/components/ui/FadeIn';

export default function ContentsPage() {
    const { contents, loading, error } = useContents();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <Loader2 className="animate-spin text-cyan-400" size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6">
                <div className="text-center">
                    <p className="text-red-400 mb-4">컨텐츠를 불러오는데 실패했습니다.</p>
                    <p className="text-slate-500 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `linear-gradient(rgba(0,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.3) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px'
                }} />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-transparent to-[#0a0a0f]" />

                {/* Neon Glow Orbs */}
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-cyan-500/20 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute top-[30%] right-[-15%] w-[45vw] h-[45vw] bg-fuchsia-500/15 rounded-full blur-[130px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
            </div>

            {/* Content */}
            <div className="relative z-10 container max-w-7xl mx-auto px-6 py-24">
                {/* Back Button */}
                <FadeIn delay={0}>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors mb-12 font-medium group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        홈으로 돌아가기
                    </Link>
                </FadeIn>

                {/* Header */}
                <FadeIn delay={100}>
                    <div className="text-center mb-20">
                        <span className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 border border-cyan-500/30 text-cyan-300 text-sm font-bold uppercase tracking-widest mb-6">
                            Village Contents
                        </span>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
                            <span className="text-white">마을의 </span>
                            <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-violet-500 bg-clip-text text-transparent">
                                다양한 컨텐츠
                            </span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            평화로운 게임마을에서 즐길 수 있는 다양한 활동과 이벤트들을 소개합니다.
                        </p>
                    </div>
                </FadeIn>

                {/* Contents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {contents.map((content, idx) => {
                        const ContentIcon = getIcon(content.icon);
                        return (
                            <FadeIn key={content.id} delay={200 + idx * 50}>
                                <Link href={`/contents/${content.slug}`}>
                                    <div className={`group relative h-full bg-gradient-to-br ${content.color} p-1 rounded-3xl hover:scale-[1.02] transition-all duration-500 hover:shadow-[0_0_50px_rgba(0,255,255,0.3)] cursor-pointer`}>
                                        <div className="h-full bg-slate-900/95 backdrop-blur-sm rounded-[1.4rem] p-8 flex flex-col">
                                            {/* Icon */}
                                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${content.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-lg`}>
                                                <ContentIcon size={32} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1">
                                                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-fuchsia-400 transition-all">
                                                    {content.title}
                                                </h3>
                                                <p className="text-sm text-cyan-400 font-semibold mb-4">
                                                    {content.subtitle}
                                                </p>
                                                <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                                                    {content.description}
                                                </p>
                                            </div>

                                            {/* Arrow */}
                                            <div className="flex items-center gap-2 text-fuchsia-400 font-bold text-sm mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                                자세히 보기
                                                <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </FadeIn>
                        );
                    })}
                </div>

                {/* Empty State */}
                {contents.length === 0 && (
                    <FadeIn delay={200}>
                        <div className="text-center py-20">
                            <p className="text-slate-500 text-lg">아직 등록된 컨텐츠가 없습니다.</p>
                        </div>
                    </FadeIn>
                )}
            </div>
        </div>
    );
}

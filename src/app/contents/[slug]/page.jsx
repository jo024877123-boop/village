'use client';

import { use } from 'react';
import { useContentBySlug } from '@/hooks/useContents';
import Link from 'next/link';
import { ArrowLeft, Loader2, Gamepad2 } from 'lucide-react';
import { getIcon } from '@/lib/icons';
import FadeIn from '@/components/ui/FadeIn';
import FireEffect from '@/components/ui/FireEffect';
import { notFound } from 'next/navigation';
import { Play } from 'lucide-react';

export default function ContentDetailPage({ params }) {
    const { slug } = use(params);
    const { content, loading, error } = useContentBySlug(slug);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <Loader2 className="animate-spin text-cyan-400" size={48} />
            </div>
        );
    }

    if (error || !content) {
        notFound();
    }

    const ContentIcon = getIcon(content.icon);

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Special Effect: Fire */}
                {content.specialEffect === 'fire' && <FireEffect color={content.color.includes('red') || content.color.includes('orange') || content.color.includes('amber') || content.color.includes('yellow') ? 'orange' : 'orange'} />}

                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `linear-gradient(rgba(0,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.3) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px'
                }} />
                {content.specialEffect !== 'fire' && (
                    <>
                        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-cyan-500/20 rounded-full blur-[150px]" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] bg-fuchsia-500/15 rounded-full blur-[130px]" />
                    </>
                )}
            </div>

            {/* Content */}
            <div className="relative z-10 container max-w-5xl mx-auto px-6 py-24">
                {/* Back Button */}
                <FadeIn delay={0}>
                    <Link
                        href="/contents"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors mb-12 font-medium group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        컨텐츠 목록으로
                    </Link>
                </FadeIn>

                {/* Hero Section */}
                <FadeIn delay={100}>
                    <div className={`relative bg-gradient-to-br ${content.color} p-1 rounded-3xl mb-16`}>
                        <div className="bg-slate-900/95 backdrop-blur-sm rounded-[1.4rem] p-12 flex flex-col md:flex-row items-center gap-8">
                            {/* Icon */}
                            <div className={`w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br ${content.color} flex items-center justify-center shadow-2xl flex-shrink-0`}>
                                <ContentIcon size={64} className="text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]" />
                            </div>

                            {/* Text */}
                            <div className="text-center md:text-left flex-1">
                                <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
                                    {content.title}
                                </h1>
                                <p className="text-xl text-cyan-400 font-semibold">
                                    {content.subtitle}
                                </p>
                            </div>
                        </div>
                    </div>
                </FadeIn>

                {/* Description */}
                <FadeIn delay={200}>
                    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 mb-12">
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <div className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-fuchsia-500 rounded-full"></div>
                            소개
                        </h2>
                        <p className="text-slate-300 text-lg leading-relaxed">
                            {content.description}
                        </p>
                    </div>
                </FadeIn>

                {/* Features */}
                {content.features && content.features.length > 0 && (
                    <FadeIn delay={300}>
                        <div className="mb-12">
                            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                                <div className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-fuchsia-500 rounded-full"></div>
                                주요 특징
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {content.features.map((feature, idx) => {
                                    const FeatureIcon = getIcon(feature.icon);
                                    return (
                                        <div
                                            key={idx}
                                            className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(0,255,255,0.1)] transition-all duration-500"
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 flex items-center justify-center mb-4">
                                                <FeatureIcon size={24} className="text-cyan-400" />
                                            </div>
                                            <h3 className="text-lg font-bold text-white mb-2">
                                                {feature.title}
                                            </h3>
                                            <p className="text-slate-400 text-sm leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </FadeIn>
                )}

                {/* Gallery Section */}
                <FadeIn delay={350}>
                    <div className="mb-12">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                                <div className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-fuchsia-500 rounded-full"></div>
                                갤러리
                            </h2>
                            {/* 관리자 등에서 추가하는 것이 정석이나, 상세페이지에서도 편집 가능하도록 요청함에 따라 버튼 노출 (실제 로직은 생략 또는 안내) */}
                        </div>
                        {content.gallery && content.gallery.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {content.gallery.map((item, idx) => (
                                    <div key={idx} className="group relative aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-cyan-500/50 transition-all duration-300">
                                        <img
                                            src={item.imageUrl}
                                            alt={item.caption || 'gallery image'}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                            <p className="text-white font-medium">{item.caption}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800 text-slate-500">
                                등록된 갤러리 이미지가 없습니다. 관리자 패널에서 추가해주세요.
                            </div>
                        )}
                    </div>
                </FadeIn>

                {/* YouTube Section */}
                <FadeIn delay={380}>
                    <div className="mb-12">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                                <div className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-fuchsia-500 rounded-full"></div>
                                관련 영상
                            </h2>
                        </div>
                        {content.youtube && content.youtube.length > 0 ? (
                            <div className="grid grid-cols-1 gap-8">
                                {content.youtube.map((item, idx) => {
                                    // Extract video ID safely
                                    let videoId = '';
                                    try {
                                        if (item.url.includes('youtube.com/watch?v=')) {
                                            videoId = item.url.split('v=')[1].split('&')[0];
                                        } else if (item.url.includes('youtu.be/')) {
                                            videoId = item.url.split('youtu.be/')[1].split('?')[0];
                                        }
                                    } catch (e) { console.error(e); }

                                    return (
                                        <div key={idx} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden">
                                            {videoId ? (
                                                <div className="aspect-video w-full">
                                                    <iframe
                                                        className="w-full h-full"
                                                        src={`https://www.youtube.com/embed/${videoId}`}
                                                        title={item.title || 'YouTube video'}
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    ></iframe>
                                                </div>
                                            ) : (
                                                <div className="aspect-video w-full flex items-center justify-center bg-slate-950 text-slate-500">
                                                    <div className="text-center">
                                                        <Play size={48} className="mx-auto mb-2 opacity-50" />
                                                        <p>동영상을 불러올 수 없습니다.</p>
                                                    </div>
                                                </div>
                                            )}
                                            {item.title && (
                                                <div className="p-4 border-t border-slate-800/50">
                                                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800 text-slate-500">
                                등록된 영상이 없습니다. 관리자 패널에서 추가해주세요.
                            </div>
                        )}
                    </div>
                </FadeIn>

                {/* Info Grid */}
                <FadeIn delay={400}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        {/* How to Join */}
                        {content.howToJoin && (
                            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-cyan-400 mb-3">참여 방법</h3>
                                <p className="text-slate-300 leading-relaxed">
                                    {content.howToJoin}
                                </p>
                            </div>
                        )}

                        {/* Schedule */}
                        {content.schedule && (
                            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-fuchsia-400 mb-3">일정</h3>
                                <p className="text-slate-300 leading-relaxed">
                                    {content.schedule}
                                </p>
                            </div>
                        )}
                    </div>
                </FadeIn>

                {/* CTA */}
                <FadeIn delay={500}>
                    <div className="bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 border border-cyan-500/30 rounded-2xl p-8 text-center">
                        <h3 className="text-2xl font-bold text-white mb-4">
                            함께하고 싶으신가요?
                        </h3>
                        <p className="text-slate-400 mb-6">
                            평화로운 게임마을의 멤버가 되어 다양한 컨텐츠를 즐겨보세요!
                        </p>
                        <Link
                            href="/apply"
                            className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white font-bold text-lg rounded-xl shadow-[0_0_30px_rgba(0,255,255,0.4)] hover:shadow-[0_0_50px_rgba(255,0,255,0.5)] hover:-translate-y-1 transition-all duration-300"
                        >
                            <Gamepad2 size={22} />
                            입주 신청하기
                        </Link>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}

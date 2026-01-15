'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Menu, X, Sparkles, ArrowRight, Heart, MessageCircle, Coffee, Gamepad2, Shield, Users, Play, Maximize2, Youtube
} from 'lucide-react';
import { useSiteData } from '@/hooks/useSiteData';
import FadeIn from './ui/FadeIn';
import { getIcon } from '@/lib/icons';
import React from 'react';
import GallerySection from './GallerySection'; // New Import
import ContentsSection from './ContentsSection'; // New Import

export default function UserWebsite() {
    const { siteData, loading } = useSiteData();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [isDimmed, setIsDimmed] = useState(false); // New Dim Mode State
    const [selectedImage, setSelectedImage] = useState(null); // Gallery Lightbox State

    const handleImageSelect = (image) => {
        setSelectedImage(image);
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="animate-pulse text-cyan-400"><Sparkles size={40} /></div></div>;

    // Use globalText for dynamic labels, fallback to defaults if empty
    const t = (key, defaultText) => siteData.globalText?.[key] || defaultText;

    const navLinks = [
        { name: '소개', href: '#hero' },
        { name: '가치관', href: '#values' },
        { name: '컨텐츠', href: '#contents' },
        { name: '게임', href: '#games' },
        { name: '로드맵', href: '#roadmap' },
        { name: '갤러리', href: '#gallery' },
    ];

    // Helper to determine if we should show video content
    const hasVideo = siteData.hero.videoUrl && siteData.hero.videoUrl.trim() !== "";

    // Section Renderers
    const renderSection = (section) => {
        if (!section.show) return null;

        // Add minimal spacing between sections if needed, but margin-y is handled in sections
        // We will return the component based on ID
        switch (section.id) {
            case 'hero':
                return (
                    <header key={section.id} id="hero" className="relative z-10 pt-48 pb-36 px-6 flex flex-col items-center text-center overflow-hidden">
                        {/* Video Background - Dark Overlay */}
                        {hasVideo && siteData.hero.videoType === 'background' && (
                            <div className="absolute inset-0 -z-10 bg-black/60">
                                {siteData.hero.videoUrl.includes('youtube') ? (
                                    <iframe
                                        className="w-full h-full object-cover opacity-40 pointer-events-none scale-110"
                                        src={`https://www.youtube.com/embed/${siteData.hero.videoUrl.split('v=')[1]?.split('&')[0]}?autoplay=1&mute=1&loop=1&playlist=${siteData.hero.videoUrl.split('v=')[1]?.split('&')[0]}&controls=0&showinfo=0&rel=0`}
                                        allow="autoplay; encrypted-media"
                                        allowFullScreen
                                        title="Background Video"
                                    />
                                ) : (
                                    <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-40 pointer-events-none">
                                        <source src={siteData.hero.videoUrl} type="video/mp4" />
                                    </video>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-transparent to-[#0a0a0f]"></div>
                            </div>
                        )}

                        {/* Gaming Badge */}
                        <FadeIn delay={100}>
                            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 border border-cyan-500/30 shadow-[0_0_30px_rgba(0,255,255,0.15)] mb-12 hover:shadow-[0_0_40px_rgba(255,0,255,0.2)] hover:scale-105 hover:border-fuchsia-500/40 transition-all duration-500 cursor-default backdrop-blur-sm">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 shadow-[0_0_8px_rgba(0,255,255,0.8)]"></span>
                                </span>
                                <span className="text-sm font-bold text-cyan-300 uppercase tracking-[0.25em]">Since {siteData.hero.since} • Premium Lounge</span>
                            </div>
                        </FadeIn>

                        {/* Hero Title - Neon Glow Effect */}
                        <FadeIn delay={200}>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-[-0.04em] leading-[1.05] mb-10 cursor-default group">
                                <span className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:drop-shadow-[0_0_40px_rgba(0,255,255,0.5)] transition-all duration-500">
                                    {siteData.hero.titlePrimary}
                                </span><br />
                                <span className="relative inline-block mt-2">
                                    <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-violet-500 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(255,0,255,0.4)] group-hover:from-fuchsia-400 group-hover:via-violet-500 group-hover:to-cyan-400 transition-all duration-1000">
                                        {siteData.hero.titleSecondary}
                                    </span>
                                    <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-violet-500 rounded-full opacity-60 blur-sm group-hover:opacity-100 transition-opacity duration-500"></span>
                                </span>
                            </h1>
                        </FadeIn>

                        {/* Subtitle */}
                        <FadeIn delay={300}>
                            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-16 leading-relaxed font-medium whitespace-pre-line">
                                {siteData.hero.subtitle}
                            </p>
                        </FadeIn>

                        {/* CTA Buttons - Gaming Neon Style */}
                        <FadeIn delay={400}>
                            <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
                                <Link href="/apply" className="group relative px-10 py-5 rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white font-bold text-lg shadow-[0_0_30px_rgba(0,255,255,0.4)] hover:shadow-[0_0_50px_rgba(255,0,255,0.5)] hover:-translate-y-2 transition-all duration-300 overflow-hidden min-w-[220px] border border-cyan-400/30">
                                    <span className="relative z-10 flex items-center justify-center gap-3 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                                        <Gamepad2 size={22} />
                                        {t('heroButton1', '입주 신청하기')}
                                        <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </Link>

                                {hasVideo && siteData.hero.videoType === 'modal' ? (
                                    <button onClick={() => setShowVideoModal(true)} className="px-8 py-4 rounded-xl bg-white/5 text-white font-bold text-lg border border-white/20 backdrop-blur-sm hover:bg-white/10 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] transition-all min-w-[180px] flex items-center justify-center gap-3">
                                        <Play size={20} className="text-cyan-400" /> 예고편 보기
                                    </button>
                                ) : (
                                    <button onClick={() => document.getElementById('values')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 rounded-xl bg-white/5 text-slate-300 font-bold text-lg border border-white/20 backdrop-blur-sm hover:bg-white/10 hover:text-white hover:border-fuchsia-500/50 hover:shadow-[0_0_20px_rgba(255,0,255,0.2)] transition-all min-w-[180px]">
                                        {t('heroButton2', '둘러보기')}
                                    </button>
                                )}
                            </div>

                            {/* Inline Video */}
                            {hasVideo && (
                                <div className="mt-16 flex flex-col items-center gap-4">
                                    {siteData.hero.videoType === 'inline' && (
                                        <div className={`relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,255,255,0.2)] border border-cyan-500/30 transform transition-all duration-700 ${isDimmed ? 'z-[60] scale-110 shadow-[0_0_80px_rgba(255,0,255,0.4)]' : 'hover:scale-[1.02] hover:shadow-[0_0_60px_rgba(0,255,255,0.3)]'}`}>
                                            {siteData.hero.videoUrl.includes('youtube') ? (
                                                <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${siteData.hero.videoUrl.split('v=')[1]?.split('&')[0]}?autoplay=${siteData.hero.autoPlay ? 1 : 0}&mute=0&controls=1&rel=0`} allow="autoplay; encrypted-media" allowFullScreen title="Inline Video" />
                                            ) : (
                                                <video autoPlay={siteData.hero.autoPlay} controls className="w-full h-full object-cover"><source src={siteData.hero.videoUrl} type="video/mp4" /></video>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </FadeIn>
                    </header>
                );
            case 'video':
                // Standalone Video Section
                if (!hasVideo) return null;
                return (
                    <section key={section.id} id="video" className="py-20 relative z-10">
                        <div className="max-w-5xl mx-auto px-6">
                            <FadeIn>
                                <div className="text-center mb-10">
                                    <span className="text-cyan-500 dark:text-cyan-400 font-bold text-sm tracking-widest uppercase mb-3 block">Featured Video</span>
                                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">마을 소개 영상</h2>
                                </div>
                            </FadeIn>
                            <FadeIn delay={200}>
                                <div className={`relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/30 dark:border-slate-700/50 bg-slate-900 transform transition-all duration-700 ${isDimmed ? 'z-[60] scale-105 shadow-cyan-500/30' : 'hover:scale-[1.01] hover:shadow-violet-500/20'}`}>
                                    {siteData.hero.videoUrl.includes('youtube') ? (
                                        <iframe
                                            className="w-full h-full"
                                            src={`https://www.youtube.com/embed/${siteData.hero.videoUrl.split('v=')[1]?.split('&')[0]}?autoplay=0&mute=0&controls=1&rel=0`}
                                            allow="autoplay; encrypted-media; fullscreen"
                                            allowFullScreen
                                            title="Village Introduction Video"
                                        />
                                    ) : (
                                        <video controls className="w-full h-full object-cover">
                                            <source src={siteData.hero.videoUrl} type="video/mp4" />
                                        </video>
                                    )}
                                </div>
                            </FadeIn>
                        </div>
                    </section>
                );
            case 'values':
                return (
                    <section key={section.id} id="values" className="py-32 relative z-10">
                        <div className="max-w-7xl mx-auto px-6">
                            <FadeIn>
                                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                                    <div>
                                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight hover:tracking-normal transition-all duration-500">{t('valuesTitle', 'Core Values')}</h2>
                                        <div className="h-1.5 w-24 bg-gradient-to-r from-sky-400 to-blue-600 mt-5 rounded-full"></div>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm text-right leading-relaxed whitespace-pre-line">
                                        {t('valuesSubtitle', '평화로운 게임마을은\n단단한 원칙 위에 세워진 공간입니다.')}
                                    </p>
                                </div>
                            </FadeIn>
                            <div className="grid md:grid-cols-3 gap-8">
                                {[
                                    { icon: <Heart strokeWidth={1.5} />, title: "존중과 매너", subtitle: "Respect", desc: "실력보다 중요한 것은 인성입니다. 욕설과 비난 없는 클린한 게임 문화를 지향합니다.", gradient: "from-rose-50 to-pink-50 dark:from-rose-900/10 dark:to-pink-900/10 hover:border-rose-200 dark:hover:border-rose-700", iconColor: "text-rose-500" },
                                    { icon: <MessageCircle strokeWidth={1.5} />, title: "따뜻한 소통", subtitle: "Communication", desc: "게임 외적인 일상의 대화도 환영합니다. 서로의 하루를 응원하는 따뜻한 공간입니다.", gradient: "from-sky-50 to-blue-50 dark:from-sky-900/10 dark:to-blue-900/10 hover:border-sky-200 dark:hover:border-sky-700", iconColor: "text-sky-500" },
                                    { icon: <Coffee strokeWidth={1.5} />, title: "진정한 휴식", subtitle: "Relaxation", desc: "치열한 경쟁에 지쳤다면 이곳이 정답입니다. 이기는 게임보다 즐거운 게임을 추구합니다.", gradient: "from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 hover:border-amber-200 dark:hover:border-amber-700", iconColor: "text-amber-500" }
                                ].map((item, idx) => (
                                    <FadeIn key={idx} delay={idx * 150}>
                                        <div className={`group relative p-10 rounded-[2.5rem] bg-gradient-to-br ${item.gradient} border border-transparent transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:shadow-sky-900/20 h-full`}>
                                            <div className="absolute inset-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-[2.5rem] -z-10"></div>
                                            <div className={`mb-8 w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center ${item.iconColor} shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                                                {React.cloneElement(item.icon, { size: 32 })}
                                            </div>
                                            <div className="space-y-2 mb-6">
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.subtitle}</span>
                                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{item.title}</h3>
                                            </div>
                                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium word-break-keep text-[15px]">{item.desc}</p>
                                        </div>
                                    </FadeIn>
                                ))}
                            </div>
                        </div>
                    </section>
                );
            case 'contents':
                return <ContentsSection key={section.id} />;
            case 'games':
                return (
                    <section key={section.id} id="games" className="py-32 relative z-10">
                        {/* Existing Games Content reused... */}
                        <div className="max-w-7xl mx-auto px-6">
                            <FadeIn>
                                <div className="text-center mb-24">
                                    <span className="text-sky-600 dark:text-sky-400 font-bold text-sm tracking-widest uppercase mb-3 block">{t('gamesSubtitle', 'Curated Collection')}</span>
                                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">{t('gamesTitle', 'Game Lineup')}</h2>
                                </div>
                            </FadeIn>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {siteData.games.map((game, idx) => {
                                    const GameIcon = getIcon(game.icon);
                                    return (
                                        <FadeIn key={game.id} delay={idx * 50}>
                                            <a
                                                href={game.link || "#"}
                                                target={game.link ? "_blank" : "_self"}
                                                rel="noopener noreferrer"
                                                className={`group relative aspect-square bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] hover:border-sky-100 dark:hover:border-sky-900 hover:-translate-y-2 ${game.link ? 'cursor-pointer' : 'cursor-default'}`}
                                            >
                                                <div className={`w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center ${game.color} group-hover:scale-110 group-hover:bg-white dark:group-hover:bg-slate-800 group-hover:shadow-lg transition-all duration-300`}>
                                                    <GameIcon size={28} strokeWidth={1.5} />
                                                </div>
                                                <div>
                                                    <span className="font-bold text-slate-800 dark:text-slate-200 text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{game.name}</span>
                                                    {game.link && (
                                                        <div className="mt-2 flex items-center text-xs font-bold text-sky-500 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                                                            Visit <ArrowRight size={12} className="ml-1" />
                                                        </div>
                                                    )}
                                                </div>
                                            </a>
                                        </FadeIn>
                                    )
                                })}
                            </div>
                        </div>
                    </section>
                );
            case 'roadmap':
                return (
                    <section key={section.id} id="roadmap" className="py-32 bg-white dark:bg-slate-900 relative z-10 transition-colors duration-500">
                        {/* Existing Roadmap Content reused... */}
                        <div className="max-w-4xl mx-auto px-6">
                            <FadeIn>
                                <div className="mb-24 text-center">
                                    <h2 className="text-4xl font-black text-slate-900 dark:text-white">{t('roadmapTitle', 'Vision Roadmap')}</h2>
                                    <p className="text-slate-400 mt-3 font-medium text-lg">{t('roadmapSubtitle', '함께 그려나갈 미래입니다.')}</p>
                                </div>
                            </FadeIn>
                            <div className="relative">
                                <div className="absolute left-[28px] md:left-1/2 md:-ml-px top-0 bottom-0 w-[2px] bg-gradient-to-b from-sky-100 via-sky-200 to-slate-50 dark:to-slate-900"></div>
                                <div className="space-y-24">
                                    {siteData.roadmap.map((item, idx) => (
                                        <FadeIn key={idx} delay={idx * 150}>
                                            <div className="relative flex md:justify-center items-center group">
                                                <div className={`absolute left-[20px] md:left-1/2 md:-ml-[8px] w-4 h-4 rounded-full border-[3px] z-10 bg-white dark:bg-slate-800 shadow-md transition-all duration-500 ${item.active ? 'border-sky-500 scale-125 shadow-sky-200' : 'border-slate-300 dark:border-slate-600 group-hover:border-sky-300'}`}></div>
                                                <div className={`flex flex-col md:flex-row w-full ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''} pl-20 md:pl-0`}>
                                                    <div className="md:w-1/2 md:px-16 text-left md:text-right group-hover:-translate-y-2 transition-transform duration-300">
                                                        <div className={idx % 2 === 0 ? 'md:text-left' : 'md:text-right'}>
                                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest mb-3 ${item.active ? 'bg-sky-100 text-sky-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                                                                {item.year} {item.q}
                                                            </span>
                                                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                                                            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                                                        </div>
                                                    </div>
                                                    <div className="md:w-1/2"></div>
                                                </div>
                                            </div>
                                        </FadeIn>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                );
            case 'organization':
                return (
                    <section key={section.id} id="organization" className="py-32 relative z-10 overflow-hidden">
                        {/* Existing Org Content reused... */}
                        <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 -z-10 transition-colors duration-500"></div>
                        <div className="max-w-5xl mx-auto px-6 text-center">
                            <FadeIn><h2 className="text-4xl font-black text-slate-900 dark:text-white mb-20">{t('orgTitle', 'Organization')}</h2></FadeIn>
                            <FadeIn delay={200}>
                                <div className="flex flex-col items-center">
                                    <div className="relative mb-12">
                                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-12 py-6 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-sky-900/10 flex items-center gap-5 relative z-10 animate-hover">
                                            <div className="p-3 bg-slate-900 dark:bg-slate-950 rounded-2xl text-white shadow-lg shadow-slate-900/20"><Shield size={24} /></div>
                                            <div className="text-left">
                                                <div className="text-[11px] text-sky-500 font-bold uppercase tracking-wider mb-1">Leadership</div>
                                                <div className="font-bold text-slate-900 dark:text-white text-xl">촌장 (운영진)</div>
                                            </div>
                                        </div>
                                        <div className="absolute top-full left-1/2 w-px h-16 bg-slate-300 dark:bg-slate-700 -translate-x-1/2"></div>
                                    </div>
                                    <div className="w-[85%] md:w-[65%] h-px bg-slate-300 dark:bg-slate-700 mb-12 relative">
                                        <div className="absolute left-0 top-0 w-px h-10 bg-slate-300 dark:bg-slate-700"></div>
                                        <div className="absolute right-0 top-0 w-px h-10 bg-slate-300 dark:bg-slate-700"></div>
                                        <div className="absolute left-1/2 top-[-40px] w-px h-10 bg-slate-300 dark:bg-slate-700 -translate-x-1/2"></div>
                                        <div className="absolute left-1/2 top-0 w-px h-8 bg-slate-300 dark:bg-slate-700 -translate-x-1/2"></div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full justify-center">
                                        {siteData.organization.map((team, idx) => {
                                            const OrgIcon = getIcon(team.icon, Users);
                                            return (
                                                <div key={team.id} className="flex flex-col items-center">
                                                    <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:shadow-sky-900/5 hover:-translate-y-2 hover:border-sky-100 dark:hover:border-sky-700/50 transition-all w-full md:w-auto min-w-[240px] cursor-default group">
                                                        <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-slate-700 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                                                            <OrgIcon size={24} />
                                                        </div>
                                                        <h4 className="font-bold text-slate-800 dark:text-white text-lg mb-2">{team.title}</h4>
                                                        <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">{team.role}</p>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </FadeIn>
                        </div>
                    </section>
                );
            case 'contact':
                return (
                    <section key={section.id} className="py-32 relative z-10 bg-slate-900 text-white overflow-hidden">
                        {/* Existing Contact Content reused... */}
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                            <div className="absolute top-[-50%] left-[-20%] w-[100vw] h-[100vw] bg-sky-500/30 rounded-full blur-[150px]"></div>
                            <div className="absolute bottom-[-50%] right-[-20%] w-[100vw] h-[100vw] bg-blue-600/30 rounded-full blur-[150px]"></div>
                        </div>

                        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                            <FadeIn>
                                <h2 className="text-4xl font-black mb-6">{t('contactTitle', 'Contact & Community')}</h2>
                                <p className="text-slate-300 text-lg mb-16">{t('contactSubtitle', '게임마을의 문은 언제나 열려있습니다.')}</p>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {siteData.footer?.showKakao && (
                                        <a href={siteData.footer?.kakaoLink || "#"} target="_blank" rel="noreferrer" className="flex items-center p-6 bg-slate-800 rounded-2xl hover:bg-[#FEE500] hover:text-black transition-all group">
                                            <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                                <MessageCircle size={24} fill="currentColor" />
                                            </div>
                                            <div className="ml-5 text-left">
                                                <div className="text-xs font-bold opacity-50 uppercase tracking-wider mb-1">Open Chat</div>
                                                <div className="text-xl font-bold">카카오톡 문의</div>
                                            </div>
                                            <ArrowRight className="ml-auto opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                        </a>
                                    )}
                                    {siteData.footer?.showYoutube && (
                                        <a href={siteData.footer?.youtubeLink || "#"} target="_blank" rel="noreferrer" className="flex items-center p-6 bg-slate-800 rounded-2xl hover:bg-[#FF0000] hover:text-white transition-all group cursor-pointer">
                                            <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                                <Youtube size={24} />
                                            </div>
                                            <div className="ml-5 text-left">
                                                <div className="text-xs font-bold opacity-50 uppercase tracking-wider mb-1">Video</div>
                                                <div className="text-xl font-bold">유튜브 채널</div>
                                            </div>
                                            <ArrowRight className="ml-auto opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                        </a>
                                    )}
                                </div>
                            </FadeIn>
                        </div>
                    </section>
                );
            default: return null;
        }
    }

    return (
        <div className={`transition-colors duration-500 dark`}>
            <div className="min-h-screen bg-[#0a0a0f] text-white font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden relative">

                {/* Cyber Grid Background */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: `linear-gradient(rgba(0,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.3) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px'
                    }} />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-transparent to-[#0a0a0f]" />
                </div>

                {/* Neon Glow Orbs - Gaming RGB Effect */}
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                    {/* Cyan Glow - Top Left */}
                    <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-cyan-500/20 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '4s' }} />
                    {/* Magenta Glow - Right */}
                    <div className="absolute top-[30%] right-[-15%] w-[45vw] h-[45vw] bg-fuchsia-500/15 rounded-full blur-[130px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
                    {/* Purple Glow - Bottom */}
                    <div className="absolute bottom-[-10%] left-[30%] w-[40vw] h-[40vw] bg-violet-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }} />
                    {/* Green Accent */}
                    <div className="absolute top-[60%] left-[-5%] w-[25vw] h-[25vw] bg-emerald-500/10 rounded-full blur-[100px]" />
                </div>

                {/* Floating Game Icons - Neon Style */}
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                    {/* Gamepad 1 */}
                    <div className="absolute animate-float-slow" style={{ top: '12%', left: '8%' }}>
                        <Gamepad2 size={56} className="text-cyan-400/30 drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]" />
                    </div>
                    {/* Controller */}
                    <div className="absolute animate-float-medium" style={{ top: '20%', right: '12%' }}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-fuchsia-400/25 drop-shadow-[0_0_12px_rgba(255,0,255,0.4)]">
                            <rect x="4" y="6" width="16" height="12" rx="3" />
                            <circle cx="8" cy="12" r="1.5" />
                            <circle cx="16" cy="12" r="1.5" />
                            <path d="M10 9h4" />
                        </svg>
                    </div>
                    {/* Joystick */}
                    <div className="absolute animate-float-fast" style={{ top: '55%', left: '5%' }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-emerald-400/25 drop-shadow-[0_0_10px_rgba(0,255,128,0.4)]">
                            <circle cx="12" cy="19" r="3" />
                            <path d="M12 16V8" />
                            <circle cx="12" cy="6" r="2" />
                        </svg>
                    </div>
                    {/* D-Pad */}
                    <div className="absolute animate-float-slow" style={{ top: '65%', right: '8%' }}>
                        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-violet-400/20 drop-shadow-[0_0_12px_rgba(139,92,246,0.4)]">
                            <path d="M12 2v20M2 12h20" />
                            <rect x="9" y="9" width="6" height="6" rx="1" />
                        </svg>
                    </div>
                    {/* Arcade Button - Large */}
                    <div className="absolute animate-float-medium" style={{ top: '35%', left: '88%' }}>
                        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" className="text-rose-400/20 drop-shadow-[0_0_15px_rgba(255,100,100,0.4)]">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                            <circle cx="12" cy="12" r="6" fill="currentColor" opacity="0.3" />
                        </svg>
                    </div>
                    {/* Small Gamepad */}
                    <div className="absolute animate-float-fast" style={{ top: '80%', left: '50%' }}>
                        <Gamepad2 size={40} className="text-cyan-400/20 drop-shadow-[0_0_8px_rgba(0,255,255,0.3)]" />
                    </div>
                    {/* Sparkle Effect */}
                    <div className="absolute animate-float-slow" style={{ top: '8%', left: '65%' }}>
                        <Sparkles size={36} className="text-amber-400/25 drop-shadow-[0_0_12px_rgba(255,200,0,0.5)]" />
                    </div>
                </div>

                {/* Scanline Effect - Subtle CRT feel */}
                <div className="fixed inset-0 z-[1] pointer-events-none opacity-[0.02]" style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)'
                }} />

                {/* Navigation - Gaming Neon Style */}
                <div className="fixed top-0 left-0 w-full z-50 flex justify-center py-4 px-4 pointer-events-none">
                    <nav className={`pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${scrolled || isMenuOpen ? 'w-full max-w-6xl bg-slate-900/90 backdrop-blur-xl shadow-lg shadow-cyan-500/10 border border-cyan-500/20 rounded-2xl py-3 px-6' : 'w-full max-w-7xl bg-transparent py-4 px-0'}`}>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                                {siteData.logos?.mainLogo ? (
                                    <img src={siteData.logos.mainLogo} alt="Logo" className="h-10 w-auto object-contain group-hover:scale-105 transition-transform drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]" />
                                ) : (
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/50 group-hover:scale-110 group-hover:shadow-fuchsia-500/50 transition-all duration-300">
                                        <Gamepad2 size={18} strokeWidth={2} className="text-white" />
                                    </div>
                                )}
                                <span className="text-xl font-bold tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-fuchsia-400 transition-all drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                                    {t('navTitle', '평화로운 게임마을')}
                                </span>
                            </div>

                            {/* Desktop Nav */}
                            <div className="hidden md:flex items-center gap-1">
                                {navLinks.map((link) => (
                                    <a key={link.name} href={link.href} className="px-5 py-2 text-sm font-semibold text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-full transition-all hover:shadow-[0_0_15px_rgba(0,255,255,0.2)]">{link.name}</a>
                                ))}

                            </div>

                            {/* Mobile Toggle */}
                            <button className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </nav>
                </div>

                {/* Mobile Menu Overlay - Gaming Theme */}
                {isMenuOpen && (
                    <div className="fixed inset-0 z-40 bg-[#0a0a0f]/98 backdrop-blur-xl pt-28 px-6 animate-in fade-in slide-in-from-bottom-4 duration-300 md:hidden flex flex-col">
                        <div className="flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <a key={link.name} href={link.href} className="text-2xl font-bold text-white tracking-tight hover:text-cyan-400 hover:drop-shadow-[0_0_10px_rgba(0,255,255,0.5)] transition-all" onClick={() => setIsMenuOpen(false)}>{link.name}</a>
                            ))}
                            <div className="h-px w-full bg-gradient-to-r from-cyan-500/30 via-fuchsia-500/30 to-transparent my-4"></div>
                            <Link href="/apply" onClick={() => setIsMenuOpen(false)} className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white font-bold text-lg text-center hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all shadow-xl">
                                {t('navButton', '입주 신청하기')}
                            </Link>
                        </div>
                    </div>
                )}

                {/* Dynamic Content Sections */}
                <main className="flex flex-col">
                    {siteData.sectionOrder?.map((section) => {
                        if (section.id === 'gallery') {
                            return <GallerySection key={section.id} galleryData={siteData.gallery} onImageSelect={handleImageSelect} />;
                        }
                        return renderSection(section);
                    })}

                    {/* Fallback: Render Video Section if not in sectionOrder but video exists */}
                    {hasVideo && !siteData.sectionOrder?.find(s => s.id === 'video') && (
                        <section id="video-fallback" className="py-20 relative z-10">
                            <div className="max-w-5xl mx-auto px-6">
                                <FadeIn>
                                    <div className="text-center mb-10">
                                        <span className="text-cyan-500 dark:text-cyan-400 font-bold text-sm tracking-widest uppercase mb-3 block">Featured Video</span>
                                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">마을 소개 영상</h2>
                                    </div>
                                </FadeIn>
                                <FadeIn delay={200}>
                                    <div className={`relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/30 dark:border-slate-700/50 bg-slate-900 transform transition-all duration-700 ${isDimmed ? 'z-[60] scale-105 shadow-cyan-500/30' : 'hover:scale-[1.01] hover:shadow-violet-500/20'}`}>
                                        {siteData.hero.videoUrl.includes('youtube') ? (
                                            <iframe
                                                className="w-full h-full"
                                                src={`https://www.youtube.com/embed/${siteData.hero.videoUrl.split('v=')[1]?.split('&')[0]}?autoplay=0&mute=0&controls=1&rel=0`}
                                                allow="autoplay; encrypted-media; fullscreen"
                                                allowFullScreen
                                                title="Village Introduction Video"
                                            />
                                        ) : (
                                            <video controls className="w-full h-full object-cover">
                                                <source src={siteData.hero.videoUrl} type="video/mp4" />
                                            </video>
                                        )}
                                    </div>
                                </FadeIn>
                            </div>
                        </section>
                    )}
                </main>

                {/* Video Modal Overlay */}
                {showVideoModal && siteData.hero.videoType === 'modal' && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowVideoModal(false)}>
                        <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors" onClick={() => setShowVideoModal(false)}>
                            <X size={40} />
                        </button>
                        <div className="w-[90vw] max-w-6xl aspect-video rounded-2xl overflow-hidden shadow-2xl relative bg-black" onClick={e => e.stopPropagation()}>
                            {siteData.hero.videoUrl?.includes('youtube') ? (
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${siteData.hero.videoUrl.split('v=')[1]?.split('&')[0]}?autoplay=1&rel=0`}
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                    title="Modal Video"
                                />
                            ) : (
                                <video autoPlay controls className="w-full h-full">
                                    <source src={siteData.hero.videoUrl} type="video/mp4" />
                                </video>
                            )}
                        </div>
                    </div>
                )}

                {/* Gallery Lightbox Modal - Hoisted for correct Z-Index */}
                {selectedImage && (
                    <div
                        className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-0 md:p-4 animate-in fade-in duration-300"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 md:top-8 md:right-8 text-white/50 hover:text-white transition-colors z-[10000]"
                        >
                            <X className="w-8 h-8 md:w-10 md:h-10" />
                        </button>
                        <div
                            className="relative max-w-6xl w-full h-full md:h-auto md:max-h-[85vh] md:rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex items-center justify-center bg-black"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={selectedImage.imageUrl}
                                alt={selectedImage.caption}
                                className="w-full h-full object-contain"
                            />
                            <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 bg-gradient-to-t from-black/90 to-transparent">
                                <h3 className="text-white font-bold text-xl md:text-2xl">{selectedImage.caption}</h3>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer & Admin Toggle */}
                <footer className="bg-slate-950 border-t border-slate-900 py-12 relative z-10">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                            <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
                                {siteData.logos?.mainLogo ? (
                                    <img src={siteData.logos.mainLogo} alt="Logo" className="h-6 w-auto grayscale brightness-200" />
                                ) : (
                                    <Sparkles size={16} className="text-slate-400" />
                                )}
                                <span className="font-bold text-slate-300 tracking-tight text-sm">Peaceful Game Village</span>
                            </div>

                            {/* Quick Links Group */}
                            <div className="flex flex-col items-center md:items-end gap-3">
                                <Link href="/admin" className="text-[10px] text-slate-700 hover:text-slate-500 transition-colors font-bold tracking-widest uppercase">Admin Access</Link>
                            </div>
                            <div className="flex items-center gap-4">
                                <p className="text-xs text-slate-600 font-medium">{siteData.footer?.copyright || "© 2026 Peaceful Game Village."}</p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}


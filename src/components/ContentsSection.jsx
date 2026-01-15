'use client';

import { useContents } from '@/hooks/useContents';
import Link from 'next/link';
import { getIcon } from '@/lib/icons';
import FadeIn from '@/components/ui/FadeIn';
import { ArrowRight, Loader2 } from 'lucide-react';

export default function ContentsSection() {
    const { contents, loading, error } = useContents();

    if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-cyan-400" /></div>;
    if (error) return null;

    return (
        <section id="contents" className="relative py-32 px-6 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[100px] -z-10" />

            <div className="container max-w-7xl mx-auto">
                <FadeIn>
                    <div className="text-center mb-16">
                        <span className="text-cyan-400 font-bold tracking-wider text-sm uppercase mb-2 block">
                            Village Contents
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                            마을 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">컨텐츠</span>
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                            평화로운 게임마을에서 즐길 수 있는 다양한 활동들을 만나보세요.
                        </p>
                    </div>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {contents.map((content, idx) => {
                        const ContentIcon = getIcon(content.icon);
                        return (
                            <FadeIn key={content.id} delay={idx * 100}>
                                <Link href={`/contents/${content.slug}`} className="block h-full group">
                                    <div className={`h-full relative overflow-hidden rounded-2xl bg-gradient-to-br ${content.color} p-[1px] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(0,255,255,0.2)]`}>
                                        <div className="h-full bg-slate-900/95 backdrop-blur-sm rounded-[15px] p-6 flex flex-col relative z-10 transition-colors group-hover:bg-slate-900/90">
                                            {/* Icon */}
                                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${content.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                                                <ContentIcon size={28} className="text-white" />
                                            </div>

                                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                                                {content.title}
                                            </h3>
                                            <p className="text-sm text-cyan-500/80 font-semibold mb-3">
                                                {content.subtitle}
                                            </p>
                                            <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-2">
                                                {content.description}
                                            </p>

                                            <div className="flex items-center text-sm font-bold text-fuchsia-400 group-hover:translate-x-1 transition-transform">
                                                자세히 보기 <ArrowRight size={14} className="ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </FadeIn>
                        );
                    })}
                </div>

                <FadeIn delay={200}>
                    <div className="mt-12 text-center">
                        <Link
                            href="/contents"
                            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-cyan-500/50 transition-all font-bold"
                        >
                            전체 컨텐츠 페이지로 이동 <ArrowRight size={16} />
                        </Link>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}

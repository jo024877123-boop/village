'use client';

import { ZoomIn } from 'lucide-react';
import FadeIn from './ui/FadeIn';

export default function GallerySection({ galleryData, onImageSelect = () => { } }) {
    if (!galleryData || galleryData.length === 0) return null;

    return (
        <section id="gallery" className="py-32 relative z-10 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-6">
                <FadeIn>
                    <div className="text-center mb-20">
                        <span className="text-sky-600 dark:text-sky-400 font-bold text-sm tracking-widest uppercase mb-3 block">Activities</span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Gallery</h2>
                    </div>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {galleryData.map((item, idx) => (
                        <FadeIn key={item.id} delay={idx * 100}>
                            <div
                                className="group relative aspect-video rounded-2xl overflow-hidden cursor-pointer shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-sky-900/10 transition-all hover:-translate-y-1"
                                onClick={() => onImageSelect(item)}
                            >
                                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/0 transition-colors z-10"></div>
                                <img
                                    src={item.imageUrl}
                                    alt={item.caption}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                    <p className="text-white font-bold text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.caption}</p>
                                </div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100 z-20">
                                    <ZoomIn className="text-white" size={24} />
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Image as ImageIcon, Youtube, Layout, Type, Palette, Save, Sparkles } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export default function ContentEditModal({ isOpen, onClose, content, onSave }) {
    const [activeTab, setActiveTab] = useState('basic'); // basic, features, gallery, youtube, design
    const [formData, setFormData] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (content) {
            setFormData(JSON.parse(JSON.stringify(content))); // Deep copy
        }
    }, [content]);

    if (!isOpen || !formData) return null;

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error(error);
            alert('저장 중 오류가 발생했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleArrayChange = (arrayField, index, field, value) => {
        setFormData(prev => {
            const newArray = [...(prev[arrayField] || [])];
            newArray[index] = { ...newArray[index], [field]: value };
            return { ...prev, [arrayField]: newArray };
        });
    };

    const addItem = (arrayField, initialItem) => {
        setFormData(prev => ({
            ...prev,
            [arrayField]: [...(prev[arrayField] || []), initialItem]
        }));
    };

    const removeItem = (arrayField, index) => {
        setFormData(prev => ({
            ...prev,
            [arrayField]: prev[arrayField].filter((_, i) => i !== index)
        }));
    };

    const tabs = [
        { id: 'basic', label: '기본 정보', icon: Type },
        { id: 'features', label: '특징', icon: Layout },
        { id: 'gallery', label: '갤러리', icon: ImageIcon },
        { id: 'youtube', label: 'YouTube', icon: Youtube },
        { id: 'design', label: '디자인', icon: Palette },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${formData.color || 'from-slate-700 to-slate-800'}`}>
                            {LucideIcons[formData.icon] ?
                                (() => {
                                    const IconComponent = LucideIcons[formData.icon];
                                    return <IconComponent size={24} className="text-white" />;
                                })() :
                                <Layout size={24} className="text-white" />
                            }
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">컨텐츠 편집</h2>
                            <p className="text-sm text-slate-400">{formData.title}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-800 bg-slate-900 overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                ? 'border-cyan-500 text-cyan-400 bg-slate-800/50'
                                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-900 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    {activeTab === 'basic' && (
                        <div className="space-y-6 max-w-2xl mx-auto">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">제목</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => handleChange('title', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-cyan-500 transition-colors outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Slug (URL)</label>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => handleChange('slug', e.target.value)}
                                        readOnly
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-3 text-slate-500 cursor-not-allowed outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">부제목</label>
                                <input
                                    type="text"
                                    value={formData.subtitle}
                                    onChange={(e) => handleChange('subtitle', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-cyan-500 transition-colors outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">설명</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    rows={4}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-cyan-500 transition-colors outline-none resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">참여 방법</label>
                                    <input
                                        type="text"
                                        value={formData.howToJoin}
                                        onChange={(e) => handleChange('howToJoin', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-cyan-500 transition-colors outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">일정</label>
                                    <input
                                        type="text"
                                        value={formData.schedule}
                                        onChange={(e) => handleChange('schedule', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-cyan-500 transition-colors outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'features' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-white">특징 목록</h3>
                                <button
                                    onClick={() => addItem('features', { title: '', description: '', icon: 'Star' })}
                                    className="flex items-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 px-4 py-2 rounded-lg transition-colors border border-cyan-500/30"
                                >
                                    <Plus size={16} /> 특징 추가
                                </button>
                            </div>
                            {(formData.features || []).map((feature, idx) => (
                                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex gap-4 animate-in fade-in slide-in-from-bottom-2">
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1">아이콘 (Lucide)</label>
                                            <input
                                                type="text"
                                                value={feature.icon}
                                                onChange={(e) => handleArrayChange('features', idx, 'icon', e.target.value)}
                                                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none"
                                                placeholder="예: Star"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1">특징 제목</label>
                                            <input
                                                type="text"
                                                value={feature.title}
                                                onChange={(e) => handleArrayChange('features', idx, 'title', e.target.value)}
                                                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1">설명</label>
                                            <input
                                                type="text"
                                                value={feature.description}
                                                onChange={(e) => handleArrayChange('features', idx, 'description', e.target.value)}
                                                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                    <button onClick={() => removeItem('features', idx)} className="text-slate-600 hover:text-red-400 self-center p-2">
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                            {(!formData.features || formData.features.length === 0) && (
                                <div className="text-center py-12 text-slate-500 bg-slate-950/50 rounded-xl border border-dashed border-slate-800">
                                    등록된 특징이 없습니다.
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'gallery' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-white">갤러리 이미지</h3>
                                <button
                                    onClick={() => addItem('gallery', { imageUrl: '', caption: '' })}
                                    className="flex items-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 px-4 py-2 rounded-lg transition-colors border border-cyan-500/30"
                                >
                                    <Plus size={16} /> 이미지 추가
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(formData.gallery || []).map((item, idx) => (
                                    <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 group relative overflow-hidden">
                                        <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden border border-slate-800 relative">
                                            {item.imageUrl ? (
                                                <img src={item.imageUrl} alt="preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center w-full h-full text-slate-600">No Image</div>
                                            )}
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-1">이미지 URL</label>
                                                <input
                                                    type="text"
                                                    value={item.imageUrl}
                                                    onChange={(e) => handleArrayChange('gallery', idx, 'imageUrl', e.target.value)}
                                                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none"
                                                    placeholder="https://..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-1">캡션</label>
                                                <input
                                                    type="text"
                                                    value={item.caption}
                                                    onChange={(e) => handleArrayChange('gallery', idx, 'caption', e.target.value)}
                                                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none"
                                                    placeholder="설명 입력..."
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeItem('gallery', idx)}
                                            className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {(!formData.gallery || formData.gallery.length === 0) && (
                                <div className="text-center py-12 text-slate-500 bg-slate-950/50 rounded-xl border border-dashed border-slate-800">
                                    등록된 이미지가 없습니다.
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'youtube' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-white">YouTube 영상</h3>
                                <button
                                    onClick={() => addItem('youtube', { url: '', title: '' })}
                                    className="flex items-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 px-4 py-2 rounded-lg transition-colors border border-cyan-500/30"
                                >
                                    <Plus size={16} /> 영상 추가
                                </button>
                            </div>
                            {(formData.youtube || []).map((item, idx) => (
                                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex gap-4 animate-in fade-in slide-in-from-bottom-2">
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1">YouTube URL</label>
                                            <input
                                                type="text"
                                                value={item.url}
                                                onChange={(e) => handleArrayChange('youtube', idx, 'url', e.target.value)}
                                                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none"
                                                placeholder="https://youtube.com/watch?v=..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1">제목</label>
                                            <input
                                                type="text"
                                                value={item.title}
                                                onChange={(e) => handleArrayChange('youtube', idx, 'title', e.target.value)}
                                                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none"
                                                placeholder="영상 제목"
                                            />
                                        </div>
                                    </div>
                                    <button onClick={() => removeItem('youtube', idx)} className="text-slate-600 hover:text-red-400 self-center p-2">
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                            {(!formData.youtube || formData.youtube.length === 0) && (
                                <div className="text-center py-12 text-slate-500 bg-slate-950/50 rounded-xl border border-dashed border-slate-800">
                                    등록된 영상이 없습니다.
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'design' && (
                        <div className="space-y-8 max-w-2xl mx-auto">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-4">테마 색상 스타일</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        'from-cyan-500 to-blue-600',
                                        'from-violet-500 to-purple-600',
                                        'from-amber-500 to-orange-600',
                                        'from-emerald-500 to-teal-600',
                                        'from-indigo-500 to-blue-600',
                                        'from-rose-500 to-pink-600',
                                        'from-yellow-500 to-amber-600',
                                        'from-fuchsia-500 to-purple-600'
                                    ].map(color => (
                                        <button
                                            key={color}
                                            onClick={() => handleChange('color', color)}
                                            className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${formData.color === color
                                                ? 'border-white bg-slate-800'
                                                : 'border-transparent bg-slate-950 hover:bg-slate-900'
                                                }`}
                                        >
                                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color}`} />
                                            <span className="text-sm font-medium text-slate-400">{color.split(' ')[1].replace('from-', '')} Theme</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-4">특수 효과</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => handleChange('specialEffect', null)}
                                        className={`p-4 rounded-xl border-2 transition-all text-left ${!formData.specialEffect
                                            ? 'border-cyan-500 bg-cyan-500/10 text-white'
                                            : 'border-slate-800 bg-slate-950 text-slate-500 hover:border-slate-700'
                                            }`}
                                    >
                                        <span className="block font-bold mb-1">없음</span>
                                        <span className="text-xs opacity-70">일반적인 배경 효과</span>
                                    </button>
                                    <button
                                        onClick={() => handleChange('specialEffect', 'fire')}
                                        className={`p-4 rounded-xl border-2 transition-all text-left group relative overflow-hidden ${formData.specialEffect === 'fire'
                                            ? 'border-orange-500 bg-orange-500/10 text-white'
                                            : 'border-slate-800 bg-slate-950 text-slate-500 hover:border-orange-500/50'
                                            }`}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <span className="block font-bold mb-1 flex items-center gap-2"><Sparkles size={16} /> 불꽃 (Fire)</span>
                                        <span className="text-xs opacity-70">루시드소울 전용 아지랑이 효과</span>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">상단 Hero 배경 이미지 URL</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={formData.heroImage || ''}
                                        onChange={(e) => handleChange('heroImage', e.target.value)}
                                        className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-cyan-500 transition-colors outline-none"
                                        placeholder="https://..."
                                    />
                                    {formData.heroImage && (
                                        <div className="w-12 h-12 rounded-lg border border-slate-700 overflow-hidden shrink-0">
                                            <img src={formData.heroImage} alt="hero" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-slate-800 bg-slate-950 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:bg-slate-800 transition-colors"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center gap-2"
                    >
                        {isSaving ? <span className="animate-spin">⏳</span> : <Save size={18} />}
                        변경사항 저장
                    </button>
                </div>
            </div>
        </div>
    );
}

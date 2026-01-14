'use client';

import { useState, useEffect } from 'react';
import {
    LayoutDashboard, Image as ImageIcon, List, Calendar, Users, Settings,
    LogOut, Save, Plus, Trash2, RefreshCcw, Loader2, Link as LinkIcon,
    Shield, CheckCircle, XCircle, Move, Eye, EyeOff, Video, Sparkles
} from 'lucide-react';
import { useSiteData, useApplications } from '@/hooks/useSiteData';
import { getIcon, ICON_MAP } from '@/lib/icons';
import { useImageUpload } from '@/hooks/useImageUpload'; // Import hook
import ConfirmModal from './modals/ConfirmModal';
import React from 'react';

export default function AdminPanel({ onLogout }) {
    const { siteData, setSiteData, saveSiteData, loading: dataLoading } = useSiteData();
    const { applications, loading: appsLoading, updateApplicationStatus, deleteApplication, fetchApplications } = useApplications();
    const { uploadImage, uploading: isUploading, error: uploadError } = useImageUpload(); // Hook usage

    const [activeTab, setActiveTab] = useState('dashboard');
    const [tempData, setTempData] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    const [confirmModalState, setConfirmModalState] = useState({
        isOpen: false,
        message: '',
        onConfirm: () => { }
    });

    // 초기 데이터 로드 시 tempData 설정 + Migration for video section
    useEffect(() => {
        if (siteData) {
            // Migration: Ensure 'video' section exists in sectionOrder
            let migratedData = { ...siteData };
            if (siteData.sectionOrder && !siteData.sectionOrder.find(s => s.id === 'video')) {
                // Insert video after hero
                const heroIndex = siteData.sectionOrder.findIndex(s => s.id === 'hero');
                const newSectionOrder = [...siteData.sectionOrder];
                newSectionOrder.splice(heroIndex + 1, 0, { id: 'video', label: '소개 영상', show: true });
                migratedData = { ...siteData, sectionOrder: newSectionOrder };
            }

            // Ensure critical data structures exist
            if (!migratedData.gallery) migratedData.gallery = [];
            if (!migratedData.survey) migratedData.survey = { questions: [], pledge: '' };
            if (!migratedData.survey.questions) migratedData.survey.questions = [];

            setTempData(migratedData);
        }
    }, [siteData]);

    const handleHeroChange = (e) => {
        setTempData({ ...tempData, hero: { ...tempData.hero, [e.target.name]: e.target.value } });
        setIsSaved(false);
    };

    // --- Section Order Handlers ---
    const toggleSection = (id) => {
        const newOrder = tempData.sectionOrder.map(s => s.id === id ? { ...s, show: !s.show } : s);
        setTempData({ ...tempData, sectionOrder: newOrder });
        setIsSaved(false);
    };

    const moveSection = (index, direction) => {
        const newOrder = [...tempData.sectionOrder];
        if (direction === 'up' && index > 0) {
            [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
        } else if (direction === 'down' && index < newOrder.length - 1) {
            [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
        }
        setTempData({ ...tempData, sectionOrder: newOrder });
        setIsSaved(false);
    };

    const saveChanges = async () => {
        setSaveLoading(true);
        const result = await saveSiteData(tempData);
        if (result.success) {
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
        } else {
            alert('저장 실패: ' + result.error);
        }
        setSaveLoading(false);
    };

    // --- Handlers (Games, Roadmap, Org) ---
    // (Using generic handlers to save space if needed, but explicit is better for clarity)

    const handleGameChange = (id, field, value) => {
        const newGames = tempData.games.map(game => game.id === id ? { ...game, [field]: value } : game);
        setTempData({ ...tempData, games: newGames });
        setIsSaved(false);
    };
    const addGame = () => {
        const newId = Math.max(...tempData.games.map(g => g.id), 0) + 1;
        const newGame = { id: newId, name: "New Game", color: "text-slate-500", icon: "Gamepad2", link: "" };
        setTempData({ ...tempData, games: [...tempData.games, newGame] });
        setIsSaved(false);
    };
    const requestDeleteGame = (id) => {
        setConfirmModalState({
            isOpen: true,
            message: "정말 이 게임을 목록에서 삭제하시겠습니까?",
            onConfirm: () => {
                setTempData(prev => ({ ...prev, games: prev.games.filter(g => g.id !== id) }));
                setIsSaved(false);
            }
        });
    };

    const handleRoadmapChange = (id, field, value) => {
        const newRoadmap = tempData.roadmap.map(item => item.id === id ? { ...item, [field]: value } : item);
        setTempData({ ...tempData, roadmap: newRoadmap });
        setIsSaved(false);
    };
    const addRoadmapItem = () => {
        const newId = Math.max(...tempData.roadmap.map(r => r.id), 100) + 1;
        const newItem = { id: newId, q: "Q?", year: "2027", title: "새로운 계획", desc: "내용을 입력하세요", active: false };
        setTempData({ ...tempData, roadmap: [...tempData.roadmap, newItem] });
        setIsSaved(false);
    };
    const requestDeleteRoadmap = (id) => {
        setConfirmModalState({
            isOpen: true,
            message: "이 로드맵 항목을 삭제하시겠습니까?",
            onConfirm: () => {
                setTempData(prev => ({ ...prev, roadmap: prev.roadmap.filter(item => item.id !== id) }));
                setIsSaved(false);
            }
        });
    };

    const handleOrgChange = (id, field, value) => {
        const newOrg = tempData.organization.map(item => item.id === id ? { ...item, [field]: value } : item);
        setTempData({ ...tempData, organization: newOrg });
        setIsSaved(false);
    };
    const addOrgItem = () => {
        const newId = Math.max(...(tempData.organization.map(o => o.id).length ? tempData.organization.map(o => o.id) : [200])) + 1;
        const newItem = { id: newId, title: "새 부서", role: "역할 설명", icon: "Users" };
        setTempData({ ...tempData, organization: [...tempData.organization, newItem] });
        setIsSaved(false);
    };
    const requestDeleteOrg = (id) => {
        setConfirmModalState({
            isOpen: true,
            message: "이 부서를 삭제하시겠습니까?",
            onConfirm: () => {
                setTempData(prev => ({ ...prev, organization: prev.organization.filter(item => item.id !== id) }));
                setIsSaved(false);
            }
        });
    };

    // --- Application Handlers ---
    const handleApprove = async (app) => {
        if (confirm('이 신청을 승인하시겠습니까?')) {
            await updateApplicationStatus(app.id, 'approved');
        }
    };
    const handleReject = async (app) => {
        if (confirm('이 신청을 거절하시겠습니까?')) {
            await updateApplicationStatus(app.id, 'rejected');
        }
    };
    const handleDeleteApp = async (app) => {
        if (confirm('이 신청 기록을 영구 삭제하시겠습니까?')) {
            await deleteApplication(app.id);
        }
    };

    // --- Gallery Handlers ---
    const addGalleryItem = () => {
        const newId = Math.max(...(tempData.gallery?.map(g => g.id) || [0])) + 1;
        const newItem = { id: newId, imageUrl: "", caption: "새 이미지" };
        setTempData({ ...tempData, gallery: [...(tempData.gallery || []), newItem] });
        setIsSaved(false);
    };
    const deleteGalleryItem = (id) => {
        setConfirmModalState({
            isOpen: true,
            message: "이 이미지를 갤러리에서 삭제하시겠습니까?",
            onConfirm: () => {
                setTempData(prev => ({ ...prev, gallery: prev.gallery.filter(g => g.id !== id) }));
                setIsSaved(false);
            }
        });
    };
    const handleGalleryChange = (id, field, value) => {
        let newValue = value;
        // Smart URL handling: extract src if user pastes <img> tag / embed code
        if (field === 'imageUrl' && typeof value === 'string' && value.includes('<')) {
            const srcMatch = value.match(/src=['"]([^'"]+)['"]/);
            if (srcMatch) {
                newValue = srcMatch[1];
            }
        }

        const newGallery = tempData.gallery.map(g => g.id === id ? { ...g, [field]: newValue } : g);
        setTempData({ ...tempData, gallery: newGallery });
        setIsSaved(false);
    };

    // --- Survey Handlers ---
    const handleSurveyPledgeChange = (value) => {
        setTempData({ ...tempData, survey: { ...tempData.survey, pledge: value } });
        setIsSaved(false);
    };
    const handleQuestionChange = (id, field, value) => {
        const newQuestions = tempData.survey.questions.map(q => q.id === id ? { ...q, [field]: value } : q);
        setTempData({ ...tempData, survey: { ...tempData.survey, questions: newQuestions } });
        setIsSaved(false);
    };

    const menuItems = [
        { id: 'dashboard', label: '대시보드', icon: <LayoutDashboard size={20} /> },
        { id: 'basic', label: '기본 정보', icon: <Settings size={20} /> }, // New Request #1
        { id: 'sections', label: '섹션 관리', icon: <Move size={20} /> },
        { id: 'hero', label: '메인 배너', icon: <Sparkles size={20} /> },
        { id: 'video', label: '비디오', icon: <Video size={20} /> },
        { id: 'gallery', label: '갤러리 관리', icon: <ImageIcon size={20} /> },
        { id: 'games', label: '게임 라인업', icon: <List size={20} /> },
        { id: 'roadmap', label: '로드맵', icon: <Calendar size={20} /> },
        { id: 'organization', label: '조직도', icon: <Users size={20} /> },
        { id: 'survey', label: '설문조사 관리', icon: <List size={20} /> },
        { id: 'applications', label: '가입 신청 관리', icon: <Users size={20} /> },
        { id: 'logos', label: '로고 관리', icon: <ImageIcon size={20} /> },
        { id: 'texts', label: '텍스트 편집', icon: <List size={20} /> },
        { id: 'footer', label: '연락처 & 푸터', icon: <Settings size={20} /> },
        { id: 'settings', label: '환경 설정', icon: <Settings size={20} /> },
    ];

    if (dataLoading || !tempData) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
            <ConfirmModal
                isOpen={confirmModalState.isOpen}
                message={confirmModalState.message}
                onConfirm={confirmModalState.onConfirm}
                onClose={() => setConfirmModalState(prev => ({ ...prev, isOpen: false }))}
            />

            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-2xl z-20">
                <div className="p-6 flex items-center gap-3 border-b border-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                        <Shield size={16} className="text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg tracking-tight">Admin</h1>
                        <p className="text-xs text-slate-400">Manager Mode</p>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <button onClick={onLogout} className="w-full flex items-center gap-2 px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-all text-sm font-medium">
                        <LogOut size={18} /> 종료
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-8 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800 capitalize">{menuItems.find(m => m.id === activeTab)?.label}</h2>
                    <div className="flex items-center gap-4">
                        {isSaved && <span className="text-green-600 text-sm font-bold animate-pulse">저장되었습니다!</span>}
                        {activeTab !== 'dashboard' && activeTab !== 'applications' && (
                            <button onClick={saveChanges} disabled={saveLoading} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50">
                                {saveLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 저장하기
                            </button>
                        )}
                    </div>
                </header>

                <div className="p-8 max-w-5xl mx-auto space-y-8">

                    {/* Dashboard */}
                    {activeTab === 'dashboard' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-slate-700">실시간 현황</h3>
                                <button onClick={fetchApplications} className="p-2 hover:bg-slate-100 rounded-full transition-colors" title="새로고침">
                                    <RefreshCcw size={20} className={appsLoading ? "animate-spin text-indigo-500" : "text-slate-500"} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { label: '대기 중인 신청', value: applications.filter(a => a.status === 'pending').length, color: 'text-rose-600 bg-rose-50' },
                                    { label: '승인된 입주민', value: applications.filter(a => a.status === 'approved').length, color: 'text-emerald-600 bg-emerald-50' },
                                    { label: '총 신청 수', value: applications.length, color: 'text-blue-600 bg-blue-50' },
                                ].map((stat, idx) => (
                                    <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                        <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                                        <p className={`text-4xl font-bold mt-2 ${stat.color.split(' ')[0]}`}>{stat.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Recent Applications Preview */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                                <h4 className="font-bold text-slate-800 mb-4">최근 대기 신청 (최대 5개)</h4>
                                {applications.filter(a => a.status === 'pending').length === 0 ? (
                                    <p className="text-slate-400 text-sm">대기 중인 신청이 없습니다.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {applications.filter(a => a.status === 'pending').slice(0, 5).map(app => (
                                            <div key={app.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                <div>
                                                    <p className="font-bold text-slate-800">{app.name}</p>
                                                    <p className="text-xs text-slate-500">{new Date(app.createdAt?.seconds * 1000).toLocaleDateString()}</p>
                                                </div>
                                                <span className="px-2 py-1 bg-rose-100 text-rose-600 text-xs font-bold rounded">Pending</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Basic Info Editor (Request #1) */}
                    {activeTab === 'basic' && (
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <Settings size={18} className="text-indigo-500" /> 기본 정보 관리
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">웹사이트 제목 (브라우저 탭)</label>
                                    <input
                                        type="text"
                                        value={tempData.globalText?.siteTitle || 'Peaceful Game Village'}
                                        onChange={(e) => setTempData({ ...tempData, globalText: { ...tempData.globalText, siteTitle: e.target.value } })}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-indigo-500 transition-all"
                                        placeholder="브라우저 탭에 표시될 제목"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">네비게이션 바 제목</label>
                                    <input
                                        type="text"
                                        value={tempData.globalText?.navTitle || '평화로운 게임마을'}
                                        onChange={(e) => setTempData({ ...tempData, globalText: { ...tempData.globalText, navTitle: e.target.value } })}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-indigo-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">사이트 설명 (SEO)</label>
                                    <textarea
                                        rows={3}
                                        value={tempData.globalText?.siteDesc || ''}
                                        onChange={(e) => setTempData({ ...tempData, globalText: { ...tempData.globalText, siteDesc: e.target.value } })}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-indigo-500 transition-all resize-none"
                                        placeholder="검색 결과에 표시될 사이트 설명"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* NEW: Section Management */}
                    {activeTab === 'sections' && (
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3">
                                <Move className="text-indigo-500 mt-1" size={20} />
                                <div>
                                    <h4 className="font-bold text-indigo-900 text-sm">섹션 순서 및 노출 관리</h4>
                                    <p className="text-xs text-indigo-700 mt-1 mb-2">원하는 순서대로 위/아래 이동하거나, 눈 아이콘을 눌러 섹션을 숨길 수 있습니다.</p>
                                    <p className="text-[10px] text-indigo-500">* 메인 화면에 즉시 반영됩니다.</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {tempData.sectionOrder?.map((section, index) => (
                                    <div key={section.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${section.show ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs">{index + 1}</div>
                                            <span className={`font-bold ${section.show ? 'text-slate-800' : 'text-slate-400 line-through'}`}>{section.label}</span>
                                            <span className="text-xs text-slate-400 px-2 py-0.5 bg-slate-100 rounded">ID: {section.id}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => moveSection(index, 'up')}
                                                disabled={index === 0}
                                                className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 disabled:opacity-20"
                                            >
                                                ▲
                                            </button>
                                            <button
                                                onClick={() => moveSection(index, 'down')}
                                                disabled={index === tempData.sectionOrder?.length - 1}
                                                className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 disabled:opacity-20"
                                            >
                                                ▼
                                            </button>
                                            <div className="w-px h-4 bg-slate-200 mx-2"></div>
                                            <button
                                                onClick={() => toggleSection(section.id)}
                                                className={`p-2 rounded-lg transition-colors ${section.show ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100' : 'text-slate-400 hover:bg-slate-200'}`}
                                                title={section.show ? "숨기기" : "보이기"}
                                            >
                                                {section.show ? <Eye size={20} /> : <EyeOff size={20} />}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Applications Manager */}
                    {activeTab === 'applications' && (
                        <div className="space-y-4">
                            {applications.length === 0 ? (
                                <div className="text-center py-20 text-slate-400">데이터가 없습니다.</div>
                            ) : (
                                applications.map(app => (
                                    <div key={app.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6">
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${app.status === 'approved' ? 'bg-emerald-100 text-emerald-600' :
                                                    app.status === 'rejected' ? 'bg-slate-100 text-slate-500' : 'bg-rose-100 text-rose-600'
                                                    }`}>
                                                    {app.status}
                                                </span>
                                                <span className="text-xs text-slate-400">{new Date(app.createdAt?.seconds * 1000).toLocaleString()}</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900">{app.name}</h3>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="block text-xs font-bold text-slate-400 uppercase">Contact</span>
                                                    <span className="text-slate-700">{app.contact}</span>
                                                </div>
                                                <div>
                                                    <span className="block text-xs font-bold text-slate-400 uppercase">Games</span>
                                                    <div className="flex flex-wrap gap-1">
                                                        {app.selectedGames?.map(g => <span key={g} className="px-1.5 py-0.5 bg-slate-100 rounded text-xs text-slate-600">{g}</span>)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-600 whitespace-pre-line">
                                                {app.introduction}
                                            </div>
                                        </div>
                                        <div className="flex flex-row md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                                            {app.status === 'pending' && (
                                                <>
                                                    <button onClick={() => handleApprove(app)} className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200" title="승인">
                                                        <CheckCircle size={20} />
                                                    </button>
                                                    <button onClick={() => handleReject(app)} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200" title="거절">
                                                        <XCircle size={20} />
                                                    </button>
                                                </>
                                            )}
                                            <button onClick={() => handleDeleteApp(app)} className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-rose-100 hover:text-rose-500" title="삭제">
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Hero Editor */}
                    {activeTab === 'hero' && (
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                            <div className="grid gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Since</label>
                                    <input type="text" name="since" value={tempData.hero.since} onChange={handleHeroChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-indigo-500 transition-all" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">타이틀 1</label>
                                        <input type="text" name="titlePrimary" value={tempData.hero.titlePrimary} onChange={handleHeroChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-indigo-500 transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">타이틀 2 (강조)</label>
                                        <input type="text" name="titleSecondary" value={tempData.hero.titleSecondary} onChange={handleHeroChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-indigo-500 transition-all" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">서브타이틀</label>
                                    <textarea name="subtitle" rows={4} value={tempData.hero.subtitle} onChange={handleHeroChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-indigo-500 transition-all resize-none" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Video Section Editor (NEW) */}
                    {activeTab === 'video' && (
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <Video size={20} className="text-indigo-500" /> 비디오 섹션 관리
                            </h3>
                            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-sm text-indigo-700 mb-4">
                                💡 YouTube URL 또는 직접 호스팅된 MP4 링크를 입력하세요. 배경/모달/인라인 중 표시 방식을 선택할 수 있습니다.
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Video URL</label>
                                    <input type="text" name="videoUrl" value={tempData.hero?.videoUrl || ''} onChange={handleHeroChange} placeholder="https://youtube.com/watch?v=..." className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm focus:border-indigo-500 outline-none font-mono" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Display Type</label>
                                        <select name="videoType" value={tempData.hero?.videoType || 'background'} onChange={handleHeroChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm focus:border-indigo-500 outline-none">
                                            <option value="background">Background (Loop)</option>
                                            <option value="modal">Modal (Popup)</option>
                                            <option value="inline">Inline (Below Text)</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center pt-7">
                                        <label className="flex items-center gap-3 text-sm font-bold text-slate-700 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={tempData.hero?.autoPlay ?? true}
                                                onChange={(e) => { setTempData({ ...tempData, hero: { ...tempData.hero, autoPlay: e.target.checked } }); setIsSaved(false); }}
                                                className="w-5 h-5 accent-indigo-600"
                                            />
                                            Auto Play
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Games Manager */}
                    {activeTab === 'games' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-4">
                                {tempData.games.map((game) => {
                                    const GameIcon = getIcon(game.icon);
                                    return (
                                        <div key={game.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6 group hover:border-indigo-200 transition-colors">
                                            <div className="flex items-center justify-center w-full md:w-auto">
                                                <div className="w-16 h-16 md:w-12 md:h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 shadow-inner">
                                                    <GameIcon size={24} />
                                                </div>
                                            </div>
                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
                                                <div className="col-span-1">
                                                    <label className="text-[10px] text-slate-400 font-bold mb-1 block uppercase">Game Name</label>
                                                    <input type="text" value={game.name} onChange={(e) => handleGameChange(game.id, 'name', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-bold text-slate-700 focus:border-indigo-500 outline-none" />
                                                </div>
                                                <div className="col-span-1">
                                                    <label className="text-[10px] text-slate-400 font-bold mb-1 block uppercase">Color (Tailwind)</label>
                                                    <input type="text" value={game.color} onChange={(e) => handleGameChange(game.id, 'color', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-mono text-slate-500 focus:border-indigo-500 outline-none" />
                                                </div>
                                                <div className="col-span-1">
                                                    <label className="text-[10px] text-slate-400 font-bold mb-1 block uppercase">Icon</label>
                                                    <select
                                                        value={game.icon}
                                                        onChange={(e) => handleGameChange(game.id, 'icon', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:border-indigo-500 outline-none cursor-pointer"
                                                    >
                                                        {Object.keys(ICON_MAP).map(key => <option key={key} value={key}>{key}</option>)}
                                                    </select>
                                                </div>
                                                <div className="col-span-1">
                                                    <label className="text-[10px] text-slate-400 font-bold mb-1 block uppercase">Link URL</label>
                                                    <div className="relative">
                                                        <input type="text" value={game.link || ''} onChange={(e) => handleGameChange(game.id, 'link', e.target.value)} placeholder="https://" className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-500 outline-none" />
                                                        <LinkIcon size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                    </div>
                                                </div>
                                            </div>
                                            <button onClick={() => requestDeleteGame(game.id)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all self-end md:self-center" title="삭제">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                            <button onClick={addGame} className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                                <Plus size={20} /> 새 게임 추가하기
                            </button>
                        </div>
                    )}

                    {/* Roadmap & Organization editors are similar... omitting full detail to fit context but applying same pattern */}
                    {activeTab === 'roadmap' && (
                        <div className="space-y-6">
                            {tempData.roadmap.map((item, idx) => (
                                <div key={item.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative group">
                                    <div className="absolute top-4 right-14 text-xs font-bold text-slate-300 bg-slate-50 px-2 py-1 rounded">ITEM #{idx + 1}</div>
                                    <button onClick={() => requestDeleteRoadmap(item.id)} className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded transition-all">
                                        <Trash2 size={16} />
                                    </button>
                                    <div className="grid grid-cols-12 gap-4 mt-2">
                                        <div className="col-span-3 md:col-span-2">
                                            <label className="text-[10px] text-slate-400 font-bold mb-1 block uppercase">Quarter</label>
                                            <input value={item.q} onChange={(e) => handleRoadmapChange(item.id, 'q', e.target.value)} className="w-full px-3 py-2 rounded border border-slate-200 text-sm focus:border-indigo-500 outline-none" />
                                        </div>
                                        <div className="col-span-3 md:col-span-2">
                                            <label className="text-[10px] text-slate-400 font-bold mb-1 block uppercase">Year</label>
                                            <input value={item.year} onChange={(e) => handleRoadmapChange(item.id, 'year', e.target.value)} className="w-full px-3 py-2 rounded border border-slate-200 text-sm focus:border-indigo-500 outline-none" />
                                        </div>
                                        <div className="col-span-6 md:col-span-8">
                                            <label className="text-[10px] text-slate-400 font-bold mb-1 block uppercase">Title</label>
                                            <input value={item.title} onChange={(e) => handleRoadmapChange(item.id, 'title', e.target.value)} className="w-full px-3 py-2 rounded border border-slate-200 text-sm font-bold text-slate-800 focus:border-indigo-500 outline-none" />
                                        </div>
                                        <div className="col-span-12">
                                            <label className="text-[10px] text-slate-400 font-bold mb-1 block uppercase">Description</label>
                                            <input value={item.desc} onChange={(e) => handleRoadmapChange(item.id, 'desc', e.target.value)} className="w-full px-3 py-2 rounded border border-slate-200 text-sm focus:border-indigo-500 outline-none" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button onClick={addRoadmapItem} className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                                <Plus size={20} /> 새 로드맵 추가하기
                            </button>
                        </div>
                    )}

                    {activeTab === 'organization' && (
                        <div className="space-y-6">
                            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3">
                                <Shield className="text-indigo-500 mt-1" size={20} />
                                <div>
                                    <h4 className="font-bold text-indigo-900 text-sm">기본 구조 안내</h4>
                                    <p className="text-xs text-indigo-700 mt-1">촌장(운영진)은 고정된 최상위 리더이며, 아래 목록은 그 하위에 배치되는 부서들입니다.</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {tempData.organization.map((org) => {
                                    const OrgIcon = getIcon(org.icon, Users);
                                    return (
                                        <div key={org.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative group hover:border-indigo-200 transition-all">
                                            <button onClick={() => requestDeleteOrg(org.id)} className="absolute top-3 right-3 p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600">
                                                    <OrgIcon size={24} />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="text-[10px] text-slate-400 font-bold mb-1 block uppercase">Icon</label>
                                                    <select
                                                        value={org.icon}
                                                        onChange={(e) => handleOrgChange(org.id, 'icon', e.target.value)}
                                                        className="w-full px-2 py-1.5 rounded border border-slate-200 text-xs bg-white focus:border-indigo-500 outline-none"
                                                    >
                                                        {Object.keys(ICON_MAP).map(key => <option key={key} value={key}>{key}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="text-[10px] text-slate-400 font-bold mb-1 block uppercase">Team Name</label>
                                                    <input type="text" value={org.title} onChange={(e) => handleOrgChange(org.id, 'title', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-bold text-slate-800 focus:border-indigo-500 outline-none" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] text-slate-400 font-bold mb-1 block uppercase">Role Description</label>
                                                    <input type="text" value={org.role} onChange={(e) => handleOrgChange(org.id, 'role', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 focus:border-indigo-500 outline-none" />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <button onClick={addOrgItem} className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                                <Plus size={20} /> 새 부서 추가하기
                            </button>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
                            <Settings size={48} className="mx-auto text-slate-200 mb-4" />
                            <p className="text-slate-500 font-medium">환경 설정</p>
                            <p className="text-xs text-slate-400 mt-2">데이터베이스 연결 및 관리자 계정 설정 정보를 확인하세요.</p>
                            <div className="mt-8 text-left max-w-sm mx-auto bg-slate-50 p-4 rounded-lg text-xs space-y-2 font-mono text-slate-500">
                                <p>AUTH_DOMAIN: {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'Not Set'}</p>
                                <p>PROJECT_ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'Not Set'}</p>
                            </div>

                            <div className="mt-8 border-t border-slate-100 pt-8">
                                <h4 className="font-bold text-slate-700 mb-4">테마 설정 (v3.0)</h4>
                                <div className="flex items-center justify-center gap-4">
                                    <button
                                        onClick={() => {
                                            setTempData({ ...tempData, theme: { ...tempData.theme, mode: 'light' } });
                                            setIsSaved(false);
                                        }}
                                        className={`px-4 py-2 rounded-lg font-bold transition-all ${!tempData.theme?.mode || tempData.theme.mode === 'light' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-400'}`}
                                    >
                                        Light Mode
                                    </button>
                                    <button
                                        onClick={() => {
                                            setTempData({ ...tempData, theme: { ...tempData.theme, mode: 'dark' } });
                                            setIsSaved(false);
                                        }}
                                        className={`px-4 py-2 rounded-lg font-bold transition-all ${tempData.theme?.mode === 'dark' ? 'bg-indigo-900 text-white' : 'bg-slate-100 text-slate-400'}`}
                                    >
                                        Dark Mode
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* Logo Manager */}
                    {activeTab === 'logos' && (
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-600 mb-6">
                                💡 <strong>이미지 업로드 가이드</strong><br />
                                - 파일 찾기 버튼을 눌러 이미지를 선택하면 자동으로 업로드됩니다.<br />
                                - 500KB 이하의 PNG/JPG 파일을 권장합니다.
                            </div>

                            {/* Main Logo */}
                            <div>
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Sparkles size={18} className="text-indigo-500" /> 메인 로고 (네비게이션 바)
                                </h3>
                                <div className="flex flex-col md:flex-row gap-6 items-start">
                                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 flex items-center justify-center min-w-[200px] min-h-[100px]">
                                        {tempData.logos?.mainLogo ? (
                                            <img src={tempData.logos.mainLogo} alt="Main Logo" className="max-h-16 object-contain" />
                                        ) : (
                                            <span className="text-slate-500 text-xs">로고 없음</span>
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-3 w-full">
                                        <label className="block text-sm font-bold text-slate-700">이미지 파일 업로드 {isUploading && <span className="text-indigo-500 text-xs ml-2 animate-pulse">업로드 중...</span>}</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    if (file.size > 2000000) { // 2MB limit
                                                        alert("파일 크기가 2MB를 초과합니다.");
                                                        return;
                                                    }
                                                    const url = await uploadImage(file, 'logos');
                                                    if (url) {
                                                        setTempData({ ...tempData, logos: { ...tempData.logos, mainLogo: url } });
                                                        setIsSaved(false);
                                                    } else {
                                                        alert("이미지 업로드 실패");
                                                    }
                                                }
                                            }}
                                            disabled={isUploading}
                                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 disabled:opacity-50"
                                        />
                                        <p className="text-xs text-slate-400">또는 URL 직접 입력:</p>
                                        <input
                                            type="text"
                                            value={tempData.logos?.mainLogo || ""}
                                            onChange={(e) => {
                                                setTempData({ ...tempData, logos: { ...tempData.logos, mainLogo: e.target.value } });
                                                setIsSaved(false);
                                            }}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-500 outline-none font-mono"
                                            placeholder="https://example.com/logo.png"
                                        />
                                        <button
                                            onClick={() => {
                                                setTempData({ ...tempData, logos: { ...tempData.logos, mainLogo: 'https://i.ibb.co/jP8TD0p4/image.png' } });
                                                setIsSaved(false);
                                            }}
                                            className="text-xs text-indigo-500 hover:text-indigo-700 font-bold underline mt-1 text-left block"
                                        >
                                            [빠른 적용] 사용자 제공 이미지 (게임 컨트롤러)
                                        </button>
                                        <button
                                            onClick={() => {
                                                setTempData({ ...tempData, logos: { ...tempData.logos, mainLogo: '/logo_generated.png' } });
                                                setIsSaved(false);
                                            }}
                                            className="text-xs text-fuchsia-500 hover:text-fuchsia-700 font-bold underline mt-1 text-left block"
                                        >
                                            [AI 추천] 게이밍 하우스 네온 로고
                                        </button>
                                        <button
                                            onClick={async () => {
                                                if (!confirm("AI 로고를 서버에 업로드하고 URL을 생성하시겠습니까?")) return;
                                                try {
                                                    const res = await fetch('/logo_generated.png');
                                                    const blob = await res.blob();
                                                    const file = new File([blob], 'ai_gaming_logo.png', { type: 'image/png' });
                                                    const url = await uploadImage(file, 'logos');
                                                    if (url) {
                                                        setTempData({ ...tempData, logos: { ...tempData.logos, mainLogo: url } });
                                                        setIsSaved(false);
                                                        alert("URL이 생성되었습니다! 자동으로 입력란에 적용됩니다.\nURL: " + url);
                                                    }
                                                } catch (e) {
                                                    console.error(e);
                                                    alert("URL 생성 실패: " + e.message);
                                                }
                                            }}
                                            className="text-xs text-emerald-500 hover:text-emerald-700 font-bold underline mt-1 text-left block"
                                            disabled={isUploading}
                                        >
                                            {isUploading ? "생성 중..." : "[URL 생성] AI 로고 영구 저장 및 URL 따기"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Global Text Editor */}
                    {activeTab === 'texts' && (
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <List size={18} className="text-indigo-500" /> 전역 텍스트 수정
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Object.entries(tempData.globalText || {}).map(([key, value]) => (
                                    <div key={key}>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">{key}</label>
                                        <input
                                            type="text"
                                            value={value}
                                            onChange={(e) => {
                                                setTempData({ ...tempData, globalText: { ...tempData.globalText, [key]: e.target.value } });
                                                setIsSaved(false);
                                            }}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-500 outline-none"
                                        />
                                    </div>
                                ))}
                                {(!tempData.globalText || Object.keys(tempData.globalText).length === 0) && (
                                    <div className="col-span-2 text-center text-slate-400 py-4">
                                        텍스트 데이터가 없습니다. (초기화 필요)
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Footer & Contact Manager */}
                    {activeTab === 'footer' && (
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <Settings size={18} className="text-indigo-500" /> 하단 연락처 및 푸터
                            </h3>

                            <div className="grid gap-6">
                                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold text-slate-700">카카오톡 링크 노출</label>
                                        <input
                                            type="checkbox"
                                            checked={tempData.footer?.showKakao || false}
                                            onChange={(e) => {
                                                setTempData({ ...tempData, footer: { ...tempData.footer, showKakao: e.target.checked } });
                                                setIsSaved(false);
                                            }}
                                            className="w-5 h-5 accent-indigo-600"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        value={tempData.footer?.kakaoLink || ""}
                                        onChange={(e) => {
                                            setTempData({ ...tempData, footer: { ...tempData.footer, kakaoLink: e.target.value } });
                                            setIsSaved(false);
                                        }}
                                        placeholder="https://open.kakao.com/..."
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-500 outline-none"
                                    />
                                </div>

                                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold text-slate-700">유튜브 링크 노출</label>
                                        <input
                                            type="checkbox"
                                            checked={tempData.footer?.showYoutube || false}
                                            onChange={(e) => {
                                                setTempData({ ...tempData, footer: { ...tempData.footer, showYoutube: e.target.checked } });
                                                setIsSaved(false);
                                            }}
                                            className="w-5 h-5 accent-indigo-600"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        value={tempData.footer?.youtubeLink || ""}
                                        onChange={(e) => {
                                            setTempData({ ...tempData, footer: { ...tempData.footer, youtubeLink: e.target.value } });
                                            setIsSaved(false);
                                        }}
                                        placeholder="https://youtube.com/@..."
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">카피라이트 문구</label>
                                    <input
                                        type="text"
                                        value={tempData.footer?.copyright || ""}
                                        onChange={(e) => {
                                            setTempData({ ...tempData, footer: { ...tempData.footer, copyright: e.target.value } });
                                            setIsSaved(false);
                                        }}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-indigo-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Gallery Manager */}
                    {activeTab === 'gallery' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {tempData.gallery?.map((item) => (
                                    <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative group">
                                        <button onClick={() => deleteGalleryItem(item.id)} className="absolute top-2 right-2 p-1.5 bg-white/80 text-slate-400 hover:text-rose-500 rounded-lg transition-colors z-10 shadow-sm">
                                            <Trash2 size={16} />
                                        </button>
                                        <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden mb-3 relative">
                                            {item.imageUrl ? (
                                                <img src={item.imageUrl} alt={item.caption} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                    <ImageIcon size={32} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <div className="flex justify-between items-center mb-1">
                                                    <label className="text-[10px] text-slate-400 font-bold uppercase">Image Upload {isUploading && <span className="text-indigo-500 animate-pulse">...</span>}</label>
                                                    <label htmlFor={`gallery-upload-${item.id}`} className="text-[10px] text-indigo-600 font-bold uppercase cursor-pointer hover:underline">파일 선택</label>
                                                </div>
                                                <input
                                                    id={`gallery-upload-${item.id}`}
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    disabled={isUploading}
                                                    onChange={async (e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            const url = await uploadImage(file, 'gallery');
                                                            if (url) {
                                                                handleGalleryChange(item.id, 'imageUrl', url);
                                                            } else {
                                                                alert("이미지 업로드 실패");
                                                            }
                                                        }
                                                    }}
                                                />
                                                <input
                                                    type="text"
                                                    value={item.imageUrl}
                                                    onChange={(e) => handleGalleryChange(item.id, 'imageUrl', e.target.value)}
                                                    placeholder="https://"
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-mono focus:border-indigo-500 outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-slate-400 font-bold mb-1 block uppercase">Caption</label>
                                                <input
                                                    type="text"
                                                    value={item.caption}
                                                    onChange={(e) => handleGalleryChange(item.id, 'caption', e.target.value)}
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-bold text-slate-700 focus:border-indigo-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={addGalleryItem} className="min-h-[300px] border-2 border-dashed border-slate-300 rounded-xl text-slate-400 font-bold hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex flex-col items-center justify-center gap-2">
                                    <Plus size={32} />
                                    <span>이미지 추가</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Survey Manager */}
                    {activeTab === 'survey' && (
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
                            <div className="space-y-6">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <List size={20} className="text-indigo-500" /> 설문 문항 관리
                                </h3>
                                {tempData.survey?.questions.map((q, idx) => (
                                    <div key={q.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-xs font-bold text-indigo-500">질문 {idx + 1}</span>
                                            <span className="text-xs text-slate-400 uppercase">{q.type}</span>
                                        </div>
                                        <input
                                            type="text"
                                            value={q.text}
                                            onChange={(e) => handleQuestionChange(q.id, 'text', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-bold text-slate-700 focus:border-indigo-500 outline-none"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="pt-6 border-t border-slate-100">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <CheckCircle size={20} className="text-indigo-500" /> 서약서 문구
                                </h3>
                                <textarea
                                    rows={2}
                                    value={tempData.survey?.pledge}
                                    onChange={(e) => handleSurveyPledgeChange(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-indigo-500 transition-all resize-none font-medium text-slate-600"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import {
    doc,
    getDoc,
    setDoc,
    onSnapshot,
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    query,
    orderBy
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// 초기 데이터 (Firestore가 비어있을 때 사용)
const initialSiteData = {
    hero: {
        since: "2024",
        titlePrimary: "경쟁을 넘어,",
        titleSecondary: "함께의 품격으로.",
        subtitle: "승패의 스트레스에서 벗어나, 사람 냄새 나는 곳.\n매너와 존중을 기반으로 한 프라이빗 게임 라운지입니다.",
        videoUrl: "", // YouTube or MP4 URL
        videoType: "background", // 'background', 'modal', 'inline'
        autoPlay: true,
    },
    // v3.0 Section Order Management
    sectionOrder: [
        { id: 'hero', label: '메인 예고편', show: true },
        { id: 'video', label: '소개 영상', show: true }, // New Video Section
        { id: 'values', label: '가치관', show: true },
        { id: 'contents', label: '컨텐츠', show: true }, // New Contents Section
        { id: 'gallery', label: '활동 갤러리', show: true }, // New Gallery Section
        { id: 'games', label: '게임 라인업', show: true },
        { id: 'roadmap', label: '로드맵', show: true },
        { id: 'organization', label: '조직도', show: true },
        { id: 'contact', label: '커뮤니티', show: true },
    ],
    // v3.0 Gallery Data
    gallery: [
        { id: 1, imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2670&auto=format&fit=crop", caption: "함께하는 즐거움" },
        { id: 2, imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2671&auto=format&fit=crop", caption: "정기 내전 이벤트" },
        { id: 3, imageUrl: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=2665&auto=format&fit=crop", caption: "오프라인 정모" },
    ],
    // v3.0 Survey Data
    survey: {
        questions: [
            { id: 'q1', text: "주로 플레이하는 게임은 무엇인가요?", type: 'text' },
            { id: 'q2', text: "주로 게임을 즐기는 시간대는 언제인가요?", type: 'text' },
            { id: 'q3', text: "본인의 플레이 스타일을 자유롭게 적어주세요.", type: 'textarea' },
        ],
        pledge: "주민들과 갈등 없이 사이좋게 지낼 것을 맹세합니다.",
    },
    games: [
        { id: 1, name: "Overwatch 2", color: "text-orange-500", icon: "Target", link: "https://overwatch.blizzard.com" },
        { id: 2, name: "PUBG", color: "text-amber-600", icon: "MousePointer2", link: "https://pubg.com" },
        { id: 3, name: "Valorant", color: "text-rose-500", icon: "Zap", link: "https://playvalorant.com" },
        { id: 4, name: "League of Legends", color: "text-indigo-600", icon: "Crown", link: "https://leagueoflegends.com" },
        { id: 5, name: "Minecraft", color: "text-emerald-600", icon: "Gamepad2", link: "" },
        { id: 6, name: "Lost Ark", color: "text-cyan-600", icon: "Sparkles", link: "" },
        { id: 7, name: "Steam Games", color: "text-slate-700", icon: "Gamepad2", link: "" },
        { id: 8, name: "Party Animals", color: "text-pink-500", icon: "Users", link: "" },
    ],
    roadmap: [
        { id: 101, q: "Q1", year: "2026", title: "새로운 시작", desc: "공식 홈페이지 오픈 및 3기 멤버 대규모 모집", active: true },
        { id: 102, q: "Q2", year: "2026", title: "마을 축제", desc: "종합 게임 내전 (Overwatch, Valorant) 및 경품 이벤트", active: false },
        { id: 103, q: "Q3", year: "2026", title: "오프라인 정모", desc: "서울/부산 지역별 정모 및 랜파티 개최", active: false },
        { id: 104, q: "Q4", year: "2026", title: "연말 어워즈", desc: "올해의 매너 유저 시상식 및 명예의 전당 등재", active: false },
    ],
    organization: [
        { id: 201, title: "관리팀", role: "분쟁 조정 · 멤버 관리", icon: "Users" },
        { id: 202, title: "콘텐츠팀", role: "내전 기획 · 방송 송출", icon: "Gamepad2" },
        { id: 203, title: "디자인팀", role: "웹 디자인 · 배너 제작", icon: "Palette" },
    ],
    // v2.0 New Fields
    logos: {
        mainLogo: "", // Base64 or URL
        favicon: "",
    },
    // v3.0 Theme Settings
    theme: {
        mode: 'light', // 'light' | 'dark'
        primaryColor: 'sky',
    },
    footer: {
        kakaoLink: "",
        discordLink: "",
        showKakao: false,
        showDiscord: false,
        copyright: "© 2026 Peaceful Game Village. All rights reserved.",
    },
    globalText: {
        navTitle: "평화로운 게임마을",
        navButton: "가입하기",
        heroButton1: "입주 신청하기",
        heroButton2: "둘러보기",
        valuesTitle: "Core Values",
        valuesSubtitle: "평화로운 게임마을은\n단단한 원칙 위에 세워진 공간입니다.",
        gamesTitle: "Game Lineup",
        gamesSubtitle: "Curated Collection",
        roadmapTitle: "Vision Roadmap",
        roadmapSubtitle: "함께 그려나갈 미래입니다.",
        orgTitle: "Organization",
        contactTitle: "Contact & Community",
        contactSubtitle: "언제든 편하게 연락주세요."
    }
};

// 사이트 데이터 관리 훅
export function useSiteData() {
    const [siteData, setSiteData] = useState(initialSiteData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Firestore 실시간 구독
        const docRef = doc(db, 'siteData', 'main');

        const unsubscribe = onSnapshot(docRef,
            (docSnap) => {
                if (docSnap.exists()) {
                    console.log("✅ Firestore 연결 성공: 사이트 데이터를 불러왔습니다.");
                    const fetchedData = docSnap.data();

                    // Migration: Ensure contents section exists
                    let currentSectionOrder = fetchedData.sectionOrder || initialSiteData.sectionOrder;
                    if (!currentSectionOrder.find(s => s.id === 'contents')) {
                        const valuesIdx = currentSectionOrder.findIndex(s => s.id === 'values');
                        const newSection = { id: 'contents', label: '컨텐츠', show: true };
                        if (valuesIdx !== -1) {
                            currentSectionOrder = [
                                ...currentSectionOrder.slice(0, valuesIdx + 1),
                                newSection,
                                ...currentSectionOrder.slice(valuesIdx + 1)
                            ];
                        } else {
                            currentSectionOrder.push(newSection);
                        }
                    }

                    // v3.0 Data Migration / Merge Logic
                    // Ensure new fields from initialSiteData are present even if missing in Firestore
                    const mergedData = {
                        ...initialSiteData,
                        ...fetchedData,
                        // Deep merge for objects extended in v3.0
                        hero: { ...initialSiteData.hero, ...fetchedData.hero },
                        theme: { ...initialSiteData.theme, ...fetchedData.theme },
                        footer: { ...initialSiteData.footer, ...fetchedData.footer },
                        logos: { ...initialSiteData.logos, ...fetchedData.logos },
                        // Ensure arrays/new objects are picked up if missing
                        sectionOrder: currentSectionOrder,
                        gallery: fetchedData.gallery || initialSiteData.gallery,
                        survey: fetchedData.survey || initialSiteData.survey,
                    };

                    setSiteData(mergedData);
                } else {
                    console.log("⚠️ Firestore 연결 성공: 데이터가 없어 초기 데이터를 생성합니다.");
                    setDoc(docRef, initialSiteData);
                    setSiteData(initialSiteData);
                }
                setLoading(false);
            },
            (err) => {
                console.error('❌ Firestore 연결 실패:', err);
                setError(err.message);
                // 오류 시 로컬 데이터 사용
                setSiteData(initialSiteData);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    // 사이트 데이터 저장
    const saveSiteData = async (newData) => {
        try {
            const docRef = doc(db, 'siteData', 'main');
            await setDoc(docRef, newData);
            return { success: true };
        } catch (err) {
            console.error('Save error:', err);
            return { success: false, error: err.message };
        }
    };

    return { siteData, setSiteData, saveSiteData, loading, error };
}

// 가입 신청 관리 훅
export function useApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    // 신청 목록 조회 (관리자용)
    const fetchApplications = async () => {
        try {
            const q = query(collection(db, 'applications'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            const apps = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setApplications(apps);
            setLoading(false);
            return apps;
        } catch (err) {
            console.error('Fetch applications error:', err);
            setLoading(false);
            return [];
        }
    };

    // 새 신청 제출
    const submitApplication = async (applicationData) => {
        try {
            const docRef = await addDoc(collection(db, 'applications'), {
                ...applicationData,
                status: 'pending',
                createdAt: serverTimestamp()
            });
            return { success: true, id: docRef.id };
        } catch (err) {
            console.error('Submit application error:', err);
            return { success: false, error: err.message };
        }
    };

    // 신청 상태 업데이트 (관리자용)
    const updateApplicationStatus = async (id, status) => {
        try {
            const docRef = doc(db, 'applications', id);
            await updateDoc(docRef, { status, updatedAt: serverTimestamp() });
            await fetchApplications(); // 목록 갱신
            return { success: true };
        } catch (err) {
            console.error('Update application error:', err);
            return { success: false, error: err.message };
        }
    };

    // 신청 삭제 (관리자용)
    const deleteApplication = async (id) => {
        try {
            await deleteDoc(doc(db, 'applications', id));
            await fetchApplications(); // 목록 갱신
            return { success: true };
        } catch (err) {
            console.error('Delete application error:', err);
            return { success: false, error: err.message };
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    return {
        applications,
        loading,
        fetchApplications,
        submitApplication,
        updateApplicationStatus,
        deleteApplication
    };
}

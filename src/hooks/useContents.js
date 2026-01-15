'use client';

import { useState, useEffect } from 'react';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    orderBy,
    where,
    serverTimestamp,
    writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// 초기 8개 컨텐츠 데이터
const initialContents = [
    {
        slug: "club",
        title: "동호회",
        subtitle: "함께 성장하는 커뮤니티",
        description: "게임을 좋아하는 사람들이 모여 함께 성장하고 즐기는 동호회입니다. 실력보다는 매너와 즐거움을 우선시합니다.",
        order: 1,
        show: true,
        icon: "Users",
        color: "from-cyan-500 to-blue-600",
        heroImage: "",
        specialEffect: null,
        features: [
            { title: "소통", description: "활발한 커뮤니케이션과 친목 도모", icon: "MessageCircle" },
            { title: "성장", description: "함께 배우고 발전하는 환경", icon: "TrendingUp" },
            { title: "즐거움", description: "승패보다 중요한 건 함께하는 시간", icon: "Heart" }
        ],
        howToJoin: "입주 신청 페이지에서 신청하시면 검토 후 초대 링크를 보내드립니다.",
        schedule: "매주 주말 정기 활동",
        gallery: [],
        youtube: []
    },
    {
        slug: "open-match",
        title: "열린내전",
        subtitle: "누구나 참여 가능한 내전",
        description: "실력과 상관없이 누구나 참여할 수 있는 열린 내전입니다. 랭크가 아닌 즐거움을 위한 경기를 지향합니다.",
        order: 2,
        show: true,
        icon: "Gamepad2",
        color: "from-violet-500 to-purple-600",
        heroImage: "",
        specialEffect: null,
        features: [
            { title: "오픈 참가", description: "제한 없이 누구나 참여 가능", icon: "Users" },
            { title: "밸런스", description: "공정한 팀 밸런싱 시스템", icon: "Scale" },
            { title: "재미", description: "경쟁보다는 즐거움 우선", icon: "Sparkles" }
        ],
        howToJoin: "디스코드/오픈채팅방에서 내전 공지 확인 후 참가 신청",
        schedule: "주 2-3회, 저녁 9시",
        gallery: [],
        youtube: []
    },
    {
        slug: "lucid-soul",
        title: "루시드소울",
        subtitle: "진지한 경쟁 리그",
        description: "실력 향상과 진지한 경쟁을 원하는 분들을 위한 프리미엄 리그입니다.",
        order: 3,
        show: true,
        icon: "Trophy",
        color: "from-amber-500 to-orange-600",
        heroImage: "",
        specialEffect: "fire",
        features: [
            { title: "고수 매칭", description: "실력자들끼리의 치열한 경쟁", icon: "Target" },
            { title: "시즌제", description: "정기 시즌과 랭킹 시스템", icon: "Award" },
            { title: "보상", description: "시즌 종료 시 보상 제공", icon: "Gift" }
        ],
        howToJoin: "일정 실력 이상의 회원에게 초대 발송",
        schedule: "시즌별 운영 (3개월 단위)",
        gallery: [],
        youtube: []
    },
    {
        slug: "charity-polymarket",
        title: "자선 폴리마켓",
        subtitle: "재미있는 예측 게임",
        description: "다양한 이벤트와 경기 결과를 예측하고 포인트를 획득하는 재미있는 시스템입니다.",
        order: 4,
        show: true,
        icon: "DollarSign",
        color: "from-emerald-500 to-teal-600",
        heroImage: "",
        specialEffect: null,
        features: [
            { title: "예측 게임", description: "경기 결과 예측으로 포인트 획득", icon: "TrendingUp" },
            { title: "포인트", description: "포인트로 다양한 혜택 교환", icon: "Coins" },
            { title: "자선", description: "수익금 일부는 자선단체 기부", icon: "Heart" }
        ],
        howToJoin: "회원이라면 누구나 자동 참여 가능",
        schedule: "주요 이벤트/대회 진행 시",
        gallery: [],
        youtube: []
    },
    {
        slug: "battle-night",
        title: "내전의밤",
        subtitle: "매주 금요일 밤 대규모 내전",
        description: "매주 금요일 저녁, 모든 회원이 모여 즐기는 대규모 내전 이벤트입니다.",
        order: 5,
        show: true,
        icon: "Moon",
        color: "from-indigo-500 to-blue-600",
        heroImage: "",
        specialEffect: null,
        features: [
            { title: "대규모", description: "최대 50명 이상 동시 참여", icon: "Users" },
            { title: "토너먼트", description: "토너먼트 방식 진행", icon: "GitBranch" },
            { title: "경품", description: "우승팀 경품 제공", icon: "Gift" }
        ],
        howToJoin: "매주 목요일 참가 신청 공지",
        schedule: "매주 금요일 오후 9시",
        gallery: [],
        youtube: []
    },
    {
        slug: "peerless-league",
        title: "피어리스리그",
        subtitle: "최상위 티어 리그전",
        description: "마을 내 최고 실력자들만 참여하는 프리미엄 리그입니다.",
        order: 6,
        show: true,
        icon: "Crown",
        color: "from-rose-500 to-pink-600",
        heroImage: "",
        specialEffect: null,
        features: [
            { title: "엘리트", description: "상위 5% 실력자만 참여", icon: "Star" },
            { title: "방송", description: "주요 경기 스트리밍 송출", icon: "Tv" },
            { title: "명예", description: "명예의 전당 등재", icon: "Award" }
        ],
        howToJoin: "시즌별 선발전 통과 시 참여 가능",
        schedule: "월 1회 정기 리그",
        gallery: [],
        youtube: []
    },
    {
        slug: "sports-day",
        title: "대운동회",
        subtitle: "다양한 미니게임 축제",
        description: "게임 내 미니게임부터 보드게임까지, 다양한 경기를 즐기는 축제입니다.",
        order: 7,
        show: true,
        icon: "Flag",
        color: "from-yellow-500 to-amber-600",
        heroImage: "",
        specialEffect: null,
        features: [
            { title: "다양성", description: "10종 이상의 다양한 경기", icon: "Sparkles" },
            { title: "팀전", description: "팀별 종합 점수 경쟁", icon: "Users" },
            { title: "축제", description: "즐거운 축제 분위기", icon: "PartyPopper" }
        ],
        howToJoin: "분기별 개최 2주 전 팀 구성 공지",
        schedule: "분기별 1회 (3개월마다)",
        gallery: [],
        youtube: []
    },
    {
        slug: "ultimate-matchup",
        title: "울티메이트 메치업",
        subtitle: "연말 최종 챔피언십",
        description: "1년간의 모든 활동을 결산하는 최종 챔피언십 대회입니다.",
        order: 8,
        show: true,
        icon: "Zap",
        color: "from-fuchsia-500 to-purple-600",
        heroImage: "",
        specialEffect: null,
        features: [
            { title: "올스타", description: "각 리그 우승자 초청전", icon: "Star" },
            { title: "대회", description: "총상금 및 트로피 수여", icon: "Trophy" },
            { title: "시상식", description: "올해의 MVP 선정 및 시상", icon: "Award" }
        ],
        howToJoin: "연간 활동 포인트 상위권 자동 초대",
        schedule: "매년 12월 말",
        gallery: [],
        youtube: []
    }
];

// 컨텐츠 목록 조회 훅 (공개용 - show:true만)
export function useContents() {
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 인덱스 문제 방지를 위해 orderBy 제거 후 클라이언트 정렬
        const q = query(
            collection(db, 'contents'),
            where('show', '==', true)
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const contentsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                // 클라이언트 사이드 정렬
                contentsData.sort((a, b) => (a.order || 0) - (b.order || 0));
                setContents(contentsData);
                setLoading(false);
            },
            (err) => {
                console.error('컨텐츠 로드 실패:', err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { contents, loading, error };
}

// 모든 컨텐츠 조회 (관리자용)
export function useAllContents() {
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let timeoutId = setTimeout(() => {
            console.warn('Firestore 조회 타임아웃 - 빈 결과 반환');
            setLoading(false);
        }, 5000);

        // 인덱스 문제 방지를 위해 orderBy 제거 후 클라이언트 정렬
        const q = collection(db, 'contents');

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                clearTimeout(timeoutId);
                const contentsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                // 클라이언트 사이드 정렬
                contentsData.sort((a, b) => (a.order || 0) - (b.order || 0));
                setContents(contentsData);
                setLoading(false);
            },
            (error) => {
                clearTimeout(timeoutId);
                console.error('컨텐츠 조회 실패:', error);
                setContents([]);
                setLoading(false);
            }
        );

        return () => {
            clearTimeout(timeoutId);
            unsubscribe();
        };
    }, []);

    return { contents, loading };
}

// slug로 개별 컨텐츠 조회
export function useContentBySlug(slug) {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!slug) {
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'contents'),
            where('slug', '==', slug)
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                if (!snapshot.empty) {
                    const doc = snapshot.docs[0];
                    setContent({ id: doc.id, ...doc.data() });
                } else {
                    setContent(null);
                    setError('컨텐츠를 찾을 수 없습니다.');
                }
                setLoading(false);
            },
            (err) => {
                console.error('컨텐츠 로드 실패:', err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [slug]);

    return { content, loading, error };
}

// 관리자용 CRUD 함수들
export const contentActions = {
    // 초기 데이터 생성 (최초 1회만)
    async initializeContents() {
        try {
            const snapshot = await getDocs(collection(db, 'contents'));
            if (!snapshot.empty) {
                return { success: false, message: '이미 컨텐츠가 존재합니다.' };
            }

            const batch = writeBatch(db);
            initialContents.forEach((content) => {
                const docRef = doc(collection(db, 'contents'));
                batch.set(docRef, {
                    ...content,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
            });

            await batch.commit();
            return { success: true, message: '8개 컨텐츠 초기화 완료!' };
        } catch (err) {
            console.error('초기화 실패:', err);
            return { success: false, error: err.message };
        }
    },

    // 컨텐츠 추가
    async addContent(contentData) {
        try {
            const docRef = await addDoc(collection(db, 'contents'), {
                ...contentData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            return { success: true, id: docRef.id };
        } catch (err) {
            console.error('컨텐츠 추가 실패:', err);
            return { success: false, error: err.message };
        }
    },

    // 컨텐츠 수정
    async updateContent(id, contentData) {
        try {
            const docRef = doc(db, 'contents', id);
            await updateDoc(docRef, {
                ...contentData,
                updatedAt: serverTimestamp()
            });
            return { success: true };
        } catch (err) {
            console.error('컨텐츠 수정 실패:', err);
            return { success: false, error: err.message };
        }
    },

    // 컨텐츠 삭제
    async deleteContent(id) {
        try {
            await deleteDoc(doc(db, 'contents', id));
            return { success: true };
        } catch (err) {
            console.error('컨텐츠 삭제 실패:', err);
            return { success: false, error: err.message };
        }
    },

    // 순서 재정렬
    async reorderContents(contentsArray) {
        try {
            const batch = writeBatch(db);
            contentsArray.forEach((content, index) => {
                const docRef = doc(db, 'contents', content.id);
                batch.update(docRef, { order: index + 1 });
            });
            await batch.commit();
            return { success: true };
        } catch (err) {
            console.error('순서 변경 실패:', err);
            return { success: false, error: err.message };
        }
    }
};

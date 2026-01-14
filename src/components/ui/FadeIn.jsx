'use client';

import { useState, useEffect, useRef } from 'react';

// 스크롤 시 페이드인 애니메이션 컴포넌트
export default function FadeIn({ children, delay = 0, className = "" }) {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) setIsVisible(true);
            });
        }, { threshold: 0.1 });

        const current = domRef.current;
        if (current) observer.observe(current);

        return () => current && observer.unobserve(current);
    }, []);

    return (
        <div
            ref={domRef}
            className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                } ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

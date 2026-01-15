export default function FireEffect({ color = 'orange' }) {
    const isRed = color === 'red';
    // 색상 팔레트 결정
    const colors = isRed
        ? ['bg-red-500', 'bg-orange-600', 'bg-yellow-500', 'bg-red-600']
        : ['bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 'bg-red-500'];

    return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-3xl">
            {/* Base Glow */}
            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 ${isRed ? 'bg-red-900/30' : 'bg-orange-900/30'} blur-[60px] animate-pulse-slow`} />

            {/* Particles */}
            <div className={`absolute bottom-[-10%] left-[10%] w-24 h-24 ${colors[0]} rounded-full blur-[40px] opacity-40 animate-fire-flicker`} style={{ animationDelay: '0s' }} />
            <div className={`absolute bottom-[-20%] left-[40%] w-32 h-32 ${colors[1]} rounded-full blur-[50px] opacity-40 animate-fire-flicker`} style={{ animationDelay: '1s', animationDuration: '4s' }} />
            <div className={`absolute bottom-[-10%] right-[10%] w-24 h-24 ${colors[2]} rounded-full blur-[40px] opacity-40 animate-fire-flicker`} style={{ animationDelay: '0.5s', animationDuration: '2.5s' }} />

            {/* Rising Sparks (Tiny dots) */}
            <div className="absolute inset-0 opacity-50">
                <div className={`absolute top-[40%] left-[20%] w-1 h-1 ${colors[2]} rounded-full animate-float-fast`} />
                <div className={`absolute top-[60%] right-[30%] w-1.5 h-1.5 ${colors[3]} rounded-full animate-float`} />
                <div className={`absolute top-[30%] left-[60%] w-1 h-1 ${colors[0]} rounded-full animate-float-slow`} />
            </div>
        </div>
    );
}

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                hand: ['Gaegu', 'cursive'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            },
            animation: {
                'float-slow': 'floatSlow 12s ease-in-out infinite',
                'float-medium': 'floatMedium 8s ease-in-out infinite',
                'float-fast': 'floatFast 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'fire-flicker': 'fireFlicker 3s ease-in-out infinite alternate',
            },
            keyframes: {
                floatSlow: {
                    '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
                    '25%': { transform: 'translateY(-15px) rotate(3deg)' },
                    '50%': { transform: 'translateY(-8px) rotate(-2deg)' },
                    '75%': { transform: 'translateY(-20px) rotate(1deg)' },
                },
                fireFlicker: {
                    '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                    '50%': { opacity: 0.8, transform: 'scale(1.05) translateY(-2px)' },
                    '25%, 75%': { opacity: 0.9, transform: 'scale(0.98) translateY(2px)' },
                },
                floatMedium: {
                    '0%, 100%': { transform: 'translateY(0) translateX(0) rotate(0deg)' },
                    '33%': { transform: 'translateY(-12px) translateX(5px) rotate(-3deg)' },
                    '66%': { transform: 'translateY(-18px) translateX(-3px) rotate(2deg)' },
                },
                floatFast: {
                    '0%, 100%': { transform: 'translateY(0) scale(1)' },
                    '50%': { transform: 'translateY(-10px) scale(1.05)' },
                },
            },
        },
    },
    plugins: [],
};

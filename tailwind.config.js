/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brandRed: '#D32F2F',
                brandDark: '#121212',
            },
            animation: {
                'fade-in': 'fadeIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
                'zoom-in': 'zoomIn 1s cubic-bezier(0.175, 0.885, 0.32, 1.1) forwards',
                'slide-up': 'slideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'bounce-slight': 'bounceSlight 3s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                zoomIn: {
                    '0%': { opacity: '0', transform: 'scale(0.75)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(40px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                bounceSlight: {
                    '0%, 100%': { transform: 'translateY(-5%)' },
                    '50%': { transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [],
}

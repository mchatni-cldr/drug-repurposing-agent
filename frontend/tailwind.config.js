/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in forwards',
        flow: 'flow 3s ease-in-out infinite',
        'flow-down': 'flow-down 2s ease-in-out infinite',
        'flow-up': 'flow-up 2.5s ease-in-out infinite',
        'flow-right': 'flow-right 2.5s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInPlace: {  // NEW - no position shift
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        flow: {
          '0%': { transform: 'translateX(0) scaleX(1)', opacity: '1' },
          '50%': { transform: 'translateX(50%) scaleX(1.5)', opacity: '0.8' },
          '100%': { transform: 'translateX(100%) scaleX(1)', opacity: '0' },
        },
        'flow-down': {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(90px)', opacity: '0' },
        },
        'flow-up': {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-90px)', opacity: '0' },
        },
        'flow-right': {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(120px)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
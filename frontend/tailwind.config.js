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
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        flow: {
          '0%': { transform: 'translateX(0) scaleX(1)', opacity: '1' },
          '50%': { transform: 'translateX(50%) scaleX(1.5)', opacity: '0.8' },
          '100%': { transform: 'translateX(100%) scaleX(1)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
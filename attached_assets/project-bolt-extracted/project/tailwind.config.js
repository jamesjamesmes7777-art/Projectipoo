/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        navy: {
          950: '#020509',
          900: '#040d1a',
          800: '#071428',
          700: '#0a1c38',
          600: '#0d2448',
        },
        space: {
          black: '#000000',
          dark: '#0B0F19',
          mid: '#0d1526',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        gold: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.4s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'digit-roll': 'digitRoll 0.18s cubic-bezier(0.22, 1, 0.36, 1)',
        'laser-sweep': 'laserSweep 2.8s ease-in-out infinite',
        'row-flash': 'rowFlash 1.6s ease-out forwards',
        'beam-slide': 'beamSlide 0.55s ease-out forwards',
        'orbit-spin': 'orbitSpin 22s linear infinite',
        'orbit-spin-rev': 'orbitSpinRev 30s linear infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'float-up': 'floatUp 0.5s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(34, 211, 238, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(34, 211, 238, 0.6)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        digitRoll: {
          '0%': { transform: 'translateY(-55%)', opacity: '0' },
          '55%': { opacity: '1' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        laserSweep: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '15%': { opacity: '1' },
          '85%': { opacity: '1' },
          '100%': { transform: 'translateX(200%)', opacity: '0' },
        },
        rowFlash: {
          '0%': { outline: '1px solid rgba(34,211,238,0)', backgroundColor: 'transparent' },
          '20%': { outline: '1px solid rgba(34,211,238,0.7)', backgroundColor: 'rgba(34,211,238,0.07)' },
          '60%': { outline: '1px solid rgba(34,211,238,0.25)', backgroundColor: 'rgba(34,211,238,0.025)' },
          '100%': { outline: '1px solid rgba(34,211,238,0)', backgroundColor: 'transparent' },
        },
        beamSlide: {
          '0%': { transform: 'translateX(-150%) skewX(-18deg)', opacity: '0' },
          '20%': { opacity: '0.7' },
          '80%': { opacity: '0.7' },
          '100%': { transform: 'translateX(500%) skewX(-18deg)', opacity: '0' },
        },
        orbitSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        orbitSpinRev: {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-600px 0' },
          '100%': { backgroundPosition: '600px 0' },
        },
        floatUp: {
          '0%': { transform: 'translateY(6px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(34,211,238,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.03) 1px, transparent 1px)",
        'tech-grid': "linear-gradient(rgba(0,149,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(0,149,255,0.045) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

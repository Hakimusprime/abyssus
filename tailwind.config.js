/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cinzel', 'serif'],
      },
      colors: {
        abyss: {
          50:  '#f0f9fa',
          100: '#dbf0f2',
          200: '#b8e2e6',
          300: '#84cdd4',
          400: '#48b0ba',
          500: '#2d96a1',
          600: '#257a84',
          700: '#22626b',
          800: '#204f57',
          900: '#1d424a',
          950: '#0c2930',
        },
        gold: {
          50:  '#fdf9ed',
          100: '#faf0c8',
          200: '#f5e08e',
          300: '#ecca53',
          400: '#e0b62f',
          500: '#d4af37',
          600: '#b8861c',
          700: '#92641a',
          800: '#784f1d',
          900: '#65421e',
          950: '#3a230d',
        },
        bio: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-portal': 'pulsePortal 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.7s ease-out forwards',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
        'shimmer': 'shimmer 3s linear infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        pulsePortal: {
          '0%,100%': { opacity: '0.7' },
          '50%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        fadeUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { from: { opacity: '0', transform: 'scale(0.95)' }, to: { opacity: '1', transform: 'scale(1)' } },
        glowPulse: {
          '0%,100%': { boxShadow: '0 0 15px rgba(8,145,178,0.15)' },
          '50%': { boxShadow: '0 0 30px rgba(8,145,178,0.35)' },
        },
      },
    },
  },
  plugins: [],
};

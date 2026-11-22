/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#E8EBF3',
          100: '#C9D0E3',
          200: '#98A5C8',
          300: '#6779AC',
          400: '#364D8F',
          500: '#17294D',
          600: '#101D3A',
          700: '#0C172E',
          800: '#091123',
          900: '#060B17',
        },
        orange: {
          50: '#FFF1E5',
          100: '#FFE0C2',
          200: '#FFC580',
          300: '#FDA94D',
          400: '#FB8E22',
          500: '#F47B20',
          600: '#D96414',
          700: '#B14E0F',
          800: '#7A370A',
          900: '#4D2206',
        },
        canvas: '#F5F7FA',
        card: '#FFFFFF',
        ink: '#172033',
        muted: '#687386',
        line: '#E5E9F0',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '10px',
        '2xl': '14px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(16,29,58,0.06), 0 1px 2px rgba(16,29,58,0.04)',
        soft: '0 4px 16px rgba(16,29,58,0.06)',
        lift: '0 12px 32px rgba(16,29,58,0.12)',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'slide-up': { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'scale-in': { from: { opacity: '0', transform: 'scale(0.96)' }, to: { opacity: '1', transform: 'scale(1)' } },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        'scale-in': 'scale-in 0.25s ease-out',
      },
    },
  },
  plugins: [],
};

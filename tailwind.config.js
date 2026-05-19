/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        primary: {
          50:  '#f0f4ff',
          100: '#e0eaff',
          200: '#c7d7fd',
          300: '#a5bcfb',
          400: '#8098f7',
          500: '#6172f0',
          600: '#4f52e5',
          700: '#3f3ec9',
          800: '#3434a3',
          900: '#2f3182',
        },
        accent: {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea6c0a',
        },
        // Dark mode surfaces
        dark: {
          900: '#0a0a0f',
          800: '#0f0f1a',
          700: '#16162a',
          600: '#1e1e3a',
          500: '#252547',
        },
        // Light mode surfaces
        light: {
          50:  '#ffffff',
          100: '#f8f9fe',
          200: '#f0f2fd',
          300: '#e4e8fa',
          400: '#d4d9f5',
          500: '#c2c9ef',
        },
      },
      animation: {
        'float':       'float 6s ease-in-out infinite',
        'fade-up':     'fadeUp 0.7s ease forwards',
        'fade-in':     'fadeIn 0.5s ease forwards',
        'pulse-slow':  'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient':    'gradientShift 8s ease infinite',
        'spin-slow':   'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        fadeUp: {
          '0%':   { opacity: 0, transform: 'translateY(30px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: 0 },
          '100%': { opacity: 1 },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}

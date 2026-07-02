/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        navy: '#1e293b',
        navy2: '#334155',
        ind: '#4f46e5',
        amb: '#d97706',
        tel: '#0d9488',
        cor: '#dc2626',
        pur: '#7c3aed',
        grn: '#16a34a',
        bg: '#f0f4f8',
        surf: '#ffffff',
        surf2: '#f8fafc',
        bdr: '#e2e8f0',
        bdr2: '#cbd5e1',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
      },
    },
  },
  plugins: [],
}

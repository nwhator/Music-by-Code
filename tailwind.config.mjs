/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: {
          light: '#2563eb', // blue-600
          DEFAULT: '#3b82f6', // blue-500
          dark: '#60a5fa', // blue-400
        },
      },
    },
  },
  plugins: [],
}

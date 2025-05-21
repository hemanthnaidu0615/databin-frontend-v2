import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'], // ✅ allows font-outfit
        sans: ['Outfit', 'sans-serif'],   // ✅ makes Outfit the default font-sans
      },
    },
  },
};

export default config;

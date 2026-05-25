/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cafe: {
          50: '#fafaf9',   // Warm Cream
          100: '#f5f5f4',  // Light Latte
          200: '#e7e5e4',  // Warm Stone
          300: '#d6d3d1',  // Muted Clay
          400: '#a8a29e',  // Slate Clay
          500: '#78716c',  // Roasted Shell
          600: '#57534e',  // Warm Bark
          700: '#44403c',  // Espresso Shell
          800: '#292524',  // Dark Roast
          900: '#1c1917',  // Deep Espresso
          950: '#0c0a09',  // Pitch Black Coffee
        },
        amber: {
          50: '#fdfbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',  // Sweet Caramel
          800: '#92400e',  // Rich Syrup
          900: '#78350f',  // Deep Amber
          950: '#451a03',  // Dark Caramel
        }
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

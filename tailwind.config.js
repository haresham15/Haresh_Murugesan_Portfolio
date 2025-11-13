// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Space Grotesk', 'monospace'],
        inter: ['Inter', 'sans-serif'],
        raleway: ['Raleway', 'sans-serif'],
      },
      colors: {
        'charcoal': '#050505',
        'light-gray': '#E0E0E0',
        'glass-border': 'rgba(255, 255, 255, 0.1)',
        'glass-bg': 'rgba(255, 255, 255, 0.05)',
        'neon-purple': '#9333ea',
        'neon-cyan': '#22d3ee',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

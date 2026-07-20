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
        sans: ['"HomepageBaukasten"', '"Homepage Baukasten"', 'sans-serif'],
        inter: ['"HomepageBaukasten"', '"Homepage Baukasten"', 'sans-serif'],
        outfit: ['"HomepageBaukasten"', '"Homepage Baukasten"', 'sans-serif'],
        raleway: ['"HomepageBaukasten"', '"Homepage Baukasten"', 'sans-serif'],
      },
      colors: {
        'charcoal': '#050505',
        'light-gray': '#E0E0E0',
        'glass-border': 'rgba(255, 255, 255, 0.1)',
        'glass-bg': 'rgba(255, 255, 255, 0.05)',
        'cine-lavender': '#d8b4fe',
        'cine-teal': '#7dd3fc',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'cine-glow-lavender': '0 0 30px -5px rgba(216, 180, 254, 0.4), 0 0 15px -5px rgba(216, 180, 254, 0.3)',
        'cine-glow-teal': '0 0 30px -5px rgba(125, 211, 252, 0.4), 0 0 15px -5px rgba(125, 211, 252, 0.3)',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.8', filter: 'brightness(1)' },
          '50%': { opacity: '1', filter: 'brightness(1.2)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

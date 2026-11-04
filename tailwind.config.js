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
        serif: ['"Geist Serif"', '"Newsreader"', '"Fraunces"', 'Georgia', 'serif'],
        editorial: ['"Geist Serif"', '"Newsreader"', '"Fraunces"', 'Georgia', 'serif'],
        heading: ['"Geist Serif"', '"Newsreader"', '"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Geist"', '"IBM Plex Sans"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"Geist Mono"', '"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        // Master 85 / 12 / 3 Color Palette
        canvas: '#07090D', // Deep Obsidian
        surface: '#102038', // Midnight Chassis Blue
        raised: '#162B4C', // Prussian Slate
        prussian: '#132440',
        'cobalt-slate': '#162B4C',
        'deep-blue': '#102038',
        'chassis-blue': '#102038',
        'prussian-slate': '#162B4C',
        'indigo-crimson': '#1E1633',
        'crimson-trough': '#5C191B',
        
        // 3-Stop Self-Illuminated Orange
        'thermal-halo': '#C8321E', // Outer Thermal Halo
        'slipstream-orange': '#FF6B2B', // Core Body
        'specular-crest': '#FFB86C', // Hot Crest
        'hot-core': '#FFE9AE', // Hot Specular Pinpoint
        accent: '#FF6B2B',
        amber: '#FF6B2B',
        gold: '#FFB86C',
        
        // Atmospheric blues & ivories
        prism: '#4C8DFF',
        'prism-light': '#70A5FF',
        ivory: '#F4EFE6',
        'text-primary': '#F4EFE6',
        'text-secondary': '#9BA8B8',
        'text-muted': '#6F7E91',

        // Token mappings & backward compatibility
        'brand-blue': '#4C8DFF',
        'link-blue': '#70A5FF',
        'brand-orange': '#FF6B2B',
        'page-base': '#07090D',
        'charcoal': '#07090D',
        'surface-raised': '#162B4C',
        'surface-subtle': '#102038',
        'primary-ink': '#F4EFE6',
        'muted-ink': '#6F7E91',
        'light-gray': '#F4EFE6',
        'glass-border': 'rgba(244, 239, 230, 0.08)',
        'glass-bg': 'rgba(16, 32, 56, 0.85)',

        'signal-emerald': '#4CC38A',
        'signal-rose': '#E5484D',
      },
      maxWidth: {
        'content': '1240px',
        'editorial': '1240px',
      },
      borderRadius: {
        DEFAULT: '6px',
        sm: '4px',
        md: '8px',
        lg: '10px',
        xl: '12px',
        '2xl': '16px',
        '3xl': '24px',
        full: '9999px',
      },
    },
  },
  plugins: [],
};

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
        raleway: ['"Raleway"', 'sans-serif'],
        serif: ['"Geist Serif"', '"Newsreader"', '"Fraunces"', 'Georgia', 'serif'],
        editorial: ['"Geist Serif"', '"Newsreader"', '"Fraunces"', 'Georgia', 'serif'],
        heading: ['"Raleway"', '"Geist Serif"', '"Newsreader"', '"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Geist"', '"IBM Plex Sans"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"Geist Mono"', '"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        // Master Editorial V2 Color Palette
        'deep-bg': '#070B12',
        'navy-surface': '#101B30',
        'elevated-surface': '#17243A',
        'editorial-ivory': '#F3EFE7',
        'editorial-muted': '#A7B2C3',
        'accent-orange': '#FF6B35',
        'warm-highlight': '#F5D998',
        'technical-blue': '#82B7FF',

        // Master 85 / 12 / 3 Color Palette & Backward Compatibility
        canvas: '#070B12', // Deep Obsidian
        surface: '#101B30', // Midnight Chassis Blue
        raised: '#17243A', // Prussian Slate
        prussian: '#132440',
        'cobalt-slate': '#162B4C',
        'deep-blue': '#101B30',
        'chassis-blue': '#101B30',
        'prussian-slate': '#17243A',
        'indigo-crimson': '#1E1633',
        'crimson-trough': '#5C191B',
        
        // 3-Stop Self-Illuminated Orange
        'thermal-halo': '#C8321E', // Outer Thermal Halo
        'slipstream-orange': '#FF6B35', // Core Body
        'specular-crest': '#FFB86C', // Hot Crest
        'hot-core': '#FFE9AE', // Hot Specular Pinpoint
        accent: '#FF6B35',
        amber: '#FF6B35',
        gold: '#F5D998',
        
        // Atmospheric blues & ivories
        prism: '#82B7FF',
        'prism-light': '#82B7FF',
        ivory: '#F3EFE7',
        'text-primary': '#F3EFE7',
        'text-secondary': '#A7B2C3',
        'text-muted': '#7A889B',

        // Token mappings & backward compatibility
        'brand-blue': '#82B7FF',
        'link-blue': '#82B7FF',
        'brand-orange': '#FF6B35',
        'page-base': '#070B12',
        'charcoal': '#070B12',
        'surface-raised': '#17243A',
        'surface-subtle': '#101B30',
        'primary-ink': '#F3EFE7',
        'muted-ink': '#A7B2C3',
        'light-gray': '#F3EFE7',
        'glass-border': 'rgba(243, 239, 231, 0.08)',
        'glass-bg': 'rgba(16, 27, 48, 0.85)',

        'signal-emerald': '#4CC38A',
        'signal-rose': '#E5484D',
      },
      spacing: {
        'space-1': '8px',
        'space-2': '16px',
        'space-3': '24px',
        'space-4': '32px',
        'space-5': '48px',
        'space-6': '64px',
        'space-7': '96px',
        'space-8': '128px',
        'space-9': '160px',
        'space-10': '192px',
      },
      maxWidth: {
        'wide': '1520px',
        'editorial': '1280px',
        'reading': '760px',
        'content': '1280px',
      },
      borderRadius: {
        DEFAULT: '2px',
        sm: '2px',
        md: '2px',
        lg: '2px',
        xl: '2px',
        '2xl': '2px',
        '3xl': '2px',
        full: '9999px',
      },
    },
  },
  plugins: [],
};

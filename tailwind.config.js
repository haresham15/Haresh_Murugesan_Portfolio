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
        // V4.0 Forged Carbon & Motorsport Color Palette
        'bg-midnight': '#03050A',
        'bg-obsidian': '#060A12',
        'cobalt-deep': '#0B1E40',
        'cobalt-mid': '#153875',
        'cobalt-bright': '#2563EB',
        'accent-red-orange': '#FF2800',
        'accent-crimson-glow': '#FF4419',
        'metal-silver': '#C8D2E0',
        'metal-chrome': '#E6ECF5',
        'metal-titanium': '#7E8B9B',
        'text-alabaster': '#F4F6F9',

        // Master Editorial V2 Color Palette
        'deep-bg': '#03050A',
        'navy-surface': '#060A12',
        'elevated-surface': '#0B1E40',
        'editorial-ivory': '#F4F6F9',
        'editorial-muted': '#C8D2E0',
        'accent-orange': '#FF2800',
        'warm-highlight': '#C8D2E0',
        'technical-blue': '#153875',

        // Master 85 / 12 / 3 Color Palette & Backward Compatibility
        canvas: '#03050A',
        surface: '#060A12',
        raised: '#0B1E40',
        prussian: '#0B1E40',
        'cobalt-slate': '#0B1E40',
        'deep-blue': '#060A12',
        'chassis-blue': '#060A12',
        'prussian-slate': '#0B1E40',
        'indigo-crimson': '#1E1633',
        'crimson-trough': '#5C191B',
        
        // 3-Stop Self-Illuminated Red-Orange
        'thermal-halo': '#FF4419',
        'slipstream-orange': '#FF2800',
        'specular-crest': '#FF2800',
        'hot-core': '#E6ECF5',
        accent: '#FF2800',
        amber: '#FF2800',
        gold: '#C8D2E0',
        
        // Atmospheric blues & ivories
        prism: '#2563EB',
        'prism-light': '#153875',
        ivory: '#F4F6F9',
        'text-primary': '#F4F6F9',
        'text-secondary': '#C8D2E0',
        'text-muted': '#7E8B9B',

        // Token mappings & backward compatibility
        'brand-blue': '#153875',
        'link-blue': '#2563EB',
        'brand-orange': '#FF2800',
        'page-base': '#03050A',
        'charcoal': '#03050A',
        'surface-raised': '#0B1E40',
        'surface-subtle': '#060A12',
        'primary-ink': '#F4F6F9',
        'muted-ink': '#C8D2E0',
        'light-gray': '#F4F6F9',
        'glass-border': 'rgba(200, 210, 224, 0.10)',
        'glass-bg': 'rgba(6, 10, 18, 0.85)',

        'signal-emerald': '#4CC38A',
        'signal-rose': '#FF2800',
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

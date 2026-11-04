/**
 * Design Token System for hareshmurugesan.com (Version 2.0 PRD Architecture)
 * Ground Truth: DTCG Three-Tier Token Architecture (design/tokens.json)
 * Palette: Canvas #07090D | Surface #0E1623 | Deep Blue #102C4C | Blue #4C8DFF | Link Blue #80B5FF | Orange #FF7A32
 */

export const tokens = {
  colors: {
    canvas: '#07090D',
    surface: '#0E1623',
    deepBlue: '#102C4C',
    blue: '#4C8DFF',
    linkBlue: '#80B5FF',
    orange: '#FF7A32',
    primaryText: '#F1EFE9',
    secondaryText: '#A6B0BE',
    borderSubtle: 'rgba(166, 176, 190, 0.12)',
    borderCrisp: 'rgba(76, 141, 255, 0.25)',
    borderOrange: 'rgba(255, 122, 50, 0.5)',
    // Backward compatibility mappings
    base: '#07090D',
    surfaceRaised: '#102C4C',
    surfaceSubtle: '#0E1623',
    primaryInk: '#F1EFE9',
    mutedInk: '#A6B0BE',
    subtleInk: '#6B7280',
    signalBlue: '#4C8DFF',
    signalTeal: '#4C8DFF',
    signalOrange: '#FF7A32',
  },
  typography: {
    heading: '"Bricolage Grotesque", -apple-system, sans-serif',
    sans: '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
    heroDisplay: 'clamp(2.5rem, 5.5vw, 5.5rem)',
  },
  grid: {
    maxWidth: '1280px',
    desktopColumns: 12,
    tabletColumns: 8,
    mobileColumns: 4,
    desktopGutter: '24px',
    tabletGutter: '20px',
    mobileGutter: '16px',
    readingMeasure: '65ch',
  },
  radius: {
    sm: '4px',
    md: '12px',
    lg: '20px',
  },
  motion: {
    physicsSpring: { stiffness: 350, damping: 28 },
    tweenFast: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
    tweenNormal: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
    tweenSlow: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
} as const;

export type DesignTokens = typeof tokens;

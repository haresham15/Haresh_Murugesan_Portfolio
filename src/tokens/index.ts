/**
 * Design Token System for hareshmurugesan.com (Version 4.0 Forged Carbon & Motorsport Specification)
 * Ground Truth: DTCG Three-Tier Token Architecture (design/tokens.json)
 * Palette: Midnight Obsidian #03050A | Surface #060A12 | Cobalt Deep #0B1E40 | Alabaster #F4F6F9 | Accent Red-Orange #FF2800
 */

export const tokens = {
  colors: {
    canvas: '#03050A',
    surface: '#060A12',
    deepBlue: '#0B1E40',
    elevatedSurface: '#0B1E40',
    deepBg: '#03050A',
    blue: '#2563EB',
    linkBlue: '#2563EB',
    orange: '#FF2800',
    accentOrange: '#FF2800',
    warmHighlight: '#C8D2E0',
    technicalBlue: '#153875',
    primaryText: '#F4F6F9',
    secondaryText: '#C8D2E0',
    textMuted: '#7E8B9B',
    borderSubtle: 'rgba(200, 210, 224, 0.10)',
    borderCrisp: 'rgba(37, 99, 235, 0.35)',
    borderOrange: 'rgba(255, 40, 0, 0.5)',
    // Backward compatibility mappings
    base: '#03050A',
    surfaceRaised: '#0B1E40',
    surfaceSubtle: '#060A12',
    primaryInk: '#F4F6F9',
    mutedInk: '#C8D2E0',
    subtleInk: '#7E8B9B',
    signalBlue: '#2563EB',
    signalTeal: '#4CC38A',
    signalOrange: '#FF2800',
  },
  typography: {
    raleway: '"Raleway", sans-serif',
    serif: '"Geist Serif", "Newsreader", "Fraunces", Georgia, serif',
    heading: '"Raleway", "Geist Serif", "Newsreader", "Fraunces", Georgia, serif',
    sans: '"Geist", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"Geist Mono", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
    heroDisplay: 'clamp(3rem, 7vw, 7.5rem)',
  },
  spacing: {
    space1: '8px',
    space2: '16px',
    space3: '24px',
    space4: '32px',
    space5: '48px',
    space6: '64px',
    space7: '96px',
    space8: '128px',
    space9: '160px',
    space10: '192px',
  },
  containers: {
    wide: '1520px',
    editorial: '1280px',
    reading: '760px',
    readingMeasure: '65ch',
  },
  radius: {
    none: '0px',
    sm: '2px',
    md: '2px',
    lg: '2px',
  },
  motion: {
    physicsSpring: { stiffness: 350, damping: 28 },
    tweenFast: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
    tweenNormal: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
    tweenSlow: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
} as const;

export type DesignTokens = typeof tokens;

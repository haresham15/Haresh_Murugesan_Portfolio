/**
 * Design Token System for hareshmurugesan.com (Version 2.0 Architectural & Editorial Refinement)
 * Ground Truth: DTCG Three-Tier Token Architecture (design/tokens.json)
 * Palette: Deep BG #070B12 | Navy Surface #101B30 | Elevated Surface #17243A | Ivory #F3EFE7 | Accent Orange #FF6B35
 */

export const tokens = {
  colors: {
    canvas: '#070B12',
    surface: '#101B30',
    deepBlue: '#101B30',
    elevatedSurface: '#17243A',
    deepBg: '#070B12',
    blue: '#82B7FF',
    linkBlue: '#82B7FF',
    orange: '#FF6B35',
    accentOrange: '#FF6B35',
    warmHighlight: '#F5D998',
    technicalBlue: '#82B7FF',
    primaryText: '#F3EFE7',
    secondaryText: '#A7B2C3',
    textMuted: '#7A889B',
    borderSubtle: 'rgba(243, 239, 231, 0.08)',
    borderCrisp: 'rgba(130, 183, 255, 0.25)',
    borderOrange: 'rgba(255, 107, 53, 0.5)',
    // Backward compatibility mappings
    base: '#070B12',
    surfaceRaised: '#17243A',
    surfaceSubtle: '#101B30',
    primaryInk: '#F3EFE7',
    mutedInk: '#A7B2C3',
    subtleInk: '#7A889B',
    signalBlue: '#82B7FF',
    signalTeal: '#4CC38A',
    signalOrange: '#FF6B35',
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

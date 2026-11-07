import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { CarbonTextureOverlay, CarbonTextureType } from './ui/CarbonTextureOverlay';

export type ChromaticTheme =
  | 'obsidian'
  | 'alabaster'
  | 'telemetry-slate'
  | 'gallery-bone'
  | 'studio-midnight'
  | 'titanium-ivory';

export interface ThemeColors {
  bg: string;
  text: string;
  muted: string;
  accent: string;
  accentSecondary?: string;
  border: string;
  isLight: boolean;
  defaultCarbon: CarbonTextureType;
}

export const THEME_PALETTES: Record<ChromaticTheme, ThemeColors> = {
  obsidian: {
    bg: '#060608',
    text: '#F5F3EF',
    muted: '#8E8D94',
    accent: '#E85D04',
    accentSecondary: '#F4A261',
    border: 'rgba(245, 243, 239, 0.08)',
    isLight: false,
    defaultCarbon: 'forged',
  },
  alabaster: {
    bg: '#F4F1EA',
    text: '#0B0B0E',
    muted: '#525156',
    accent: '#C83E2B',
    accentSecondary: '#E85D04',
    border: 'rgba(11, 11, 14, 0.10)',
    isLight: true,
    defaultCarbon: 'light-composite',
  },
  'telemetry-slate': {
    bg: '#090C10',
    text: '#F1F5F9',
    muted: '#64748B',
    accent: '#10B981',
    accentSecondary: '#E11D48',
    border: 'rgba(241, 245, 249, 0.08)',
    isLight: false,
    defaultCarbon: 'hybrid',
  },
  'gallery-bone': {
    bg: '#F7F6F2',
    text: '#09090B',
    muted: '#4B4D54',
    accent: '#FF5A1F',
    accentSecondary: '#3B82F6',
    border: 'rgba(9, 9, 11, 0.09)',
    isLight: true,
    defaultCarbon: 'light-composite',
  },
  'studio-midnight': {
    bg: '#05070E',
    text: '#F8FAFC',
    muted: '#738A9C',
    accent: '#38BDF8',
    accentSecondary: '#F59E0B',
    border: 'rgba(248, 250, 252, 0.08)',
    isLight: false,
    defaultCarbon: 'forged',
  },
  'titanium-ivory': {
    bg: '#ECE9E1',
    text: '#0D0D11',
    muted: '#575760',
    accent: '#B45309',
    accentSecondary: '#D97706',
    border: 'rgba(13, 13, 17, 0.10)',
    isLight: true,
    defaultCarbon: 'light-composite',
  },
};

interface ThemeContextType {
  activeTheme: ChromaticTheme;
  setActiveTheme: (theme: ChromaticTheme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  activeTheme: 'obsidian',
  setActiveTheme: () => {},
});

export const useActiveTheme = () => useContext(ThemeContext);

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ChromaticThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [activeTheme, setActiveTheme] = useState<ChromaticTheme>('obsidian');

  return (
    <ThemeContext.Provider value={{ activeTheme, setActiveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export interface ThemeSectionProps extends React.HTMLAttributes<HTMLElement> {
  id: string;
  theme: ChromaticTheme;
  children: React.ReactNode;
  className?: string;
  minHeight?: string;
  pyPadding?: string;
  forceDark?: boolean;
  carbonType?: CarbonTextureType;
  carbonOpacity?: number;
}

export const ThemeSection: React.FC<ThemeSectionProps> = ({
  id,
  theme,
  children,
  className = '',
  minHeight = 'min-h-[110dvh] sm:min-h-[115dvh]',
  pyPadding = 'py-[14vh] sm:py-[16vh] lg:py-[18vh]',
  forceDark = false,
  carbonType,
  carbonOpacity,
  ...rest
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, {
    amount: 0.25,
    margin: '-10% 0px -10% 0px',
  });
  const { setActiveTheme } = useActiveTheme();

  const palette = forceDark ? THEME_PALETTES['obsidian'] : THEME_PALETTES[theme];
  const effectiveCarbon = carbonType || palette.defaultCarbon;
  const effectiveOpacity = carbonOpacity !== undefined ? carbonOpacity : palette.isLight ? 0.16 : 0.22;

  useEffect(() => {
    if (isInView) {
      setActiveTheme(theme);
    }
  }, [isInView, theme, setActiveTheme]);

  return (
    <section
      id={id}
      ref={sectionRef}
      style={{
        backgroundColor: palette.bg,
        color: palette.text,
        borderColor: palette.border,
        ['--theme-bg' as any]: palette.bg,
        ['--theme-text' as any]: palette.text,
        ['--theme-muted' as any]: palette.muted,
        ['--theme-accent' as any]: palette.accent,
        ['--theme-accent-sec' as any]: palette.accentSecondary || palette.accent,
        ['--theme-border' as any]: palette.border,
        transition: 'background-color 0.65s cubic-bezier(0.16, 1, 0.3, 1), color 0.45s ease, border-color 0.45s ease',
      }}
      className={`w-screen max-w-none relative overflow-x-hidden ${minHeight} ${pyPadding} px-[4vw] md:px-[6vw] xl:px-[7vw] ${
        palette.isLight ? 'theme-light' : 'theme-dark'
      } ${className}`}
      {...rest}
    >
      {/* Contrasting Tactile Carbon Fiber & Forged Composite Texture Overlay */}
      <CarbonTextureOverlay
        type={effectiveCarbon}
        opacity={effectiveOpacity}
        tint={!palette.isLight ? palette.accent : undefined}
      />

      {/* Content Layer */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {children}
      </div>
    </section>
  );
};

export default ThemeSection;

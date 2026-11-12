import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useMotionPreference } from './MotionPreference';

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
}

export const THEME_PALETTES: Record<ChromaticTheme, ThemeColors> = {
  obsidian: {
    bg: 'transparent',
    text: '#F4F6F9',
    muted: '#7E8B9B',
    accent: '#FF2800',
    accentSecondary: '#FF4419',
    border: 'rgba(200, 210, 224, 0.08)',
    isLight: false,
  },
  alabaster: {
    bg: 'transparent',
    text: '#F4F6F9',
    muted: '#C8D2E0',
    accent: '#FF2800',
    accentSecondary: '#FF4419',
    border: 'rgba(200, 210, 224, 0.08)',
    isLight: false,
  },
  'telemetry-slate': {
    bg: 'transparent',
    text: '#F4F6F9',
    muted: '#7E8B9B',
    accent: '#18458B',
    accentSecondary: '#FF2800',
    border: 'rgba(200, 210, 224, 0.08)',
    isLight: false,
  },
  'gallery-bone': {
    bg: 'transparent',
    text: '#F4F6F9',
    muted: '#C8D2E0',
    accent: '#FF2800',
    accentSecondary: '#18458B',
    border: 'rgba(200, 210, 224, 0.08)',
    isLight: false,
  },
  'studio-midnight': {
    bg: 'transparent',
    text: '#F4F6F9',
    muted: '#7E8B9B',
    accent: '#18458B',
    accentSecondary: '#FF2800',
    border: 'rgba(200, 210, 224, 0.08)',
    isLight: false,
  },
  'titanium-ivory': {
    bg: 'transparent',
    text: '#F4F6F9',
    muted: '#C8D2E0',
    accent: '#FF2800',
    accentSecondary: '#C8D2E0',
    border: 'rgba(200, 210, 224, 0.08)',
    isLight: false,
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
  theme?: ChromaticTheme;
  children: React.ReactNode;
  className?: string;
  minHeight?: string;
  pyPadding?: string;
  forceDark?: boolean;
  carbonType?: any;
  carbonOpacity?: number;
}

export const ThemeSection: React.FC<ThemeSectionProps> = ({
  id,
  theme = 'obsidian',
  children,
  className = '',
  minHeight = '',
  pyPadding = '',
  forceDark = false,
  // Legacy styling props; consumed here so they never reach the <section> DOM node.
  carbonType: _carbonType,
  carbonOpacity: _carbonOpacity,
  ...rest
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, {
    amount: 0.25,
    margin: '-10% 0px -10% 0px',
  });
  const { setActiveTheme } = useActiveTheme();

  const palette = THEME_PALETTES[theme] || THEME_PALETTES['obsidian'];

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
        backgroundColor: 'transparent',
        color: palette.text,
        ['--theme-bg' as any]: palette.bg,
        ['--theme-text' as any]: palette.text,
        ['--theme-muted' as any]: palette.muted,
        ['--theme-accent' as any]: palette.accent,
        ['--theme-accent-sec' as any]: palette.accentSecondary || palette.accent,
        ['--theme-border' as any]: palette.border,
      }}
      className={`w-full relative overflow-x-hidden ${minHeight} ${pyPadding} ${className}`}
      {...rest}
    >
      {/* Content Layer floating on open Forged Carbon background with standard responsive padding */}
      <div className="relative z-10 w-full h-full flex flex-col max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
};

/**
 * Scroll reveal shared by the lower home sections: fires once via IntersectionObserver
 * (framer-motion whileInView) and settles on a critically damped spring.
 */
export const REVEAL_SPRING = { type: 'spring' as const, stiffness: 120, damping: 22, mass: 0.9 };

export interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: 'div' | 'li' | 'article';
}

export const Reveal: React.FC<RevealProps> = ({ children, className, delay = 0, y = 28, as = 'div' }) => {
  const { isReduced } = useMotionPreference();
  const Tag = (as === 'li' ? motion.li : as === 'article' ? motion.article : motion.div) as typeof motion.div;
  if (isReduced) {
    return <Tag className={className}>{children}</Tag>;
  }
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ ...REVEAL_SPRING, delay }}
    >
      {children}
    </Tag>
  );
};

export default ThemeSection;

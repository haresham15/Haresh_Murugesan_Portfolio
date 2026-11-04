import React from 'react';

export interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  as?: React.ElementType;
}

export interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export interface MagnetButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  padding?: number;
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
}

export interface StarBorderButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  filamentColor?: string;
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
}

export interface ClickSparkProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  sparkColor?: string;
  sparkCount?: number;
  sparkLength?: number;
  sparkDistance?: number;
  className?: string;
}

export interface SlideTextLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  href?: string;
  className?: string;
  onClick?: (e?: any) => void;
}

export interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  borderColor?: string;
}

export interface TiltedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}

export interface InteractivePillGroupProps {
  items: Array<{ id?: string; key?: string; label: string }>;
  activeItem?: string;
  activeKey?: string;
  onSelect?: (id: string) => void;
  onChange?: (key: string) => void;
  size?: 'sm' | 'md';
  layoutId?: string;
  className?: string;
}

export interface AnimatedDockProps {
  sections: Array<{ id: string; label: string; number: string }>;
  activeSection: string;
  onSectionClick: (id: string) => void;
}

export const BlurText: React.FC<BlurTextProps>;
export const ScrollReveal: React.FC<ScrollRevealProps>;
export const MagnetButton: React.FC<MagnetButtonProps>;
export const StarBorderButton: React.FC<StarBorderButtonProps>;
export const ClickSpark: React.FC<ClickSparkProps>;
export const SlideTextLink: React.FC<SlideTextLinkProps>;
export const CountUp: React.FC<CountUpProps>;
export const SpotlightCard: React.FC<SpotlightCardProps>;
export const TiltedCard: React.FC<TiltedCardProps>;
export const InteractivePillGroup: React.FC<InteractivePillGroupProps>;
export const AnimatedDock: React.FC<AnimatedDockProps>;

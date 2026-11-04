import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

const MotionSpan = motion.span as any;

export interface ScrollRevealProps {
  children?: React.ReactNode;
  text?: string;
  className?: string;
  baseOpacity?: number;
  enableBlur?: boolean;
  baseRotation?: number;
  blurStrength?: number;
  wordAnimationEnd?: number;
}

interface WordProps {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  enableBlur: boolean;
  baseOpacity: number;
}

const Word: React.FC<WordProps> = ({ children, progress, range, enableBlur, baseOpacity }) => {
  const opacity = useTransform(progress, range, [baseOpacity, 1]);
  const blur = useTransform(progress, range, [enableBlur ? 4 : 0, 0]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);

  return (
    <span className="inline-block relative mr-[0.28em] my-[0.08em]">
      <MotionSpan
        style={{ opacity, filter }}
        className="inline-block will-change-transform will-change-filter"
      >
        {children}
      </MotionSpan>
    </span>
  );
};

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  text,
  children,
  className = '',
  baseOpacity = 0.2,
  enableBlur = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 85%', 'end 45%'],
  });

  const content = text || (typeof children === 'string' ? children : '');
  const words = content.split(' ').filter(Boolean);

  if (words.length === 0) {
    return <div ref={containerRef} style={{ position: 'relative' }} className={`relative ${className}`}>{children}</div>;
  }

  return (
    <div ref={containerRef} style={{ position: 'relative' }} className={`relative flex flex-wrap ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = Math.min(1, start + 1 / words.length);
        return (
          <Word
            key={i}
            progress={scrollYProgress}
            range={[start, end]}
            enableBlur={enableBlur}
            baseOpacity={baseOpacity}
          >
            {word}
          </Word>
        );
      })}
    </div>
  );
};

export default ScrollReveal;

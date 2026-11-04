import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const MotionSpan = motion.span as any;

export interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  threshold?: number;
  rootMargin?: string;
}

export const BlurText: React.FC<BlurTextProps> = ({
  text,
  delay = 50,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, amount: threshold });

  const defaultFrom = {
    filter: 'blur(10px)',
    opacity: 0,
    transform: direction === 'top' ? 'translate3d(0,-18px,0)' : 'translate3d(0,18px,0)',
  };

  const defaultTo = {
    filter: 'blur(0px)',
    opacity: 1,
    transform: 'translate3d(0,0,0)',
  };

  return (
    <p ref={ref} className={`flex flex-wrap ${className}`}>
      {elements.map((element, index) => (
        <MotionSpan
          key={index}
          initial={defaultFrom}
          animate={inView ? defaultTo : defaultFrom}
          transition={{
            type: 'spring',
            stiffness: 120,
            damping: 18,
            delay: (index * delay) / 1000,
          }}
          className="inline-block whitespace-pre will-change-transform will-change-filter"
        >
          {element}
          {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
        </MotionSpan>
      ))}
    </p>
  );
};

export default BlurText;

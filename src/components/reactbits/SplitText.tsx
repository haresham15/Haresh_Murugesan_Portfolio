import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const MotionSpan = motion.span as any;

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  animationFrom?: { opacity: number; transform: string };
  animationTo?: { opacity: number; transform: string };
  threshold?: number;
  rootMargin?: string;
}

export const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 40,
  animationFrom = { opacity: 0, transform: 'translate3d(0,20px,0)' },
  animationTo = { opacity: 1, transform: 'translate3d(0,0,0)' },
  threshold = 0.1,
}) => {
  const words = text.split(' ');
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: threshold });

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.28em]">
          {word.split('').map((char, charIndex) => {
            const index = wordIndex * 5 + charIndex;
            return (
              <MotionSpan
                key={charIndex}
                initial={animationFrom}
                animate={inView ? animationTo : animationFrom}
                transition={{
                  type: 'spring',
                  stiffness: 140,
                  damping: 18,
                  delay: (index * delay) / 1000,
                }}
                className="inline-block will-change-transform"
              >
                {char}
              </MotionSpan>
            );
          })}
        </span>
      ))}
    </span>
  );
};

export default SplitText;

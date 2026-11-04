import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

export interface CountUpProps {
  to: number;
  from?: number;
  direction?: 'up' | 'down';
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  separator?: string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

export const CountUp: React.FC<CountUpProps> = ({
  to,
  from = 0,
  delay = 0,
  duration = 1.8,
  className = '',
  startWhen = true,
  separator = '',
  decimals = 0,
  prefix = '',
  suffix = '',
}) => {
  const [value, setValue] = useState(from);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (!isInView || !startWhen) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const timeoutId = setTimeout(() => {
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        // easeOutQuart
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        const current = from + (to - from) * easeProgress;
        setValue(current);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(step);
        } else {
          setValue(to);
        }
      };

      animationFrameId = requestAnimationFrame(step);
    }, delay * 1000);

    return () => {
      clearTimeout(timeoutId);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isInView, startWhen, from, to, duration, delay]);

  const formatted = value.toFixed(decimals);
  const parts = formatted.split('.');
  if (separator) {
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  }
  const displayString = `${prefix}${parts.join('.')}${suffix}`;

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {displayString}
    </span>
  );
};

export default CountUp;


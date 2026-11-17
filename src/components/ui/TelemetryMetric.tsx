import React, { useEffect, useRef, useState } from 'react';
import { useMotionPreference } from '../MotionPreference';

export interface TelemetryMetricProps {
  value: string;
  className?: string;
  durationMs?: number;
}

const DIGITS = '0123456789';

/**
 * Tabular Telemetry Metric with Viewport Scramble-Resolve.
 * Enforces tabular-nums and fixed character width to prevent layout shifts.
 * Runs a 350ms progressive left-to-right digit lock-in when entering the viewport.
 * Disabled when prefers-reduced-motion is active.
 */
export const TelemetryMetric: React.FC<TelemetryMetricProps> = ({
  value,
  className = '',
  durationMs = 350,
}) => {
  const { isReduced } = useMotionPreference();
  const [displayValue, setDisplayValue] = useState(value);
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  useEffect(() => {
    if (isReduced || hasAnimated) return;

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry.isIntersecting) return;

        setHasAnimated(true);
        observer.disconnect();

        const startTime = performance.now();
        let rafId = 0;

        const tick = (now: number) => {
          const elapsed = now - startTime;
          const progress = Math.min(1, elapsed / durationMs);

          const chars = value.split('');
          const resolvedCount = Math.floor(progress * chars.length);

          const scrambled = chars.map((char, index) => {
            // Keep punctuation, units, signs, spaces stable
            if (!DIGITS.includes(char)) {
              return char;
            }
            if (index <= resolvedCount) {
              return char;
            }
            // Random jitter digit before lock-in
            return DIGITS[Math.floor(Math.random() * DIGITS.length)];
          });

          setDisplayValue(scrambled.join(''));

          if (progress < 1) {
            rafId = requestAnimationFrame(tick);
          } else {
            setDisplayValue(value);
          }
        };

        rafId = requestAnimationFrame(tick);

        return () => {
          cancelAnimationFrame(rafId);
        };
      },
      { threshold: 0.25 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [value, durationMs, isReduced, hasAnimated]);

  return (
    <span
      ref={containerRef}
      className={`tabular-nums inline-block font-mono select-none ${className}`}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {displayValue}
    </span>
  );
};

export default TelemetryMetric;

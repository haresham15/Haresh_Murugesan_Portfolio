import React, { useRef, useEffect } from 'react';
import { useMotionPreference } from '../MotionPreference';

export interface SpecularBorderProps {
  children: React.ReactNode;
  className?: string;
  theme?: 'dark' | 'light' | 'auto';
  radius?: string;
}

export function useSpecularBorder<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const { isReduced } = useMotionPreference();

  useEffect(() => {
    const el = ref.current;
    if (!el || isReduced || typeof window === 'undefined') return;

    let frame = 0;
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        el.style.setProperty('--mouse-x', `${x}px`);
        el.style.setProperty('--mouse-y', `${y}px`);
        el.style.setProperty('--specular-opacity', '1');
      });
    };

    const onPointerLeave = () => {
      if (frame) cancelAnimationFrame(frame);
      el.style.setProperty('--specular-opacity', '0');
    };

    el.addEventListener('pointermove', onPointerMove, { passive: true });
    el.addEventListener('pointerleave', onPointerLeave, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [isReduced]);

  return ref;
}

export const SpecularBorder: React.FC<SpecularBorderProps> = ({
  children,
  className = '',
  theme = 'auto',
  radius = '0px',
}) => {
  const ref = useSpecularBorder<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`group/specular relative ${className}`}
      style={{
        borderRadius: radius,
        // @ts-expect-error CSS custom property
        '--mouse-x': '-1000px',
        '--mouse-y': '-1000px',
        '--specular-opacity': '0',
      }}
    >
      {/* Specular hairline border overlay rendered via 1px mask padding */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          borderRadius: radius,
          opacity: 'var(--specular-opacity, 0)',
          background:
            theme === 'light'
              ? 'radial-gradient(320px circle at var(--mouse-x, -1000px) var(--mouse-y, -1000px), rgba(37, 99, 235, 0.40), transparent 100%)'
              : 'radial-gradient(320px circle at var(--mouse-x, -1000px) var(--mouse-y, -1000px), rgba(255, 255, 255, 0.28), transparent 100%)',
          WebkitMask:
            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '1px',
        }}
      />
      {children}
    </div>
  );
};

export default SpecularBorder;

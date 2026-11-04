import { useEffect } from 'react';

export function useMagneticPull() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Strict safety: Only run if device has a fine pointer (mouse/trackpad), not touch screens
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFinePointer) return;

    const handleMouseMove = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('[data-magnetic]') as HTMLElement | null;
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * 0.22;
      const deltaY = (e.clientY - centerY) * 0.22;

      // Restrain pull to max 6px
      const clampedX = Math.max(-6, Math.min(6, deltaX));
      const clampedY = Math.max(-6, Math.min(6, deltaY));

      target.style.transform = `translate3d(${clampedX}px, ${clampedY}px, 0)`;
      target.style.transition = 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)';
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('[data-magnetic]') as HTMLElement | null;
      if (target) {
        target.style.transform = 'translate3d(0px, 0px, 0)';
        target.style.transition = 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)';
      }
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseout', handleMouseLeave, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseout', handleMouseLeave);
    };
  }, []);
}

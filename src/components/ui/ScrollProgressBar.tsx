import React, { useEffect, useState } from 'react';
import { singleClock } from '@/lib/singleClock';

export const ScrollProgressBar: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
        const pct = Math.min(Math.max(scrollTop / docHeight, 0), 1);
        setProgress(pct);
      }
    };

    window.addEventListener('scroll', updateProgress, { passive: true });

    const lenis = singleClock.getLenis();
    if (lenis) {
      lenis.on('scroll', (e: { progress?: number }) => {
        if (typeof e.progress === 'number') {
          setProgress(Math.min(Math.max(e.progress, 0), 1));
        } else {
          updateProgress();
        }
      });
    }

    updateProgress();

    return () => {
      window.removeEventListener('scroll', updateProgress);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 w-full h-[2.5px] z-50 pointer-events-none bg-white/[0.04]"
    >
      <div
        className="h-full bg-gradient-to-r from-[#D8B4FE] via-[#7DD3FC] to-[#38BDF8] shadow-[0_0_8px_rgba(125,211,252,0.6)] transition-transform duration-75 ease-out"
        style={{
          transform: `scaleX(${progress})`,
          transformOrigin: '0% 50%',
        }}
      />
    </div>
  );
};

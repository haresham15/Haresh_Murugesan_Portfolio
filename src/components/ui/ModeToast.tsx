import React, { useState, useEffect, useRef } from 'react';
import { usePortfolioStore } from '@/store/usePortfolioStore';

export const ModeToast: React.FC = () => {
  const { mode } = usePortfolioStore();
  const [visible, setVisible] = useState(false);
  const [toastText, setToastText] = useState('');
  const [toastSubtext, setToastSubtext] = useState('');
  const isFirstRender = useRef(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Skip toast on initial page load
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (mode === 'recruiter') {
      setToastText('Recruiter Mode Active');
      setToastSubtext('All 3D effects unloaded · High-density static layout');
    } else {
      setToastText('Cinematic Mode Active');
      setToastSubtext('60fps WebGL architecture & interactive set pieces restored');
    }

    setVisible(true);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setVisible(false);
    }, 2800);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [mode]);

  if (!visible) return null;

  const isRecruiter = mode === 'recruiter';

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 max-w-sm p-4 rounded-[2px] bg-[#070B12]/95 border border-[#F3EFE7]/15 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-200 pointer-events-none"
    >
      <div className="flex items-start gap-3">
        <span
          className={`w-2 h-2 rounded-[1px] mt-1 shrink-0 ${
            isRecruiter ? 'bg-[#82B7FF]' : 'bg-[#FF6B35]'
          }`}
        />
        <div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-mono font-bold text-[#F3EFE7] tracking-wide">
              {toastText}
            </p>
            <span className="text-[10px] font-mono text-[#A7B2C3] px-1.5 py-0.5 rounded-[2px] bg-[#101B30] border border-[#F3EFE7]/10">
              Key: [R]
            </span>
          </div>
          <p className="text-[11px] font-sans text-[#A7B2C3] mt-0.5 leading-snug">
            {toastSubtext}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModeToast;


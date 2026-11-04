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
      className="fixed bottom-6 right-6 z-50 max-w-sm p-4 rounded-2xl bg-[#0D1118]/95 border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-200 pointer-events-none"
    >
      <div className="flex items-start gap-3">
        <span
          className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
            isRecruiter ? 'bg-[#7DD3FC] animate-ping' : 'bg-[#D8B4FE] animate-pulse'
          }`}
        />
        <div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-mono font-bold text-white tracking-wide">
              {toastText}
            </p>
            <span className="text-[10px] font-mono text-[#A6ADB8] px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
              Key: [R]
            </span>
          </div>
          <p className="text-[11px] font-sans text-[#A6ADB8] mt-0.5 leading-snug">
            {toastSubtext}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModeToast;


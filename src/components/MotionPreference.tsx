import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

export type MotionMode = 'system' | 'reduced' | 'full';

interface MotionContextType {
  mode: MotionMode;
  isReduced: boolean;
  setMode: (mode: MotionMode) => void;
  toggleReducedMotion: () => void;
  isDocumentVisible: boolean;
}

const MotionContext = createContext<MotionContextType>({
  mode: 'system',
  isReduced: false,
  setMode: () => {},
  toggleReducedMotion: () => {},
  isDocumentVisible: true,
});

const STORAGE_KEY = 'haresh-portfolio-motion-preference';

export const MotionPreferenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<MotionMode>('system');
  const [systemPrefersReduced, setSystemPrefersReduced] = useState<boolean>(false);
  const [isDocumentVisible, setIsDocumentVisible] = useState<boolean>(true);

  // Initialize and observe media query and localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check system preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setSystemPrefersReduced(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setSystemPrefersReduced(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
    } else {
      mediaQuery.addListener(handleMediaChange);
    }

    // Check localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as MotionMode | null;
      if (saved === 'system' || saved === 'reduced' || saved === 'full') {
        setModeState(saved);
      }
    } catch {
      // Ignore localStorage restrictions
    }

    // Visibility change listener to pause loops when tab is hidden
    const handleVisibilityChange = () => {
      setIsDocumentVisible(document.visibilityState !== 'hidden');
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaChange);
      } else {
        mediaQuery.removeListener(handleMediaChange);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const isReduced = useMemo(() => {
    if (mode === 'reduced') return true;
    if (mode === 'full') return false;
    return systemPrefersReduced;
  }, [mode, systemPrefersReduced]);

  // Sync class on documentElement for CSS overrides
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isReduced) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  }, [isReduced]);

  const setMode = (newMode: MotionMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem(STORAGE_KEY, newMode);
    } catch {
      // Ignore
    }
  };

  const toggleReducedMotion = () => {
    setMode(isReduced ? 'full' : 'reduced');
  };

  return (
    <MotionContext.Provider
      value={{
        mode,
        isReduced,
        setMode,
        toggleReducedMotion,
        isDocumentVisible,
      }}
    >
      {children}
    </MotionContext.Provider>
  );
};

export const useMotionPreference = () => useContext(MotionContext);

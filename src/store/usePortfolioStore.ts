import { create } from 'zustand';

export type PortfolioMode = 'cinematic' | 'reduced' | 'recruiter';
export type HeroLayer = 'all' | 'ai-ml' | 'systems' | 'research';
export type DeviceTier = 'static' | 'balanced' | 'full' | 'low' | 'mid' | 'high';

interface PortfolioState {
  mode: PortfolioMode;
  activeHeroLayer: HeroLayer;
  deviceTier: DeviceTier;
  webglFailed: boolean;
  copiedEmail: boolean;
  commandPaletteOpen: boolean;
  
  // Actions
  setMode: (mode: PortfolioMode) => void;
  toggleRecruiterMode: () => void;
  setActiveHeroLayer: (layer: HeroLayer) => void;
  setDeviceTier: (tier: DeviceTier) => void;
  setWebglFailed: (failed: boolean) => void;
  setCopiedEmail: (copied: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  initializeFromPreferences: () => void;
}

const STORAGE_KEY = 'hm_portfolio_mode';

function getStoredMode(): PortfolioMode | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'cinematic' || stored === 'reduced' || stored === 'recruiter') {
      return stored;
    }
  } catch {
    // Graceful fallback if localStorage is disabled/restricted
  }
  return null;
}

function persistMode(mode: PortfolioMode): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // Ignore storage errors
  }
}

function syncBodyClass(mode: PortfolioMode): void {
  if (typeof document === 'undefined') return;
  if (mode === 'recruiter') {
    document.body.classList.add('recruiter-mode');
  } else {
    document.body.classList.remove('recruiter-mode');
  }
}

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  mode: 'cinematic',
  activeHeroLayer: 'all',
  deviceTier: 'high',
  webglFailed: false,
  copiedEmail: false,
  commandPaletteOpen: false,

  setMode: (mode: PortfolioMode) => {
    persistMode(mode);
    syncBodyClass(mode);
    set({ mode });
  },

  toggleRecruiterMode: () => {
    const current = get().mode;
    const next: PortfolioMode = current === 'recruiter' ? 'cinematic' : 'recruiter';
    persistMode(next);
    syncBodyClass(next);
    set({ mode: next });
  },

  setActiveHeroLayer: (layer: HeroLayer) => set({ activeHeroLayer: layer }),
  
  setDeviceTier: (tier: DeviceTier) => set({ deviceTier: tier }),

  setWebglFailed: (webglFailed: boolean) => set({ webglFailed }),

  setCopiedEmail: (copiedEmail: boolean) => set({ copiedEmail }),

  setCommandPaletteOpen: (commandPaletteOpen: boolean) => set({ commandPaletteOpen }),

  initializeFromPreferences: () => {
    if (typeof window === 'undefined') return;

    // Check stored mode first
    const stored = getStoredMode();
    if (stored) {
      syncBodyClass(stored);
      set({ mode: stored });
      return;
    }

    // Check prefers-reduced-motion
    try {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const initialMode: PortfolioMode = prefersReduced ? 'reduced' : 'cinematic';
      syncBodyClass(initialMode);
      set({ mode: initialMode });
    } catch {
      set({ mode: 'cinematic' });
    }
  },
}));


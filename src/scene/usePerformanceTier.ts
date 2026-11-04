import { useState, useEffect, useRef, useCallback } from 'react';
import { usePortfolioStore, DeviceTier } from '@/store/usePortfolioStore';
import { analytics } from '@/lib/analytics';

export interface PerformanceTierConfig {
  tier: DeviceTier;
  dpr: [number, number];
  particleMultiplier: number;
  useShaders: boolean;
  enablePostProcessing: boolean;
  isPaused: boolean;
}

export function usePerformanceTier(): PerformanceTierConfig {
  const { mode, deviceTier, setDeviceTier, webglFailed } = usePortfolioStore();
  const [isTabHidden, setIsTabHidden] = useState<boolean>(false);
  const consecutiveSlowFramesRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);

  // 1. Initial GPU / Device Tier Detection
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if WebGL is supported
    let webglSupported = false;
    try {
      const canvas = document.createElement('canvas');
      webglSupported = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch {
      webglSupported = false;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobileViewport = window.innerWidth < 768;
    const isLowConcurrency = (navigator.hardwareConcurrency || 4) <= 4;

    if (!webglSupported || prefersReducedMotion || mode === 'recruiter' || webglFailed) {
      setDeviceTier('static');
      analytics.track('tier_change', 'static', { reason: 'capabilities_or_preference' });
    } else if (isMobileViewport || isLowConcurrency) {
      setDeviceTier('balanced');
      analytics.track('tier_change', 'balanced', { reason: 'mobile_or_concurrency' });
    } else {
      setDeviceTier('full');
      analytics.track('tier_change', 'full', { reason: 'desktop_hardware' });
    }
  }, [mode, webglFailed, setDeviceTier]);

  // 2. Pause when document is hidden (Tab switching)
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleVisibilityChange = () => {
      const hidden = document.hidden;
      setIsTabHidden(hidden);
      if (hidden) {
        lastFrameTimeRef.current = 0;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // 3. Dynamic Frame-Drop Step Down monitor
  const reportFrameTime = useCallback((frameDurationMs: number) => {
    if (deviceTier !== 'full') return;

    // >28ms corresponds to <35fps
    if (frameDurationMs > 28) {
      consecutiveSlowFramesRef.current += 1;
      // 2 seconds at ~35fps is ~70 frames
      if (consecutiveSlowFramesRef.current > 70) {
        setDeviceTier('balanced');
        analytics.track('tier_change', 'balanced', { reason: 'frame_time_drop' });
        consecutiveSlowFramesRef.current = 0;
      }
    } else {
      consecutiveSlowFramesRef.current = Math.max(0, consecutiveSlowFramesRef.current - 1);
    }
  }, [deviceTier, setDeviceTier]);

  // Expose reportFrameTime to window for scene debug loops
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as unknown as { __reportFrameTime?: (ms: number) => void }).__reportFrameTime = reportFrameTime;
    }
  }, [reportFrameTime]);

  const effectiveTier: DeviceTier = (mode === 'recruiter' || webglFailed) ? 'static' : deviceTier;

  switch (effectiveTier) {
    case 'static':
      return {
        tier: 'static',
        dpr: [1, 1],
        particleMultiplier: 0,
        useShaders: false,
        enablePostProcessing: false,
        isPaused: true,
      };
    case 'balanced':
      return {
        tier: 'balanced',
        dpr: [1, 1.25],
        particleMultiplier: 0.25,
        useShaders: false,
        enablePostProcessing: false,
        isPaused: isTabHidden,
      };
    case 'full':
    default:
      return {
        tier: 'full',
        dpr: [1, 1.5],
        particleMultiplier: 1.0,
        useShaders: true,
        enablePostProcessing: false, // Keep disabled for lean bundle + zero WebGL context overhead
        isPaused: isTabHidden,
      };
  }
}

import { gsap } from 'gsap';
import Lenis from 'lenis';

export type ClockTickListener = (time: number, delta: number, frame: number) => void;

class SingleClockEngine {
  private lenis: Lenis | null = null;
  private listeners = new Set<ClockTickListener>();
  private initialized = false;
  private isPaused = false;
  private lastTime = 0;

  public init(): void {
    if (typeof window === 'undefined' || this.initialized) return;

    // Check for reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    try {
      // 1. Initialize Lenis with autoRaf disabled so GSAP ticker drives it
      this.lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        autoRaf: false,
      });

      // 2. Deterministic lag smoothing disabled
      gsap.ticker.lagSmoothing(0);

      // 3. Register unified RAF loop on GSAP ticker
      gsap.ticker.add(this.onTick);

      if (typeof window !== 'undefined') {
        (window as any).__singleClock = this;
      }

      this.initialized = true;
    } catch (err) {
      console.warn('[SingleClock] Smooth scroll initialization skipped:', err);
    }
  }

  private onTick = (time: number, deltaTime: number, frame: number) => {
    if (this.isPaused) return;

    // Clamp delta time to max 100ms (0.1s) to prevent physics explosions on tab switches
    const delta = Math.min(deltaTime / 1000, 0.1);

    // 1. Advance Lenis smooth scroll
    if (this.lenis) {
      this.lenis.raf(time * 1000);
    }

    // 2. Dispatch to registered WebGL / 3D listeners
    this.listeners.forEach((listener) => {
      try {
        listener(time, delta, frame);
      } catch (err) {
        console.error('[SingleClock] Listener tick exception:', err);
      }
    });

    this.lastTime = time;
  };

  public subscribe(listener: ClockTickListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public pause(): void {
    this.isPaused = true;
  }

  public resume(): void {
    this.isPaused = false;
  }

  public getLenis(): Lenis | null {
    return this.lenis;
  }

  public destroy(): void {
    if (!this.initialized) return;
    gsap.ticker.remove(this.onTick);
    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
    }
    this.listeners.clear();
    this.initialized = false;
  }
}

export const singleClock = new SingleClockEngine();

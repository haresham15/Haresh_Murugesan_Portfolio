/**
 * Quality tier, chosen once per page load by a 500 ms frame-time probe. The probe waits
 * for `load` and an idle callback, so it measures the device rather than hydration, and
 * judges the median frame so one long hydration task cannot force the CSS fallback.
 *
 *   full    shader at DPR <= 1.5 with glints
 *   lite    shader at DPR 1, no glints
 *   static  CSS materials only (also forced by reduced motion or no WebGL2)
 *
 * `?tier=full|lite|static` in the URL overrides the probe (for tests and screenshots).
 */
import { useEffect, useState } from 'react';
import { useMotionPreference } from '@/components/MotionPreference';
import { register } from './scheduler';

export type QualityTier = 'full' | 'lite' | 'static';

export const PROBE_MS = 500;
/** Median frame interval thresholds, ms. */
export const FULL_MAX_FRAME = 20;
export const LITE_MAX_FRAME = 34;

let probed: QualityTier | null = null;
let probing: Promise<QualityTier> | null = null;

function hasWebGL2(): boolean {
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch {
    return false;
  }
}

function override(): QualityTier | null {
  const v = new URLSearchParams(window.location.search).get('tier');
  return v === 'full' || v === 'lite' || v === 'static' ? v : null;
}

export function probeTier(): Promise<QualityTier> {
  if (probed) return Promise.resolve(probed);
  if (probing) return probing;
  probing = new Promise<QualityTier>((resolve) => {
    const forced = override();
    if (forced) return resolve(forced);
    if (!hasWebGL2()) return resolve('static');
    const run = () => {
      const frames: number[] = [];
      let last = 0;
      let start = 0;
      const task = register(({ now }) => {
        if (!start) start = now;
        if (last) frames.push(now - last);
        last = now;
        if (now - start < PROBE_MS) return true;
        task.dispose();
        if (frames.length < 4) return void resolve('lite');
        frames.sort((a, b) => a - b);
        const median = frames[Math.floor(frames.length / 2)];
        resolve(median <= FULL_MAX_FRAME ? 'full' : median <= LITE_MAX_FRAME ? 'lite' : 'static');
      }, { budgeted: false, wakeOnVisible: false });
    };
    const idle = () => {
      if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(run, { timeout: 1000 });
      else setTimeout(run, 0);
    };
    if (document.readyState === 'complete') idle();
    else window.addEventListener('load', idle, { once: true });
  }).then((t) => {
    probed = t;
    document.documentElement.dataset.tier = t;
    return t;
  });
  return probing;
}

/**
 * The tier to render at. `null` until the probe finishes; reduced motion always
 * returns 'static'.
 */
export function useQualityTier(): QualityTier | null {
  const { isReduced } = useMotionPreference();
  const [tier, setTier] = useState<QualityTier | null>(probed);
  useEffect(() => {
    let alive = true;
    probeTier().then((t) => { if (alive) setTier(t); });
    return () => { alive = false; };
  }, []);
  if (isReduced) return 'static';
  return tier;
}

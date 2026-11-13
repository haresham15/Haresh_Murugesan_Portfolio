/**
 * Quality tier, chosen once per page load by a 500 ms frame-time probe.
 *
 *   full    shader at DPR <= 1.5 with glints
 *   lite    shader at DPR 1, no glints
 *   static  CSS materials only (also forced by reduced motion or no WebGL2)
 *
 * `?tier=full|lite|static` in the URL overrides the probe (for tests and screenshots).
 */
import { useEffect, useState } from 'react';
import { useMotionPreference } from '@/components/MotionPreference';

export type QualityTier = 'full' | 'lite' | 'static';

export const PROBE_MS = 500;
/** 75th-percentile frame interval thresholds, ms. */
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
    const frames: number[] = [];
    let last = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      if (last) frames.push(now - last);
      last = now;
      if (now - start < PROBE_MS) return void requestAnimationFrame(tick);
      if (frames.length < 4) return resolve('lite');
      frames.sort((a, b) => a - b);
      const p75 = frames[Math.floor(frames.length * 0.75)];
      resolve(p75 <= FULL_MAX_FRAME ? 'full' : p75 <= LITE_MAX_FRAME ? 'lite' : 'static');
    };
    requestAnimationFrame(tick);
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

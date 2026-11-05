import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';

export interface VehicleTransform {
  x: number;
  y: number;
  angle: number;
}

export interface ChicaneTarget {
  id: string;
  index: number;
  t: number; // Normalized path position [0..1]
  apexX: number;
  apexY: number;
}

export interface UseChicaneCircuitKinematicsProps {
  pathElement: SVGPathElement | null;
  vehicleRef: React.RefObject<SVGGElement | null>;
  activeLineRef?: React.RefObject<SVGPathElement | null>;
  chicanes: ChicaneTarget[];
  activeIndex: number;
  onArrival?: (index: number) => void;
  isReducedMotion?: boolean;
}

export function useChicaneCircuitKinematics({
  pathElement,
  vehicleRef,
  activeLineRef,
  chicanes,
  activeIndex,
  onArrival,
  isReducedMotion = false,
}: UseChicaneCircuitKinematicsProps) {
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [boost, setBoost] = useState<'normal' | 'high'>('normal');
  const [isBraking, setIsBraking] = useState<boolean>(false);

  // Progress object driven by GSAP
  const progressRef = useRef<{ t: number }>({ t: 0 });
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const prevIndexRef = useRef<number>(0);
  const isInitializedRef = useRef<boolean>(false);
  const onArrivalRef = useRef(onArrival);
  onArrivalRef.current = onArrival;

  // Compute (x, y, angle) directly from SVG path
  const computeTransform = useCallback(
    (t: number): VehicleTransform => {
      if (!pathElement) {
        const target = chicanes[activeIndex] || chicanes[0];
        return { x: target ? target.apexX : 100, y: target ? target.apexY : 145, angle: 0 };
      }

      let totalLength = 0;
      try {
        totalLength = pathElement.getTotalLength();
      } catch {
        return { x: 0, y: 145, angle: 0 };
      }

      if (totalLength <= 0) {
        return { x: 0, y: 145, angle: 0 };
      }

      // 1. Beyond right screen edge (Wrap Phase A: t > 1)
      if (t > 1) {
        const ptEnd = pathElement.getPointAtLength(totalLength);
        const excess = (t - 1) * totalLength;
        return {
          x: ptEnd.x + excess,
          y: ptEnd.y,
          angle: 0,
        };
      }

      // 2. Off left screen edge (Wrap Phase B/C: t < 0)
      if (t < 0) {
        const ptStart = pathElement.getPointAtLength(0);
        const deficit = t * totalLength;
        return {
          x: ptStart.x + deficit,
          y: ptStart.y,
          angle: 0,
        };
      }

      // 3. Normal track range [0..1]
      const s = Math.max(0, Math.min(totalLength, t * totalLength));
      const pt = pathElement.getPointAtLength(s);

      // Tangent computation via delta
      const dl = 3.0;
      const s1 = Math.max(0, s - dl);
      const s2 = Math.min(totalLength, s + dl);
      const p1 = pathElement.getPointAtLength(s1);
      const p2 = pathElement.getPointAtLength(s2);

      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

      return {
        x: pt.x,
        y: pt.y,
        angle,
      };
    },
    [pathElement, chicanes, activeIndex]
  );

  // Directly apply transform to vehicle DOM element and active line
  const applyTransform = useCallback(
    (t: number) => {
      if (!vehicleRef.current) return;

      const tf = computeTransform(t);
      vehicleRef.current.setAttribute(
        'transform',
        `translate(${tf.x.toFixed(2)}, ${tf.y.toFixed(2)}) rotate(${tf.angle.toFixed(2)})`
      );

      // Active racing line trailing wake behind car
      if (activeLineRef?.current) {
        activeLineRef.current.setAttribute('stroke-dashoffset', `${(-t * 1400).toFixed(1)}`);
      }
    },
    [computeTransform, vehicleRef, activeLineRef]
  );

  // Initial placement on mount
  useEffect(() => {
    if (chicanes.length > 0 && pathElement && !isInitializedRef.current) {
      isInitializedRef.current = true;
      const initialT = chicanes[activeIndex]?.t ?? chicanes[0].t;
      progressRef.current.t = initialT;
      prevIndexRef.current = activeIndex;
      applyTransform(initialT);
    }
  }, [chicanes, pathElement, activeIndex, applyTransform]);

  // Main GSAP animation controller when activeIndex changes
  useEffect(() => {
    if (!isInitializedRef.current || chicanes.length === 0 || !pathElement) return;

    const fromIndex = prevIndexRef.current;
    const toIndex = activeIndex;
    prevIndexRef.current = activeIndex;

    const targetChicane = chicanes[toIndex];
    if (!targetChicane) return;

    const targetT = targetChicane.t;

    // Accessibility: instant placement if user prefers reduced motion
    if (isReducedMotion) {
      if (timelineRef.current) timelineRef.current.kill();
      progressRef.current.t = targetT;
      applyTransform(targetT);
      setIsMoving(false);
      setBoost('normal');
      setIsBraking(false);
      onArrivalRef.current?.(toIndex);
      return;
    }

    // Kill any in-flight GSAP animation cleanly
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }

    const currentT = progressRef.current.t;

    // Already at target
    if (Math.abs(currentT - targetT) < 0.003) {
      applyTransform(targetT);
      setIsMoving(false);
      setBoost('normal');
      setIsBraking(false);
      onArrivalRef.current?.(toIndex);
      return;
    }

    // =========================================================================
    // 1. FORWARD MOVEMENT (toIndex > fromIndex)
    // Smoothly accelerate forward: ~700ms, leaning into apexes
    // =========================================================================
    if (toIndex > fromIndex || (currentT < targetT && toIndex === fromIndex)) {
      setIsMoving(true);
      setBoost('normal');
      setIsBraking(false);

      const duration = 0.70 + Math.abs(toIndex - fromIndex) * 0.08;

      const tl = gsap.timeline({
        onComplete: () => {
          progressRef.current.t = targetT;
          applyTransform(targetT);
          setIsMoving(false);
          setBoost('normal');
          setIsBraking(true);
          setTimeout(() => setIsBraking(false), 300);
          timelineRef.current = null;
          onArrivalRef.current?.(toIndex);
        },
      });

      tl.to(progressRef.current, {
        t: targetT,
        duration,
        ease: 'power2.inOut',
        onUpdate: () => {
          applyTransform(progressRef.current.t);
        },
      });

      timelineRef.current = tl;
      return;
    }

    // =========================================================================
    // 2. NON-REVERSING WRAP-AROUND MOVEMENT (toIndex < fromIndex)
    // NEVER DRIVE BACKWARD OR FLIP 180° REVERSE!
    // Phase A: Accelerate rightward off the right edge (currentT → 1.06) in 420ms
    // Phase B: Instant teleport off-screen left (1.06 → -0.06)
    // Phase C: Re-enter from left edge and brake onto target (-0.06 → targetT) in 520ms
    // =========================================================================
    setIsMoving(true);
    setBoost('high');
    setIsBraking(false);

    const exitTargetT = 1.06;
    const exitDuration = 0.42;
    const entryDuration = 0.52;

    const tl = gsap.timeline({
      onComplete: () => {
        progressRef.current.t = targetT;
        applyTransform(targetT);
        setIsMoving(false);
        setBoost('normal');
        setIsBraking(true);
        setTimeout(() => setIsBraking(false), 350);
        timelineRef.current = null;
        onArrivalRef.current?.(toIndex);
      },
    });

    // Phase A: Accelerate forward rightward off the screen
    tl.to(progressRef.current, {
      t: exitTargetT,
      duration: exitDuration,
      ease: 'power2.in',
      onUpdate: () => {
        applyTransform(progressRef.current.t);
      },
    });

    // Phase B: Instant wrap to left edge
    tl.set(progressRef.current, {
      t: -0.06,
      onComplete: () => {
        setBoost('normal');
        setIsBraking(true);
        applyTransform(-0.06);
      },
    });

    // Phase C: Drive in from left edge and brake into target apex
    tl.to(progressRef.current, {
      t: targetT,
      duration: entryDuration,
      ease: 'power3.out',
      onUpdate: () => {
        applyTransform(progressRef.current.t);
      },
    });

    timelineRef.current = tl;

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
  }, [activeIndex, chicanes, pathElement, applyTransform, isReducedMotion]);

  return {
    isMoving,
    boost,
    isBraking,
  };
}

export default useChicaneCircuitKinematics;

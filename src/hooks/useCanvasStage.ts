import { useCallback, useEffect, useRef, type RefObject } from 'react';
import { register, type FrameInfo } from '@/v7/runtime/scheduler';

export interface CanvasStage {
  width: number;
  height: number;
  dpr: number;
  time: number;
  deltaTime: number;
}

/**
 * Draw in CSS pixels. Return `false` to let the loop sleep until the next
 * `invalidate()` (resize, visibility change, or an explicit call); any other
 * return value keeps animating while `animate` is true.
 */
export type CanvasStageDraw = (ctx: CanvasRenderingContext2D, stage: CanvasStage) => void | boolean;

export interface CanvasStageHandle {
  /** Schedule a frame (wakes a sleeping or non-animated stage). */
  invalidate: () => void;
}

/** Draw in CSS pixels. The observed element must have a CSS-defined size. */
export function useCanvasStage(
  containerRef: RefObject<HTMLElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  draw: CanvasStageDraw | null,
  { animate = true, enabled = true, onFrame }: {
    animate?: boolean;
    enabled?: boolean;
    /** WebGL owns its context; pass null for draw and render here. */
    onFrame?: (stage: CanvasStage) => void | boolean;
  } = {},
): CanvasStageHandle {
  const drawRef = useRef(draw);
  const frameRef = useRef(onFrame);
  const invalidateRef = useRef<() => void>(() => {});
  useEffect(() => {
    drawRef.current = draw;
    frameRef.current = onFrame;
    invalidateRef.current();
  }, [draw, onFrame]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!enabled || !container || !canvas) return;
    const ctx = drawRef.current ? canvas.getContext('2d') : null;
    if (drawRef.current && !ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let elapsed = 0;
    const syncSize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const pixelWidth = Math.max(1, Math.floor(width * dpr));
      const pixelHeight = Math.max(1, Math.floor(height * dpr));
      if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
      if (canvas.height !== pixelHeight) canvas.height = pixelHeight;
    };
    // One site-wide rAF: the scheduler pauses this stage off screen and caps how many
    // canvases animate in one frame (src/v7/runtime/scheduler.ts).
    const tick = ({ dt }: FrameInfo): boolean => {
      if (width <= 0 || height <= 0) return false;
      if (dpr !== Math.min(window.devicePixelRatio || 1, 1.5)) syncSize();
      const deltaTime = dt;
      elapsed += deltaTime;
      const stage = { width, height, dpr, time: elapsed, deltaTime };
      let keepGoing = true;
      if (ctx) {
        ctx.save();
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (drawRef.current?.(ctx, stage) === false) keepGoing = false;
        ctx.restore();
      }
      if (frameRef.current?.(stage) === false) keepGoing = false;
      return animate && keepGoing;
    };
    const task = register(tick, { element: container, budgeted: true });
    const invalidate = () => task.wake();
    const resize = () => { syncSize(); invalidate(); };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    window.addEventListener('resize', resize);
    invalidateRef.current = invalidate;
    resize();
    return () => {
      task.dispose();
      resizeObserver.disconnect();
      window.removeEventListener('resize', resize);
      invalidateRef.current = () => {};
    };
  }, [containerRef, canvasRef, animate, enabled]);

  const invalidate = useCallback(() => invalidateRef.current(), []);
  return { invalidate };
}

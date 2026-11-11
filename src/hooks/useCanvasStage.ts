import { useEffect, useRef, type RefObject } from 'react';

export interface CanvasStage {
  width: number;
  height: number;
  dpr: number;
  time: number;
  deltaTime: number;
}

export type CanvasStageDraw = (ctx: CanvasRenderingContext2D, stage: CanvasStage) => void;

/** Draw in CSS pixels. The observed element must have a CSS-defined size. */
export function useCanvasStage(
  containerRef: RefObject<HTMLElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  draw: CanvasStageDraw | null,
  { animate = true, enabled = true, onFrame }: {
    animate?: boolean;
    enabled?: boolean;
    /** WebGL owns its context; pass null for draw and render here. */
    onFrame?: (stage: CanvasStage) => void;
  } = {},
) {
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
    let frame = 0;
    let previous = 0;
    let elapsed = 0;
    let visible = typeof IntersectionObserver === 'undefined';
    const canDraw = () => visible && !document.hidden && width > 0 && height > 0;
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
    };
    const syncSize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const pixelWidth = Math.max(1, Math.floor(width * dpr));
      const pixelHeight = Math.max(1, Math.floor(height * dpr));
      if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
      if (canvas.height !== pixelHeight) canvas.height = pixelHeight;
    };
    const tick = (now: number) => {
      frame = 0;
      if (!canDraw()) return;
      if (dpr !== Math.min(window.devicePixelRatio || 1, 2)) syncSize();
      const deltaTime = previous ? Math.min(now - previous, 64) : 0;
      previous = now;
      elapsed += deltaTime;
      const stage = { width, height, dpr, time: elapsed, deltaTime };
      if (ctx) {
        ctx.save();
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        drawRef.current?.(ctx, stage);
        ctx.restore();
      }
      frameRef.current?.(stage);
      if (animate) frame = requestAnimationFrame(tick);
    };
    const invalidate = () => {
      if (canDraw() && !frame) frame = requestAnimationFrame(tick);
    };
    const resize = () => { syncSize(); invalidate(); };
    const visibility = () => { if (canDraw()) invalidate(); else stop(); };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      visibility();
    });
    observer?.observe(container);
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('resize', resize);
    invalidateRef.current = invalidate;
    resize();
    return () => {
      stop();
      resizeObserver.disconnect();
      observer?.disconnect();
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('resize', resize);
      invalidateRef.current = () => {};
    };
  }, [containerRef, canvasRef, animate, enabled]);
}

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useCanvasStage, type CanvasStage } from '../../hooks/useCanvasStage';
import {
  C, DARK_PALETTE, easeInOutCubic, type PlateDefinition, type PlatePalette, type PlateScene, type StageFrame, type StagePointer,
} from './stageKit';

interface PlateStageProps {
  definition: PlateDefinition;
  /** unique per system, e.g. "healios" */
  systemKey: string;
  modeId: string;
  reduced: boolean;
  panelId?: string;
  labelledBy?: string;
  /** strip targets, written directly each frame to avoid React renders */
  coordsRef?: React.RefObject<HTMLSpanElement | null>;
  readoutRef?: React.RefObject<HTMLSpanElement | null>;
  /** filled by the stage so the mode bar can trigger scene actions */
  actionRef?: React.MutableRefObject<((id: string) => void) | null>;
  /** Colour roles. Defaults to carbon; pass LIGHT_PALETTE on the weave (no backdrop is painted then). */
  palette?: PlatePalette;
  /** False stops the loop after one frame. Turning it back on replays the scene's intro. */
  active?: boolean;
  /** Multiplies the intro clock, so 1.8 plays a 0.9 s draw-on in 0.5 s. */
  introRate?: number;
  /** Replaces the default tabpanel role, e.g. when the panel semantics live elsewhere. */
  role?: string;
  className?: string;
}

const FADE_SECONDS = 0.42;
/** critically damped spring for the cursor */
const OMEGA = 16;

export const PlateStage: React.FC<PlateStageProps> = ({
  definition,
  systemKey,
  modeId,
  reduced,
  panelId,
  labelledBy,
  coordsRef,
  readoutRef,
  actionRef,
  palette = DARK_PALETTE,
  active = true,
  introRate = 1,
  role = 'tabpanel',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<{ key: string; scene: PlateScene; born: number } | null>(null);
  const snapRef = useRef<{ canvas: HTMLCanvasElement; start: number } | null>(null);
  const clockRef = useRef(0);
  const pointer = useRef<StagePointer>({ x: -1, y: -1, tx: -1, ty: -1, vx: 0, vy: 0, active: false, presence: 0 });
  const lastText = useRef({ coords: '', readout: '' });
  const frameRef = useRef<StageFrame | null>(null);
  const restartRef = useRef(false);
  // Under reduced motion the loop is not running; bump this to request one redraw.
  const [redrawToken, setRedrawToken] = useState(0);

  const key = `${systemKey}:${modeId}`;
  const mode = definition.modes.find((m) => m.id === modeId) ?? definition.modes[0];

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, stage: CanvasStage) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dt = reduced ? 0 : Math.min(stage.deltaTime, 64) / 1000;
      clockRef.current += dt;
      const now = clockRef.current;

      // Scene swap: freeze the outgoing frame into a snapshot and crossfade it out.
      if (!sceneRef.current || sceneRef.current.key !== key) {
        if (sceneRef.current && !reduced && canvas.width > 1) {
          const snap = snapRef.current?.canvas ?? document.createElement('canvas');
          snap.width = canvas.width;
          snap.height = canvas.height;
          const sctx = snap.getContext('2d');
          if (sctx) {
            sctx.clearRect(0, 0, snap.width, snap.height);
            sctx.drawImage(canvas, 0, 0);
            snapRef.current = { canvas: snap, start: now };
          }
        }
        sceneRef.current = { key, scene: definition.createScene(modeId, palette), born: now };
        if (actionRef) actionRef.current = (id: string) => sceneRef.current?.scene.action?.(id);
      } else if (restartRef.current) {
        sceneRef.current.born = now;
      }
      restartRef.current = false;
      const { scene, born } = sceneRef.current;

      const p = pointer.current;
      const frame: StageFrame = {
        width: stage.width,
        height: stage.height,
        // The clock is frozen under reduced motion, so show every scene fully drawn.
        age: reduced ? 10 : (now - born) * introRate,
        time: now,
        dt,
        pointer: p,
        reduced,
        palette,
      };
      frameRef.current = frame;

      // Pointer target: real cursor when present, otherwise the scene's idle path.
      let tx = p.tx;
      let ty = p.ty;
      if (!p.active) {
        const idle = scene.idle?.(frame);
        if (idle) [tx, ty] = idle;
        else { tx = stage.width * 0.5; ty = stage.height * 0.5; }
      }
      if (p.x < 0 || reduced) {
        p.x = tx; p.y = ty; p.vx = 0; p.vy = 0;
      } else if (dt > 0) {
        // semi-implicit critically damped spring, sub-stepped for stability
        const steps = Math.ceil(dt / (1 / 120));
        const h = dt / steps;
        for (let i = 0; i < steps; i++) {
          p.vx += (OMEGA * OMEGA * (tx - p.x) - 2 * OMEGA * p.vx) * h;
          p.vy += (OMEGA * OMEGA * (ty - p.y) - 2 * OMEGA * p.vy) * h;
          p.x += p.vx * h;
          p.y += p.vy * h;
        }
      }
      const targetPresence = p.active ? 1 : 0;
      p.presence = reduced ? targetPresence : p.presence + (targetPresence - p.presence) * (1 - Math.exp(-dt * 9));

      ctx.clearRect(0, 0, stage.width, stage.height);
      const readout = scene.draw(ctx, frame);

      const snap = snapRef.current;
      if (snap) {
        const t = (now - snap.start) / FADE_SECONDS;
        if (t >= 1 || reduced) {
          snapRef.current = null;
        } else {
          const e = easeInOutCubic(t);
          const s = 1 + e * 0.035;
          ctx.save();
          ctx.globalAlpha = 1 - e;
          ctx.translate(stage.width / 2, stage.height / 2);
          ctx.scale(s, s);
          ctx.drawImage(snap.canvas, -stage.width / 2, -stage.height / 2, stage.width, stage.height);
          ctx.restore();
        }
      }

      const coords = p.active
        ? `x ${String(Math.round(p.x)).padStart(4, '0')} · y ${String(Math.round(p.y)).padStart(4, '0')}`
        : 'cursor idle';
      if (coords !== lastText.current.coords && coordsRef?.current) {
        coordsRef.current.textContent = coords;
        lastText.current.coords = coords;
      }
      if (readout !== lastText.current.readout && readoutRef?.current) {
        readoutRef.current.textContent = readout;
        lastText.current.readout = readout;
      }
    },
    // redrawToken is intentionally a dependency: a new draw identity invalidates the stage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key, definition, modeId, reduced, redrawToken, coordsRef, readoutRef, actionRef, palette, introRate],
  );

  useCanvasStage(containerRef, canvasRef, draw, { animate: !reduced && active });

  // Coming back into view as the active plate replays the draw-on.
  useEffect(() => {
    if (active) restartRef.current = true;
  }, [active]);

  useEffect(() => () => { if (actionRef) actionRef.current = null; }, [actionRef]);

  const requestRedraw = useCallback(() => {
    if (reduced) setRedrawToken((n) => n + 1);
  }, [reduced]);

  const setTarget = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const p = pointer.current;
    p.tx = e.clientX - rect.left;
    p.ty = e.clientY - rect.top;
    p.active = true;
    requestRedraw();
  };

  return (
    <div
      ref={containerRef}
      id={panelId}
      role={role}
      aria-labelledby={labelledBy}
      className={`relative flex-1 min-h-0 w-full overflow-hidden cursor-crosshair ${className}`}
      style={{
        touchAction: 'pan-y',
        background: palette.paper ? undefined : `radial-gradient(120% 90% at 50% 45%, ${C.obsidian} 0%, ${C.midnight} 70%)`,
      }}
      onPointerMove={setTarget}
      onPointerEnter={setTarget}
      onPointerDown={(e) => {
        setTarget(e);
        const f = frameRef.current;
        if (f) sceneRef.current?.scene.onPointerDown?.({ ...f, pointer: pointer.current });
        requestRedraw();
      }}
      onPointerLeave={() => {
        pointer.current.active = false;
        requestRedraw();
      }}
      onPointerCancel={() => {
        pointer.current.active = false;
        requestRedraw();
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" role="img" aria-label={mode.description} />
    </div>
  );
};

export default PlateStage;

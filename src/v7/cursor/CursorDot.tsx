import React, { useEffect, useRef } from 'react';
import { materialAt, readField } from '../materials/field';
import { register } from '../runtime/scheduler';

/**
 * One 10px dot that inverts with the material under it. Fine pointers only.
 * Mechanisms opt into a shape with data-cursor="rotate|hairline|grab|focus" on their root.
 * Follows the raw pointer (a cursor must not lag); lighting uses the eased pointer store.
 */
export const CursorDot: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const lensCoordRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia('(pointer: fine)').matches) return;
    document.documentElement.classList.add('v7-cursor');
    let x = -100;
    let y = -100;
    let shape = '';
    let on = '';
    let field: ReturnType<typeof readField> | null = null;
    const task = register(() => {
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      const m = materialAt(x, y, field ?? readField());
      field = null;
      if (m !== on) {
        on = m;
        el.dataset.on = m;
      }
      return false;
    }, { budgeted: false, wakeOnVisible: false, measure: () => { field = readField(); } });
    const move = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const target = (e.target as Element | null)?.closest?.('[data-cursor]') as HTMLElement | null;
      const next = target?.dataset.cursor ?? '';

      if (next === 'magnetic' && target) {
        // Subtle magnetic pull (±4px) towards element center
        const rect = target.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = cx - e.clientX;
        const dy = cy - e.clientY;
        const pull = 0.16;
        x = e.clientX + Math.max(-4, Math.min(4, dx * pull));
        y = e.clientY + Math.max(-4, Math.min(4, dy * pull));
      } else {
        x = e.clientX;
        y = e.clientY;
      }

      // Update live lens coordinate readout if over a lens
      if (next === 'lens' && target && lensCoordRef.current) {
        const rect = target.getBoundingClientRect();
        const nx = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)).toFixed(2);
        const ny = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)).toFixed(2);
        lensCoordRef.current.textContent = `[${nx}, ${ny}]`;
      }

      el.dataset.visible = 'true';
      if (next !== shape) {
        shape = next;
        el.dataset.shape = next;
      }
      task.wake();
    };
    const leave = () => { el.dataset.visible = 'false'; };
    const scroll = () => task.wake();
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('scroll', scroll, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      task.dispose();
      document.documentElement.classList.remove('v7-cursor');
      window.removeEventListener('pointermove', move);
      window.removeEventListener('scroll', scroll);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="v7-cursor-dot" data-on="dark" data-visible="false" data-shape="">
      <span className="v7-cursor-mark v7-cursor-default on-material" />
      {/* Rotation arc over the Works wheel */}
      <svg className="v7-cursor-mark v7-cursor-rotate" viewBox="0 0 28 28" width="28" height="28">
        <path d="M 5 14 A 9 9 0 1 1 14 23" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M 2 11 L 5 15 L 8 11" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      {/* [DRAG · TURN] pill for wheel mode */}
      <span className="v7-cursor-mark v7-cursor-wheel font-mono text-[9px] tracking-wider px-1.5 py-0.5 border border-current rounded-[2px] whitespace-nowrap bg-[#03050A]/90 text-[var(--on-ink)]">
        DRAG · TURN
      </span>
      {/* Live [X, Y] normalized coordinate readout for lens mode */}
      <span
        ref={lensCoordRef}
        className="v7-cursor-mark v7-cursor-lens font-mono text-[9px] tracking-wider px-1.5 py-0.5 border border-[#FF2800] rounded-[2px] whitespace-nowrap bg-[#03050A]/95 text-[#FF2800]"
      >
        [0.00, 0.00]
      </span>
      {/* Vertical hairline over the waveform */}
      <span className="v7-cursor-mark v7-cursor-hairline" />
      {/* Grab hand over the orbit */}
      <svg className="v7-cursor-mark v7-cursor-grab" viewBox="0 0 28 28" width="28" height="28">
        <path
          d="M 9 14 V 8.5 a 1.5 1.5 0 0 1 3 0 V 13 V 6.5 a 1.5 1.5 0 0 1 3 0 V 13 V 7.5 a 1.5 1.5 0 0 1 3 0 V 13.5 V 10 a 1.5 1.5 0 0 1 3 0 V 16 c 0 4 -2.5 7 -6.5 7 c -3 0 -4.5 -1.5 -6 -4 l -2.5 -4.5 a 1.4 1.4 0 0 1 2.4 -1.4 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
      {/* Focus bracket in Now */}
      <svg className="v7-cursor-mark v7-cursor-focus" viewBox="0 0 28 28" width="28" height="28">
        <path d="M 3 9 V 3 H 9 M 19 3 H 25 V 9 M 25 19 V 25 H 19 M 9 25 H 3 V 19" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="14" cy="14" r="1.5" fill="currentColor" />
      </svg>
    </div>
  );
};

export default CursorDot;

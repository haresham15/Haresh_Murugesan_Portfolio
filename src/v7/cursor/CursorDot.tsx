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

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia('(pointer: fine)').matches) return;
    document.documentElement.classList.add('v7-cursor');
    let x = -100;
    let y = -100;
    let shape = '';
    let on = '';
    const task = register(() => {
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      const m = materialAt(x, y, readField());
      if (m !== on) {
        on = m;
        el.dataset.on = m;
      }
      return false;
    }, { budgeted: false, wakeOnVisible: false });
    const move = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      x = e.clientX;
      y = e.clientY;
      el.dataset.visible = 'true';
      const target = (e.target as Element | null)?.closest?.('[data-cursor]') as HTMLElement | null;
      const next = target?.dataset.cursor ?? '';
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
      <span className="on-material" />
    </div>
  );
};

export default CursorDot;

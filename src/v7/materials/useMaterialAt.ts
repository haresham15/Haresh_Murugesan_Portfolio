import { useEffect, useState, type RefObject } from 'react';
import { materialAt, onLayoutChange, readField, type Material } from './field';
import { register } from '../runtime/scheduler';

/**
 * Material under the centre of a fixed element, re-read on scroll and layout change.
 * Fixed UI (brand mark, nav rim) sets data-on={material} and crossfades in 180 ms.
 */
export function useMaterialAt(ref: RefObject<HTMLElement | null>): Material {
  const [material, setMaterial] = useState<Material>('dark');
  useEffect(() => {
    let current: Material = 'dark';
    const task = register(() => {
      const el = ref.current;
      if (!el) return false;
      const r = el.getBoundingClientRect();
      const next = materialAt(r.left + r.width / 2, r.top + r.height / 2, readField());
      if (next !== current) {
        current = next;
        setMaterial(next);
      }
      return false;
    }, { budgeted: false, wakeOnVisible: false });
    const wake = () => task.wake();
    window.addEventListener('scroll', wake, { passive: true });
    window.addEventListener('resize', wake);
    const off = onLayoutChange(wake);
    return () => {
      task.dispose();
      window.removeEventListener('scroll', wake);
      window.removeEventListener('resize', wake);
      off();
    };
  }, [ref]);
  return material;
}

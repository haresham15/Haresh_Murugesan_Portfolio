/**
 * Technical Index: the tool wall (light section, blueprint §6 + Decisions §2).
 *
 * Debossed titanium glyphs stand on five hairline rules, one per skills.ts domain. The
 * pointer is a lamp: glyphs within 120 px brighten by distance. Hover or focus a tool and
 * the projects that used it stay ink while the rest drop to 25%, with cobalt hairlines
 * drawn to each; hover a name and its tools ignite. Click or tap pins a tool; Esc clears.
 *
 * The mapping comes from ./toolMap (derived from the content files), icons from
 * ./icons.generated (paths only; no icon package ships to the client).
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Reveal } from '../../components/ThemeSection';
import { useMotionPreference } from '../../components/MotionPreference';
import { register } from '../runtime/scheduler';
import { getPointer, subscribePointer } from '../runtime/pointer';
import { toolWall, type WallTool } from './toolMap';
import { TOOL_ICONS, type ToolIcon } from './icons.generated';
import styles from './toolWall.module.css';

const LAMP_RADIUS = 120;
const SVG_NS = 'http://www.w3.org/2000/svg';

type Selection = { kind: 'tool'; id: string } | { kind: 'name'; key: string } | null;

const toolsById = new Map<string, WallTool>(toolWall.rows.flatMap((r) => r.tools).map((t) => [t.id, t]));
const nameByKey = new Map(toolWall.names.map((n) => [n.key, n]));

const selKey = (s: Selection) => (s ? (s.kind === 'tool' ? `t:${s.id}` : `n:${s.key}`) : '');

/** Mono letters at the weight of the marks, for tools with no official mark (FAISS, OSRM, ...). */
const MONO_SIZE = [0, 12, 12, 9.5, 8, 6.8];

const Glyph: React.FC<{ icon: ToolIcon }> = ({ icon }) => (
  <svg className={styles.glyph} viewBox={icon.viewBox} aria-hidden="true" focusable="false">
    {icon.kind === 'path' ? (
      <path d={icon.d} />
    ) : (
      <text
        x="12"
        y="12.5"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily='"Geist Mono", ui-monospace, monospace'
        fontWeight={600}
        fontSize={MONO_SIZE[Math.min(icon.text.length, 5)]}
      >
        {icon.text}
      </text>
    )}
  </svg>
);

export const ToolWallSection: React.FC = () => {
  const { isReduced } = useMotionPreference();
  const [hover, setHover] = useState<Selection>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [roving, setRoving] = useState<Record<string, number>>({});

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<SVGGElement>(null);
  const toolEls = useRef(new Map<string, HTMLButtonElement>());
  const nameEls = useRef(new Map<string, HTMLAnchorElement>());

  const active: Selection = hover ?? (pinned ? { kind: 'tool', id: pinned } : null);
  const activeKey = selKey(active);

  const { litTools, litNames } = useMemo(() => {
    const tools = new Set<string>();
    const names = new Set<string>();
    if (active?.kind === 'tool') {
      tools.add(active.id);
      toolsById.get(active.id)?.links.forEach((l) => names.add(l.key));
    } else if (active?.kind === 'name') {
      names.add(active.key);
      nameByKey.get(active.key)?.toolIds.forEach((id) => tools.add(id));
    }
    return { litTools: tools, litNames: names };
    // activeKey captures `active` fully.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey]);

  const activeTool = active?.kind === 'tool' ? toolsById.get(active.id) : undefined;

  // ---- Cobalt hairlines: drawn imperatively so a hover never re-renders the overlay ----
  const drawLines = useCallback(() => {
    const g = linesRef.current;
    const stage = stageRef.current;
    if (!g || !stage) return;
    while (g.firstChild) g.removeChild(g.firstChild);
    const pairs: [HTMLElement, HTMLElement][] = [];
    if (active?.kind === 'tool') {
      const tool = toolEls.current.get(active.id);
      toolsById.get(active.id)?.links.forEach((l) => {
        const name = nameEls.current.get(l.key);
        if (tool && name) pairs.push([tool, name]);
      });
    } else if (active?.kind === 'name') {
      const name = nameEls.current.get(active.key);
      nameByKey.get(active.key)?.toolIds.forEach((id) => {
        const tool = toolEls.current.get(id);
        if (tool && name) pairs.push([tool, name]);
      });
    }
    const s = stage.getBoundingClientRect();
    for (const [tool, name] of pairs) {
      const t = tool.getBoundingClientRect();
      const n = name.getBoundingClientRect();
      // Only when the names sit beside the wall; stacked on phones, the dimming carries it.
      if (n.left < t.right + 24) continue;
      const x0 = t.left + t.width / 2 - s.left;
      const y0 = t.top - 6 - s.top;
      const x1 = n.left - 10 - s.left;
      const y1 = n.top + n.height / 2 - s.top;
      const path = document.createElementNS(SVG_NS, 'path');
      path.setAttribute('d', `M${x0} ${y0}C${x0} ${y0 - 36} ${x1 - 96} ${y1} ${x1} ${y1}`);
      path.setAttribute('pathLength', '1');
      path.setAttribute('class', styles.line);
      g.appendChild(path);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey]);

  useEffect(() => {
    drawLines();
  }, [drawLines]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => drawLines());
    ro.observe(stage);
    return () => ro.disconnect();
  }, [drawLines]);

  // ---- The lamp: one scheduler task, woken by the shared pointer and by scroll ----
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const els = [...toolEls.current.values()];
    const reset = () => els.forEach((el) => el.style.removeProperty('--lamp'));
    if (isReduced) {
      reset();
      return;
    }
    let centers: { el: HTMLElement; x: number; y: number; v: number }[] = [];
    const measure = () => {
      const sx = window.scrollX;
      const sy = window.scrollY;
      centers = els.map((el) => {
        const r = el.getBoundingClientRect();
        return { el, x: r.left + r.width / 2 + sx, y: r.top + r.height / 2 + sy, v: -1 };
      });
    };
    const task = register(
      () => {
        const p = getPointer();
        const live = p.inside && p.kind !== 'touch';
        const sx = window.scrollX;
        const sy = window.scrollY;
        for (const c of centers) {
          let v = 0;
          if (live) {
            const d = Math.hypot(p.x - (c.x - sx), p.y - (c.y - sy));
            if (d < LAMP_RADIUS) v = Math.round((1 - d / LAMP_RADIUS) * 20) / 20;
          }
          if (v !== c.v) {
            c.v = v;
            if (v === 0) c.el.style.removeProperty('--lamp');
            else c.el.style.setProperty('--lamp', String(v));
          }
        }
        return false; // one pass per wake; sleeps until the pointer or page moves
      },
      { element: section, budgeted: false },
    );
    measure();
    const wake = () => task.wake();
    const remeasure = () => {
      measure();
      task.wake();
    };
    const off = subscribePointer(wake);
    window.addEventListener('scroll', wake, { passive: true });
    section.addEventListener('pointerenter', remeasure);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(remeasure) : null;
    ro?.observe(section);
    return () => {
      off();
      window.removeEventListener('scroll', wake);
      section.removeEventListener('pointerenter', remeasure);
      ro?.disconnect();
      task.dispose();
      reset();
    };
  }, [isReduced]);

  // ---- Input ----
  const clearHover = (match: Selection) => setHover((h) => (selKey(h) === selKey(match) ? null : h));

  const onSectionKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && (pinned || hover)) {
      setPinned(null);
      setHover(null);
    }
  };

  const onToolKey = (e: React.KeyboardEvent, rowIndex: number, index: number) => {
    const rows = toolWall.rows;
    let r = rowIndex;
    let i = index;
    switch (e.key) {
      case 'ArrowRight': i = (index + 1) % rows[r].tools.length; break;
      case 'ArrowLeft': i = (index - 1 + rows[r].tools.length) % rows[r].tools.length; break;
      case 'Home': i = 0; break;
      case 'End': i = rows[r].tools.length - 1; break;
      case 'ArrowDown': r = Math.min(rowIndex + 1, rows.length - 1); i = Math.min(index, rows[r].tools.length - 1); break;
      case 'ArrowUp': r = Math.max(rowIndex - 1, 0); i = Math.min(index, rows[r].tools.length - 1); break;
      default: return;
    }
    e.preventDefault();
    const id = rows[r].tools[i].id;
    setRoving((s) => ({ ...s, [rows[r].id]: i }));
    toolEls.current.get(id)?.focus();
  };

  const toolState = (id: string) => {
    if (litTools.has(id)) return 'on';
    if (active?.kind === 'name') return 'dim';
    return 'rest';
  };

  const readout = (() => {
    if (!activeTool) return null;
    const names = activeTool.links.map((l) => l.name);
    return (
      <>
        <span className="block font-serif italic text-[1.375rem] leading-snug text-[var(--mat-ink)]">{activeTool.name}</span>
        {names.length > 0 ? (
          <span className="sr-only-v7">Used in {names.join(', ')}.</span>
        ) : (
          <span className="mt-1 block font-sans text-sm text-[var(--mat-muted)] [font-weight:var(--mat-body-weight)] [letter-spacing:var(--mat-tracking)]">
            Hands-on, outside shipped work.
          </span>
        )}
      </>
    );
  })();

  return (
    <section
      id="skills"
      ref={sectionRef}
      aria-labelledby="tool-wall-title"
      onKeyDown={onSectionKey}
      className={`relative w-full ${isReduced ? styles.reduced : ''}`}
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* The first rule continues the Syntinuum baseline. */}
        <div
          ref={stageRef}
          className="relative grid grid-cols-1 gap-x-12 border-t border-[var(--mat-rule)] lg:grid-cols-[minmax(0,1fr)_17rem] lg:grid-rows-[auto_1fr] xl:grid-cols-[minmax(0,1fr)_20rem] xl:gap-x-16"
        >
          <div className="pt-8 lg:col-start-2 lg:row-start-1">
            <h2 id="tool-wall-title" className="font-serif text-3xl font-normal leading-tight tracking-[-0.01em] text-[var(--mat-ink)] lg:text-4xl">
              Technical Index
            </h2>
            <p className="sr-only-v7">
              Each tool links to the projects and roles that used it. Hover or focus a tool to highlight them, press Enter
              to pin it, and Escape to clear. Arrow keys move between tools.
            </p>
          </div>

          {/* Five shelves */}
          <div className="lg:col-start-1 lg:row-span-2 lg:row-start-1">
            {toolWall.rows.map((row, rowIndex) => {
              const titleId = `tool-row-${row.id}`;
              const current = roving[row.id] ?? 0;
              return (
                <Reveal
                  key={row.id}
                  delay={rowIndex * 0.05}
                  y={12}
                  className="flex flex-col gap-4 border-b border-[var(--mat-rule)] pt-10 sm:flex-row sm:items-end sm:gap-10"
                >
                  <h3
                    id={titleId}
                    className="font-mono leading-[1.35] text-[var(--mat-muted)] sm:w-[8.5rem] sm:shrink-0 sm:pb-0.5"
                    style={{ fontSize: 'var(--label-size)' }}
                  >
                    {row.title}
                  </h3>
                  <div
                    role="toolbar"
                    aria-labelledby={titleId}
                    className="flex flex-1 flex-wrap content-end gap-x-10 gap-y-6 sm:gap-x-14"
                  >
                    {row.tools.map((tool, index) => (
                      <button
                        key={tool.id}
                        type="button"
                        ref={(el) => {
                          if (el) toolEls.current.set(tool.id, el);
                          else toolEls.current.delete(tool.id);
                        }}
                        className={`${styles.tool} rm-crossfade`}
                        data-state={toolState(tool.id)}
                        aria-label={tool.name}
                        aria-pressed={pinned === tool.id}
                        tabIndex={index === current ? 0 : -1}
                        onPointerEnter={(e) => e.pointerType !== 'touch' && setHover({ kind: 'tool', id: tool.id })}
                        onPointerLeave={(e) => e.pointerType !== 'touch' && clearHover({ kind: 'tool', id: tool.id })}
                        onFocus={(e) => {
                          setRoving((s) => (s[row.id] === index ? s : { ...s, [row.id]: index }));
                          if (e.currentTarget.matches(':focus-visible')) setHover({ kind: 'tool', id: tool.id });
                        }}
                        onBlur={() => clearHover({ kind: 'tool', id: tool.id })}
                        onClick={() => setPinned((p) => (p === tool.id ? null : tool.id))}
                        onKeyDown={(e) => onToolKey(e, rowIndex, index)}
                      >
                        <Glyph icon={TOOL_ICONS[tool.id]} />
                        <span className={styles.tick} aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Proven in: the other half of the mechanism */}
          <div className="pb-2 pt-10 lg:col-start-2 lg:row-start-2 lg:pt-4">
            <p aria-live="polite" className="min-h-[3.5rem]">
              {readout}
            </p>
            <Reveal y={12}>
              <ul aria-label="Projects and roles" className="mt-2">
                {toolWall.names.map((n) => (
                  <li key={n.key}>
                    <Link
                      href={n.href}
                      ref={(el: HTMLAnchorElement | null) => {
                        if (el) nameEls.current.set(n.key, el);
                        else nameEls.current.delete(n.key);
                      }}
                      className={`${styles.name} rm-crossfade font-sans text-[15px] leading-snug`}
                      data-state={active && !litNames.has(n.key) ? 'dim' : 'rest'}
                      onPointerEnter={(e) => e.pointerType !== 'touch' && setHover({ kind: 'name', key: n.key })}
                      onPointerLeave={(e) => e.pointerType !== 'touch' && clearHover({ kind: 'name', key: n.key })}
                      onFocus={(e) => e.currentTarget.matches(':focus-visible') && setHover({ kind: 'name', key: n.key })}
                      onBlur={() => clearHover({ kind: 'name', key: n.key })}
                    >
                      {n.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
            <g ref={linesRef} />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default ToolWallSection;

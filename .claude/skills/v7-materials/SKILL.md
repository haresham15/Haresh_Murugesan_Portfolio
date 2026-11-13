---
name: v7-materials
description: Portfolio V7 material rules. Use before writing or styling any home-page section, canvas palette, icon, or text in this repo. Covers the dark forged-carbon and light white-silver weave materials, the --mat-* tokens, contrast limits, type sizes, and the unboxed rule with its automated check.
---

# V7 materials

Spec: `docs/v7-blueprint.md` (the Decisions appendix overrides sections 0–9).

## The two materials

| | Dark forged carbon | Light white-silver weave |
|---|---|---|
| Meaning | Things that run live | Things you study |
| Ground | `#03050A` obsidian chips | `#F4F6F9` tows, `#EAEFF5` gaps |
| Ink | `#F4F6F9` alabaster | `#050811` |
| Muted | `#7E8B9B` | `#475569` |
| Highlight / shadow | — | `#FFFFFF` / `#CBD5E1` |
| Accents | `#FF2800`, `#2563EB` | `#FF2800` (marks, ≥24px type), `#153875` |

Both are drawn by one fixed WebGL2 canvas (`src/v7/carbon/CarbonField.tsx`). **Sections are transparent.** Never paint a section background, never put a canvas on an opaque fill. The weave's luminance variation stays under 4% L*, so ink holds about 17:1 anywhere on it.

## How a section declares its material

`src/App.tsx` wraps each section in `<MaterialSection material="dark|light">`, which renders `data-material-region data-material=…`. Inside your section:

- Read colours from the material tokens, never hard-coded hex classes:
  `var(--mat-ink)`, `var(--mat-body)`, `var(--mat-muted)`, `var(--mat-rule)`, `var(--mat-rule-strong)`,
  `var(--mat-accent-text)` (small accent text), `var(--mat-accent-mark)` (rules, marks, type ≥24px),
  `var(--mat-cobalt)`, `var(--mat-body-weight)`, `var(--mat-tracking)`.
  In Tailwind: `text-[var(--mat-ink)]`, `border-[var(--mat-rule)]`.
- A dark object inside a light section (the Works wheel) sets `data-material="dark"` on its own root; the tokens re-scope beneath it.
- Canvas code reads the palette from a `palette` prop or from `getComputedStyle(el).getPropertyValue('--mat-ink')` on mount. Give every canvas a light and a dark palette.
- The legacy bridge at the bottom of `src/v7/materials/materials.css` remaps old hex classes in light regions. New code must not depend on it.

Primitive tokens (in `materials.css`, `:root`): `--weave-base #F4F6F9`, `--weave-gap #EAEFF5`, `--weave-highlight #FFFFFF`, `--weave-shadow #CBD5E1`, `--weave-glint #BFD4FF`, `--ink #050811`, `--titanium-ink #475569`. Existing tokens in `src/index.css` (`--bg-midnight`, `--cobalt-*`, `--metal-*`, `--accent-*`, easing, durations) are unchanged. Add tokens; never rename.

## Contrast

- Body text ≥ 4.5:1 on both materials. Ink on weave ≈ 17:1; alabaster on carbon ≈ 18:1; `#475569` on weave ≈ 6.6:1; `#7E8B9B` on carbon ≈ 5.9:1.
- `#FF2800` on the weave is ≈ 3.5:1: on light, use it **only** for type 24px and larger, for rules and for marks. Small accent text on light is `#153875` (`--mat-accent-text` does this for you).
- Never render text in `#060A12` on dark.

## Type

- Families: Geist (sans), Geist Mono, Geist Serif (display). No new fonts.
- Display: `font-size: var(--display-size)` = `clamp(3rem, 7vw, 7.5rem)`, Geist Serif, weight 400.
- Labels: one mono size, `var(--label-size)` = 12px. **At most one mono label per section.**
- Body on light: weight one step heavier (`var(--mat-body-weight)` = 500) and tracking `-0.005em`; on dark: 400 and `+0.01em`. Use `font-weight: var(--mat-body-weight); letter-spacing: var(--mat-tracking)`.
- One label per object; nothing is named twice. No text explains how to interact: hints go in `.sr-only-v7` (visually hidden) text, never deleted.

## Nothing in a box (the unboxed rule)

No canvas, diagram, waveform or medallion may have a background, border, radius or shadow of its own.

- Canvases are transparent and draw only their own marks. Fade edges with alpha in the drawing code, not a CSS mask.
- Boundaries come from the graphic's own geometry: an axis, a baseline, a tick ruler, four corner ticks.
- Separation is space plus at most one hairline rule (`border-t` or `border-b`, 1px, `var(--mat-rule)`). No cards, tiles, chips, pills, tab bars or pager bars.
- Banned (AGENTS.md): `rounded-xl/2xl/3xl`, boxes inside boxes, `border-l-2` accent stripes, all-caps HUD tags, emoji bullets. Separate stack items with ` · `.

**Automated check** (Phase 3 script; run it in the browser console now to self-check):

```js
[...document.querySelectorAll('main *')].filter((el) => {
  const r = el.getBoundingClientRect(); if (r.width <= 200 || r.height <= 100) return false;
  const cs = getComputedStyle(el);
  const sides = ['Top','Right','Bottom','Left'].filter((s) => parseFloat(cs[`border${s}Width`]) > 0 && cs[`border${s}Style`] !== 'none');
  const hairline = sides.length === 1 && parseFloat(cs[`border${sides[0]}Width`]) <= 1;
  const m = cs.backgroundColor.match(/rgba?\(([^)]+)\)/); const c = m ? m[1].split(',').map(Number) : [];
  const opaque = c.length === 3 || (c.length === 4 && c[3] >= 0.99);
  return (sides.length && !hairline) || cs.boxShadow !== 'none' || opaque;
});
```

It must return an empty array. A single border on one side, ≤1px, is a hairline and passes; two or more sides, any box-shadow, or any opaque background fail.

## Seams

Sections are separated by 70vh seams (`<Seam>` in `src/v7/seams/Region.tsx`). Seams hold no text. Do not add top or bottom padding to compensate for them; a section starts where its content starts.

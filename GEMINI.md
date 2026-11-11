# GEMINI.md — Workspace Design & De-Slopification Constitution
# Haresh Murugesan Portfolio V4.0 — Swiss Architectural Grid & Zero-Box System

## 1. The 10-Point Deep De-Slopification Rules (Mandatory Purge)
1. **BAN `rounded-xl`, `rounded-2xl`, and `rounded-3xl` Card Containers**: All cards and boxes are strictly zero-radius (`rounded-none`) or subtle machined 2px bevel (`rounded-[2px]`).
2. **BAN "Boxes Inside Boxes"**: Never nest bordered sub-cards inside bordered parent containers.
3. **BAN Decorative Side-Stripe Cards (`border-l-2 border-orange-*`)**: Eliminate arbitrary colored left stripes. Use typography, indentation, and grid lines.
4. **BAN Repetitive All-Caps Eyebrows + Colored Dots (`● S1 // ...`)**: Use quiet marginalia index numbers (`01`–`09`) in the structural grid gutter.
5. **BAN Formulaic Two-Line Italic/Colored Headings**: Use natural, concise editorial headings (`Selected Works.`, `Experience.`, `Syntinuum.`, `Technical Index.`, `Recognition.`, `Trajectory.`, `Field Notes.`).
6. **BAN Icon-in-a-Box Grids**: Icons never sit inside bordered square tiles; render frameless vector marks inline with labels.
7. **BAN Unrequested Radial Glow Patches**: Eliminate gratuitous `blur-3xl` radial blobs.
8. **BAN Monospace Overuse**: Restrict `Geist Mono` to tabular figures, metrics, years, and coordinates—never for body prose or buttons.
9. **BAN Cramped Pill Tags**: Eliminate walls of `rounded-full` pills. Separate stack items with middle dots (`ARKit · Metal · CoreML · Swift`).
10. **BAN Duplicate Closing Blocks**: Ensure the contact statement and calls to action render once with clean authority.

---

## 2. Global Design Tokens (DTCG 3-Tier & OKLCH)
- **Deep Obsidian Base**: `#03050A` (Midnight Obsidian) — never muddy or washed-out greys.
- **Secondary Depth**: `#060A12`.
- **Cobalt Palette**: Deep `#0B1E40`, Mid `#153875`, Electric Highlight `#2563EB`.
- **Metallic Silver**: Machined Silver `#C8D2E0`, High-Luster Chrome `#E6ECF5`, Titanium `#7E8B9B`.
- **Accent Reddish-Orange**: Primary `#FF2800`, Glow `#FF4419`.
- **Text Alabaster**: `#F4F6F9`.
- **Forbidden Invariant**: Never render black `#060A12` text inside dark sections (About, Now, Skills).

---

## 3. 0px Swiss Architectural Blueprint Grid Rules
- **Continuous Hairlines**: Structural frame bounded by `1px solid rgba(24, 69, 139, 0.20)` or `1px solid rgba(200, 210, 224, 0.10)`. Outer bounds pinned to `max-w-[1440px] mx-auto`.
- **Crosshair Fiducials (`+`)**: Precision 9×9px `<GridCrosshair />` marks at major structural intersections.
- **Shared Walls**: Adjacent cells share dividing rules (`divide-x divide-y divide-[#18458B]/20`).
- **Surface Elevation on Hover**: Transitions background subtly over 180ms with refined top hairline illumination.

---

## 4. Section Architecture & Components
- **Hero**: `100vw × 100dvh` stage with Concept D hybrid background, 45° pear SDF ASCII lightbulb with continuous DNA and supersonic plume.
- **Header**: Fixed `[HM]` badge + `Haresh Murugesan` with 7-layer parametric SVG WheelNavTrigger and burnout smoke canvas emitter.
- **Selected Works**: Unboxed 38/62 exhibition spreads with interactive plates for Healios V2 (3D LiDAR + Grad-CAM lens), Apexis (60fps worker budget), RouteRx (isochrones & transit matrix), and Tempo (ring buffer).
- **Systems CodeGraph**: Linear rabbit-hole camera progression (Depth 0 → 1 → 2 → 3) with physical world translation and 1-click step-back trail.
- **Experience**: Top-to-bottom Grand Prix circuit with 5 verified apexes and forward-only wrap-around kinematics.
- **Recognition**: 3D Machined Medallion Carousel (5 medallions, 310px diameter, 72-tooth knurled silver bezel, glowing `#FF2800` ring, ±15° tilt).
- **Syntinuum**: Living audio waveform in `#FF2800`, `#2563EB`, `#C8D2E0` with gliding DNA-lightbulb selector.
- **Technical Index**: 5 engineering domains with borderless shared-wall layout.
- **About**: 40/60 portrait/narrative ratio and standalone clinical pathology artifact plate with 8.09ms Grad-CAM metric.
- **Trajectory & Field Notes**: Unboxed staggered editorial chronology and asymmetric dispatch.
- **Contact**: Monumental serif statement with 3-tier action hierarchy and clean colophon.

---

## 5. Verification Gate
```bash
npm run typecheck        # tsc --noEmit
npm run validate-content # node scripts/validate-content.mjs
npm run build            # Next.js static export
npx vercel deploy --prod --yes # Production promotion
```

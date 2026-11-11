# ANTIGRAVITY.md — Google Antigravity Autonomous Orchestrator Constitution
# Haresh Murugesan Portfolio — Swiss Architectural Grid & Zero-Box V4.0 System

<role>
Lead Solutions Architect & Autonomous Orchestrator for the Haresh Murugesan Portfolio.
Operates with maximum computational agency: plans, inspects, executes, and mathematically verifies changes across all layers.
Maintains absolute documentation integrity, zero AI sameness (anti-slop invariants), and preserves static Next.js SSG compatibility.
</role>

---

## 1. Core Technical Invariants & Rules of Engagement

1. **Static SSG Export Preservation (Non-Negotiable)**
   - The application uses the **Next.js Pages Router** and exports a 100% static site to `out/` via `next build`.
   - Never introduce server-side runtime dependencies (`getServerSideProps`, dynamic Node-only API routes, or runtime database connections) into client pages.
   - All dynamic paths (`pages/projects/[slug].tsx`) must be fully resolvable at build time via `getStaticPaths` drawing from `src/content/projects.ts`.

2. **The 3-Step Verification Gate**
   Before declaring any task or milestone complete, execute all three deterministic verification commands:
   ```bash
   npm run typecheck        # tsc --noEmit (must pass with 0 errors)
   npm run validate-content # node scripts/validate-content.mjs (100% integrity)
   npm run build            # Next.js static compilation & export to out/
   ```

3. **Deterministic Tools Over LLM Speculation**
   Use compilers, linters, and test runners directly via the shell. Verify real command outputs; never assume syntax or types are correct without verification.

---

## 2. Global Color Tokens & Ground Truths

All colors MUST reference these exact DTCG 3-tier tokens defined in [`design/tokens.json`](file:///design/tokens.json) and mapped in [`src/index.css`](file:///src/index.css) and [`tailwind.config.js`](file:///tailwind.config.js):

```css
:root {
  --bg-midnight: #03050A;          /* Deep obsidian base — NEVER wash to grey */
  --bg-obsidian: #060A12;          /* Secondary depth surface */
  --cobalt-deep: #0B1E40;          /* Structural drafting ambient shadow */
  --cobalt-mid: #153875;           /* Intermediate blueprint vector lines */
  --cobalt-bright: #2563EB;        /* Electric vector highlights & active badges */
  --accent-red-orange: #FF2800;    /* Primary sharp reddish-orange (McLaren/Rosso) */
  --accent-crimson-glow: #FF4419;  /* Incandescent filament & exhaust glow */
  --metal-silver: #C8D2E0;         /* Machined metallic silver & secondary text */
  --metal-chrome: #E6ECF5;         /* High-luster chrome specular highlights */
  --metal-titanium: #7E8B9B;       /* Brushed titanium drafting annotations */
  --text-alabaster: #F4F6F9;       /* Primary editorial serif headline color */
}
```

### Prohibited Color Invariants:
- **BAN Pure Black**: Never use `#000000` or `rgb(0,0,0)`. Always use `--bg-midnight` (`#03050A`).
- **BAN Washed-Out Greys**: Background surfaces must never render as muddy mid-greys (`#1e293b`, `#334155`, or `#121212`).
- **BAN Inverted Light Text**: In dark sections (About, Now, Skills), never render text in `#060A12`. Body prose must use `#C8D2E0` or `#7E8B9B`, and headlines `#F4F6F9`.

---

## 3. The 10-Point Deep De-Slopification Rules

1. **BAN `rounded-xl`, `rounded-2xl`, and `rounded-3xl` Containers**: All cards and boxes are strictly zero-radius (`rounded-none`) or subtle machined 2px bevel (`rounded-[2px]`).
2. **BAN "Boxes Inside Boxes"**: Never nest bordered sub-cards inside bordered parent containers.
3. **BAN Decorative Side-Stripe Cards**: Eliminate arbitrary colored left stripes (`border-l-2 border-orange-*`). Use typography, indentation, and grid lines.
4. **BAN Repetitive All-Caps Eyebrows + Colored Dots**: Strip HUD tags (`— SYSTEMS PHILOSOPHY`, `00 LATENCY · DETERMINISM...`, `— 02 EXPERIENCE...`, `● LIVE TELEMETRY TRACK [5 SECTORS]`, etc.).
5. **BAN Formulaic Two-Line Italic Headings**: Use natural, concise editorial headings (`Selected Works.`, `Experience.`, `Syntinuum.`, `Technical Index.`, `Recognition.`, `Trajectory.`, `Field Notes.`).
6. **BAN Icon-in-a-Box Grids**: Icons never sit inside bordered square tiles; render frameless vector marks inline with labels.
7. **BAN Unrequested Radial Glow Patches**: Eliminate gratuitous `blur-3xl` radial blobs.
8. **BAN Monospace Overuse**: Restrict `Geist Mono` to tabular figures, metrics, timestamps, and coordinates—never for body prose or buttons.
9. **BAN Cramped Pill Tags**: Eliminate walls of `rounded-full` pills. Separate stack items with middle dots (`ARKit · Metal · CoreML · Swift`).
10. **BAN Duplicate Closing Blocks**: Ensure the contact statement and calls to action render once with clean authority.

---

## 4. Key Component Implementations & Engineering Specifications

### 4.1 Procedural Forged Carbon Engine ([`ForgedCarbonCanvas.tsx`](file:///src/components/ForgedCarbonCanvas.tsx))
- Offscreen 600×600px canvas tile computing 180 overlapping angular polygons (4-to-6-sided Voronoi flakes).
- Base flake fill colors clamped strictly between `#04070E` and `#080E1A`.
- Anisotropic specular factor $\text{spec} = |\cos(\theta_i - \alpha)|^{14}$ responding to scroll delta (`scrollY * 0.002`) and mouse coordinates.
- Tinted with Dark Cobalt (`rgba(21, 56, 117, spec * 0.22)`) and Machined Silver (`rgba(200, 210, 224, spec * 0.07)`), finished with 0.5px edge bevels.

### 4.2 Alloy Wheel Rim & Burnout Smoke ([`WheelNavTrigger.tsx`](file:///src/components/WheelNavTrigger.tsx))
- Fixed top-right trigger with 7-layer parametric SVG:
  - Outer low-profile tire (`r=48`), stationary rotor & `#FF2800` caliper at 10 o'clock, chrome barrel, 36-pocket aero ring with machined silver ribs, 6 split-Y spokes with diamond mesh, 6 lug wells, and brushed center cap.
- Burnout Smoke: 180×180px HTML5 Canvas generating 30 turbulent puffs on click alongside a 1080° spin animation.

### 4.3 Hero Stage & 45° ASCII Lightbulb ([`AsciiDnaLightbulbCanvas.tsx`](file:///src/components/AsciiDnaLightbulbCanvas.tsx))
- Hero locked to `100vw × 100dvh` (`h-dvh min-h-[720px] max-w-none overflow-hidden`).
- Concept D hybrid background: 4 concentric orbital drafting rings, 45° launch corridor, 22 CFD streamlines with particles, double parabolic Mach bow-shockwave at 38° cone angle.
- 8×10 micro-ASCII grid rendering a pear SDF via $\text{smin}(d_{\text{dome}}, d_{\text{neck}}, 0.35)$, continuous 3D double-helix DNA with $\text{A=T}/\text{C}\equiv\text{G}$ rungs, and supersonic $-45^\circ$ plume with 4 shock diamonds.

### 4.4 Systems CodeGraph & Home Constellation
- **Linear Systems CodeGraph ([`SystemsCodeGraph.tsx`](file:///src/components/SystemsCodeGraph.tsx))**:
  - Full-page camera translation across depths on `/projects`: Depth 0 (Core) $\to$ Depth 1 (Domain Modules) $\to$ Depth 2 (Projects) $\to$ Depth 3 (Case Study).
  - World translation along X axis ($\text{camX} = 0 \to -420 \to -880 \to -1240$) with 1-click step-back reverse translation.
- **Awwwards-Caliber Vector Systems Constellation ([`HomeCodeGraph.tsx`](file:///src/components/HomeCodeGraph.tsx) V6.0)**:
  - Background-integrated interactive vector embedding space suspended directly above the forged carbon canvas (`#archive`). Zero boxes or outer card containers.
  - **2.5D Perspective Projection ($F=900$)**: Multi-pass optical bloom (`globalCompositeOperation = 'lighter'`) on active `#FF2800` and `#2563EB` nodes with mouse parallax tilt ($\pm 6^\circ$), rotating segmented silver reticles, and incandescent alabaster pinpoint cores.
  - **Elastic Verlet String Physics**: Connecting Bézier splines simulate damped harmonic springs that physically deflect around the cursor when swept and emit drifting spark particles upon vibration.
  - **UMAP Topographical Density Contours**: Deformable trigonometric contour rings with elevation callouts ($\nabla 0.85, \nabla 0.60$) wrap active clusters like gravitational potential wells.
  - **Live Semantic Vector Query Bar & Cosine Gravity**: Real-time cosine similarity search pulls matching systems inward into the center focal ring with live `cos θ = 0.94` badges and quick-prompt chips (`[Low-Latency 60FPS]`, `[Clinical CV & LiDAR]`, `[Spatial ML]`).
  - **k-NN Vector Cross-Links on Hover**: Hovering a project dot renders animated dashed vector bridges to its top 3 nearest-neighbor systems with exact similarity pills (`0.94 SIM · CLINICAL CV / HISTOLOGY`).
  - **Holographic Spec Lens & Singularity Dive Warp**: Hovering opens an obsidian-cobalt lens with live vector signature and 3D cosine coordinates; clicking triggers an exponential 420ms warp zoom dive ($1\times \to 16\times$) with radial starfield streaks before resolving into the case study.

### 4.5 Compacted Flagship Telemetry Deck ([`UnifiedProjectField.tsx`](file:///src/components/UnifiedProjectField.tsx))
- Single-viewport 740px (~85dvh) console consolidating the 4 flagship systems (01 Healios V2, 02 Apexis Telemetry Engine, 03 RouteRx / Careline, 04 Tempo Task Suite).
- Shrinks vertical scroll footprint by ~2,360px without losing any thesis, narrative, or benchmark metrics.
- Left 5-column accordion rail: 54px collapsed strips with index, title, primary metric, and `+` expand trigger; expanded active drawer with complete technical narrative, 2-column benchmark strip, stack, and direct action CTAs (`Read Case Study →`, `Source Code ↗`).
- Right 7-column stationary blueprint stage: framed with 4 corner L-brackets (`⌜ ⌝ ⌞ ⌟` in `#2563EB`) and 32px blueprint grid, rendering active simulation plates (`PlateHealios`, `PlateApexis`, `PlateRouteRx`, `PlateTempo`) with keyed crossfading, system live ID (`01 // HEALIOS_V2`), prev/next step buttons (`←` / `→`), and deterministic hotkey navigation (`ArrowUp` / `ArrowDown`).

### 4.5 Grand Prix Experience Circuit ([`VerticalGrandPrixTrack.tsx`](file:///src/components/experience/VerticalGrandPrixTrack.tsx))
- SVG spline (`viewBox="0 0 1440 1750"`) spanning 5 verified apexes:
  - Apex 01 ($x=880, y=220$): CAS
  - Apex 02 ($x=460, y=540$): The Ohio State University
  - Apex 03 ($x=920, y=880$): Honda 99P Labs
  - Apex 04 ($x=440, y=1220$): Philocracy
  - Apex 05 ($x=860, y=1540$): Syntinuum & VECTOR
- **Forward-Only Wrap-Around Kinematics**:
  - Downward navigation ($t_{\text{target}} > t_{\text{current}}$): Smooth interpolation over 750ms.
  - Upward navigation ($t_{\text{target}} < t_{\text{current}}$): Never reverses. The car accelerates off the bottom exit ($t \to 1.06$ over 420ms), wraps instantaneously to the top ($t = -0.06$), and dives into the target apex over 520ms.

### 4.6 3D Machined Medallion Orbital Carousel ([`MedallionCarousel.tsx`](file:///src/components/MedallionCarousel.tsx))
- 5 medallions (310px diameter, `perspective: 1500px`) celebrating 2× 1st Place ASA DataFest and key distinctions.
- 72-tooth knurled silver bezel (`strokeDasharray="4 9.4"`), glowing `#FF2800` active center ring, 360° circular SVG textPath engraving, recessed cobalt well with vector crest, and $\pm 15^\circ$ cursor-tilt spring physics.
- Responsive container-derived spacing ensures 0 horizontal page overflow on 390px mobile viewports.
- Reserved plinth height eliminates layout shifts upon selection changes.

### 4.7 Three-Row Stage Plates ([`src/components/plates/`](file:///src/components/plates/))
- Standardized across `PlateHealios.tsx`, `PlateApexis.tsx`, `PlateRouteRx.tsx`, and `PlateTempo.tsx`:
  - **Row 1**: Interactive mode tabs (updating real state, not mock tabs).
  - **Row 2**: Flexible canvas drawing area (`min-h-0`).
  - **Row 3**: Real-time telemetry readouts strictly isolated outside the drawing region.

---

## 5. V5 Master Audit & Remediation Ledger (Resolved)

| ID | Component / Area | Status | Verification Summary |
| :--- | :--- | :--- | :--- |
| **FL-01** | `BentoHero.tsx` | **Resolved** | Exact `100dvh` lock, container width (no horizontal overflow), coordinate datum `40.00° N, 83.03° W · COLUMBUS, OH`, >48px CTA clearance. |
| **FL-02** | `AsciiDnaLightbulbCanvas.tsx` | **Resolved** | Desktop center `(0.71W, 0.38H)`, radius `0.21 * min(W,H)`; smooth-min pear SDF, continuous DNA, supersonic plume with 4 shock diamonds, mobile protection. |
| **FL-03** | `ForgedCarbonCanvas.tsx` | **Resolved** | 512px repeating tile, 160 facets, base clamp `#04070D`–`#080F1C`, `pow(..., 16)` glints, zero grey washes. |
| **FL-04** | `UnifiedProjectField.tsx` | **Resolved** | Unboxed desktop 5/7 split in 12-column grid (`max-w-[1380px]`), clean responsive mobile stacking. |
| **FL-05** | Plates (`Healios`, `Apexis`, `RouteRx`, `Tempo`) | **Resolved** | Standardized 3-row architecture, 3 interactive modes per plate, real telemetry outside drawing region. |
| **FL-06** | `VerticalGrandPrixTrack.tsx` | **Resolved** | DOM-anchored track, 5 sectors, forward-only wrap-around loop kinematics, continuous tangent unwrapping, 0 text collisions. |
| **FL-07** | `SystemsCodeGraph.tsx` | **Resolved** | 0–22%/22–60%/60–96% bounded desktop layout, max 480px dossier, DOM Bezier edges, stacked mobile layout. |
| **FL-08** | `MedallionCarousel.tsx` | **Resolved** | 5 evidence medallions, `[-2..2]` signed offsets, unflattened 3D subtree, dynamic mobile spacing, stable plinth height. |
| **FL-09** | Lower Sections (`Podcast`, `About`, `History`, `Now`) | **Resolved** | 5 verified podcast guests, 40/60 portrait/narrative, 112px research gap, unboxed history/skills/now/contact. |
| **FL-10** | Mobile & iPad Recruiter Ergonomics | **Resolved** | Zero-overflow `w-full` container layout, always-visible experience sectors, Ohio State + Résumé CTAs in Hero, 44px touch targets, verified across 390px/768px viewports. |

---

## 6. Multi-Agent Delegation Protocol

- **Coordinator**: Oversees architecture, ground truths, verification gates, and deployment promotions.
- **Worker A** (`frontend-director`): Hero, Forged Carbon Engine, and Systems CodeGraph.
- **Worker B** (`staff-engineer`): Selected Works 3-Row Plates and 3D Medallion Carousel.
- **Worker C** (`frontend-director`): Grand Prix Experience Circuit and Lower Sections.

Each subagent operates on isolated owned files without collisions, verifying all changes via `npm run typecheck`, `npm run validate-content`, and headless Playwright matrix audits before handoff.

---

## 7. Verification & Deployment Pipeline

```bash
# 1. Typecheck TypeScript contracts (0 errors)
npm run typecheck

# 2. Validate content registry & evidence claims (100% integrity)
npm run validate-content

# 3. Verify vertical track geometry math
node src/components/experience/verticalTrackGeometry.test.mjs

# 4. Build & pre-render static HTML export to out/ (40 routes)
npm run build

# 5. Deploy to Vercel production edge
npx vercel deploy --prod --yes
```

Ensure all static files in `out/` are present and verify HTTP 200 responses on the production domain:
[https://haresh-portfolio-livid.vercel.app](https://haresh-portfolio-livid.vercel.app)

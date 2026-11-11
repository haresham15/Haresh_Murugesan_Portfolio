# CODEX.md — Comprehensive Architecture & Developer Reference
# Haresh Murugesan Portfolio V4.0 (Next.js Pages Router & Static SSG)

## 1. Quick Technical Summary

- **Framework**: Next.js 16.4.5 (Pages Router, static export to `out/`)
- **Language**: TypeScript 5.0 (strict type-checking)
- **Styling**: Tailwind CSS v4 Alpha + CSS Variables mapped in `design/tokens.json` & `src/index.css`
- **Animation & Physics**: Framer Motion (spring physics, layout morphs) + GSAP (parametric spline kinematics) + HTML5 Canvas (procedural Voronoi carbon fiber & burnout smoke)
- **Shared Canvas Hook**: `src/hooks/useCanvasStage.ts` (CSS-pixel coordinates, capped DPR `min(2, window.devicePixelRatio)`, ResizeObserver, visibilitychange pause/resume)
- **Production Target**: [https://haresh-portfolio-livid.vercel.app](https://haresh-portfolio-livid.vercel.app)
- **Deployment**: Vercel Global Edge Network (`npx vercel deploy --prod --yes`)

---

## 2. Directory & Component Index

```text
c:\Users\hares\OneDrive\Desktop\CS_Projects\Haresh_Murugesan_Portfolio
├── pages/
│   ├── _app.tsx                      # Root application wrapper, fonts, and motion context
│   ├── index.tsx                     # Monolithic exhibition canvas (Hero, Projects, Experience, Medallions, Syntinuum, Skills, About, History, Now, Contact)
│   ├── about.tsx                     # Dedicated leadership and executive philosophy page
│   ├── archive.tsx                   # Systems CodeGraph repository & full index
│   └── projects/
│       └── [slug].tsx                # Dynamic SSG project case study engine (pre-rendered at build time)
├── src/
│   ├── components/                   # Core architectural components
│   │   ├── ForgedCarbonCanvas.tsx    # 180-polygon anisotropic chopped carbon-tow canvas shader
│   │   ├── ForgedCarbonBackground.tsx# Fullscreen background wrapper for the forged carbon engine
│   │   ├── WheelNavTrigger.tsx       # 7-layer parametric SVG alloy rim & burnout smoke navigation
│   │   ├── Header.tsx                # Fixed header: [HM] badge + Haresh Murugesan + WheelNavTrigger
│   │   ├── BentoHero.tsx             # 100vw x 100dvh locked hero stage
│   │   ├── AsciiDnaLightbulbCanvas.tsx # 45° pear SDF ASCII lightbulb with continuous DNA & supersonic plume
│   │   ├── UnifiedProjectField.tsx   # Single-viewport split-stage telemetry deck (Accordion Rail + Stationary Blueprint Stage)
│   │   ├── HomeCodeGraph.tsx         # Seamless dot-module systems constellation (18 project dots, 2 cores, 6 domains, background-woven)
│   │   ├── SystemsCodeGraph.tsx      # Dedicated full-page linear rabbit-hole camera progression (pages/projects.tsx)
│   │   ├── ScrollyExperience.tsx     # Top-to-bottom Grand Prix circuit section wrapper
│   │   ├── MedallionCarousel.tsx     # 3D machined medallion carousel (310px, +/-15° tilt)
│   │   ├── PodcastSection.tsx        # Syntinuum: Endless Evolutions audio waveform & episode scrubber
│   │   ├── NeuralSkills.tsx          # 5-domain technical capability index with shared walls
│   │   ├── AboutSection.tsx          # 40/60 portrait/narrative spread & clinical pathology artifact plate
│   │   ├── HistorySection.tsx        # Trajectory Bezier ribbon spine & unboxed milestones
│   │   ├── NowSection.tsx            # Field notes unboxed asymmetric dispatch (7-col build / 5-col research)
│   │   ├── ContactFooter.tsx         # Monumental correspondence statement & 3-tier action hierarchy
│   │   ├── experience/
│   │   │   └── VerticalGrandPrixTrack.tsx # 5-apex Grand Prix circuit with forward-only wrap kinematics
│   │   └── plates/                   # Interactive project blueprint plates
│   │       ├── PlateHealios.tsx      # 3D LiDAR point cloud & Grad-CAM saliency lens
│   │       ├── PlateApexis.tsx       # Oscilloscope speed traces & 16.6ms frame budget readout
│   │       ├── PlateRouteRx.tsx      # Pulsing catchment isochrones & OSRM routing matrix
│   │       └── PlateTempo.tsx        # 12-slot encrypted ring buffer & triage state machine
│   ├── content/                      # Canonical content & evidence registry
│   │   ├── projects.ts               # 18 curated projects with slugs, metrics, and architecture schemas
│   │   ├── experience.ts             # 5 verified career sectors (CAS, OSU, 99P Labs, Philocracy, Syntinuum)
│   │   └── evidence.ts               # 11 evidence records with benchmark citations and metrics
│   ├── tokens/                       # Design tokens TypeScript bindings
│   │   └── index.ts                  # Primitive, semantic, and component token exports
│   └── scene/                        # Three.js 3D assets and scene graph modules
├── design/
│   └── tokens.json                   # Ground-truth DTCG 3-tier design token definitions
└── scripts/
    └── validate-content.mjs          # Static type-stripping content & evidence validator
```

---

## 3. Data Flow & Static Site Generation (SSG)

### 3.1 Project Registry Schema (`src/content/projects.ts`)
Each project record conforms to `ProjectData`:
```typescript
export interface ProjectData {
  slug: string;                      // URL slug (e.g. 'healios', 'apexis', 'routerx-careline-hub')
  title: string;                     // Project display title
  category: ProjectCategory;         // 'ai-systems' | 'telematics' | 'spatial' | ...
  year: string;                      // Year published or deployed
  impact: string;                    // Verified quantitative outcome
  leadSummary: string;               // Concise technical overview
  architectureDiagram?: string;      // Mermaid or schematic representation
  specs: {
    latency?: string;                // e.g. '8.09ms'
    frameBudget?: string;            // e.g. '16.6ms'
    accuracy?: string;               // e.g. '94.2% Hit@5'
    stack: string[];                 // List of core technologies
  };
  evidenceIds: string[];             // References to src/content/evidence.ts
}
```

### 3.2 Evidence Registry Schema (`src/content/evidence.ts`)
Each evidence entry verifies external claims:
```typescript
export interface EvidenceRecord {
  id: string;                        // Unique citation ID (e.g. 'ev-datafest-2026')
  claim: string;                     // Verifiable claim
  metric: string;                    // Concrete benchmark
  source: string;                    // Authorizing institution or competition
  verificationUrl?: string;          // External link or artifact path
}
```

### 3.3 Dynamic Route Generation (`pages/projects/[slug].tsx`)
- `getStaticPaths`: Loops through `PROJECTS` in `src/content/projects.ts` (plus legacy aliases) and generates static route parameters.
- `getStaticProps`: Fetches project data and matched evidence records at build time.
- `fallback: false`: Guarantees static-only generation; unlisted routes route to 404.

---

## 4. Key Engineering Mechanics & Algorithms

### 4.1 Forged Carbon Fiber Anisotropic Algorithm
In `ForgedCarbonCanvas.tsx`, each flake $i$ has centroid $(x_i, y_i)$, fiber angle $\theta_i \in [0, \pi]$, and base color in range `[#04070E, #080E1A]`:
```typescript
// Virtual light vector angle derived from scroll and cursor:
const lightAngle = (scrollOffset * 0.002) + Math.atan2(mouseY - cy, mouseX - cx);

// High-exponent anisotropic specular reflection:
const delta = Math.abs(Math.cos(flake.theta - lightAngle));
const specular = Math.pow(delta, 14);

// Composite with Dark Cobalt and Machined Silver:
const cobaltTint = `rgba(21, 56, 117, ${specular * 0.22})`;
const silverSheen = `rgba(200, 210, 224, ${specular * 0.07})`;
```

### 4.2 Smooth Minimum SDF Pear ASCII Lightbulb
In `AsciiDnaLightbulbCanvas.tsx`, the lightbulb silhouette combines a spherical dome ($r=72$) and tapered Edison neck ($r=36$) using the polynomial smooth-minimum operator:
```typescript
function smin(d1: number, d2: number, k: number): number {
  const h = Math.max(k - Math.abs(d1 - d2), 0.0) / k;
  return Math.min(d1, d2) - h * h * k * 0.25;
}
```
- Desktop bulb center is anchored at `(0.71 * W, 0.38 * H)` with radius `0.21 * min(W, H)`; mobile viewports scale to `(0.85 * W, 0.28 * H)` to preserve text readability.
- Supersonic plume renders 4 diamond shocks expanding along $-45^\circ$ vector from the base socket, paired with 22 CFD wind-tunnel streamlines.
- Zero extraneous HUD text labels drawn to canvas; bottom datum renders clean geographic coordinates `40.00° N, 83.03° W · COLUMBUS, OH`.

### 4.3 Forward-Only Grand Prix Kinematics
In `VerticalGrandPrixTrack.tsx` and `verticalTrackGeometry.ts`, the prototype car never reverses along the spline:
```typescript
if (targetIndex >= fromIndex) {
  // Move down the track
  gsap.to(progressRef.current, {
    t: targetT,
    duration: 0.65 + (targetIndex - fromIndex) * 0.12,
    ease: 'power2.inOut',
    onUpdate: () => applyCarTransform(progressRef.current.t),
  });
} else {
  // Wrap around loop: blast down off exit, wrap to top, dive to apex
  const tl = gsap.timeline();
  tl.to(progressRef.current, {
    t: 1.06,
    duration: 0.42,
    ease: 'power2.in',
    onUpdate: () => applyCarTransform(progressRef.current.t),
  })
  .set(progressRef.current, {
    t: -0.06,
    onComplete: () => applyCarTransform(-0.06),
  })
  .to(progressRef.current, {
    t: targetT,
    duration: 0.52,
    ease: 'power3.out',
    onUpdate: () => applyCarTransform(progressRef.current.t),
  });
}
```
- Dynamic DOM-anchored track geometry recalculates apex positions via `ResizeObserver` upon font loading and window resizing.
- Car orientation uses continuous tangent angle unwrapping (`unwrapTrackAngle`) to eliminate 360° spin flips during path navigation.
- Full stroke clearance allocated: 64px glow, 52px barrier, 46px asphalt, and 3px racing line.

### 4.4 Bounded Systems CodeGraph Architecture
In `SystemsCodeGraph.tsx`, open-page camera progression navigates 4 discrete hierarchical depths:
- **Depth 0 (Origin)**: Core software and systems portal.
- **Depth 1 (Domain Modules)**: Computer Vision & LiDAR, Semantic Search & NLP, Spatial & Machine Learning, Serverless Cloud Architecture.
- **Depth 2 (Project Cluster)**: 18 canonical systems dynamically arranged with >110px center-to-center spacing.
- **Depth 3 (Project Dossier)**: Title, domain/year, verified benchmark metric, architectural narrative, tech stack, and primary case-study link.
- **Spatial Geometry**: Desktop divides the stage into three strictly bounded columns: parent ancestry (0–22%), active cluster (22–60%), and dossier (60–96%, max 480px width), strictly preserving 5–95% safe horizontal bounds.
- **Mobile Adaptation**: Screens <1024px stack breadcrumbs, active nodes, and dossier with native document scrolling and 48px touch targets.
- **Edge Routing**: Dynamic cubic Bezier curves connect actual DOM anchor coordinates rather than ungrounded canvas points.

### 4.5 3D Machined Medallion Orbital Carousel
In `MedallionCarousel.tsx`, 5 competitive medallions honor verified achievements:
- **Circular Offsets**: Signed offsets `((idx - activeIndex + 7) % 5) - 2` produce symmetrical indices `[-2, -1, 0, 1, 2]`.
- **Spring Transforms**: Desktop translates along X (up to 260px spacing), Z-depth (`-abs(offset) * 180px`), Y-rotation (`offset * -28deg`), and active scale (1.08).
- **Responsive Containment**: Mobile spacing and medallion diameter dynamically scale with container width via `ResizeObserver`, ensuring zero horizontal page overflow.
- **Unflattened 3D Subtree**: Opacity and SVG filters are isolated to inner elements, keeping outer 3D button containers purely geometric.
- **Stable Plinth**: Reserved plinth height prevents vertical layout shift when switching between entries with varying text lengths.

### 4.6 Single-Viewport Telemetry Console & Background-Integrated Dot-Module CodeGraph (V5.5)
- **Compacted Flagship Telemetry Deck (`UnifiedProjectField.tsx`)**:
  - Consolidates 4 flagship systems (01 Healios V2, 02 Apexis Telemetry Engine, 03 RouteRx / Careline, 04 Tempo Task Suite) into a single-viewport (`740px`, ~85dvh) console, shrinking vertical scroll footprint by ~2,360px without losing any thesis, prose, or benchmark metrics.
  - **Left 5-Column Accordion Rail**: Inactive projects render as crisp 54px strips with index, title, primary metric, and expand trigger (`+`). The active drawer reveals full narrative, 2-column benchmark strip, stack, and direct action CTAs (`Read Case Study →`, `Source Code ↗`). Supports hotkey navigation (`ArrowUp` / `ArrowDown`).
  - **Right 7-Column Stationary Blueprint Stage**: Framed with 4 corner L-brackets (`⌜ ⌝ ⌞ ⌟` in `#2563EB`) and 32px blueprint grid. Houses the active project simulation plate (`PlateHealios`, `PlateApexis`, `PlateRouteRx`, `PlateTempo`) with smooth keyed crossfade, live system identifier (`01 // HEALIOS_V2`), prev/next cycle arrows (`←` / `→`), and deterministic telemetry footer.

- **Awwwards-Caliber Vector Systems Constellation (`HomeCodeGraph.tsx` V6.0)**:
  - Weaves the 18-project archive directly into the home page background with `background: transparent`, zero boxes or container borders, and subtle central cobalt radial glow (`radial-gradient(circle at 50% 50%, rgba(21, 56, 117, 0.22) 0%, transparent 75%)`).
  - **2.5D Perspective Projection & Multi-Pass Optical Bloom**: Projects nodes in 3D coordinate space with focal length $F=900$ and mouse parallax tilt ($\pm 6^\circ$). Renders multi-pass optical laser bloom (`ctx.globalCompositeOperation = 'lighter'`), rotating 1px segmented silver reticles, and incandescent alabaster pinpoint cores.
  - **Elastic Verlet String Physics**: Midpoints of connecting Bézier splines simulate damped harmonic springs that physically deflect around the cursor when swept and emit drifting spark particles upon vibration.
  - **UMAP Topographical Density Contours**: Deformable trigonometric contour rings with elevation callouts ($\nabla 0.85, \nabla 0.60$) wrap active clusters like gravitational potential wells.
  - **Live Semantic Vector Query Bar & Cosine Gravity**: Real-time cosine similarity search pulls matching systems inward into the center focal ring with live `cos θ = 0.94` badges and quick-prompt chips (`[Low-Latency 60FPS]`, `[Clinical CV & LiDAR]`, `[Spatial ML]`).
  - **k-NN Vector Cross-Links on Hover**: Hovering a project dot renders animated dashed vector bridges to its top 3 nearest-neighbor systems with exact similarity pills (`0.94 SIM · CLINICAL CV / HISTOLOGY`).
  - **Holographic Spec Lens & Singularity Dive Warp**: Hovering opens an obsidian-cobalt lens with live vector signature and 3D cosine coordinates; clicking triggers an exponential 420ms warp zoom dive ($1\times \to 16\times$) with radial starfield streaks before resolving into the case study.

### 4.7 Three-Row Stage Plates (Selected Works)
In `PlateHealios.tsx`, `PlateApexis.tsx`, `PlateRouteRx.tsx`, and `PlateTempo.tsx`:
- **Standardized Stage Architecture**: Row 1 contains interactive mode tabs; Row 2 houses the flexible drawing canvas (`min-h-0`); Row 3 renders real-time telemetry readouts.
- **Telemetry Isolation**: HTML controls and data counters live strictly outside the canvas drawing bounds.
- **Dual Mode State**: Every mode button actively updates React state, altering real computational shaders and vector visualizations.

### 4.7 Recruiter-First Mobile & Tablet (iPad) Responsive Engineering
- **Zero Horizontal Overflow Invariant**: Replaced all `w-screen max-w-none` wrappers with `w-full` across `ThemeSection.tsx`, `SectionContainer.tsx`, `ScrollyExperience.tsx`, and `ContactFooter.tsx`, preventing scrollbar-induced horizontal overflow on devices with 375px–430px screens.
- **Recruiter Hierarchy in Hero (`BentoHero.tsx`)**: Prominently surfaces academic credentials (`THE OHIO STATE UNIVERSITY · B.S. CSE (AI SPECIALIZATION)`) and direct recruiter call-to-actions (`Résumé (PDF) ↗` and `Explore Work →`) immediately on load.
- **Always-Visible Experience Outcomes (`VerticalGrandPrixTrack.tsx`)**: Removed `opacity-0` hiding of inactive roles on touch devices; all 5 career sectors, quantified achievements, and skill tags remain immediately readable for 10-second recruiter scanning.
- **Proportional Tablet Scaling (`AsciiDnaLightbulbCanvas.tsx`)**: Dedicated `isTablet` viewport handler offsets the DNA lightbulb to `w * 0.76` and `h * 0.35` (radius `0.19`), preserving typography clarity on iPads (768px–1024px).
- **Tactile Touch Targets (WCAG 2.5.5 / 2.5.8)**: All interactive buttons, category chips, tabs, and outbound links feature `min-h-[44px]` (or `min-h-[36px]` for micro-switches) with active click/tap states.

---

## 5. Development & Pre-Flight Verification

```bash
# 1. Typecheck: Zero TypeScript errors across entire codebase
npm run typecheck

# 2. Content Validation: Checks all projects, evidence, and sectors with 100% integrity
npm run validate-content

# 3. Track Geometry Test: Verifies spline math, tangent unwrapping, and wrap decisions
node src/components/experience/verticalTrackGeometry.test.mjs

# 4. Static Export Build: Compiles Next.js app to out/ (40 static routes)
npm run build

# 5. Production Promotion: Deploys out/ to Vercel production edge
npx vercel deploy --prod --yes
```

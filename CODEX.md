# CODEX.md — Comprehensive Architecture & Developer Reference
# Haresh Murugesan Portfolio V4.0 (Next.js Pages Router & Static SSG)

## 1. Quick Technical Summary

- **Framework**: Next.js 16.4.5 (Pages Router, static export to `out/`)
- **Language**: TypeScript 5.0 (strict type-checking)
- **Styling**: Tailwind CSS v4 Alpha + CSS Variables mapped in `design/tokens.json` & `src/index.css`
- **Animation & Physics**: Framer Motion (spring physics, layout morphs) + GSAP (parametric spline kinematics) + HTML5 Canvas (procedural Voronoi carbon fiber & burnout smoke)
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
│   │   ├── UnifiedProjectField.tsx   # Unboxed 38/62 project exhibition spreads
│   │   ├── SystemsCodeGraph.tsx      # Open-page linear rabbit-hole camera progression (Depth 0->3)
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
Supersonic plume renders 4 diamond shocks expanding along $-45^\circ$ vector from the base socket.

### 4.3 Forward-Only Grand Prix Kinematics
In `VerticalGrandPrixTrack.tsx`, the prototype car never reverses along the spline:
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

---

## 5. Development & Pre-Flight Verification

```bash
# 1. Typecheck: Zero TypeScript errors
npm run typecheck

# 2. Content Validation: Checks all projects, evidence, and sectors
npm run validate-content

# 3. Static Export Build: Compiles Next.js app to out/
npm run build

# 4. Production Promotion: Deploys out/ to Vercel production edge
npx vercel deploy --prod --yes
```

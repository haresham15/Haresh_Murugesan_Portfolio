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

### 4.4 Systems CodeGraph Linear Rabbit Hole ([`SystemsCodeGraph.tsx`](file:///src/components/SystemsCodeGraph.tsx))
- Camera translation across depths: Depth 0 (Core) $\to$ Depth 1 (Domain Modules) $\to$ Depth 2 (Projects) $\to$ Depth 3 (Case Study).
- World translation along X axis ($\text{camX} = 0 \to -420 \to -880 \to -1240$).
- Anchored parent breadcrumbs on the left for 1-click step-back reverse translation.
- Top-right mode switch between `[Rabbit-Hole Mode]` and `[Full 18-Node Constellation Map]`.

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

---

## 5. Verification & Deployment Pipeline

```bash
# 1. Typecheck TypeScript contracts
npm run typecheck

# 2. Validate content registry & evidence claims
npm run validate-content

# 3. Build & pre-render static HTML export to out/
npm run build

# 4. Deploy to Vercel production edge
npx vercel deploy --prod --yes
```

Ensure all static files in `out/` are present and verify HTTP 200 responses on the production domain:
[https://haresh-portfolio-livid.vercel.app](https://haresh-portfolio-livid.vercel.app)

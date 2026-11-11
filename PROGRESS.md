# V5 Remediation Progress & Failure Ledger

## Ground Truth & Baseline Inspection
- **Framework**: Next.js 16.4.5 Pages Router with 100% static SSG export (`out/`).
- **Target Viewports**: 1440×900 (Desktop), 1024×768 (Tablet), 390×844 (Mobile).
- **Global Palette Tokens**: `--bg-midnight` (`#03050A`), `--bg-obsidian` (`#060A12`), `--cobalt-deep` (`#0B1E40`), `--cobalt-mid` (`#153875`), `--cobalt-bright` (`#2563EB`), `--accent-red-orange` (`#FF2800`), `--accent-crimson-glow` (`#FF4419`), `--metal-silver` (`#C8D2E0`), `--metal-chrome` (`#E6ECF5`), `--metal-titanium` (`#7E8B9B`), `--text-alabaster` (`#F4F6F9`).
- **Shared Hook**: `src/hooks/useCanvasStage.ts` (CSS pixel coordinates, capped DPR min(2, window.devicePixelRatio), ResizeObserver, visibilitychange pause/resume).

## Failure Ledger

| ID | Component / Area | Requirement | Observed Defect / Target Gap | Owner | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **FL-01** | `BentoHero.tsx` | Viewport-safe 100dvh & clean CTA | `min-h-[720px]` creates vertical overflow on small screens; bottom HUD strings present | Worker A | Completed (`BentoHero.tsx` exact 100dvh, clean coordinates, >48px CTA clearance) |
| **FL-02** | `AsciiDnaLightbulbCanvas.tsx` | Continuous DNA & bulb center geometry | Desktop center must be `(0.71W, 0.38H)`, radius `0.21 * min(W,H)`; mobile protection | Worker A | Completed (Bulb center `0.71W, 0.38H`, `smin` pear SDF, continuous DNA, supersonic plume) |
| **FL-03** | `ForgedCarbonCanvas.tsx` | Procedural dark chopped carbon | Ensure 512px tile, 160 facets, base clamp `#04070D`–`#080F1C`, `pow(..., 16)` glints | Worker A | Completed (512px toroidal tile, 160 facets, base clamp `#04070D`–`#080F1C`, `pow(..., 16)` glints) |
| **FL-04** | `UnifiedProjectField.tsx` | 3-row stage layout & 5/7 split | Visualizations must cleanly isolate controls (top), drawing (middle), telemetry (bottom) | Worker B | Completed (Unboxed 5/7 12-col grid, max-w-1380px, responsive stack, full editorial column) |
| **FL-05** | Plates (`Healios`, `Apexis`, `RouteRx`, `Tempo`) | Interactive simulations & telemetry | Scrubbing and tab changes must update real rendering state; no HTML over canvas | Worker B | Completed (Standardized 3-row architecture, 3 interactive modes per plate, real telemetry outside drawing) |
| **FL-06** | `VerticalGrandPrixTrack.tsx` | DOM-bound track & wrap-around loop | Alternating 5/2/5 desktop layout, mobile track lane, continuous heading unwrapping | Worker C | Completed (DOM-anchored track, 5 sectors, wrap-around loop kinematics, heading unwrapping) |
| **FL-07** | `SystemsCodeGraph.tsx` | Bounded rabbit-hole navigation | Safe bounds 5–95% on desktop, max dossier width 480px, stacked mobile layout | Worker A (Wave B) | Completed (0–22%/22–60%/60–96% desktop bounds, max 480px dossier, DOM Bezier edges, stacked mobile, all routes verified) |
| **FL-08** | `MedallionCarousel.tsx` | 3D orbital carousel & plinth stability | Stable plinth height across all entries; mobile spacing derived from width | Worker B (Wave B) | Completed (5 evidence medallions, [-2..2] signed offsets, 3D subtree unflattened, mobile dynamic spacing, stable plinth height) |
| **FL-09** | Lower Sections (`Podcast`, `About`, `History`, `Now`) | Clean unboxed layout & typography | 40/60 About layout, 112px gap to artifact plate, 4 milestone entries, 5 podcast guests | Worker C (Wave B) | Completed (5 guests verified, 40/60 portrait/narrative, 112px research gap, unboxed history/skills/now/contact, 0 collisions) |
| **FL-10** | Mobile & iPad Recruiter Ergonomics | Recruiter-first readability & 0px overflow | Mobile was super compact, experience roles hidden under tap, w-screen caused 15px overflow | Coordinator & Subagents | Completed (Replaced w-screen with w-full, unlocked all 5 experience sectors, added Ohio State degree + Résumé CTA to Hero, 44px touch targets across all plates/sections, verified on 390px and 768px viewports) |

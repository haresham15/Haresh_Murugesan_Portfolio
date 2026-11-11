# AGENTS.md — Global Agent Guide & Architectural Constitution
# Haresh Murugesan Portfolio V4.0 (Next.js Pages Router & Static Export)

This repository houses the personal engineering portfolio of Haresh Murugesan, showcasing high-concurrency systems, clinical digital pathology computer vision, and connected-vehicle telematics.

The site is built with the **Next.js Pages Router** and exports a fully static site to `out/`.
Preserve static-export compatibility at all times: all routes, dynamic slugs, and evidence IDs must resolve at build time without runtime server dependencies.

---

## 1. Where to Work

- `pages/`: Page-level composition and routing.
  - `pages/index.tsx`: The monolithic exhibition canvas.
  - `pages/about.tsx`: Dedicated leadership and philosophy spread.
  - `pages/archive.tsx`: Systems CodeGraph archive.
  - `pages/projects/[slug].tsx`: Dynamic SSG project case study engine with `getStaticProps` / `getStaticPaths`.
- `src/components/`: Modular UI, plate blueprints, and architectural setpieces.
  - `src/components/ForgedCarbonCanvas.tsx`: Procedural anisotropic chopped carbon-fiber canvas shader.
  - `src/components/WheelNavTrigger.tsx`: 7-layer alloy rim with 30-puff burnout smoke emitter.
  - `src/components/AsciiDnaLightbulbCanvas.tsx`: 45° pear SDF ASCII lightbulb with continuous DNA and supersonic plume.
  - `src/components/UnifiedProjectField.tsx` & `src/components/plates/`: Unboxed 38/62 project exhibition spreads (Healios V2, Apexis, RouteRx, Tempo).
  - `src/components/SystemsCodeGraph.tsx`: Linear rabbit-hole camera engine with world translation.
  - `src/components/experience/VerticalGrandPrixTrack.tsx`: 5-apex Grand Prix circuit with forward-only wrap-around loop kinematics.
  - `src/components/MedallionCarousel.tsx`: 3D machined medallion carousel with 72-tooth knurled silver bezel and ±15° tilt.
  - `src/components/PodcastSection.tsx`: Syntinuum living audio waveform and episode scrubber.
  - `src/components/NeuralSkills.tsx`: 5-domain technical capability index with shared walls.
  - `src/components/AboutSection.tsx`: 40/60 portrait/narrative spread and standalone clinical pathology artifact plate.
  - `src/components/HistorySection.tsx`: Trajectory Bezier ribbon spine and unboxed milestones.
  - `src/components/NowSection.tsx`: Field notes unboxed asymmetric dispatch.
  - `src/components/ContactFooter.tsx`: Monumental correspondence statement and 3-tier action hierarchy.
- `src/content/`: Canonical evidence and portfolio data.
  - `projects.ts`: 18 curated projects and technical metadata.
  - `experience.ts`: 5 verified career sectors.
  - `evidence.ts`: Benchmark citations and claims registry.
- `src/tokens/` & `design/tokens.json`: DTCG 3-tier design tokens. Follow existing tokens before adding styles.
- `public/`: Static assets, PDFs, sitemap, and robots file.

---

## 2. Design Invariants & Anti-Slop Rules

1. **Zero-Box Swiss Architectural Blueprint**:
   - Strictly ban `rounded-xl`, `rounded-2xl`, and `rounded-3xl` cards. All borders are `rounded-none` or subtle machined 2px bevel (`rounded-[2px]`).
   - Ban "boxes inside boxes".
   - Ban decorative side-stripe cards (`border-l-2 border-orange-*`).
   - Ban all-caps meta HUD tags (`— SYSTEMS PHILOSOPHY`, `00 LATENCY · DETERMINISM...`, `● LIVE TELEMETRY TRACK...`).
   - Ban emoji bullets.
   - Separate stack items with middle dots (`·`) instead of cramped pill borders.
2. **Global Color Palette**:
   - Deep Obsidian Base: `--bg-midnight` (`#03050A`) — never muddy greys.
   - Dark Cobalt: `--cobalt-deep` (`#0B1E40`), `--cobalt-mid` (`#153875`), `--cobalt-bright` (`#2563EB`).
   - Machined Silver: `--metal-silver` (`#C8D2E0`), `--metal-chrome` (`#E6ECF5`), `--metal-titanium` (`#7E8B9B`).
   - Sharp Reddish-Orange: `--accent-red-orange` (`#FF2800`), `--accent-crimson-glow` (`#FF4419`).
   - Text Alabaster: `--text-alabaster` (`#F4F6F9`).
   - In dark sections, never render text in `#060A12`.

---

## 3. Verification Protocol

Run all three checks before declaring work complete:
```bash
npm run typecheck        # tsc --noEmit
npm run validate-content # node scripts/validate-content.mjs
npm run build            # Next.js static SSG compilation & export to out/
```

Production deployment is executed via:
```bash
npx vercel deploy --prod --yes
```

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

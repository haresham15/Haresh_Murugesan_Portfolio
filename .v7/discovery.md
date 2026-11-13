# V7.0 Phase 0 discovery

Branch `v7` (from `main` @ 5d4b35e). No source edits in this phase.
`docs/v7-blueprint.md` does not exist; the blueprint was supplied in chat. Proposal: save it there at the start of Phase 1 so subagents can quote it verbatim.

## 1. Repo map

**Stack.** Next.js 16.4.5 **Pages Router**, `output: export` to `out/`, React 19.3, Tailwind 3.4, TypeScript 5.9. Fonts: Geist / Geist Mono / Geist Serif. Case-study route is **`/projects/[slug]`** (SSG, 30 paths incl. aliases). The blueprint says `/work/[slug]`.

**Composition.** `pages/index.tsx` (JSON-LD + `<App/>`) -> `src/App.tsx`:
`MotionPreferenceProvider > ChromaticThemeProvider > ForgedCarbonCanvas (fixed bg) + AntigravityParticles (cursor) + Header + <main>`.

Current section order (DOM, measured at 1440x900; page 17,320 px):

| # | id | Component | Height | Canvases / SVGs | Blueprint slot |
|---|----|-----------|--------|-----------------|----------------|
| 0 | `hero` | `BentoHero` -> `AsciiDnaLightbulbCanvas` (dynamic) | 900 | 1 / 0 | 00 Hero |
| 1 | `about` | `AboutSection` (portrait + `PathologyFigure` OSU plate) | 1746 | 0 / 1 | 07 About |
| 2 | `experience` | `ScrollyExperience` -> `experience/ExperienceCircuit` (sticky, `h-[460vh]`) | 4140 | 0 / 2 | 03 Experience |
| 3 | `projects` | `ProjectLab` -> `UnifiedProjectField` + `plates/*` | 1124 | 1 / 0 | 01 Selected Works |
| 4 | `archive` | `HomeCodeGraph` (1761 lines, 2D canvas) | 1207 | 1 / 0 | 02 Constellation |
| 5 | `podcast` | `PodcastSection` (spring waveform canvas) | 1345 | 1 / 0 | 04 Syntinuum |
| 6 | `skills` | `NeuralSkills` | 1824 | 0 / 0 | 05 Technical Index |
| 7 | `achievements` | `AchievementsGallery` -> `MedallionCarousel` (SVG + framer) | 1306 | 0 / 5 | 06 Recognition |
| 8 | `history` | `HistorySection` | 1732 | 0 / 0 | 08 Milestones |
| 9 | `now` | `NowSection` | 1033 | 0 / 0 | 09 Now |
| 10 | `contact-section` | `ContactFooter` | 963 | 0 / 0 | 10 Contact |

Plus 2 fixed canvases outside main (ForgedCarbon, AntigravityParticles) = 7 canvases total.

**Canvases and how they animate.**
- `ForgedCarbonCanvas` — fixed, **2D canvas** (not WebGL): pre-rendered base + lit layers, pointer-lit; own rAF.
- `AntigravityParticles` — 2D cursor particle field via `useCanvasStage`.
- `AsciiDnaLightbulbCanvas` — 2D, offscreen glyph atlas, `useCanvasStage`. **No props** (`React.FC`), size comes from its container.
- `plates/PlateHealios` (depth cloud / Grad-CAM), `PlateRouteRx`, `PlateApexis`, `PlateTempo` via `PlateStage` (2D). Drawn for dark.
- `HomeCodeGraph` — 2D, verlet strings, own loop.
- `PodcastSection` — 2D spring waveform via `useCanvasStage`.
- `ExperienceCircuit` — SVG track, own rAF for scroll-driven camera.
- `ThermalSilkCanvas` is the only WebGL code and is **not mounted** on home.

**Shared runtime today.** `src/hooks/useCanvasStage.ts` already gives per-canvas rAF + ResizeObserver + IntersectionObserver pause + `invalidate()` sleep. There is **no** global scheduler, frame budget or pointer store. `src/scene/usePerformanceTier.ts` (full/balanced/static via zustand) and `src/lib/singleClock.ts` (GSAP ticker + Lenis) exist but are **not reachable from `/`** — neither is ever initialised. `ExperienceCircuit` only probes `window.__singleClock`, which is always undefined.

**Heavy deps.** `package.json` already lists `gsap`, `lenis`, `three`, `@react-three/fiber`, `@react-three/drei`. Only dead files import them (`HeroWorkbenchScene`, `MonolithThresholdScene`, `HeroSignalCube`, `ScrollProgressBar`, `VerticalGrandPrixTrack`, `useChicaneCircuitKinematics`, `singleClock`). The home bundle does not load them. `framer-motion` is live on home (About, Podcast, History, Medallions, Works, ThemeSection `Reveal`).

**Theming.** `ThemeSection` + `ChromaticThemeProvider` set `--theme-*` vars per section (all currently `obsidian`). `MotionPreferenceProvider` resolves system/reduced/full and toggles `html.reduced-motion`. Tokens: `src/index.css :root` (`--bg-midnight`, `--cobalt-*`, `--metal-*` incl. `--metal-gunmetal: #475569`, `--accent-*`, easing, durations), mirrored in `src/tokens/index.ts` and `design/tokens.json` (DTCG).

**Data.**
- Projects: `src/content/projects.ts` — 18 (`flagshipProjects` 4 + `archiveProjects` 14), fields include `stack` (string), `icons[]`, `featured`, `caseStudy`.
- Skills: `src/content/skills.ts` — 5 domains, 26 capabilities, each with `provenBy[]` (project slug or experience). Compound names ("PyTorch & TensorFlow").
- Awards: hard-coded `MEDALLIONS` in `MedallionCarousel.tsx`, values pulled from `src/content/evidence.ts`.
- Podcast: `podcastGuests` (10) in `src/content/experience.ts`; `EPISODE_NOTES` (5) + `PODCAST_LINKS` (site, YouTube, Spotify) inside `PodcastSection.tsx`.
- Experience: `src/content/experience.ts` — 5 records.
- Now: `SIDE_NOTES` + inline "Building" copy inside `NowSection.tsx`.

**Tests / lint / checks.** No test runner. One ad-hoc geometry test (`experience/verticalTrackGeometry.test.mjs`, dead component). ESLint 9 flat config, `npm run lint` = `eslint pages src`. `scripts/validate-content.mjs`.

**MCP servers connected.** context7, exa, context-mode, Canva, Google Drive, Claude Docs, Gmail/Calendar (unauthenticated). **No Playwright or browser MCP.** Playwright 1.65 + Lighthouse 12 run from a scratchpad install (not a project dependency); Chromium builds are present locally.

## 2. Baseline (static build served gzip from `out/`)

| Check | Result |
|-------|--------|
| `npm run typecheck` | pass |
| `npm run validate-content` | pass |
| `npm run build` | pass, 40 static pages |
| `npm run lint` | **1 error**, 21 warnings. Error: `AboutSection.tsx:73 react-hooks/use-memo` |
| Lighthouse mobile (default throttling) | **Perf 55, LCP 5.4 s, CLS 0, TBT 560 ms**, FCP 4.5 s, JS 284 KB transfer / 12 files |
| Lighthouse desktop | Perf 96, LCP 1.1 s, CLS 0.004, TBT 80 ms, JS 297 KB / 15 files |
| Console on `/` (3 widths) | clean |
| Page height | 17,320 (1440) · 17,384 (1024) · 20,713 (390) |

Mobile LCP already fails the blueprint's 2.5 s budget before any V7 work.

Screenshots: `.v7/baseline/<w>x<h>_<nn>_<id>[_kofn].png`, 64 files; DOM inventory in `.v7/baseline/inventory.json`. Taken from the production build so the dev overlay is not in frame. A dev server for this repo is already running on :3100 (not started by me; :3000 is also occupied).

**Unboxing check, literal rule** (main, >200x100, any border / shadow / opaque bg): 36 elements at 1440, 38 at 1024, 39 at 390. Almost all are single-side hairlines (`border-t`/`border-b`, `divide-y`). Full boxes: hero opaque bg, About portrait frame + offset frame (border + shadow + `#060A12` bg), podcast guest strip, Now `border-r` column. The blueprint counts "four", so it must exclude hairlines. See question (g).

**Experience tab bar defect.** The nav (`ExperienceCircuit.tsx:1015-1020`) is `absolute bottom-0` inside the `sticky top-0 h-dvh` viewport. It did not show over Works in the static screenshots; will reproduce with a scroll trace in Phase 1G before fixing.

## 3. Content answers found in data

**(a) Awards** — `MEDALLIONS` has exactly five: ASA DataFest 2026 1st (Best Use of External Data, RouteRx); ASA DataFest 2025 1st (same category); Hack To The Future, Top Project Data Science Track (NYC OS); TamilTrove 94.2% Hit@5 (benchmark); Healios 8.09 ms Grad-CAM (benchmark). JSON-LD additionally lists "Harvard CS50 Algorithms & Computation Certificate 2025". No IBM SkillsBuild, NSLS or OSU Research Honors anywhere in the repo.

**(b) Tools with a project behind them** (from `projects.ts` stack + `skills.ts provenBy`):

| Requested | Evidence | Verdict |
|-----------|----------|---------|
| SQLite | Apexis stack; evidence `apexis-sqlite-latency` | has project |
| FAISS | TamilTrove stack; evidence `tamiltrove-hit5` | has project |
| WebGL | NYC Housing (Deck.GL, "custom WebGL shader" in tradeoffs); portfolio-website | has project |
| Node.js | Only in evidence `hardwareOrEnv` (Tempo, Apexis), not in any `stack` | weak, needs your call |
| C++, Go, Swift/ARKit, MATLAB, Docker, Three.js | none in projects/skills/experience (C/C++ and Three.js appear only in JSON-LD `knowsAbout`) | stay off |
| Java | Software 1 / Software 2 projects, skills `core-cs` | stays |

**(c) Syntinuum zones** — not in data. Only 5 of 10 guests have episode notes; the blueprint's grouping covers exactly those 5. No Apple Podcasts URL and no per-episode URLs exist.

**(d) Tempo** — `projects.ts`: "Tempo — RSD Communication Buffer & Regulation Suite", Next.js 15 / pgvector / Supabase, 100% (5/5) crisis recall, dual-provider failover. The "air-gapped" wording survives in `pages/index.tsx` JSON-LD, which contradicts the data.

## 4. Phase 2 file-ownership table

New feature code lives under `src/v7/`. Each agent writes only inside its folder.

| Owner | Writes | Reads only |
|-------|--------|-----------|
| **Lead** | `src/App.tsx`, `pages/*`, `src/index.css`, `tailwind.config.js`, `src/tokens/*`, `design/tokens.json`, `package.json`, `.claude/skills/v7-*`, `src/v7/runtime/*` (scheduler, pointer store, tier probe), `src/v7/carbon/*` (CarbonField + CSS fallback), `src/v7/seams/*`, `src/v7/cursor/*`, `Header.tsx`, `WheelNavTrigger.tsx`, `AsciiDnaLightbulbCanvas.tsx` (adds a `size`/`embedded` prop for Agent 2), `BentoHero.tsx`, `AboutSection.tsx`, `experience/*`, `HomeCodeGraph.tsx`, `HistorySection.tsx`, `ContactFooter.tsx`, `ThemeSection.tsx`, `MotionPreference.tsx`, `src/content/*`, `scripts/*` | everything |
| **Agent 1 Works** | `src/v7/works/*`, `src/components/plates/*` (only consumer is `UnifiedProjectField`, which the new section replaces) | content, runtime, skills |
| **Agent 2 Syntinuum** | `src/v7/syntinuum/*` (zone data, peaks, waveform, panel) | bulb component, content, runtime |
| **Agent 3 Index** | `src/v7/tool-wall/*` (incl. typed `toolMap.ts` derived from `projects.ts` + `skills.ts`, icon paths) | content, runtime, `simple-icons` |
| **Agent 4 Recognition** | `src/v7/recognition/*` (height-map SVGs, shader, orbit) | evidence, runtime |
| **Agent 5 Now** | `src/v7/now/*` | runtime |

Retired after Phase 3 (deleted only once replacements are mounted): `ProjectLab`, `UnifiedProjectField`, `PodcastSection`, `NeuralSkills`, `AchievementsGallery`, `MedallionCarousel`, `NowSection`, `ForgedCarbonCanvas`, `AntigravityParticles`.

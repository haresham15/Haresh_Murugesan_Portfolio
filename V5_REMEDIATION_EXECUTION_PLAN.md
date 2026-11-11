# V5 Portfolio Remediation: Parallel Agent Execution Plan

Status: execution handoff; implementation and browser acceptance remain pending.

Target: https://haresh-portfolio-livid.vercel.app/

Chosen approach: **verify and repair existing V5 work**, preserving working components. The supplied diagnostic audit describes suspected failures, not verified current behavior. Reproduce each failure before changing its implementation.

## 1. Objective and completion gate

Repair the hero, canvas sizing, Selected Works, Experience circuit, CodeGraph, Recognition carousel, and specified lower sections. Preserve the dark architectural design, existing content evidence, Next.js Pages Router, and static export.

Complete only when:

- [ ] All requirements below are verified or recorded with a specific unresolved blocker.
- [ ] Layout and interactions pass at 1440×900, 1024×768, and 390×844.
- [ ] Essential controls and text remain visible without unintended overlap or horizontal page scrolling.
- [ ] Keyboard navigation, visible focus, reduced motion, and 200% zoom remain usable.
- [ ] Typecheck, content validation, and static build pass.
- [ ] Browser verification passes against the exported build, not only the development server.
- [ ] Final report includes changed files, screenshots, checks, and remaining limitations.

Creating this document does not authorize a production deployment. Implementation should prepare a reviewable local result; deployment requires a separate instruction.

## 2. Execution order

### Phase 0 — Coordinator: establish ground truth

1. Read repository instructions, `PLAN.md`, and `PROGRESS.md`. Check Git status; preserve existing user changes.
2. Use CodeGraph to trace actual homepage composition, `/projects`, all affected component callers, and canvas consumers. Read configurations and documentation directly where not indexed.
3. Inspect installed Next.js documentation before changing framework behavior. Resolve relevant current library documentation through Context7 when needed.
4. Inspect both the deployed site and local rendering. Start the existing development command with a hidden background process when necessary.
5. Capture screenshots, console/network failures, DOM rectangles, and interaction results at all three target viewports. Record production/local differences rather than assuming both run the same revision.
6. Create a failure ledger in `PROGRESS.md`. Each entry must contain: requirement, route/component, reproduction, observed result, expected result, owner, and verification evidence.
7. Reconcile this document's component names against the current tree before assigning ownership. Update `PLAN.md` with phase status and ownership; do not replace historical evidence blindly.

Known inspection findings to reuse, then verify behavior:

- Homepage enters through `pages/index.tsx` and `src/App.tsx`.
- CodeGraph currently lives on `/projects`; preserve that location.
- `src/hooks/useCanvasStage.ts` already exists with resize, capped DPR, visibility, and animation lifecycle handling.
- Experience already contains DOM-measured anchors and angle unwrapping.
- CodeGraph and medallions already contain responsive layout logic.

**Exit gate:** every requested subsystem has a baseline result; confirmed failures have owners; working implementations are identified for reuse.

### Phase 1 — Coordinator: stabilize shared contracts

1. Audit and repair the existing canvas hook only where tests or inspection establish a gap.
2. Establish global palette aliases, layer ordering, responsive breakpoints, and motion behavior below.
3. Publish the shared interface and file ownership before workers migrate consumers.
4. Make shared changes first. Workers may inspect independently, but dependent canvas edits wait until the hook contract is stable.

**Exit gate:** workers can implement without changing shared interfaces or editing the same files.

### Phase 2 — Wave A: parallel repairs

Run three workers alongside the coordinator:

| Owner | Exclusive component scope | Required result |
| --- | --- | --- |
| Coordinator | Shared hook, global CSS/tokens, header/navigation, integration | Stable shared contracts and working navigation |
| Worker A | BentoHero, AsciiDnaLightbulbCanvas, ForgedCarbonCanvas and their local styles | Viewport-safe hero, undistorted artwork, dark carbon |
| Worker B | UnifiedProjectField, ProjectLab, four plate components and local styles | Four working simulations with separated controls/drawing/telemetry |
| Worker C | ScrollyExperience, VerticalGrandPrixTrack and directly used geometry helpers | DOM-bound track, no text collisions, forward-only navigation |

Coordinator assigns exact files after baseline discovery. Files named here are ownership candidates, not instructions to rewrite every file.

### Phase 3 — Wave B: reuse worker slots

| Owner | Exclusive component scope | Required result |
| --- | --- | --- |
| Worker A | SystemsCodeGraph and its route integration | Bounded navigation, readable nodes, reachable dossier |
| Worker B | MedallionCarousel, AchievementsGallery | Five selectable medallions, preserved depth, stable plinth |
| Worker C | PodcastSection, AboutSection, HistorySection; lower-section regression review | Working episode selection, research separation, readable chronology |
| Coordinator | Shared-file requests, evidence checks, integration review | Consistent behavior across both waves |

### Phase 4 — Integration and verification

1. Review worker diffs against their assigned requirements. Resolve shared-file changes centrally.
2. Assign one worker sole ownership of browser automation and browser sessions. Other workers repair only assigned failures.
3. Run the regression checks in section 7; rerun affected checks after fixes.
4. Run repository checks and build once integrated. Repeat only after changes or failures justify it.
5. Serve the static export and repeat the required browser matrix.
6. Update `PLAN.md` and `PROGRESS.md` with actual evidence and remaining blockers. Deliver the final report.

## 3. Agent cost and coordination rules

- Maximum four active agents total: coordinator plus three workers.
- Default bounded workers to `gpt-6-luna` with medium reasoning when available. Keep the existing coordinator model for integration and difficult diagnosis. If unavailable, report the fallback model before spawning.
- Use fresh worker context with the relevant contract, owned paths, CodeGraph findings, and failure ledger entries. Do not copy the duplicated original PRD into every worker.
- Workers must not recursively delegate. Reuse worker slots across waves.
- Each file has one writer. Coordinator alone owns shared CSS, content registries, dependency manifests, the shared hook, and integration documents.
- Workers request changes outside ownership through the coordinator. Do not overwrite, reset, or revert another worker's work.
- Escalate after two unsuccessful repair attempts or immediately when a shared architectural contract is insufficient. Return evidence and the smallest unresolved question.
- Run focused checks during development. Avoid a full build for every worker or every edit.
- Return concise handoffs: changed paths, behavior fixed, checks/results, unresolved issues, shared changes requested.
- Record available token/usage data. No dollar-cost guarantee: pricing and task effort are not established here.

Worker assignment template:

```text
Task: repair the assigned confirmed failures and missing requirements.
Owned files: <exact paths assigned by coordinator>.
Baseline failures: <ledger IDs and reproduction steps>.
Contract: <relevant section below and shared interfaces>.
Reuse existing code; preserve static export and canonical evidence.
Edit only owned files. Send shared-file requests to coordinator.
Verify: <specific interaction and geometry acceptance checks>.
Return: changed paths, check results, unresolved issues. No recursive delegation.
```

## 4. Shared technical and design contracts

### Canvas and rendering

- Reuse `useCanvasStage(containerRef, canvasRef, draw, options)` and its existing stage values: width, height, DPR, time, and delta time. Preserve existing consumers when repairing the hook.
- Draw in CSS pixels. Observe the actual CSS-sized container; use `Math.min(window.devicePixelRatio || 1, 2)` for backing dimensions.
- Set backing dimensions to `Math.max(1, Math.floor(logicalSize * dpr))` only when changed. Restore the DPR transform for each draw.
- Handle container resize and DPR changes; pause animation offscreen and while the document is hidden. Clean up all observers/listeners/frames on unmount.
- Migrate remaining visible Canvas 2D consumers where appropriate. Do not apply a 2D hook to WebGL canvases or fixed-resolution generated texture canvases; verify their renderer-specific sizing separately.
- Pointer coordinates must be relative to the drawing rectangle in CSS pixels. Update live HTML telemetry without forcing unnecessary full-scene React renders.
- Reduced motion produces a stable composition and working controls. Never leave a blank canvas because animation is disabled.

### Layout and coordinates

- DOM layout owns text and interactive bounds. SVG paths derive from DOM anchors; converted SVG coordinates must use a consistent screen-space transform.
- Measure full node/label rectangles. Percentage-based center positions do not guarantee non-overlap.
- Use desktop arrangements at widths of at least 1024px. Below that, use the mobile track lane and stacked graph zones.
- Hero uses exact `100dvh` at target viewports. Remove contradictory 700px minimum and 1200px maximum. Prefer container width over `100vw` where scrollbar width could create overflow.
- At enlarged text/zoom or unusually short viewports, permit content growth rather than clipping essential text and controls.
- Keep existing semantic HTML, keyboard behavior, visible focus, accessible control names, and usable touch targets.
- Preserve square or subtly machined corners, unboxed editorial spreads, middle-dot stack separators, and the absence of decorative all-caps HUD labels.

### Palette

Use existing token sources and aliases rather than creating a second independent palette.

| Token | Value |
| --- | --- |
| `--bg-midnight` | `#03050A` |
| `--bg-obsidian` | `#060A12` |
| `--cobalt-deep` | `#0B1E40` |
| `--cobalt-mid` | `#153875` |
| `--cobalt-bright` | `#2563EB` |
| `--accent-red-orange` | `#FF2800` |
| `--accent-crimson` / existing crimson-glow alias | `#FF4419` |
| `--metal-silver` | `#C8D2E0` |
| `--metal-chrome` | `#E6ECF5` |
| `--metal-titanium` | `#7E8B9B` |
| `--text-alabaster` | `#F4F6F9` |

Layer intent: background -10; section art 10; text/controls 20; section dossiers 30; header 50; navigation overlay 60; burnout smoke 70. Establish stacking contexts deliberately: numerical z-index values alone cannot overcome ancestor clipping or place a negative background above an opaque page root. Decorative layers remain pointer-transparent.

### Content and compatibility

- Preserve Pages Router, existing static routes, `getStaticPaths`/`getStaticProps`, and exported assets.
- Use canonical projects, experience, and evidence registries for counts, years, metrics, awards, and links.
- Reconcile proposed PRD metrics against evidence. Never silently publish unsupported latency, privacy, encryption, research, or award claims.
- No new public API, content schema, dependency, or router migration is expected.

## 5. Component work orders

### A. Hero and forged carbon

- [ ] Keep the supplied headline: “Curious about intelligence. Obsessed with making it work.”
- [ ] Use the supplied subheadline: “Building high-speed computational systems where machine intelligence meets physical reality.”
- [ ] Keep a visible, working “Explore Work” CTA. Remove obsolete eyebrow/HUD copy where present.
- [ ] Size the canvas from the hero container. Preserve readable foreground text and prevent CTA clipping at every target viewport.
- [ ] Restore missing artwork: 45-degree pear-shaped bulb, continuous braided DNA, silver/cobalt glass rim, four drafting rings, launch corridor, and 22 continuous wind-tunnel streamlines.
- [ ] Desktop composition starts from bulb center `(0.71W, 0.38H)` and radius `0.21 * min(W,H)`; adapt placement/scale on mobile to protect text. Preserve a continuous smooth-min glass envelope rather than disconnected arcs.
- [ ] Keep foreground DNA silver/white, background strand red-orange, and alternating cobalt/crimson rungs. Canvas art carries no extra HUD text labels.
- [ ] Reuse the carbon engine. Where missing, use a 512px repeating procedural tile with 160 angular 4–6-vertex facets, approximately 22–64px wide, on `#03050A`.
- [ ] Facet bases remain `#04070D`, `#060B14`, or `#080F1C`. Fine silver striations use low opacity; directional glints use `abs(cos(theta - lightAngle)) ** 16` with restrained cobalt/silver highlights.

Accept when viewport bounds and CTA tests pass, the bulb is undistorted, the glass/DNA remain continuous, and screenshots show dark carbon rather than a washed-out grey field.

### B. Four Selected Works plates

- [ ] Preserve Healios V2, Apexis, RouteRx/Careline, and Tempo with evidence-backed copy and links.
- [ ] Use an unboxed desktop 5/7 split in a 12-column grid, maximum content width 1380px; stack on smaller screens.
- [ ] Keep index/title/thesis/narrative, two metrics, stack line, case-study link, and source link in the editorial region.
- [ ] Make each visualization a three-row stage: controls, flexible drawing area, telemetry. Use approximately 460px desktop stage height; let controls/footer grow on narrow screens.
- [ ] Keep HTML controls and telemetry outside the drawing region. Use `min-height: 0` where needed for the flexible canvas row.
- [ ] Verify Healios mesh/heatmap/pipeline, Apexis sector delta/workers, RouteRx isochrone durations/transit matrix, and Tempo triage/ring-buffer modes. Preserve working equivalent simulations instead of replacing them.
- [ ] Every tab changes React state and visible rendering. Cursor/scrub telemetry must reflect actual interaction, not fabricated backend activity.

Accept when all modes work, canvas proportions survive resizing, controls remain readable, and no HTML telemetry covers the artwork.

### C. Experience circuit

- [ ] Preserve five canonical roles in top-to-bottom order and the clean “Experience.” heading.
- [ ] Desktop uses alternating 5/2/5 editorial/track/space columns; mobile reserves a separate narrow track lane beside role text.
- [ ] Observe container and relevant layout changes, then measure every apex center relative to the SVG container. Refresh after font loading and row-size changes.
- [ ] Generate cubic segments through measured anchors using vertical control handles. Reserve space for the full 64px glow, 52px barrier, 46px asphalt, and car envelope.
- [ ] Keep a 3px racing line and red-orange/silver curbs. Check stroke clearance, not just centerline clearance.
- [ ] Compute car position with SVG path length and heading from neighboring samples. Unwrap tangent angles continuously and account for the car artwork's native orientation.
- [ ] Lower selections move forward in about 700ms. Upper selections exit below in about 400ms, wrap above, then enter toward the selected role in about 500ms.
- [ ] Extrapolate off-path entry/exit positions; clamped `getPointAtLength()` alone cannot move the car offscreen.
- [ ] Rapid clicks cancel stale movement and target the latest selection. Resize during travel keeps the selected destination valid. Reduced motion selects immediately.

Accept when each waypoint matches its path within 1 CSS pixel, the track/car avoid role text, and forward wrapping, orientation, resizing, and rapid-click tests pass.

### D. CodeGraph

- [ ] Keep `/projects`, existing canonical taxonomy, all-systems fallback, and existing case-study routes.
- [ ] Preserve four states: origin, selected core, selected domain, selected project. Counts derive from content, not hardcoded 18/10/8 assumptions.
- [ ] Desktop allocates bounded areas for parent ancestry, active nodes, and the dossier. Target approximately 0–22%, 22–60%, and 60–96% when a dossier is open; adapt internal spacing to actual label widths.
- [ ] Move nodes between these areas to retain the rabbit-hole effect. Generate edges from the actual rendered anchors; avoid unbounded depth-based world translation.
- [ ] Reserve at least 110px between domain-node centers where applicable; grow stage height when actual labels need more room.
- [ ] Keep complete active node and dossier rectangles within the stage's 5–95% safe horizontal bounds on desktop. Dossier maximum width is 480px, constrained further by available space.
- [ ] Below 1024px, stack breadcrumb, active node list, and dossier with normal document scrolling; retain all actions.
- [ ] Every parent navigates back to its level. Project selection shows title, year/domain, supported metric, architectural narrative, stack, “Enter Full Case Study,” and “Step Back.”
- [ ] Preserve focus visibility and meaningful focus placement after navigation. Hidden preview nodes cannot intercept clicks or keyboard focus.

Accept when every core/domain/project path and back action works, long titles remain readable, no dossier clips, and route navigation resolves in the static export.

### E. Recognition carousel

- [ ] Preserve five evidence-backed entries corresponding to the requested DataFest, IBM/Vantage, TamilTrove, and OSU/leadership recognition. Resolve wording/year discrepancies through canonical evidence.
- [ ] Retain signed circular offsets `((i - activeIndex + 7) % 5) - 2` for five entries.
- [ ] Use spring-driven horizontal translation, depth, rotation, scale, and opacity. Desktop targets: spacing up to 260px, depth `-abs(offset)*180px`, rotation `offset*-28deg`, active scale 1.08.
- [ ] Derive mobile spacing and medallion size from actual width; fixed 140px spacing is not a guarantee of containment.
- [ ] Preserve the metallic bezel, curved inscription, dark cobalt core, geometric emblem, active orange ring, and active pointer tilt up to about 15 degrees.
- [ ] Keep the 3D subtree free of flattening overflow/opacity/filter grouping. Apply effects on suitable inner elements; inspect computed styles through ancestors.
- [ ] Side medallions remain clickable and focusable. Previous/next and arrow-key controls select every entry. Reduced motion keeps selection functional without continuous tilt.
- [ ] Reserve plinth height for the longest title, metadata, summary, and actions at each breakpoint. The next section must not jump when selection changes.

Accept when every medallion can become active, depth remains visible, the page does not overflow, and plinth layout is stable.

### F. Lower sections

- [ ] Podcast: verify all five requested guest selections—Steve Wang, Dhaval Patel, Paul Shapiro, Andrea Jacobs, Adam Geller—against current content. Preserve waveform selection and marker movement, stable episode text area, and `https://syntinuumpodcast.com` link.
- [ ] About: preserve unboxed 40/60 portrait/prose desktop layout, readable mobile stacking, and 112px desktop separation before the standalone clinical research artifact.
- [ ] Milestones: preserve four readable 2023–2026 chronology entries, prominent year numerals, and a datum line that does not cross text.
- [ ] Technical index, Now, and Contact: check contrast, wrapping, navigation, and regressions from shared changes. Modify only demonstrated defects or explicitly missing requirements.

Accept when interactions and links work and lower sections remain readable without layout jumps or collisions.

## 6. Skills and MCP routing

Use relevant capabilities at the point they improve the task. “Use all tools” means cover the work with appropriate tools, not invoke unrelated integrations.

| Trigger | Skill/tool | Expected output |
| --- | --- | --- |
| Structure, callers, canvas inventory | CodeGraph | Bounded source/flow and blast-radius map |
| Large logs/source analysis | Context-mode | Summaries and queried evidence rather than raw dumps |
| Scope and implementation contracts | Brainstorming, ponytail, sequential-thinking | Smallest complete change and explicit failure handling |
| Execution records | Planning-with-files | Updated PLAN.md and PROGRESS.md |
| Visual and motion changes | Frontend-design, unslop, motion-engineering | Existing design-system compliance and accessible motion |
| Library/API uncertainty | Context7 and installed Next.js docs | Version-appropriate interface guidance |
| Reproduced defect | Systematic-debugging | Root cause, focused regression, verified repair |
| Browser interaction and bounds | Playwright | Repeatable assertions and screenshots |
| Stacking, rendering, performance diagnosis | Chrome DevTools | Computed styles, console/network and rendering evidence |
| Content wording changes | Humanizer | Concrete copy preserving supported claims |
| Final completion | Verification-before-completion | Actual command/browser results |
| Deployment provenance or release work | GitHub/Vercel, only as needed | Revision/preview evidence; deployment only when authorized |

Read applicable skill instructions before use. Reuse installed primitives; consult shadcn only if a missing UI primitive requires it. Figma/Stitch require a relevant design input or task. Supabase, email, calendar, and unrelated SaaS tools are outside this repair scope. Record unavailable tools and the equivalent verification used instead.

## 7. Verification procedure

### Repeatable browser checks

Leave one small runnable regression suite using existing test/browser tooling. Avoid adding a framework solely for these assertions. Coordinator records the exact invocation in `PROGRESS.md`.

At each target viewport, test:

1. **Global:** no unintended horizontal overflow, no new uncaught errors, usable focus and navigation; fonts/assets load.
2. **Hero:** normal-size height matches `window.innerHeight` within rounding tolerance; CTA lies within visible hero bounds; zoomed text remains reachable.
3. **Canvas:** backing width/height equal floored CSS dimensions times capped DPR at DPR 1 and 2; resize without reload updates correctly; hidden/offscreen animation stops and resumes.
4. **Plates:** activate every tab; verify visible mode changes and pointer telemetry; assert control/drawing/footer rectangles do not overlap.
5. **Experience:** measure waypoint/path alignment and track/text clearance; click lower then upper roles; exercise rapid clicks and resize mid-animation; visually verify heading continuity.
6. **CodeGraph:** visit every core/domain/project; test ancestry, Step Back, all-systems view, dossier bounds, long titles, and case-study URLs.
7. **Recognition:** select all five via side clicks and navigation controls; verify active entry, link, visible focus, tilt reset, and stable next-section position.
8. **Lower sections:** select every episode; check destination links, research separation, chronology readability, and footer actions.
9. **Accessibility:** repeat key flows with keyboard and reduced motion; check 200% zoom without clipped essential controls.

Use small rounding tolerances for geometry. Exclude intentional decorative overlap from collision assertions. DOM rectangles cannot prove canvas artwork quality or 3D depth: inspect screenshots and computed styles as well.

### Repository checks

Run from the repository root and inspect every exit code:

```bash
npm run typecheck
npm run validate-content
npm run build
```

Serve `out/` using the existing static-preview command. Re-run the browser matrix against the export, including direct project-route navigation and reloads. Preserve logs and screenshots in one consistent verification location and record their paths.

### Final handoff

Report:

- Requirements fixed and existing implementations retained.
- Changed files and any interface changes.
- Commands executed, exit results, and browser matrix results.
- Screenshot/evidence locations and production/local differences.
- Remaining failures, unavailable checks, and material limitations.

Do not mark a phase complete on a build alone. An unresolved acceptance failure keeps its ledger entry open.

## 8. Explicit limits

The current task creates this handoff document only. It does not perform component repairs or deploy the site.

Skip blanket rewrites, duplicate canvas abstractions, speculative dependencies, fabricated content claims, and unrelated integrations. Current browser failures are unconfirmed until Phase 0; repository inspection is not visual acceptance evidence.

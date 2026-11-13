# Portfolio V7.0 — Creative & Technical Blueprint

Source: supplied by Haresh on 2026-11-12. Sections 0–9 are verbatim. The **Decisions** appendix at the end records the answers given after Phase 0 discovery; where it disagrees with sections 0–9, the appendix wins.

## 0. What is live today

The deployed site differs from the brief in five places, and each one changes what Claude Code should build.

| Topic | Brief says | Live site shows | Needs your call |
|---|---|---|---|
| Section order | Hero, Works, Constellation, Experience, Syntinuum, Index, Recognition, About, Milestones, Now, Contact | Hero, About, Experience, Works, Constellation, Syntinuum, Index, Recognition, Milestones, Now, Contact | This plan uses the brief's order (work before biography) |
| Recognition | IBM SkillsBuild AI Hackathon; NSLS and OSU Research Honors | Hack to the Future (NYC OS); Healios 8.09 ms benchmark | Which five medallions are real and final |
| Tool icons | C++, Go, Swift/ARKit, MATLAB, Docker, SQLite, Three.js, WebGL, FAISS, Node.js | None of these appear; Java, pgvector, Framer Motion and Zod do | Only tools with a shipped project get an icon (section 6) |
| Syntinuum | Three pillars | Five episodes, no pillars defined | Confirm the three zones proposed in section 5 |
| Tempo | Air-gapped local SQLite state machine | Communication safety and state machines, 100% (5/5) | Which description is current |

What the build already has, so V7.0 extends it instead of replacing it:
- Next.js with Turbopack, Geist, Geist Mono and Geist Serif, and a full CSS-variable token set (--bg-midnight, --cobalt-bright, --accent-red-orange, easing and spacing scales).
- Seven canvases and nine SVGs on the home page. No GSAP, Lenis or three.js is loaded.
- Section ids hero, about, experience, projects, archive, podcast, skills, achievements. The page is 16,529 px tall, about 23 viewports.
- Only four large bordered containers remain, so the unboxing work is mostly dividers, tab bars and episode cards.

One defect to fix in passing: the Experience tab bar (01 CAS … 05 Syntinuum) stays stuck under the header after its section ends and overlaps the top of Selected Works.

## Part 1 — Vision and architecture

### Direction: the visitor is the light

V7.0 has one organising idea: the pointer is a light source, and both carbon materials exist to catch it. The hero already says this with a lightbulb. V7.0 makes it literal everywhere: the weave glints toward the cursor, the medallions take their specular sweep from it, tool icons ignite under it, and the Syntinuum bulb is that light given a body.

The two materials also carry meaning, so the alternation is not decoration:
- Dark forged carbon is the tunnel. Things that run live: the hero, the constellation, the waveform, the medallions under a spotlight, the viewfinder.
- White-silver weave is the garage under inspection lights. Things you study: project blueprints, the career circuit as a printed track map, the tool wall, the portrait, the timeline, the contact page.

Four rules every section obeys:
1. One mechanic per section. If a section has a wheel, it has no second gimmick.
2. One label per object. Nothing is named twice, and no text explains how to interact.
3. Nothing sits in a frame. Graphics end where their own geometry ends.
4. At most three pinned sections, never two in a row. Everything else scrolls natively.

## 1. Chromatic rhythm map and scroll physics

The page alternates strictly dark, light, dark, light across ten beats and ends in daylight. About and Milestones share one light beat.

| # | Section | Material | Scroll physics | Enters by |
|---|---|---|---|---|
| 00 | Hero | Dark | Free scroll; streamline speed follows scroll velocity | Page load |
| 01 | Selected Works | Light, with a black carbon wheel | Pinned, four detent stops of 70 vh each | Diagonal shutter |
| 02 | Constellation | Dark | Free scroll, two-layer depth drift | Horizon bleed: nodes appear as the white dims |
| 03 | Experience | Light, track drawn in ink | Pinned horizontal circuit (existing) | The 90° turn carries the material change |
| 04 | Syntinuum | Dark | Free scroll; bar amplitude follows scroll velocity | The 90° turn out |
| 05 | Technical Index | Light | Free scroll, no motion beyond reveals. The quiet section | The waveform flattens into the first rule |
| 06 | Recognition | Dark | Not pinned; orbital carousel by click, drag or keys | Iris opens from the centre medallion |
| 07–08 | About, Milestones | Light | Free scroll; portrait parallax of 6% | Horizon bleed |
| 09 | Now | Dark | Short pin, three focus stops of 60 vh each | Iris closes into the viewfinder |
| 10 | Contact and footer | Light | Free scroll | Exposure blow-out to white |

Pinned distance totals about 9 viewports across Works, Experience and Now, and a free section always sits between two pins.

### One background, two materials

Both materials render in a single fixed, full-viewport WebGL2 canvas (CarbonField) behind all content. Sections are transparent and declare data-material="dark" or "light". This is what makes transitions cheap: a transition is a mask function inside one shader, not a DOM clip-path.
- Redraw policy. The field redraws only when scroll position or pointer position changes. It never runs a continuous loop.
- Resolution. Device pixel ratio capped at 1.5.
- Fallback. No WebGL2, prefers-reduced-motion, or a failed frame-time probe gives static CSS: two tiled textures and straight gradient seams.

### White-silver weave, in the fragment shader

A 2×2 twill at a tow width of 6 CSS px:
1. cell = floor(px / 6); the warp is on top where mod(cell.x + cell.y, 4) < 2, otherwise the weft.
2. Fibre tangent T runs along y for warp and x for weft, tilted by a cosine bulge across the tow so each tow reads as a rounded ribbon.
3. Anisotropic highlight (Kajiya-Kay): spec = pow(sqrt(1 - dot(T, H)^2), 48), with H the half-vector between view and light.
4. Light angle = base + 0.5π · sectionProgress + 0.2 · pointer.x. Scrolling walks the glint across the weave; the cursor nudges it.
5. Colour: #EAEFF5 in the gaps, #F4F6F9 on the tows, highlights toward #FFFFFF, and an ice-cobalt glint (#BFD4FF, 6% maximum) only where spec > 0.92.

Total luminance variation stays under 4%, so obsidian text (#050811) holds roughly 17:1 everywhere on it.

### Dark forged carbon

Keep the existing chip texture. Move it into the same shader as a Voronoi chip field: each chip gets a random fibre direction and uses the same highlight function with a cobalt-tinted specular, so both materials answer the same light.

## 2. Transitions and the cut list

Nine boundaries use four transition types, and only three boundaries get a showpiece. Nine showpieces in one scroll would be the fatigue you want to avoid.

Every boundary owns a seam: 70 vh of empty space with no text in it. The mask animates only inside the seam, so obsidian text never lands on a dark slat that has not opened yet. Seam progress p runs 0 to 1 as the seam crosses the viewport.

| Type | Used at | Mask maths |
|---|---|---|
| Diagonal shutter | Hero to Works | Slats at 45°, matching the bulb's angle. Slat index i = floor((x + y) / 96px); each slat opens with smoothstep(0, 1, 2.2p - 0.06i). A 1 px #FF2800 line rides each leading edge |
| Iris | Index to Recognition (opens); Milestones to Now (closes) | Seven-blade aperture: r(θ) = R(p) · cos(π/7) / cos(mod(θ + 0.4p, 2π/7) - π/7). Blades rotate 0.4 rad as they move |
| Horizon bleed | Works to Constellation; Recognition to About | A horizontal band 30 vh tall mixes the two materials with a thin silver line at the boundary, like light under a door |
| Carried by the section | Into and out of Experience; Syntinuum to Index; Now to Contact | The 90° turn wipes the track surface. The waveform's amplitude falls to zero and its baseline becomes the Index's first rule. The viewfinder overexposes to white |

Fixed elements (brand mark, wheel-rim nav, cursor) read the material under them with an IntersectionObserver on a line at their own y position and crossfade their colour in 180 ms.

### Cut list

Remove these from the page. Where a hint matters for accessibility, keep it as visually hidden text.
- Hero coordinates line (40.00° N, 83.03° W).
- Every interaction hint: "Sweep across a line to pluck it…", "Tap a node to preview it…", "Use the up and down arrow keys…".
- The cos θ label, "cursor idle", "model active", and the + markers that expand nothing.
- Carousel ornaments (94.2No. 04, 8.09No. 05) and repeated captions ("Benchmark · TamilTrove · TamilTrove").
- The featured Digital Pathology block in Experience, which repeats entry 02.
- Website, YouTube and Spotify buttons repeated on every episode card. The section gets one set.
- Stat repeats. 8.09 ms, 60 fps and 1st each appear in up to four sections; each keeps one home, in Selected Works or Recognition.
- The footer's "Designed and built in Columbus, OH · Next.js".

## 3. Nothing in a box

No canvas, diagram, waveform or medallion may have a background, border, radius or shadow of its own. The test is mechanical, so Claude Code can run it.
- Canvases are transparent and draw only their own marks. Edges fade with an alpha falloff in the drawing code, not a CSS mask on a rectangle.
- Where a graphic needs a boundary, it uses its own geometry: an axis, a baseline, a tick ruler, four corner ticks.
- Tabs and pagers lose their bars. 01 / 04 pagers are deleted where a wheel or orbit already shows position.
- Separation between items comes from space and one hairline rule, never a card.
- Automated check: no element inside main wider than 200 px and taller than 100 px may compute a non-zero border, a box-shadow, or an opaque background. The live site has four such elements today.

## 4. Selected Works: the half-wheel

A black forged-carbon wheel protrudes from the left edge of a white-weave page, and turning it changes the project. It is the only dark object in the section, so it reads as a machined part laid on a drawing table.

### Geometry
- Centre sits exactly on the left viewport edge, at the vertical middle of the pinned stage. Radius R = min(46vh, 34vw), so exactly half the wheel is on screen.
- The wheel has eight sectors at 45°, carrying the four projects twice (01 02 03 04 01 02 03 04). This lets it spin forever in either direction with every project always visible: one at the apex, one above, one below, and one half-clipped at each edge.
- The apex is the 3 o'clock position. A fixed #FF2800 index mark on the page points at it and does not rotate.
- Layout to the right of the wheel: project details in one column, then the live blueprint, which runs to the right viewport edge with no frame.
- Under 768 px the wheel moves to the bottom edge with its top half showing, and the drag axis becomes horizontal.

### Construction
Inline SVG, not canvas: it stays sharp at any size and costs nothing when still.
- Outer ring: twill `<pattern>` in near-black with a faint cobalt specular arc that tracks the pointer angle.
- Rim lip: a conic-gradient in machined silver, 6 px wide.
- Eight tabs: arc segments with labels on textPath (01 HEALIOS V2). The active tab's label turns #FF2800.
- Hub: the existing seven-layer rim motif from the nav trigger, so the two wheels are visibly the same part.

### Physics
- State is one angle θ. Resting positions are multiples of 45°.
- Motion is a spring: stiffness 220, damping 26, mass 1. That gives a damping ratio near 0.88, a single small overshoot, and settles in about 450 ms.
- While dragging, a detent torque τ = -A · sin(8θ) is added, so the wheel cogs under the hand and you feel eight notches per turn.
- On release, the target is round((θ + 0.18 · ω) / 45°) · 45°, where ω is release velocity in degrees per second. A hard flick skips two or three projects.
- Each detent crossing fires one 8 ms navigator.vibrate on phones and an optional tick through the existing Web Audio layer, silent by default.

### Inputs
- Click a tab: rotates the shortest way to bring it to the apex.
- Drag: the pointer's angle about the wheel centre drives θ directly.
- Scroll: the section pins for four stops of 70 vh. Scroll progress picks the detent, with a dead band of ±8% around each midpoint so it never flutters.
- Keys: role="tablist", arrow keys step one detent, Home and End jump.

### What turns with it
- Project text shares the wheel's pivot. Outgoing lines rotate 12° about the wheel centre and fade; incoming lines arrive from the opposite side, 30 ms apart. The copy looks geared to the wheel.
- The blueprint redraws: SVG strokes draw on with stroke-dashoffset over 500 ms; canvas views crossfade, and the inactive canvas stops its loop.
- The four live views need a light palette pass. Depth cloud and Grad-CAM become ink and heat on paper, like a journal figure. This is the largest hidden cost in the section.

## 5. Syntinuum: three zones and a travelling bulb

The waveform runs edge to edge on dark carbon, split into three zones, and the DNA lightbulb hovers over whichever zone is active and lights it. The light follows the bulb continuously, so the glow slides across the bars as the bulb travels instead of switching zone by zone.

### The three zones (proposed, please confirm)

| Zone | Pillar | Episodes |
|---|---|---|
| 01 | Intelligence: how ML gets taught and powered | Dhaval Patel (codebasics); Steve Wang (High-Tech Venture Capital) |
| 02 | Scale: taking hard science to production | Paul Shapiro (The Better Meat Co.) |
| 03 | Accountability: AI inside human systems | Andrea Jacobs (Technology & Human Rights Initiative); Adam Geller (Edthena) |

### Waveform
- About 240 vertical bars on a transparent canvas, mirrored about a baseline. No frame; the outer 8% on each side fades by alpha.
- Zone boundaries are two gaps of three missing bars with a small mono numeral (01, 02, 03) on the baseline. Those numerals are the only labels.
- Bar heights come from a peaks file per zone. Best is real peaks extracted offline from one episode per zone; a seeded procedural set is the fallback.
- Lighting: lit(x) = exp(-((x - bulbX) / σ)^2) with σ = zone width ÷ 2.2. Bar colour mixes from titanium to the accent by lit, running #2563EB at the edges of the pool to #FF2800 at its centre.
- Lit bars breathe: height · (1 + 0.25 · lit · sin(2t + 0.35i)). Unlit bars are still.

### The bulb
- Reuse the hero's ASCII bulb and rotating helix filament at about 96 px, floating 40 px above the tallest bar.
- Horizontal position is a spring (stiffness 120, damping 20). The bulb tilts into its travel, up to 8° in proportion to velocity, and bobs 4 px at 0.5 Hz at rest.
- A soft cone of light falls from it onto the bars, drawn in the same canvas.
- Hover previews a zone and the bulb follows. Click commits. When the pointer leaves, the bulb returns to the committed zone.
- Keys: three tabs in a tablist, left and right arrows.

### Below the waveform
One panel for the active zone, set directly on the carbon: the pillar name in display serif, one sentence of insight per episode, and episode titles as the links. Spotify, Apple Podcasts and YouTube appear once for the whole section. "100K+ impressions, 10 guests" stays as a single line.

## 6. Technical Index: the tool wall

The tools sit on the white weave as debossed titanium glyphs, like a shadow board in a race garage, and hovering one shows exactly which shipped systems used it.

### Honesty rule
An icon appears only if at least one project or role in the site's data uses that tool. The section already promises that every skill links to shipped work, and a recruiter may ask about any logo. Of the brief's list, C++, Go, Swift/ARKit, MATLAB, Docker, SQLite, Three.js, WebGL, FAISS and Node.js have no entry on the live Index, so each needs a project behind it or it stays off. Java is live but missing from the brief's list; it stays.

### Layout
- Five rows, one per domain, each a hairline rule with the domain name in mono at its left end. Icons stand on the rule at 40 px with 56 px gaps.
- The project list ("Proven in") is a single column of names at the right. It is the other half of the mechanism.
- No tiles, chips or pills.

### Material and ignition
- At rest each glyph is #475569 with a two-layer deboss: a 1 px white offset below and a 1 px slate offset above, so it looks pressed into the weave.
- Under the pointer, the glyph fills with deep cobalt (#153875), lifts 2 px, and gets a #FF2800 tick beneath it. Neighbours within 120 px brighten by distance, so the cursor reads as a lamp passing over metal.
- I recommend accent colours, not brand colours. Two dozen brand colours would break a palette that has exactly two accents. If you want brand colour, allow it on the single hovered glyph only.

### Cross-highlight
- Hover or focus a tool: project names that used it stay obsidian, the rest drop to 25% opacity, and cobalt hairlines draw from the glyph to each name in 300 ms.
- Hover a project name: its tools ignite together.
- Click pins the selection. Project names link to /work/[slug].
- The mapping lives in one typed file, derived from project data, so the wall and the case studies cannot disagree.

### Icon source
Use the simple-icons package as inline SVG paths, with Devicon for any brand it lacks. Simple Icons has removed some brands over time, so check AWS, Java and MATLAB before relying on it. FAISS has no official mark; draw a mono monogram in the same weight.

## 7. Recognition: monumental medallions

The active medallion grows to min(72vh, 52vw) across, roughly double today's size, and sits alone under a spotlight on dark carbon with the others out of focus behind it.

### How a medallion is made
No three.js. Each medallion is a height map plus one small shader.
- Height map. An SVG per award (ring lettering on a path, central numeral, rim beading, reeded edge) rasterised once to a greyscale texture. White is raised, black is cut.
- Lighting. A single WebGL canvas lights the active medallion: normals from a Sobel filter on the height map, Blinn-Phong shading, plus radial brushing where brightness varies as cos(2(φ - φ_light))^24 around the centre. That last term is what makes metal look lathe-turned.
- Light source. The pointer, eased. With no pointer it drifts on a slow figure-eight.
- Metals. Machined silver for all five. The two DataFest firsts carry a #FF2800 enamel ring; the others carry cobalt. No gold: it is not in the palette.
- Background medals. Static bitmaps rendered once from the same shader at a fixed light, then blurred and dimmed in CSS. Only one shader runs at a time.

### Orbit
Five medals ride an ellipse 46 vw wide and 6 vh tall. Depth z runs from 0 at the front to 1 at the back. Scale is 1 - 0.55z, blur is 8px · z, brightness is 1 - 0.5z.

### Choreography for one step, 900 ms

| Time | What happens |
|---|---|
| 0–120 ms | The front medal unseats: scale 1 to 0.96. Its text lines exit upward, 20 ms apart |
| 120–640 ms | The orbit turns one position on a heavy spring (stiffness 90, damping 16), overshooting by under 1°. Each travelling medal rotates once about its own vertical axis, so you see the reeded edge as it passes edge-on. Blur and brightness follow depth continuously |
| 560–900 ms | The new medal seats: scale 1.02 to 1. The light sweeps 140° across its face in 420 ms, a bright band crossing the engraving. The title reveals line by line behind a mask, 60 ms apart |

- Drag moves the orbit one to one and releases to the nearest medal, using projected velocity as on the wheel.
- Keys: left and right arrows. Reduced motion: a 200 ms crossfade and nothing else.
- Type. One award name in display serif, one line of context, the year. The 01 / 05 pager and the ornament numerals go.
- The section's "2× 1st" headline stays; it is the strongest line on the page.

## 8. Now: a focus pull

Now becomes a viewfinder with three subjects at three distances, and the visitor racks focus between them. Depth of field is the metaphor: this is what Haresh is focused on.

Of the three options in the brief I chose the viewfinder. A radar would repeat the constellation, and an isometric station adds illustration the site has none of.

### Staging
- Near: Building. Web Worker simulation runtimes. Closest to shipping, largest on screen.
- Middle: Researching. Spatial tissue coordinate modelling and TILs.
- Far: Exploring. Distributed systems and low-latency consensus. Small, near the horizon line.

All three are always visible as display type at different scales. One is sharp; the other two are blurred by distance from the focal plane.

### Mechanics
- A focus ring appears as an arc along the bottom edge, engraved like a lens barrel with three marks: 0.5 m, 3 m, ∞. Drag it, scroll, click a subject, or use arrow keys.
- Four corner ticks (not a rectangle) contract onto the subject in focus over 350 ms, then pulse once in #FF2800, the way a camera confirms focus.
- Focus breathing: the whole scene scales 1 to 1.03 and back during a rack, as a real lens does.
- Once sharp, the subject's two lines of detail fade in beneath it. Nothing else is on screen.
- The section pins for three stops of 60 vh. It enters through a closing iris and exits by overexposing to white, which becomes the Contact page.

### Blur without the cost
Animating filter: blur() on large type repaints every frame. Each subject is instead rendered three times (sharp, 6 px blur, 12 px blur) and the rack crossfades opacity between copies. That stays on the compositor.

## 9. Polish, guardrails and risks

### Type across two materials
- Keep the three Geist families. Display serif at clamp(3rem, 7vw, 7.5rem); one mono size (12 px) for every label; at most one mono label per section.
- Light type on dark looks heavier than dark type on light. On light sections raise body weight one step and tighten tracking by 0.005 em; on dark keep 400 and add 0.01 em.
- Red on white fails for small text. #FF2800 on #F4F6F9 is about 3.5:1. On light sections use it only for type of 24 px and up, rules and marks. Small accent text on light uses cobalt #153875, which clears 10:1.

### Cursor
- One 10 px dot that inverts with the material under it. No trails.
- It changes shape only over a mechanism: a rotation arc over the wheel, a vertical hairline over the waveform, a grab hand over the orbit, a focus bracket in Now.
- Its real job is being the light. CarbonField, the medallion shader and the tool wall all read one shared, eased pointer position.

### Performance budget
"Locked 60 fps" cannot be promised on every device, so the target is 60 fps on a mid-range laptop with a defined ladder below it.
- One requestAnimationFrame scheduler for the whole site. Every canvas registers with it and is paused by IntersectionObserver when off screen. At most two canvases animate in any frame.
- Three quality tiers chosen by a 500 ms frame-time probe on load: full shader; shader at DPR 1 with no glints; static CSS materials.
- Budgets: LCP under 2.5 s, CLS under 0.05, INP under 200 ms, no main-thread task over 50 ms during scroll at 4× CPU throttle, and under 60 KB gzipped of new JavaScript.
- Native scrolling only. Do not add a smooth-scroll library; it fights trackpads and the three pinned sections.
- prefers-reduced-motion gets a complete path: no pins, no shutters, crossfades only, every mechanism still usable by click and key.

### Risks

| Risk | Why it matters | Mitigation |
|---|---|---|
| Light-palette pass on existing canvases | Works, Experience and the About plate were drawn for dark | Give each a palette prop driven by data-material; budget it as real work |
| Three pinned sections | Scroll-jacking is the most common complaint about portfolio sites | Visible progress cue in each; total pin about 9 viewports; reduced-motion removes pins |
| Full-screen shader on weak GPUs | Phones and old laptops | Dirty-flag redraw, DPR cap, tier ladder |
| Case-study pages | /work/[slug] stays dark and will not match | Out of scope for V7.0; inherit CarbonField dark only |
| Content questions in section 0 | Awards, tools and pillars are résumé claims | Claude Code reads them from data files and stops to ask, never invents |

### Build order
1. Baseline: screenshots and Lighthouse numbers of the current site, on a new branch.
2. Foundation, built alone: material tokens, CarbonField, seams, the shared scheduler and pointer store, section reorder.
3. Five features in parallel, each in its own folder: wheel, Syntinuum, tool wall, medallions, Now.
4. Sweep: cut list, unboxing, light palettes, type and cursor.
5. Verification in a browser at three widths, then a pull request.

---

## Decisions (2026-11-13, after Phase 0) — these override sections 0–9

1. **Recognition: awards only, no benchmarks.** The orbit carries the awards in `src/content/awards.ts`: ASA DataFest 2026 1st, ASA DataFest 2025 1st, Hack To The Future Top Project. The TamilTrove 94.2% and Healios 8.09 ms medallions are removed (those stats keep their home in Selected Works). The orbit is data-driven, so it works with three medals; "five" in section 7 becomes "every award in the file". Both DataFest firsts keep the #FF2800 enamel ring; the rest are cobalt.
2. **Tool wall: every requested tool gets an icon.** Haresh has hands-on experience with C++, Go, Swift/ARKit, MATLAB, Docker, Three.js and Node.js even where no shipped project uses them. Those tools render on the wall but link to no project; the cross-highlight shows no names for them. Tools that do map to projects (SQLite, FAISS, WebGL, Java and everything in `skills.ts`) keep their links. Section 6's honesty rule is relaxed accordingly.
3. **Syntinuum: one destination, show-level copy.** All podcast links go to the show's site (https://www.syntinuumpodcast.com/). The three zones from section 5 stand. The panel describes each pillar at show level (`src/content/podcast.ts`) and names the guests in it, but carries no per-episode links or platform buttons.
4. **Tempo:** the data in `src/content/projects.ts` is current (RSD communication buffer, pgvector on Supabase, 100% (5/5) crisis recall). The "air-gapped" JSON-LD copy is corrected.
5. **Case-study route stays `/projects/[slug]`.** Read every `/work/[slug]` above as `/projects/[slug]`.
6. **OSU block:** the duplicate is the text block in About (role, team, bullets repeating Experience entry 02). It is cut. The pathology figure stays in About and gets the light palette.
7. **Unboxing check:** a single border on one side, at most 1 px wide, is a hairline rule and passes. Borders on two or more sides, any box-shadow, and any opaque background fail.

# Agent guide

This portfolio uses the Next.js Pages Router and exports a static site to `out/`. Preserve static-export compatibility: routes must be available at build time, including project slugs and aliases from `src/content/projects.ts`.

## Where to work

- `pages/`: routes and page-level composition; `pages/projects/[slug].tsx` generates project case studies.
- `src/content/`: portfolio content and evidence registry. Keep claims, evidence IDs, project slugs, and aliases consistent.
- `src/components/`: shared UI and case-study components; `src/scene/`, `src/setpieces/`, and `src/workers/` support visual effects.
- `src/tokens/` and `design/tokens.json`: design tokens; follow existing patterns before adding styles or components.
- `public/`: static assets, sitemap, and robots file.

Check existing content and components before adding new ones. Preserve existing uncommitted work and avoid editing generated output (`.next/`, `out/`, and `build/`).

## Verify changes

- Install dependencies with `npm ci` when needed; use `npm run dev` for local development.
- Run `npm run typecheck` and `npm run build` for code changes. The build ignores TypeScript errors, so typecheck separately.
- Run `npm run validate-content` after changing content, evidence, or project slugs. It imports TypeScript using Node's experimental type stripping; Node 22.15.0 has been verified.
- For UI changes, inspect the affected routes and interactions at desktop and mobile widths, including keyboard access and reduced-motion behavior where relevant.
- Report checks that could not run and any pre-existing failures.

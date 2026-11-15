import { getProjectBySlug, type Project } from './projects';

/**
 * About section's notebook: the builds and research that Selected Works does not show.
 * Copy lives here; each number is read from the project's own case-study metrics,
 * so the figure and its evidence ID stay single-sourced in projects.ts.
 */
interface NotebookSource {
  slug: string;
  name: string;
  problem: string;
  idea: string;
  /** Index into caseStudy.metrics; omit for entries shown with a figure instead of a number. */
  metricIndex?: number;
}

const SOURCES: NotebookSource[] = [
  {
    slug: 'aethergate',
    name: 'AetherGate',
    problem: 'LLM bills climb when every prompt, even a repeated one, goes to the most expensive model.',
    idea: 'A Go gateway that answers repeat questions from a vector cache and sends easy prompts to cheaper models.',
    metricIndex: 0,
  },
  {
    slug: 'jarvis',
    name: 'J.A.R.V.I.S.',
    problem: 'Desktop AI assistants either can’t touch the computer or can touch all of it.',
    idea: 'A local agent hub with four permission tiers. It reads freely, logs edits, and asks before anything destructive.',
    metricIndex: 0,
  },
  {
    slug: 'tamiltrove',
    name: 'TamilTrove',
    problem: 'Keyword search misses the metaphors in classical Tamil poetry, and embeddings miss the exact references.',
    idea: 'A hybrid search that splits compound words for keyword matching, then fuses those hits with semantic ones.',
    metricIndex: 0,
  },
  {
    slug: 'cv-allergy-wheal',
    name: 'Wheal measurement',
    problem: 'Allergy skin tests are still read with a ruler, and two clinicians can measure the same wheal differently.',
    idea: 'An OpenCV pipeline, built in Ohio State research, that measures wheal area against a calibration marker with every step auditable.',
  },
];

export interface NotebookEntry {
  fig: number;
  slug: string;
  name: string;
  problem: string;
  idea: string;
  metric?: Project['caseStudy']['metrics'][number];
}

export const NOTEBOOK: NotebookEntry[] = SOURCES.map((s, i) => {
  const project = getProjectBySlug(s.slug);
  if (!project) throw new Error(`notebook: unknown project slug "${s.slug}"`);
  return {
    fig: i + 1,
    slug: project.slug,
    name: s.name,
    problem: s.problem,
    idea: s.idea,
    metric: s.metricIndex === undefined ? undefined : project.caseStudy.metrics[s.metricIndex],
  };
});

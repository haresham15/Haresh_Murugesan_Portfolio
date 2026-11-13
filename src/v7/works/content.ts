import { getProjectBySlug } from '@/content/projects';
import { healiosPlate } from '@/components/plates/PlateHealios';
import { apexisPlate } from '@/components/plates/PlateApexis';
import { routeRxPlate } from '@/components/plates/PlateRouteRx';
import { tempoPlate } from '@/components/plates/PlateTempo';
import type { PlateDefinition } from '@/components/plates/stageKit';

export interface WorkStat {
  value: string;
  label: string;
}

export interface Work {
  key: string;
  index: string;
  slug: string;
  title: string;
  /** Short name on the wheel tab, set in capitals there. */
  tab: string;
  thesis: string;
  narrative: string;
  stats: WorkStat[];
  stack: string;
  github?: string;
  plate: PlateDefinition;
  /** The one live view this project shows (the mode bar is cut). */
  mode: string;
}

/**
 * Copy and figures are the reconciled flagship copy from projects.ts and evidence.ts
 * (previously in UnifiedProjectField). 8.09 ms and 60 fps live here; the DataFest
 * first place lives in Recognition, so RouteRx shows its other measured figures.
 */
const BASE: Omit<Work, 'stack' | 'github'>[] = [
  {
    key: 'healios',
    index: '01',
    slug: 'healios',
    title: 'Healios V2',
    tab: 'Healios V2',
    thesis: 'Wound monitoring that shows surgeons the reasoning, not just a score.',
    narrative:
      'The patient app runs a Laplacian blur check in the browser in under 35 ms, so unusable photos never upload. On the FastAPI side, tissue beds are segmented in 2.00 ms and a Grad-CAM overlay renders in 8.09 ms with vectorized NumPy, so surgeons see what drove each classification.',
    stats: [
      { value: '8.09 ms', label: 'Grad-CAM saliency' },
      { value: '2.00 ms', label: 'HSV tissue segmentation' },
    ],
    plate: healiosPlate,
    mode: 'saliency',
  },
  {
    key: 'apexis',
    index: '02',
    slug: 'apexis',
    title: 'Apexis',
    tab: 'Apexis',
    thesis: 'Multi-series race telemetry in one tab, with the heavy math off the main thread.',
    narrative:
      'A dedicated simulator worker computes 2D car positions against OpenF1 track coordinates at 60 fps, and a Tesseract.js worker reads broadcast timing graphics in the browser. An embedded SQLite database answers historical queries back to 1950 in under 12 ms.',
    stats: [
      { value: '60 fps', label: 'Worker sim · 16.7 ms frame' },
      { value: '< 12 ms', label: 'Indexed SQLite lookup' },
    ],
    plate: apexisPlate,
    mode: 'track',
  },
  {
    key: 'routerx',
    index: '03',
    slug: 'routerx-careline',
    title: 'RouteRx (Careline)',
    tab: 'RouteRx',
    thesis: 'One shuttle fleet that handles both patient pickups and discharge returns.',
    narrative:
      'Built for Stormont Vail Health in Topeka, KS. Census, OpenStreetMap and GTFS data feed a Transit Vulnerability Index; 43 of 141 census blocks had no bus stop within 800 m. DBSCAN finds pickup clusters and OSRM routes a single fleet in both directions.',
    stats: [
      { value: '43 of 141', label: 'Blocks with no stop in 800 m' },
      { value: '~40%', label: 'Simulated transport cost cut' },
    ],
    plate: routeRxPlate,
    mode: 'deserts',
  },
  {
    key: 'tempo',
    index: '04',
    slug: 'tempo',
    title: 'Tempo',
    tab: 'Tempo',
    thesis: 'A zero-destination buffer for drafting through rejection-sensitive moments.',
    narrative:
      'There is no send button by design, so drafts stay in the sandbox. A deterministic regex gate runs in 0.20 ms before any model call, pgvector recall surfaces how similar moments were resolved, and DeepSeek V3 fails over to Gemini on a timeout or a broken schema.',
    stats: [
      { value: '100% (5/5)', label: 'Crisis recall' },
      { value: '0.20 ms', label: 'Safety gate latency' },
    ],
    plate: tempoPlate,
    mode: 'gate',
  },
];

/** Stack and repository come straight from projects.ts, separated with middle dots. */
export const WORKS: Work[] = BASE.map((w) => {
  const p = getProjectBySlug(w.slug);
  return {
    ...w,
    stack: (p?.stack ?? '').split(',').map((s) => s.trim()).filter(Boolean).join(' · '),
    github: p?.github,
  };
});

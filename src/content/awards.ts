/**
 * Awards shown in Recognition. Awards only: benchmarks live with their projects.
 * Sourced from the former MedallionCarousel entries, evidence.ts and the JSON-LD award list.
 */
import { getEvidence } from './evidence';

export interface Award {
  id: string;
  /** Award name, set in display serif. */
  title: string;
  /** One line of context. */
  context: string;
  year: string;
  /** Ring lettering for the medallion height map. */
  inscription: string;
  /** Short mark struck in the centre of the medallion. */
  centerMark: string;
  /** Enamel ring colour: red-orange for the DataFest firsts, cobalt for the rest. */
  enamel: 'accent' | 'cobalt';
  href: string;
}

const routerx = getEvidence('routerx-careline-transit-gap');

export const awards: Award[] = [
  {
    id: 'datafest-2026',
    title: '1st Place, Best Use of External Data',
    context: `ASA DataFest. RouteRx (Careline) flagged ${routerx?.value ?? '43 of 141 blocks'} in Topeka, KS as transit-isolated.`,
    year: '2026',
    inscription: 'AMERICAN STATISTICAL ASSOCIATION · DATAFEST 2026 · BEST USE OF EXTERNAL DATA · ',
    centerMark: '1st',
    enamel: 'accent',
    href: '/projects/routerx-careline',
  },
  {
    id: 'datafest-2025',
    title: '1st Place, Best Use of External Data',
    context: 'ASA DataFest at The Ohio State University, judged against 40+ teams.',
    year: '2025',
    inscription: 'AMERICAN STATISTICAL ASSOCIATION · DATAFEST 2025 · BEST USE OF EXTERNAL DATA · ',
    centerMark: '1st',
    enamel: 'accent',
    href: '/datafest-2025.pdf',
  },
  {
    id: 'hack-to-the-future',
    title: 'Top Project, Data Science Track',
    context: 'Hack To The Future. NYC OS clustered 1M+ NYC sales records into a spatial gravity field.',
    year: '2026',
    inscription: 'HACK TO THE FUTURE · DATA SCIENCE TRACK · TOP PROJECT · NYC OS · ',
    centerMark: 'Top',
    enamel: 'cobalt',
    href: '/projects/nyc-housing-market-ai',
  },
];

/** Section headline. */
export const awardsHeadline = '2× 1st';

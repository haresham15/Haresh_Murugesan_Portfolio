/**
 * Syntinuum, described at the level of the show. Every link goes to the show's site.
 * Pillars group guests from podcastGuests (experience.ts) by the theme of their conversation.
 */
import { podcastGuests, type PodcastGuest } from './experience';

export const podcastSite = 'https://www.syntinuumpodcast.com/';

export const podcastSummary =
  'An engineering leadership podcast on system architecture, scaling dilemmas and technical tradeoffs, with founders, researchers and executives.';

/** Kept as one line in the section. */
export const podcastReach = '100K+ impressions, 10 guests';

export interface PodcastPillar {
  id: 'intelligence' | 'scale' | 'accountability';
  numeral: '01' | '02' | '03';
  name: string;
  /** One show-level sentence for the pillar. */
  line: string;
  guests: PodcastGuest[];
}

const byName = (names: string[]) =>
  names.map((n) => {
    const g = podcastGuests.find((x) => x.name === n);
    if (!g) throw new Error(`podcast.ts: unknown guest ${n}`);
    return g;
  });

export const podcastPillars: PodcastPillar[] = [
  {
    id: 'intelligence',
    numeral: '01',
    name: 'Intelligence',
    line: 'How machine learning gets taught, funded and powered.',
    guests: byName(['Dhaval Patel', 'Steve Wang']),
  },
  {
    id: 'scale',
    numeral: '02',
    name: 'Scale',
    line: 'Taking hard science out of the lab and into production.',
    guests: byName(['Paul Shapiro']),
  },
  {
    id: 'accountability',
    numeral: '03',
    name: 'Accountability',
    line: 'What changes when AI runs inside human systems.',
    guests: byName(['Andrea Jacobs', 'Adam Geller']),
  },
];

/**
 * Now: what Haresh is focused on, at three distances. Copy moved from NowSection.tsx.
 */
export interface NowSubject {
  id: 'building' | 'researching' | 'exploring';
  /** Focus distance mark on the lens ring. */
  distance: '0.5 m' | '3 m' | '∞';
  verb: 'Building' | 'Researching' | 'Exploring';
  title: string;
  /** Two lines of detail, shown once the subject is sharp. */
  detail: [string, string];
}

export const nowIntro = 'Field notes from Columbus, OH: what is on the bench, what is under the microscope, and what is on the desk.';

export const nowSubjects: NowSubject[] = [
  {
    id: 'building',
    distance: '0.5 m',
    verb: 'Building',
    title: 'High-concurrency Web Worker simulation runtimes.',
    detail: [
      'Multi-threaded browser simulation engines on offscreen canvas and SharedArrayBuffer channels.',
      'Deterministic 60 fps physics inside a sub-16 ms frame budget, whatever the main thread is doing.',
    ],
  },
  {
    id: 'researching',
    distance: '3 m',
    verb: 'Researching',
    title: 'Spatial tissue coordinate modeling & TILs.',
    detail: [
      'Spatial graph algorithms for cellular micro-environment modeling at Ohio State.',
      'Segmenting tumor-infiltrating lymphocytes beyond traditional pixel grids.',
    ],
  },
  {
    id: 'exploring',
    distance: '∞',
    verb: 'Exploring',
    title: 'Distributed systems & low-latency consensus.',
    detail: [
      'Raft log compaction, lock-free ring buffers.',
      'Edge database replication for disconnected mobile clients.',
    ],
  },
];

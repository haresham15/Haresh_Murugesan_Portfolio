/**
 * Which project's copy is shown, and which is turning away. Pure, so it is unit-tested.
 * The apex sector changes as θ crosses each 45° boundary; the copy follows it like a gear.
 */
/** Same as PROJECTS in wheelMath.ts; kept local so this file has no imports (node --experimental-strip-types). */
const PROJECTS = 4;

export interface TextState {
  apexSector: number;
  shown: number;
  leaving: { project: number; dir: number; id: number } | null;
  dir: number;
  seq: number;
}

export type TextAction =
  | { type: 'apex'; sector: number; dir: number; animate: boolean }
  | { type: 'settled'; id: number };

export function textReducer(state: TextState, action: TextAction): TextState {
  if (action.type === 'settled') {
    return state.leaving && state.leaving.id === action.id ? { ...state, leaving: null } : state;
  }
  if (action.sector === state.apexSector) return state;
  const project = action.sector % PROJECTS;
  if (project === state.shown) return { ...state, apexSector: action.sector };
  const seq = state.seq + 1;
  return {
    apexSector: action.sector,
    shown: project,
    dir: action.dir,
    seq: action.animate ? seq : state.seq,
    leaving: action.animate ? { project: state.shown, dir: action.dir, id: seq } : null,
  };
}

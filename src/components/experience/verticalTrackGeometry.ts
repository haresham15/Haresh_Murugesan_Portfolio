export type TrackPoint = { x: number; y: number };

export function buildTrackPath(points: TrackPoint[], entryX: number, height: number) {
  let previous = { x: entryX, y: 0 };
  let d = `M ${entryX} 0`;
  for (const point of [...points, { x: entryX, y: height }]) {
    const middleY = (previous.y + point.y) / 2;
    d += ` C ${previous.x} ${middleY}, ${point.x} ${middleY}, ${point.x} ${point.y}`;
    previous = point;
  }
  return d;
}

export function unwrapTrackAngle(previous: number, next: number) {
  return previous + ((next - previous + 540) % 360 + 360) % 360 - 180;
}

export function needsForwardWrap(current: number, target: number) {
  return target < current;
}

// Every segment increases in y, so binary search lands on the measured apex.
export function progressAtY(path: Pick<SVGPathElement, 'getPointAtLength'>, length: number, y: number) {
  let low = 0;
  let high = 1;
  for (let i = 0; i < 32; i++) {
    const mid = (low + high) / 2;
    if (path.getPointAtLength(mid * length).y < y) low = mid;
    else high = mid;
  }
  return (low + high) / 2;
}

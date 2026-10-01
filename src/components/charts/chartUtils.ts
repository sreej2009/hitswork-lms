export interface ChartDatum {
  label: string;
  value: number;
}

/** Rounds a maximum up to a "nice" axis limit (1, 2, 2.5 or 5 × 10ⁿ) so tick labels stay readable. */
export function niceMax(value: number): number {
  if (value <= 0) return 1;
  const exponent = Math.floor(Math.log10(value));
  const base = 10 ** exponent;
  for (const step of [1, 2, 2.5, 5, 10]) {
    if (value <= step * base) return step * base;
  }
  return 10 * base;
}

/**
 * Evenly spaced ticks from 0 to `max`, top first. The tick count follows the leading digit so steps stay
 * round: 50 → 0,10,…,50 (5 steps); 20 → 0,5,…,20 (4 steps).
 */
export function ticksFor(max: number, count?: number) {
  const lead = max / 10 ** Math.floor(Math.log10(max));
  const steps = count ?? (lead === 2 ? 4 : 5);
  return Array.from({ length: steps + 1 }, (_, i) => (max / steps) * (steps - i));
}

/** Indexes of the x-axis labels to show so they never crowd (always includes the first and last). */
export function labelIndexes(length: number, maxLabels = 7): Set<number> {
  if (length <= maxLabels) return new Set(Array.from({ length }, (_, i) => i));
  const step = Math.ceil((length - 1) / (maxLabels - 1));
  const indexes = new Set<number>();
  for (let i = 0; i < length; i += step) indexes.add(i);
  indexes.add(length - 1);
  return indexes;
}

/**
 * Phones get half the labels: every other shown label (counting from the first) is hidden below `sm`,
 * except the last one, so labels never run into each other on narrow charts.
 */
export function phoneHiddenLabels(shown: Set<number>): Set<number> {
  const ordered = [...shown].sort((a, b) => a - b);
  const last = ordered[ordered.length - 1];
  const hidden = new Set<number>();
  ordered.forEach((index, ordinal) => {
    if (ordinal % 2 === 1 && index !== last) hidden.add(index);
  });
  // Keep the second-to-last label off phones when it sits right next to the last one.
  const beforeLast = ordered[ordered.length - 2];
  if (beforeLast !== undefined && !hidden.has(beforeLast) && ordered.length > 2) hidden.add(beforeLast);
  return hidden;
}

export type FocusDirection = 1 | -1;

export function nextFocusIndex(current: number, count: number, direction: FocusDirection): number {
  return (current + direction + count) % count;
}

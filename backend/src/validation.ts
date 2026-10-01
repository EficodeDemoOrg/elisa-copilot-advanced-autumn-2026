export function withinChart(start: string, end: string, chartStart: string, chartEnd: string): boolean {
  return start >= chartStart && end <= chartEnd && start <= end;
}

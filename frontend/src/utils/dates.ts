// All dates in this app are calendar dates (no time / timezone).
// We treat them as YYYY-MM-DD strings and compare in UTC to avoid DST surprises.

export function parseDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function formatDate(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addDays(iso: string, days: number): string {
  const d = parseDate(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return formatDate(d);
}

/** Inclusive day count between two ISO dates. start <= end assumed. */
export function daySpan(startIso: string, endIso: string): number {
  const ms = parseDate(endIso).getTime() - parseDate(startIso).getTime();
  return Math.round(ms / 86_400_000) + 1;
}

/** Number of days from chartStart to date (0-based index). */
export function dayIndex(chartStart: string, dateIso: string): number {
  const ms = parseDate(dateIso).getTime() - parseDate(chartStart).getTime();
  return Math.round(ms / 86_400_000);
}

export function isWeekend(iso: string): boolean {
  const day = parseDate(iso).getUTCDay();
  return day === 0 || day === 6;
}

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

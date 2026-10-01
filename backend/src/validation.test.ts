import { describe, expect, it } from 'vitest';
import { withinChart } from './validation.js';

describe('withinChart', () => {
  const chartStart = '2026-01-01';
  const chartEnd = '2026-01-31';

  it('returns true when task fits inside the chart range', () => {
    expect(withinChart('2026-01-05', '2026-01-10', chartStart, chartEnd)).toBe(true);
  });

  it('returns true when task spans the full chart range', () => {
    expect(withinChart(chartStart, chartEnd, chartStart, chartEnd)).toBe(true);
  });

  it('returns false when task starts before the chart', () => {
    expect(withinChart('2025-12-31', '2026-01-10', chartStart, chartEnd)).toBe(false);
  });

  it('returns false when task ends after the chart', () => {
    expect(withinChart('2026-01-20', '2026-02-01', chartStart, chartEnd)).toBe(false);
  });

  it('returns false when start is after end', () => {
    expect(withinChart('2026-01-10', '2026-01-05', chartStart, chartEnd)).toBe(false);
  });
});

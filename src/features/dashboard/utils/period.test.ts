import { describe, expect, it } from 'vitest';
import { resolveDashboardPeriod } from './period';

describe('resolveDashboardPeriod', () => {
  it('uses day grain for the day preset', () => {
    const result = resolveDashboardPeriod('day');
    expect(result.grain).toBe('day');
    expect(result.from <= result.to).toBe(true);
  });

  it('uses week grain for the week preset', () => {
    const result = resolveDashboardPeriod('week');
    expect(result.grain).toBe('week');
  });

  it('uses month grain for the month preset', () => {
    const result = resolveDashboardPeriod('month');
    expect(result.grain).toBe('month');
  });

  it('picks grain from custom range length', () => {
    expect(
      resolveDashboardPeriod('custom', '2026-01-01', '2026-01-10').grain
    ).toBe('day');
    expect(
      resolveDashboardPeriod('custom', '2026-01-01', '2026-03-01').grain
    ).toBe('week');
    expect(
      resolveDashboardPeriod('custom', '2026-01-01', '2026-08-01').grain
    ).toBe('month');
  });
});

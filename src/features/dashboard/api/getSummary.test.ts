import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '@/core/api';
import { getDashboardSummary } from './getSummary';

vi.mock('@/core/api', () => ({
  apiClient: vi.fn(),
}));

describe('getDashboardSummary', () => {
  beforeEach(() => {
    vi.mocked(apiClient).mockReset();
  });

  it('calls /dashboard/summary with from, to, and grain', async () => {
    vi.mocked(apiClient).mockResolvedValueOnce({} as never);

    await getDashboardSummary({
      from: '2026-01-01',
      to: '2026-01-31',
      grain: 'week',
    });

    expect(apiClient).toHaveBeenCalledWith(
      '/dashboard/summary?from=2026-01-01&to=2026-01-31&grain=week'
    );
  });

  it('includes topN when provided', async () => {
    vi.mocked(apiClient).mockResolvedValueOnce({} as never);

    await getDashboardSummary({
      from: '2026-01-01',
      to: '2026-01-31',
      grain: 'day',
      topN: 5,
    });

    expect(apiClient).toHaveBeenCalledWith(
      '/dashboard/summary?from=2026-01-01&to=2026-01-31&grain=day&topN=5'
    );
  });
});

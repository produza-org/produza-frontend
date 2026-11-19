import { apiClient } from '@/core/api';
import type {
  DashboardSummary,
  DashboardSummaryParams,
} from '@/features/dashboard/types/dashboard';

export function getDashboardSummary(
  params: DashboardSummaryParams
): Promise<DashboardSummary> {
  const query = new URLSearchParams({
    from: params.from,
    to: params.to,
    grain: params.grain,
  });

  if (params.topN !== undefined) {
    query.set('topN', String(params.topN));
  }

  return apiClient<DashboardSummary>(`/dashboard/summary?${query}`);
}

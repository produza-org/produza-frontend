import { useEffect, useState } from 'react';
import { ApiError } from '@/core/api';
import { getDashboardSummary } from '@/features/dashboard/api';
import type {
  DashboardSummary,
  DashboardSummaryParams,
} from '@/features/dashboard/types/dashboard';

type UseDashboardSummaryResult = {
  data: DashboardSummary | null;
  isLoading: boolean;
  errorMessage: string | null;
};

export function useDashboardSummary(
  params: DashboardSummaryParams,
  enabled = true
): UseDashboardSummaryResult {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!enabled) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);
      try {
        const summary = await getDashboardSummary(params);
        if (!cancelled) {
          setData(summary);
        }
      } catch (error) {
        if (!cancelled) {
          setData(null);
          if (error instanceof ApiError) {
            setErrorMessage(error.message);
          } else {
            setErrorMessage('UNEXPECTED');
          }
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [enabled, params]);

  return { data, isLoading, errorMessage };
}

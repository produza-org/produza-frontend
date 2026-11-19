import { useMemo, useState } from 'react';
import type {
  DashboardPeriodPreset,
  DashboardSummaryParams,
} from '@/features/dashboard/types/dashboard';
import { resolveDashboardPeriod } from '@/features/dashboard/utils/period';

export function useDashboardPeriod() {
  const [preset, setPreset] = useState<DashboardPeriodPreset>('week');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  const params: DashboardSummaryParams = useMemo(() => {
    if (preset === 'custom' && (!customFrom || !customTo)) {
      return resolveDashboardPeriod('week');
    }
    return resolveDashboardPeriod(preset, customFrom, customTo);
  }, [preset, customFrom, customTo]);

  const isReady = preset !== 'custom' || Boolean(customFrom && customTo);

  return {
    preset,
    setPreset,
    customFrom,
    setCustomFrom,
    customTo,
    setCustomTo,
    params,
    isReady,
  };
}

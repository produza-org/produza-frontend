import type {
  DashboardGrain,
  DashboardPeriodPreset,
  DashboardSummaryParams,
} from '@/features/dashboard/types/dashboard';

function toIsoDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function startOfUtcDay(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}

export function resolveDashboardPeriod(
  preset: DashboardPeriodPreset,
  customFrom?: string,
  customTo?: string
): DashboardSummaryParams {
  const today = startOfUtcDay(new Date());

  if (preset === 'custom' && customFrom && customTo) {
    const spanMs =
      startOfUtcDay(new Date(`${customTo}T00:00:00Z`)).getTime() -
      startOfUtcDay(new Date(`${customFrom}T00:00:00Z`)).getTime();
    const spanDays = Math.max(0, Math.round(spanMs / 86_400_000));
    let grain: DashboardGrain = 'day';
    if (spanDays > 90) {
      grain = 'month';
    } else if (spanDays > 31) {
      grain = 'week';
    }
    return { from: customFrom, to: customTo, grain };
  }

  if (preset === 'week') {
    const from = new Date(today);
    from.setUTCDate(from.getUTCDate() - 7 * 11);
    return { from: toIsoDate(from), to: toIsoDate(today), grain: 'week' };
  }

  if (preset === 'month') {
    const from = new Date(today);
    from.setUTCMonth(from.getUTCMonth() - 11);
    from.setUTCDate(1);
    return { from: toIsoDate(from), to: toIsoDate(today), grain: 'month' };
  }

  const from = new Date(today);
  from.setUTCDate(from.getUTCDate() - 13);
  return { from: toIsoDate(from), to: toIsoDate(today), grain: 'day' };
}

export function formatBucketLabel(
  bucket: string,
  grain: DashboardGrain,
  locale: string
): string {
  const monthOnly = /^\d{4}-\d{2}$/.test(bucket);
  const date = monthOnly
    ? new Date(`${bucket}-01T00:00:00Z`)
    : /^\d{4}-\d{2}-\d{2}/.test(bucket)
      ? new Date(`${bucket.slice(0, 10)}T00:00:00Z`)
      : new Date(bucket);

  if (Number.isNaN(date.getTime())) {
    return bucket;
  }

  if (grain === 'month' || monthOnly) {
    return new Intl.DateTimeFormat(locale, {
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(date);
  }

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    timeZone: 'UTC',
  }).format(date);
}

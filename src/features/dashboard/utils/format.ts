export function formatDashboardNumber(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDashboardPercent(
  ratio: number | null,
  locale: string
): string {
  if (ratio === null || Number.isNaN(ratio)) {
    return '—';
  }

  return new Intl.NumberFormat(locale, {
    style: 'percent',
    maximumFractionDigits: 1,
  }).format(ratio);
}

export function formatDashboardCurrency(
  value: number,
  locale: string
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2,
  }).format(value);
}

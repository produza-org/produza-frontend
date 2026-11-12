import type { ProductionOrder } from '@/features/production-orders/types/production-order';

export function filterProductionOrders(
  items: ProductionOrder[],
  numberFilter: string
): ProductionOrder[] {
  const number = numberFilter.trim().toLowerCase();

  return items.filter(
    (item) =>
      number.length === 0 ||
      item.number.toLowerCase().includes(number) ||
      item.product.name.toLowerCase().includes(number)
  );
}

export function getPageNumbers(
  current: number,
  totalPages: number
): (number | 'ellipsis')[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, totalPages, current, current - 1, current + 1]);
  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);

  const result: (number | 'ellipsis')[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push('ellipsis');
    }
    result.push(sorted[i]);
  }

  return result;
}

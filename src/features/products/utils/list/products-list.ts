import type { Product } from '@/features/products/types/product';

export function filterProducts(items: Product[], nameFilter: string): Product[] {
  const name = nameFilter.trim().toLowerCase();

  return items.filter(
    (item) => name.length === 0 || item.name.toLowerCase().includes(name)
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
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);

  const result: (number | 'ellipsis')[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push('ellipsis');
    }
    result.push(sorted[i]);
  }

  return result;
}

import type { RawMaterial } from '@/features/raw-materials/types/raw-material';

export function filterRawMaterials(
  items: RawMaterial[],
  nameFilter: string,
  codeFilter: string
): RawMaterial[] {
  const name = nameFilter.trim().toLowerCase();
  const code = codeFilter.trim().toLowerCase();

  return items.filter(
    (item) =>
      (name.length === 0 || item.name.toLowerCase().includes(name)) &&
      (code.length === 0 || item.code.toLowerCase().includes(code))
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

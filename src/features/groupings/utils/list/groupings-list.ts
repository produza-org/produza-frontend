import type { RawMaterialGroup } from '@/features/groupings/types/grouping';

export function filterGroupings(
  items: RawMaterialGroup[],
  nameFilter: string,
  codeFilter: string,
  rawMaterialIdsFilter: string[]
): RawMaterialGroup[] {
  const name = nameFilter.trim().toLowerCase();
  const code = codeFilter.trim().toLowerCase();
  const rawMaterialIds = new Set(
    rawMaterialIdsFilter.map((id) => id.trim()).filter((id) => id.length > 0)
  );

  return items.filter((item) => {
    if (name.length > 0 && !item.name.toLowerCase().includes(name)) {
      return false;
    }
    if (code.length > 0 && !item.code.toLowerCase().includes(code)) {
      return false;
    }
    if (rawMaterialIds.size === 0) {
      return true;
    }

    return (item.lines ?? []).some((line) =>
      rawMaterialIds.has(line.rawMaterialId)
    );
  });
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
    .filter((page) => page >= 1 && page <= totalPages)
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

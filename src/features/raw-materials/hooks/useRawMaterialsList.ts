import { useMemo } from 'react';
import { RAW_MATERIALS_PAGE_SIZE } from '@/features/raw-materials/constants';
import { useRawMaterialsContext } from '@/features/raw-materials/context/RawMaterialsContext';
import { filterRawMaterials } from '@/features/raw-materials/utils/raw-materials-list';

export function useRawMaterialsList() {
  const { items, nameFilter, codeFilter, page, setPage } = useRawMaterialsContext();

  const filteredItems = useMemo(
    () => filterRawMaterials(items, nameFilter, codeFilter),
    [items, nameFilter, codeFilter]
  );

  const totalFiltered = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / RAW_MATERIALS_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const rows = useMemo(() => {
    const start = (safePage - 1) * RAW_MATERIALS_PAGE_SIZE;
    return filteredItems.slice(start, start + RAW_MATERIALS_PAGE_SIZE);
  }, [filteredItems, safePage]);

  return {
    rows,
    page: safePage,
    pageSize: RAW_MATERIALS_PAGE_SIZE,
    totalFiltered,
    totalPages,
    setPage,
    canPrev: safePage > 1,
    canNext: safePage < totalPages,
  };
}

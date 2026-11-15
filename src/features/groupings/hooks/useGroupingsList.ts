import { useMemo } from 'react';
import { GROUPINGS_PAGE_SIZE } from '@/features/groupings/constants';
import { useGroupingsContext } from '@/features/groupings/context/GroupingsContext';
import { filterGroupings } from '@/features/groupings/utils/list/groupings-list';

export function useGroupingsList() {
  const {
    items,
    nameFilter,
    codeFilter,
    rawMaterialIdsFilter,
    page,
    setPage,
  } = useGroupingsContext();

  const filteredItems = useMemo(
    () =>
      filterGroupings(
        items.filter((item) => item.status === 'active'),
        nameFilter,
        codeFilter,
        rawMaterialIdsFilter
      ),
    [codeFilter, items, nameFilter, rawMaterialIdsFilter]
  );

  const totalFiltered = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / GROUPINGS_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const rows = useMemo(() => {
    const start = (safePage - 1) * GROUPINGS_PAGE_SIZE;
    return filteredItems.slice(start, start + GROUPINGS_PAGE_SIZE);
  }, [filteredItems, safePage]);

  return {
    rows,
    page: safePage,
    pageSize: GROUPINGS_PAGE_SIZE,
    totalFiltered,
    totalPages,
    setPage,
    canPrev: safePage > 1,
    canNext: safePage < totalPages,
  };
}

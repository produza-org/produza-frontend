import { useMemo } from 'react';
import { PRODUCTION_ORDERS_PAGE_SIZE } from '@/features/production-orders/constants';
import { useProductionOrdersContext } from '@/features/production-orders/context/ProductionOrdersContext';
import { filterProductionOrders } from '@/features/production-orders/utils/list/production-orders-list';

export function useProductionOrdersList() {
  const { items, numberFilter, page, setPage } = useProductionOrdersContext();

  const filteredItems = useMemo(
    () => filterProductionOrders(items, numberFilter),
    [items, numberFilter]
  );

  const totalFiltered = filteredItems.length;
  const totalPages = Math.max(
    1,
    Math.ceil(totalFiltered / PRODUCTION_ORDERS_PAGE_SIZE)
  );
  const safePage = Math.min(page, totalPages);

  const rows = useMemo(() => {
    const start = (safePage - 1) * PRODUCTION_ORDERS_PAGE_SIZE;
    return filteredItems.slice(start, start + PRODUCTION_ORDERS_PAGE_SIZE);
  }, [filteredItems, safePage]);

  return {
    rows,
    page: safePage,
    pageSize: PRODUCTION_ORDERS_PAGE_SIZE,
    totalFiltered,
    totalPages,
    setPage,
    canPrev: safePage > 1,
    canNext: safePage < totalPages,
  };
}

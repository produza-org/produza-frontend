import { useMemo } from 'react';
import { PRODUCTS_PAGE_SIZE } from '@/features/products/constants';
import { useProductsContext } from '@/features/products/context/ProductsContext';
import { filterProducts } from '@/features/products/utils/list/products-list';

export function useProductsList() {
  const { items, nameFilter, page, setPage } = useProductsContext();

  const filteredItems = useMemo(
    () => filterProducts(items, nameFilter),
    [items, nameFilter]
  );

  const totalFiltered = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / PRODUCTS_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const rows = useMemo(() => {
    const start = (safePage - 1) * PRODUCTS_PAGE_SIZE;
    return filteredItems.slice(start, start + PRODUCTS_PAGE_SIZE);
  }, [filteredItems, safePage]);

  return {
    rows,
    page: safePage,
    pageSize: PRODUCTS_PAGE_SIZE,
    totalFiltered,
    totalPages,
    setPage,
    canPrev: safePage > 1,
    canNext: safePage < totalPages,
  };
}

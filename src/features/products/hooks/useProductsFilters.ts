import { useCallback, useState } from 'react';
import { useProductsContext } from '@/features/products/context/ProductsContext';

export type ProductsFiltersState = {
  nameFilter: string;
  setNameFilter: (value: string) => void;
};

export function useProductsFiltersState(
  onFilterChange?: () => void
): ProductsFiltersState {
  const [nameFilter, setNameFilterState] = useState('');

  const setNameFilter = useCallback(
    (value: string) => {
      setNameFilterState(value);
      onFilterChange?.();
    },
    [onFilterChange]
  );

  return { nameFilter, setNameFilter };
}

export function useProductsFilters(): ProductsFiltersState {
  const { nameFilter, setNameFilter } = useProductsContext();

  return { nameFilter, setNameFilter };
}

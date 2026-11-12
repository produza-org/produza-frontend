import { useCallback, useState } from 'react';
import { useProductionOrdersContext } from '@/features/production-orders/context/ProductionOrdersContext';

export type ProductionOrdersFiltersState = {
  numberFilter: string;
  setNumberFilter: (value: string) => void;
};

export function useProductionOrdersFiltersState(
  onFilterChange?: () => void
): ProductionOrdersFiltersState {
  const [numberFilter, setNumberFilterState] = useState('');

  const setNumberFilter = useCallback(
    (value: string) => {
      setNumberFilterState(value);
      onFilterChange?.();
    },
    [onFilterChange]
  );

  return { numberFilter, setNumberFilter };
}

export function useProductionOrdersFilters(): ProductionOrdersFiltersState {
  const { numberFilter, setNumberFilter } = useProductionOrdersContext();

  return { numberFilter, setNumberFilter };
}

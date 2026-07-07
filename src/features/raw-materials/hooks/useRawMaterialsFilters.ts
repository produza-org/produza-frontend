import { useCallback, useState } from 'react';
import { useRawMaterialsContext } from '@/features/raw-materials/context/RawMaterialsContext';

export type RawMaterialsFiltersState = {
  nameFilter: string;
  codeFilter: string;
  setNameFilter: (value: string) => void;
  setCodeFilter: (value: string) => void;
};

export function useRawMaterialsFiltersState(
  onFilterChange?: () => void
): RawMaterialsFiltersState {
  const [nameFilter, setNameFilterState] = useState('');
  const [codeFilter, setCodeFilterState] = useState('');

  const setNameFilter = useCallback(
    (value: string) => {
      setNameFilterState(value);
      onFilterChange?.();
    },
    [onFilterChange]
  );

  const setCodeFilter = useCallback(
    (value: string) => {
      setCodeFilterState(value);
      onFilterChange?.();
    },
    [onFilterChange]
  );

  return { nameFilter, codeFilter, setNameFilter, setCodeFilter };
}

export function useRawMaterialsFilters(): RawMaterialsFiltersState {
  const { nameFilter, codeFilter, setNameFilter, setCodeFilter } = useRawMaterialsContext();

  return { nameFilter, codeFilter, setNameFilter, setCodeFilter };
}

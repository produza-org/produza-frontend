import { useCallback, useState } from 'react';
import { useGroupingsContext } from '@/features/groupings/context/GroupingsContext';

export type GroupingsFiltersState = {
  nameFilter: string;
  codeFilter: string;
  rawMaterialFilter: string;
  setNameFilter: (value: string) => void;
  setCodeFilter: (value: string) => void;
  setRawMaterialFilter: (value: string) => void;
};

export function useGroupingsFiltersState(
  onFilterChange?: () => void
): GroupingsFiltersState {
  const [nameFilter, setNameFilterState] = useState('');
  const [codeFilter, setCodeFilterState] = useState('');
  const [rawMaterialFilter, setRawMaterialFilterState] = useState('');

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

  const setRawMaterialFilter = useCallback(
    (value: string) => {
      setRawMaterialFilterState(value);
      onFilterChange?.();
    },
    [onFilterChange]
  );

  return {
    nameFilter,
    codeFilter,
    rawMaterialFilter,
    setNameFilter,
    setCodeFilter,
    setRawMaterialFilter,
  };
}

export function useGroupingsFilters(): GroupingsFiltersState {
  const {
    nameFilter,
    codeFilter,
    rawMaterialFilter,
    setNameFilter,
    setCodeFilter,
    setRawMaterialFilter,
  } = useGroupingsContext();

  return {
    nameFilter,
    codeFilter,
    rawMaterialFilter,
    setNameFilter,
    setCodeFilter,
    setRawMaterialFilter,
  };
}

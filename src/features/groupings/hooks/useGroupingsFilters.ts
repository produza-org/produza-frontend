import { useCallback, useState } from 'react';
import { useGroupingsContext } from '@/features/groupings/context/GroupingsContext';

export type GroupingsAppliedFilters = {
  name: string;
  code: string;
  rawMaterialIds: string[];
};

export const EMPTY_GROUPINGS_FILTERS: GroupingsAppliedFilters = {
  name: '',
  code: '',
  rawMaterialIds: [],
};

export type GroupingsFiltersState = {
  nameFilter: string;
  codeFilter: string;
  rawMaterialIdsFilter: string[];
  applyFilters: (filters: GroupingsAppliedFilters) => void;
};

export function useGroupingsFiltersState(
  onFilterChange?: () => void
): GroupingsFiltersState {
  const [nameFilter, setNameFilter] = useState('');
  const [codeFilter, setCodeFilter] = useState('');
  const [rawMaterialIdsFilter, setRawMaterialIdsFilter] = useState<string[]>(
    []
  );

  const applyFilters = useCallback(
    (filters: GroupingsAppliedFilters) => {
      setNameFilter(filters.name);
      setCodeFilter(filters.code);
      setRawMaterialIdsFilter(filters.rawMaterialIds);
      onFilterChange?.();
    },
    [onFilterChange]
  );

  return {
    nameFilter,
    codeFilter,
    rawMaterialIdsFilter,
    applyFilters,
  };
}

export function useGroupingsFilters(): GroupingsFiltersState {
  const {
    nameFilter,
    codeFilter,
    rawMaterialIdsFilter,
    applyFilters,
  } = useGroupingsContext();

  return {
    nameFilter,
    codeFilter,
    rawMaterialIdsFilter,
    applyFilters,
  };
}

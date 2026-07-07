import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { loadPersistedData, savePersistedData, rawMaterialsSeed } from '@/core/mocks';
import { RAW_MATERIALS_STORAGE_KEY } from '@/features/raw-materials/constants';
import {
  useRawMaterialsFiltersState,
  type RawMaterialsFiltersState,
} from '@/features/raw-materials/hooks/useRawMaterialsFilters';
import type { RawMaterial } from '@/features/raw-materials/types/raw-material';

type RawMaterialsContextValue = RawMaterialsFiltersState & {
  items: RawMaterial[];
  setItems: React.Dispatch<React.SetStateAction<RawMaterial[]>>;
  page: number;
  setPage: (page: number) => void;
};

const RawMaterialsContext = createContext<RawMaterialsContextValue | null>(null);

function getInitialItems(): RawMaterial[] {
  return loadPersistedData(RAW_MATERIALS_STORAGE_KEY, rawMaterialsSeed as RawMaterial[]);
}

export function RawMaterialsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<RawMaterial[]>(getInitialItems);
  const [page, setPage] = useState(1);
  const resetPage = useCallback(() => setPage(1), []);
  const { nameFilter, codeFilter, setNameFilter, setCodeFilter } =
    useRawMaterialsFiltersState(resetPage);

  useEffect(() => {
    savePersistedData(RAW_MATERIALS_STORAGE_KEY, items);
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      setItems,
      nameFilter,
      codeFilter,
      setNameFilter,
      setCodeFilter,
      page,
      setPage,
    }),
    [items, nameFilter, codeFilter, setNameFilter, setCodeFilter, page]
  );

  return (
    <RawMaterialsContext.Provider value={value}>{children}</RawMaterialsContext.Provider>
  );
}

export function useRawMaterialsContext(): RawMaterialsContextValue {
  const ctx = useContext(RawMaterialsContext);
  if (!ctx) {
    throw new Error('useRawMaterialsContext must be used within RawMaterialsProvider');
  }
  return ctx;
}

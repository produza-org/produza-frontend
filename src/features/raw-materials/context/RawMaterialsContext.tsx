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
  createRawMaterial: (input: {
    name: string;
    code: string;
    unit: string;
    unitCost: number;
    stockQuantity: number;
  }) => void;
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

  const createRawMaterial = useCallback(
    (input: {
      name: string;
      code: string;
      unit: string;
      unitCost: number;
      stockQuantity: number;
    }) => {
      const totalCost = input.stockQuantity * input.unitCost;
      const newItem: RawMaterial = {
        id: `rm-${Date.now()}`,
        code: input.code,
        name: input.name.toUpperCase(),
        stockQuantity: input.stockQuantity,
        unit: input.unit,
        unitCost: input.unitCost,
        totalCost,
      };
      setItems((prev) => [newItem, ...prev]);
      setPage(1);
    },
    []
  );

  const value = useMemo(
    () => ({
      items,
      setItems,
      createRawMaterial,
      nameFilter,
      codeFilter,
      setNameFilter,
      setCodeFilter,
      page,
      setPage,
    }),
    [items, createRawMaterial, nameFilter, codeFilter, setNameFilter, setCodeFilter, page]
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

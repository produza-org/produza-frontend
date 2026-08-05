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
import {
  RAW_MATERIALS_CRITICAL_STOCK_THRESHOLD,
  RAW_MATERIALS_STORAGE_KEY,
} from '@/features/raw-materials/constants';
import {
  useRawMaterialsFiltersState,
  type RawMaterialsFiltersState,
} from '@/features/raw-materials/hooks/useRawMaterialsFilters';
import type { RawMaterial, RawMaterialStatus } from '@/features/raw-materials/types/raw-material';

type RawMaterialInput = {
  name: string;
  code: string;
  unit: string;
  unitCost: number;
  stockQuantity: number;
  minStock: number;
};

type RawMaterialsContextValue = RawMaterialsFiltersState & {
  items: RawMaterial[];
  setItems: React.Dispatch<React.SetStateAction<RawMaterial[]>>;
  createRawMaterial: (input: RawMaterialInput) => void;
  updateRawMaterial: (id: string, input: RawMaterialInput) => void;
  deleteRawMaterial: (id: string) => void;
  toggleRawMaterialStatus: (id: string) => void;
  page: number;
  setPage: (page: number) => void;
};

const RawMaterialsContext = createContext<RawMaterialsContextValue | null>(null);

function isRawMaterialStatus(value: unknown): value is RawMaterialStatus {
  return value === 'active' || value === 'inactive';
}

function normalizeRawMaterial(item: RawMaterial): RawMaterial {
  return {
    ...item,
    status: isRawMaterialStatus(item.status) ? item.status : 'active',
    minStock:
      typeof item.minStock === 'number' && Number.isFinite(item.minStock)
        ? item.minStock
        : RAW_MATERIALS_CRITICAL_STOCK_THRESHOLD,
  };
}

function getInitialItems(): RawMaterial[] {
  const loaded = loadPersistedData(RAW_MATERIALS_STORAGE_KEY, rawMaterialsSeed as RawMaterial[]);
  return loaded.map(normalizeRawMaterial);
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

  const createRawMaterial = useCallback((input: RawMaterialInput) => {
    const totalCost = input.stockQuantity * input.unitCost;
    const newItem: RawMaterial = {
      id: `rm-${Date.now()}`,
      code: input.code,
      name: input.name.toUpperCase(),
      status: 'active',
      stockQuantity: input.stockQuantity,
      minStock: input.minStock,
      unit: input.unit,
      unitCost: input.unitCost,
      totalCost,
    };
    setItems((prev) => [newItem, ...prev]);
    setPage(1);
  }, []);

  const updateRawMaterial = useCallback((id: string, input: RawMaterialInput) => {
    const totalCost = input.stockQuantity * input.unitCost;
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              code: input.code,
              name: input.name.toUpperCase(),
              stockQuantity: input.stockQuantity,
              minStock: input.minStock,
              unit: input.unit,
              unitCost: input.unitCost,
              totalCost,
            }
          : item
      )
    );
  }, []);

  const deleteRawMaterial = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toggleRawMaterialStatus = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === 'active' ? 'inactive' : 'active',
            }
          : item
      )
    );
  }, []);

  const value = useMemo(
    () => ({
      items,
      setItems,
      createRawMaterial,
      updateRawMaterial,
      deleteRawMaterial,
      toggleRawMaterialStatus,
      nameFilter,
      codeFilter,
      setNameFilter,
      setCodeFilter,
      page,
      setPage,
    }),
    [
      items,
      createRawMaterial,
      updateRawMaterial,
      deleteRawMaterial,
      toggleRawMaterialStatus,
      nameFilter,
      codeFilter,
      setNameFilter,
      setCodeFilter,
      page,
    ]
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

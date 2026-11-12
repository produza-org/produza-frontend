import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { ApiError } from '@/core/api';
import {
  createRawMaterialRequest,
  deleteRawMaterialRequest,
  listAllRawMaterials,
  updateRawMaterialRequest,
} from '@/features/raw-materials/api';
import {
  useRawMaterialsFiltersState,
  type RawMaterialsFiltersState,
} from '@/features/raw-materials/hooks/useRawMaterialsFilters';
import type {
  RawMaterial,
  RawMaterialCreateInput,
  RawMaterialStatus,
} from '@/features/raw-materials/types/raw-material';

type RawMaterialsContextValue = RawMaterialsFiltersState & {
  items: RawMaterial[];
  isLoading: boolean;
  errorMessage: string | null;
  refresh: () => Promise<void>;
  createRawMaterial: (input: RawMaterialCreateInput) => Promise<void>;
  updateRawMaterial: (id: string, input: RawMaterialCreateInput) => Promise<void>;
  deleteRawMaterial: (id: string) => Promise<void>;
  toggleRawMaterialStatus: (id: string) => Promise<void>;
  page: number;
  setPage: (page: number) => void;
};

const RawMaterialsContext = createContext<RawMaterialsContextValue | null>(null);

function toErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  return 'UNEXPECTED';
}

function upsertItem(items: RawMaterial[], next: RawMaterial): RawMaterial[] {
  const index = items.findIndex((item) => item.id === next.id);
  if (index === -1) {
    return [next, ...items];
  }
  return items.map((item, itemIndex) => (itemIndex === index ? next : item));
}

export function RawMaterialsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<RawMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const resetPage = useCallback(() => setPage(1), []);
  const { nameFilter, codeFilter, setNameFilter, setCodeFilter } =
    useRawMaterialsFiltersState(resetPage);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await listAllRawMaterials();
      setItems(data);
    } catch (error) {
      setErrorMessage(toErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const createRawMaterial = useCallback(async (input: RawMaterialCreateInput) => {
    const created = await createRawMaterialRequest(input);
    setItems((prev) => [created, ...prev]);
    setPage(1);
  }, []);

  const updateRawMaterial = useCallback(
    async (id: string, input: RawMaterialCreateInput) => {
      const updated = await updateRawMaterialRequest(id, input);
      setItems((prev) => upsertItem(prev, updated));
    },
    []
  );

  const deleteRawMaterial = useCallback(async (id: string) => {
    const deleted = await deleteRawMaterialRequest(id);
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) {
          return item;
        }
        if (deleted) {
          return deleted;
        }
        return { ...item, status: 'inactive' satisfies RawMaterialStatus };
      })
    );
  }, []);

  const toggleRawMaterialStatus = useCallback(async (id: string) => {
    let currentStatus: RawMaterialStatus | undefined;
    setItems((prev) => {
      currentStatus = prev.find((item) => item.id === id)?.status;
      return prev;
    });
    if (!currentStatus) {
      return;
    }
    const nextStatus: RawMaterialStatus =
      currentStatus === 'active' ? 'inactive' : 'active';
    const updated = await updateRawMaterialRequest(id, { status: nextStatus });
    setItems((prev) => upsertItem(prev, updated));
  }, []);

  const value = useMemo(
    () => ({
      items,
      isLoading,
      errorMessage,
      refresh,
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
      isLoading,
      errorMessage,
      refresh,
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

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
  createRawMaterialGroupRequest,
  deleteRawMaterialGroupRequest,
  listAllRawMaterialGroups,
  updateRawMaterialGroupRequest,
} from '@/features/groupings/api';
import {
  EMPTY_GROUPINGS_FILTERS,
  useGroupingsFiltersState,
  type GroupingsAppliedFilters,
  type GroupingsFiltersState,
} from '@/features/groupings/hooks/useGroupingsFilters';
import type {
  RawMaterialGroup,
  RawMaterialGroupCreateInput,
  RawMaterialGroupStatus,
  RawMaterialGroupUpdateInput,
} from '@/features/groupings/types/grouping';

type GroupingsContextValue = GroupingsFiltersState & {
  items: RawMaterialGroup[];
  isLoading: boolean;
  errorMessage: string | null;
  refresh: () => Promise<void>;
  createGrouping: (input: RawMaterialGroupCreateInput) => Promise<RawMaterialGroup>;
  updateGrouping: (
    id: string,
    input: RawMaterialGroupUpdateInput
  ) => Promise<RawMaterialGroup>;
  deleteGrouping: (id: string) => Promise<void>;
  page: number;
  setPage: (page: number) => void;
};

const GroupingsContext = createContext<GroupingsContextValue | null>(null);

function toErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  return 'UNEXPECTED';
}

function upsertItem(
  items: RawMaterialGroup[],
  next: RawMaterialGroup
): RawMaterialGroup[] {
  const index = items.findIndex((item) => item.id === next.id);
  if (index === -1) {
    return [next, ...items];
  }
  return items.map((item, itemIndex) => (itemIndex === index ? next : item));
}

export function GroupingsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<RawMaterialGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [fetchFilters, setFetchFilters] = useState<GroupingsAppliedFilters>(
    EMPTY_GROUPINGS_FILTERS
  );
  const resetPage = useCallback(() => setPage(1), []);
  const {
    nameFilter,
    codeFilter,
    rawMaterialIdsFilter,
    applyFilters: setAppliedFilters,
  } = useGroupingsFiltersState(resetPage);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await listAllRawMaterialGroups(100, {
        name: fetchFilters.name,
        code: fetchFilters.code,
        rawMaterialIds: fetchFilters.rawMaterialIds,
      });
      setItems(data);
    } catch (error) {
      setErrorMessage(toErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [fetchFilters]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const applyFilters = useCallback(
    (filters: GroupingsAppliedFilters) => {
      setAppliedFilters(filters);
      setFetchFilters(filters);
    },
    [setAppliedFilters]
  );

  const createGrouping = useCallback(
    async (input: RawMaterialGroupCreateInput) => {
      const created = await createRawMaterialGroupRequest(input);
      setItems((prev) => [created, ...prev]);
      setPage(1);
      return created;
    },
    []
  );

  const updateGrouping = useCallback(
    async (id: string, input: RawMaterialGroupUpdateInput) => {
      const updated = await updateRawMaterialGroupRequest(id, input);
      setItems((prev) => upsertItem(prev, updated));
      return updated;
    },
    []
  );

  const deleteGrouping = useCallback(async (id: string) => {
    const deleted = await deleteRawMaterialGroupRequest(id);
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) {
          return item;
        }
        if (deleted) {
          return deleted;
        }
        return { ...item, status: 'inactive' satisfies RawMaterialGroupStatus };
      })
    );
  }, []);

  const value = useMemo(
    () => ({
      items,
      isLoading,
      errorMessage,
      refresh,
      createGrouping,
      updateGrouping,
      deleteGrouping,
      nameFilter,
      codeFilter,
      rawMaterialIdsFilter,
      applyFilters,
      page,
      setPage,
    }),
    [
      items,
      isLoading,
      errorMessage,
      refresh,
      createGrouping,
      updateGrouping,
      deleteGrouping,
      nameFilter,
      codeFilter,
      rawMaterialIdsFilter,
      applyFilters,
      page,
    ]
  );

  return (
    <GroupingsContext.Provider value={value}>{children}</GroupingsContext.Provider>
  );
}

export function useGroupingsContext(): GroupingsContextValue {
  const ctx = useContext(GroupingsContext);
  if (!ctx) {
    throw new Error('useGroupingsContext must be used within GroupingsProvider');
  }
  return ctx;
}

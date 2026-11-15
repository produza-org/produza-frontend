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
  createProductionOrderRequest,
  deleteProductionOrderRequest,
  listAllProductionOrders,
  recalculateProductionOrderFromRecipe,
  updateProductionOrderRequest,
  updateProductionOrderSteps,
} from '@/features/production-orders/api';
import {
  useProductionOrdersFiltersState,
  type ProductionOrdersFiltersState,
} from '@/features/production-orders/hooks/useProductionOrdersFilters';
import type {
  ProductionOrder,
  ProductionOrderCreateInput,
  ProductionOrderUpdateInput,
  ProductionStep,
  ProductionStepsUpdateInput,
} from '@/features/production-orders/types/production-order';

type ProductionOrdersContextValue = ProductionOrdersFiltersState & {
  items: ProductionOrder[];
  isLoading: boolean;
  errorMessage: string | null;
  refresh: () => Promise<void>;
  createProductionOrder: (
    input: ProductionOrderCreateInput
  ) => Promise<ProductionOrder>;
  updateProductionOrder: (
    id: string,
    input: ProductionOrderUpdateInput
  ) => Promise<ProductionOrder>;
  deleteProductionOrder: (id: string) => Promise<void>;
  updateProductionOrderSteps: (
    id: string,
    input: ProductionStepsUpdateInput
  ) => Promise<ProductionStep[]>;
  recalculateFromRecipe: (id: string) => Promise<ProductionOrder>;
  upsertLocalOrder: (order: ProductionOrder) => void;
  page: number;
  setPage: (page: number) => void;
};

const ProductionOrdersContext =
  createContext<ProductionOrdersContextValue | null>(null);

function toErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  return 'UNEXPECTED';
}

function upsertItem(
  items: ProductionOrder[],
  next: ProductionOrder
): ProductionOrder[] {
  const index = items.findIndex((item) => item.id === next.id);
  if (index === -1) {
    return [next, ...items];
  }
  return items.map((item, itemIndex) => (itemIndex === index ? next : item));
}

export function ProductionOrdersProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ProductionOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const resetPage = useCallback(() => setPage(1), []);
  const { numberFilter, setNumberFilter } =
    useProductionOrdersFiltersState(resetPage);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await listAllProductionOrders();
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

  const upsertLocalOrder = useCallback((order: ProductionOrder) => {
    setItems((prev) => upsertItem(prev, order));
  }, []);

  const createProductionOrder = useCallback(
    async (input: ProductionOrderCreateInput) => {
      const created = await createProductionOrderRequest(input);
      setItems((prev) => [created, ...prev]);
      setPage(1);
      return created;
    },
    []
  );

  const updateProductionOrder = useCallback(
    async (id: string, input: ProductionOrderUpdateInput) => {
      const updated = await updateProductionOrderRequest(id, input);
      setItems((prev) => upsertItem(prev, updated));
      return updated;
    },
    []
  );

  const deleteProductionOrder = useCallback(async (id: string) => {
    await deleteProductionOrderRequest(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const recalculateFromRecipe = useCallback(async (id: string) => {
    const updated = await recalculateProductionOrderFromRecipe(id);
    setItems((prev) => upsertItem(prev, updated));
    return updated;
  }, []);

  const updateOrderSteps = useCallback(
    async (id: string, input: ProductionStepsUpdateInput) => {
      const steps = await updateProductionOrderSteps(id, input);
      const plannedMinutesTotal = steps.reduce(
        (sum, step) => sum + step.plannedMinutes,
        0
      );
      setItems((prev) => {
        const current = prev.find((item) => item.id === id);
        if (!current) {
          return prev;
        }
        return upsertItem(prev, {
          ...current,
          steps,
          plannedMinutesTotal,
        });
      });
      return steps;
    },
    []
  );

  const value = useMemo(
    () => ({
      items,
      isLoading,
      errorMessage,
      refresh,
      createProductionOrder,
      updateProductionOrder,
      deleteProductionOrder,
      updateProductionOrderSteps: updateOrderSteps,
      recalculateFromRecipe,
      upsertLocalOrder,
      numberFilter,
      setNumberFilter,
      page,
      setPage,
    }),
    [
      items,
      isLoading,
      errorMessage,
      refresh,
      createProductionOrder,
      updateProductionOrder,
      deleteProductionOrder,
      updateOrderSteps,
      recalculateFromRecipe,
      upsertLocalOrder,
      numberFilter,
      setNumberFilter,
      page,
    ]
  );

  return (
    <ProductionOrdersContext.Provider value={value}>
      {children}
    </ProductionOrdersContext.Provider>
  );
}

export function useProductionOrdersContext(): ProductionOrdersContextValue {
  const ctx = useContext(ProductionOrdersContext);
  if (!ctx) {
    throw new Error(
      'useProductionOrdersContext must be used within ProductionOrdersProvider'
    );
  }
  return ctx;
}

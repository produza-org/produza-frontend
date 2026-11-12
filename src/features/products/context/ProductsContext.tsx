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
  createProductRequest,
  deleteProductRequest,
  listAllProducts,
  updateProductRequest,
} from '@/features/products/api';
import {
  useProductsFiltersState,
  type ProductsFiltersState,
} from '@/features/products/hooks/useProductsFilters';
import type {
  Product,
  ProductCreateInput,
  ProductStatus,
} from '@/features/products/types/product';

type ProductsContextValue = ProductsFiltersState & {
  items: Product[];
  isLoading: boolean;
  errorMessage: string | null;
  refresh: () => Promise<void>;
  createProduct: (input: ProductCreateInput) => Promise<void>;
  updateProduct: (id: string, input: ProductCreateInput) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleProductStatus: (id: string) => Promise<void>;
  page: number;
  setPage: (page: number) => void;
};

const ProductsContext = createContext<ProductsContextValue | null>(null);

function toErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  return 'UNEXPECTED';
}

function upsertItem(items: Product[], next: Product): Product[] {
  const index = items.findIndex((item) => item.id === next.id);
  if (index === -1) {
    return [next, ...items];
  }
  return items.map((item, itemIndex) => (itemIndex === index ? next : item));
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const resetPage = useCallback(() => setPage(1), []);
  const { nameFilter, setNameFilter } = useProductsFiltersState(resetPage);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await listAllProducts();
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

  const createProduct = useCallback(async (input: ProductCreateInput) => {
    const created = await createProductRequest(input);
    setItems((prev) => [created, ...prev]);
    setPage(1);
  }, []);

  const updateProduct = useCallback(
    async (id: string, input: ProductCreateInput) => {
      const updated = await updateProductRequest(id, input);
      setItems((prev) => upsertItem(prev, updated));
    },
    []
  );

  const deleteProduct = useCallback(async (id: string) => {
    const deleted = await deleteProductRequest(id);
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) {
          return item;
        }
        if (deleted) {
          return deleted;
        }
        return { ...item, status: 'inactive' satisfies ProductStatus };
      })
    );
  }, []);

  const toggleProductStatus = useCallback(async (id: string) => {
    let currentStatus: ProductStatus | undefined;
    setItems((prev) => {
      currentStatus = prev.find((item) => item.id === id)?.status;
      return prev;
    });
    if (!currentStatus) {
      return;
    }
    const nextStatus: ProductStatus =
      currentStatus === 'active' ? 'inactive' : 'active';
    const updated = await updateProductRequest(id, { status: nextStatus });
    setItems((prev) => upsertItem(prev, updated));
  }, []);

  const value = useMemo(
    () => ({
      items,
      isLoading,
      errorMessage,
      refresh,
      createProduct,
      updateProduct,
      deleteProduct,
      toggleProductStatus,
      nameFilter,
      setNameFilter,
      page,
      setPage,
    }),
    [
      items,
      isLoading,
      errorMessage,
      refresh,
      createProduct,
      updateProduct,
      deleteProduct,
      toggleProductStatus,
      nameFilter,
      setNameFilter,
      page,
    ]
  );

  return (
    <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
  );
}

export function useProductsContext(): ProductsContextValue {
  const ctx = useContext(ProductsContext);
  if (!ctx) {
    throw new Error('useProductsContext must be used within ProductsProvider');
  }
  return ctx;
}

import { apiClient } from '@/core/api';
import type { PaginatedResponse } from '@/core/types';
import type { Product } from '@/features/products/types/product';

export type ListProductsParams = {
  page?: number;
  limit?: number;
};

export function listProducts(
  params: ListProductsParams = {}
): Promise<PaginatedResponse<Product>> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 100;
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  return apiClient<PaginatedResponse<Product>>(`/products?${query}`);
}

export async function listAllProducts(pageSize = 100): Promise<Product[]> {
  const first = await listProducts({ page: 1, limit: pageSize });
  if (first.meta.totalPages <= 1) {
    return first.data;
  }

  const pages = await Promise.all(
    Array.from({ length: first.meta.totalPages - 1 }, (_, index) =>
      listProducts({ page: index + 2, limit: pageSize })
    )
  );

  return [first.data, ...pages.map((page) => page.data)].flat();
}

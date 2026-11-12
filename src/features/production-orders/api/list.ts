import { apiClient } from '@/core/api';
import type { PaginatedResponse } from '@/core/types';
import type { ProductionOrder } from '@/features/production-orders/types/production-order';

export type ListProductionOrdersParams = {
  page?: number;
  limit?: number;
};

export function listProductionOrders(
  params: ListProductionOrdersParams = {}
): Promise<PaginatedResponse<ProductionOrder>> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 100;
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  return apiClient<PaginatedResponse<ProductionOrder>>(
    `/production-orders?${query}`
  );
}

export async function listAllProductionOrders(
  pageSize = 100
): Promise<ProductionOrder[]> {
  const first = await listProductionOrders({ page: 1, limit: pageSize });
  if (first.meta.totalPages <= 1) {
    return first.data;
  }

  const pages = await Promise.all(
    Array.from({ length: first.meta.totalPages - 1 }, (_, index) =>
      listProductionOrders({ page: index + 2, limit: pageSize })
    )
  );

  return [first.data, ...pages.map((page) => page.data)].flat();
}

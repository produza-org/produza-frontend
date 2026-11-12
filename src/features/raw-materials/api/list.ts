import { apiClient } from '@/core/api';
import type { PaginatedResponse } from '@/core/types';
import type { RawMaterial } from '@/features/raw-materials/types/raw-material';

export type ListRawMaterialsParams = {
  page?: number;
  limit?: number;
};

export function listRawMaterials(
  params: ListRawMaterialsParams = {}
): Promise<PaginatedResponse<RawMaterial>> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 100;
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  return apiClient<PaginatedResponse<RawMaterial>>(`/raw-materials?${query}`);
}

export async function listAllRawMaterials(
  pageSize = 100
): Promise<RawMaterial[]> {
  const first = await listRawMaterials({ page: 1, limit: pageSize });
  if (first.meta.totalPages <= 1) {
    return first.data;
  }

  const pages = await Promise.all(
    Array.from({ length: first.meta.totalPages - 1 }, (_, index) =>
      listRawMaterials({ page: index + 2, limit: pageSize })
    )
  );

  return [first.data, ...pages.map((page) => page.data)].flat();
}

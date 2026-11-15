import { apiClient } from '@/core/api';
import type { PaginatedResponse } from '@/core/types';
import type { RawMaterialGroup } from '@/features/groupings/types/grouping';

export type ListRawMaterialGroupsParams = {
  page?: number;
  limit?: number;
  name?: string;
  code?: string;
  rawMaterial?: string;
};

export function listRawMaterialGroups(
  params: ListRawMaterialGroupsParams = {}
): Promise<PaginatedResponse<RawMaterialGroup>> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 100;
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const name = params.name?.trim();
  const code = params.code?.trim();
  const rawMaterial = params.rawMaterial?.trim();

  if (name) {
    query.set('name', name);
  }
  if (code) {
    query.set('code', code);
  }
  if (rawMaterial) {
    query.set('rawMaterial', rawMaterial);
  }

  return apiClient<PaginatedResponse<RawMaterialGroup>>(
    `/raw-material-groups?${query}`
  );
}

export async function listAllRawMaterialGroups(
  pageSize = 100
): Promise<RawMaterialGroup[]> {
  const first = await listRawMaterialGroups({ page: 1, limit: pageSize });
  if (first.meta.totalPages <= 1) {
    return first.data;
  }

  const pages = await Promise.all(
    Array.from({ length: first.meta.totalPages - 1 }, (_, index) =>
      listRawMaterialGroups({ page: index + 2, limit: pageSize })
    )
  );

  return [first.data, ...pages.map((page) => page.data)].flat();
}

import { apiClient } from '@/core/api';
import type { PaginatedResponse } from '@/core/types';
import type { RawMaterialGroup } from '@/features/groupings/types/grouping';

export type ListRawMaterialGroupsParams = {
  page?: number;
  limit?: number;
  name?: string;
  code?: string;
  rawMaterialIds?: string[];
};

function buildListQuery(params: ListRawMaterialGroupsParams): string {
  const page = params.page ?? 1;
  const limit = params.limit ?? 100;
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const name = params.name?.trim();
  const code = params.code?.trim();
  const rawMaterialIds = (params.rawMaterialIds ?? [])
    .map((id) => id.trim())
    .filter((id) => id.length > 0);

  if (name) {
    query.set('name', name);
  }
  if (code) {
    query.set('code', code);
  }
  for (const id of rawMaterialIds) {
    query.append('rawMaterialIds', id);
  }

  return query.toString();
}

export function listRawMaterialGroups(
  params: ListRawMaterialGroupsParams = {}
): Promise<PaginatedResponse<RawMaterialGroup>> {
  return apiClient<PaginatedResponse<RawMaterialGroup>>(
    `/raw-material-groups?${buildListQuery(params)}`
  );
}

export async function listAllRawMaterialGroups(
  pageSize = 100,
  filters: Omit<ListRawMaterialGroupsParams, 'page' | 'limit'> = {}
): Promise<RawMaterialGroup[]> {
  const first = await listRawMaterialGroups({
    page: 1,
    limit: pageSize,
    ...filters,
  });
  if (first.meta.totalPages <= 1) {
    return first.data;
  }

  const pages = await Promise.all(
    Array.from({ length: first.meta.totalPages - 1 }, (_, index) =>
      listRawMaterialGroups({
        page: index + 2,
        limit: pageSize,
        ...filters,
      })
    )
  );

  return [first.data, ...pages.map((page) => page.data)].flat();
}

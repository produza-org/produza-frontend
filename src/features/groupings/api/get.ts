import { apiClient } from '@/core/api';
import type { RawMaterialGroup } from '@/features/groupings/types/grouping';

export function getRawMaterialGroup(id: string): Promise<RawMaterialGroup> {
  return apiClient<RawMaterialGroup>(`/raw-material-groups/${id}`);
}

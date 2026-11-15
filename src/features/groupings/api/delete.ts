import { apiClient } from '@/core/api';
import type { RawMaterialGroup } from '@/features/groupings/types/grouping';

export function deleteRawMaterialGroupRequest(
  id: string
): Promise<RawMaterialGroup | undefined> {
  return apiClient<RawMaterialGroup | undefined>(`/raw-material-groups/${id}`, {
    method: 'DELETE',
  });
}

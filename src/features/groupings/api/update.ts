import { apiClient } from '@/core/api';
import type {
  RawMaterialGroup,
  RawMaterialGroupUpdateInput,
} from '@/features/groupings/types/grouping';

export function updateRawMaterialGroupRequest(
  id: string,
  input: RawMaterialGroupUpdateInput
): Promise<RawMaterialGroup> {
  return apiClient<RawMaterialGroup>(`/raw-material-groups/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

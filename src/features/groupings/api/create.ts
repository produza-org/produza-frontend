import { apiClient } from '@/core/api';
import type {
  RawMaterialGroup,
  RawMaterialGroupCreateInput,
} from '@/features/groupings/types/grouping';

export function createRawMaterialGroupRequest(
  input: RawMaterialGroupCreateInput
): Promise<RawMaterialGroup> {
  return apiClient<RawMaterialGroup>('/raw-material-groups', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

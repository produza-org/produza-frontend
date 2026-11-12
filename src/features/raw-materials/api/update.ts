import { apiClient } from '@/core/api';
import type {
  RawMaterial,
  RawMaterialUpdateInput,
} from '@/features/raw-materials/types/raw-material';

export function updateRawMaterialRequest(
  id: string,
  input: RawMaterialUpdateInput
): Promise<RawMaterial> {
  return apiClient<RawMaterial>(`/raw-materials/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

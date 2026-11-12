import { apiClient } from '@/core/api';
import type { RawMaterial } from '@/features/raw-materials/types/raw-material';

export function deleteRawMaterialRequest(
  id: string
): Promise<RawMaterial | undefined> {
  return apiClient<RawMaterial | undefined>(`/raw-materials/${id}`, {
    method: 'DELETE',
  });
}

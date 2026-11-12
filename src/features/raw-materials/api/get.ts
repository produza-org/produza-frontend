import { apiClient } from '@/core/api';
import type { RawMaterial } from '@/features/raw-materials/types/raw-material';

export function getRawMaterial(id: string): Promise<RawMaterial> {
  return apiClient<RawMaterial>(`/raw-materials/${id}`);
}

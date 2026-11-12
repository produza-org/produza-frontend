import { apiClient } from '@/core/api';
import type {
  RawMaterial,
  RawMaterialCreateInput,
} from '@/features/raw-materials/types/raw-material';

export function createRawMaterialRequest(
  input: RawMaterialCreateInput
): Promise<RawMaterial> {
  return apiClient<RawMaterial>('/raw-materials', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

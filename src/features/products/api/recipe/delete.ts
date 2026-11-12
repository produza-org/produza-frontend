import { apiClient } from '@/core/api';

export function deleteProductRecipe(productId: string): Promise<void> {
  return apiClient<void>(`/products/${productId}/recipe`, {
    method: 'DELETE',
  });
}

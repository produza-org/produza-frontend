import { apiClient } from '@/core/api';
import type { Product } from '@/features/products/types/product';

export function deleteProductRequest(id: string): Promise<Product | undefined> {
  return apiClient<Product | undefined>(`/products/${id}`, {
    method: 'DELETE',
  });
}

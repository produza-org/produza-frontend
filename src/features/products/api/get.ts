import { apiClient } from '@/core/api';
import type { Product } from '@/features/products/types/product';

export function getProduct(id: string): Promise<Product> {
  return apiClient<Product>(`/products/${id}`);
}

import { apiClient } from '@/core/api';
import type {
  Product,
  ProductUpdateInput,
} from '@/features/products/types/product';

export function updateProductRequest(
  id: string,
  input: ProductUpdateInput
): Promise<Product> {
  return apiClient<Product>(`/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

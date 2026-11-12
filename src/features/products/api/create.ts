import { apiClient } from '@/core/api';
import type {
  Product,
  ProductCreateInput,
} from '@/features/products/types/product';

export function createProductRequest(input: ProductCreateInput): Promise<Product> {
  return apiClient<Product>('/products', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

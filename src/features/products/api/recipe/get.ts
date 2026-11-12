import { apiClient } from '@/core/api';
import type { Recipe } from '@/features/products/types/recipe';

export function getProductRecipe(productId: string): Promise<Recipe> {
  return apiClient<Recipe>(`/products/${productId}/recipe`);
}

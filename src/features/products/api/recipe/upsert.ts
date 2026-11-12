import { apiClient } from '@/core/api';
import type { Recipe, RecipeUpsertInput } from '@/features/products/types/recipe';

export function upsertProductRecipe(
  productId: string,
  input: RecipeUpsertInput
): Promise<Recipe> {
  return apiClient<Recipe>(`/products/${productId}/recipe`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

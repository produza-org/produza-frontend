import { apiClient } from '@/core/api';
import {
  mapRecipeFromApi,
  mapRecipeUpsertToApi,
  type RecipeApiResponse,
} from '@/features/products/api/recipe/map';
import type { Recipe, RecipeUpsertInput } from '@/features/products/types/recipe';

export async function upsertProductRecipe(
  productId: string,
  input: RecipeUpsertInput
): Promise<Recipe> {
  const recipe = await apiClient<RecipeApiResponse>(
    `/products/${productId}/recipe`,
    {
      method: 'PUT',
      body: JSON.stringify(mapRecipeUpsertToApi(input)),
    }
  );
  return mapRecipeFromApi(recipe);
}

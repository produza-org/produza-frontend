import { apiClient } from '@/core/api';
import {
  mapRecipeFromApi,
  type RecipeApiResponse,
} from '@/features/products/api/recipe/map';
import type { Recipe } from '@/features/products/types/recipe';

export async function getProductRecipe(productId: string): Promise<Recipe> {
  const recipe = await apiClient<RecipeApiResponse>(
    `/products/${productId}/recipe`
  );
  return mapRecipeFromApi(recipe);
}

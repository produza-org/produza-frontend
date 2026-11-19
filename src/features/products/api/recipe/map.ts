import { RECIPE_LINE_CATEGORIES } from '@/features/products/constants';
import type {
  Recipe,
  RecipeLine,
  RecipeLineCategory,
  RecipeUpsertInput,
} from '@/features/products/types/recipe';
import { computeProportionSum } from '@/features/products/utils/recipe/proportion-sum';

type RecipeLineApiResponse = {
  id: string;
  rawMaterialId: string;
  category?: string;
  unitConsumption: number;
  unit: string;
  sortOrder: number;
  rawMaterial?: RecipeLine['rawMaterial'];
};

export type RecipeApiResponse = {
  id: string;
  productId: string;
  componentSum: number;
  lines: RecipeLineApiResponse[];
  createdAt?: string;
  updatedAt?: string;
};

type RecipeUpsertApiBody = {
  lines: Array<{
    rawMaterialId: string;
    category: RecipeLineCategory;
    unitConsumption: number;
    sortOrder?: number;
  }>;
};

function mapCategoryFromApi(category: string | undefined): RecipeLineCategory {
  if (
    category &&
    (RECIPE_LINE_CATEGORIES as readonly string[]).includes(category)
  ) {
    return category as RecipeLineCategory;
  }
  return 'MATERIA_PRIMA';
}

export function mapRecipeFromApi(recipe: RecipeApiResponse): Recipe {
  const lines = recipe.lines.map((line) => ({
    id: line.id,
    rawMaterialId: line.rawMaterialId,
    category: mapCategoryFromApi(line.category),
    proportion: line.unitConsumption,
    unit: line.unit,
    sortOrder: line.sortOrder,
    rawMaterial: line.rawMaterial,
  }));

  return {
    id: recipe.id,
    productId: recipe.productId,
    proportionSum: computeProportionSum(
      lines
        .filter((line) => line.category === 'MATERIA_PRIMA')
        .map((line) => ({ proportion: line.proportion }))
    ),
    createdAt: recipe.createdAt,
    updatedAt: recipe.updatedAt,
    lines,
  };
}

export function mapRecipeUpsertToApi(
  input: RecipeUpsertInput
): RecipeUpsertApiBody {
  return {
    lines: input.lines.map((line) => ({
      rawMaterialId: line.rawMaterialId,
      category: line.category,
      unitConsumption: line.proportion,
      ...(line.sortOrder === undefined ? {} : { sortOrder: line.sortOrder }),
    })),
  };
}

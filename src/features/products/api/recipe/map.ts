import type {
  Recipe,
  RecipeLine,
  RecipeUpsertInput,
} from '@/features/products/types/recipe';

type RecipeLineApiResponse = {
  id: string;
  rawMaterialId: string;
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
    unitConsumption: number;
    sortOrder?: number;
  }>;
};

export function mapRecipeFromApi(recipe: RecipeApiResponse): Recipe {
  return {
    id: recipe.id,
    productId: recipe.productId,
    proportionSum: recipe.componentSum,
    createdAt: recipe.createdAt,
    updatedAt: recipe.updatedAt,
    lines: recipe.lines.map((line) => ({
      id: line.id,
      rawMaterialId: line.rawMaterialId,
      proportion: line.unitConsumption,
      unit: line.unit,
      sortOrder: line.sortOrder,
      rawMaterial: line.rawMaterial,
    })),
  };
}

export function mapRecipeUpsertToApi(
  input: RecipeUpsertInput
): RecipeUpsertApiBody {
  return {
    lines: input.lines.map((line) => ({
      rawMaterialId: line.rawMaterialId,
      unitConsumption: line.proportion,
      ...(line.sortOrder === undefined ? {} : { sortOrder: line.sortOrder }),
    })),
  };
}

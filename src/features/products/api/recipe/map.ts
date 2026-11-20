import { RECIPE_LINE_CATEGORIES } from '@/features/products/constants';
import type {
  Recipe,
  RecipeGroup,
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

type RecipeGroupApiResponse = {
  id: string;
  category?: string;
  name: string;
  sourceGroupingId?: string | null;
  sortOrder: number;
  lines: RecipeLineApiResponse[];
};

export type RecipeApiResponse = {
  id: string;
  productId: string;
  componentSum: number;
  lines: RecipeLineApiResponse[];
  groups?: RecipeGroupApiResponse[];
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
  groups?: Array<{
    category: RecipeLineCategory;
    name: string;
    sourceGroupingId?: string | null;
    sortOrder?: number;
    lines: Array<{
      rawMaterialId: string;
      unitConsumption: number;
      sortOrder?: number;
    }>;
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

function mapLineFromApi(line: RecipeLineApiResponse): RecipeLine {
  return {
    id: line.id,
    rawMaterialId: line.rawMaterialId,
    category: mapCategoryFromApi(line.category),
    proportion: line.unitConsumption,
    unit: line.unit,
    sortOrder: line.sortOrder,
    rawMaterial: line.rawMaterial,
  };
}

function mapGroupFromApi(group: RecipeGroupApiResponse): RecipeGroup {
  const category = mapCategoryFromApi(group.category);
  return {
    id: group.id,
    category,
    name: group.name,
    sourceGroupingId: group.sourceGroupingId ?? null,
    sortOrder: group.sortOrder,
    lines: (group.lines ?? []).map((line) => ({
      ...mapLineFromApi(line),
      category,
    })),
  };
}

export function mapRecipeFromApi(recipe: RecipeApiResponse): Recipe {
  const lines = (recipe.lines ?? []).map(mapLineFromApi);
  const groups = (recipe.groups ?? []).map(mapGroupFromApi);
  const allRawMaterialLines = [
    ...lines.filter((line) => line.category === 'MATERIA_PRIMA'),
    ...groups.flatMap((group) =>
      group.category === 'MATERIA_PRIMA' ? group.lines : []
    ),
  ];

  return {
    id: recipe.id,
    productId: recipe.productId,
    proportionSum: computeProportionSum(
      allRawMaterialLines.map((line) => ({ proportion: line.proportion }))
    ),
    createdAt: recipe.createdAt,
    updatedAt: recipe.updatedAt,
    lines,
    groups,
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
    groups: (input.groups ?? []).map((group) => ({
      category: group.category,
      name: group.name,
      sourceGroupingId: group.sourceGroupingId ?? null,
      ...(group.sortOrder === undefined ? {} : { sortOrder: group.sortOrder }),
      lines: group.lines.map((line) => ({
        rawMaterialId: line.rawMaterialId,
        unitConsumption: line.proportion,
        ...(line.sortOrder === undefined ? {} : { sortOrder: line.sortOrder }),
      })),
    })),
  };
}

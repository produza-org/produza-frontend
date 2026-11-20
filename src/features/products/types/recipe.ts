export type RecipeLineCategory = 'MATERIA_PRIMA' | 'COMPONENTE' | 'EMBALAGEM';

export type RecipeLineRawMaterial = {
  id: string;
  code: string;
  name: string;
  unit: string;
  status: 'active' | 'inactive';
};

export type RecipeLine = {
  id: string;
  rawMaterialId: string;
  category: RecipeLineCategory;
  proportion: number;
  unit: string;
  sortOrder: number;
  rawMaterial?: RecipeLineRawMaterial;
};

export type RecipeGroup = {
  id: string;
  category: RecipeLineCategory;
  name: string;
  sourceGroupingId?: string | null;
  sortOrder: number;
  lines: RecipeLine[];
};

export type Recipe = {
  id: string;
  productId: string;
  proportionSum: number;
  lines: RecipeLine[];
  groups: RecipeGroup[];
  createdAt?: string;
  updatedAt?: string;
};

export type RecipeLineInput = {
  rawMaterialId: string;
  category: RecipeLineCategory;
  proportion: number;
  sortOrder?: number;
};

export type RecipeGroupInput = {
  category: RecipeLineCategory;
  name: string;
  sourceGroupingId?: string | null;
  sortOrder?: number;
  lines: Array<{
    rawMaterialId: string;
    proportion: number;
    sortOrder?: number;
  }>;
};

export type RecipeUpsertInput = {
  lines: RecipeLineInput[];
  groups?: RecipeGroupInput[];
};

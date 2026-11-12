export type RecipeLineCategory = 'COMPONENTE' | 'MATERIA_PRIMA' | 'EMBALAGEM';

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
  unitConsumption: number;
  unit: string;
  sortOrder: number;
  rawMaterial?: RecipeLineRawMaterial;
};

export type Recipe = {
  id: string;
  productId: string;
  componentSum: number;
  lines: RecipeLine[];
  createdAt?: string;
  updatedAt?: string;
};

export type RecipeLineInput = {
  rawMaterialId: string;
  category: RecipeLineCategory;
  unitConsumption: number;
  sortOrder?: number;
};

export type RecipeUpsertInput = {
  lines: RecipeLineInput[];
};

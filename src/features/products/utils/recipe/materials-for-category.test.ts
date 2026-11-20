import { describe, expect, it } from 'vitest';
import type { RawMaterial } from '@/features/raw-materials/types/raw-material';
import { materialsForRecipeCategory } from '@/features/products/utils/recipe/materials-for-category';

const materials: RawMaterial[] = [
  {
    id: 'm-kg',
    code: 'MP-001',
    name: 'Sugar',
    status: 'active',
    stockQuantity: 1,
    minStock: 1,
    unit: 'KG',
    unitCost: 1,
    totalCost: 1,
  },
  {
    id: 'm-unid',
    code: 'MP-EMB',
    name: 'Pot',
    status: 'active',
    stockQuantity: 1,
    minStock: 1,
    unit: 'UNID',
    unitCost: 1,
    totalCost: 1,
  },
];

describe('materialsForRecipeCategory', () => {
  it('returns all materials for raw material and component categories', () => {
    expect(materialsForRecipeCategory('MATERIA_PRIMA', materials)).toEqual(
      materials
    );
    expect(materialsForRecipeCategory('COMPONENTE', materials)).toEqual(
      materials
    );
  });

  it('returns only UNID materials for packaging', () => {
    expect(materialsForRecipeCategory('EMBALAGEM', materials)).toEqual([
      materials[1],
    ]);
  });
});

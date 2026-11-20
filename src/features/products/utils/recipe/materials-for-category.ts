import type { RecipeLineCategory } from '@/features/products/types/recipe';
import type { RawMaterial } from '@/features/raw-materials/types/raw-material';

export function materialsForRecipeCategory(
  category: RecipeLineCategory,
  materials: RawMaterial[]
): RawMaterial[] {
  if (category === 'EMBALAGEM') {
    return materials.filter((material) => material.unit === 'UNID');
  }
  return materials;
}

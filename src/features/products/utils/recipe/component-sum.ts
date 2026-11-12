import { RECIPE_COMPONENT_SUM_TOLERANCE } from '@/features/products/constants';
import type { RecipeLineCategory } from '@/features/products/types/recipe';

export type ComponentSumLine = {
  category: RecipeLineCategory;
  unitConsumption: number;
};

export function computeComponentSum(lines: ComponentSumLine[]): number {
  return lines.reduce((sum, line) => {
    if (line.category !== 'COMPONENTE') {
      return sum;
    }
    if (!Number.isFinite(line.unitConsumption)) {
      return sum;
    }
    return sum + line.unitConsumption;
  }, 0);
}

export function isComponentSumValid(
  sum: number,
  tolerance = RECIPE_COMPONENT_SUM_TOLERANCE
): boolean {
  return Number.isFinite(sum) && Math.abs(sum - 1) <= tolerance;
}

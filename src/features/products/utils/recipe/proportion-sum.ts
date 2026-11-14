import { RECIPE_PROPORTION_SUM_TOLERANCE } from '@/features/products/constants';

export type ProportionSumLine = {
  proportion: number;
};

export function computeProportionSum(lines: ProportionSumLine[]): number {
  return lines.reduce((sum, line) => {
    if (!Number.isFinite(line.proportion)) {
      return sum;
    }
    return sum + line.proportion;
  }, 0);
}

export function isProportionSumValid(
  sum: number,
  tolerance = RECIPE_PROPORTION_SUM_TOLERANCE
): boolean {
  return Number.isFinite(sum) && Math.abs(sum - 1) <= tolerance;
}

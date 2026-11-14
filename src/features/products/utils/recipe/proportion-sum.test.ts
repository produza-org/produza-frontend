import { describe, expect, it } from 'vitest';
import {
  computeProportionSum,
  isProportionSumValid,
} from '@/features/products/utils/recipe/proportion-sum';

describe('computeProportionSum', () => {
  it('sums all line proportions', () => {
    const sum = computeProportionSum([
      { proportion: 0.42 },
      { proportion: 0.58 },
    ]);

    expect(sum).toBeCloseTo(1, 10);
  });

  it('returns 0 for an empty set', () => {
    expect(computeProportionSum([])).toBe(0);
  });
});

describe('isProportionSumValid', () => {
  it('accepts values within 1e-6 of 1', () => {
    expect(isProportionSumValid(1)).toBe(true);
    expect(isProportionSumValid(1 + 5e-7)).toBe(true);
    expect(isProportionSumValid(1 - 5e-7)).toBe(true);
  });

  it('rejects values outside the tolerance', () => {
    expect(isProportionSumValid(0.9999989)).toBe(false);
    expect(isProportionSumValid(1.0000011)).toBe(false);
    expect(isProportionSumValid(0)).toBe(false);
  });
});

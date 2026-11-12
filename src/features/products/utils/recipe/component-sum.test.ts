import { describe, expect, it } from 'vitest';
import {
  computeComponentSum,
  isComponentSumValid,
} from '@/features/products/utils/recipe/component-sum';

describe('computeComponentSum', () => {
  it('sums only COMPONENTE lines', () => {
    const sum = computeComponentSum([
      { category: 'COMPONENTE', unitConsumption: 0.42 },
      { category: 'COMPONENTE', unitConsumption: 0.58 },
      { category: 'MATERIA_PRIMA', unitConsumption: 0.002 },
      { category: 'EMBALAGEM', unitConsumption: 1 },
    ]);

    expect(sum).toBeCloseTo(1, 10);
  });

  it('returns 0 for an empty set', () => {
    expect(computeComponentSum([])).toBe(0);
  });
});

describe('isComponentSumValid', () => {
  it('accepts values within 1e-6 of 1', () => {
    expect(isComponentSumValid(1)).toBe(true);
    expect(isComponentSumValid(1 + 5e-7)).toBe(true);
    expect(isComponentSumValid(1 - 5e-7)).toBe(true);
  });

  it('rejects values outside the tolerance', () => {
    expect(isComponentSumValid(0.9999989)).toBe(false);
    expect(isComponentSumValid(1.0000011)).toBe(false);
    expect(isComponentSumValid(0)).toBe(false);
  });
});

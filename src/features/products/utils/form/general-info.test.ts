import { describe, expect, it } from 'vitest';
import {
  isGeneralInfoValid,
  toProductFormValues,
  toRecipeProductMeta,
} from './general-info';

describe('isGeneralInfoValid', () => {
  it('returns false when name is blank', () => {
    expect(
      isGeneralInfoValid({
        name: '   ',
        finalSizeDisplay: '1.5',
        yieldDisplay: '0.75',
      })
    ).toBe(false);
  });

  it('returns false when finalSize is not greater than 0', () => {
    expect(
      isGeneralInfoValid({
        name: 'POTE',
        finalSizeDisplay: '0',
        yieldDisplay: '0.75',
      })
    ).toBe(false);
  });

  it('returns false when yield is not greater than 0', () => {
    expect(
      isGeneralInfoValid({
        name: 'POTE',
        finalSizeDisplay: '1.5',
        yieldDisplay: '0',
      })
    ).toBe(false);
  });

  it('returns true when name, finalSize, and yield are valid', () => {
    expect(
      isGeneralInfoValid({
        name: 'POTE 1,5L',
        finalSizeDisplay: '1.5',
        yieldDisplay: '0.75',
      })
    ).toBe(true);
  });
});

describe('toProductFormValues / toRecipeProductMeta', () => {
  const submit = {
    name: 'POTE 1,5L COCO BRANCO',
    finalSize: 1.5,
    finalSizeUnit: 'L' as const,
    yield: 0.75,
  };

  it('maps submit values back to form display values', () => {
    expect(toProductFormValues(submit)).toEqual({
      name: 'POTE 1,5L COCO BRANCO',
      finalSizeDisplay: '1.5',
      finalSizeUnit: 'L',
      yieldDisplay: '0.75',
    });
  });

  it('builds recipe meta with computed expansion factor', () => {
    const meta = toRecipeProductMeta(submit);
    expect(meta.finalSize).toBe(1.5);
    expect(meta.finalSizeUnit).toBe('L');
    expect(meta.yield).toBe(0.75);
    expect(meta.expansionFactor).toBeCloseTo(1.3333333333);
  });
});

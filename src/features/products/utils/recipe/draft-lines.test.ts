import { describe, expect, it } from 'vitest';
import {
  canSaveRecipeDraft,
  createEmptyDraftLine,
  stripIncompleteDraftLines,
  toRecipeLineInputs,
  type RecipeDraftLine,
} from '@/features/products/utils/recipe/draft-lines';

function line(partial: Partial<RecipeDraftLine> & Pick<RecipeDraftLine, 'key'>): RecipeDraftLine {
  return {
    key: partial.key,
    rawMaterialId: partial.rawMaterialId ?? '',
    proportionDisplay: partial.proportionDisplay ?? '',
    unit: partial.unit ?? '',
  };
}

describe('draft-lines', () => {
  it('strips incomplete rows before building PUT payload', () => {
    const lines: RecipeDraftLine[] = [
      line({
        key: '1',
        rawMaterialId: 'm-1',
        proportionDisplay: '0.4',
        unit: 'KG',
      }),
      line({
        key: '2',
        rawMaterialId: 'm-2',
        proportionDisplay: '0.6',
        unit: 'KG',
      }),
      createEmptyDraftLine(),
      line({
        key: '3',
        rawMaterialId: 'm-3',
        proportionDisplay: '',
        unit: 'UNID',
      }),
    ];

    expect(stripIncompleteDraftLines(lines)).toHaveLength(2);
    expect(toRecipeLineInputs(lines)).toEqual([
      {
        rawMaterialId: 'm-1',
        proportion: 0.4,
        sortOrder: 0,
      },
      {
        rawMaterialId: 'm-2',
        proportion: 0.6,
        sortOrder: 1,
      },
    ]);
  });

  it('disables save when proportion sum is not 1', () => {
    const lines: RecipeDraftLine[] = [
      line({
        key: '1',
        rawMaterialId: 'm-1',
        proportionDisplay: '0.4',
        unit: 'KG',
      }),
    ];

    expect(canSaveRecipeDraft(lines)).toBe(false);
  });

  it('allows save when proportion sum is 1', () => {
    const lines: RecipeDraftLine[] = [
      line({
        key: '1',
        rawMaterialId: 'm-1',
        proportionDisplay: '0.4',
        unit: 'KG',
      }),
      line({
        key: '2',
        rawMaterialId: 'm-2',
        proportionDisplay: '0.6',
        unit: 'KG',
      }),
      createEmptyDraftLine(),
    ];

    expect(canSaveRecipeDraft(lines)).toBe(true);
  });

  it('rejects duplicate materials', () => {
    const lines: RecipeDraftLine[] = [
      line({
        key: '1',
        rawMaterialId: 'm-1',
        proportionDisplay: '0.5',
        unit: 'KG',
      }),
      line({
        key: '2',
        rawMaterialId: 'm-1',
        proportionDisplay: '0.5',
        unit: 'KG',
      }),
    ];

    expect(canSaveRecipeDraft(lines)).toBe(false);
  });
});

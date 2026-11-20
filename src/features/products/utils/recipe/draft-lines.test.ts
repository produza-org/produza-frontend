import { describe, expect, it } from 'vitest';
import {
  canSaveRecipeDraft,
  createEmptyDraftLine,
  stripIncompleteDraftLines,
  toRecipeLineInputs,
  type RecipeDraftLine,
} from '@/features/products/utils/recipe/draft-lines';

function line(
  partial: Partial<RecipeDraftLine> &
    Pick<RecipeDraftLine, 'key' | 'category'>
): RecipeDraftLine {
  return {
    key: partial.key,
    category: partial.category,
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
        category: 'MATERIA_PRIMA',
        rawMaterialId: 'm-1',
        proportionDisplay: '0.4',
        unit: 'KG',
      }),
      line({
        key: '2',
        category: 'MATERIA_PRIMA',
        rawMaterialId: 'm-2',
        proportionDisplay: '0.6',
        unit: 'KG',
      }),
      createEmptyDraftLine('COMPONENTE'),
      line({
        key: '3',
        category: 'EMBALAGEM',
        rawMaterialId: 'm-3',
        proportionDisplay: '',
        unit: 'UNID',
      }),
    ];

    expect(stripIncompleteDraftLines(lines)).toHaveLength(2);
    expect(toRecipeLineInputs(lines)).toEqual([
      {
        rawMaterialId: 'm-1',
        category: 'MATERIA_PRIMA',
        proportion: 0.4,
        sortOrder: 0,
      },
      {
        rawMaterialId: 'm-2',
        category: 'MATERIA_PRIMA',
        proportion: 0.6,
        sortOrder: 1,
      },
    ]);
  });

  it('disables save when raw-material proportion sum is not 1', () => {
    const lines: RecipeDraftLine[] = [
      line({
        key: '1',
        category: 'MATERIA_PRIMA',
        rawMaterialId: 'm-1',
        proportionDisplay: '0.4',
        unit: 'KG',
      }),
    ];

    expect(canSaveRecipeDraft(lines)).toBe(false);
  });

  it('allows save when raw-material sum is 1 and component/packaging are empty', () => {
    const lines: RecipeDraftLine[] = [
      line({
        key: '1',
        category: 'MATERIA_PRIMA',
        rawMaterialId: 'm-1',
        proportionDisplay: '0.4',
        unit: 'KG',
      }),
      line({
        key: '2',
        category: 'MATERIA_PRIMA',
        rawMaterialId: 'm-2',
        proportionDisplay: '0.6',
        unit: 'KG',
      }),
      createEmptyDraftLine('COMPONENTE'),
      createEmptyDraftLine('EMBALAGEM'),
    ];

    expect(canSaveRecipeDraft(lines)).toBe(true);
  });

  it('requires component proportions to sum to 1 when component lines exist', () => {
    const incompleteComponent: RecipeDraftLine[] = [
      line({
        key: '1',
        category: 'MATERIA_PRIMA',
        rawMaterialId: 'm-1',
        proportionDisplay: '1',
        unit: 'KG',
      }),
      line({
        key: '2',
        category: 'COMPONENTE',
        rawMaterialId: 'm-2',
        proportionDisplay: '0.5',
        unit: 'KG',
      }),
      line({
        key: '3',
        category: 'EMBALAGEM',
        rawMaterialId: 'm-3',
        proportionDisplay: '1',
        unit: 'UNID',
      }),
    ];

    expect(canSaveRecipeDraft(incompleteComponent)).toBe(false);

    const validLines: RecipeDraftLine[] = [
      line({
        key: '1',
        category: 'MATERIA_PRIMA',
        rawMaterialId: 'm-1',
        proportionDisplay: '1',
        unit: 'KG',
      }),
      line({
        key: '2',
        category: 'COMPONENTE',
        rawMaterialId: 'm-2',
        proportionDisplay: '0.4',
        unit: 'KG',
      }),
      line({
        key: '3',
        category: 'COMPONENTE',
        rawMaterialId: 'm-4',
        proportionDisplay: '0.6',
        unit: 'LITRO',
      }),
      line({
        key: '4',
        category: 'EMBALAGEM',
        rawMaterialId: 'm-3',
        proportionDisplay: '1',
        unit: 'UNID',
      }),
    ];

    expect(canSaveRecipeDraft(validLines)).toBe(true);
    expect(toRecipeLineInputs(validLines)).toEqual([
      {
        rawMaterialId: 'm-1',
        category: 'MATERIA_PRIMA',
        proportion: 1,
        sortOrder: 0,
      },
      {
        rawMaterialId: 'm-2',
        category: 'COMPONENTE',
        proportion: 0.4,
        sortOrder: 1,
      },
      {
        rawMaterialId: 'm-4',
        category: 'COMPONENTE',
        proportion: 0.6,
        sortOrder: 2,
      },
      {
        rawMaterialId: 'm-3',
        category: 'EMBALAGEM',
        proportion: 1,
        sortOrder: 3,
      },
    ]);
  });

  it('excludes packaging proportions from both sum checks', () => {
    const lines: RecipeDraftLine[] = [
      line({
        key: '1',
        category: 'MATERIA_PRIMA',
        rawMaterialId: 'm-1',
        proportionDisplay: '1',
        unit: 'KG',
      }),
      line({
        key: '2',
        category: 'EMBALAGEM',
        rawMaterialId: 'm-3',
        proportionDisplay: '99',
        unit: 'UNID',
      }),
    ];

    expect(canSaveRecipeDraft(lines)).toBe(true);
  });

  it('rejects duplicate materials across categories', () => {
    const lines: RecipeDraftLine[] = [
      line({
        key: '1',
        category: 'MATERIA_PRIMA',
        rawMaterialId: 'm-1',
        proportionDisplay: '1',
        unit: 'KG',
      }),
      line({
        key: '2',
        category: 'COMPONENTE',
        rawMaterialId: 'm-1',
        proportionDisplay: '0.5',
        unit: 'KG',
      }),
    ];

    expect(canSaveRecipeDraft(lines)).toBe(false);
  });
});

import { describe, expect, it } from 'vitest';
import {
  canSaveRecipeDraft,
  createEmptyDraftLine,
  stripIncompleteDraftLines,
  toRecipeLineInputs,
  type RecipeDraftLine,
} from '@/features/products/utils/recipe/draft-lines';

function line(
  partial: Partial<RecipeDraftLine> & Pick<RecipeDraftLine, 'category'>
): RecipeDraftLine {
  return {
    key: partial.key ?? `k-${partial.category}`,
    rawMaterialId: partial.rawMaterialId ?? '',
    category: partial.category,
    unitConsumptionDisplay: partial.unitConsumptionDisplay ?? '',
    unit: partial.unit ?? '',
  };
}

describe('draft-lines', () => {
  it('strips incomplete rows before building PUT payload', () => {
    const lines: RecipeDraftLine[] = [
      line({
        key: '1',
        category: 'COMPONENTE',
        rawMaterialId: 'm-1',
        unitConsumptionDisplay: '0.4',
        unit: 'KG',
      }),
      line({
        key: '2',
        category: 'COMPONENTE',
        rawMaterialId: 'm-2',
        unitConsumptionDisplay: '0.6',
        unit: 'KG',
      }),
      createEmptyDraftLine('MATERIA_PRIMA'),
      line({
        key: '3',
        category: 'EMBALAGEM',
        rawMaterialId: 'm-3',
        unitConsumptionDisplay: '',
        unit: 'UNID',
      }),
    ];

    expect(stripIncompleteDraftLines(lines)).toHaveLength(2);
    expect(toRecipeLineInputs(lines)).toEqual([
      {
        rawMaterialId: 'm-1',
        category: 'COMPONENTE',
        unitConsumption: 0.4,
        sortOrder: 0,
      },
      {
        rawMaterialId: 'm-2',
        category: 'COMPONENTE',
        unitConsumption: 0.6,
        sortOrder: 1,
      },
    ]);
  });

  it('disables save when component sum is not 1', () => {
    const lines: RecipeDraftLine[] = [
      line({
        key: '1',
        category: 'COMPONENTE',
        rawMaterialId: 'm-1',
        unitConsumptionDisplay: '0.4',
        unit: 'KG',
      }),
    ];

    expect(canSaveRecipeDraft(lines)).toBe(false);
  });

  it('allows save when component sum is 1 and packaging uses UNID', () => {
    const lines: RecipeDraftLine[] = [
      line({
        key: '1',
        category: 'COMPONENTE',
        rawMaterialId: 'm-1',
        unitConsumptionDisplay: '0.4',
        unit: 'KG',
      }),
      line({
        key: '2',
        category: 'COMPONENTE',
        rawMaterialId: 'm-2',
        unitConsumptionDisplay: '0.6',
        unit: 'KG',
      }),
      line({
        key: '3',
        category: 'EMBALAGEM',
        rawMaterialId: 'm-3',
        unitConsumptionDisplay: '1',
        unit: 'UNID',
      }),
      createEmptyDraftLine('MATERIA_PRIMA'),
    ];

    expect(canSaveRecipeDraft(lines)).toBe(true);
  });

  it('rejects packaging lines without UNID', () => {
    const lines: RecipeDraftLine[] = [
      line({
        key: '1',
        category: 'COMPONENTE',
        rawMaterialId: 'm-1',
        unitConsumptionDisplay: '1',
        unit: 'KG',
      }),
      line({
        key: '2',
        category: 'EMBALAGEM',
        rawMaterialId: 'm-2',
        unitConsumptionDisplay: '1',
        unit: 'KG',
      }),
    ];

    expect(canSaveRecipeDraft(lines)).toBe(false);
  });
});

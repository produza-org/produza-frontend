import { describe, expect, it } from 'vitest';
import { createEmptyRecipeDraft } from '@/features/products/utils/recipe/draft-lines';
import {
  recipeCategoryFieldId,
  recipeMaterialFieldId,
  recipeProportionFieldId,
  validateRecipeDraft,
} from '@/features/products/utils/recipe/validate-recipe-draft';

const messages = {
  rawMaterialRequired: 'MP required',
  materialRequired: 'Material required',
  proportionRequired: 'Proportion required',
  proportionNegative: 'Negative',
  duplicateMaterial: 'Duplicate',
  componentSumInvalid: 'Component sum',
  groupRequired: 'Group required',
};

describe('validateRecipeDraft', () => {
  it('requires at least one complete raw material', () => {
    expect(validateRecipeDraft(createEmptyRecipeDraft(), messages)).toEqual({
      [recipeCategoryFieldId('MATERIA_PRIMA')]: 'MP required',
    });
  });

  it('allows a single complete raw material without sum = 1', () => {
    expect(
      validateRecipeDraft(
        {
          lines: [
            {
              key: '1',
              category: 'MATERIA_PRIMA',
              rawMaterialId: 'm-1',
              proportionDisplay: '0.4',
              unit: 'KG',
            },
          ],
          groups: [],
        },
        messages
      )
    ).toEqual({});
  });

  it('flags incomplete lines and invalid component sum', () => {
    const errors = validateRecipeDraft(
      {
        lines: [
          {
            key: '1',
            category: 'MATERIA_PRIMA',
            rawMaterialId: 'm-1',
            proportionDisplay: '1',
            unit: 'KG',
          },
          {
            key: '2',
            category: 'COMPONENTE',
            rawMaterialId: 'm-2',
            proportionDisplay: '0.5',
            unit: 'KG',
          },
        ],
        groups: [],
      },
      messages
    );

    expect(errors[recipeProportionFieldId('2')]).toBe('Component sum');
  });

  it('flags duplicate materials', () => {
    const errors = validateRecipeDraft(
      {
        lines: [
          {
            key: '1',
            category: 'MATERIA_PRIMA',
            rawMaterialId: 'm-1',
            proportionDisplay: '1',
            unit: 'KG',
          },
          {
            key: '2',
            category: 'COMPONENTE',
            rawMaterialId: 'm-1',
            proportionDisplay: '1',
            unit: 'KG',
          },
        ],
        groups: [],
      },
      messages
    );

    expect(errors[recipeMaterialFieldId('2')]).toBe('Duplicate');
  });
});

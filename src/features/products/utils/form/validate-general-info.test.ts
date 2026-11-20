import { describe, expect, it } from 'vitest';
import { validateGeneralInfo } from '@/features/products/utils/form/validate-general-info';

const messages = {
  nameRequired: 'Name required',
  finalSizeInvalid: 'Final size invalid',
  unitRequired: 'Unit required',
  yieldInvalid: 'Yield invalid',
};

describe('validateGeneralInfo', () => {
  it('returns field errors for invalid values', () => {
    expect(
      validateGeneralInfo(
        {
          name: '',
          finalSizeDisplay: '0',
          finalSizeUnit: 'L',
          yieldDisplay: '',
        },
        messages
      )
    ).toEqual({
      'product-name': 'Name required',
      'product-final-size': 'Final size invalid',
      'product-yield': 'Yield invalid',
    });
  });

  it('returns empty errors for valid values', () => {
    expect(
      validateGeneralInfo(
        {
          name: 'POTE',
          finalSizeDisplay: '1.5',
          finalSizeUnit: 'L',
          yieldDisplay: '0.75',
        },
        messages
      )
    ).toEqual({});
  });
});

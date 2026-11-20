import { describe, expect, it } from 'vitest';
import {
  validateRawMaterialForm,
} from '@/features/raw-materials/utils/form/validate-raw-material';

const messages = {
  nameRequired: 'Name required',
  codeInvalid: 'Code invalid',
  unitRequired: 'Unit required',
  unitCostInvalid: 'Cost invalid',
  stockInvalid: 'Stock invalid',
  minStockInvalid: 'Min stock invalid',
};

describe('validateRawMaterialForm', () => {
  it('returns field errors for empty values', () => {
    expect(
      validateRawMaterialForm(
        {
          name: '',
          code: '',
          unit: 'KG',
          unitCostDisplay: '',
          stockQuantity: '',
          minStock: '',
        },
        messages
      )
    ).toEqual({
      'material-name': 'Name required',
      'material-code': 'Code invalid',
      'unit-price': 'Cost invalid',
      'stock-qty': 'Stock invalid',
      'min-stock': 'Min stock invalid',
    });
  });

  it('returns empty errors for a valid form', () => {
    expect(
      validateRawMaterialForm(
        {
          name: 'AGUA',
          code: 'MP-001',
          unit: 'LITRO',
          unitCostDisplay: '1,50',
          stockQuantity: '10',
          minStock: '1',
        },
        messages
      )
    ).toEqual({});
  });
});

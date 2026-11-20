import type { FieldErrors } from '@/shared/form-validation';
import { parseCurrencyBrlInput } from '@/shared/utils';
import type { RawMaterialFormValues } from '@/features/raw-materials/components/form/RawMaterialForm';
import { isValidRawMaterialCode } from '@/features/raw-materials/utils/create/raw-material-code';

export const RAW_MATERIAL_FIELD_ORDER = [
  'material-name',
  'material-code',
  'unit-measure',
  'unit-price',
  'stock-qty',
  'min-stock',
] as const;

export type RawMaterialFormMessages = {
  nameRequired: string;
  codeInvalid: string;
  unitRequired: string;
  unitCostInvalid: string;
  stockInvalid: string;
  minStockInvalid: string;
};

export function validateRawMaterialForm(
  values: RawMaterialFormValues,
  messages: RawMaterialFormMessages
): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.name.trim()) {
    errors['material-name'] = messages.nameRequired;
  }

  if (!isValidRawMaterialCode(values.code)) {
    errors['material-code'] = messages.codeInvalid;
  }

  if (!values.unit) {
    errors['unit-measure'] = messages.unitRequired;
  }

  const unitCost = parseCurrencyBrlInput(values.unitCostDisplay);
  if (!(unitCost > 0)) {
    errors['unit-price'] = messages.unitCostInvalid;
  }

  const quantity = parseInt(values.stockQuantity, 10);
  if (!Number.isFinite(quantity) || !(quantity > 0)) {
    errors['stock-qty'] = messages.stockInvalid;
  }

  const minStock = parseInt(values.minStock, 10);
  if (!Number.isFinite(minStock) || !(minStock > 0)) {
    errors['min-stock'] = messages.minStockInvalid;
  }

  return errors;
}

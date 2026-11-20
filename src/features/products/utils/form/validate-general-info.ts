import type { FieldErrors } from '@/shared/form-validation';
import type { ProductFormValues } from '@/features/products/types/product-form';
import { parseDecimalInput } from '@/features/products/utils/format';

export const PRODUCT_GENERAL_FIELD_ORDER = [
  'product-name',
  'product-final-size',
  'product-final-size-unit',
  'product-yield',
] as const;

export type ProductGeneralMessages = {
  nameRequired: string;
  finalSizeInvalid: string;
  unitRequired: string;
  yieldInvalid: string;
};

export function validateGeneralInfo(
  values: ProductFormValues,
  messages: ProductGeneralMessages
): FieldErrors {
  const errors: FieldErrors = {};
  const finalSize = parseDecimalInput(values.finalSizeDisplay);
  const yieldValue = parseDecimalInput(values.yieldDisplay);

  if (!values.name.trim()) {
    errors['product-name'] = messages.nameRequired;
  }

  if (!Number.isFinite(finalSize) || !(finalSize > 0)) {
    errors['product-final-size'] = messages.finalSizeInvalid;
  }

  if (!values.finalSizeUnit) {
    errors['product-final-size-unit'] = messages.unitRequired;
  }

  if (!Number.isFinite(yieldValue) || !(yieldValue > 0)) {
    errors['product-yield'] = messages.yieldInvalid;
  }

  return errors;
}

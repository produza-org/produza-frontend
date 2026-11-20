import type { ProductFinalSizeUnit } from '@/features/products/types/product';
import type {
  ProductFormSubmitValues,
  ProductFormValues,
} from '@/features/products/types/product-form';
import {
  computeExpansionFactor,
  parseDecimalInput,
} from '@/features/products/utils/format';

export type RecipeProductMeta = {
  yield: number;
  expansionFactor: number;
  finalSize: number;
  finalSizeUnit: ProductFinalSizeUnit;
};

export function isGeneralInfoValid(values: {
  name: string;
  finalSizeDisplay: string;
  yieldDisplay: string;
}): boolean {
  const finalSize = parseDecimalInput(values.finalSizeDisplay);
  const yieldValue = parseDecimalInput(values.yieldDisplay);

  return (
    Boolean(values.name.trim()) &&
    Number.isFinite(finalSize) &&
    finalSize > 0 &&
    Number.isFinite(yieldValue) &&
    yieldValue > 0
  );
}

export { validateGeneralInfo } from '@/features/products/utils/form/validate-general-info';
export type { ProductGeneralMessages } from '@/features/products/utils/form/validate-general-info';


export function toProductFormValues(
  values: ProductFormSubmitValues
): ProductFormValues {
  return {
    name: values.name,
    finalSizeDisplay: String(values.finalSize),
    finalSizeUnit: values.finalSizeUnit,
    yieldDisplay: String(values.yield),
  };
}

export function toRecipeProductMeta(
  values: ProductFormSubmitValues
): RecipeProductMeta {
  const expansionFactor = computeExpansionFactor(values.yield);
  return {
    yield: values.yield,
    expansionFactor: expansionFactor ?? 0,
    finalSize: values.finalSize,
    finalSizeUnit: values.finalSizeUnit,
  };
}

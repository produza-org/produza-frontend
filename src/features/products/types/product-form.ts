import type { ProductFinalSizeUnit } from '@/features/products/types/product';

export type ProductFormValues = {
  name: string;
  finalSizeDisplay: string;
  finalSizeUnit: ProductFinalSizeUnit;
  yieldDisplay: string;
};

export type ProductFormSubmitValues = {
  name: string;
  finalSize: number;
  finalSizeUnit: ProductFinalSizeUnit;
  yield: number;
};

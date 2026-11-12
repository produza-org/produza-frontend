export type ProductStatus = 'active' | 'inactive';

export type ProductFinalSizeUnit = 'L' | 'KG' | 'UNID' | 'M' | 'M2';

export type Product = {
  id: string;
  name: string;
  finalSize: number;
  finalSizeUnit: ProductFinalSizeUnit;
  yield: number;
  expansionFactor: number;
  status: ProductStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductCreateInput = {
  name: string;
  finalSize: number;
  finalSizeUnit: ProductFinalSizeUnit;
  yield: number;
};

export type ProductUpdateInput = Partial<ProductCreateInput> & {
  status?: ProductStatus;
};

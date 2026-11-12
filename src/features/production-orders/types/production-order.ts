export type NeedLineCategory = 'COMPONENTE' | 'MATERIA_PRIMA' | 'EMBALAGEM';

export type ProductionOrderProduct = {
  id: string;
  name: string;
  yield: number;
};

export type ProductionOrderNeedLine = {
  id: string;
  category: NeedLineCategory;
  rawMaterialId: string;
  rawMaterialCode: string;
  rawMaterialName: string;
  unit: string;
  unitConsumptionSnapshot: number;
  quantityE: number;
  sortOrder: number;
};

export type ProductionOrder = {
  id: string;
  number: string;
  productId: string;
  product: ProductionOrderProduct;
  qtdAProduzir: number;
  yieldSnapshot: number;
  totalMisturaKg: number;
  emitidaEm: string;
  startDate: string | null;
  plannedEndDate: string | null;
  notes: string | null;
  needLines: ProductionOrderNeedLine[];
  createdAt?: string;
  updatedAt?: string;
};

export type ProductionOrderCreateInput = {
  number: string;
  productId: string;
  qtdAProduzir: number;
  startDate?: string;
  plannedEndDate?: string;
  notes?: string;
};

export type ProductionOrderUpdateInput = {
  number?: string;
  qtdAProduzir?: number;
  startDate?: string | null;
  plannedEndDate?: string | null;
  notes?: string | null;
};

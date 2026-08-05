export type RawMaterialStatus = 'active' | 'inactive';

export type RawMaterial = {
  id: string;
  code: string;
  name: string;
  status: RawMaterialStatus;
  stockQuantity: number;
  minStock: number;
  unit: string;
  unitCost: number;
  totalCost: number;
};

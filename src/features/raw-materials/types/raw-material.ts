export type RawMaterialStatus = 'active' | 'inactive';

export type RawMaterialUnit = 'KG' | 'UNID' | 'M' | 'M2' | 'LITRO';

export type RawMaterial = {
  id: string;
  code: string;
  name: string;
  status: RawMaterialStatus;
  stockQuantity: number;
  minStock: number;
  unit: RawMaterialUnit;
  unitCost: number;
  totalCost: number;
  createdAt?: string;
  updatedAt?: string;
};

export type RawMaterialCreateInput = {
  code: string;
  name: string;
  unit: RawMaterialUnit;
  unitCost: number;
  stockQuantity: number;
  minStock: number;
};

export type RawMaterialUpdateInput = Partial<RawMaterialCreateInput> & {
  status?: RawMaterialStatus;
};

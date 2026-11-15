export type RawMaterialGroupStatus = 'active' | 'inactive';

export type RawMaterialGroupLineMaterial = {
  id: string;
  code: string;
  name: string;
  unit: string;
  unitCost: number;
  stockQuantity: number;
};

export type RawMaterialGroupLine = {
  id: string;
  rawMaterialId: string;
  quantity: number;
  rawMaterial?: RawMaterialGroupLineMaterial;
};

export type RawMaterialGroup = {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  status: RawMaterialGroupStatus;
  materialsCount: number;
  totalCost: number;
  lines: RawMaterialGroupLine[];
  createdAt?: string;
  updatedAt?: string;
};

export type RawMaterialGroupLineInput = {
  rawMaterialId: string;
  quantity: number;
};

export type RawMaterialGroupCreateInput = {
  name: string;
  code: string;
  description?: string;
  lines: RawMaterialGroupLineInput[];
};

export type RawMaterialGroupUpdateInput = {
  name?: string;
  code?: string;
  description?: string | null;
  status?: RawMaterialGroupStatus;
  lines?: RawMaterialGroupLineInput[];
};

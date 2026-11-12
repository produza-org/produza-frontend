export const RAW_MATERIALS_PAGE_SIZE = 6;

export const RAW_MATERIALS_CRITICAL_STOCK_THRESHOLD = 50;

export const RAW_MATERIALS_STOCK_WARNING_RATIO = 1.5;

export const RAW_MATERIAL_UNIT_OPTIONS = [
  { value: 'KG', labelKey: 'rawMaterials.units.kg' },
  { value: 'UNID', labelKey: 'rawMaterials.units.un' },
  { value: 'M', labelKey: 'rawMaterials.units.m' },
  { value: 'M2', labelKey: 'rawMaterials.units.m2' },
  { value: 'LITRO', labelKey: 'rawMaterials.units.lt' },
] as const;

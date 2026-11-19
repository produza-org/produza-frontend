export const PRODUCTS_PAGE_SIZE = 6;

export const PRODUCT_FINAL_SIZE_UNIT_OPTIONS = [
  { value: 'L', labelKey: 'products.units.l' },
  { value: 'KG', labelKey: 'products.units.kg' },
  { value: 'UNID', labelKey: 'products.units.un' },
  { value: 'M', labelKey: 'products.units.m' },
  { value: 'M2', labelKey: 'products.units.m2' },
] as const;

export const RECIPE_LINE_CATEGORIES = [
  'MATERIA_PRIMA',
  'COMPONENTE',
  'EMBALAGEM',
] as const;

export const RECIPE_PROPORTION_SUM_TOLERANCE = 1e-6;

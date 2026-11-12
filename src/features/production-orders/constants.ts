import type { NeedLineCategory } from '@/features/production-orders/types/production-order';

export const PRODUCTION_ORDERS_PAGE_SIZE = 6;

export const NEED_LINE_CATEGORIES: readonly NeedLineCategory[] = [
  'COMPONENTE',
  'MATERIA_PRIMA',
  'EMBALAGEM',
] as const;

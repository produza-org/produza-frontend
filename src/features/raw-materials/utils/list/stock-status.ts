import { RAW_MATERIALS_STOCK_WARNING_RATIO } from '@/features/raw-materials/constants';

export type StockStatus = 'critical' | 'warning' | 'ok';

export function getStockStatus(stockQuantity: number, minStock: number): StockStatus {
  if (stockQuantity < minStock) return 'critical';
  if (stockQuantity < minStock * RAW_MATERIALS_STOCK_WARNING_RATIO) return 'warning';
  return 'ok';
}

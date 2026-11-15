import type { TFunction } from 'i18next';
import type { ProductionOrder } from '@/features/production-orders/types/production-order';
import {
  formatDecimal,
  formatQuantity,
} from '@/features/production-orders/utils/format';
import type { DrawerStat } from '@/shared/components/drawer';

export function buildProductionOrderDrawerStats(
  item: ProductionOrder,
  t: TFunction
): DrawerStat[] {
  return [
    {
      id: 'quantity',
      label: t('productionOrders.drawer.quantity'),
      value: formatQuantity(item.qtdAProduzir),
    },
    {
      id: 'totalMistura',
      label: t('productionOrders.drawer.totalMistura'),
      value: formatDecimal(item.totalMisturaKg, 4),
      compact: true,
    },
  ];
}

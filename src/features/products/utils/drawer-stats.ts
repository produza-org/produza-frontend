import type { TFunction } from 'i18next';
import type { Product } from '@/features/products/types/product';
import { formatDecimal, formatQuantity } from '@/features/products/utils/format';
import type { DrawerStat } from '@/shared/components/drawer';

export function buildProductDrawerStats(item: Product, t: TFunction): DrawerStat[] {
  return [
    {
      id: 'yield',
      label: t('products.drawer.yield'),
      value: formatDecimal(item.yield, 6),
    },
    {
      id: 'finalSize',
      label: t('products.drawer.finalSize'),
      value: `${formatQuantity(item.finalSize)} ${item.finalSizeUnit}`,
      compact: true,
    },
  ];
}

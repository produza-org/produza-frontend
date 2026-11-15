import type { TFunction } from 'i18next';
import type { RawMaterial } from '@/features/raw-materials/types/raw-material';
import { formatCurrencyBrl, formatQuantity } from '@/features/raw-materials/utils/format';
import type { DrawerStat } from '@/shared/components/drawer';

export function buildRawMaterialDrawerStats(
  item: RawMaterial,
  t: TFunction
): DrawerStat[] {
  return [
    {
      id: 'stock',
      label: t('rawMaterials.drawer.stockQuantity'),
      value: `${formatQuantity(item.stockQuantity)} ${item.unit}`,
    },
    {
      id: 'totalCost',
      label: t('rawMaterials.drawer.totalCost'),
      value: formatCurrencyBrl(item.totalCost),
      compact: true,
    },
  ];
}

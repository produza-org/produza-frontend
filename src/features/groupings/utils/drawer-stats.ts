import type { TFunction } from 'i18next';
import type { RawMaterialGroup } from '@/features/groupings/types/grouping';
import { formatCurrencyBrl } from '@/features/groupings/utils/format';
import type { DrawerStat } from '@/shared/components/drawer';

export function buildGroupingDrawerStats(
  item: RawMaterialGroup,
  t: TFunction
): DrawerStat[] {
  return [
    {
      id: 'materials',
      label: t('groupings.drawer.materials'),
      value: String(item.materialsCount),
    },
    {
      id: 'totalCost',
      label: t('groupings.drawer.totalCost'),
      value: formatCurrencyBrl(item.totalCost),
      compact: true,
    },
  ];
}

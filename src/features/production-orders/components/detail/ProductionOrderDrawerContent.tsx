import { useTranslation } from 'react-i18next';
import type { ProductionOrder } from '@/features/production-orders/types/production-order';
import { formatQuantity } from '@/features/production-orders/utils/format';
import { DetailBreakdownList } from '@/shared/components/drawer';

type ProductionOrderDrawerContentProps = {
  item: ProductionOrder;
};

export function ProductionOrderDrawerContent({
  item,
}: ProductionOrderDrawerContentProps) {
  const { t } = useTranslation();
  const needLines = item.needLines ?? [];

  if (needLines.length === 0) {
    return null;
  }

  return (
    <DetailBreakdownList
      title={t('productionOrders.drawer.sectionNeeds')}
      items={needLines.map((line) => ({
        id: line.id,
        primary: line.rawMaterialName,
        secondary: t(`productionOrders.categories.${line.category}`),
        value: `${formatQuantity(line.quantityE)} ${line.unit}`,
        valueSecondary: line.rawMaterialCode,
      }))}
    />
  );
}

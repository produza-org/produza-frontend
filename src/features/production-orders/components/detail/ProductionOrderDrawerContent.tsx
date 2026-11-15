import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import type { ProductionOrder } from '@/features/production-orders/types/production-order';
import {
  formatDateDisplay,
  formatDecimal,
  formatQuantity,
} from '@/features/production-orders/utils/format';
import {
  DetailBreakdownList,
  DetailFactList,
  DetailSection,
  DetailSectionTitle,
} from '@/shared/components/drawer';

type ProductionOrderDrawerContentProps = {
  item: ProductionOrder;
};

export function ProductionOrderDrawerContent({
  item,
}: ProductionOrderDrawerContentProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const p = theme.palette.produza;
  const needLines = item.needLines ?? [];

  return (
    <>
      <DetailFactList
        title={t('productionOrders.drawer.sectionOverview')}
        items={[
          {
            id: 'number',
            label: t('productionOrders.drawer.number'),
            value: item.number,
          },
          {
            id: 'product',
            label: t('productionOrders.drawer.product'),
            value: item.product.name,
          },
          {
            id: 'q',
            label: t('productionOrders.drawer.quantity'),
            value: formatQuantity(item.qtdAProduzir),
          },
          {
            id: 'real',
            label: t('productionOrders.drawer.realProduzido'),
            value: formatQuantity(item.realProduzido),
          },
          {
            id: 'totalMistura',
            label: t('productionOrders.drawer.totalMistura'),
            value: formatDecimal(item.totalMisturaKg, 6),
          },
          {
            id: 'yield',
            label: t('productionOrders.drawer.yieldSnapshot'),
            value: formatDecimal(item.yieldSnapshot, 6),
          },
          {
            id: 'emitidaEm',
            label: t('productionOrders.drawer.emitidaEm'),
            value: formatDateDisplay(item.emitidaEm),
          },
          {
            id: 'startDate',
            label: t('productionOrders.drawer.startDate'),
            value: formatDateDisplay(item.startDate),
          },
          {
            id: 'plannedEndDate',
            label: t('productionOrders.drawer.plannedEndDate'),
            value: formatDateDisplay(item.plannedEndDate),
          },
          ...(item.notes?.trim()
            ? [
                {
                  id: 'notes',
                  label: t('productionOrders.drawer.notes'),
                  value: item.notes,
                },
              ]
            : []),
        ]}
      />

      {needLines.length > 0 ? (
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
      ) : (
        <DetailSection>
          <DetailSectionTitle component="h3">
            {t('productionOrders.drawer.sectionNeeds')}
          </DetailSectionTitle>
          <Typography
            sx={{
              fontSize: 14,
              color: p.onSurfaceVariant,
            }}
          >
            {t('productionOrders.drawer.needsEmpty')}
          </Typography>
        </DetailSection>
      )}
    </>
  );
}

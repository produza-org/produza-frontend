import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import type { ProductionOrder } from '@/features/production-orders/types/production-order';
import {
  formatDateDisplay,
  formatDecimal,
  formatQuantity,
} from '@/features/production-orders/utils/format';
import { groupNeedLinesByCategory } from '@/features/production-orders/utils/need-lines';
import {
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
  const groups = groupNeedLinesByCategory(item.needLines ?? []);
  const totalNeedLines = (item.needLines ?? []).length;

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
          ...(item.notes
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

      <DetailSection>
        <DetailSectionTitle component="h3">
          {t('productionOrders.drawer.sectionNeeds')}
        </DetailSectionTitle>
        {totalNeedLines === 0 ? (
          <Typography
            sx={{
              fontSize: 14,
              color: p.onSurfaceVariant,
            }}
          >
            {t('productionOrders.drawer.needsEmpty')}
          </Typography>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
            }}
          >
            {groups
              .filter((group) => group.lines.length > 0)
              .map((group) => (
                <Box
                  key={group.category}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    gap: 2,
                    px: 2,
                    py: 1.5,
                    borderRadius: 2.5,
                    border: `1px solid ${p.outlineVariant}4D`,
                    backgroundColor: p.surfaceContainerLow,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: p.onSurfaceVariant,
                    }}
                  >
                    {t(`productionOrders.categories.${group.category}`)}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: p.onSurface,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {t('productionOrders.drawer.needsCount', {
                      count: group.lines.length,
                    })}
                  </Typography>
                </Box>
              ))}
          </Box>
        )}
      </DetailSection>
    </>
  );
}

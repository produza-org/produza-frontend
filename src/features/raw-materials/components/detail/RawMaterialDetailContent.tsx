import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import type { RawMaterial } from '@/features/raw-materials/types/raw-material';
import { formatCurrencyBrl, formatQuantity } from '@/features/raw-materials/utils/format';
import { getStockStatus } from '@/features/raw-materials/utils/list/stock-status';
import { DetailFactList } from '@/shared/components/drawer';

type RawMaterialDetailContentProps = {
  item: RawMaterial;
};

export function RawMaterialDetailContent({ item }: RawMaterialDetailContentProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const p = theme.palette.produza;
  const isActive = item.status === 'active';
  const stockStatus = getStockStatus(item.stockQuantity, item.minStock);

  const stockColors = {
    critical: p.error,
    warning: p.warning,
    ok: p.success,
  } as const;

  return (
    <DetailFactList
      title={t('rawMaterials.drawer.sectionOverview')}
      items={[
        {
          id: 'code',
          label: t('rawMaterials.drawer.code'),
          value: item.code,
        },
        {
          id: 'name',
          label: t('rawMaterials.drawer.name'),
          value: item.name,
        },
        {
          id: 'status',
          label: t('rawMaterials.drawer.status'),
          value: (
            <Chip
              size="small"
              label={t(`rawMaterials.status.${item.status}`)}
              sx={{
                height: 24,
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                borderRadius: 1.5,
                color: isActive ? p.success : p.error,
                backgroundColor: isActive
                  ? p.successContainer
                  : `${p.errorContainer}99`,
              }}
            />
          ),
        },
        {
          id: 'unit',
          label: t('rawMaterials.drawer.unit'),
          value: item.unit,
        },
        {
          id: 'stock',
          label: t('rawMaterials.drawer.stockQuantity'),
          value: (
            <Box component="span" sx={{ color: stockColors[stockStatus] }}>
              {formatQuantity(item.stockQuantity)}
            </Box>
          ),
        },
        {
          id: 'minStock',
          label: t('rawMaterials.drawer.minStock'),
          value: formatQuantity(item.minStock),
        },
        {
          id: 'unitCost',
          label: t('rawMaterials.drawer.unitCost'),
          value: formatCurrencyBrl(item.unitCost),
        },
        {
          id: 'totalCost',
          label: t('rawMaterials.drawer.totalCost'),
          value: formatCurrencyBrl(item.totalCost),
        },
      ]}
    />
  );
}

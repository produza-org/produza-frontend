import { useTranslation } from 'react-i18next';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import type { Product } from '@/features/products/types/product';
import { formatDecimal, formatQuantity } from '@/features/products/utils/format';
import { DetailFactList } from '@/shared/components/drawer';

type ProductDetailContentProps = {
  item: Product;
};

export function ProductDetailContent({ item }: ProductDetailContentProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const p = theme.palette.produza;
  const isActive = item.status === 'active';

  return (
    <DetailFactList
      title={t('products.drawer.sectionOverview')}
      items={[
        {
          id: 'name',
          label: t('products.drawer.name'),
          value: item.name,
        },
        {
          id: 'status',
          label: t('products.drawer.status'),
          value: (
            <Chip
              size="small"
              label={t(`products.status.${item.status}`)}
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
          id: 'finalSize',
          label: t('products.drawer.finalSize'),
          value: formatQuantity(item.finalSize),
        },
        {
          id: 'unit',
          label: t('products.drawer.unit'),
          value: item.finalSizeUnit,
        },
        {
          id: 'yield',
          label: t('products.drawer.yield'),
          value: formatDecimal(item.yield, 6),
        },
        {
          id: 'expansion',
          label: t('products.drawer.expansionFactor'),
          value: formatDecimal(item.expansionFactor, 6),
        },
      ]}
    />
  );
}

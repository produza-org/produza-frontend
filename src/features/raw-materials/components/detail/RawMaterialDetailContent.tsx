import { useTranslation } from 'react-i18next';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import { RAW_MATERIAL_UNIT_OPTIONS } from '@/features/raw-materials/constants';
import type { RawMaterial } from '@/features/raw-materials/types/raw-material';
import {
  formatCurrencyBrl,
  formatDateDisplay,
  formatQuantity,
} from '@/features/raw-materials/utils/format';
import {
  DetailBreakdownList,
  type DetailBreakdownItem,
} from '@/shared/components/drawer';

type RawMaterialDetailContentProps = {
  item: RawMaterial;
};

export function RawMaterialDetailContent({ item }: RawMaterialDetailContentProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const p = theme.palette.produza;
  const isActive = item.status === 'active';
  const unitOption = RAW_MATERIAL_UNIT_OPTIONS.find(
    (option) => option.value === item.unit
  );
  const unitLabel = unitOption ? t(unitOption.labelKey) : item.unit;

  const items: DetailBreakdownItem[] = [
    {
      id: 'code',
      primary: t('rawMaterials.drawer.code'),
      value: item.code,
    },
    {
      id: 'status',
      primary: t('rawMaterials.drawer.status'),
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
      primary: t('rawMaterials.drawer.unit'),
      value: unitLabel,
    },
    {
      id: 'minStock',
      primary: t('rawMaterials.drawer.minStock'),
      value: formatQuantity(item.minStock),
      valueSecondary: unitLabel,
    },
    {
      id: 'unitCost',
      primary: t('rawMaterials.drawer.unitCost'),
      value: formatCurrencyBrl(item.unitCost),
    },
    ...(item.createdAt
      ? [
          {
            id: 'createdAt',
            primary: t('rawMaterials.drawer.createdAt'),
            value: formatDateDisplay(item.createdAt),
          },
        ]
      : []),
    ...(item.updatedAt
      ? [
          {
            id: 'updatedAt',
            primary: t('rawMaterials.drawer.updatedAt'),
            value: formatDateDisplay(item.updatedAt),
          },
        ]
      : []),
  ];

  return (
    <DetailBreakdownList
      title={t('rawMaterials.drawer.sectionOverview')}
      items={items}
    />
  );
}

import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import type { RawMaterialGroup } from '@/features/groupings/types/grouping';
import {
  formatCurrencyBrl,
  formatQuantity,
} from '@/features/groupings/utils/format';
import {
  DetailBreakdownList,
  type DetailBreakdownItem,
} from '@/shared/components/drawer';

type GroupingDetailContentProps = {
  item: RawMaterialGroup;
};

export function GroupingDetailContent({ item }: GroupingDetailContentProps) {
  const { t } = useTranslation();

  const basics: DetailBreakdownItem[] = [
    {
      id: 'code',
      primary: t('groupings.drawer.code'),
      value: item.code,
    },
    ...(item.description
      ? [
          {
            id: 'description',
            primary: t('groupings.drawer.description'),
            value: item.description,
          },
        ]
      : []),
  ];

  const composition: DetailBreakdownItem[] = (item.lines ?? []).map((line) => {
    const material = line.rawMaterial;
    const unitCost = material?.unitCost ?? 0;
    const subtotal = unitCost * line.quantity;
    return {
      id: line.id,
      primary: material?.name ?? line.rawMaterialId,
      secondary: material?.code,
      value: `${formatQuantity(line.quantity)}${material?.unit ? ` ${material.unit}` : ''}`,
      valueSecondary: formatCurrencyBrl(subtotal),
    };
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <DetailBreakdownList
        title={t('groupings.drawer.sectionBasics')}
        items={basics}
      />
      {composition.length > 0 ? (
        <DetailBreakdownList
          title={t('groupings.drawer.sectionComposition')}
          items={composition}
        />
      ) : null}
    </Box>
  );
}

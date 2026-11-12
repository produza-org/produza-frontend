import { useTranslation } from 'react-i18next';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import type {
  NeedLineCategory,
  ProductionOrderNeedLine,
} from '@/features/production-orders/types/production-order';
import { formatQuantity } from '@/features/production-orders/utils/format';
import {
  CategoryBlockRoot,
  CategoryTitle,
  EmptyLines,
  NeedsBodyRow,
  NeedsCell,
  NeedsHeadCell,
  NeedsNumericCell,
  NeedsTable,
} from '@/features/production-orders/components/detail/ProductionOrderDetail.styled';

type NeedCategoryBlockProps = {
  category: NeedLineCategory;
  lines: ProductionOrderNeedLine[];
};

export function NeedCategoryBlock({ category, lines }: NeedCategoryBlockProps) {
  const { t } = useTranslation();

  return (
    <CategoryBlockRoot>
      <CategoryTitle>
        {t(`productionOrders.categories.${category}`)}
      </CategoryTitle>

      {lines.length === 0 ? (
        <EmptyLines>{t('productionOrders.detail.emptyCategory')}</EmptyLines>
      ) : (
        <NeedsTable>
          <TableHead>
            <TableRow>
              <NeedsHeadCell>{t('productionOrders.detail.colCode')}</NeedsHeadCell>
              <NeedsHeadCell>{t('productionOrders.detail.colName')}</NeedsHeadCell>
              <NeedsHeadCell sx={{ textAlign: 'right' }}>
                {t('productionOrders.detail.colConsumption')}
              </NeedsHeadCell>
              <NeedsHeadCell sx={{ textAlign: 'center' }}>
                {t('productionOrders.detail.colUnit')}
              </NeedsHeadCell>
              <NeedsHeadCell sx={{ textAlign: 'right' }}>
                {t('productionOrders.detail.colQtdLote')}
              </NeedsHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lines.map((line, index) => (
              <NeedsBodyRow key={line.id} $striped={index % 2 === 1}>
                <NeedsCell>{line.rawMaterialCode}</NeedsCell>
                <NeedsCell>{line.rawMaterialName}</NeedsCell>
                <NeedsNumericCell>
                  {formatQuantity(line.unitConsumptionSnapshot)}
                </NeedsNumericCell>
                <NeedsCell sx={{ textAlign: 'center' }}>{line.unit}</NeedsCell>
                <NeedsNumericCell>{formatQuantity(line.quantityE)}</NeedsNumericCell>
              </NeedsBodyRow>
            ))}
          </TableBody>
        </NeedsTable>
      )}
    </CategoryBlockRoot>
  );
}

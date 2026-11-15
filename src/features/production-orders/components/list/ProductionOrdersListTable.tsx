import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ActionsMenu, type ActionsMenuItem } from '@/shared/components/actions';
import type { ProductionOrder } from '@/features/production-orders/types/production-order';
import {
  formatDateDisplay,
  formatDecimal,
  formatQuantity,
} from '@/features/production-orders/utils/format';
import { ProductionOrdersTableFooter } from '@/features/production-orders/components/list/ProductionOrdersTableFooter';
import {
  ActionsCell,
  ActionsInner,
  BodyRow,
  DataTable,
  DateCell,
  HeadCell,
  NameCell,
  NumberCell,
  NumericCell,
  TableScroll,
  TableShell,
} from '@/features/production-orders/components/list/ProductionOrdersListTable.styled';

type ProductionOrdersListTableProps = {
  rows: ProductionOrder[];
  shown: number;
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  canPrev: boolean;
  canNext: boolean;
  onRowClick: (item: ProductionOrder) => void;
};

export function ProductionOrdersListTable({
  rows,
  shown,
  total,
  page,
  totalPages,
  onPageChange,
  canPrev,
  canNext,
  onRowClick,
}: ProductionOrdersListTableProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <TableShell>
      <TableScroll>
        <DataTable>
          <TableHead>
            <TableRow>
              <HeadCell>{t('productionOrders.table.colNumber')}</HeadCell>
              <HeadCell>{t('productionOrders.table.colProduct')}</HeadCell>
              <HeadCell sx={{ textAlign: 'right' }}>
                {t('productionOrders.table.colQ')}
              </HeadCell>
              <HeadCell sx={{ textAlign: 'right' }}>
                {t('productionOrders.table.colTotalMistura')}
              </HeadCell>
              <HeadCell>{t('productionOrders.table.colEmitidaEm')}</HeadCell>
              <HeadCell>{t('productionOrders.table.colStartDate')}</HeadCell>
              <HeadCell sx={{ textAlign: 'center' }}>
                {t('productionOrders.table.colActions')}
              </HeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => {
              const detailPath = `/production-orders/${row.id}`;
              const actionItems: ActionsMenuItem[] = [
                {
                  id: 'view',
                  label: t('productionOrders.table.viewAction'),
                  icon: <VisibilityOutlined sx={{ fontSize: 18 }} />,
                  onClick: () => navigate(detailPath),
                },
              ];

              return (
                <BodyRow
                  key={row.id}
                  $striped={index % 2 === 1}
                  onClick={() => onRowClick(row)}
                >
                  <NumberCell>{row.number}</NumberCell>
                  <NameCell>{row.product.name}</NameCell>
                  <NumericCell>{formatQuantity(row.qtdAProduzir)}</NumericCell>
                  <NumericCell>
                    {formatDecimal(row.totalMisturaKg, 6)}
                  </NumericCell>
                  <DateCell>{formatDateDisplay(row.emitidaEm)}</DateCell>
                  <DateCell>{formatDateDisplay(row.startDate)}</DateCell>
                  <ActionsCell
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                  >
                    <ActionsInner>
                      <ActionsMenu
                        ariaLabel={t('productionOrders.table.actionsMenuAria')}
                        items={actionItems}
                      />
                    </ActionsInner>
                  </ActionsCell>
                </BodyRow>
              );
            })}
          </TableBody>
        </DataTable>
      </TableScroll>
      <ProductionOrdersTableFooter
        shown={shown}
        total={total}
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        canPrev={canPrev}
        canNext={canNext}
      />
    </TableShell>
  );
}

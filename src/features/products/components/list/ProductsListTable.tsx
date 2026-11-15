import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import EditOutlined from '@mui/icons-material/EditOutlined';
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined';
import ToggleOffOutlined from '@mui/icons-material/ToggleOffOutlined';
import ToggleOnOutlined from '@mui/icons-material/ToggleOnOutlined';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ActionsMenu, type ActionsMenuItem } from '@/shared/components/actions';
import type { Product } from '@/features/products/types/product';
import { formatDecimal, formatQuantity } from '@/features/products/utils/format';
import { ProductsTableFooter } from '@/features/products/components/list/ProductsTableFooter';
import {
  ActionsCell,
  ActionsInner,
  BodyRow,
  DataTable,
  HeadCell,
  NameCell,
  NumericCell,
  StatusCell,
  StatusChip,
  TableScroll,
  TableShell,
  TotalCell,
  UnitCell,
} from '@/features/products/components/list/ProductsListTable.styled';

type ProductsListTableProps = {
  rows: Product[];
  shown: number;
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  canPrev: boolean;
  canNext: boolean;
  onDeleteRequest: (id: string) => void;
  onStatusToggleRequest: (id: string) => void;
  onRowClick: (item: Product) => void;
};

export function ProductsListTable({
  rows,
  shown,
  total,
  page,
  totalPages,
  onPageChange,
  canPrev,
  canNext,
  onDeleteRequest,
  onStatusToggleRequest,
  onRowClick,
}: ProductsListTableProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <TableShell>
      <TableScroll>
        <DataTable>
          <TableHead>
            <TableRow>
              <HeadCell>{t('products.table.colStatus')}</HeadCell>
              <HeadCell>{t('products.table.colName')}</HeadCell>
              <HeadCell sx={{ textAlign: 'right' }}>{t('products.table.colFinalSize')}</HeadCell>
              <HeadCell sx={{ textAlign: 'center' }}>{t('products.table.colUnit')}</HeadCell>
              <HeadCell sx={{ textAlign: 'right' }}>{t('products.table.colYield')}</HeadCell>
              <HeadCell sx={{ textAlign: 'right' }}>
                {t('products.table.colExpansionFactor')}
              </HeadCell>
              <HeadCell sx={{ textAlign: 'center' }}>{t('products.table.colActions')}</HeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => {
              const isActive = row.status === 'active';

              const actionItems: ActionsMenuItem[] = [
                {
                  id: 'edit',
                  label: t('products.table.editAction'),
                  icon: <EditOutlined sx={{ fontSize: 18 }} />,
                  onClick: () => navigate(`/products/${row.id}/edit`),
                },
                {
                  id: 'recipe',
                  label: t('products.recipe.editAction'),
                  icon: <MenuBookOutlined sx={{ fontSize: 18 }} />,
                  onClick: () => navigate(`/products/${row.id}/recipe`),
                },
                {
                  id: 'toggle-status',
                  label: isActive
                    ? t('products.table.deactivateAction')
                    : t('products.table.activateAction'),
                  icon: isActive ? (
                    <ToggleOffOutlined sx={{ fontSize: 18 }} />
                  ) : (
                    <ToggleOnOutlined sx={{ fontSize: 18 }} />
                  ),
                  onClick: () => onStatusToggleRequest(row.id),
                },
                {
                  id: 'delete',
                  label: t('products.table.deleteAction'),
                  icon: <DeleteOutline sx={{ fontSize: 18 }} />,
                  onClick: () => onDeleteRequest(row.id),
                  tone: 'danger',
                },
              ];

              return (
                <BodyRow
                  key={row.id}
                  $striped={index % 2 === 1}
                  onClick={() => onRowClick(row)}
                >
                  <StatusCell>
                    <StatusChip
                      $status={row.status}
                      label={t(`products.status.${row.status}`)}
                      size="small"
                    />
                  </StatusCell>
                  <NameCell>{row.name}</NameCell>
                  <NumericCell>{formatQuantity(row.finalSize)}</NumericCell>
                  <UnitCell>{row.finalSizeUnit}</UnitCell>
                  <NumericCell>{formatDecimal(row.yield, 6)}</NumericCell>
                  <TotalCell>{formatDecimal(row.expansionFactor, 6)}</TotalCell>
                  <ActionsCell
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                  >
                    <ActionsInner>
                      <ActionsMenu
                        ariaLabel={t('products.table.actionsMenuAria')}
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
      <ProductsTableFooter
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

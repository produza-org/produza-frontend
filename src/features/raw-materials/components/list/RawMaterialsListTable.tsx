import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import EditOutlined from '@mui/icons-material/EditOutlined';
import ToggleOffOutlined from '@mui/icons-material/ToggleOffOutlined';
import ToggleOnOutlined from '@mui/icons-material/ToggleOnOutlined';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ActionsMenu, type ActionsMenuItem } from '@/shared/components/actions';
import type { RawMaterial } from '@/features/raw-materials/types/raw-material';
import { formatCurrencyBrl, formatQuantity } from '@/features/raw-materials/utils/format';
import { RawMaterialsTableFooter } from '@/features/raw-materials/components/list/RawMaterialsTableFooter';
import { getStockStatus } from '@/features/raw-materials/utils/list/stock-status';
import {
  ActionsCell,
  ActionsInner,
  BodyRow,
  CodeCell,
  DataTable,
  HeadCell,
  NameCell,
  NumericCell,
  StatusCell,
  StatusChip,
  StockQtyCell,
  TableScroll,
  TableShell,
  TotalCell,
  UnitCell,
} from '@/features/raw-materials/components/list/RawMaterialsListTable.styled';

type RawMaterialsListTableProps = {
  rows: RawMaterial[];
  shown: number;
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  canPrev: boolean;
  canNext: boolean;
  onDeleteRequest: (id: string) => void;
  onStatusToggleRequest: (id: string) => void;
  onRowClick: (item: RawMaterial) => void;
};

export function RawMaterialsListTable({
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
}: RawMaterialsListTableProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <TableShell>
      <TableScroll>
        <DataTable>
          <TableHead>
            <TableRow>
              <HeadCell>{t('rawMaterials.table.colCode')}</HeadCell>
              <HeadCell>{t('rawMaterials.table.colStatus')}</HeadCell>
              <HeadCell>{t('rawMaterials.table.colName')}</HeadCell>
              <HeadCell sx={{ textAlign: 'right' }}>{t('rawMaterials.table.colQty')}</HeadCell>
              <HeadCell sx={{ textAlign: 'right' }}>{t('rawMaterials.table.colMinStock')}</HeadCell>
              <HeadCell sx={{ textAlign: 'center' }}>{t('rawMaterials.table.colUnit')}</HeadCell>
              <HeadCell sx={{ textAlign: 'right' }}>{t('rawMaterials.table.colUnitBrl')}</HeadCell>
              <HeadCell sx={{ textAlign: 'right' }}>{t('rawMaterials.table.colTotalBrl')}</HeadCell>
              <HeadCell sx={{ textAlign: 'center' }}>{t('rawMaterials.table.colActions')}</HeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => {
              const stockStatus = getStockStatus(row.stockQuantity, row.minStock);
              const isActive = row.status === 'active';

              const actionItems: ActionsMenuItem[] = [
                {
                  id: 'edit',
                  label: t('rawMaterials.table.editAction'),
                  icon: <EditOutlined sx={{ fontSize: 18 }} />,
                  onClick: () => navigate(`/raw-materials/${row.id}/edit`),
                },
                {
                  id: 'toggle-status',
                  label: isActive
                    ? t('rawMaterials.table.deactivateAction')
                    : t('rawMaterials.table.activateAction'),
                  icon: isActive ? (
                    <ToggleOffOutlined sx={{ fontSize: 18 }} />
                  ) : (
                    <ToggleOnOutlined sx={{ fontSize: 18 }} />
                  ),
                  onClick: () => onStatusToggleRequest(row.id),
                },
                {
                  id: 'delete',
                  label: t('rawMaterials.table.deleteAction'),
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
                  <CodeCell>{row.code}</CodeCell>
                  <StatusCell>
                    <StatusChip
                      $status={row.status}
                      label={t(`rawMaterials.status.${row.status}`)}
                      size="small"
                    />
                  </StatusCell>
                  <NameCell>{row.name}</NameCell>
                  <StockQtyCell
                    $status={stockStatus}
                    title={t(`rawMaterials.table.stockStatus.${stockStatus}`)}
                    aria-label={`${formatQuantity(row.stockQuantity)} — ${t(`rawMaterials.table.stockStatus.${stockStatus}`)}`}
                  >
                    {formatQuantity(row.stockQuantity)}
                  </StockQtyCell>
                  <NumericCell>{formatQuantity(row.minStock)}</NumericCell>
                  <UnitCell>{row.unit}</UnitCell>
                  <NumericCell>{formatCurrencyBrl(row.unitCost)}</NumericCell>
                  <TotalCell>{formatCurrencyBrl(row.totalCost)}</TotalCell>
                  <ActionsCell
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                  >
                    <ActionsInner>
                      <ActionsMenu
                        ariaLabel={t('rawMaterials.table.actionsMenuAria')}
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
      <RawMaterialsTableFooter
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

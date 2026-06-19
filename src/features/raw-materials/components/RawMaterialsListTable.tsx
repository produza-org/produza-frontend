import { useTranslation } from 'react-i18next';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import EditOutlined from '@mui/icons-material/EditOutlined';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import type { RawMaterial } from '@/features/raw-materials/types/raw-material';
import { formatCurrencyBrl, formatQuantity } from '@/features/raw-materials/format';
import { RawMaterialsTableFooter } from '@/features/raw-materials/components/RawMaterialsTableFooter';
import {
  ActionsCell,
  ActionsInner,
  BodyRow,
  CodeCell,
  DataTable,
  DeleteActionButton,
  EditActionButton,
  HeadCell,
  NameCell,
  NumericCell,
  TableScroll,
  TableShell,
  TotalCell,
  UnitCell,
} from '@/features/raw-materials/components/RawMaterialsListTable.styled';

type RawMaterialsListTableProps = {
  rows: RawMaterial[];
};

const TOTAL_MOCK = 124;

export function RawMaterialsListTable({ rows }: RawMaterialsListTableProps) {
  const { t } = useTranslation();

  return (
    <TableShell>
      <TableScroll>
        <DataTable>
          <TableHead>
            <TableRow>
              <HeadCell>{t('rawMaterials.table.colCode')}</HeadCell>
              <HeadCell>{t('rawMaterials.table.colName')}</HeadCell>
              <HeadCell sx={{ textAlign: 'right' }}>{t('rawMaterials.table.colQty')}</HeadCell>
              <HeadCell sx={{ textAlign: 'center' }}>{t('rawMaterials.table.colUnit')}</HeadCell>
              <HeadCell sx={{ textAlign: 'right' }}>{t('rawMaterials.table.colUnitBrl')}</HeadCell>
              <HeadCell sx={{ textAlign: 'right' }}>{t('rawMaterials.table.colTotalBrl')}</HeadCell>
              <HeadCell sx={{ textAlign: 'center' }}>{t('rawMaterials.table.colActions')}</HeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <BodyRow key={row.id} $striped={index % 2 === 1}>
                <CodeCell>{row.code}</CodeCell>
                <NameCell>{row.name}</NameCell>
                <NumericCell>{formatQuantity(row.stockQuantity)}</NumericCell>
                <UnitCell>{row.unit}</UnitCell>
                <NumericCell>{formatCurrencyBrl(row.unitCost)}</NumericCell>
                <TotalCell>{formatCurrencyBrl(row.totalCost)}</TotalCell>
                <ActionsCell>
                  <ActionsInner>
                    <EditActionButton size="small" aria-label={t('rawMaterials.table.editAria')}>
                      <EditOutlined sx={{ fontSize: 18 }} />
                    </EditActionButton>
                    <DeleteActionButton size="small" aria-label={t('rawMaterials.table.deleteAria')}>
                      <DeleteOutline sx={{ fontSize: 18 }} />
                    </DeleteActionButton>
                  </ActionsInner>
                </ActionsCell>
              </BodyRow>
            ))}
          </TableBody>
        </DataTable>
      </TableScroll>
      <RawMaterialsTableFooter shown={rows.length} total={TOTAL_MOCK} />
    </TableShell>
  );
}

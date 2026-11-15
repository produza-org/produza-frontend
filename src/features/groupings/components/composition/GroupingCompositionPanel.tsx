import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddOutlined from '@mui/icons-material/AddOutlined';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import Alert from '@mui/material/Alert';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { RawMaterialSelectModal } from '@/features/groupings/components/composition/RawMaterialSelectModal';
import {
  AddItemButton,
  BodyCell,
  DataTable,
  EmptyHint,
  HeadCell,
  MaterialCode,
  PanelRoot,
  PanelToolbar,
  QtyInput,
  RemoveButton,
  TableScroll,
  TableShell,
  TotalBar,
  TotalLabel,
  TotalValue,
} from '@/features/groupings/components/composition/GroupingCompositionPanel.styled';
import {
  getDraftTotalCost,
  getLineSubtotal,
  mergeDraftLines,
  type GroupingDraftLine,
} from '@/features/groupings/utils/composition/draft-lines';
import {
  formatCurrencyBrl,
  sanitizeDecimalInput,
} from '@/features/groupings/utils/format';
import type { RawMaterial } from '@/features/raw-materials/types/raw-material';

type GroupingCompositionPanelProps = {
  materials: RawMaterial[];
  lines: GroupingDraftLine[];
  onChange: (lines: GroupingDraftLine[]) => void;
  errorMessage?: string | null;
};

export function GroupingCompositionPanel({
  materials,
  lines,
  onChange,
  errorMessage = null,
}: GroupingCompositionPanelProps) {
  const { t } = useTranslation();
  const [pickerOpen, setPickerOpen] = useState(false);

  const displayError =
    errorMessage === 'UNEXPECTED'
      ? t('groupings.errors.unexpected')
      : errorMessage;

  const totalCost = getDraftTotalCost(lines);

  function updateQuantity(key: string, quantityDisplay: string) {
    onChange(
      lines.map((line) =>
        line.key === key
          ? { ...line, quantityDisplay: sanitizeDecimalInput(quantityDisplay) }
          : line
      )
    );
  }

  function removeLine(key: string) {
    onChange(lines.filter((line) => line.key !== key));
  }

  return (
    <PanelRoot>
      {displayError ? (
        <Alert severity="error" role="alert">
          {displayError}
        </Alert>
      ) : null}

      <PanelToolbar>
        <TotalLabel>{t('groupings.composition.hint')}</TotalLabel>
        <AddItemButton
          type="button"
          variant="contained"
          disableElevation
          startIcon={<AddOutlined />}
          onClick={() => setPickerOpen(true)}
        >
          {t('groupings.composition.addItem')}
        </AddItemButton>
      </PanelToolbar>

      <TableShell>
        <TableScroll>
          <DataTable>
            <TableHead>
              <TableRow>
                <HeadCell>{t('groupings.composition.colSku')}</HeadCell>
                <HeadCell>{t('groupings.composition.colUnit')}</HeadCell>
                <HeadCell sx={{ textAlign: 'right' }}>
                  {t('groupings.composition.colQty')}
                </HeadCell>
                <HeadCell sx={{ textAlign: 'right' }}>
                  {t('groupings.composition.colUnitCost')}
                </HeadCell>
                <HeadCell sx={{ textAlign: 'right' }}>
                  {t('groupings.composition.colSubtotal')}
                </HeadCell>
                <HeadCell sx={{ textAlign: 'center' }}>
                  {t('groupings.composition.colActions')}
                </HeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lines.length === 0 ? (
                <TableRow>
                  <BodyCell colSpan={6}>
                    <EmptyHint>{t('groupings.composition.empty')}</EmptyHint>
                  </BodyCell>
                </TableRow>
              ) : (
                lines.map((line) => (
                  <TableRow key={line.key}>
                    <BodyCell>
                      <div>{line.name}</div>
                      <MaterialCode>{line.code}</MaterialCode>
                    </BodyCell>
                    <BodyCell>{line.unit}</BodyCell>
                    <BodyCell sx={{ textAlign: 'right' }}>
                      <QtyInput
                        aria-label={t('groupings.composition.qtyAria', {
                          name: line.name,
                        })}
                        value={line.quantityDisplay}
                        onChange={(event) =>
                          updateQuantity(line.key, event.target.value)
                        }
                        inputMode="decimal"
                      />
                    </BodyCell>
                    <BodyCell sx={{ textAlign: 'right' }}>
                      {formatCurrencyBrl(line.unitCost)}
                    </BodyCell>
                    <BodyCell sx={{ textAlign: 'right' }}>
                      {formatCurrencyBrl(getLineSubtotal(line))}
                    </BodyCell>
                    <BodyCell sx={{ textAlign: 'center' }}>
                      <RemoveButton
                        size="small"
                        aria-label={t('groupings.composition.removeLine')}
                        onClick={() => removeLine(line.key)}
                      >
                        <DeleteOutline fontSize="small" />
                      </RemoveButton>
                    </BodyCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </DataTable>
        </TableScroll>
      </TableShell>

      <TotalBar>
        <TotalLabel>{t('groupings.composition.total')}</TotalLabel>
        <TotalValue>{formatCurrencyBrl(totalCost)}</TotalValue>
      </TotalBar>

      <RawMaterialSelectModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        materials={materials}
        onConfirm={(selected) => {
          onChange(mergeDraftLines(lines, selected));
          setPickerOpen(false);
        }}
      />
    </PanelRoot>
  );
}

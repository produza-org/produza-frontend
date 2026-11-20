import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddOutlined from '@mui/icons-material/AddOutlined';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import FormHelperText from '@mui/material/FormHelperText';
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
  QtyErrorText,
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
  GROUPING_COMPOSITION_ROOT_ID,
  groupingQtyFieldId,
} from '@/features/groupings/utils/composition/validate-composition';
import {
  formatCurrencyBrl,
  sanitizeDecimalInput,
} from '@/features/groupings/utils/format';
import type { RawMaterial } from '@/features/raw-materials/types/raw-material';
import { useFormValidation } from '@/shared/form-validation';

type GroupingCompositionPanelProps = {
  materials: RawMaterial[];
  lines: GroupingDraftLine[];
  onChange: (lines: GroupingDraftLine[]) => void;
};

export function GroupingCompositionPanel({
  materials,
  lines,
  onChange,
}: GroupingCompositionPanelProps) {
  const { t } = useTranslation();
  const { getError, clearField, clearErrors } = useFormValidation();
  const [pickerOpen, setPickerOpen] = useState(false);
  const rootError = getError(GROUPING_COMPOSITION_ROOT_ID);

  const totalCost = getDraftTotalCost(lines);

  function updateQuantity(key: string, quantityDisplay: string) {
    clearField(groupingQtyFieldId(key));
    onChange(
      lines.map((line) =>
        line.key === key
          ? { ...line, quantityDisplay: sanitizeDecimalInput(quantityDisplay) }
          : line
      )
    );
  }

  function removeLine(key: string) {
    clearErrors();
    onChange(lines.filter((line) => line.key !== key));
  }

  return (
    <PanelRoot id={GROUPING_COMPOSITION_ROOT_ID} tabIndex={-1}>
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

      {rootError ? <FormHelperText error>{rootError}</FormHelperText> : null}

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
                lines.map((line) => {
                  const qtyId = groupingQtyFieldId(line.key);
                  const qtyError = getError(qtyId);
                  return (
                    <TableRow key={line.key}>
                      <BodyCell>
                        <div>{line.name}</div>
                        <MaterialCode>{line.code}</MaterialCode>
                      </BodyCell>
                      <BodyCell>{line.unit}</BodyCell>
                      <BodyCell sx={{ textAlign: 'right' }}>
                        <QtyInput
                          id={qtyId}
                          aria-label={t('groupings.composition.qtyAria', {
                            name: line.name,
                          })}
                          value={line.quantityDisplay}
                          onChange={(event) =>
                            updateQuantity(line.key, event.target.value)
                          }
                          inputMode="decimal"
                          $error={Boolean(qtyError)}
                        />
                        {qtyError ? <QtyErrorText>{qtyError}</QtyErrorText> : null}
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
                  );
                })
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
          clearField(GROUPING_COMPOSITION_ROOT_ID);
          onChange(mergeDraftLines(lines, selected));
          setPickerOpen(false);
        }}
      />
    </PanelRoot>
  );
}

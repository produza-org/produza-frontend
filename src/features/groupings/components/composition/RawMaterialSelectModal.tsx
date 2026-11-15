import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import Checkbox from '@mui/material/Checkbox';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import { GROUPING_MODAL_PAGE_SIZE } from '@/features/groupings/constants';
import {
  BodyCell,
  CancelButton,
  CloseButton,
  ConfirmButton,
  DataTable,
  FooterActions,
  HeadCell,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalSubtitle,
  ModalTitle,
  PagerButton,
  PagerRow,
  QtyInput,
  SearchFieldWrap,
  SelectDialog,
  SelectedCount,
  TableScroll,
  TableShell,
} from '@/features/groupings/components/composition/RawMaterialSelectModal.styled';
import {
  formatQuantity,
  sanitizeDecimalInput,
} from '@/features/groupings/utils/format';
import type { RawMaterial } from '@/features/raw-materials/types/raw-material';

export type RawMaterialSelectEntry = {
  material: RawMaterial;
  quantityDisplay: string;
};

type RawMaterialSelectModalProps = {
  open: boolean;
  onClose: () => void;
  materials: RawMaterial[];
  onConfirm: (selected: RawMaterialSelectEntry[]) => void;
};

type SelectionState = Record<string, { checked: boolean; quantityDisplay: string }>;

export function RawMaterialSelectModal({
  open,
  onClose,
  materials,
  onConfirm,
}: RawMaterialSelectModalProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selection, setSelection] = useState<SelectionState>({});

  useEffect(() => {
    if (!open) {
      return;
    }
    setSearch('');
    setPage(1);
    setSelection({});
  }, [open]);

  const activeMaterials = useMemo(
    () => materials.filter((material) => material.status === 'active'),
    [materials]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return activeMaterials;
    }
    return activeMaterials.filter(
      (material) =>
        material.name.toLowerCase().includes(query) ||
        material.code.toLowerCase().includes(query)
    );
  }, [activeMaterials, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / GROUPING_MODAL_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = useMemo(() => {
    const start = (safePage - 1) * GROUPING_MODAL_PAGE_SIZE;
    return filtered.slice(start, start + GROUPING_MODAL_PAGE_SIZE);
  }, [filtered, safePage]);

  const selectedCount = useMemo(
    () => Object.values(selection).filter((entry) => entry.checked).length,
    [selection]
  );

  function toggleMaterial(material: RawMaterial, checked: boolean) {
    setSelection((prev) => ({
      ...prev,
      [material.id]: {
        checked,
        quantityDisplay: prev[material.id]?.quantityDisplay ?? '1',
      },
    }));
  }

  function updateQuantity(materialId: string, quantityDisplay: string) {
    setSelection((prev) => ({
      ...prev,
      [materialId]: {
        checked: prev[materialId]?.checked ?? false,
        quantityDisplay: sanitizeDecimalInput(quantityDisplay),
      },
    }));
  }

  function handleConfirm() {
    const selected: RawMaterialSelectEntry[] = [];
    for (const material of activeMaterials) {
      const entry = selection[material.id];
      if (!entry?.checked) {
        continue;
      }
      const quantity = entry.quantityDisplay.trim() || '1';
      selected.push({
        material,
        quantityDisplay: quantity,
      });
    }
    onConfirm(selected);
  }

  return (
    <SelectDialog open={open} onClose={onClose} fullWidth>
      <ModalHeader>
        <div>
          <ModalTitle id="grouping-mp-select-title">
            {t('groupings.picker.title')}
          </ModalTitle>
          <ModalSubtitle>{t('groupings.picker.subtitle')}</ModalSubtitle>
        </div>
        <CloseButton aria-label={t('groupings.picker.closeAria')} onClick={onClose}>
          <CloseOutlined />
        </CloseButton>
      </ModalHeader>

      <ModalBody>
        <SearchFieldWrap>
          <TextField
            id="grouping-mp-search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder={t('groupings.picker.searchPlaceholder')}
            fullWidth
            size="small"
            hiddenLabel
          />
        </SearchFieldWrap>

        <TableShell>
          <TableScroll>
            <DataTable>
              <TableHead>
                <TableRow>
                  <HeadCell padding="checkbox" />
                  <HeadCell>{t('groupings.picker.colMaterial')}</HeadCell>
                  <HeadCell sx={{ textAlign: 'right' }}>
                    {t('groupings.picker.colQty')}
                  </HeadCell>
                  <HeadCell sx={{ textAlign: 'right' }}>
                    {t('groupings.picker.colStock')}
                  </HeadCell>
                  <HeadCell>{t('groupings.picker.colUnit')}</HeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pageRows.map((material) => {
                  const entry = selection[material.id];
                  const checked = Boolean(entry?.checked);
                  return (
                    <TableRow
                      key={material.id}
                      hover
                      selected={checked}
                      onClick={() => toggleMaterial(material, !checked)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <BodyCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={checked}
                          onChange={(event) =>
                            toggleMaterial(material, event.target.checked)
                          }
                          inputProps={{
                            'aria-label': t('groupings.picker.selectAria', {
                              name: material.name,
                            }),
                          }}
                        />
                      </BodyCell>
                      <BodyCell>
                        <div>{material.name}</div>
                        <ModalSubtitle sx={{ mt: 0.25 }}>{material.code}</ModalSubtitle>
                      </BodyCell>
                      <BodyCell
                        sx={{ textAlign: 'right' }}
                        onClick={(event) => event.stopPropagation()}
                      >
                        <QtyInput
                          disabled={!checked}
                          value={entry?.quantityDisplay ?? '1'}
                          onChange={(event) =>
                            updateQuantity(material.id, event.target.value)
                          }
                          inputMode="decimal"
                          aria-label={t('groupings.picker.qtyAria', {
                            name: material.name,
                          })}
                        />
                      </BodyCell>
                      <BodyCell sx={{ textAlign: 'right' }}>
                        {formatQuantity(material.stockQuantity)}
                      </BodyCell>
                      <BodyCell>{material.unit}</BodyCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </DataTable>
          </TableScroll>
          <PagerRow>
            <PagerButton
              size="small"
              variant="outlined"
              disabled={safePage <= 1}
              onClick={() => setPage(safePage - 1)}
            >
              {t('groupings.picker.pagerPrev')}
            </PagerButton>
            <SelectedCount>
              {t('groupings.picker.pagerPage', {
                page: safePage,
                totalPages,
              })}
            </SelectedCount>
            <PagerButton
              size="small"
              variant="outlined"
              disabled={safePage >= totalPages}
              onClick={() => setPage(safePage + 1)}
            >
              {t('groupings.picker.pagerNext')}
            </PagerButton>
          </PagerRow>
        </TableShell>
      </ModalBody>

      <ModalFooter>
        <SelectedCount>
          {t('groupings.picker.selectedCount', { count: selectedCount })}
        </SelectedCount>
        <FooterActions>
          <CancelButton type="button" onClick={onClose}>
            {t('groupings.picker.cancel')}
          </CancelButton>
          <ConfirmButton
            type="button"
            variant="contained"
            disableElevation
            disabled={selectedCount === 0}
            onClick={handleConfirm}
          >
            {t('groupings.picker.confirm')}
          </ConfirmButton>
        </FooterActions>
      </ModalFooter>
    </SelectDialog>
  );
}

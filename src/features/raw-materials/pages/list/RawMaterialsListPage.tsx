import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AddOutlined from '@mui/icons-material/AddOutlined';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { ConfirmModal } from '@/shared/components/dialog';
import { PageSubtitle, PageTitle } from '@/shared/components/page';
import { RawMaterialsStatCard } from '@/features/raw-materials/components/list/RawMaterialsStatCard';
import { RawMaterialsListFilters } from '@/features/raw-materials/components/list/RawMaterialsListFilters';
import { RawMaterialsListTable } from '@/features/raw-materials/components/list/RawMaterialsListTable';
import { useRawMaterialsContext } from '@/features/raw-materials/context/RawMaterialsContext';
import { formatCurrencyBrl } from '@/features/raw-materials/utils/format';
import { useRawMaterialsFilters } from '@/features/raw-materials/hooks/useRawMaterialsFilters';
import { useRawMaterialsList } from '@/features/raw-materials/hooks/useRawMaterialsList';
import { useRawMaterialsStats } from '@/features/raw-materials/hooks/useRawMaterialsStats';
import {
  AddMaterialButton,
  HeroRow,
  PageRoot,
  StatsGrid,
} from '@/features/raw-materials/pages/list/RawMaterialsListPage.styled';

export function RawMaterialsListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const p = theme.palette.produza;
  const { items, deleteRawMaterial, toggleRawMaterialStatus } = useRawMaterialsContext();
  const { nameFilter, codeFilter, setNameFilter, setCodeFilter } = useRawMaterialsFilters();
  const { rows, page, totalFiltered, totalPages, setPage, canPrev, canNext } =
    useRawMaterialsList();
  const { totalCount, totalCost, activePercent, criticalCount } = useRawMaterialsStats();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [pendingStatusToggleId, setPendingStatusToggleId] = useState<string | null>(null);

  const pendingToggleItem = useMemo(
    () => items.find((item) => item.id === pendingStatusToggleId) ?? null,
    [items, pendingStatusToggleId]
  );

  const handleCloseDeleteModal = () => {
    setPendingDeleteId(null);
  };

  const handleConfirmDelete = () => {
    if (pendingDeleteId) {
      deleteRawMaterial(pendingDeleteId);
    }
    setPendingDeleteId(null);
  };

  const handleCloseStatusToggleModal = () => {
    setPendingStatusToggleId(null);
  };

  const handleConfirmStatusToggle = () => {
    if (pendingStatusToggleId) {
      toggleRawMaterialStatus(pendingStatusToggleId);
    }
    setPendingStatusToggleId(null);
  };

  return (
    <PageRoot>
      <HeroRow>
        <Box>
          <PageTitle>{t('rawMaterials.list.title')}</PageTitle>
          <PageSubtitle>{t('rawMaterials.list.subtitle')}</PageSubtitle>
        </Box>
        <AddMaterialButton
          variant="contained"
          disableElevation
          startIcon={<AddOutlined />}
          aria-label={t('rawMaterials.list.addAria')}
          onClick={() => navigate('/raw-materials/new')}
        >
          {t('rawMaterials.list.add')}
        </AddMaterialButton>
      </HeroRow>

      <StatsGrid>
        <RawMaterialsStatCard
          accentColor={p.primary}
          label={t('rawMaterials.list.statTotal')}
          value={String(totalCount)}
        />
        <RawMaterialsStatCard
          accentColor={p.tertiaryFixedDim}
          label={t('rawMaterials.list.statCost')}
          value={formatCurrencyBrl(totalCost)}
        />
        <RawMaterialsStatCard
          accentColor={p.secondary}
          label={t('rawMaterials.list.statActive')}
          value={`${activePercent}%`}
        />
        <RawMaterialsStatCard
          accentColor={p.error}
          label={t('rawMaterials.list.statCritical')}
          value={String(criticalCount).padStart(2, '0')}
          valueErrorTone
        />
      </StatsGrid>

      <RawMaterialsListFilters
        nameFilter={nameFilter}
        codeFilter={codeFilter}
        onNameFilterChange={setNameFilter}
        onCodeFilterChange={setCodeFilter}
      />

      <RawMaterialsListTable
        rows={rows}
        shown={rows.length}
        total={totalFiltered}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        canPrev={canPrev}
        canNext={canNext}
        onDeleteRequest={setPendingDeleteId}
        onStatusToggleRequest={setPendingStatusToggleId}
      />

      <ConfirmModal
        open={pendingDeleteId !== null}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title={t('rawMaterials.delete.title')}
        message={t('rawMaterials.delete.message')}
        cancelLabel={t('rawMaterials.delete.cancel')}
        confirmLabel={t('rawMaterials.delete.confirm')}
      />

      <ConfirmModal
        open={pendingToggleItem !== null}
        onClose={handleCloseStatusToggleModal}
        onConfirm={handleConfirmStatusToggle}
        title={
          pendingToggleItem?.status === 'active'
            ? t('rawMaterials.statusToggle.deactivateTitle')
            : t('rawMaterials.statusToggle.activateTitle')
        }
        message={
          pendingToggleItem?.status === 'active'
            ? t('rawMaterials.statusToggle.deactivateMessage')
            : t('rawMaterials.statusToggle.activateMessage')
        }
        cancelLabel={t('rawMaterials.statusToggle.cancel')}
        confirmLabel={t('rawMaterials.statusToggle.confirm')}
      />
    </PageRoot>
  );
}

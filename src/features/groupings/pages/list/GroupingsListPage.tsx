import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AddOutlined from '@mui/icons-material/AddOutlined';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import { ApiError } from '@/core/api';
import { ConfirmModal } from '@/shared/components/dialog';
import { EntityDetailDrawer } from '@/shared/components/drawer';
import { PageSubtitle, PageTitle } from '@/shared/components/page';
import { useToast } from '@/shared/toast';
import { GroupingDetailContent } from '@/features/groupings/components/detail/GroupingDetailContent';
import { GroupingsListCards } from '@/features/groupings/components/list/GroupingsListCards';
import { GroupingsListFilters } from '@/features/groupings/components/list/GroupingsListFilters';
import { GroupingsStatCard } from '@/features/groupings/components/list/GroupingsStatCard';
import { useGroupingsContext } from '@/features/groupings/context/GroupingsContext';
import { useGroupingsFilters } from '@/features/groupings/hooks/useGroupingsFilters';
import { useGroupingsList } from '@/features/groupings/hooks/useGroupingsList';
import { useGroupingsStats } from '@/features/groupings/hooks/useGroupingsStats';
import type { RawMaterialGroup } from '@/features/groupings/types/grouping';
import { buildGroupingDrawerStats } from '@/features/groupings/utils/drawer-stats';
import { formatCurrencyBrl } from '@/features/groupings/utils/format';
import {
  AddGroupingButton,
  HeroRow,
  PageRoot,
  StatsGrid,
} from '@/features/groupings/pages/list/GroupingsListPage.styled';

function toToastError(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  return fallback;
}

export function GroupingsListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueToast } = useToast();
  const theme = useTheme();
  const p = theme.palette.produza;
  const { items, isLoading, errorMessage, deleteGrouping } = useGroupingsContext();
  const {
    nameFilter,
    codeFilter,
    rawMaterialFilter,
    setNameFilter,
    setCodeFilter,
    setRawMaterialFilter,
  } = useGroupingsFilters();
  const { rows, page, totalFiltered, totalPages, setPage, canPrev, canNext } =
    useGroupingsList();
  const { totalCount, activePercent, totalCost, totalMaterials } =
    useGroupingsStats();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<RawMaterialGroup | null>(null);
  const [isMutating, setIsMutating] = useState(false);

  const drawerItem = useMemo(() => {
    if (!selectedItem) {
      return null;
    }
    return items.find((item) => item.id === selectedItem.id) ?? selectedItem;
  }, [items, selectedItem]);

  const loadError =
    errorMessage === 'UNEXPECTED'
      ? t('groupings.errors.unexpected')
      : errorMessage;

  const handleCloseDeleteModal = () => {
    if (isMutating) {
      return;
    }
    setPendingDeleteId(null);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId || isMutating) {
      return;
    }
    setIsMutating(true);
    try {
      await deleteGrouping(pendingDeleteId);
      setPendingDeleteId(null);
      setSelectedItem(null);
      enqueueToast({
        severity: 'success',
        message: t('groupings.toasts.deleted'),
      });
    } catch (error) {
      enqueueToast({
        severity: 'error',
        message: toToastError(error, t('groupings.errors.unexpected')),
      });
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <PageRoot>
      <HeroRow>
        <Box>
          <PageTitle>{t('groupings.list.title')}</PageTitle>
          <PageSubtitle>{t('groupings.list.subtitle')}</PageSubtitle>
        </Box>
        <AddGroupingButton
          variant="contained"
          disableElevation
          startIcon={<AddOutlined />}
          aria-label={t('groupings.list.addAria')}
          onClick={() => navigate('/groupings/new')}
        >
          {t('groupings.list.add')}
        </AddGroupingButton>
      </HeroRow>

      {loadError ? (
        <Alert severity="error" role="alert" sx={{ mb: 2 }}>
          {loadError}
        </Alert>
      ) : null}

      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            py: 8,
          }}
        >
          <CircularProgress size={32} aria-label={t('groupings.list.loading')} />
        </Box>
      ) : (
        <>
          <StatsGrid>
            <GroupingsStatCard
              accentColor={p.primary}
              label={t('groupings.list.statTotal')}
              value={String(totalCount)}
            />
            <GroupingsStatCard
              accentColor={p.secondary}
              label={t('groupings.list.statActive')}
              value={`${activePercent}%`}
            />
            <GroupingsStatCard
              accentColor={p.tertiaryFixedDim}
              label={t('groupings.list.statMaterials')}
              value={String(totalMaterials)}
            />
            <GroupingsStatCard
              accentColor={p.primaryContainer}
              label={t('groupings.list.statCost')}
              value={formatCurrencyBrl(totalCost)}
            />
          </StatsGrid>

          <GroupingsListFilters
            nameFilter={nameFilter}
            codeFilter={codeFilter}
            rawMaterialFilter={rawMaterialFilter}
            onNameFilterChange={setNameFilter}
            onCodeFilterChange={setCodeFilter}
            onRawMaterialFilterChange={setRawMaterialFilter}
          />

          <GroupingsListCards
            rows={rows}
            shown={rows.length}
            total={totalFiltered}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            canPrev={canPrev}
            canNext={canNext}
            onDeleteRequest={setPendingDeleteId}
            onCardClick={setSelectedItem}
          />
        </>
      )}

      <EntityDetailDrawer
        open={drawerItem !== null}
        onClose={() => setSelectedItem(null)}
        eyebrow={t('groupings.drawer.eyebrow')}
        title={drawerItem?.name ?? t('groupings.drawer.title')}
        closeAriaLabel={t('groupings.drawer.closeAria')}
        stats={drawerItem ? buildGroupingDrawerStats(drawerItem, t) : []}
        editLabel={t('groupings.drawer.edit')}
        deleteLabel={t('groupings.drawer.delete')}
        onEdit={
          drawerItem
            ? () => {
                const id = drawerItem.id;
                setSelectedItem(null);
                navigate(`/groupings/${id}/edit`);
              }
            : undefined
        }
        onDelete={
          drawerItem
            ? () => {
                setPendingDeleteId(drawerItem.id);
              }
            : undefined
        }
      >
        {drawerItem ? <GroupingDetailContent item={drawerItem} /> : null}
      </EntityDetailDrawer>

      <ConfirmModal
        open={pendingDeleteId !== null}
        onClose={handleCloseDeleteModal}
        onConfirm={() => {
          void handleConfirmDelete();
        }}
        title={t('groupings.delete.title')}
        message={t('groupings.delete.message')}
        cancelLabel={t('groupings.delete.cancel')}
        confirmLabel={t('groupings.delete.confirm')}
        confirmLoading={isMutating}
      />
    </PageRoot>
  );
}

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AddOutlined from '@mui/icons-material/AddOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import { ApiError } from '@/core/api';
import { ConfirmModal } from '@/shared/components/dialog';
import { EntityDetailDrawer } from '@/shared/components/drawer';
import { PageSubtitle, PageTitle } from '@/shared/components/page';
import { useToast } from '@/shared/toast';
import { RawMaterialDetailContent } from '@/features/raw-materials/components/detail/RawMaterialDetailContent';
import { RawMaterialsStatCard } from '@/features/raw-materials/components/list/RawMaterialsStatCard';
import { RawMaterialsListFilters } from '@/features/raw-materials/components/list/RawMaterialsListFilters';
import { RawMaterialsListTable } from '@/features/raw-materials/components/list/RawMaterialsListTable';
import { useRawMaterialsContext } from '@/features/raw-materials/context/RawMaterialsContext';
import type { RawMaterial } from '@/features/raw-materials/types/raw-material';
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

function toToastError(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  return fallback;
}

export function RawMaterialsListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueToast } = useToast();
  const theme = useTheme();
  const p = theme.palette.produza;
  const {
    items,
    isLoading,
    errorMessage,
    deleteRawMaterial,
    toggleRawMaterialStatus,
  } = useRawMaterialsContext();
  const { nameFilter, codeFilter, setNameFilter, setCodeFilter } = useRawMaterialsFilters();
  const { rows, page, totalFiltered, totalPages, setPage, canPrev, canNext } =
    useRawMaterialsList();
  const { totalCount, totalCost, activePercent, criticalCount } = useRawMaterialsStats();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [pendingStatusToggleId, setPendingStatusToggleId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<RawMaterial | null>(null);
  const [isMutating, setIsMutating] = useState(false);

  const pendingToggleItem = useMemo(
    () => items.find((item) => item.id === pendingStatusToggleId) ?? null,
    [items, pendingStatusToggleId]
  );

  const drawerItem = useMemo(() => {
    if (!selectedItem) {
      return null;
    }
    return items.find((item) => item.id === selectedItem.id) ?? selectedItem;
  }, [items, selectedItem]);

  const loadError =
    errorMessage === 'UNEXPECTED'
      ? t('rawMaterials.errors.unexpected')
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
      await deleteRawMaterial(pendingDeleteId);
      setPendingDeleteId(null);
      enqueueToast({
        severity: 'success',
        message: t('rawMaterials.toasts.deleted'),
      });
    } catch (error) {
      enqueueToast({
        severity: 'error',
        message: toToastError(error, t('rawMaterials.errors.unexpected')),
      });
    } finally {
      setIsMutating(false);
    }
  };

  const handleCloseStatusToggleModal = () => {
    if (isMutating) {
      return;
    }
    setPendingStatusToggleId(null);
  };

  const handleConfirmStatusToggle = async () => {
    if (!pendingStatusToggleId || !pendingToggleItem || isMutating) {
      return;
    }
    const wasActive = pendingToggleItem.status === 'active';
    setIsMutating(true);
    try {
      await toggleRawMaterialStatus(pendingStatusToggleId);
      setPendingStatusToggleId(null);
      enqueueToast({
        severity: 'success',
        message: wasActive
          ? t('rawMaterials.toasts.deactivated')
          : t('rawMaterials.toasts.activated'),
      });
    } catch (error) {
      enqueueToast({
        severity: 'error',
        message: toToastError(error, t('rawMaterials.errors.unexpected')),
      });
    } finally {
      setIsMutating(false);
    }
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
          <CircularProgress size={32} aria-label={t('rawMaterials.list.loading')} />
        </Box>
      ) : (
        <>
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
            onRowClick={setSelectedItem}
          />
        </>
      )}

      <EntityDetailDrawer
        open={drawerItem !== null}
        onClose={() => setSelectedItem(null)}
        title={drawerItem?.name ?? t('rawMaterials.drawer.title')}
        subtitle={
          drawerItem
            ? t('rawMaterials.drawer.subtitle', { code: drawerItem.code })
            : undefined
        }
        closeAriaLabel={t('rawMaterials.drawer.closeAria')}
        footer={
          drawerItem ? (
            <Button
              variant="contained"
              disableElevation
              startIcon={<EditOutlined />}
              onClick={() => {
                const id = drawerItem.id;
                setSelectedItem(null);
                navigate(`/raw-materials/${id}/edit`);
              }}
              sx={{
                width: { xs: '100%', sm: 'auto' },
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 1.5,
                bgcolor: 'produza.primary',
                color: 'produza.onPrimary',
                '&:hover': { bgcolor: 'produza.primaryContainer' },
              }}
            >
              {t('rawMaterials.drawer.edit')}
            </Button>
          ) : null
        }
      >
        {drawerItem ? <RawMaterialDetailContent item={drawerItem} /> : null}
      </EntityDetailDrawer>

      <ConfirmModal
        open={pendingDeleteId !== null}
        onClose={handleCloseDeleteModal}
        onConfirm={() => {
          void handleConfirmDelete();
        }}
        title={t('rawMaterials.delete.title')}
        message={t('rawMaterials.delete.message')}
        cancelLabel={t('rawMaterials.delete.cancel')}
        confirmLabel={t('rawMaterials.delete.confirm')}
        confirmLoading={isMutating}
      />

      <ConfirmModal
        open={pendingToggleItem !== null}
        onClose={handleCloseStatusToggleModal}
        onConfirm={() => {
          void handleConfirmStatusToggle();
        }}
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
        confirmLoading={isMutating}
      />
    </PageRoot>
  );
}

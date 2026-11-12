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
import { PageSubtitle, PageTitle } from '@/shared/components/page';
import { ProductsStatCard } from '@/features/products/components/list/ProductsStatCard';
import { ProductsListFilters } from '@/features/products/components/list/ProductsListFilters';
import { ProductsListTable } from '@/features/products/components/list/ProductsListTable';
import { useProductsContext } from '@/features/products/context/ProductsContext';
import { formatDecimal } from '@/features/products/utils/format';
import { useProductsFilters } from '@/features/products/hooks/useProductsFilters';
import { useProductsList } from '@/features/products/hooks/useProductsList';
import { useProductsStats } from '@/features/products/hooks/useProductsStats';
import {
  AddProductButton,
  HeroRow,
  PageRoot,
  StatsGrid,
} from '@/features/products/pages/list/ProductsListPage.styled';

function toActionError(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  return 'UNEXPECTED';
}

export function ProductsListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const p = theme.palette.produza;
  const {
    items,
    isLoading,
    errorMessage,
    deleteProduct,
    toggleProductStatus,
  } = useProductsContext();
  const { nameFilter, setNameFilter } = useProductsFilters();
  const { rows, page, totalFiltered, totalPages, setPage, canPrev, canNext } =
    useProductsList();
  const { totalCount, activePercent, averageYield, averageExpansion } =
    useProductsStats();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [pendingStatusToggleId, setPendingStatusToggleId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isMutating, setIsMutating] = useState(false);

  const pendingToggleItem = useMemo(
    () => items.find((item) => item.id === pendingStatusToggleId) ?? null,
    [items, pendingStatusToggleId]
  );

  const loadError =
    errorMessage === 'UNEXPECTED'
      ? t('products.errors.unexpected')
      : errorMessage;

  const displayActionError =
    actionError === 'UNEXPECTED'
      ? t('products.errors.unexpected')
      : actionError;

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
    setActionError(null);
    try {
      await deleteProduct(pendingDeleteId);
      setPendingDeleteId(null);
    } catch (error) {
      setActionError(toActionError(error));
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
    if (!pendingStatusToggleId || isMutating) {
      return;
    }
    setIsMutating(true);
    setActionError(null);
    try {
      await toggleProductStatus(pendingStatusToggleId);
      setPendingStatusToggleId(null);
    } catch (error) {
      setActionError(toActionError(error));
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <PageRoot>
      <HeroRow>
        <Box>
          <PageTitle>{t('products.list.title')}</PageTitle>
          <PageSubtitle>{t('products.list.subtitle')}</PageSubtitle>
        </Box>
        <AddProductButton
          variant="contained"
          disableElevation
          startIcon={<AddOutlined />}
          aria-label={t('products.list.addAria')}
          onClick={() => navigate('/products/new')}
        >
          {t('products.list.add')}
        </AddProductButton>
      </HeroRow>

      {loadError ? (
        <Alert severity="error" role="alert" sx={{ mb: 2 }}>
          {loadError}
        </Alert>
      ) : null}

      {displayActionError ? (
        <Alert severity="error" role="alert" sx={{ mb: 2 }}>
          {displayActionError}
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
          <CircularProgress size={32} aria-label={t('products.list.loading')} />
        </Box>
      ) : (
        <>
          <StatsGrid>
            <ProductsStatCard
              accentColor={p.primary}
              label={t('products.list.statTotal')}
              value={String(totalCount)}
            />
            <ProductsStatCard
              accentColor={p.secondary}
              label={t('products.list.statActive')}
              value={`${activePercent}%`}
            />
            <ProductsStatCard
              accentColor={p.tertiaryFixedDim}
              label={t('products.list.statAvgYield')}
              value={formatDecimal(averageYield, 4)}
            />
            <ProductsStatCard
              accentColor={p.primaryContainer}
              label={t('products.list.statAvgExpansion')}
              value={formatDecimal(averageExpansion, 4)}
            />
          </StatsGrid>

          <ProductsListFilters
            nameFilter={nameFilter}
            onNameFilterChange={setNameFilter}
          />

          <ProductsListTable
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
        </>
      )}

      <ConfirmModal
        open={pendingDeleteId !== null}
        onClose={handleCloseDeleteModal}
        onConfirm={() => {
          void handleConfirmDelete();
        }}
        title={t('products.delete.title')}
        message={t('products.delete.message')}
        cancelLabel={t('products.delete.cancel')}
        confirmLabel={t('products.delete.confirm')}
        confirmDisabled={isMutating}
      />

      <ConfirmModal
        open={pendingToggleItem !== null}
        onClose={handleCloseStatusToggleModal}
        onConfirm={() => {
          void handleConfirmStatusToggle();
        }}
        title={
          pendingToggleItem?.status === 'active'
            ? t('products.statusToggle.deactivateTitle')
            : t('products.statusToggle.activateTitle')
        }
        message={
          pendingToggleItem?.status === 'active'
            ? t('products.statusToggle.deactivateMessage')
            : t('products.statusToggle.activateMessage')
        }
        cancelLabel={t('products.statusToggle.cancel')}
        confirmLabel={t('products.statusToggle.confirm')}
        confirmDisabled={isMutating}
      />
    </PageRoot>
  );
}

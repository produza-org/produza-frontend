import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AddOutlined from '@mui/icons-material/AddOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined';
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
import { ProductDetailContent } from '@/features/products/components/detail/ProductDetailContent';
import { ProductsStatCard } from '@/features/products/components/list/ProductsStatCard';
import { ProductsListFilters } from '@/features/products/components/list/ProductsListFilters';
import { ProductsListTable } from '@/features/products/components/list/ProductsListTable';
import { useProductsContext } from '@/features/products/context/ProductsContext';
import type { Product } from '@/features/products/types/product';
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

function toToastError(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  return fallback;
}

export function ProductsListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueToast } = useToast();
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
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
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
      ? t('products.errors.unexpected')
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
      await deleteProduct(pendingDeleteId);
      setPendingDeleteId(null);
      enqueueToast({
        severity: 'success',
        message: t('products.toasts.deleted'),
      });
    } catch (error) {
      enqueueToast({
        severity: 'error',
        message: toToastError(error, t('products.errors.unexpected')),
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
      await toggleProductStatus(pendingStatusToggleId);
      setPendingStatusToggleId(null);
      enqueueToast({
        severity: 'success',
        message: wasActive
          ? t('products.toasts.deactivated')
          : t('products.toasts.activated'),
      });
    } catch (error) {
      enqueueToast({
        severity: 'error',
        message: toToastError(error, t('products.errors.unexpected')),
      });
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
            onRowClick={setSelectedItem}
          />
        </>
      )}

      <EntityDetailDrawer
        open={drawerItem !== null}
        onClose={() => setSelectedItem(null)}
        title={drawerItem?.name ?? t('products.drawer.title')}
        subtitle={t('products.drawer.subtitle')}
        closeAriaLabel={t('products.drawer.closeAria')}
        footer={
          drawerItem ? (
            <>
              <Button
                variant="outlined"
                startIcon={<MenuBookOutlined />}
                onClick={() => {
                  const id = drawerItem.id;
                  setSelectedItem(null);
                  navigate(`/products/${id}/recipe`);
                }}
                sx={{
                  width: { xs: '100%', sm: 'auto' },
                  textTransform: 'none',
                  fontWeight: 700,
                  borderRadius: 1.5,
                  color: 'produza.secondary',
                  borderColor: 'produza.outlineVariant',
                  '&:hover': {
                    borderColor: 'produza.outlineVariant',
                    bgcolor: 'produza.surfaceContainerLow',
                  },
                }}
              >
                {t('products.drawer.recipe')}
              </Button>
              <Button
                variant="contained"
                disableElevation
                startIcon={<EditOutlined />}
                onClick={() => {
                  const id = drawerItem.id;
                  setSelectedItem(null);
                  navigate(`/products/${id}/edit`);
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
                {t('products.drawer.edit')}
              </Button>
            </>
          ) : null
        }
      >
        {drawerItem ? <ProductDetailContent item={drawerItem} /> : null}
      </EntityDetailDrawer>

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
        confirmLoading={isMutating}
      />
    </PageRoot>
  );
}

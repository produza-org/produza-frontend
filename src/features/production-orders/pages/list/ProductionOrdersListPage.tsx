import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AddOutlined from '@mui/icons-material/AddOutlined';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import { ApiError } from '@/core/api';
import { ConfirmModal } from '@/shared/components/dialog';
import { EntityDetailDrawer, DrawerLoadingBox } from '@/shared/components/drawer';
import { PageSubtitle, PageTitle } from '@/shared/components/page';
import { useToast } from '@/shared/toast';
import { getProductionOrder } from '@/features/production-orders/api/get';
import { ProductionOrdersListFilters } from '@/features/production-orders/components/list/ProductionOrdersListFilters';
import { ProductionOrdersListTable } from '@/features/production-orders/components/list/ProductionOrdersListTable';
import { ProductionOrdersStatCard } from '@/features/production-orders/components/list/ProductionOrdersStatCard';
import { ProductionOrderDrawerContent } from '@/features/production-orders/components/detail/ProductionOrderDrawerContent';
import { useProductionOrdersContext } from '@/features/production-orders/context/ProductionOrdersContext';
import { useProductionOrdersFilters } from '@/features/production-orders/hooks/useProductionOrdersFilters';
import { useProductionOrdersList } from '@/features/production-orders/hooks/useProductionOrdersList';
import { useProductionOrdersStats } from '@/features/production-orders/hooks/useProductionOrdersStats';
import type { ProductionOrder } from '@/features/production-orders/types/production-order';
import {
  formatDecimal,
  formatQuantity,
} from '@/features/production-orders/utils/format';
import { buildProductionOrderDrawerStats } from '@/features/production-orders/utils/drawer-stats';
import {
  AddOrderButton,
  HeroRow,
  PageRoot,
  StatsGrid,
} from '@/features/production-orders/pages/list/ProductionOrdersListPage.styled';

function toToastError(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  return fallback;
}

export function ProductionOrdersListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueToast } = useToast();
  const theme = useTheme();
  const p = theme.palette.produza;
  const { isLoading, errorMessage, deleteProductionOrder } =
    useProductionOrdersContext();
  const { numberFilter, setNumberFilter } = useProductionOrdersFilters();
  const { rows, page, totalFiltered, totalPages, setPage, canPrev, canNext } =
    useProductionOrdersList();
  const { totalCount, totalMisturaSum, averageQ } = useProductionOrdersStats();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drawerOrder, setDrawerOrder] = useState<ProductionOrder | null>(null);
  const [isDrawerLoading, setIsDrawerLoading] = useState(false);
  const [drawerError, setDrawerError] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isMutating, setIsMutating] = useState(false);

  const loadError =
    errorMessage === 'UNEXPECTED'
      ? t('productionOrders.errors.unexpected')
      : errorMessage;

  useEffect(() => {
    if (!selectedId) {
      setDrawerOrder(null);
      setDrawerError(null);
      setIsDrawerLoading(false);
      return;
    }

    let cancelled = false;
    setDrawerOrder((current) =>
      current?.id === selectedId
        ? current
        : (rows.find((row) => row.id === selectedId) ?? null)
    );
    setIsDrawerLoading(true);
    setDrawerError(null);

    void getProductionOrder(selectedId)
      .then((order) => {
        if (cancelled) {
          return;
        }
        setDrawerOrder(order);
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }
        const message =
          error instanceof ApiError
            ? error.message
            : t('productionOrders.errors.unexpected');
        setDrawerError(message);
      })
      .finally(() => {
        if (!cancelled) {
          setIsDrawerLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedId, rows, t]);

  const handleCloseDrawer = () => {
    setSelectedId(null);
  };

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
      await deleteProductionOrder(pendingDeleteId);
      setPendingDeleteId(null);
      if (selectedId === pendingDeleteId) {
        handleCloseDrawer();
      }
      enqueueToast({
        severity: 'success',
        message: t('productionOrders.toasts.deleted'),
      });
    } catch (error) {
      enqueueToast({
        severity: 'error',
        message: toToastError(error, t('productionOrders.errors.unexpected')),
      });
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <PageRoot>
      <HeroRow>
        <Box>
          <PageTitle>{t('productionOrders.list.title')}</PageTitle>
          <PageSubtitle>{t('productionOrders.list.subtitle')}</PageSubtitle>
        </Box>
        <AddOrderButton
          variant="contained"
          disableElevation
          startIcon={<AddOutlined />}
          aria-label={t('productionOrders.list.addAria')}
          onClick={() => navigate('/production-orders/new')}
        >
          {t('productionOrders.list.add')}
        </AddOrderButton>
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
          <CircularProgress
            size={32}
            aria-label={t('productionOrders.list.loading')}
          />
        </Box>
      ) : (
        <>
          <StatsGrid>
            <ProductionOrdersStatCard
              accentColor={p.primary}
              label={t('productionOrders.list.statTotal')}
              value={String(totalCount)}
            />
            <ProductionOrdersStatCard
              accentColor={p.secondary}
              label={t('productionOrders.list.statAvgQ')}
              value={formatQuantity(averageQ)}
            />
            <ProductionOrdersStatCard
              accentColor={p.tertiaryFixedDim}
              label={t('productionOrders.list.statTotalMistura')}
              value={formatDecimal(totalMisturaSum, 4)}
            />
          </StatsGrid>

          <ProductionOrdersListFilters
            numberFilter={numberFilter}
            onNumberFilterChange={setNumberFilter}
          />

          <ProductionOrdersListTable
            rows={rows}
            shown={rows.length}
            total={totalFiltered}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            canPrev={canPrev}
            canNext={canNext}
            onRowClick={(item) => setSelectedId(item.id)}
            onDeleteRequest={setPendingDeleteId}
          />
        </>
      )}

      <EntityDetailDrawer
        open={selectedId !== null}
        onClose={handleCloseDrawer}
        eyebrow={t('productionOrders.drawer.eyebrow')}
        title={
          drawerOrder?.product.name ??
          (drawerOrder
            ? t('productionOrders.drawer.title', { number: drawerOrder.number })
            : t('productionOrders.drawer.titleFallback'))
        }
        closeAriaLabel={t('productionOrders.drawer.closeAria')}
        stats={
          drawerOrder ? buildProductionOrderDrawerStats(drawerOrder, t) : []
        }
        editLabel={t('productionOrders.drawer.edit')}
        deleteLabel={t('productionOrders.drawer.delete')}
        onEdit={
          selectedId
            ? () => {
                const id = selectedId;
                handleCloseDrawer();
                navigate(`/production-orders/${id}`);
              }
            : undefined
        }
        onDelete={
          selectedId
            ? () => {
                setPendingDeleteId(selectedId);
              }
            : undefined
        }
      >
        {isDrawerLoading && !drawerOrder ? (
          <DrawerLoadingBox>
            <CircularProgress
              size={32}
              aria-label={t('productionOrders.drawer.loading')}
            />
          </DrawerLoadingBox>
        ) : null}
        {drawerError && !drawerOrder ? (
          <Alert severity="error" role="alert">
            {drawerError}
          </Alert>
        ) : null}
        {drawerOrder ? <ProductionOrderDrawerContent item={drawerOrder} /> : null}
      </EntityDetailDrawer>

      <ConfirmModal
        open={pendingDeleteId !== null}
        onClose={handleCloseDeleteModal}
        onConfirm={() => {
          void handleConfirmDelete();
        }}
        title={t('productionOrders.delete.title')}
        message={t('productionOrders.delete.message')}
        cancelLabel={t('productionOrders.delete.cancel')}
        confirmLabel={t('productionOrders.delete.confirm')}
        confirmLoading={isMutating}
      />
    </PageRoot>
  );
}

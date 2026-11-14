import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { ApiError } from '@/core/api';
import { PageSubtitle, PageTitle } from '@/shared/components/page';
import { useToast } from '@/shared/toast';
import { getProductionOrder } from '@/features/production-orders/api';
import { ProductionOrderDetail } from '@/features/production-orders/components/detail/ProductionOrderDetail';
import { useProductionOrdersContext } from '@/features/production-orders/context/ProductionOrdersContext';
import type {
  ProductionOrder,
  ProductionStepInput,
} from '@/features/production-orders/types/production-order';
import {
  PageHeader,
  PageRoot,
} from '@/features/production-orders/pages/ProductionOrderFormPage.styled';

function toToastError(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  return fallback;
}

export function ProductionOrderDetailPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueToast } = useToast();
  const { id } = useParams<{ id: string }>();
  const {
    updateProductionOrder,
    updateProductionOrderSteps,
    recalculateFromRecipe,
    upsertLocalOrder,
  } = useProductionOrdersContext();
  const [order, setOrder] = useState<ProductionOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isMutating, setIsMutating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      navigate('/production-orders');
      return;
    }

    let cancelled = false;

    async function loadPage() {
      setIsLoading(true);
      setLoadError(null);
      try {
        const loaded = await getProductionOrder(id!);
        if (!cancelled) {
          setOrder(loaded);
          upsertLocalOrder(loaded);
        }
      } catch (error) {
        if (!cancelled) {
          if (error instanceof ApiError && error.status === 404) {
            navigate('/production-orders');
            return;
          }
          setLoadError(
            error instanceof ApiError ? error.message : 'UNEXPECTED'
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadPage();

    return () => {
      cancelled = true;
    };
  }, [id, navigate, upsertLocalOrder]);

  const handleUpdateQ = useCallback(
    async (qtdAProduzir: number) => {
      if (!id) {
        return;
      }
      setIsMutating(true);
      setErrorMessage(null);
      try {
        const updated = await updateProductionOrder(id, { qtdAProduzir });
        setOrder(updated);
        enqueueToast({
          severity: 'success',
          message: t('productionOrders.toasts.qUpdated'),
        });
      } catch (error) {
        const message = toToastError(
          error,
          t('productionOrders.errors.unexpected')
        );
        setErrorMessage(
          error instanceof ApiError ? error.message : 'UNEXPECTED'
        );
        enqueueToast({ severity: 'error', message });
      } finally {
        setIsMutating(false);
      }
    },
    [enqueueToast, id, t, updateProductionOrder]
  );

  const handleUpdateReal = useCallback(
    async (realProduzido: number) => {
      if (!id) {
        return;
      }
      setIsMutating(true);
      setErrorMessage(null);
      try {
        const updated = await updateProductionOrder(id, { realProduzido });
        setOrder(updated);
        enqueueToast({
          severity: 'success',
          message: t('productionOrders.toasts.realUpdated'),
        });
      } catch (error) {
        const message = toToastError(
          error,
          t('productionOrders.errors.unexpected')
        );
        setErrorMessage(
          error instanceof ApiError ? error.message : 'UNEXPECTED'
        );
        enqueueToast({ severity: 'error', message });
      } finally {
        setIsMutating(false);
      }
    },
    [enqueueToast, id, t, updateProductionOrder]
  );

  const handleUpdateSteps = useCallback(
    async (steps: ProductionStepInput[]) => {
      if (!id || !order) {
        return;
      }
      setIsMutating(true);
      setErrorMessage(null);
      try {
        const nextSteps = await updateProductionOrderSteps(id, { steps });
        const plannedMinutesTotal = nextSteps.reduce(
          (sum, step) => sum + step.plannedMinutes,
          0
        );
        const updated: ProductionOrder = {
          ...order,
          steps: nextSteps,
          plannedMinutesTotal,
        };
        setOrder(updated);
        upsertLocalOrder(updated);
        enqueueToast({
          severity: 'success',
          message: t('productionOrders.toasts.stepsUpdated'),
        });
      } catch (error) {
        const message = toToastError(
          error,
          t('productionOrders.errors.unexpected')
        );
        setErrorMessage(
          error instanceof ApiError ? error.message : 'UNEXPECTED'
        );
        enqueueToast({ severity: 'error', message });
      } finally {
        setIsMutating(false);
      }
    },
    [enqueueToast, id, order, t, updateProductionOrderSteps, upsertLocalOrder]
  );

  const handleRecalculate = useCallback(async () => {
    if (!id) {
      return;
    }
    setIsMutating(true);
    setErrorMessage(null);
    try {
      const updated = await recalculateFromRecipe(id);
      setOrder(updated);
      enqueueToast({
        severity: 'success',
        message: t('productionOrders.toasts.recalculated'),
      });
    } catch (error) {
      const message = toToastError(
        error,
        t('productionOrders.errors.unexpected')
      );
      setErrorMessage(error instanceof ApiError ? error.message : 'UNEXPECTED');
      enqueueToast({ severity: 'error', message });
    } finally {
      setIsMutating(false);
    }
  }, [enqueueToast, id, recalculateFromRecipe, t]);

  const displayLoadError =
    loadError === 'UNEXPECTED'
      ? t('productionOrders.errors.unexpected')
      : loadError;

  if (isLoading) {
    return (
      <PageRoot>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress
            size={32}
            aria-label={t('productionOrders.detail.loading')}
          />
        </Box>
      </PageRoot>
    );
  }

  if (displayLoadError) {
    return (
      <PageRoot>
        <Alert severity="error" role="alert">
          {displayLoadError}
        </Alert>
      </PageRoot>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <PageRoot>
      <PageHeader>
        <PageTitle>
          {t('productionOrders.detail.title', { number: order.number })}
        </PageTitle>
        <PageSubtitle>{t('productionOrders.detail.subtitle')}</PageSubtitle>
      </PageHeader>

      <ProductionOrderDetail
        order={order}
        isMutating={isMutating}
        errorMessage={errorMessage}
        onUpdateQ={handleUpdateQ}
        onUpdateReal={handleUpdateReal}
        onUpdateSteps={handleUpdateSteps}
        onRecalculate={handleRecalculate}
      />
    </PageRoot>
  );
}

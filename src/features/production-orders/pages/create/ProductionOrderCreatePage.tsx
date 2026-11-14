import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ApiError } from '@/core/api';
import { PageSubtitle, PageTitle } from '@/shared/components/page';
import { useToast } from '@/shared/toast';
import {
  ProductionOrderForm,
  type ProductionOrderFormSubmitValues,
} from '@/features/production-orders/components/form/ProductionOrderForm';
import { useProductionOrdersContext } from '@/features/production-orders/context/ProductionOrdersContext';
import {
  PageHeader,
  PageRoot,
} from '@/features/production-orders/pages/ProductionOrderFormPage.styled';

export function ProductionOrderCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueToast } = useToast();
  const { createProductionOrder } = useProductionOrdersContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCancel = useCallback(() => {
    navigate('/production-orders');
  }, [navigate]);

  const handleSubmit = useCallback(
    async (values: ProductionOrderFormSubmitValues) => {
      setIsSubmitting(true);
      setErrorMessage(null);
      try {
        const created = await createProductionOrder(values);
        enqueueToast({
          severity: 'success',
          message: t('productionOrders.toasts.created'),
        });
        navigate(`/production-orders/${created.id}`);
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : t('productionOrders.errors.unexpected');
        setErrorMessage(
          error instanceof ApiError ? error.message : 'UNEXPECTED'
        );
        enqueueToast({ severity: 'error', message });
      } finally {
        setIsSubmitting(false);
      }
    },
    [createProductionOrder, enqueueToast, navigate, t]
  );

  return (
    <PageRoot>
      <PageHeader>
        <PageTitle>{t('productionOrders.form.title')}</PageTitle>
        <PageSubtitle>{t('productionOrders.form.subtitle')}</PageSubtitle>
      </PageHeader>

      <ProductionOrderForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        errorMessage={errorMessage}
      />
    </PageRoot>
  );
}

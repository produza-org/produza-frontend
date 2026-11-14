import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ApiError } from '@/core/api';
import { PageSubtitle, PageTitle } from '@/shared/components/page';
import { useToast } from '@/shared/toast';
import {
  RawMaterialForm,
  type RawMaterialFormSubmitValues,
} from '@/features/raw-materials/components/form/RawMaterialForm';
import { useRawMaterialsContext } from '@/features/raw-materials/context/RawMaterialsContext';
import {
  PageHeader,
  PageRoot,
} from '@/features/raw-materials/pages/RawMaterialFormPage.styled';

export function RawMaterialCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueToast } = useToast();
  const { createRawMaterial } = useRawMaterialsContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCancel = useCallback(() => {
    navigate('/raw-materials');
  }, [navigate]);

  const handleSubmit = useCallback(
    async (values: RawMaterialFormSubmitValues) => {
      setIsSubmitting(true);
      setErrorMessage(null);
      try {
        await createRawMaterial(values);
        enqueueToast({
          severity: 'success',
          message: t('rawMaterials.toasts.created'),
        });
        navigate('/raw-materials');
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : t('rawMaterials.errors.unexpected');
        setErrorMessage(error instanceof ApiError ? error.message : 'UNEXPECTED');
        enqueueToast({ severity: 'error', message });
      } finally {
        setIsSubmitting(false);
      }
    },
    [createRawMaterial, enqueueToast, navigate, t]
  );

  return (
    <PageRoot>
      <PageHeader>
        <PageTitle>{t('rawMaterials.form.title')}</PageTitle>
        <PageSubtitle>{t('rawMaterials.form.subtitle')}</PageSubtitle>
      </PageHeader>

      <RawMaterialForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        errorMessage={errorMessage}
      />
    </PageRoot>
  );
}

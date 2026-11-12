import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ApiError } from '@/core/api';
import { PageSubtitle, PageTitle } from '@/shared/components/page';
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
        navigate('/raw-materials');
      } catch (error) {
        setErrorMessage(error instanceof ApiError ? error.message : 'UNEXPECTED');
      } finally {
        setIsSubmitting(false);
      }
    },
    [createRawMaterial, navigate]
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

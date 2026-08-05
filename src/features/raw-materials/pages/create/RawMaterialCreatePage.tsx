import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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

  const handleCancel = useCallback(() => {
    navigate('/raw-materials');
  }, [navigate]);

  const handleSubmit = useCallback(
    (values: RawMaterialFormSubmitValues) => {
      createRawMaterial(values);
      navigate('/raw-materials');
    },
    [createRawMaterial, navigate]
  );

  return (
    <PageRoot>
      <PageHeader>
        <PageTitle>{t('rawMaterials.form.title')}</PageTitle>
        <PageSubtitle>{t('rawMaterials.form.subtitle')}</PageSubtitle>
      </PageHeader>

      <RawMaterialForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </PageRoot>
  );
}

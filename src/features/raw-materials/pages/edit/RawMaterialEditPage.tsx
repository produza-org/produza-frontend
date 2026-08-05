import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { PageSubtitle, PageTitle } from '@/shared/components/page';
import { formatCurrencyBrlInput } from '@/shared/utils';
import {
  RawMaterialForm,
  type RawMaterialFormSubmitValues,
} from '@/features/raw-materials/components/form/RawMaterialForm';
import { useRawMaterialsContext } from '@/features/raw-materials/context/RawMaterialsContext';
import {
  PageHeader,
  PageRoot,
} from '@/features/raw-materials/pages/RawMaterialFormPage.styled';

export function RawMaterialEditPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { items, updateRawMaterial } = useRawMaterialsContext();

  const item = useMemo(() => items.find((entry) => entry.id === id), [items, id]);

  const initialValues = useMemo(() => {
    if (!item) return undefined;
    return {
      name: item.name,
      code: item.code,
      unit: item.unit,
      unitCostDisplay: formatCurrencyBrlInput(item.unitCost),
      stockQuantity: String(item.stockQuantity),
      minStock: String(item.minStock),
    };
  }, [item]);

  useEffect(() => {
    if (!item) {
      navigate('/raw-materials');
    }
  }, [item, navigate]);

  const handleCancel = useCallback(() => {
    navigate('/raw-materials');
  }, [navigate]);

  const handleSubmit = useCallback(
    (values: RawMaterialFormSubmitValues) => {
      if (!id) return;
      updateRawMaterial(id, values);
      navigate('/raw-materials');
    },
    [id, updateRawMaterial, navigate]
  );

  if (!item || !initialValues) {
    return null;
  }

  return (
    <PageRoot>
      <PageHeader>
        <PageTitle>{t('rawMaterials.form.editTitle')}</PageTitle>
        <PageSubtitle>{t('rawMaterials.form.editSubtitle')}</PageSubtitle>
      </PageHeader>

      <RawMaterialForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </PageRoot>
  );
}

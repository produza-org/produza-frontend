import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { ApiError } from '@/core/api';
import { PageSubtitle, PageTitle } from '@/shared/components/page';
import { useToast } from '@/shared/toast';
import { formatCurrencyBrlInput } from '@/shared/utils';
import { getRawMaterial } from '@/features/raw-materials/api';
import {
  RawMaterialForm,
  type RawMaterialFormSubmitValues,
} from '@/features/raw-materials/components/form/RawMaterialForm';
import { useRawMaterialsContext } from '@/features/raw-materials/context/RawMaterialsContext';
import type { RawMaterial } from '@/features/raw-materials/types/raw-material';
import {
  PageHeader,
  PageRoot,
} from '@/features/raw-materials/pages/RawMaterialFormPage.styled';

export function RawMaterialEditPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueToast } = useToast();
  const { id } = useParams<{ id: string }>();
  const { items, updateRawMaterial } = useRawMaterialsContext();
  const [item, setItem] = useState<RawMaterial | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cachedItem = useMemo(
    () => (id ? items.find((entry) => entry.id === id) ?? null : null),
    [items, id]
  );

  useEffect(() => {
    if (!id) {
      navigate('/raw-materials');
      return;
    }

    if (cachedItem) {
      setItem(cachedItem);
      setIsLoading(false);
      setLoadError(null);
      return;
    }

    let cancelled = false;

    async function loadItem() {
      setIsLoading(true);
      setLoadError(null);
      try {
        const loaded = await getRawMaterial(id!);
        if (!cancelled) {
          setItem(loaded);
        }
      } catch (error) {
        if (!cancelled) {
          if (error instanceof ApiError && error.status === 404) {
            navigate('/raw-materials');
            return;
          }
          setLoadError(error instanceof ApiError ? error.message : 'UNEXPECTED');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadItem();

    return () => {
      cancelled = true;
    };
  }, [cachedItem, id, navigate]);

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

  const handleCancel = useCallback(() => {
    navigate('/raw-materials');
  }, [navigate]);

  const handleSubmit = useCallback(
    async (values: RawMaterialFormSubmitValues) => {
      if (!id) return;
      setIsSubmitting(true);
      try {
        await updateRawMaterial(id, values);
        enqueueToast({
          severity: 'success',
          message: t('rawMaterials.toasts.updated'),
        });
        navigate('/raw-materials');
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : t('rawMaterials.errors.unexpected');
        enqueueToast({ severity: 'error', message });
      } finally {
        setIsSubmitting(false);
      }
    },
    [enqueueToast, id, navigate, t, updateRawMaterial]
  );

  const displayLoadError =
    loadError === 'UNEXPECTED' ? t('rawMaterials.errors.unexpected') : loadError;

  if (isLoading) {
    return (
      <PageRoot>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={32} aria-label={t('rawMaterials.form.loading')} />
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
        isSubmitting={isSubmitting}
      />
    </PageRoot>
  );
}

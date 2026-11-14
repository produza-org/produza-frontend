import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { ApiError } from '@/core/api';
import { PageSubtitle, PageTitle } from '@/shared/components/page';
import { useToast } from '@/shared/toast';
import { upsertProductRecipe } from '@/features/products/api';
import {
  ProductCreateWizard,
  type ProductCreateWizardSaveInput,
} from '@/features/products/components/create/ProductCreateWizard';
import { useProductsContext } from '@/features/products/context/ProductsContext';
import {
  PageHeader,
  PageRoot,
} from '@/features/products/pages/ProductFormPage.styled';
import { listAllRawMaterials } from '@/features/raw-materials/api';
import type { RawMaterial } from '@/features/raw-materials/types/raw-material';

export function ProductCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueToast } = useToast();
  const { createProduct } = useProductsContext();
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function prefetchMaterials() {
      setIsLoadingMaterials(true);
      try {
        const loaded = await listAllRawMaterials();
        if (!cancelled) {
          setMaterials(loaded);
        }
      } catch {
        if (!cancelled) {
          setMaterials([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingMaterials(false);
        }
      }
    }

    void prefetchMaterials();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleCancel = useCallback(() => {
    navigate('/products');
  }, [navigate]);

  const handleSave = useCallback(
    async (input: ProductCreateWizardSaveInput) => {
      setIsSubmitting(true);
      setErrorMessage(null);
      try {
        let productId = createdProductId;
        if (!productId) {
          const created = await createProduct(input.general);
          productId = created.id;
          setCreatedProductId(created.id);
        }

        await upsertProductRecipe(productId, input.recipe);
        enqueueToast({
          severity: 'success',
          message: t('products.toasts.created'),
        });
        navigate('/products');
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : t('products.errors.unexpected');
        setErrorMessage(error instanceof ApiError ? error.message : 'UNEXPECTED');
        enqueueToast({ severity: 'error', message });
      } finally {
        setIsSubmitting(false);
      }
    },
    [createProduct, createdProductId, enqueueToast, navigate, t]
  );

  return (
    <PageRoot>
      <PageHeader>
        <PageTitle>{t('products.form.title')}</PageTitle>
        <PageSubtitle>{t('products.form.subtitle')}</PageSubtitle>
      </PageHeader>

      {isLoadingMaterials ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress
            size={32}
            aria-label={t('products.createWizard.loadingMaterials')}
          />
        </Box>
      ) : (
        <ProductCreateWizard
          materials={materials}
          onCancel={handleCancel}
          onSave={handleSave}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
        />
      )}
    </PageRoot>
  );
}

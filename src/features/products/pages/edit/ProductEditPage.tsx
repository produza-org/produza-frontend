import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined';
import { ApiError } from '@/core/api';
import { PageSubtitle, PageTitle } from '@/shared/components/page';
import { useToast } from '@/shared/toast';
import { getProduct } from '@/features/products/api';
import {
  ProductForm,
  type ProductFormSubmitValues,
} from '@/features/products/components/form/ProductForm';
import { useProductsContext } from '@/features/products/context/ProductsContext';
import type { Product } from '@/features/products/types/product';
import {
  PageHeader,
  PageRoot,
} from '@/features/products/pages/ProductFormPage.styled';

export function ProductEditPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueToast } = useToast();
  const { id } = useParams<{ id: string }>();
  const { items, updateProduct } = useProductsContext();
  const [item, setItem] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cachedItem = useMemo(
    () => (id ? items.find((entry) => entry.id === id) ?? null : null),
    [items, id]
  );

  useEffect(() => {
    if (!id) {
      navigate('/products');
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
        const loaded = await getProduct(id!);
        if (!cancelled) {
          setItem(loaded);
        }
      } catch (error) {
        if (!cancelled) {
          if (error instanceof ApiError && error.status === 404) {
            navigate('/products');
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
      finalSizeDisplay: String(item.finalSize),
      finalSizeUnit: item.finalSizeUnit,
      yieldDisplay: String(item.yield),
    };
  }, [item]);

  const handleCancel = useCallback(() => {
    navigate('/products');
  }, [navigate]);

  const handleSubmit = useCallback(
    async (values: ProductFormSubmitValues) => {
      if (!id) return;
      setIsSubmitting(true);
      try {
        await updateProduct(id, values);
        enqueueToast({
          severity: 'success',
          message: t('products.toasts.updated'),
        });
        navigate('/products');
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : t('products.errors.unexpected');
        enqueueToast({ severity: 'error', message });
      } finally {
        setIsSubmitting(false);
      }
    },
    [enqueueToast, id, navigate, t, updateProduct]
  );

  const displayLoadError =
    loadError === 'UNEXPECTED' ? t('products.errors.unexpected') : loadError;

  if (isLoading) {
    return (
      <PageRoot>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={32} aria-label={t('products.form.loading')} />
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
        <PageTitle>{t('products.form.editTitle')}</PageTitle>
        <PageSubtitle>{t('products.form.editSubtitle')}</PageSubtitle>
        <Box sx={{ mt: 2 }}>
          <Button
            type="button"
            startIcon={<MenuBookOutlined />}
            onClick={() => navigate(`/products/${id}/recipe`)}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              color: 'produza.primary',
            }}
          >
            {t('products.recipe.editLink')}
          </Button>
        </Box>
      </PageHeader>

      <ProductForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </PageRoot>
  );
}

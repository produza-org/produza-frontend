import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { ApiError } from '@/core/api';
import { PageSubtitle, PageTitle } from '@/shared/components/page';
import { useToast } from '@/shared/toast';
import { getProduct, getProductRecipe, upsertProductRecipe } from '@/features/products/api';
import { RecipeEditor } from '@/features/products/components/recipe/RecipeEditor';
import type { Product } from '@/features/products/types/product';
import type { Recipe, RecipeUpsertInput } from '@/features/products/types/recipe';
import {
  PageHeader,
  PageRoot,
} from '@/features/products/pages/ProductFormPage.styled';
import { listAllRawMaterials } from '@/features/raw-materials/api';
import type { RawMaterial } from '@/features/raw-materials/types/raw-material';

export function ProductRecipePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueToast } = useToast();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editorKey, setEditorKey] = useState(0);

  useEffect(() => {
    if (!id) {
      navigate('/products');
      return;
    }

    let cancelled = false;

    async function loadPage() {
      setIsLoading(true);
      setLoadError(null);
      try {
        const [loadedProduct, loadedMaterials] = await Promise.all([
          getProduct(id!),
          listAllRawMaterials(),
        ]);

        let loadedRecipe: Recipe | null = null;
        try {
          loadedRecipe = await getProductRecipe(id!);
        } catch (error) {
          if (!(error instanceof ApiError && error.status === 404)) {
            throw error;
          }
        }

        if (!cancelled) {
          setProduct(loadedProduct);
          setMaterials(loadedMaterials);
          setRecipe(loadedRecipe);
          setEditorKey((value) => value + 1);
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

    void loadPage();

    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  const handleCancel = useCallback(() => {
    navigate('/products');
  }, [navigate]);

  const handleSubmit = useCallback(
    async (input: RecipeUpsertInput) => {
      if (!id) return;
      setIsSubmitting(true);
      try {
        const saved = await upsertProductRecipe(id, input);
        setRecipe(saved);
        setEditorKey((value) => value + 1);
        enqueueToast({
          severity: 'success',
          message: t('products.toasts.recipeSaved'),
        });
        navigate('/products');
      } catch (error) {
        if (error instanceof ApiError) {
          const detail = error.body.details?.[0]?.message;
          const message = detail ? `${error.message}: ${detail}` : error.message;
          enqueueToast({ severity: 'error', message });
        } else {
          enqueueToast({
            severity: 'error',
            message: t('products.recipe.errors.unexpected'),
          });
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [enqueueToast, id, navigate, t]
  );

  const displayLoadError =
    loadError === 'UNEXPECTED' ? t('products.recipe.errors.unexpected') : loadError;

  if (isLoading) {
    return (
      <PageRoot>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={32} aria-label={t('products.recipe.loading')} />
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

  if (!product) {
    return null;
  }

  return (
    <PageRoot>
      <PageHeader>
        <PageTitle>{t('products.recipe.title', { name: product.name })}</PageTitle>
        <PageSubtitle>{t('products.recipe.subtitle')}</PageSubtitle>
      </PageHeader>

      <RecipeEditor
        key={editorKey}
        product={product}
        recipe={recipe}
        materials={materials}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </PageRoot>
  );
}

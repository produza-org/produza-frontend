import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@mui/material/CircularProgress';
import { ApiError } from '@/core/api';
import { getProductRecipe } from '@/features/products/api';
import type { Product } from '@/features/products/types/product';
import type { Recipe } from '@/features/products/types/recipe';
import { formatDecimal } from '@/features/products/utils/format';
import {
  DetailBreakdownList,
  DrawerLoadingBox,
} from '@/shared/components/drawer';

type ProductDetailContentProps = {
  item: Product;
};

export function ProductDetailContent({ item }: ProductDetailContentProps) {
  const { t } = useTranslation();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setRecipe(null);

    void getProductRecipe(item.id)
      .then((data) => {
        if (!cancelled) {
          setRecipe(data);
        }
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }
        if (error instanceof ApiError && error.status === 404) {
          setRecipe(null);
          return;
        }
        setRecipe(null);
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [item.id]);

  if (isLoading) {
    return (
      <DrawerLoadingBox>
        <CircularProgress size={32} aria-label={t('products.drawer.loadingRecipe')} />
      </DrawerLoadingBox>
    );
  }

  const lines = recipe?.lines ?? [];
  if (lines.length === 0) {
    return null;
  }

  return (
    <DetailBreakdownList
      title={t('products.drawer.sectionRecipe')}
      items={lines.map((line) => ({
        id: line.id,
        primary: line.rawMaterial?.name ?? line.rawMaterialId,
        secondary: line.rawMaterial?.code,
        value: formatDecimal(line.proportion, 6),
        valueSecondary: line.unit,
      }))}
    />
  );
}

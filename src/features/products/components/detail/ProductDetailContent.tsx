import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useTranslation } from 'react-i18next';
import { ApiError } from '@/core/api';
import { getProductRecipe } from '@/features/products/api';
import type { Product } from '@/features/products/types/product';
import type { Recipe } from '@/features/products/types/recipe';
import { formatDecimal } from '@/features/products/utils/format';
import { getAllRecipeLines } from '@/features/products/utils/recipe/draft-lines';
import {
  DetailBreakdownList,
  DrawerLoadingBox,
  type DetailBreakdownItem,
} from '@/shared/components/drawer';

type ProductDetailContentProps = {
  item: Product;
};

function toBreakdownItem(
  line: {
    id: string;
    rawMaterialId: string;
    category: string;
    proportion: number;
    unit: string;
    rawMaterial?: { name?: string; code?: string };
  },
  categoryLabel: string
): DetailBreakdownItem {
  return {
    id: line.id,
    primary: line.rawMaterial?.name ?? line.rawMaterialId,
    secondary: [line.rawMaterial?.code, categoryLabel].filter(Boolean).join(' · '),
    value: formatDecimal(line.proportion, 6),
    valueSecondary: line.unit,
  };
}

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

  const ungroupedItems = useMemo(() => {
    const lines = recipe?.lines ?? [];
    return lines.map((line) =>
      toBreakdownItem(line, t(`products.recipe.categories.${line.category}`))
    );
  }, [recipe, t]);

  const groupSections = useMemo(() => {
    const groups = [...(recipe?.groups ?? [])].sort(
      (a, b) => a.sortOrder - b.sortOrder
    );
    return groups.map((group) => ({
      id: group.id,
      title: group.name || t('products.drawer.groupFallback'),
      items: [...group.lines]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((line) =>
          toBreakdownItem(
            line,
            t(`products.recipe.categories.${group.category}`)
          )
        ),
    }));
  }, [recipe, t]);

  if (isLoading) {
    return (
      <DrawerLoadingBox>
        <CircularProgress size={32} aria-label={t('products.drawer.loadingRecipe')} />
      </DrawerLoadingBox>
    );
  }

  const allLines = getAllRecipeLines(recipe);
  if (allLines.length === 0) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {ungroupedItems.length > 0 ? (
        <DetailBreakdownList
          title={t('products.drawer.sectionRecipe')}
          items={ungroupedItems}
        />
      ) : null}
      {groupSections.map((section) =>
        section.items.length > 0 ? (
          <DetailBreakdownList
            key={section.id}
            title={t('products.drawer.sectionGroup', { name: section.title })}
            items={section.items}
          />
        ) : null
      )}
    </Box>
  );
}

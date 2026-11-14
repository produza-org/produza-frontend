import { useMemo } from 'react';
import Alert from '@mui/material/Alert';
import { useTranslation } from 'react-i18next';
import { RECIPE_LINE_CATEGORIES } from '@/features/products/constants';
import { RecipeCategoryBlock } from '@/features/products/components/recipe/RecipeCategoryBlock';
import {
  ComponentSumBanner,
  ComponentSumLabel,
  ComponentSumValue,
  EmptyHint,
  ProductMetaChip,
  ProductMetaRow,
} from '@/features/products/components/recipe/RecipeEditor.styled';
import type { RecipeProductMeta } from '@/features/products/utils/form/general-info';
import { formatDecimal } from '@/features/products/utils/format';
import {
  createEmptyDraftLine,
  getDraftComponentSum,
  hasDuplicateMaterials,
  hasInvalidPackagingUnit,
  hasNegativeConsumption,
  type RecipeDraftLine,
} from '@/features/products/utils/recipe/draft-lines';
import { isComponentSumValid } from '@/features/products/utils/recipe/component-sum';
import type { RawMaterial } from '@/features/raw-materials/types/raw-material';

type RecipeDraftPanelProps = {
  productMeta: RecipeProductMeta;
  materials: RawMaterial[];
  lines: RecipeDraftLine[];
  onChange: (lines: RecipeDraftLine[]) => void;
  errorMessage?: string | null;
  showEmptyHint?: boolean;
  stepHint?: string | null;
};

export function RecipeDraftPanel({
  productMeta,
  materials,
  lines,
  onChange,
  errorMessage = null,
  showEmptyHint = false,
  stepHint = null,
}: RecipeDraftPanelProps) {
  const { t } = useTranslation();

  const componentSum = getDraftComponentSum(lines);
  const sumValid = isComponentSumValid(componentSum);

  const usedMaterialIds = useMemo(
    () =>
      new Set(
        lines
          .map((line) => line.rawMaterialId)
          .filter((rawMaterialId): rawMaterialId is string => Boolean(rawMaterialId))
      ),
    [lines]
  );

  const validationHints = useMemo(() => {
    const hints: string[] = [];
    if (!sumValid) {
      hints.push(t('products.recipe.componentSumInvalid'));
    }
    if (hasNegativeConsumption(lines)) {
      hints.push(t('products.recipe.errors.negativeConsumption'));
    }
    if (hasInvalidPackagingUnit(lines)) {
      hints.push(t('products.recipe.errors.packagingUnit'));
    }
    if (hasDuplicateMaterials(lines)) {
      hints.push(t('products.recipe.errors.duplicateMaterial'));
    }
    return hints;
  }, [lines, sumValid, t]);

  const displayError =
    errorMessage === 'UNEXPECTED'
      ? t('products.recipe.errors.unexpected')
      : errorMessage;

  function updateLine(next: RecipeDraftLine) {
    onChange(lines.map((line) => (line.key === next.key ? next : line)));
  }

  function removeLine(key: string) {
    onChange(lines.filter((line) => line.key !== key));
  }

  function addLine(category: (typeof RECIPE_LINE_CATEGORIES)[number]) {
    onChange([...lines, createEmptyDraftLine(category)]);
  }

  return (
    <>
      <ProductMetaRow>
        <ProductMetaChip
          label={`${t('products.recipe.productMeta.yield')}: ${formatDecimal(productMeta.yield, 6)}`}
          size="small"
        />
        <ProductMetaChip
          label={`${t('products.recipe.productMeta.expansion')}: ${formatDecimal(productMeta.expansionFactor, 6)}`}
          size="small"
        />
        <ProductMetaChip
          label={`${t('products.recipe.productMeta.finalSize')}: ${formatDecimal(productMeta.finalSize, 2)} ${productMeta.finalSizeUnit}`}
          size="small"
        />
      </ProductMetaRow>

      {displayError ? (
        <Alert severity="error" role="alert">
          {displayError}
        </Alert>
      ) : null}

      {stepHint ? <EmptyHint>{stepHint}</EmptyHint> : null}

      {showEmptyHint && lines.length === 0 ? (
        <EmptyHint>{t('products.recipe.emptyHint')}</EmptyHint>
      ) : null}

      {RECIPE_LINE_CATEGORIES.map((category) => (
        <RecipeCategoryBlock
          key={category}
          category={category}
          lines={lines.filter((line) => line.category === category)}
          materials={materials}
          usedMaterialIds={usedMaterialIds}
          onAddLine={() => addLine(category)}
          onChangeLine={updateLine}
          onRemoveLine={removeLine}
        />
      ))}

      <ComponentSumBanner $valid={sumValid} role="status">
        <ComponentSumLabel>{t('products.recipe.componentSum')}</ComponentSumLabel>
        <ComponentSumValue>
          Σ = {formatDecimal(componentSum, 6)}
          {sumValid
            ? ` · ${t('products.recipe.componentSumValid')}`
            : ` · ${t('products.recipe.componentSumInvalid')}`}
        </ComponentSumValue>
      </ComponentSumBanner>

      {validationHints.length > 0 ? (
        <Alert severity="warning" role="status">
          {validationHints.join(' ')}
        </Alert>
      ) : null}
    </>
  );
}

import { useMemo } from 'react';
import Alert from '@mui/material/Alert';
import { useTranslation } from 'react-i18next';
import { RecipeCategoryBlock } from '@/features/products/components/recipe/RecipeCategoryBlock';
import {
  EmptyHint,
  ProductMetaChip,
  ProductMetaRow,
  ProportionSumBanner,
  ProportionSumLabel,
  ProportionSumValue,
} from '@/features/products/components/recipe/RecipeEditor.styled';
import type { RecipeProductMeta } from '@/features/products/utils/form/general-info';
import { formatDecimal } from '@/features/products/utils/format';
import {
  createEmptyDraftLine,
  getDraftProportionSum,
  hasDuplicateMaterials,
  hasNegativeProportion,
  type RecipeDraftLine,
} from '@/features/products/utils/recipe/draft-lines';
import { isProportionSumValid } from '@/features/products/utils/recipe/proportion-sum';
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

  const proportionSum = getDraftProportionSum(lines);
  const sumValid = isProportionSumValid(proportionSum);

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
      hints.push(t('products.recipe.proportionSumInvalid'));
    }
    if (hasNegativeProportion(lines)) {
      hints.push(t('products.recipe.errors.negativeProportion'));
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

  function addLine() {
    onChange([...lines, createEmptyDraftLine()]);
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

      <RecipeCategoryBlock
        lines={lines}
        materials={materials}
        usedMaterialIds={usedMaterialIds}
        onAddLine={addLine}
        onChangeLine={updateLine}
        onRemoveLine={removeLine}
      />

      <ProportionSumBanner $valid={sumValid} role="status">
        <ProportionSumLabel>{t('products.recipe.proportionSum')}</ProportionSumLabel>
        <ProportionSumValue>
          Σ = {formatDecimal(proportionSum, 6)}
          {sumValid
            ? ` · ${t('products.recipe.proportionSumValid')}`
            : ` · ${t('products.recipe.proportionSumInvalid')}`}
        </ProportionSumValue>
      </ProportionSumBanner>

      {validationHints.length > 0 ? (
        <Alert severity="warning" role="status">
          {validationHints.join(' ')}
        </Alert>
      ) : null}
    </>
  );
}

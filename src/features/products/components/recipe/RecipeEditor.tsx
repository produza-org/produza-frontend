import { useMemo, useState, type FormEvent } from 'react';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import Alert from '@mui/material/Alert';
import { useTranslation } from 'react-i18next';
import type { Product } from '@/features/products/types/product';
import type { Recipe, RecipeUpsertInput } from '@/features/products/types/recipe';
import { RECIPE_LINE_CATEGORIES } from '@/features/products/constants';
import { formatDecimal } from '@/features/products/utils/format';
import {
  canSaveRecipeDraft,
  createEmptyDraftLine,
  getDraftComponentSum,
  hasDuplicateMaterials,
  hasInvalidPackagingUnit,
  hasNegativeConsumption,
  recipeLinesToDrafts,
  toRecipeLineInputs,
  type RecipeDraftLine,
} from '@/features/products/utils/recipe/draft-lines';
import { isComponentSumValid } from '@/features/products/utils/recipe/component-sum';
import type { RawMaterial } from '@/features/raw-materials/types/raw-material';
import { ConfirmModal } from '@/shared/components/dialog';
import { RecipeCategoryBlock } from '@/features/products/components/recipe/RecipeCategoryBlock';
import {
  CancelButton,
  ComponentSumBanner,
  ComponentSumLabel,
  ComponentSumValue,
  EditorActions,
  EditorBody,
  EditorCard,
  EditorCardAccent,
  EmptyHint,
  ProductMetaChip,
  ProductMetaRow,
  SaveButton,
} from '@/features/products/components/recipe/RecipeEditor.styled';

type RecipeEditorProps = {
  product: Product;
  recipe: Recipe | null;
  materials: RawMaterial[];
  onSubmit: (input: RecipeUpsertInput) => void | Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
};

export function RecipeEditor({
  product,
  recipe,
  materials,
  onSubmit,
  onCancel,
  isSubmitting = false,
  errorMessage = null,
}: RecipeEditorProps) {
  const { t } = useTranslation();
  const [lines, setLines] = useState<RecipeDraftLine[]>(() =>
    recipe ? recipeLinesToDrafts(recipe.lines) : []
  );
  const [discardOpen, setDiscardOpen] = useState(false);
  const [initialSnapshot] = useState(() =>
    JSON.stringify(recipe ? recipeLinesToDrafts(recipe.lines) : [])
  );

  const isDirty = JSON.stringify(lines) !== initialSnapshot;
  const componentSum = getDraftComponentSum(lines);
  const sumValid = isComponentSumValid(componentSum);
  const saveEnabled = canSaveRecipeDraft(lines) && !isSubmitting;

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
    setLines((current) => current.map((line) => (line.key === next.key ? next : line)));
  }

  function removeLine(key: string) {
    setLines((current) => current.filter((line) => line.key !== key));
  }

  function addLine(category: (typeof RECIPE_LINE_CATEGORIES)[number]) {
    setLines((current) => [...current, createEmptyDraftLine(category)]);
  }

  function handleCancel() {
    if (isDirty) {
      setDiscardOpen(true);
      return;
    }
    onCancel();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!saveEnabled) {
      return;
    }
    void onSubmit({ lines: toRecipeLineInputs(lines) });
  }

  return (
    <>
      <EditorCard>
        <EditorCardAccent />
        <EditorBody onSubmit={handleSubmit} noValidate>
          <ProductMetaRow>
            <ProductMetaChip
              label={`${t('products.recipe.productMeta.yield')}: ${formatDecimal(product.yield, 6)}`}
              size="small"
            />
            <ProductMetaChip
              label={`${t('products.recipe.productMeta.expansion')}: ${formatDecimal(product.expansionFactor, 6)}`}
              size="small"
            />
            <ProductMetaChip
              label={`${t('products.recipe.productMeta.finalSize')}: ${formatDecimal(product.finalSize, 2)} ${product.finalSizeUnit}`}
              size="small"
            />
          </ProductMetaRow>

          {displayError ? (
            <Alert severity="error" role="alert">
              {displayError}
            </Alert>
          ) : null}

          {!recipe && lines.length === 0 ? (
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

          <EditorActions>
            <CancelButton type="button" onClick={handleCancel} disabled={isSubmitting}>
              {t('products.recipe.cancel')}
            </CancelButton>
            <SaveButton
              type="submit"
              variant="contained"
              disableElevation
              startIcon={<SaveOutlined />}
              disabled={!saveEnabled}
            >
              {isSubmitting ? t('products.recipe.saving') : t('products.recipe.save')}
            </SaveButton>
          </EditorActions>
        </EditorBody>
      </EditorCard>

      <ConfirmModal
        open={discardOpen}
        onClose={() => setDiscardOpen(false)}
        onConfirm={() => {
          setDiscardOpen(false);
          onCancel();
        }}
        title={t('products.recipe.discardTitle')}
        message={t('products.recipe.discardMessage')}
        cancelLabel={t('products.recipe.discardCancel')}
        confirmLabel={t('products.recipe.discardConfirm')}
      />
    </>
  );
}

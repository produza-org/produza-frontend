import { useState, type FormEvent } from 'react';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import { useTranslation } from 'react-i18next';
import type { Product } from '@/features/products/types/product';
import type { Recipe, RecipeUpsertInput } from '@/features/products/types/recipe';
import {
  canSaveRecipeDraft,
  recipeLinesToDrafts,
  toRecipeLineInputs,
  type RecipeDraftLine,
} from '@/features/products/utils/recipe/draft-lines';
import type { RawMaterial } from '@/features/raw-materials/types/raw-material';
import { ConfirmModal } from '@/shared/components/dialog';
import { RecipeDraftPanel } from '@/features/products/components/recipe/RecipeDraftPanel';
import {
  CancelButton,
  EditorActions,
  EditorBody,
  EditorCard,
  EditorCardAccent,
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
  const saveEnabled = canSaveRecipeDraft(lines) && !isSubmitting;

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
          <RecipeDraftPanel
            productMeta={{
              yield: product.yield,
              expansionFactor: product.expansionFactor,
              finalSize: product.finalSize,
              finalSizeUnit: product.finalSizeUnit,
            }}
            materials={materials}
            lines={lines}
            onChange={setLines}
            errorMessage={errorMessage}
            showEmptyHint={!recipe}
          />

          <EditorActions>
            <CancelButton type="button" onClick={handleCancel} disabled={isSubmitting}>
              {t('products.recipe.cancel')}
            </CancelButton>
            <SaveButton
              type="submit"
              variant="contained"
              color="primary"
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

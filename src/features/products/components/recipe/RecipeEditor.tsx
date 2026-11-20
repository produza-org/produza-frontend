import { useState, type FormEvent } from 'react';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import { useTranslation } from 'react-i18next';
import type { Product } from '@/features/products/types/product';
import type { Recipe, RecipeUpsertInput } from '@/features/products/types/recipe';
import {
  canSaveRecipeDraft,
  recipeToDraft,
  toRecipeUpsertInput,
  type RecipeDraft,
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
  const [draft, setDraft] = useState<RecipeDraft>(() => recipeToDraft(recipe));
  const [discardOpen, setDiscardOpen] = useState(false);
  const [initialSnapshot] = useState(() => JSON.stringify(recipeToDraft(recipe)));

  const isDirty = JSON.stringify(draft) !== initialSnapshot;
  const saveEnabled = canSaveRecipeDraft(draft) && !isSubmitting;

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
    void onSubmit(toRecipeUpsertInput(draft));
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
            draft={draft}
            onChange={setDraft}
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

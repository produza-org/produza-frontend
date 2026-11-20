import { useMemo } from 'react';
import AddOutlined from '@mui/icons-material/AddOutlined';
import { useTranslation } from 'react-i18next';
import type { RawMaterial } from '@/features/raw-materials/types/raw-material';
import type { RecipeLineCategory } from '@/features/products/types/recipe';
import type { RecipeDraftLine } from '@/features/products/utils/recipe/draft-lines';
import { materialsForRecipeCategory } from '@/features/products/utils/recipe/materials-for-category';
import { RecipeLineRow } from '@/features/products/components/recipe/RecipeLineRow';
import {
  AddLineButton,
  AddLineRow,
  CategoryBlockRoot,
  CategoryHeader,
  CategoryTitle,
  LineRows,
} from '@/features/products/components/recipe/RecipeEditor.styled';

type RecipeCategoryBlockProps = {
  category: RecipeLineCategory;
  lines: RecipeDraftLine[];
  materials: RawMaterial[];
  usedMaterialIds: Set<string>;
  onAddLine: () => void;
  onChangeLine: (line: RecipeDraftLine) => void;
  onRemoveLine: (key: string) => void;
};

export function RecipeCategoryBlock({
  category,
  lines,
  materials,
  usedMaterialIds,
  onAddLine,
  onChangeLine,
  onRemoveLine,
}: RecipeCategoryBlockProps) {
  const { t } = useTranslation();
  const categoryMaterials = useMemo(
    () => materialsForRecipeCategory(category, materials),
    [category, materials]
  );

  return (
    <CategoryBlockRoot>
      <CategoryHeader>
        <CategoryTitle>{t(`products.recipe.categories.${category}`)}</CategoryTitle>
      </CategoryHeader>

      <LineRows>
        {lines.map((line) => (
          <RecipeLineRow
            key={line.key}
            line={line}
            materials={categoryMaterials}
            usedMaterialIds={usedMaterialIds}
            onChange={onChangeLine}
            onRemove={() => onRemoveLine(line.key)}
          />
        ))}
      </LineRows>

      <AddLineRow>
        <AddLineButton
          type="button"
          startIcon={<AddOutlined fontSize="small" />}
          onClick={onAddLine}
        >
          {t('products.recipe.addLine')}
        </AddLineButton>
      </AddLineRow>
    </CategoryBlockRoot>
  );
}

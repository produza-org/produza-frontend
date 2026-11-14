import AddOutlined from '@mui/icons-material/AddOutlined';
import { useTranslation } from 'react-i18next';
import type { RawMaterial } from '@/features/raw-materials/types/raw-material';
import type { RecipeDraftLine } from '@/features/products/utils/recipe/draft-lines';
import { RecipeLineRow } from '@/features/products/components/recipe/RecipeLineRow';
import {
  AddLineButton,
  CategoryBlockRoot,
  CategoryHeader,
  CategoryTitle,
  LineRows,
} from '@/features/products/components/recipe/RecipeEditor.styled';

type RecipeCategoryBlockProps = {
  lines: RecipeDraftLine[];
  materials: RawMaterial[];
  usedMaterialIds: Set<string>;
  onAddLine: () => void;
  onChangeLine: (line: RecipeDraftLine) => void;
  onRemoveLine: (key: string) => void;
};

export function RecipeCategoryBlock({
  lines,
  materials,
  usedMaterialIds,
  onAddLine,
  onChangeLine,
  onRemoveLine,
}: RecipeCategoryBlockProps) {
  const { t } = useTranslation();

  return (
    <CategoryBlockRoot>
      <CategoryHeader>
        <CategoryTitle>{t('products.recipe.rawMaterialsTitle')}</CategoryTitle>
        <AddLineButton
          type="button"
          startIcon={<AddOutlined fontSize="small" />}
          onClick={onAddLine}
        >
          {t('products.recipe.addLine')}
        </AddLineButton>
      </CategoryHeader>

      <LineRows>
        {lines.map((line) => (
          <RecipeLineRow
            key={line.key}
            line={line}
            materials={materials}
            usedMaterialIds={usedMaterialIds}
            onChange={onChangeLine}
            onRemove={() => onRemoveLine(line.key)}
          />
        ))}
      </LineRows>
    </CategoryBlockRoot>
  );
}

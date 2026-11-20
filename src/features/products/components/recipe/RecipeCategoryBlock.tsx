import { useMemo } from 'react';
import AddOutlined from '@mui/icons-material/AddOutlined';
import { useTranslation } from 'react-i18next';
import type { RawMaterialGroup } from '@/features/groupings/types/grouping';
import type { RawMaterial } from '@/features/raw-materials/types/raw-material';
import type { RecipeLineCategory } from '@/features/products/types/recipe';
import type {
  RecipeDraftGroup,
  RecipeDraftLine,
} from '@/features/products/utils/recipe/draft-lines';
import { materialsForRecipeCategory } from '@/features/products/utils/recipe/materials-for-category';
import { RecipeGroupSession } from '@/features/products/components/recipe/RecipeGroupSession';
import { RecipeLineRow } from '@/features/products/components/recipe/RecipeLineRow';
import {
  AddLineButton,
  AddLineRow,
  CategoryBlockRoot,
  CategoryHeader,
  CategoryTitle,
  LineRows,
} from '@/features/products/components/recipe/RecipeEditor.styled';

const GROUPABLE_CATEGORIES: RecipeLineCategory[] = [
  'MATERIA_PRIMA',
  'COMPONENTE',
];

type RecipeCategoryBlockProps = {
  category: RecipeLineCategory;
  lines: RecipeDraftLine[];
  groups: RecipeDraftGroup[];
  materials: RawMaterial[];
  usedMaterialIds: Set<string>;
  groupings: RawMaterialGroup[];
  isLoadingGroupings: boolean;
  onAddLine: () => void;
  onAddGroup: () => void;
  onChangeLine: (line: RecipeDraftLine) => void;
  onRemoveLine: (key: string) => void;
  onChangeGroup: (group: RecipeDraftGroup) => void;
  onRemoveGroup: (key: string) => void;
  onSelectGrouping: (groupKey: string, groupingId: string) => void;
  onChangeGroupLine: (groupKey: string, line: RecipeDraftLine) => void;
  onRemoveGroupLine: (groupKey: string, lineKey: string) => void;
};

export function RecipeCategoryBlock({
  category,
  lines,
  groups,
  materials,
  usedMaterialIds,
  groupings,
  isLoadingGroupings,
  onAddLine,
  onAddGroup,
  onChangeLine,
  onRemoveLine,
  onChangeGroup,
  onRemoveGroup,
  onSelectGrouping,
  onChangeGroupLine,
  onRemoveGroupLine,
}: RecipeCategoryBlockProps) {
  const { t } = useTranslation();
  const canAddGroup = GROUPABLE_CATEGORIES.includes(category);
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
        {groups.map((group) => (
          <RecipeGroupSession
            key={group.key}
            group={group}
            groupings={groupings}
            materials={categoryMaterials}
            usedMaterialIds={usedMaterialIds}
            isLoadingGroupings={isLoadingGroupings}
            onChangeGroup={onChangeGroup}
            onChangeLine={(line) => onChangeGroupLine(group.key, line)}
            onRemoveLine={(lineKey) => onRemoveGroupLine(group.key, lineKey)}
            onRemoveGroup={() => onRemoveGroup(group.key)}
            onSelectGrouping={(groupingId) =>
              onSelectGrouping(group.key, groupingId)
            }
          />
        ))}
      </LineRows>

      <AddLineRow>
        {canAddGroup ? (
          <AddLineButton
            type="button"
            startIcon={<AddOutlined fontSize="small" />}
            onClick={onAddGroup}
          >
            {t('products.recipe.addGroup')}
          </AddLineButton>
        ) : null}
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

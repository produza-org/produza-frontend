import DeleteOutline from '@mui/icons-material/DeleteOutline';
import CircularProgress from '@mui/material/CircularProgress';
import { useTranslation } from 'react-i18next';
import type { RawMaterialGroup } from '@/features/groupings/types/grouping';
import type { RawMaterial } from '@/features/raw-materials/types/raw-material';
import { RecipeLineRow } from '@/features/products/components/recipe/RecipeLineRow';
import {
  GroupSessionHeader,
  GroupSessionRoot,
  LineRows,
  RemoveLineButton,
} from '@/features/products/components/recipe/RecipeEditor.styled';
import type { RecipeDraftGroup, RecipeDraftLine } from '@/features/products/utils/recipe/draft-lines';
import { FormAutocomplete } from '@/shared/components/form';

type RecipeGroupSessionProps = {
  group: RecipeDraftGroup;
  groupings: RawMaterialGroup[];
  materials: RawMaterial[];
  usedMaterialIds: Set<string>;
  isLoadingGroupings: boolean;
  onChangeGroup: (group: RecipeDraftGroup) => void;
  onChangeLine: (line: RecipeDraftLine) => void;
  onRemoveLine: (lineKey: string) => void;
  onRemoveGroup: () => void;
  onSelectGrouping: (groupingId: string) => void;
};

export function RecipeGroupSession({
  group,
  groupings,
  materials,
  usedMaterialIds,
  isLoadingGroupings,
  onChangeGroup,
  onChangeLine,
  onRemoveLine,
  onRemoveGroup,
  onSelectGrouping,
}: RecipeGroupSessionProps) {
  const { t } = useTranslation();

  const options = groupings
    .filter((item) => item.status === 'active')
    .map((item) => ({
      value: item.id,
      label: `${item.code} — ${item.name}`,
    }));

  const selectedId = group.sourceGroupingId ?? '';
  const groupingOptions =
    selectedId && !options.some((option) => option.value === selectedId)
      ? [
          {
            value: selectedId,
            label: group.name || t('products.recipe.groupUnavailable'),
          },
          ...options,
        ]
      : options;

  return (
    <GroupSessionRoot>
      <GroupSessionHeader>
        {isLoadingGroupings ? (
          <CircularProgress
            size={24}
            aria-label={t('products.recipe.loadingGroups')}
          />
        ) : (
          <FormAutocomplete
            id={`recipe-group-${group.key}`}
            label={t('products.recipe.groupLabel')}
            value={selectedId}
            onChange={(value) => {
              if (!value) {
                onChangeGroup({
                  ...group,
                  sourceGroupingId: null,
                  name: '',
                  lines: [],
                });
                return;
              }
              onSelectGrouping(value);
            }}
            options={groupingOptions}
            placeholder={t('products.recipe.groupPlaceholder')}
            noOptionsText={t('products.recipe.groupNoOptions')}
          />
        )}
        <RemoveLineButton
          type="button"
          aria-label={t('products.recipe.removeGroup')}
          onClick={onRemoveGroup}
        >
          <DeleteOutline fontSize="small" />
        </RemoveLineButton>
      </GroupSessionHeader>

      {group.lines.length > 0 ? (
        <LineRows>
          {group.lines.map((line) => (
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
      ) : null}
    </GroupSessionRoot>
  );
}

import { useEffect, useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import { useTranslation } from 'react-i18next';
import { listAllRawMaterialGroups } from '@/features/groupings/api';
import type { RawMaterialGroup } from '@/features/groupings/types/grouping';
import { RECIPE_LINE_CATEGORIES } from '@/features/products/constants';
import { RecipeCategoryBlock } from '@/features/products/components/recipe/RecipeCategoryBlock';
import {
  EmptyHint,
  ProductMetaChip,
  ProductMetaRow,
  ProportionSumBanner,
  ProportionSumLabel,
  ProportionSumValue,
} from '@/features/products/components/recipe/RecipeEditor.styled';
import type { RecipeLineCategory } from '@/features/products/types/recipe';
import type { RecipeProductMeta } from '@/features/products/utils/form/general-info';
import { formatDecimal } from '@/features/products/utils/format';
import {
  createEmptyDraftGroup,
  createEmptyDraftLine,
  draftLinesFromGrouping,
  flattenRecipeDraftLines,
  getCompleteComponentLines,
  getDraftComponentProportionSum,
  getDraftProportionSum,
  hasDuplicateMaterials,
  hasNegativeProportion,
  type RecipeDraft,
  type RecipeDraftGroup,
  type RecipeDraftLine,
} from '@/features/products/utils/recipe/draft-lines';
import type { RawMaterial } from '@/features/raw-materials/types/raw-material';

type RecipeDraftPanelProps = {
  productMeta: RecipeProductMeta;
  materials: RawMaterial[];
  draft: RecipeDraft;
  onChange: (draft: RecipeDraft) => void;
  errorMessage?: string | null;
  showEmptyHint?: boolean;
  stepHint?: string | null;
};

export function RecipeDraftPanel({
  productMeta,
  materials,
  draft,
  onChange,
  errorMessage = null,
  showEmptyHint = false,
  stepHint = null,
}: RecipeDraftPanelProps) {
  const { t } = useTranslation();
  const [groupings, setGroupings] = useState<RawMaterialGroup[]>([]);
  const [isLoadingGroupings, setIsLoadingGroupings] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoadingGroupings(true);
    void listAllRawMaterialGroups()
      .then((data) => {
        if (!cancelled) {
          setGroupings(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setGroupings([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingGroupings(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const flatLines = useMemo(() => flattenRecipeDraftLines(draft), [draft]);
  const proportionSum = getDraftProportionSum(flatLines);
  const hasComponentLines = getCompleteComponentLines(flatLines).length > 0;
  const componentProportionSum = getDraftComponentProportionSum(flatLines);

  const usedMaterialIds = useMemo(
    () =>
      new Set(
        flatLines
          .map((line) => line.rawMaterialId)
          .filter((rawMaterialId): rawMaterialId is string => Boolean(rawMaterialId))
      ),
    [flatLines]
  );

  const validationHints = useMemo(() => {
    const hints: string[] = [];
    if (hasNegativeProportion(flatLines)) {
      hints.push(t('products.recipe.errors.negativeProportion'));
    }
    if (hasDuplicateMaterials(flatLines)) {
      hints.push(t('products.recipe.errors.duplicateMaterial'));
    }
    return hints;
  }, [flatLines, t]);

  const displayError =
    errorMessage === 'UNEXPECTED'
      ? t('products.recipe.errors.unexpected')
      : errorMessage;

  const isEmpty =
    draft.lines.length === 0 && draft.groups.length === 0;

  function updateLine(next: RecipeDraftLine) {
    onChange({
      ...draft,
      lines: draft.lines.map((line) => (line.key === next.key ? next : line)),
    });
  }

  function removeLine(key: string) {
    onChange({
      ...draft,
      lines: draft.lines.filter((line) => line.key !== key),
    });
  }

  function addLine(category: RecipeLineCategory) {
    onChange({
      ...draft,
      lines: [...draft.lines, createEmptyDraftLine(category)],
    });
  }

  function addGroup(category: RecipeLineCategory) {
    onChange({
      ...draft,
      groups: [...draft.groups, createEmptyDraftGroup(category)],
    });
  }

  function changeGroup(next: RecipeDraftGroup) {
    onChange({
      ...draft,
      groups: draft.groups.map((group) =>
        group.key === next.key ? next : group
      ),
    });
  }

  function removeGroup(key: string) {
    onChange({
      ...draft,
      groups: draft.groups.filter((group) => group.key !== key),
    });
  }

  function selectGrouping(groupKey: string, groupingId: string) {
    const grouping = groupings.find((item) => item.id === groupingId);
    if (!grouping) {
      return;
    }
    onChange({
      ...draft,
      groups: draft.groups.map((group) => {
        if (group.key !== groupKey) {
          return group;
        }
        return {
          ...group,
          sourceGroupingId: grouping.id,
          name: grouping.name,
          lines: draftLinesFromGrouping(group.category, grouping),
        };
      }),
    });
  }

  function changeGroupLine(groupKey: string, next: RecipeDraftLine) {
    onChange({
      ...draft,
      groups: draft.groups.map((group) => {
        if (group.key !== groupKey) {
          return group;
        }
        return {
          ...group,
          lines: group.lines.map((line) =>
            line.key === next.key ? next : line
          ),
        };
      }),
    });
  }

  function removeGroupLine(groupKey: string, lineKey: string) {
    onChange({
      ...draft,
      groups: draft.groups.map((group) => {
        if (group.key !== groupKey) {
          return group;
        }
        return {
          ...group,
          lines: group.lines.filter((line) => line.key !== lineKey),
        };
      }),
    });
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

      {showEmptyHint && isEmpty ? (
        <EmptyHint>{t('products.recipe.emptyHint')}</EmptyHint>
      ) : null}

      {RECIPE_LINE_CATEGORIES.map((category) => (
        <RecipeCategoryBlock
          key={category}
          category={category}
          lines={draft.lines.filter((line) => line.category === category)}
          groups={draft.groups.filter((group) => group.category === category)}
          materials={materials}
          usedMaterialIds={usedMaterialIds}
          groupings={groupings}
          isLoadingGroupings={isLoadingGroupings}
          onAddLine={() => addLine(category)}
          onAddGroup={() => addGroup(category)}
          onChangeLine={updateLine}
          onRemoveLine={removeLine}
          onChangeGroup={changeGroup}
          onRemoveGroup={removeGroup}
          onSelectGrouping={selectGrouping}
          onChangeGroupLine={changeGroupLine}
          onRemoveGroupLine={removeGroupLine}
        />
      ))}

      <ProportionSumBanner role="status">
        <ProportionSumLabel>{t('products.recipe.proportionSum')}</ProportionSumLabel>
        <ProportionSumValue>Σ = {formatDecimal(proportionSum, 6)}</ProportionSumValue>
      </ProportionSumBanner>

      {hasComponentLines ? (
        <ProportionSumBanner role="status">
          <ProportionSumLabel>
            {t('products.recipe.componentProportionSum')}
          </ProportionSumLabel>
          <ProportionSumValue>
            Σ = {formatDecimal(componentProportionSum, 6)}
          </ProportionSumValue>
        </ProportionSumBanner>
      ) : null}

      {validationHints.length > 0 ? (
        <Alert severity="warning" role="status">
          {validationHints.join(' ')}
        </Alert>
      ) : null}
    </>
  );
}

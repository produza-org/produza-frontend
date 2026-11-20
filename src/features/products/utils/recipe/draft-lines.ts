import type { RawMaterialGroup } from '@/features/groupings/types/grouping';
import type {
  Recipe,
  RecipeGroup,
  RecipeGroupInput,
  RecipeLine,
  RecipeLineCategory,
  RecipeLineInput,
  RecipeUpsertInput,
} from '@/features/products/types/recipe';
import { parseDecimalInput } from '@/features/products/utils/format';
import {
  computeProportionSum,
  isProportionSumValid,
} from '@/features/products/utils/recipe/proportion-sum';

export type RecipeDraftLine = {
  key: string;
  rawMaterialId: string;
  category: RecipeLineCategory;
  proportionDisplay: string;
  unit: string;
};

export type RecipeDraftGroup = {
  key: string;
  category: RecipeLineCategory;
  sourceGroupingId: string | null;
  name: string;
  lines: RecipeDraftLine[];
};

export type RecipeDraft = {
  lines: RecipeDraftLine[];
  groups: RecipeDraftGroup[];
};

let draftKeyCounter = 0;

export function createDraftLineKey(): string {
  draftKeyCounter += 1;
  return `draft-${draftKeyCounter}`;
}

export function createEmptyDraftLine(category: RecipeLineCategory): RecipeDraftLine {
  return {
    key: createDraftLineKey(),
    rawMaterialId: '',
    category,
    proportionDisplay: '',
    unit: '',
  };
}

export function createEmptyDraftGroup(category: RecipeLineCategory): RecipeDraftGroup {
  return {
    key: createDraftLineKey(),
    category,
    sourceGroupingId: null,
    name: '',
    lines: [],
  };
}

export function createEmptyRecipeDraft(): RecipeDraft {
  return { lines: [], groups: [] };
}

export function flattenRecipeDraftLines(draft: RecipeDraft): RecipeDraftLine[] {
  return [...draft.lines, ...draft.groups.flatMap((group) => group.lines)];
}

export function recipeLinesToDrafts(lines: RecipeLine[]): RecipeDraftLine[] {
  return [...lines]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((line) => ({
      key: line.id,
      rawMaterialId: line.rawMaterialId,
      category: line.category,
      proportionDisplay: String(line.proportion),
      unit: line.unit || line.rawMaterial?.unit || '',
    }));
}

export function recipeGroupsToDrafts(groups: RecipeGroup[]): RecipeDraftGroup[] {
  return [...groups]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((group) => ({
      key: group.id,
      category: group.category,
      sourceGroupingId: group.sourceGroupingId ?? null,
      name: group.name,
      lines: recipeLinesToDrafts(group.lines),
    }));
}

export function recipeToDraft(recipe: Recipe | null | undefined): RecipeDraft {
  if (!recipe) {
    return createEmptyRecipeDraft();
  }
  return {
    lines: recipeLinesToDrafts(recipe.lines),
    groups: recipeGroupsToDrafts(recipe.groups ?? []),
  };
}

export function draftLinesFromGrouping(
  category: RecipeLineCategory,
  grouping: RawMaterialGroup
): RecipeDraftLine[] {
  return (grouping.lines ?? []).map((line) => ({
    key: createDraftLineKey(),
    rawMaterialId: line.rawMaterialId,
    category,
    proportionDisplay: String(line.quantity),
    unit: line.rawMaterial?.unit ?? '',
  }));
}

export function isDraftLineComplete(line: RecipeDraftLine): boolean {
  if (!line.rawMaterialId) {
    return false;
  }
  const proportion = parseDecimalInput(line.proportionDisplay);
  return Number.isFinite(proportion);
}

export function stripIncompleteDraftLines(lines: RecipeDraftLine[]): RecipeDraftLine[] {
  return lines.filter(isDraftLineComplete);
}

export function toRecipeLineInputs(lines: RecipeDraftLine[]): RecipeLineInput[] {
  return stripIncompleteDraftLines(lines).map((line, index) => ({
    rawMaterialId: line.rawMaterialId,
    category: line.category,
    proportion: parseDecimalInput(line.proportionDisplay),
    sortOrder: index,
  }));
}

export function toRecipeGroupInputs(groups: RecipeDraftGroup[]): RecipeGroupInput[] {
  const result: RecipeGroupInput[] = [];
  for (const [groupIndex, group] of groups.entries()) {
    const lines = stripIncompleteDraftLines(group.lines).map((line, index) => ({
      rawMaterialId: line.rawMaterialId,
      proportion: parseDecimalInput(line.proportionDisplay),
      sortOrder: index,
    }));
    if (lines.length === 0 || !group.name.trim()) {
      continue;
    }
    result.push({
      category: group.category,
      name: group.name.trim(),
      sourceGroupingId: group.sourceGroupingId,
      sortOrder: groupIndex,
      lines,
    });
  }
  return result;
}

export function toRecipeUpsertInput(draft: RecipeDraft): RecipeUpsertInput {
  return {
    lines: toRecipeLineInputs(draft.lines),
    groups: toRecipeGroupInputs(draft.groups),
  };
}

export function getAllRecipeLines(recipe: Recipe | null | undefined): RecipeLine[] {
  if (!recipe) {
    return [];
  }
  return [
    ...(recipe.lines ?? []),
    ...(recipe.groups ?? []).flatMap((group) =>
      group.lines.map((line) => ({
        ...line,
        category: group.category,
      }))
    ),
  ];
}

export function getCompleteRawMaterialLines(lines: RecipeDraftLine[]): RecipeDraftLine[] {
  return stripIncompleteDraftLines(lines).filter(
    (line) => line.category === 'MATERIA_PRIMA'
  );
}

export function getCompleteComponentLines(lines: RecipeDraftLine[]): RecipeDraftLine[] {
  return stripIncompleteDraftLines(lines).filter(
    (line) => line.category === 'COMPONENTE'
  );
}

export function getDraftProportionSum(lines: RecipeDraftLine[]): number {
  return computeProportionSum(
    getCompleteRawMaterialLines(lines).map((line) => ({
      proportion: parseDecimalInput(line.proportionDisplay),
    }))
  );
}

export function getDraftComponentProportionSum(lines: RecipeDraftLine[]): number {
  return computeProportionSum(
    getCompleteComponentLines(lines).map((line) => ({
      proportion: parseDecimalInput(line.proportionDisplay),
    }))
  );
}

export function isComponentProportionSumValid(lines: RecipeDraftLine[]): boolean {
  const componentLines = getCompleteComponentLines(lines);
  if (componentLines.length === 0) {
    return true;
  }
  return isProportionSumValid(getDraftComponentProportionSum(lines));
}

export function hasNegativeProportion(lines: RecipeDraftLine[]): boolean {
  return stripIncompleteDraftLines(lines).some(
    (line) => parseDecimalInput(line.proportionDisplay) < 0
  );
}

export function hasDuplicateMaterials(lines: RecipeDraftLine[]): boolean {
  const ids = stripIncompleteDraftLines(lines).map((line) => line.rawMaterialId);
  return new Set(ids).size !== ids.length;
}

export function canSaveRecipeDraft(
  draft: RecipeDraft | RecipeDraftLine[]
): boolean {
  const lines = Array.isArray(draft) ? draft : flattenRecipeDraftLines(draft);
  return (
    isProportionSumValid(getDraftProportionSum(lines)) &&
    isComponentProportionSumValid(lines) &&
    !hasNegativeProportion(lines) &&
    !hasDuplicateMaterials(lines)
  );
}

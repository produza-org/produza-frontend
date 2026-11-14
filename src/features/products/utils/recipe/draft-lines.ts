import type { RecipeLine, RecipeLineInput } from '@/features/products/types/recipe';
import { parseDecimalInput } from '@/features/products/utils/format';
import {
  computeProportionSum,
  isProportionSumValid,
} from '@/features/products/utils/recipe/proportion-sum';

export type RecipeDraftLine = {
  key: string;
  rawMaterialId: string;
  proportionDisplay: string;
  unit: string;
};

let draftKeyCounter = 0;

export function createDraftLineKey(): string {
  draftKeyCounter += 1;
  return `draft-${draftKeyCounter}`;
}

export function createEmptyDraftLine(): RecipeDraftLine {
  return {
    key: createDraftLineKey(),
    rawMaterialId: '',
    proportionDisplay: '',
    unit: '',
  };
}

export function recipeLinesToDrafts(lines: RecipeLine[]): RecipeDraftLine[] {
  return [...lines]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((line) => ({
      key: line.id,
      rawMaterialId: line.rawMaterialId,
      proportionDisplay: String(line.proportion),
      unit: line.unit || line.rawMaterial?.unit || '',
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
    proportion: parseDecimalInput(line.proportionDisplay),
    sortOrder: index,
  }));
}

export function getDraftProportionSum(lines: RecipeDraftLine[]): number {
  return computeProportionSum(
    stripIncompleteDraftLines(lines).map((line) => ({
      proportion: parseDecimalInput(line.proportionDisplay),
    }))
  );
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

export function canSaveRecipeDraft(lines: RecipeDraftLine[]): boolean {
  return (
    isProportionSumValid(getDraftProportionSum(lines)) &&
    !hasNegativeProportion(lines) &&
    !hasDuplicateMaterials(lines)
  );
}

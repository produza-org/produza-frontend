import type {
  RecipeLine,
  RecipeLineCategory,
  RecipeLineInput,
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

export function canSaveRecipeDraft(lines: RecipeDraftLine[]): boolean {
  return (
    isProportionSumValid(getDraftProportionSum(lines)) &&
    isComponentProportionSumValid(lines) &&
    !hasNegativeProportion(lines) &&
    !hasDuplicateMaterials(lines)
  );
}

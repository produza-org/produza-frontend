import { RECIPE_PACKAGING_UNIT } from '@/features/products/constants';
import type {
  RecipeLine,
  RecipeLineCategory,
  RecipeLineInput,
} from '@/features/products/types/recipe';
import { parseDecimalInput } from '@/features/products/utils/format';
import {
  computeComponentSum,
  isComponentSumValid,
} from '@/features/products/utils/recipe/component-sum';

export type RecipeDraftLine = {
  key: string;
  rawMaterialId: string;
  category: RecipeLineCategory;
  unitConsumptionDisplay: string;
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
    unitConsumptionDisplay: '',
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
      unitConsumptionDisplay: String(line.unitConsumption),
      unit: line.unit || line.rawMaterial?.unit || '',
    }));
}

export function isDraftLineComplete(line: RecipeDraftLine): boolean {
  if (!line.rawMaterialId) {
    return false;
  }
  const consumption = parseDecimalInput(line.unitConsumptionDisplay);
  return Number.isFinite(consumption);
}

export function stripIncompleteDraftLines(lines: RecipeDraftLine[]): RecipeDraftLine[] {
  return lines.filter(isDraftLineComplete);
}

export function toRecipeLineInputs(lines: RecipeDraftLine[]): RecipeLineInput[] {
  return stripIncompleteDraftLines(lines).map((line, index) => ({
    rawMaterialId: line.rawMaterialId,
    category: line.category,
    unitConsumption: parseDecimalInput(line.unitConsumptionDisplay),
    sortOrder: index,
  }));
}

export function getCompleteComponentLines(lines: RecipeDraftLine[]): RecipeDraftLine[] {
  return stripIncompleteDraftLines(lines).filter((line) => line.category === 'COMPONENTE');
}

export function getDraftComponentSum(lines: RecipeDraftLine[]): number {
  return computeComponentSum(
    getCompleteComponentLines(lines).map((line) => ({
      category: line.category,
      unitConsumption: parseDecimalInput(line.unitConsumptionDisplay),
    }))
  );
}

export function hasNegativeConsumption(lines: RecipeDraftLine[]): boolean {
  return stripIncompleteDraftLines(lines).some(
    (line) => parseDecimalInput(line.unitConsumptionDisplay) < 0
  );
}

export function hasInvalidPackagingUnit(lines: RecipeDraftLine[]): boolean {
  return stripIncompleteDraftLines(lines).some(
    (line) => line.category === 'EMBALAGEM' && line.unit !== RECIPE_PACKAGING_UNIT
  );
}

export function hasDuplicateMaterials(lines: RecipeDraftLine[]): boolean {
  const ids = stripIncompleteDraftLines(lines).map((line) => line.rawMaterialId);
  return new Set(ids).size !== ids.length;
}

export function canSaveRecipeDraft(lines: RecipeDraftLine[]): boolean {
  return (
    isComponentSumValid(getDraftComponentSum(lines)) &&
    !hasNegativeConsumption(lines) &&
    !hasInvalidPackagingUnit(lines) &&
    !hasDuplicateMaterials(lines)
  );
}

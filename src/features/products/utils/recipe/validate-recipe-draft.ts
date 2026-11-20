import type { FieldErrors } from '@/shared/form-validation';
import { parseDecimalInput } from '@/features/products/utils/format';
import {
  flattenRecipeDraftLines,
  getCompleteComponentLines,
  getCompleteRawMaterialLines,
  getDraftComponentProportionSum,
  isDraftLineComplete,
  type RecipeDraft,
  type RecipeDraftGroup,
  type RecipeDraftLine,
} from '@/features/products/utils/recipe/draft-lines';
import { isProportionSumValid } from '@/features/products/utils/recipe/proportion-sum';

export type RecipeDraftMessages = {
  rawMaterialRequired: string;
  materialRequired: string;
  proportionRequired: string;
  proportionNegative: string;
  duplicateMaterial: string;
  componentSumInvalid: string;
  groupRequired: string;
};

export function recipeMaterialFieldId(lineKey: string): string {
  return `recipe-material-${lineKey}`;
}

export function recipeProportionFieldId(lineKey: string): string {
  return `recipe-proportion-${lineKey}`;
}

export function recipeGroupFieldId(groupKey: string): string {
  return `recipe-group-${groupKey}`;
}

export function recipeCategoryFieldId(category: string): string {
  return `recipe-category-${category}`;
}

function collectLineFieldOrder(
  lines: RecipeDraftLine[],
  groups: RecipeDraftGroup[]
): string[] {
  const order: string[] = [recipeCategoryFieldId('MATERIA_PRIMA')];
  for (const line of lines) {
    order.push(recipeMaterialFieldId(line.key), recipeProportionFieldId(line.key));
  }
  for (const group of groups) {
    order.push(recipeGroupFieldId(group.key));
    for (const line of group.lines) {
      order.push(
        recipeMaterialFieldId(line.key),
        recipeProportionFieldId(line.key)
      );
    }
  }
  return order;
}

export function getRecipeDraftFieldOrder(draft: RecipeDraft): string[] {
  return collectLineFieldOrder(draft.lines, draft.groups);
}

function markIncompleteLine(
  line: RecipeDraftLine,
  errors: FieldErrors,
  messages: RecipeDraftMessages
): void {
  if (!line.rawMaterialId) {
    errors[recipeMaterialFieldId(line.key)] = messages.materialRequired;
  }
  const proportion = parseDecimalInput(line.proportionDisplay);
  if (!Number.isFinite(proportion)) {
    errors[recipeProportionFieldId(line.key)] = messages.proportionRequired;
  } else if (proportion < 0) {
    errors[recipeProportionFieldId(line.key)] = messages.proportionNegative;
  }
}

export function validateRecipeDraft(
  draft: RecipeDraft,
  messages: RecipeDraftMessages
): FieldErrors {
  const errors: FieldErrors = {};
  const flatLines = flattenRecipeDraftLines(draft);

  for (const group of draft.groups) {
    if (!group.sourceGroupingId && group.lines.length === 0) {
      errors[recipeGroupFieldId(group.key)] = messages.groupRequired;
    }
  }

  for (const line of draft.lines) {
    const hasAnyInput =
      Boolean(line.rawMaterialId) || Boolean(line.proportionDisplay.trim());
    if (hasAnyInput && !isDraftLineComplete(line)) {
      markIncompleteLine(line, errors, messages);
    } else if (isDraftLineComplete(line)) {
      const proportion = parseDecimalInput(line.proportionDisplay);
      if (proportion < 0) {
        errors[recipeProportionFieldId(line.key)] = messages.proportionNegative;
      }
    }
  }

  for (const group of draft.groups) {
    for (const line of group.lines) {
      if (!isDraftLineComplete(line)) {
        markIncompleteLine(line, errors, messages);
      } else {
        const proportion = parseDecimalInput(line.proportionDisplay);
        if (proportion < 0) {
          errors[recipeProportionFieldId(line.key)] =
            messages.proportionNegative;
        }
      }
    }
  }

  if (getCompleteRawMaterialLines(flatLines).length === 0) {
    const hasIncompleteMp =
      draft.lines.some(
        (line) =>
          line.category === 'MATERIA_PRIMA' &&
          (Boolean(line.rawMaterialId) || Boolean(line.proportionDisplay.trim()))
      ) ||
      draft.groups.some(
        (group) =>
          group.category === 'MATERIA_PRIMA' && group.lines.length > 0
      );
    if (!hasIncompleteMp) {
      errors[recipeCategoryFieldId('MATERIA_PRIMA')] =
        messages.rawMaterialRequired;
    }
  }

  const seen = new Set<string>();
  for (const line of flatLines) {
    if (!isDraftLineComplete(line)) {
      continue;
    }
    if (seen.has(line.rawMaterialId)) {
      errors[recipeMaterialFieldId(line.key)] = messages.duplicateMaterial;
    }
    seen.add(line.rawMaterialId);
  }

  const componentLines = getCompleteComponentLines(flatLines);
  if (
    componentLines.length > 0 &&
    !isProportionSumValid(getDraftComponentProportionSum(flatLines))
  ) {
    for (const line of componentLines) {
      errors[recipeProportionFieldId(line.key)] = messages.componentSumInvalid;
    }
  }

  return errors;
}

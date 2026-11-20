import type { FieldErrors } from '@/shared/form-validation';
import { parseDecimalInput } from '@/features/groupings/utils/format';
import type { GroupingDraftLine } from '@/features/groupings/utils/composition/draft-lines';

export const GROUPING_COMPOSITION_ROOT_ID = 'grouping-composition';

export type GroupingCompositionMessages = {
  linesRequired: string;
  quantityInvalid: string;
};

export function groupingQtyFieldId(lineKey: string): string {
  return `grouping-qty-${lineKey}`;
}

export function getGroupingCompositionFieldOrder(
  lines: GroupingDraftLine[]
): string[] {
  return [
    GROUPING_COMPOSITION_ROOT_ID,
    ...lines.map((line) => groupingQtyFieldId(line.key)),
  ];
}

export function validateGroupingComposition(
  lines: GroupingDraftLine[],
  messages: GroupingCompositionMessages
): FieldErrors {
  const errors: FieldErrors = {};

  if (lines.length === 0) {
    errors[GROUPING_COMPOSITION_ROOT_ID] = messages.linesRequired;
    return errors;
  }

  for (const line of lines) {
    const quantity = parseDecimalInput(line.quantityDisplay);
    if (!(quantity > 0) || !Number.isFinite(quantity)) {
      errors[groupingQtyFieldId(line.key)] = messages.quantityInvalid;
    }
  }

  return errors;
}

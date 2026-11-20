import type { FieldErrors } from '@/shared/form-validation';
import type { GroupingBasicsFormValues } from '@/features/groupings/types/grouping-form';

export const GROUPING_BASICS_FIELD_ORDER = [
  'grouping-name',
  'grouping-code',
  'grouping-description',
] as const;

export type GroupingBasicsMessages = {
  nameRequired: string;
  codeRequired: string;
};

export function validateGroupingBasics(
  values: GroupingBasicsFormValues,
  messages: GroupingBasicsMessages
): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.name.trim()) {
    errors['grouping-name'] = messages.nameRequired;
  }

  if (!values.code.trim()) {
    errors['grouping-code'] = messages.codeRequired;
  }

  return errors;
}

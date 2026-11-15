import type {
  GroupingBasicsFormValues,
  GroupingBasicsSubmitValues,
} from '@/features/groupings/types/grouping-form';

export function isBasicsValid(values: GroupingBasicsFormValues): boolean {
  return Boolean(values.name.trim()) && Boolean(values.code.trim());
}

export function toBasicsFormValues(
  values: GroupingBasicsSubmitValues
): GroupingBasicsFormValues {
  return {
    name: values.name,
    code: values.code,
    description: values.description ?? '',
  };
}

export function toBasicsSubmitValues(
  values: GroupingBasicsFormValues
): GroupingBasicsSubmitValues {
  const description = values.description.trim();
  return {
    name: values.name.trim(),
    code: values.code.trim(),
    ...(description ? { description } : {}),
  };
}

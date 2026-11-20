import { useContext } from 'react';
import { FormValidationContext } from '@/shared/form-validation/FormValidationContext';
import type { FormValidationContextValue } from '@/shared/form-validation/types';

export function useFormValidation(): FormValidationContextValue {
  const ctx = useContext(FormValidationContext);
  if (!ctx) {
    throw new Error(
      'useFormValidation must be used within FormValidationProvider'
    );
  }
  return ctx;
}

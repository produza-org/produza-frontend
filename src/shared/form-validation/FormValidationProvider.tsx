import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { FormValidationContext } from '@/shared/form-validation/FormValidationContext';
import { scrollToFirstError } from '@/shared/form-validation/scrollToFirstError';
import type { FieldErrors } from '@/shared/form-validation/types';

export function FormValidationProvider({ children }: { children: ReactNode }) {
  const [errors, setErrorsState] = useState<FieldErrors>({});

  const setErrors = useCallback((next: FieldErrors) => {
    setErrorsState(next);
  }, []);

  const clearErrors = useCallback(() => {
    setErrorsState({});
  }, []);

  const clearField = useCallback((fieldId: string) => {
    setErrorsState((prev) => {
      if (!(fieldId in prev)) {
        return prev;
      }
      const next = { ...prev };
      delete next[fieldId];
      return next;
    });
  }, []);

  const getError = useCallback(
    (fieldId: string) => errors[fieldId],
    [errors]
  );

  const submitWithValidation = useCallback(
    (
      validate: () => FieldErrors,
      onValid: () => void | Promise<void>,
      fieldOrder?: string[]
    ) => {
      const nextErrors = validate();
      setErrorsState(nextErrors);
      const keys = Object.keys(nextErrors);
      if (keys.length > 0) {
        const ordered =
          fieldOrder && fieldOrder.length > 0
            ? fieldOrder.filter((id) => id in nextErrors)
            : keys;
        scrollToFirstError(ordered.length > 0 ? ordered : keys);
        return;
      }
      void onValid();
    },
    []
  );

  const value = useMemo(
    () => ({
      errors,
      setErrors,
      clearErrors,
      clearField,
      getError,
      submitWithValidation,
    }),
    [errors, setErrors, clearErrors, clearField, getError, submitWithValidation]
  );

  return (
    <FormValidationContext.Provider value={value}>
      {children}
    </FormValidationContext.Provider>
  );
}

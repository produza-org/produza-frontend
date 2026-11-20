export type FieldErrors = Record<string, string>;

export type FormValidationContextValue = {
  errors: FieldErrors;
  setErrors: (errors: FieldErrors) => void;
  clearErrors: () => void;
  clearField: (fieldId: string) => void;
  getError: (fieldId: string) => string | undefined;
  submitWithValidation: (
    validate: () => FieldErrors,
    onValid: () => void | Promise<void>,
    fieldOrder?: string[]
  ) => void;
};

import { createContext } from 'react';
import type { FormValidationContextValue } from '@/shared/form-validation/types';

export const FormValidationContext =
  createContext<FormValidationContextValue | null>(null);

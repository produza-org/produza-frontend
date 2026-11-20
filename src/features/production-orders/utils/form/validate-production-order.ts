import type { FieldErrors } from '@/shared/form-validation';
import type { ProductionOrderFormValues } from '@/features/production-orders/components/form/ProductionOrderForm';
import { parseDecimalInput } from '@/features/production-orders/utils/format';

export const PRODUCTION_ORDER_FIELD_ORDER = [
  'production-order-number',
  'production-order-product',
  'production-order-q',
  'production-order-start-date',
  'production-order-planned-end-date',
  'production-order-notes',
] as const;

export type ProductionOrderFormMessages = {
  numberRequired: string;
  productRequired: string;
  quantityInvalid: string;
  dateOrderInvalid: string;
};

export function validateProductionOrderForm(
  values: ProductionOrderFormValues,
  messages: ProductionOrderFormMessages
): FieldErrors {
  const errors: FieldErrors = {};
  const qtdAProduzir = parseDecimalInput(values.qtdDisplay);
  const startDate = values.startDate.trim();
  const plannedEndDate = values.plannedEndDate.trim();

  if (!values.number.trim()) {
    errors['production-order-number'] = messages.numberRequired;
  }

  if (!values.productId) {
    errors['production-order-product'] = messages.productRequired;
  }

  if (!Number.isFinite(qtdAProduzir) || !(qtdAProduzir > 0)) {
    errors['production-order-q'] = messages.quantityInvalid;
  }

  if (startDate && plannedEndDate && startDate > plannedEndDate) {
    errors['production-order-planned-end-date'] = messages.dateOrderInvalid;
  }

  return errors;
}

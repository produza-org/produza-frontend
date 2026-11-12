import { apiClient } from '@/core/api';
import type {
  ProductionStep,
  ProductionStepsUpdateInput,
} from '@/features/production-orders/types/production-order';

export function getProductionOrderSteps(
  orderId: string
): Promise<ProductionStep[]> {
  return apiClient<ProductionStep[]>(`/production-orders/${orderId}/steps`);
}

export function updateProductionOrderSteps(
  orderId: string,
  input: ProductionStepsUpdateInput
): Promise<ProductionStep[]> {
  return apiClient<ProductionStep[]>(`/production-orders/${orderId}/steps`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

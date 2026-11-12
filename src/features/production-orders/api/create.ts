import { apiClient } from '@/core/api';
import type {
  ProductionOrder,
  ProductionOrderCreateInput,
} from '@/features/production-orders/types/production-order';

export function createProductionOrderRequest(
  input: ProductionOrderCreateInput
): Promise<ProductionOrder> {
  return apiClient<ProductionOrder>('/production-orders', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

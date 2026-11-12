import { apiClient } from '@/core/api';
import type {
  ProductionOrder,
  ProductionOrderUpdateInput,
} from '@/features/production-orders/types/production-order';

export function updateProductionOrderRequest(
  id: string,
  input: ProductionOrderUpdateInput
): Promise<ProductionOrder> {
  return apiClient<ProductionOrder>(`/production-orders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

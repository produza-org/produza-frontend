import { apiClient } from '@/core/api';
import type { ProductionOrder } from '@/features/production-orders/types/production-order';

export function getProductionOrder(id: string): Promise<ProductionOrder> {
  return apiClient<ProductionOrder>(`/production-orders/${id}`);
}

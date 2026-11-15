import { apiClient } from '@/core/api';

export function deleteProductionOrderRequest(id: string): Promise<void> {
  return apiClient<void>(`/production-orders/${id}`, {
    method: 'DELETE',
  });
}

import { apiClient } from '@/core/api';
import type { ProductionOrder } from '@/features/production-orders/types/production-order';

export function recalculateProductionOrderFromRecipe(
  id: string
): Promise<ProductionOrder> {
  return apiClient<ProductionOrder>(
    `/production-orders/${id}/recalculate-from-recipe`,
    {
      method: 'POST',
    }
  );
}

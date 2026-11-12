import { useMemo } from 'react';
import { useProductionOrdersContext } from '@/features/production-orders/context/ProductionOrdersContext';

export function useProductionOrdersStats() {
  const { items } = useProductionOrdersContext();

  return useMemo(() => {
    const totalCount = items.length;
    const totalMisturaSum = items.reduce(
      (sum, item) => sum + item.totalMisturaKg,
      0
    );
    const averageQ =
      totalCount === 0
        ? 0
        : items.reduce((sum, item) => sum + item.qtdAProduzir, 0) / totalCount;

    return {
      totalCount,
      totalMisturaSum,
      averageQ,
    };
  }, [items]);
}

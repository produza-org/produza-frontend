import { useMemo } from 'react';
import { useGroupingsContext } from '@/features/groupings/context/GroupingsContext';

export function useGroupingsStats() {
  const { items } = useGroupingsContext();

  return useMemo(() => {
    const activeItems = items.filter((item) => item.status === 'active');
    const totalCount = items.length;
    const activeCount = activeItems.length;
    const activePercent =
      totalCount === 0 ? 0 : Math.round((activeCount / totalCount) * 100);
    const totalCost = activeItems.reduce((sum, item) => sum + item.totalCost, 0);
    const totalMaterials = activeItems.reduce(
      (sum, item) => sum + item.materialsCount,
      0
    );

    return {
      totalCount,
      activePercent,
      totalCost,
      totalMaterials,
    };
  }, [items]);
}

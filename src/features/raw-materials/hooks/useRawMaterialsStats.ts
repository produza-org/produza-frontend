import { useMemo } from 'react';
import {
  RAW_MATERIALS_CRITICAL_STOCK_THRESHOLD,
} from '@/features/raw-materials/constants';
import { useRawMaterialsContext } from '@/features/raw-materials/context/RawMaterialsContext';

export function useRawMaterialsStats() {
  const { items } = useRawMaterialsContext();

  return useMemo(() => {
    const totalCount = items.length;
    const totalCost = items.reduce((sum, item) => sum + item.totalCost, 0);
    const activeCount = items.filter((item) => item.stockQuantity > 0).length;
    const activePercent =
      totalCount === 0 ? 0 : Math.round((activeCount / totalCount) * 100);
    const criticalCount = items.filter(
      (item) => item.stockQuantity > 0 && item.stockQuantity < RAW_MATERIALS_CRITICAL_STOCK_THRESHOLD
    ).length;

    return { totalCount, totalCost, activePercent, criticalCount };
  }, [items]);
}

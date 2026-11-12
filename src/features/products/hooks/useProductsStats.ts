import { useMemo } from 'react';
import { useProductsContext } from '@/features/products/context/ProductsContext';

export function useProductsStats() {
  const { items } = useProductsContext();

  return useMemo(() => {
    const totalCount = items.length;
    const activeCount = items.filter((item) => item.status === 'active').length;
    const activePercent =
      totalCount === 0 ? 0 : Math.round((activeCount / totalCount) * 100);
    const averageYield =
      totalCount === 0
        ? 0
        : items.reduce((sum, item) => sum + item.yield, 0) / totalCount;
    const averageExpansion =
      totalCount === 0
        ? 0
        : items.reduce((sum, item) => sum + item.expansionFactor, 0) / totalCount;

    return { totalCount, activePercent, averageYield, averageExpansion };
  }, [items]);
}

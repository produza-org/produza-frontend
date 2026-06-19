import { useMemo } from 'react';
import { rawMaterialsMock } from '@/features/raw-materials/mocks/raw-materials.mock';

export function useFilteredRawMaterials(nameFilter: string, codeFilter: string) {
  return useMemo(
    () =>
      rawMaterialsMock.filter((item) => {
        const n = nameFilter.trim().toLowerCase();
        const c = codeFilter.trim().toLowerCase();
        return (
          (n.length === 0 || item.name.toLowerCase().includes(n)) &&
          (c.length === 0 || item.code.toLowerCase().includes(c))
        );
      }),
    [nameFilter, codeFilter]
  );
}

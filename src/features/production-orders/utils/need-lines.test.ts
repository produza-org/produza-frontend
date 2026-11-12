import { describe, expect, it } from 'vitest';
import type { ProductionOrderNeedLine } from '@/features/production-orders/types/production-order';
import { groupNeedLinesByCategory } from '@/features/production-orders/utils/need-lines';

function line(
  partial: Pick<
    ProductionOrderNeedLine,
    'id' | 'category' | 'sortOrder' | 'rawMaterialCode'
  >
): ProductionOrderNeedLine {
  return {
    id: partial.id,
    category: partial.category,
    rawMaterialId: `rm-${partial.id}`,
    rawMaterialCode: partial.rawMaterialCode,
    rawMaterialName: partial.rawMaterialCode,
    unit: 'KG',
    unitConsumptionSnapshot: 1,
    quantityE: 1,
    sortOrder: partial.sortOrder,
  };
}

describe('groupNeedLinesByCategory', () => {
  it('groups and sorts lines by category order', () => {
    const grouped = groupNeedLinesByCategory([
      line({
        id: '2',
        category: 'EMBALAGEM',
        sortOrder: 0,
        rawMaterialCode: 'MP-EMB-POTE',
      }),
      line({
        id: '1',
        category: 'COMPONENTE',
        sortOrder: 1,
        rawMaterialCode: 'MP-002',
      }),
      line({
        id: '0',
        category: 'COMPONENTE',
        sortOrder: 0,
        rawMaterialCode: 'MP-006',
      }),
      line({
        id: '3',
        category: 'MATERIA_PRIMA',
        sortOrder: 0,
        rawMaterialCode: 'MP-018',
      }),
    ]);

    expect(grouped.map((group) => group.category)).toEqual([
      'COMPONENTE',
      'MATERIA_PRIMA',
      'EMBALAGEM',
    ]);
    expect(grouped[0].lines.map((item) => item.rawMaterialCode)).toEqual([
      'MP-006',
      'MP-002',
    ]);
    expect(grouped[1].lines.map((item) => item.rawMaterialCode)).toEqual([
      'MP-018',
    ]);
    expect(grouped[2].lines.map((item) => item.rawMaterialCode)).toEqual([
      'MP-EMB-POTE',
    ]);
  });
});

import { describe, expect, it } from 'vitest';
import type { RawMaterialGroup } from '@/features/groupings/types/grouping';
import { filterGroupings } from './groupings-list';

const groups: RawMaterialGroup[] = [
  {
    id: '1',
    name: 'BASE LEITE COCO',
    code: 'GRP-001',
    status: 'active',
    materialsCount: 1,
    totalCost: 1.5,
    lines: [
      {
        id: 'l1',
        rawMaterialId: 'mp-1',
        quantity: 1.5,
        rawMaterial: {
          id: 'mp-1',
          code: 'MP-006',
          name: 'AGUA',
          unit: 'LITRO',
          unitCost: 1,
          stockQuantity: 10,
        },
      },
    ],
  },
  {
    id: '2',
    name: 'BASE CHOCOLATE',
    code: 'GRP-002',
    status: 'active',
    materialsCount: 0,
    totalCost: 0,
    lines: [],
  },
];

describe('filterGroupings', () => {
  it('filters by name, code and raw material', () => {
    expect(filterGroupings(groups, 'leite', '', '')).toHaveLength(1);
    expect(filterGroupings(groups, '', 'grp-002', '')).toHaveLength(1);
    expect(filterGroupings(groups, '', '', 'mp-006')).toHaveLength(1);
    expect(filterGroupings(groups, '', '', 'agua')).toHaveLength(1);
    expect(filterGroupings(groups, 'x', '', '')).toHaveLength(0);
  });
});

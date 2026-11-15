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
    materialsCount: 1,
    totalCost: 2,
    lines: [
      {
        id: 'l2',
        rawMaterialId: 'mp-2',
        quantity: 1,
        rawMaterial: {
          id: 'mp-2',
          code: 'MP-002',
          name: 'ACUCAR',
          unit: 'KG',
          unitCost: 2,
          stockQuantity: 5,
        },
      },
    ],
  },
];

describe('filterGroupings', () => {
  it('filters by name, code and raw material ids', () => {
    expect(filterGroupings(groups, 'leite', '', [])).toHaveLength(1);
    expect(filterGroupings(groups, '', 'grp-002', [])).toHaveLength(1);
    expect(filterGroupings(groups, '', '', ['mp-1'])).toHaveLength(1);
    expect(filterGroupings(groups, '', '', ['mp-1', 'mp-2'])).toHaveLength(2);
    expect(filterGroupings(groups, 'x', '', [])).toHaveLength(0);
    expect(filterGroupings(groups, '', '', ['missing'])).toHaveLength(0);
  });
});

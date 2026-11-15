import { describe, expect, it } from 'vitest';
import type { RawMaterial } from '@/features/raw-materials/types/raw-material';
import {
  canSaveCompositionDraft,
  draftLineFromMaterial,
  getDraftTotalCost,
  mergeDraftLines,
  toGroupingLineInputs,
} from './draft-lines';

const materialA: RawMaterial = {
  id: 'mp-a',
  code: 'MP-A',
  name: 'Agua',
  status: 'active',
  stockQuantity: 100,
  minStock: 1,
  unit: 'LITRO',
  unitCost: 0.5,
  totalCost: 50,
};

const materialB: RawMaterial = {
  id: 'mp-b',
  code: 'MP-B',
  name: 'Leite',
  status: 'active',
  stockQuantity: 40,
  minStock: 1,
  unit: 'LITRO',
  unitCost: 2,
  totalCost: 80,
};

describe('grouping draft lines', () => {
  it('merges selected materials and updates quantity when already present', () => {
    const existing = [draftLineFromMaterial(materialA, '1')];
    const merged = mergeDraftLines(existing, [
      { material: materialA, quantityDisplay: '3' },
      { material: materialB, quantityDisplay: '2' },
    ]);

    expect(merged).toHaveLength(2);
    expect(merged[0].rawMaterialId).toBe('mp-a');
    expect(merged[0].quantityDisplay).toBe('3');
    expect(merged[1].rawMaterialId).toBe('mp-b');
  });

  it('computes total cost and validates save readiness', () => {
    const lines = [
      draftLineFromMaterial(materialA, '2'),
      draftLineFromMaterial(materialB, '1.5'),
    ];

    expect(getDraftTotalCost(lines)).toBe(4);
    expect(canSaveCompositionDraft(lines)).toBe(true);
    expect(canSaveCompositionDraft([])).toBe(false);
    expect(
      canSaveCompositionDraft([draftLineFromMaterial(materialA, '0')])
    ).toBe(false);
  });

  it('maps draft lines to API payloads', () => {
    const lines = [
      draftLineFromMaterial(materialA, '1.5'),
      draftLineFromMaterial(materialB, '2'),
    ];

    expect(toGroupingLineInputs(lines)).toEqual([
      { rawMaterialId: 'mp-a', quantity: 1.5 },
      { rawMaterialId: 'mp-b', quantity: 2 },
    ]);
  });
});

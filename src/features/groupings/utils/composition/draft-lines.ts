import type { RawMaterialGroupLineInput } from '@/features/groupings/types/grouping';
import { parseDecimalInput } from '@/features/groupings/utils/format';
import type { RawMaterial } from '@/features/raw-materials/types/raw-material';

export type GroupingDraftLine = {
  key: string;
  rawMaterialId: string;
  quantityDisplay: string;
  code: string;
  name: string;
  unit: string;
  unitCost: number;
  stockQuantity: number;
};

let draftKeyCounter = 0;

export function createDraftLineKey(): string {
  draftKeyCounter += 1;
  return `grouping-line-${draftKeyCounter}`;
}

export function draftLineFromMaterial(
  material: RawMaterial,
  quantityDisplay = '1'
): GroupingDraftLine {
  return {
    key: createDraftLineKey(),
    rawMaterialId: material.id,
    quantityDisplay,
    code: material.code,
    name: material.name,
    unit: material.unit,
    unitCost: material.unitCost,
    stockQuantity: material.stockQuantity,
  };
}

export function mergeDraftLines(
  existing: GroupingDraftLine[],
  selected: Array<{ material: RawMaterial; quantityDisplay: string }>
): GroupingDraftLine[] {
  const next = [...existing];

  for (const entry of selected) {
    const index = next.findIndex(
      (line) => line.rawMaterialId === entry.material.id
    );
    if (index >= 0) {
      next[index] = {
        ...next[index],
        quantityDisplay: entry.quantityDisplay,
        code: entry.material.code,
        name: entry.material.name,
        unit: entry.material.unit,
        unitCost: entry.material.unitCost,
        stockQuantity: entry.material.stockQuantity,
      };
      continue;
    }
    next.push(draftLineFromMaterial(entry.material, entry.quantityDisplay));
  }

  return next;
}

export function getLineSubtotal(line: GroupingDraftLine): number {
  const quantity = parseDecimalInput(line.quantityDisplay);
  if (!(quantity > 0) || !Number.isFinite(line.unitCost)) {
    return 0;
  }
  return quantity * line.unitCost;
}

export function getDraftTotalCost(lines: GroupingDraftLine[]): number {
  return lines.reduce((sum, line) => sum + getLineSubtotal(line), 0);
}

export function canSaveCompositionDraft(lines: GroupingDraftLine[]): boolean {
  if (lines.length === 0) {
    return false;
  }

  return lines.every((line) => {
    const quantity = parseDecimalInput(line.quantityDisplay);
    return Boolean(line.rawMaterialId) && quantity > 0 && Number.isFinite(quantity);
  });
}

export function toGroupingLineInputs(
  lines: GroupingDraftLine[]
): RawMaterialGroupLineInput[] {
  return lines.map((line) => ({
    rawMaterialId: line.rawMaterialId,
    quantity: parseDecimalInput(line.quantityDisplay),
  }));
}

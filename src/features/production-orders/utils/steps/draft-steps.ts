import type {
  ProductionStep,
  ProductionStepInput,
} from '@/features/production-orders/types/production-order';
import { parseDecimalInput } from '@/features/production-orders/utils/format';

export type ProductionStepDraft = {
  key: string;
  id?: string;
  name: string;
  plannedMinutesDisplay: string;
  assignee: string;
};

let draftKeyCounter = 0;

export function createStepDraftKey(): string {
  draftKeyCounter += 1;
  return `step-draft-${draftKeyCounter}`;
}

export function createEmptyStepDraft(): ProductionStepDraft {
  return {
    key: createStepDraftKey(),
    name: '',
    plannedMinutesDisplay: '0',
    assignee: '',
  };
}

export function stepsToDrafts(steps: ProductionStep[]): ProductionStepDraft[] {
  return [...steps]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((step) => ({
      key: step.id,
      id: step.id,
      name: step.name,
      plannedMinutesDisplay: String(step.plannedMinutes),
      assignee: step.assignee ?? '',
    }));
}

export function isStepDraftComplete(step: ProductionStepDraft): boolean {
  if (!step.name.trim()) {
    return false;
  }
  const minutes = parseDecimalInput(step.plannedMinutesDisplay);
  return Number.isFinite(minutes) && minutes >= 0;
}

export function canSaveStepDrafts(steps: ProductionStepDraft[]): boolean {
  if (steps.length === 0) {
    return false;
  }
  return steps.every(isStepDraftComplete);
}

export function getDraftPlannedMinutesTotal(steps: ProductionStepDraft[]): number {
  return steps.reduce((sum, step) => {
    const minutes = parseDecimalInput(step.plannedMinutesDisplay);
    if (!Number.isFinite(minutes) || minutes < 0) {
      return sum;
    }
    return sum + minutes;
  }, 0);
}

export function toStepInputs(steps: ProductionStepDraft[]): ProductionStepInput[] {
  return steps.map((step, index) => ({
    ...(step.id ? { id: step.id } : {}),
    name: step.name.trim(),
    plannedMinutes: parseDecimalInput(step.plannedMinutesDisplay),
    assignee: step.assignee.trim() ? step.assignee.trim() : null,
    sortOrder: index,
  }));
}

export function sanitizeMinutesInput(value: string): string {
  const normalized = value.replace(/,/g, '.').replace(/[^\d.]/g, '');
  const firstDot = normalized.indexOf('.');
  if (firstDot === -1) {
    return normalized;
  }
  return (
    normalized.slice(0, firstDot + 1) +
    normalized.slice(firstDot + 1).replace(/\./g, '')
  );
}

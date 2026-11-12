import { describe, expect, it } from 'vitest';
import type { ProductionStep } from '@/features/production-orders/types/production-order';
import {
  canSaveStepDrafts,
  createEmptyStepDraft,
  getDraftPlannedMinutesTotal,
  stepsToDrafts,
  toStepInputs,
} from './draft-steps';

const seededSteps: ProductionStep[] = [
  {
    id: 's-1',
    name: 'SEPARAÇÃO',
    plannedMinutes: 40,
    assignee: null,
    sortOrder: 0,
  },
  {
    id: 's-2',
    name: 'PREPARAÇÃO',
    plannedMinutes: 35,
    assignee: 'Maria',
    sortOrder: 1,
  },
];

describe('draft-steps', () => {
  it('maps steps to drafts sorted by sortOrder', () => {
    const drafts = stepsToDrafts([seededSteps[1], seededSteps[0]]);
    expect(drafts.map((step) => step.name)).toEqual([
      'SEPARAÇÃO',
      'PREPARAÇÃO',
    ]);
    expect(drafts[1].assignee).toBe('Maria');
  });

  it('requires at least one complete step to save', () => {
    expect(canSaveStepDrafts([])).toBe(false);
    expect(canSaveStepDrafts([createEmptyStepDraft()])).toBe(false);
    expect(canSaveStepDrafts(stepsToDrafts(seededSteps))).toBe(true);
  });

  it('sums planned minutes from drafts', () => {
    expect(getDraftPlannedMinutesTotal(stepsToDrafts(seededSteps))).toBe(75);
  });

  it('serializes drafts to step inputs with sortOrder', () => {
    expect(toStepInputs(stepsToDrafts(seededSteps))).toEqual([
      {
        id: 's-1',
        name: 'SEPARAÇÃO',
        plannedMinutes: 40,
        assignee: null,
        sortOrder: 0,
      },
      {
        id: 's-2',
        name: 'PREPARAÇÃO',
        plannedMinutes: 35,
        assignee: 'Maria',
        sortOrder: 1,
      },
    ]);
  });
});

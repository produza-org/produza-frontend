import { useEffect, useState } from 'react';
import AddOutlined from '@mui/icons-material/AddOutlined';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import { useTranslation } from 'react-i18next';
import type {
  ProductionStep,
  ProductionStepInput,
} from '@/features/production-orders/types/production-order';
import { formatDecimal } from '@/features/production-orders/utils/format';
import {
  canSaveStepDrafts,
  createEmptyStepDraft,
  getDraftPlannedMinutesTotal,
  stepsToDrafts,
  toStepInputs,
  type ProductionStepDraft,
} from '@/features/production-orders/utils/steps/draft-steps';
import { FloorStepRow } from '@/features/production-orders/components/detail/FloorStepRow';
import { ActionButton } from '@/features/production-orders/components/detail/ProductionOrderDetail.styled';
import {
  AddStepButton,
  EmptySteps,
  FloorActions,
  FloorSection,
  FloorSectionHeader,
  FloorSectionTitle,
  PlannedLoadBadge,
  StepRows,
} from '@/features/production-orders/components/detail/FloorStepsPanel.styled';

type FloorStepsPanelProps = {
  steps: ProductionStep[];
  plannedMinutesTotal: number;
  isMutating?: boolean;
  onSave: (steps: ProductionStepInput[]) => void | Promise<void>;
};

export function FloorStepsPanel({
  steps,
  plannedMinutesTotal,
  isMutating = false,
  onSave,
}: FloorStepsPanelProps) {
  const { t } = useTranslation();
  const [drafts, setDrafts] = useState<ProductionStepDraft[]>(() =>
    stepsToDrafts(steps)
  );

  useEffect(() => {
    setDrafts(stepsToDrafts(steps));
  }, [steps]);

  const draftTotal = getDraftPlannedMinutesTotal(drafts);
  const displayTotal =
    drafts.length === steps.length &&
    drafts.every((draft, index) => {
      const step = steps[index];
      return (
        draft.id === step?.id &&
        draft.name === step.name &&
        draft.plannedMinutesDisplay === String(step.plannedMinutes) &&
        draft.assignee === (step.assignee ?? '')
      );
    })
      ? plannedMinutesTotal
      : draftTotal;

  const saveEnabled = canSaveStepDrafts(drafts) && !isMutating;

  function updateDraft(next: ProductionStepDraft) {
    setDrafts((current) =>
      current.map((step) => (step.key === next.key ? next : step))
    );
  }

  function removeDraft(key: string) {
    setDrafts((current) => current.filter((step) => step.key !== key));
  }

  function addDraft() {
    setDrafts((current) => [...current, createEmptyStepDraft()]);
  }

  return (
    <FloorSection>
      <FloorSectionHeader>
        <FloorSectionTitle>
          {t('productionOrders.detail.steps.title')}
        </FloorSectionTitle>
        <PlannedLoadBadge>
          {t('productionOrders.detail.steps.plannedLoad', {
            minutes: formatDecimal(displayTotal, 2),
          })}
        </PlannedLoadBadge>
      </FloorSectionHeader>

      {drafts.length === 0 ? (
        <EmptySteps>{t('productionOrders.detail.steps.empty')}</EmptySteps>
      ) : (
        <StepRows>
          {drafts.map((step) => (
            <FloorStepRow
              key={step.key}
              step={step}
              disabled={isMutating}
              canRemove={drafts.length > 1}
              onChange={updateDraft}
              onRemove={() => removeDraft(step.key)}
            />
          ))}
        </StepRows>
      )}

      <FloorActions>
        <AddStepButton
          type="button"
          startIcon={<AddOutlined fontSize="small" />}
          disabled={isMutating}
          onClick={addDraft}
        >
          {t('productionOrders.detail.steps.add')}
        </AddStepButton>
        <ActionButton
          type="button"
          variant="contained"
          disableElevation
          startIcon={<SaveOutlined />}
          disabled={!saveEnabled}
          onClick={() => {
            void onSave(toStepInputs(drafts));
          }}
        >
          {isMutating
            ? t('productionOrders.detail.steps.saving')
            : t('productionOrders.detail.steps.save')}
        </ActionButton>
      </FloorActions>
    </FloorSection>
  );
}

import DeleteOutline from '@mui/icons-material/DeleteOutline';
import { useTranslation } from 'react-i18next';
import { FormTextField } from '@/shared/components/form';
import type { ProductionStepDraft } from '@/features/production-orders/utils/steps/draft-steps';
import { sanitizeMinutesInput } from '@/features/production-orders/utils/steps/draft-steps';
import {
  RemoveStepButton,
  StepRowRoot,
} from '@/features/production-orders/components/detail/FloorStepsPanel.styled';

type FloorStepRowProps = {
  step: ProductionStepDraft;
  disabled?: boolean;
  canRemove: boolean;
  onChange: (step: ProductionStepDraft) => void;
  onRemove: () => void;
};

export function FloorStepRow({
  step,
  disabled = false,
  canRemove,
  onChange,
  onRemove,
}: FloorStepRowProps) {
  const { t } = useTranslation();

  return (
    <StepRowRoot>
      <FormTextField
        id={`floor-step-name-${step.key}`}
        label={t('productionOrders.detail.steps.colName')}
        placeholder={t('productionOrders.detail.steps.namePlaceholder')}
        value={step.name}
        onChange={(value) => onChange({ ...step, name: value })}
        disabled={disabled}
      />
      <FormTextField
        id={`floor-step-minutes-${step.key}`}
        label={t('productionOrders.detail.steps.colMinutes')}
        placeholder={t('productionOrders.detail.steps.minutesPlaceholder')}
        value={step.plannedMinutesDisplay}
        onChange={(value) =>
          onChange({
            ...step,
            plannedMinutesDisplay: sanitizeMinutesInput(value),
          })
        }
        inputMode="decimal"
        disabled={disabled}
      />
      <FormTextField
        id={`floor-step-assignee-${step.key}`}
        label={t('productionOrders.detail.steps.colAssignee')}
        placeholder={t('productionOrders.detail.steps.assigneePlaceholder')}
        value={step.assignee}
        onChange={(value) => onChange({ ...step, assignee: value })}
        disabled={disabled}
      />
      <RemoveStepButton
        type="button"
        aria-label={t('productionOrders.detail.steps.remove')}
        disabled={disabled || !canRemove}
        onClick={onRemove}
      >
        <DeleteOutline fontSize="small" />
      </RemoveStepButton>
    </StepRowRoot>
  );
}

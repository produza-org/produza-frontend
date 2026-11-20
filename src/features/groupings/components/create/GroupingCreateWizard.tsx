import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import ArrowBack from '@mui/icons-material/ArrowBack';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { ConfirmModal } from '@/shared/components/dialog';
import {
  FormValidationProvider,
  useFormValidation,
} from '@/shared/form-validation';
import { GroupingCompositionPanel } from '@/features/groupings/components/composition/GroupingCompositionPanel';
import {
  EditorBody,
  EditorCard,
  EditorCardAccent,
} from '@/features/groupings/components/composition/GroupingCompositionPanel.styled';
import { GroupingBasicsForm } from '@/features/groupings/components/form/GroupingBasicsForm';
import type { GroupingBasicsSubmitValues } from '@/features/groupings/types/grouping-form';
import type { RawMaterialGroupCreateInput } from '@/features/groupings/types/grouping';
import {
  toGroupingLineInputs,
  type GroupingDraftLine,
} from '@/features/groupings/utils/composition/draft-lines';
import {
  getGroupingCompositionFieldOrder,
  validateGroupingComposition,
} from '@/features/groupings/utils/composition/validate-composition';
import { toBasicsFormValues } from '@/features/groupings/utils/form/general-info';
import type { RawMaterial } from '@/features/raw-materials/types/raw-material';
import {
  PrimaryButton,
  SecondaryButton,
  StepPanel,
  StepTitle,
  WizardActions,
  WizardRoot,
  WizardStepper,
} from '@/features/groupings/components/create/GroupingCreateWizard.styled';

export type GroupingCreateWizardSaveInput = RawMaterialGroupCreateInput;

type GroupingCreateWizardProps = {
  materials: RawMaterial[];
  onCancel: () => void;
  onSave: (input: GroupingCreateWizardSaveInput) => void | Promise<void>;
  isSubmitting?: boolean;
  initialBasics?: GroupingBasicsSubmitValues;
  initialLines?: GroupingDraftLine[];
};

function CompositionStep({
  materials,
  generalValues,
  compositionLines,
  setCompositionLines,
  isSubmitting,
  onBack,
  onCancelRequest,
  onSave,
}: {
  materials: RawMaterial[];
  generalValues: GroupingBasicsSubmitValues;
  compositionLines: GroupingDraftLine[];
  setCompositionLines: (lines: GroupingDraftLine[]) => void;
  isSubmitting: boolean;
  onBack: () => void;
  onCancelRequest: () => void;
  onSave: (input: GroupingCreateWizardSaveInput) => void | Promise<void>;
}) {
  const { t } = useTranslation();
  const { submitWithValidation } = useFormValidation();
  const fieldOrder = useMemo(
    () => getGroupingCompositionFieldOrder(compositionLines),
    [compositionLines]
  );

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitWithValidation(
      () =>
        validateGroupingComposition(compositionLines, {
          linesRequired: t('groupings.composition.errors.linesRequired'),
          quantityInvalid: t('groupings.composition.errors.quantityInvalid'),
        }),
      () => {
        void onSave({
          name: generalValues.name,
          code: generalValues.code,
          ...(generalValues.description
            ? { description: generalValues.description }
            : {}),
          lines: toGroupingLineInputs(compositionLines),
        });
      },
      fieldOrder
    );
  }

  return (
    <EditorCard>
      <EditorCardAccent />
      <EditorBody onSubmit={handleSave} noValidate>
        <GroupingCompositionPanel
          materials={materials}
          lines={compositionLines}
          onChange={setCompositionLines}
        />

        <WizardActions>
          <SecondaryButton
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            startIcon={<ArrowBack />}
          >
            {t('groupings.createWizard.back')}
          </SecondaryButton>
          <SecondaryButton
            type="button"
            onClick={onCancelRequest}
            disabled={isSubmitting}
          >
            {t('groupings.form.cancel')}
          </SecondaryButton>
          <PrimaryButton
            type="submit"
            variant="contained"
            color="primary"
            disableElevation
            startIcon={<SaveOutlined />}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? t('groupings.createWizard.saving')
              : t('groupings.createWizard.save')}
          </PrimaryButton>
        </WizardActions>
      </EditorBody>
    </EditorCard>
  );
}

export function GroupingCreateWizard({
  materials,
  onCancel,
  onSave,
  isSubmitting = false,
  initialBasics,
  initialLines = [],
}: GroupingCreateWizardProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
  const [activeStep, setActiveStep] = useState(0);
  const [generalValues, setGeneralValues] = useState<GroupingBasicsSubmitValues | null>(
    initialBasics ?? null
  );
  const [compositionLines, setCompositionLines] =
    useState<GroupingDraftLine[]>(initialLines);
  const [discardOpen, setDiscardOpen] = useState(false);
  const [step1Key, setStep1Key] = useState(0);
  const [step1Dirty, setStep1Dirty] = useState(false);
  const stepTitleRef = useRef<HTMLHeadingElement | null>(null);
  const initialSnapshot = useRef({
    basics: initialBasics ?? null,
    lines: initialLines,
  });

  const steps = useMemo(
    () => [
      t('groupings.createWizard.steps.general'),
      t('groupings.createWizard.steps.composition'),
    ],
    [t]
  );

  useEffect(() => {
    stepTitleRef.current?.focus();
  }, [activeStep]);

  const isEditMode = Boolean(initialSnapshot.current.basics);
  const isDirty = isEditMode
    ? step1Dirty ||
      compositionLines !== initialSnapshot.current.lines ||
      JSON.stringify(generalValues) !==
        JSON.stringify(initialSnapshot.current.basics)
    : step1Dirty || generalValues !== null || compositionLines.length > 0;

  const handleCancelRequest = useCallback(() => {
    if (isDirty) {
      setDiscardOpen(true);
      return;
    }
    onCancel();
  }, [isDirty, onCancel]);

  const handleStep1Next = useCallback((values: GroupingBasicsSubmitValues) => {
    setGeneralValues(values);
    setActiveStep(1);
  }, []);

  const handleBack = useCallback(() => {
    setActiveStep(0);
    setStep1Key((value) => value + 1);
  }, []);

  return (
    <>
      <WizardRoot>
        <WizardStepper
          activeStep={activeStep}
          alternativeLabel={isSmUp}
          orientation={isSmUp ? 'horizontal' : 'vertical'}
        >
          {steps.map((label, index) => (
            <Step key={label} completed={index < activeStep}>
              <StepLabel
                aria-current={index === activeStep ? 'step' : undefined}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </WizardStepper>

        <StepPanel>
          <StepTitle ref={stepTitleRef} tabIndex={-1}>
            {activeStep === 0
              ? t('groupings.createWizard.steps.general')
              : t('groupings.createWizard.steps.composition')}
          </StepTitle>

          {activeStep === 0 ? (
            <GroupingBasicsForm
              key={step1Key}
              initialValues={
                generalValues ? toBasicsFormValues(generalValues) : undefined
              }
              onSubmit={handleStep1Next}
              onCancel={handleCancelRequest}
              onDirtyChange={setStep1Dirty}
              isSubmitting={isSubmitting}
            />
          ) : generalValues ? (
            <FormValidationProvider>
              <CompositionStep
                materials={materials}
                generalValues={generalValues}
                compositionLines={compositionLines}
                setCompositionLines={setCompositionLines}
                isSubmitting={isSubmitting}
                onBack={handleBack}
                onCancelRequest={handleCancelRequest}
                onSave={onSave}
              />
            </FormValidationProvider>
          ) : null}
        </StepPanel>
      </WizardRoot>

      <ConfirmModal
        open={discardOpen}
        onClose={() => setDiscardOpen(false)}
        onConfirm={() => {
          setDiscardOpen(false);
          onCancel();
        }}
        title={t('groupings.createWizard.discardTitle')}
        message={t('groupings.createWizard.discardMessage')}
        cancelLabel={t('groupings.createWizard.discardCancel')}
        confirmLabel={t('groupings.createWizard.discardConfirm')}
      />
    </>
  );
}

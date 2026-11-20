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
import { ProductForm } from '@/features/products/components/form/ProductForm';
import { RecipeDraftPanel } from '@/features/products/components/recipe/RecipeDraftPanel';
import {
  EditorBody,
  EditorCard,
  EditorCardAccent,
} from '@/features/products/components/recipe/RecipeEditor.styled';
import type { ProductFormSubmitValues } from '@/features/products/types/product-form';
import {
  toProductFormValues,
  toRecipeProductMeta,
} from '@/features/products/utils/form/general-info';
import {
  createEmptyRecipeDraft,
  toRecipeUpsertInput,
  type RecipeDraft,
} from '@/features/products/utils/recipe/draft-lines';
import {
  getRecipeDraftFieldOrder,
  validateRecipeDraft,
} from '@/features/products/utils/recipe/validate-recipe-draft';
import type { RawMaterial } from '@/features/raw-materials/types/raw-material';
import type { RecipeUpsertInput } from '@/features/products/types/recipe';
import {
  PrimaryButton,
  SecondaryButton,
  StepPanel,
  StepTitle,
  WizardActions,
  WizardRoot,
  WizardStepper,
} from '@/features/products/components/create/ProductCreateWizard.styled';

export type ProductCreateWizardSaveInput = {
  general: ProductFormSubmitValues;
  recipe: RecipeUpsertInput;
};

type ProductCreateWizardProps = {
  materials: RawMaterial[];
  onCancel: () => void;
  onSave: (input: ProductCreateWizardSaveInput) => void | Promise<void>;
  isSubmitting?: boolean;
};

function RecipeStep({
  materials,
  generalValues,
  recipeDraft,
  setRecipeDraft,
  isSubmitting,
  onBack,
  onCancelRequest,
  onSave,
}: {
  materials: RawMaterial[];
  generalValues: ProductFormSubmitValues;
  recipeDraft: RecipeDraft;
  setRecipeDraft: (draft: RecipeDraft) => void;
  isSubmitting: boolean;
  onBack: () => void;
  onCancelRequest: () => void;
  onSave: (input: ProductCreateWizardSaveInput) => void | Promise<void>;
}) {
  const { t } = useTranslation();
  const { submitWithValidation, clearErrors } = useFormValidation();
  const productMeta = toRecipeProductMeta(generalValues);
  const fieldOrder = useMemo(
    () => getRecipeDraftFieldOrder(recipeDraft),
    [recipeDraft]
  );

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitWithValidation(
      () =>
        validateRecipeDraft(recipeDraft, {
          rawMaterialRequired: t('products.recipe.errors.rawMaterialRequired'),
          materialRequired: t('products.recipe.errors.materialRequired'),
          proportionRequired: t('products.recipe.errors.proportionRequired'),
          proportionNegative: t('products.recipe.errors.negativeProportion'),
          duplicateMaterial: t('products.recipe.errors.duplicateMaterial'),
          componentSumInvalid: t('products.recipe.errors.componentSumInvalid'),
          groupRequired: t('products.recipe.errors.groupRequired'),
        }),
      () => {
        void onSave({
          general: generalValues,
          recipe: toRecipeUpsertInput(recipeDraft),
        });
      },
      fieldOrder
    );
  }

  return (
    <EditorCard>
      <EditorCardAccent />
      <EditorBody onSubmit={handleSave} noValidate>
        <RecipeDraftPanel
          productMeta={productMeta}
          materials={materials}
          draft={recipeDraft}
          onChange={(next) => {
            clearErrors();
            setRecipeDraft(next);
          }}
          stepHint={t('products.createWizard.recipeHint')}
        />

        <WizardActions>
          <SecondaryButton
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            startIcon={<ArrowBack />}
          >
            {t('products.createWizard.back')}
          </SecondaryButton>
          <SecondaryButton
            type="button"
            onClick={onCancelRequest}
            disabled={isSubmitting}
          >
            {t('products.form.cancel')}
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
              ? t('products.createWizard.saving')
              : t('products.createWizard.save')}
          </PrimaryButton>
        </WizardActions>
      </EditorBody>
    </EditorCard>
  );
}

export function ProductCreateWizard({
  materials,
  onCancel,
  onSave,
  isSubmitting = false,
}: ProductCreateWizardProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
  const [activeStep, setActiveStep] = useState(0);
  const [generalValues, setGeneralValues] =
    useState<ProductFormSubmitValues | null>(null);
  const [recipeDraft, setRecipeDraft] = useState<RecipeDraft>(() =>
    createEmptyRecipeDraft()
  );
  const [discardOpen, setDiscardOpen] = useState(false);
  const [step1Key, setStep1Key] = useState(0);
  const [step1Dirty, setStep1Dirty] = useState(false);
  const stepTitleRef = useRef<HTMLHeadingElement | null>(null);

  const steps = useMemo(
    () => [
      t('products.createWizard.steps.general'),
      t('products.createWizard.steps.recipe'),
    ],
    [t]
  );

  useEffect(() => {
    stepTitleRef.current?.focus();
  }, [activeStep]);

  const isDirty =
    step1Dirty ||
    generalValues !== null ||
    recipeDraft.lines.length > 0 ||
    recipeDraft.groups.length > 0;

  const handleCancelRequest = useCallback(() => {
    if (isDirty) {
      setDiscardOpen(true);
      return;
    }
    onCancel();
  }, [isDirty, onCancel]);

  const handleStep1Next = useCallback((values: ProductFormSubmitValues) => {
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
              ? t('products.createWizard.steps.general')
              : t('products.createWizard.steps.recipe')}
          </StepTitle>

          {activeStep === 0 ? (
            <ProductForm
              key={step1Key}
              mode="step"
              initialValues={
                generalValues ? toProductFormValues(generalValues) : undefined
              }
              onSubmit={handleStep1Next}
              onCancel={handleCancelRequest}
              onDirtyChange={setStep1Dirty}
              isSubmitting={isSubmitting}
            />
          ) : generalValues ? (
            <FormValidationProvider>
              <RecipeStep
                materials={materials}
                generalValues={generalValues}
                recipeDraft={recipeDraft}
                setRecipeDraft={setRecipeDraft}
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
        title={t('products.createWizard.discardTitle')}
        message={t('products.createWizard.discardMessage')}
        cancelLabel={t('products.createWizard.discardCancel')}
        confirmLabel={t('products.createWizard.discardConfirm')}
      />
    </>
  );
}

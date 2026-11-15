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
  canSaveRecipeDraft,
  toRecipeLineInputs,
  type RecipeDraftLine,
} from '@/features/products/utils/recipe/draft-lines';
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
  errorMessage?: string | null;
};

export function ProductCreateWizard({
  materials,
  onCancel,
  onSave,
  isSubmitting = false,
  errorMessage = null,
}: ProductCreateWizardProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
  const [activeStep, setActiveStep] = useState(0);
  const [generalValues, setGeneralValues] =
    useState<ProductFormSubmitValues | null>(null);
  const [recipeLines, setRecipeLines] = useState<RecipeDraftLine[]>([]);
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

  const productMeta = useMemo(
    () => (generalValues ? toRecipeProductMeta(generalValues) : null),
    [generalValues]
  );

  const isDirty =
    step1Dirty || generalValues !== null || recipeLines.length > 0;

  const saveEnabled =
    Boolean(generalValues) && canSaveRecipeDraft(recipeLines) && !isSubmitting;

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

  const handleSave = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!generalValues || !saveEnabled) {
        return;
      }
      void onSave({
        general: generalValues,
        recipe: { lines: toRecipeLineInputs(recipeLines) },
      });
    },
    [generalValues, onSave, recipeLines, saveEnabled]
  );

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
          ) : productMeta ? (
            <EditorCard>
              <EditorCardAccent />
              <EditorBody onSubmit={handleSave} noValidate>
                <RecipeDraftPanel
                  productMeta={productMeta}
                  materials={materials}
                  lines={recipeLines}
                  onChange={setRecipeLines}
                  errorMessage={errorMessage}
                  stepHint={t('products.createWizard.recipeHint')}
                />

                <WizardActions>
                  <SecondaryButton
                    type="button"
                    onClick={handleBack}
                    disabled={isSubmitting}
                    startIcon={<ArrowBack />}
                  >
                    {t('products.createWizard.back')}
                  </SecondaryButton>
                  <SecondaryButton
                    type="button"
                    onClick={handleCancelRequest}
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
                    disabled={!saveEnabled}
                  >
                    {isSubmitting
                      ? t('products.createWizard.saving')
                      : t('products.createWizard.save')}
                  </PrimaryButton>
                </WizardActions>
              </EditorBody>
            </EditorCard>
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

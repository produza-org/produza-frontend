import { useEffect, useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ArrowForward from '@mui/icons-material/ArrowForward';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import { FormSelectField, FormTextField } from '@/shared/components/form';
import { PRODUCT_FINAL_SIZE_UNIT_OPTIONS } from '@/features/products/constants';
import {
  CancelButton,
  FormActions,
  FormBody,
  FormCard,
  FormCardAccent,
  FormRow,
  SaveButton,
  ValidationAlert,
  ValidationAlertText,
  ValidationAlertTitle,
} from '@/features/products/components/form/ProductForm.styled';
import type { ProductFinalSizeUnit } from '@/features/products/types/product';
import type {
  ProductFormSubmitValues,
  ProductFormValues,
} from '@/features/products/types/product-form';
import { isGeneralInfoValid } from '@/features/products/utils/form/general-info';
import {
  computeExpansionFactor,
  formatDecimal,
  parseDecimalInput,
  sanitizeDecimalInput,
} from '@/features/products/utils/format';

export type { ProductFormSubmitValues, ProductFormValues };

type ProductFormProps = {
  onSubmit: (values: ProductFormSubmitValues) => void | Promise<void>;
  onCancel: () => void;
  initialValues?: Partial<ProductFormValues>;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  mode?: 'default' | 'step';
  onDirtyChange?: (isDirty: boolean) => void;
};

const defaultValues: ProductFormValues = {
  name: '',
  finalSizeDisplay: '',
  finalSizeUnit: PRODUCT_FINAL_SIZE_UNIT_OPTIONS[0].value,
  yieldDisplay: '',
};

export function ProductForm({
  onSubmit,
  onCancel,
  initialValues,
  isSubmitting = false,
  errorMessage = null,
  mode = 'default',
  onDirtyChange,
}: ProductFormProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { control, handleSubmit } = useForm<ProductFormValues>({
    defaultValues: { ...defaultValues, ...initialValues },
  });

  const name = useWatch({ control, name: 'name' });
  const finalSizeDisplay = useWatch({ control, name: 'finalSizeDisplay' });
  const yieldDisplay = useWatch({ control, name: 'yieldDisplay' });

  const isStepValid = isGeneralInfoValid({
    name: name ?? '',
    finalSizeDisplay: finalSizeDisplay ?? '',
    yieldDisplay: yieldDisplay ?? '',
  });

  useEffect(() => {
    if (!onDirtyChange) {
      return;
    }
    onDirtyChange(
      Boolean(name?.trim()) ||
        Boolean(finalSizeDisplay?.trim()) ||
        Boolean(yieldDisplay?.trim())
    );
  }, [finalSizeDisplay, name, onDirtyChange, yieldDisplay]);

  const expansionFactorDisplay = useMemo(() => {
    const yieldValue = parseDecimalInput(yieldDisplay ?? '');
    const factor = computeExpansionFactor(yieldValue);
    if (factor === null) {
      return '—';
    }
    return formatDecimal(factor, 6);
  }, [yieldDisplay]);

  const unitOptions = useMemo(
    () =>
      PRODUCT_FINAL_SIZE_UNIT_OPTIONS.map((option) => ({
        value: option.value,
        label: t(option.labelKey),
      })),
    [t]
  );

  const displayError =
    errorMessage === 'UNEXPECTED'
      ? t('products.errors.unexpected')
      : errorMessage;

  const submitForm = handleSubmit((values) => {
    const finalSize = parseDecimalInput(values.finalSizeDisplay);
    const yieldValue = parseDecimalInput(values.yieldDisplay);

    if (
      !values.name.trim() ||
      !Number.isFinite(finalSize) ||
      finalSize <= 0 ||
      !Number.isFinite(yieldValue) ||
      !(yieldValue > 0)
    ) {
      return;
    }

    void onSubmit({
      name: values.name.trim(),
      finalSize,
      finalSizeUnit: values.finalSizeUnit,
      yield: yieldValue,
    });
  });

  const isStepMode = mode === 'step';
  const primaryDisabled = isSubmitting || (isStepMode && !isStepValid);

  return (
    <FormCard>
      <FormCardAccent />
      <FormBody onSubmit={submitForm} noValidate>
        {displayError ? (
          <Alert severity="error" role="alert">
            {displayError}
          </Alert>
        ) : null}

        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <FormTextField
              id="product-name"
              label={t('products.form.nameLabel')}
              placeholder={t('products.form.namePlaceholder')}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <FormRow>
          <Controller
            name="finalSizeDisplay"
            control={control}
            render={({ field }) => (
              <FormTextField
                id="product-final-size"
                label={t('products.form.finalSizeLabel')}
                placeholder={t('products.form.finalSizePlaceholder')}
                value={field.value}
                onChange={(value) => field.onChange(sanitizeDecimalInput(value))}
                inputMode="decimal"
              />
            )}
          />
          <Controller
            name="finalSizeUnit"
            control={control}
            render={({ field }) => (
              <FormSelectField
                id="product-final-size-unit"
                label={t('products.form.finalSizeUnitLabel')}
                value={field.value}
                onChange={(value) => field.onChange(value as ProductFinalSizeUnit)}
                options={unitOptions}
              />
            )}
          />
        </FormRow>

        <FormRow>
          <Controller
            name="yieldDisplay"
            control={control}
            render={({ field }) => (
              <FormTextField
                id="product-yield"
                label={t('products.form.yieldLabel')}
                placeholder={t('products.form.yieldPlaceholder')}
                value={field.value}
                onChange={(value) => field.onChange(sanitizeDecimalInput(value))}
                inputMode="decimal"
              />
            )}
          />
          <FormTextField
            id="product-expansion-factor"
            label={t('products.form.expansionFactorLabel')}
            value={expansionFactorDisplay}
            onChange={() => undefined}
            disabled
          />
        </FormRow>

        <ValidationAlert>
          <InfoOutlined sx={{ color: theme.palette.produza.primary, fontSize: 24 }} />
          <div>
            <ValidationAlertTitle>{t('products.form.validationTitle')}</ValidationAlertTitle>
            <ValidationAlertText>{t('products.form.validationText')}</ValidationAlertText>
          </div>
        </ValidationAlert>

        <FormActions>
          <CancelButton type="button" onClick={onCancel} disabled={isSubmitting}>
            {t('products.form.cancel')}
          </CancelButton>
          <SaveButton
            type="submit"
            variant="contained"
            color="primary"
            disableElevation
            startIcon={isStepMode ? undefined : <SaveOutlined />}
            endIcon={isStepMode ? <ArrowForward /> : undefined}
            disabled={primaryDisabled}
          >
            {isStepMode
              ? t('products.createWizard.next')
              : isSubmitting
                ? t('products.form.saving')
                : t('products.form.save')}
          </SaveButton>
        </FormActions>
      </FormBody>
    </FormCard>
  );
}

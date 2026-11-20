import { useEffect, useMemo, type FormEvent } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ArrowForward from '@mui/icons-material/ArrowForward';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import { useTheme } from '@mui/material/styles';
import { FormSelectField, FormTextField } from '@/shared/components/form';
import {
  FormValidationProvider,
  useFormValidation,
} from '@/shared/form-validation';
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
import {
  PRODUCT_GENERAL_FIELD_ORDER,
  validateGeneralInfo,
} from '@/features/products/utils/form/validate-general-info';
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
  mode?: 'default' | 'step';
  onDirtyChange?: (isDirty: boolean) => void;
};

const defaultValues: ProductFormValues = {
  name: '',
  finalSizeDisplay: '',
  finalSizeUnit: PRODUCT_FINAL_SIZE_UNIT_OPTIONS[0].value,
  yieldDisplay: '',
};

function ProductFormFields({
  onSubmit,
  onCancel,
  initialValues,
  isSubmitting = false,
  mode = 'default',
  onDirtyChange,
}: ProductFormProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { getError, clearField, submitWithValidation } = useFormValidation();
  const { control, getValues } = useForm<ProductFormValues>({
    defaultValues: { ...defaultValues, ...initialValues },
  });

  const name = useWatch({ control, name: 'name' });
  const finalSizeDisplay = useWatch({ control, name: 'finalSizeDisplay' });
  const yieldDisplay = useWatch({ control, name: 'yieldDisplay' });

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

  const isStepMode = mode === 'step';

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitWithValidation(
      () =>
        validateGeneralInfo(getValues(), {
          nameRequired: t('products.form.errors.nameRequired'),
          finalSizeInvalid: t('products.form.errors.finalSizeInvalid'),
          unitRequired: t('products.form.errors.unitRequired'),
          yieldInvalid: t('products.form.errors.yieldInvalid'),
        }),
      () => {
        const values = getValues();
        void onSubmit({
          name: values.name.trim(),
          finalSize: parseDecimalInput(values.finalSizeDisplay),
          finalSizeUnit: values.finalSizeUnit,
          yield: parseDecimalInput(values.yieldDisplay),
        });
      },
      [...PRODUCT_GENERAL_FIELD_ORDER]
    );
  }

  return (
    <FormCard>
      <FormCardAccent />
      <FormBody onSubmit={handleFormSubmit} noValidate>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <FormTextField
              id="product-name"
              label={t('products.form.nameLabel')}
              placeholder={t('products.form.namePlaceholder')}
              value={field.value}
              onChange={(value) => {
                clearField('product-name');
                field.onChange(value);
              }}
              error={Boolean(getError('product-name'))}
              helperText={getError('product-name')}
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
                onChange={(value) => {
                  clearField('product-final-size');
                  field.onChange(sanitizeDecimalInput(value));
                }}
                inputMode="decimal"
                error={Boolean(getError('product-final-size'))}
                helperText={getError('product-final-size')}
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
                onChange={(value) => {
                  clearField('product-final-size-unit');
                  field.onChange(value as ProductFinalSizeUnit);
                }}
                options={unitOptions}
                error={Boolean(getError('product-final-size-unit'))}
                helperText={getError('product-final-size-unit')}
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
                onChange={(value) => {
                  clearField('product-yield');
                  field.onChange(sanitizeDecimalInput(value));
                }}
                inputMode="decimal"
                error={Boolean(getError('product-yield'))}
                helperText={getError('product-yield')}
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
            disabled={isSubmitting}
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

export function ProductForm(props: ProductFormProps) {
  return (
    <FormValidationProvider>
      <ProductFormFields {...props} />
    </FormValidationProvider>
  );
}

import { useMemo, type FormEvent } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import { useTheme } from '@mui/material/styles';
import {
  FormCurrencyField,
  FormSelectField,
  FormTextField,
} from '@/shared/components/form';
import {
  FormValidationProvider,
  useFormValidation,
} from '@/shared/form-validation';
import {
  handleCurrencyInputChange,
  parseCurrencyBrlInput,
  sanitizeIntegerInput,
} from '@/shared/utils';
import { RAW_MATERIAL_UNIT_OPTIONS } from '@/features/raw-materials/constants';
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
} from '@/features/raw-materials/components/form/RawMaterialForm.styled';
import type { RawMaterialUnit } from '@/features/raw-materials/types/raw-material';
import { formatRawMaterialCode } from '@/features/raw-materials/utils/create/raw-material-code';
import {
  RAW_MATERIAL_FIELD_ORDER,
  validateRawMaterialForm,
} from '@/features/raw-materials/utils/form/validate-raw-material';

export type RawMaterialFormValues = {
  name: string;
  code: string;
  unit: RawMaterialUnit;
  unitCostDisplay: string;
  stockQuantity: string;
  minStock: string;
};

export type RawMaterialFormSubmitValues = {
  name: string;
  code: string;
  unit: RawMaterialUnit;
  unitCost: number;
  stockQuantity: number;
  minStock: number;
};

type RawMaterialFormProps = {
  onSubmit: (values: RawMaterialFormSubmitValues) => void | Promise<void>;
  onCancel: () => void;
  initialValues?: Partial<RawMaterialFormValues>;
  isSubmitting?: boolean;
};

const defaultValues: RawMaterialFormValues = {
  name: '',
  code: '',
  unit: RAW_MATERIAL_UNIT_OPTIONS[0].value,
  unitCostDisplay: '',
  stockQuantity: '',
  minStock: '',
};

function RawMaterialFormFields({
  onSubmit,
  onCancel,
  initialValues,
  isSubmitting = false,
}: RawMaterialFormProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { getError, clearField, submitWithValidation } = useFormValidation();
  const { control, getValues } = useForm<RawMaterialFormValues>({
    defaultValues: { ...defaultValues, ...initialValues },
  });

  const unitOptions = useMemo(
    () =>
      RAW_MATERIAL_UNIT_OPTIONS.map((option) => ({
        value: option.value,
        label: t(option.labelKey),
      })),
    [t]
  );

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitWithValidation(
      () =>
        validateRawMaterialForm(getValues(), {
          nameRequired: t('rawMaterials.form.errors.nameRequired'),
          codeInvalid: t('rawMaterials.form.errors.codeInvalid'),
          unitRequired: t('rawMaterials.form.errors.unitRequired'),
          unitCostInvalid: t('rawMaterials.form.errors.unitCostInvalid'),
          stockInvalid: t('rawMaterials.form.errors.stockInvalid'),
          minStockInvalid: t('rawMaterials.form.errors.minStockInvalid'),
        }),
      () => {
        const values = getValues();
        void onSubmit({
          name: values.name.trim(),
          code: values.code,
          unit: values.unit,
          unitCost: parseCurrencyBrlInput(values.unitCostDisplay),
          stockQuantity: parseInt(values.stockQuantity, 10),
          minStock: parseInt(values.minStock, 10),
        });
      },
      [...RAW_MATERIAL_FIELD_ORDER]
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
              id="material-name"
              label={t('rawMaterials.form.nameLabel')}
              placeholder={t('rawMaterials.form.namePlaceholder')}
              value={field.value}
              onChange={(value) => {
                clearField('material-name');
                field.onChange(value);
              }}
              error={Boolean(getError('material-name'))}
              helperText={getError('material-name')}
            />
          )}
        />

        <FormRow>
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <FormTextField
                id="material-code"
                label={t('rawMaterials.form.codeLabel')}
                placeholder={t('rawMaterials.form.codePlaceholder')}
                value={field.value}
                onChange={(value) => {
                  clearField('material-code');
                  field.onChange(formatRawMaterialCode(value));
                }}
                error={Boolean(getError('material-code'))}
                helperText={getError('material-code')}
              />
            )}
          />
          <Controller
            name="unit"
            control={control}
            render={({ field }) => (
              <FormSelectField
                id="unit-measure"
                label={t('rawMaterials.form.unitLabel')}
                value={field.value}
                onChange={(value) => {
                  clearField('unit-measure');
                  field.onChange(value as RawMaterialUnit);
                }}
                options={unitOptions}
                error={Boolean(getError('unit-measure'))}
                helperText={getError('unit-measure')}
              />
            )}
          />
        </FormRow>

        <Controller
          name="unitCostDisplay"
          control={control}
          render={({ field }) => (
            <FormCurrencyField
              id="unit-price"
              label={t('rawMaterials.form.unitPriceLabel')}
              placeholder={t('rawMaterials.form.unitPricePlaceholder')}
              value={field.value}
              onChange={(value) => {
                clearField('unit-price');
                field.onChange(handleCurrencyInputChange(value));
              }}
              error={Boolean(getError('unit-price'))}
              helperText={getError('unit-price')}
            />
          )}
        />

        <FormRow>
          <Controller
            name="stockQuantity"
            control={control}
            render={({ field }) => (
              <FormTextField
                id="stock-qty"
                label={t('rawMaterials.form.stockQtyLabel')}
                placeholder={t('rawMaterials.form.stockQtyPlaceholder')}
                value={field.value}
                onChange={(value) => {
                  clearField('stock-qty');
                  field.onChange(sanitizeIntegerInput(value));
                }}
                inputMode="numeric"
                error={Boolean(getError('stock-qty'))}
                helperText={getError('stock-qty')}
              />
            )}
          />
          <Controller
            name="minStock"
            control={control}
            render={({ field }) => (
              <FormTextField
                id="min-stock"
                label={t('rawMaterials.form.minStockLabel')}
                placeholder={t('rawMaterials.form.minStockPlaceholder')}
                value={field.value}
                onChange={(value) => {
                  clearField('min-stock');
                  field.onChange(sanitizeIntegerInput(value));
                }}
                inputMode="numeric"
                error={Boolean(getError('min-stock'))}
                helperText={getError('min-stock')}
              />
            )}
          />
        </FormRow>

        <ValidationAlert>
          <InfoOutlined sx={{ color: theme.palette.produza.primary, fontSize: 24 }} />
          <div>
            <ValidationAlertTitle>{t('rawMaterials.form.validationTitle')}</ValidationAlertTitle>
            <ValidationAlertText>{t('rawMaterials.form.validationText')}</ValidationAlertText>
          </div>
        </ValidationAlert>

        <FormActions>
          <CancelButton type="button" onClick={onCancel} disabled={isSubmitting}>
            {t('rawMaterials.form.cancel')}
          </CancelButton>
          <SaveButton
            type="submit"
            variant="contained"
            disableElevation
            startIcon={<SaveOutlined />}
            disabled={isSubmitting}
          >
            {isSubmitting ? t('rawMaterials.form.saving') : t('rawMaterials.form.save')}
          </SaveButton>
        </FormActions>
      </FormBody>
    </FormCard>
  );
}

export function RawMaterialForm(props: RawMaterialFormProps) {
  return (
    <FormValidationProvider>
      <RawMaterialFormFields {...props} />
    </FormValidationProvider>
  );
}

import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import {
  FormCurrencyField,
  FormSelectField,
  FormTextField,
} from '@/shared/components/form';
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
import {
  formatRawMaterialCode,
  isValidRawMaterialCode,
} from '@/features/raw-materials/utils/create/raw-material-code';

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
  errorMessage?: string | null;
};

const defaultValues: RawMaterialFormValues = {
  name: '',
  code: '',
  unit: RAW_MATERIAL_UNIT_OPTIONS[0].value,
  unitCostDisplay: '',
  stockQuantity: '',
  minStock: '',
};

export function RawMaterialForm({
  onSubmit,
  onCancel,
  initialValues,
  isSubmitting = false,
  errorMessage = null,
}: RawMaterialFormProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { control, handleSubmit } = useForm<RawMaterialFormValues>({
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

  const displayError =
    errorMessage === 'UNEXPECTED'
      ? t('rawMaterials.errors.unexpected')
      : errorMessage;

  const submitForm = handleSubmit((values) => {
    if (!isValidRawMaterialCode(values.code)) return;

    const unitCost = parseCurrencyBrlInput(values.unitCostDisplay);
    const quantity = parseInt(values.stockQuantity, 10);
    const minStock = parseInt(values.minStock, 10);

    if (!values.name.trim() || unitCost <= 0 || quantity <= 0 || minStock <= 0) return;

    void onSubmit({
      name: values.name.trim(),
      code: values.code,
      unit: values.unit,
      unitCost,
      stockQuantity: quantity,
      minStock,
    });
  });

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
              id="material-name"
              label={t('rawMaterials.form.nameLabel')}
              placeholder={t('rawMaterials.form.namePlaceholder')}
              value={field.value}
              onChange={field.onChange}
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
                onChange={(value) => field.onChange(formatRawMaterialCode(value))}
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
                onChange={(value) => field.onChange(value as RawMaterialUnit)}
                options={unitOptions}
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
              onChange={(value) => field.onChange(handleCurrencyInputChange(value))}
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
                onChange={(value) => field.onChange(sanitizeIntegerInput(value))}
                inputMode="numeric"
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
                onChange={(value) => field.onChange(sanitizeIntegerInput(value))}
                inputMode="numeric"
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

import { useMemo } from 'react';
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
} from '@/features/raw-materials/components/create/RawMaterialForm.styled';
import {
  formatRawMaterialCode,
  isValidRawMaterialCode,
} from '@/features/raw-materials/utils/create/raw-material-code';

export type RawMaterialFormValues = {
  name: string;
  code: string;
  unit: string;
  unitCostDisplay: string;
  stockQuantity: string;
};

type RawMaterialFormProps = {
  onSubmit: (values: {
    name: string;
    code: string;
    unit: string;
    unitCost: number;
    stockQuantity: number;
  }) => void;
  onCancel: () => void;
};

const defaultValues: RawMaterialFormValues = {
  name: '',
  code: '',
  unit: RAW_MATERIAL_UNIT_OPTIONS[0].value,
  unitCostDisplay: '',
  stockQuantity: '',
};

export function RawMaterialForm({ onSubmit, onCancel }: RawMaterialFormProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { control, handleSubmit } = useForm<RawMaterialFormValues>({
    defaultValues,
  });

  const unitOptions = useMemo(
    () =>
      RAW_MATERIAL_UNIT_OPTIONS.map((option) => ({
        value: option.value,
        label: t(option.labelKey),
      })),
    [t]
  );

  const submitForm = handleSubmit((values) => {
    if (!isValidRawMaterialCode(values.code)) return;

    const unitCost = parseCurrencyBrlInput(values.unitCostDisplay);
    const quantity = parseInt(values.stockQuantity, 10);

    if (!values.name.trim() || unitCost <= 0 || quantity <= 0) return;

    onSubmit({
      name: values.name.trim(),
      code: values.code,
      unit: values.unit,
      unitCost,
      stockQuantity: quantity,
    });
  });

  return (
    <FormCard>
      <FormCardAccent />
      <FormBody onSubmit={submitForm} noValidate>
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
                onChange={field.onChange}
                options={unitOptions}
              />
            )}
          />
        </FormRow>

        <FormRow>
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
        </FormRow>

        <ValidationAlert>
          <InfoOutlined sx={{ color: theme.palette.produza.primary, fontSize: 24 }} />
          <div>
            <ValidationAlertTitle>{t('rawMaterials.form.validationTitle')}</ValidationAlertTitle>
            <ValidationAlertText>{t('rawMaterials.form.validationText')}</ValidationAlertText>
          </div>
        </ValidationAlert>

        <FormActions>
          <CancelButton type="button" onClick={onCancel}>
            {t('rawMaterials.form.cancel')}
          </CancelButton>
          <SaveButton type="submit" variant="contained" disableElevation startIcon={<SaveOutlined />}>
            {t('rawMaterials.form.save')}
          </SaveButton>
        </FormActions>
      </FormBody>
    </FormCard>
  );
}

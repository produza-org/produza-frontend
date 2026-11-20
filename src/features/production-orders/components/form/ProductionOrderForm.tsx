import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { FormSelectField, FormTextField } from '@/shared/components/form';
import {
  FormValidationProvider,
  useFormValidation,
} from '@/shared/form-validation';
import type { Product } from '@/features/products/types/product';
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
} from '@/features/production-orders/components/form/ProductionOrderForm.styled';
import {
  parseDecimalInput,
  sanitizeDecimalInput,
} from '@/features/production-orders/utils/format';
import {
  PRODUCTION_ORDER_FIELD_ORDER,
  validateProductionOrderForm,
} from '@/features/production-orders/utils/form/validate-production-order';
import { listProductsWithRecipe } from '@/features/production-orders/utils/products-with-recipe';

export type ProductionOrderFormValues = {
  number: string;
  productId: string;
  qtdDisplay: string;
  startDate: string;
  plannedEndDate: string;
  notes: string;
};

export type ProductionOrderFormSubmitValues = {
  number: string;
  productId: string;
  qtdAProduzir: number;
  startDate?: string;
  plannedEndDate?: string;
  notes?: string;
};

type ProductionOrderFormProps = {
  onSubmit: (values: ProductionOrderFormSubmitValues) => void | Promise<void>;
  onCancel: () => void;
  initialValues?: Partial<ProductionOrderFormValues>;
  isSubmitting?: boolean;
};

const defaultValues: ProductionOrderFormValues = {
  number: '',
  productId: '',
  qtdDisplay: '',
  startDate: '',
  plannedEndDate: '',
  notes: '',
};

function ProductionOrderFormFields({
  onSubmit,
  onCancel,
  initialValues,
  isSubmitting = false,
}: ProductionOrderFormProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { getError, clearField, submitWithValidation } = useFormValidation();
  const { control, getValues } = useForm<ProductionOrderFormValues>({
    defaultValues: { ...defaultValues, ...initialValues },
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setIsLoadingProducts(true);
      setProductsError(null);
      try {
        const withRecipe = await listProductsWithRecipe();
        if (!cancelled) {
          setProducts(withRecipe);
        }
      } catch {
        if (!cancelled) {
          setProductsError('UNEXPECTED');
        }
      } finally {
        if (!cancelled) {
          setIsLoadingProducts(false);
        }
      }
    }

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const productOptions = useMemo(
    () => [
      {
        value: '',
        label: t('productionOrders.form.productPlaceholder'),
      },
      ...products.map((product) => ({
        value: product.id,
        label: product.name,
      })),
    ],
    [products, t]
  );

  const displayProductsError =
    productsError === 'UNEXPECTED'
      ? t('productionOrders.errors.unexpected')
      : productsError;

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitWithValidation(
      () =>
        validateProductionOrderForm(getValues(), {
          numberRequired: t('productionOrders.form.errors.numberRequired'),
          productRequired: t('productionOrders.form.errors.productRequired'),
          quantityInvalid: t('productionOrders.form.errors.quantityInvalid'),
          dateOrderInvalid: t('productionOrders.form.errors.dateOrderInvalid'),
        }),
      () => {
        const values = getValues();
        const startDate = values.startDate.trim();
        const plannedEndDate = values.plannedEndDate.trim();
        void onSubmit({
          number: values.number.trim(),
          productId: values.productId,
          qtdAProduzir: parseDecimalInput(values.qtdDisplay),
          ...(startDate ? { startDate } : {}),
          ...(plannedEndDate ? { plannedEndDate } : {}),
          ...(values.notes.trim() ? { notes: values.notes.trim() } : {}),
        });
      },
      [...PRODUCTION_ORDER_FIELD_ORDER]
    );
  }

  return (
    <FormCard>
      <FormCardAccent />
      <FormBody onSubmit={handleFormSubmit} noValidate>
        {displayProductsError ? (
          <Alert severity="error" role="alert">
            {displayProductsError}
          </Alert>
        ) : null}

        {isLoadingProducts ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress
              size={28}
              aria-label={t('productionOrders.form.loadingProducts')}
            />
          </Box>
        ) : null}

        {!isLoadingProducts && products.length === 0 && !productsError ? (
          <Alert severity="warning" role="status">
            {t('productionOrders.form.noProductsWithRecipe')}
          </Alert>
        ) : null}

        <FormRow>
          <Controller
            name="number"
            control={control}
            render={({ field }) => (
              <FormTextField
                id="production-order-number"
                label={t('productionOrders.form.numberLabel')}
                placeholder={t('productionOrders.form.numberPlaceholder')}
                value={field.value}
                onChange={(value) => {
                  clearField('production-order-number');
                  field.onChange(value);
                }}
                error={Boolean(getError('production-order-number'))}
                helperText={getError('production-order-number')}
              />
            )}
          />
          <Controller
            name="productId"
            control={control}
            render={({ field }) => (
              <FormSelectField
                id="production-order-product"
                label={t('productionOrders.form.productLabel')}
                value={field.value}
                onChange={(value) => {
                  clearField('production-order-product');
                  field.onChange(value);
                }}
                options={productOptions}
                error={Boolean(getError('production-order-product'))}
                helperText={getError('production-order-product')}
              />
            )}
          />
        </FormRow>

        <FormRow>
          <Controller
            name="qtdDisplay"
            control={control}
            render={({ field }) => (
              <FormTextField
                id="production-order-q"
                label={t('productionOrders.form.qLabel')}
                placeholder={t('productionOrders.form.qPlaceholder')}
                value={field.value}
                onChange={(value) => {
                  clearField('production-order-q');
                  field.onChange(sanitizeDecimalInput(value));
                }}
                inputMode="decimal"
                error={Boolean(getError('production-order-q'))}
                helperText={getError('production-order-q')}
              />
            )}
          />
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <FormTextField
                id="production-order-start-date"
                label={t('productionOrders.form.startDateLabel')}
                placeholder={t('productionOrders.form.datePlaceholder')}
                value={field.value}
                onChange={(value) => {
                  clearField('production-order-planned-end-date');
                  field.onChange(value);
                }}
                type="date"
              />
            )}
          />
        </FormRow>

        <FormRow>
          <Controller
            name="plannedEndDate"
            control={control}
            render={({ field }) => (
              <FormTextField
                id="production-order-planned-end-date"
                label={t('productionOrders.form.plannedEndDateLabel')}
                placeholder={t('productionOrders.form.datePlaceholder')}
                value={field.value}
                onChange={(value) => {
                  clearField('production-order-planned-end-date');
                  field.onChange(value);
                }}
                type="date"
                error={Boolean(getError('production-order-planned-end-date'))}
                helperText={getError('production-order-planned-end-date')}
              />
            )}
          />
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <FormTextField
                id="production-order-notes"
                label={t('productionOrders.form.notesLabel')}
                placeholder={t('productionOrders.form.notesPlaceholder')}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </FormRow>

        <ValidationAlert>
          <InfoOutlined
            sx={{ color: theme.palette.produza.primary, fontSize: 24 }}
          />
          <div>
            <ValidationAlertTitle>
              {t('productionOrders.form.validationTitle')}
            </ValidationAlertTitle>
            <ValidationAlertText>
              {t('productionOrders.form.validationText')}
            </ValidationAlertText>
          </div>
        </ValidationAlert>

        <FormActions>
          <CancelButton type="button" onClick={onCancel} disabled={isSubmitting}>
            {t('productionOrders.form.cancel')}
          </CancelButton>
          <SaveButton
            type="submit"
            variant="contained"
            disableElevation
            startIcon={<SaveOutlined />}
            disabled={isSubmitting || isLoadingProducts}
          >
            {isSubmitting
              ? t('productionOrders.form.saving')
              : t('productionOrders.form.save')}
          </SaveButton>
        </FormActions>
      </FormBody>
    </FormCard>
  );
}

export function ProductionOrderForm(props: ProductionOrderFormProps) {
  return (
    <FormValidationProvider>
      <ProductionOrderFormFields {...props} />
    </FormValidationProvider>
  );
}

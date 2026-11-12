import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { FormSelectField, FormTextField } from '@/shared/components/form';
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
  errorMessage?: string | null;
};

const defaultValues: ProductionOrderFormValues = {
  number: '',
  productId: '',
  qtdDisplay: '',
  startDate: '',
  plannedEndDate: '',
  notes: '',
};

export function ProductionOrderForm({
  onSubmit,
  onCancel,
  initialValues,
  isSubmitting = false,
  errorMessage = null,
}: ProductionOrderFormProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { control, handleSubmit } = useForm<ProductionOrderFormValues>({
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

  const displayError =
    errorMessage === 'UNEXPECTED'
      ? t('productionOrders.errors.unexpected')
      : errorMessage;

  const displayProductsError =
    productsError === 'UNEXPECTED'
      ? t('productionOrders.errors.unexpected')
      : productsError;

  const submitForm = handleSubmit((values) => {
    const qtdAProduzir = parseDecimalInput(values.qtdDisplay);
    const startDate = values.startDate.trim();
    const plannedEndDate = values.plannedEndDate.trim();

    if (
      !values.number.trim() ||
      !values.productId ||
      !Number.isFinite(qtdAProduzir) ||
      !(qtdAProduzir > 0)
    ) {
      return;
    }

    if (startDate && plannedEndDate && startDate > plannedEndDate) {
      return;
    }

    void onSubmit({
      number: values.number.trim(),
      productId: values.productId,
      qtdAProduzir,
      ...(startDate ? { startDate } : {}),
      ...(plannedEndDate ? { plannedEndDate } : {}),
      ...(values.notes.trim() ? { notes: values.notes.trim() } : {}),
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
                onChange={field.onChange}
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
                onChange={field.onChange}
                options={productOptions}
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
                onChange={(value) => field.onChange(sanitizeDecimalInput(value))}
                inputMode="decimal"
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
                onChange={field.onChange}
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
                onChange={field.onChange}
                type="date"
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
            disabled={isSubmitting || isLoadingProducts || products.length === 0}
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

import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ApiError } from '@/core/api';
import { PageSubtitle, PageTitle } from '@/shared/components/page';
import {
  ProductForm,
  type ProductFormSubmitValues,
} from '@/features/products/components/form/ProductForm';
import { useProductsContext } from '@/features/products/context/ProductsContext';
import {
  PageHeader,
  PageRoot,
} from '@/features/products/pages/ProductFormPage.styled';

export function ProductCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { createProduct } = useProductsContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCancel = useCallback(() => {
    navigate('/products');
  }, [navigate]);

  const handleSubmit = useCallback(
    async (values: ProductFormSubmitValues) => {
      setIsSubmitting(true);
      setErrorMessage(null);
      try {
        await createProduct(values);
        navigate('/products');
      } catch (error) {
        setErrorMessage(error instanceof ApiError ? error.message : 'UNEXPECTED');
      } finally {
        setIsSubmitting(false);
      }
    },
    [createProduct, navigate]
  );

  return (
    <PageRoot>
      <PageHeader>
        <PageTitle>{t('products.form.title')}</PageTitle>
        <PageSubtitle>{t('products.form.subtitle')}</PageSubtitle>
      </PageHeader>

      <ProductForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        errorMessage={errorMessage}
      />
    </PageRoot>
  );
}

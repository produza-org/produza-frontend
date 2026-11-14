import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import i18n from '@/i18n';
import { renderWithTheme } from '@/test/renderWithTheme';
import { ToastProvider } from '@/shared/toast';
import type { ProductCreateWizardSaveInput } from '@/features/products/components/create/ProductCreateWizard';

const navigateMock = vi.fn();
const createProductMock = vi.fn();
const upsertProductRecipeMock = vi.fn();
const listAllRawMaterialsMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom'
  );
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock('@/features/products/context/ProductsContext', () => ({
  useProductsContext: () => ({
    createProduct: createProductMock,
  }),
}));

vi.mock('@/features/products/api', () => ({
  upsertProductRecipe: (...args: unknown[]) => upsertProductRecipeMock(...args),
}));

vi.mock('@/features/raw-materials/api', () => ({
  listAllRawMaterials: () => listAllRawMaterialsMock(),
}));

vi.mock('@/features/products/components/create/ProductCreateWizard', () => ({
  ProductCreateWizard: ({
    onSave,
    isSubmitting,
  }: {
    onSave: (input: ProductCreateWizardSaveInput) => void | Promise<void>;
    isSubmitting?: boolean;
  }) => (
    <button
      type="button"
      disabled={isSubmitting}
      onClick={() =>
        void onSave({
          general: {
            name: 'POTE 1,5L COCO BRANCO',
            finalSize: 1.5,
            finalSizeUnit: 'L',
            yield: 0.75,
          },
          recipe: {
            lines: [
              {
                rawMaterialId: 'm-1',
                proportion: 1,
                sortOrder: 0,
              },
            ],
          },
        })
      }
    >
      Trigger save
    </button>
  ),
}));

import { ProductCreatePage } from './ProductCreatePage';

describe('ProductCreatePage', () => {
  beforeEach(() => {
    i18n.changeLanguage('en');
    navigateMock.mockReset();
    createProductMock.mockReset();
    upsertProductRecipeMock.mockReset();
    listAllRawMaterialsMock.mockReset();
    listAllRawMaterialsMock.mockResolvedValue([]);
    createProductMock.mockResolvedValue({
      id: 'product-1',
      name: 'POTE 1,5L COCO BRANCO',
      finalSize: 1.5,
      finalSizeUnit: 'L',
      yield: 0.75,
      expansionFactor: 1.3333333333,
      status: 'active',
    });
    upsertProductRecipeMock.mockResolvedValue({
      productId: 'product-1',
      lines: [],
    });
  });

  it('creates the product then upserts the recipe in order', async () => {
    const callOrder: string[] = [];
    createProductMock.mockImplementation(async () => {
      callOrder.push('create');
      return {
        id: 'product-1',
        name: 'POTE 1,5L COCO BRANCO',
        finalSize: 1.5,
        finalSizeUnit: 'L',
        yield: 0.75,
        expansionFactor: 1.3333333333,
        status: 'active',
      };
    });
    upsertProductRecipeMock.mockImplementation(async () => {
      callOrder.push('upsert');
      return { productId: 'product-1', lines: [] };
    });

    renderWithTheme(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <ToastProvider>
            <ProductCreatePage />
          </ToastProvider>
        </I18nextProvider>
      </MemoryRouter>
    );

    fireEvent.click(await screen.findByRole('button', { name: 'Trigger save' }));

    await waitFor(() => {
      expect(createProductMock).toHaveBeenCalledWith({
        name: 'POTE 1,5L COCO BRANCO',
        finalSize: 1.5,
        finalSizeUnit: 'L',
        yield: 0.75,
      });
      expect(upsertProductRecipeMock).toHaveBeenCalledWith('product-1', {
        lines: [
          {
            rawMaterialId: 'm-1',
            proportion: 1,
            sortOrder: 0,
          },
        ],
      });
      expect(callOrder).toEqual(['create', 'upsert']);
      expect(navigateMock).toHaveBeenCalledWith('/products');
    });
  });

  it('retries only the recipe upsert after product creation already succeeded', async () => {
    createProductMock
      .mockResolvedValueOnce({
        id: 'product-1',
        name: 'POTE 1,5L COCO BRANCO',
        finalSize: 1.5,
        finalSizeUnit: 'L',
        yield: 0.75,
        expansionFactor: 1.3333333333,
        status: 'active',
      })
      .mockResolvedValueOnce({
        id: 'product-2',
        name: 'SHOULD NOT CREATE',
        finalSize: 1,
        finalSizeUnit: 'L',
        yield: 1,
        expansionFactor: 1,
        status: 'active',
      });
    upsertProductRecipeMock
      .mockRejectedValueOnce(new Error('recipe failed'))
      .mockResolvedValueOnce({ productId: 'product-1', lines: [] });

    renderWithTheme(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <ToastProvider>
            <ProductCreatePage />
          </ToastProvider>
        </I18nextProvider>
      </MemoryRouter>
    );

    const saveButton = await screen.findByRole('button', { name: 'Trigger save' });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(createProductMock).toHaveBeenCalledTimes(1);
      expect(upsertProductRecipeMock).toHaveBeenCalledTimes(1);
    });

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(createProductMock).toHaveBeenCalledTimes(1);
      expect(upsertProductRecipeMock).toHaveBeenCalledTimes(2);
      expect(upsertProductRecipeMock).toHaveBeenLastCalledWith('product-1', {
        lines: [
          {
            rawMaterialId: 'm-1',
            proportion: 1,
            sortOrder: 0,
          },
        ],
      });
      expect(navigateMock).toHaveBeenCalledWith('/products');
    });
  });
});

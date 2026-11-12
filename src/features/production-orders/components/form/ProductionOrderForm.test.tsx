import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { renderWithTheme } from '@/test/renderWithTheme';
import { ProductionOrderForm } from './ProductionOrderForm';

const listProductsWithRecipeMock = vi.fn();

vi.mock('@/features/production-orders/utils/products-with-recipe', () => ({
  listProductsWithRecipe: (...args: unknown[]) =>
    listProductsWithRecipeMock(...args),
}));

function renderForm(onSubmit = vi.fn(), onCancel = vi.fn()) {
  return renderWithTheme(
    <I18nextProvider i18n={i18n}>
      <ProductionOrderForm onSubmit={onSubmit} onCancel={onCancel} />
    </I18nextProvider>
  );
}

describe('ProductionOrderForm', () => {
  beforeEach(() => {
    i18n.changeLanguage('en');
    listProductsWithRecipeMock.mockReset();
    listProductsWithRecipeMock.mockResolvedValue([
      {
        id: 'p-1',
        name: 'POTE 1,5L COCO BRANCO',
        finalSize: 1.5,
        finalSizeUnit: 'L',
        yield: 0.75,
        expansionFactor: 1.3333333333333333,
        status: 'active',
      },
    ]);
  });

  it('loads products with recipe and submits create payload', async () => {
    const onSubmit = vi.fn();
    renderForm(onSubmit);

    await waitFor(() => {
      expect(
        screen.getByRole('combobox', { name: 'Product' })
      ).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Order number'), {
      target: { value: '108' },
    });
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Product' }));
    fireEvent.click(await screen.findByRole('option', { name: 'POTE 1,5L COCO BRANCO' }));
    fireEvent.change(screen.getByLabelText('Quantity to produce (Q)'), {
      target: { value: '27' },
    });
    fireEvent.change(screen.getByLabelText('Start date'), {
      target: { value: '2026-11-12' },
    });
    fireEvent.change(screen.getByLabelText('Planned end date'), {
      target: { value: '2026-11-13' },
    });
    fireEvent.change(screen.getByLabelText('Notes'), {
      target: { value: 'Demo OP 108' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create order' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        number: '108',
        productId: 'p-1',
        qtdAProduzir: 27,
        startDate: '2026-11-12',
        plannedEndDate: '2026-11-13',
        notes: 'Demo OP 108',
      });
    });
  });

  it('calls onCancel when cancel is clicked', async () => {
    const onCancel = vi.fn();
    renderForm(vi.fn(), onCancel);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeEnabled();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalled();
  });
});

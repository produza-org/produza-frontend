import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { renderWithTheme } from '@/test/renderWithTheme';
import type { ProductionOrder } from '@/features/production-orders/types/production-order';
import { ProductionOrderDetail } from './ProductionOrderDetail';

const order: ProductionOrder = {
  id: 'op-1',
  number: '108',
  productId: 'p-1',
  product: {
    id: 'p-1',
    name: 'POTE 1,5L COCO BRANCO',
    yield: 0.75,
  },
  qtdAProduzir: 27,
  yieldSnapshot: 0.75,
  totalMisturaKg: 20.25,
  emitidaEm: '2026-11-12T03:00:00.000Z',
  startDate: '2026-11-12',
  plannedEndDate: '2026-11-13',
  notes: 'Demo OP 108',
  needLines: [
    {
      id: 'n-1',
      category: 'COMPONENTE',
      rawMaterialId: 'rm-1',
      rawMaterialCode: 'MP-006',
      rawMaterialName: 'ÁGUA',
      unit: 'LITRO',
      unitConsumptionSnapshot: 0.42,
      quantityE: 8.505,
      sortOrder: 0,
    },
    {
      id: 'n-2',
      category: 'EMBALAGEM',
      rawMaterialId: 'rm-2',
      rawMaterialCode: 'MP-EMB-POTE',
      rawMaterialName: 'POTE',
      unit: 'UNID',
      unitConsumptionSnapshot: 1,
      quantityE: 27,
      sortOrder: 0,
    },
  ],
};

describe('ProductionOrderDetail', () => {
  beforeEach(() => {
    i18n.changeLanguage('en');
  });

  it('renders header, categories, and QTD. LOTE values', () => {
    renderWithTheme(
      <I18nextProvider i18n={i18n}>
        <ProductionOrderDetail
          order={order}
          onUpdateQ={vi.fn()}
          onRecalculate={vi.fn()}
        />
      </I18nextProvider>
    );

    expect(screen.getByText('108')).toBeInTheDocument();
    expect(screen.getByText('POTE 1,5L COCO BRANCO')).toBeInTheDocument();
    expect(screen.getByText('MP-006')).toBeInTheDocument();
    expect(screen.getByText('8,505')).toBeInTheDocument();
    expect(screen.getByText('MP-EMB-POTE')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Update Q' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Recalculate from recipe' })
    ).toBeInTheDocument();
  });

  it('patches Q when save is clicked with a new value', () => {
    const onUpdateQ = vi.fn();
    renderWithTheme(
      <I18nextProvider i18n={i18n}>
        <ProductionOrderDetail
          order={order}
          onUpdateQ={onUpdateQ}
          onRecalculate={vi.fn()}
        />
      </I18nextProvider>
    );

    fireEvent.change(screen.getByLabelText('Quantity to produce (Q)'), {
      target: { value: '54' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Update Q' }));

    expect(onUpdateQ).toHaveBeenCalledWith(54);
  });

  it('calls recalculate handler', () => {
    const onRecalculate = vi.fn();
    renderWithTheme(
      <I18nextProvider i18n={i18n}>
        <ProductionOrderDetail
          order={order}
          onUpdateQ={vi.fn()}
          onRecalculate={onRecalculate}
        />
      </I18nextProvider>
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Recalculate from recipe' })
    );

    expect(onRecalculate).toHaveBeenCalled();
  });
});

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
  realProduzido: 0,
  yieldSnapshot: 0.75,
  totalMisturaKg: 20.25,
  plannedMinutesTotal: 320,
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
  steps: [
    {
      id: 's-1',
      name: 'SEPARAÇÃO',
      plannedMinutes: 40,
      assignee: null,
      sortOrder: 0,
    },
    {
      id: 's-2',
      name: 'PREPARAÇÃO',
      plannedMinutes: 35,
      assignee: 'Maria',
      sortOrder: 1,
    },
    {
      id: 's-3',
      name: 'MATURAÇÃO',
      plannedMinutes: 120,
      assignee: null,
      sortOrder: 2,
    },
    {
      id: 's-4',
      name: 'SABORIZAÇÃO',
      plannedMinutes: 50,
      assignee: null,
      sortOrder: 3,
    },
    {
      id: 's-5',
      name: 'ENVASE',
      plannedMinutes: 60,
      assignee: null,
      sortOrder: 4,
    },
    {
      id: 's-6',
      name: 'ESTEIRA / EMBALAGEM',
      plannedMinutes: 15,
      assignee: null,
      sortOrder: 5,
    },
  ],
};

const detailHandlers = {
  onUpdateQ: vi.fn(),
  onUpdateReal: vi.fn(),
  onUpdateSteps: vi.fn(),
  onRecalculate: vi.fn(),
};

describe('ProductionOrderDetail', () => {
  beforeEach(() => {
    i18n.changeLanguage('en');
    detailHandlers.onUpdateQ = vi.fn();
    detailHandlers.onUpdateReal = vi.fn();
    detailHandlers.onUpdateSteps = vi.fn();
    detailHandlers.onRecalculate = vi.fn();
  });

  it('renders header, categories, steps, and QTD. LOTE values', () => {
    renderWithTheme(
      <I18nextProvider i18n={i18n}>
        <ProductionOrderDetail order={order} {...detailHandlers} />
      </I18nextProvider>
    );

    expect(screen.getByText('108')).toBeInTheDocument();
    expect(screen.getByText('POTE 1,5L COCO BRANCO')).toBeInTheDocument();
    expect(screen.getByText('MP-006')).toBeInTheDocument();
    expect(screen.getByText('8,505')).toBeInTheDocument();
    expect(screen.getByText('MP-EMB-POTE')).toBeInTheDocument();
    expect(screen.getByDisplayValue('SEPARAÇÃO')).toBeInTheDocument();
    expect(screen.getByText('Planned load: 320 min')).toBeInTheDocument();
    expect(
      screen.getByText('Variation (real − Q): -27')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Update Q' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Recalculate from recipe' })
    ).toBeInTheDocument();
  });

  it('patches Q when save is clicked with a new value', () => {
    renderWithTheme(
      <I18nextProvider i18n={i18n}>
        <ProductionOrderDetail order={order} {...detailHandlers} />
      </I18nextProvider>
    );

    fireEvent.change(screen.getByLabelText('Quantity to produce (Q)'), {
      target: { value: '54' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Update Q' }));

    expect(detailHandlers.onUpdateQ).toHaveBeenCalledWith(54);
  });

  it('calls recalculate handler', () => {
    renderWithTheme(
      <I18nextProvider i18n={i18n}>
        <ProductionOrderDetail order={order} {...detailHandlers} />
      </I18nextProvider>
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Recalculate from recipe' })
    );

    expect(detailHandlers.onRecalculate).toHaveBeenCalled();
  });

  it('saves realProduzido and keeps need lines visible', () => {
    renderWithTheme(
      <I18nextProvider i18n={i18n}>
        <ProductionOrderDetail order={order} {...detailHandlers} />
      </I18nextProvider>
    );

    fireEvent.change(screen.getByLabelText('Actual produced (real)'), {
      target: { value: '30' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Update actual' }));

    expect(detailHandlers.onUpdateReal).toHaveBeenCalledWith(30);
    expect(screen.getByText('MP-006')).toBeInTheDocument();
    expect(screen.getByText('8,505')).toBeInTheDocument();
  });

  it('saves edited steps without clearing need lines', () => {
    renderWithTheme(
      <I18nextProvider i18n={i18n}>
        <ProductionOrderDetail order={order} {...detailHandlers} />
      </I18nextProvider>
    );

    fireEvent.change(screen.getByDisplayValue('40'), {
      target: { value: '42' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save steps' }));

    expect(detailHandlers.onUpdateSteps).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: 's-1',
          name: 'SEPARAÇÃO',
          plannedMinutes: 42,
          sortOrder: 0,
        }),
      ])
    );
    expect(screen.getByText('MP-EMB-POTE')).toBeInTheDocument();
  });
});
